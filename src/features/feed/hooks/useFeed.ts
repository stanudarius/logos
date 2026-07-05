import { useState, useCallback, useRef, useMemo, useEffect } from "react";
import type { FeedCard } from "@/src/features/feed/types";
import { getRandomInterstitial } from "@/src/data/interstitials";
import { READING_TRAILS } from "@/src/data/trailsData";

import { supabase } from "@/src/lib/supabase";

export function useFeed(phoneTab: "explore" | "vault" | "trails" | "trail-view") {
  const [feedCards, setFeedCards] = useState<FeedCard[]>([]);
  const [activeTrailCards, setActiveTrailCards] = useState<FeedCard[]>([]);
  const [isFetchingInfinite, setIsFetchingInfinite] = useState(false);
  const [isFeedExhausted, setIsFeedExhausted] = useState(false);
  const [isQuizSeeded, setIsQuizSeeded] = useState(false);

  const feedCardsRef = useRef<FeedCard[]>(feedCards);
  feedCardsRef.current = feedCards;
  const activeTrailCardsRef = useRef<FeedCard[]>(activeTrailCards);
  activeTrailCardsRef.current = activeTrailCards;

  const sessionInterests = useRef<Record<string, number>>({});
  const isFetchingInfiniteRef = useRef(false);
  const feedExhaustedRef = useRef(false);

  
  useEffect(() => {
    const seedFromQuiz = async () => {
      try {
        const localInterests = localStorage.getItem('sessionInterests');
        const hasSeeded = localStorage.getItem('quizSeeded');
        
        if (localInterests) {
          try {
             sessionInterests.current = JSON.parse(localInterests);
          } catch(e) {}
        }
        
        if (hasSeeded) {
          setIsQuizSeeded(true);
          return;
        }

        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.user) return;
        
        const { data } = await supabase
          .from('profiles')
          .select('quiz_preferences')
          .eq('id', session.user.id)
          .single();
          
        if (data?.quiz_preferences) {
          const prefs = data.quiz_preferences as Record<string, string>;
          const initialConcepts: string[] = [];
          
          if (prefs.failure === "fear" || prefs.intent === "hard_time") {
            initialConcepts.push("Stoicism", "Resilience", "Overcoming Adversity");
          }
          if (prefs.craving === "silence") {
            initialConcepts.push("Mindfulness", "Inner Peace", "Epictetus", "Buddhism");
          }
          if (prefs.craving === "ideas" || prefs.intent === "perspective") {
            initialConcepts.push("Metaphysics", "Existentialism", "Plato", "Nietzsche");
          }
          if (prefs.knowledge === "change_world") {
            initialConcepts.push("Ethics", "Action", "Sartre", "Simone de Beauvoir");
          }
          if (prefs.uncertainty === "embrace") {
            initialConcepts.push("Absurdism", "Albert Camus", "Existentialism");
          }
          
          initialConcepts.forEach(concept => {
            sessionInterests.current[concept] = (sessionInterests.current[concept] || 0) + 10;
          });
          
          localStorage.setItem('sessionInterests', JSON.stringify(sessionInterests.current));
          localStorage.setItem('quizSeeded', 'true');
        }
      } catch (err) {
        console.error("Failed to seed recommendations from quiz:", err);
      } finally {
        setIsQuizSeeded(true);
      }
    };
    
    seedFromQuiz();
  }, []);
  
  const trackCardInteraction = useCallback((index: number, weight: number) => {
    const currentDeck = phoneTab === "trail-view" ? activeTrailCardsRef.current : feedCardsRef.current;
    const card = currentDeck[index];
    if (card) {
      sessionInterests.current[card.philosopher] = (sessionInterests.current[card.philosopher] || 0) + weight;
      sessionInterests.current[card.topic] = (sessionInterests.current[card.topic] || 0) + weight;
      localStorage.setItem('sessionInterests', JSON.stringify(sessionInterests.current));
    }
  }, [phoneTab]);

  const fetchInfiniteFeed = useCallback(async () => {
    if (!isQuizSeeded || isFetchingInfiniteRef.current || phoneTab === "trail-view" || feedExhaustedRef.current) return;
    isFetchingInfiniteRef.current = true;
    setIsFetchingInfinite(true);

    try {
      const sortedInterests = Object.entries(sessionInterests.current)
        .sort((a, b) => (b[1] as number) - (a[1] as number))
        .slice(0, 3)
        .map(([topic]) => topic);

      const localSeenRaw = localStorage.getItem('seenCards');
      const localSeenIds: string[] = localSeenRaw ? JSON.parse(localSeenRaw) : [];
      
      const currentSeenIds = feedCardsRef.current
        .filter(c => c.layoutVariant !== "interstitial")
        .map(c => c.base_id || c.id);
        
      const seenIds = Array.from(new Set([...localSeenIds, ...currentSeenIds]));

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
        
        const localSeenRaw = localStorage.getItem('seenCards');
        const localSeenIds: string[] = localSeenRaw ? JSON.parse(localSeenRaw) : [];
        const newSeenIds = newFeed
          .filter(c => c.layoutVariant !== "interstitial")
          .map(c => c.base_id || c.id);
        
        localStorage.setItem('seenCards', JSON.stringify(Array.from(new Set([...localSeenIds, ...newSeenIds]))));
        
        return newFeed;
      });
    } catch (err: unknown) {
      console.error(err);
    } finally {
      isFetchingInfiniteRef.current = false;
      setIsFetchingInfinite(false);
    }
  }, [phoneTab, isQuizSeeded]);

  useEffect(() => {
    if (isQuizSeeded && feedCardsRef.current.length === 0 && phoneTab !== "trail-view") {
      fetchInfiniteFeed();
    }
  }, [isQuizSeeded, fetchInfiniteFeed, phoneTab]);

  const handleStartTrail = useCallback(async (trailId: string) => {
    const trail = READING_TRAILS.find(t => t.id === trailId);
    if (!trail) return false;

    try {
      const { data: trailCards, error } = await supabase
        .from('feed_cards')
        .select('*')
        .eq('stack_id', trailId)
        .order('id', { ascending: true });

      if (error) throw error;
      if (!trailCards || trailCards.length === 0) return false;
      
      const mappedCards = trailCards.map(c => ({...c, layoutVariant: c.layout_variant}));
      setActiveTrailCards(mappedCards);
      return true;
    } catch (err) {
       console.error("Failed to load trail:", err);
       return false;
    }
  }, []);

  return useMemo(() => ({
    feedCards,
    activeTrailCards,
    isFetchingInfinite,
    isFeedExhausted,
    trackCardInteraction,
    fetchInfiniteFeed,
    handleStartTrail,
    feedCardsRef,
    activeTrailCardsRef
  }), [
    feedCards,
    activeTrailCards,
    isFetchingInfinite,
    isFeedExhausted,
    trackCardInteraction,
    fetchInfiniteFeed,
    handleStartTrail
  ]);
}
