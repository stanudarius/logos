import { useState, useCallback, useRef } from "react";
import type { FeedCard } from "../types/feed";
import { getRandomInterstitial } from "../data/interstitials";
import { READING_TRAILS } from "../data/trailsData";

import { supabase } from "../lib/supabase";

export function useFeed(phoneTab: "explore" | "vault" | "trails" | "trail-view") {
  const [feedCards, setFeedCards] = useState<FeedCard[]>([]);
  const [activeTrailCards, setActiveTrailCards] = useState<FeedCard[]>([]);
  const [isFetchingInfinite, setIsFetchingInfinite] = useState(false);
  const [isFeedExhausted, setIsFeedExhausted] = useState(false);

  const feedCardsRef = useRef<FeedCard[]>(feedCards);
  feedCardsRef.current = feedCards;
  const activeTrailCardsRef = useRef<FeedCard[]>(activeTrailCards);
  activeTrailCardsRef.current = activeTrailCards;

  const sessionInterests = useRef<Record<string, number>>({});
  const isFetchingInfiniteRef = useRef(false);
  const feedExhaustedRef = useRef(false);
  
  const trackCardInteraction = useCallback((index: number, weight: number) => {
    const currentDeck = phoneTab === "trail-view" ? activeTrailCardsRef.current : feedCardsRef.current;
    const card = currentDeck[index];
    if (card) {
      sessionInterests.current[card.philosopher] = (sessionInterests.current[card.philosopher] || 0) + weight;
      sessionInterests.current[card.topic] = (sessionInterests.current[card.topic] || 0) + weight;
    }
  }, [phoneTab]);

  const fetchInfiniteFeed = useCallback(async () => {
    if (isFetchingInfiniteRef.current || phoneTab === "trail-view" || feedExhaustedRef.current) return;
    isFetchingInfiniteRef.current = true;
    setIsFetchingInfinite(true);

    try {
      const sortedInterests = Object.entries(sessionInterests.current)
        .sort((a, b) => (b[1] as number) - (a[1] as number))
        .slice(0, 3)
        .map(([topic]) => topic);

      const seenIds = feedCardsRef.current
        .filter(c => c.layoutVariant !== "interstitial")
        .map(c => c.base_id || c.id);

      const { data: newFeedItems, error: invokeError } = await supabase.functions.invoke('generate', {
        body: {
          rabbitHoleContext: sortedInterests.length > 0 ? sortedInterests : undefined,
          seenIds
        }
      });
      
      if (invokeError) {
         if (invokeError.message?.includes('Feed exhausted') || invokeError.context?.status === 404) {
             feedExhaustedRef.current = true;
             setIsFeedExhausted(true);
             setIsFetchingInfinite(false);
             isFetchingInfiniteRef.current = false;
             return;
         }
         throw invokeError;
      }

      if (!newFeedItems) throw new Error("No data returned from edge function");

      setFeedCards(prev => {
        const newFeed = [...prev];
        let currentCount = prev.filter(c => c.layoutVariant !== "interstitial").length;
        
        newFeedItems.forEach(card => {
          newFeed.push(card);
          currentCount++;
          if (currentCount % 4 === 0) {
            newFeed.push(getRandomInterstitial());
          }
        });
        feedCardsRef.current = newFeed;
        return newFeed;
      });
    } catch (err: unknown) {
      console.error(err);
    } finally {
      isFetchingInfiniteRef.current = false;
      setIsFetchingInfinite(false);
    }
  }, [phoneTab]);

  const handleStartTrail = useCallback(async (trailId: string) => {
    const trail = READING_TRAILS.find(t => t.id === trailId);
    if (!trail) return false;

    try {
      const { data: trailCards, error } = await supabase
        .from('feed_cards')
        .select('*')
        .eq('stack_id', trailId);

      if (error) throw error;
      if (!trailCards || trailCards.length === 0) return false;
      
      // We restore layoutVariant from layout_variant for frontend compatibility
      const mappedCards = trailCards.map(c => ({...c, layoutVariant: c.layout_variant}));
      setActiveTrailCards(mappedCards);
      return true;
    } catch (err) {
       console.error("Failed to load trail:", err);
       return false;
    }
  }, []);

  return {
    feedCards,
    activeTrailCards,
    isFetchingInfinite,
    isFeedExhausted,
    trackCardInteraction,
    fetchInfiniteFeed,
    handleStartTrail,
    feedCardsRef,
    activeTrailCardsRef
  };
}
