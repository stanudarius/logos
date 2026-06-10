import React, { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { AnimatePresence } from "motion/react";

import { INITIAL_FEED_CARDS } from "./data/feedCards";
import { getRandomInterstitial } from "./data/interstitials";
import type { FeedCard, SavedVaultCard } from "./types";

import { mapStackToFeedCards } from "./utils/cardMapper";
import Toast from "./components/Toast";
import PhoneEmulator from "./components/PhoneEmulator";
import { AuthScreen } from "./components/AuthScreen";
import { ConstellationMap } from "./components/ConstellationMap";
import ZenMode from "./components/ZenMode";
import { supabase } from "./lib/supabase";
import type { Session } from "@supabase/supabase-js";
import { READING_TRAILS } from "./data/trailsData";
import trailsContentJson from "./data/trailsContent.json";

export default function App() {
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [feedCards, setFeedCards] = useState<FeedCard[]>(() => {
    const groups: Record<string, FeedCard[]> = {};
    INITIAL_FEED_CARDS.forEach(card => {
      if (!groups[card.philosopher]) groups[card.philosopher] = [];
      groups[card.philosopher].push(card);
    });
    const shuffledPhilosophers = Object.keys(groups).sort(() => Math.random() - 0.5);

    const initialFeed: FeedCard[] = [];
    shuffledPhilosophers.forEach((p, idx) => {
      initialFeed.push(...groups[p]);
      if (idx < shuffledPhilosophers.length - 1) {
        initialFeed.push(getRandomInterstitial());
      }
    });
    return initialFeed;
  });
  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const [phoneTab, setPhoneTab] = useState<"explore" | "vault" | "trails" | "trail-view">("explore");
  const [isFetchingInfinite, setIsFetchingInfinite] = useState(false);
  const [isConstellationOpen, setIsConstellationOpen] = useState(false);
  const [isZenModeOpen, setIsZenModeOpen] = useState(false);

  const [activeTrailCards, setActiveTrailCards] = useState<FeedCard[]>([]);

  const [session, setSession] = useState<Session | null>(null);

  const [savedVaultCards, setSavedVaultCards] = useState<SavedVaultCard[]>([]);

  // Rabbit Hole Algorithm: Ephemeral Session Tracking
  const sessionInterests = useRef<Record<string, number>>({});
  
  const feedCardsRef = useRef<FeedCard[]>(feedCards);
  feedCardsRef.current = feedCards; // Sync during render for O(1) instantaneous access

  const activeTrailCardsRef = useRef<FeedCard[]>(activeTrailCards);
  activeTrailCardsRef.current = activeTrailCards;

  const savedVaultCardsRef = useRef<SavedVaultCard[]>(savedVaultCards);
  savedVaultCardsRef.current = savedVaultCards;

  const trackCardInteraction = useCallback((index: number, weight: number) => {
    // Track from the current visible deck
    const currentDeck = phoneTab === "trail-view" ? activeTrailCardsRef.current : feedCardsRef.current;
    const card = currentDeck[index];
    if (card) {
      sessionInterests.current[card.philosopher] = (sessionInterests.current[card.philosopher] || 0) + weight;
      sessionInterests.current[card.topic] = (sessionInterests.current[card.topic] || 0) + weight;
    }
  }, [phoneTab]);

  const handleOpenDeepDive = useCallback((index: number) => {
    trackCardInteraction(index, 2);
  }, [trackCardInteraction]);

  const handleOpenChat = useCallback((index: number) => {
    trackCardInteraction(index, 2);
  }, [trackCardInteraction]);


  useEffect(() => {
    let isMounted = true;
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (isMounted) setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (isMounted) setSession(session);
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!session?.user) return;
    let isMounted = true;

    const fetchData = async () => {
      const { data: profile } = await supabase.from('profiles').select('id').eq('id', session.user.id).single();
      if (!profile) {
        await supabase.from('profiles').insert([{ id: session.user.id }]);
      }

      const { data: vault } = await supabase.from('vault_cards').select('*').eq('user_id', session.user.id);
      if (vault && isMounted) {
        setSavedVaultCards(vault.map(row => row.card_data as SavedVaultCard));
      }
    };

    fetchData();
    return () => { isMounted = false; };
  }, [session]);


  const triggerToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2800);
  }, []);

  const isFetchingInfiniteRef = useRef(false);

  const fetchInfiniteFeed = useCallback(async () => {
    // Disable infinite fetch on trails
    if (isFetchingInfiniteRef.current || phoneTab === "trail-view") return;
    
    isFetchingInfiniteRef.current = true;
    setIsFetchingInfinite(true);
    triggerToast("Discovering new ideas...");

    try {
      // Calculate top 3 interests
      const sortedInterests = Object.entries(sessionInterests.current)
        .sort((a, b) => (b[1] as number) - (a[1] as number))
        .slice(0, 3)
        .map(([topic]) => topic);

      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rawText: "RANDOM",
          rabbitHoleContext: sortedInterests.length > 0 ? sortedInterests : undefined
        }),
      });
      if (!response.ok) throw new Error(`Backend error: ${response.status}`);

      const data = await response.json();
      const newFeedItems = mapStackToFeedCards(data);
      
      setFeedCards(prev => {
        // Prevent back-to-back interstitials if the last card is already an interstitial
        const lastCard = prev[prev.length - 1];
        if (lastCard && lastCard.layoutVariant === "interstitial") {
          return [...prev, ...newFeedItems];
        }
        return [...prev, getRandomInterstitial(), ...newFeedItems];
      });
    } catch (err: unknown) {
      console.error(err);
      triggerToast("Failed to fetch next sequence.");
    } finally {
      isFetchingInfiniteRef.current = false;
      setIsFetchingInfinite(false);
    }
  }, [triggerToast, phoneTab]);

  /** Active card tracking — driven by ThoughtStream's IntersectionObserver */
  const handleActiveCardChange = useCallback((index: number) => {
    setActiveCardIndex(index);
  }, []);

  const savedVaultCardIds = useMemo(() => new Set(savedVaultCards.map(c => c.id)), [savedVaultCards]);

  const toggleSaveToVault = useCallback(async (index: number) => {
    if (!session?.user) return;

    const currentDeck = phoneTab === "trail-view" ? activeTrailCardsRef.current : feedCardsRef.current;
    const card = currentDeck[index] || INITIAL_FEED_CARDS[0];
    const isSaved = savedVaultCardsRef.current.some(c => c.id === card.id);

    if (isSaved) {
      const cardToRemove = savedVaultCardsRef.current.find(c => c.id === card.id);
      setSavedVaultCards(prev => prev.filter(c => c.id !== card.id));
      triggerToast("Removed from Vault");
      try {
        const { error } = await supabase.from('vault_cards').delete().eq('user_id', session.user.id).eq('card_id', card.id);
        if (error) throw error;
      } catch (err) {
        if (cardToRemove) setSavedVaultCards(prev => [...prev, cardToRemove]);
        triggerToast("Failed to remove. Try again.");
      }
    } else {
      const vaultCard: SavedVaultCard = {
        ...card,
        date_added: new Date().toISOString()
      };
      setSavedVaultCards(prev => [...prev, vaultCard]);
      trackCardInteraction(index, 3); // High signal for saving
      triggerToast("Saved to Vault.");
      try {
        const { error } = await supabase.from('vault_cards').insert([{
          user_id: session.user.id,
          card_id: vaultCard.id,
          card_data: vaultCard
        }]);
        if (error) throw error;
      } catch (err) {
        setSavedVaultCards(prev => prev.filter(c => c.id !== vaultCard.id));
        triggerToast("Failed to save. Try again.");
      }
    }
  }, [triggerToast, session, phoneTab, trackCardInteraction]);

  const deleteFromVault = useCallback(async (id: string) => {
    if (!session?.user) return;

    const cardToDelete = savedVaultCards.find(c => c.id === id);
    setSavedVaultCards(prev => prev.filter(c => c.id !== id));
    triggerToast("Card removed from vault.");

    try {
      const { error } = await supabase.from('vault_cards').delete().eq('user_id', session.user.id).eq('card_id', id);
      if (error) throw error;
    } catch (err) {
      if (cardToDelete) setSavedVaultCards(prev => [...prev, cardToDelete]);
      triggerToast("Failed to remove. Try again.");
    }
  }, [triggerToast, session, savedVaultCards]);

  const updateVaultCardAnnotation = useCallback(async (id: string, annotation: string) => {
    const cardToUpdate = savedVaultCards.find(c => c.id === id);
    if (!cardToUpdate) return;

    const newCardData = { ...cardToUpdate, annotation };
    setSavedVaultCards(prev => prev.map(c => c.id === id ? newCardData : c));

    if (session?.user) {
      try {
        const { error } = await supabase.from('vault_cards').update({ card_data: newCardData }).eq('user_id', session.user.id).eq('card_id', id);
        if (error) throw error;
      } catch (err) {
        setSavedVaultCards(prev => prev.map(c => c.id === id ? cardToUpdate : c));
        triggerToast("Failed to update annotation.");
      }
    }
  }, [savedVaultCards, session, triggerToast]);

  const assignToFolder = useCallback(async (id: string, folderName: string | undefined) => {
    const cardToUpdate = savedVaultCards.find(c => c.id === id);
    if (!cardToUpdate) return;

    const newCardData = { ...cardToUpdate, user_folder: folderName };
    setSavedVaultCards(prev => prev.map(c => c.id === id ? newCardData : c));
    triggerToast(folderName ? `Moved to ${folderName}` : "Removed from folder");

    if (session?.user) {
      try {
        const { error } = await supabase.from('vault_cards').update({ card_data: newCardData }).eq('user_id', session.user.id).eq('card_id', id);
        if (error) throw error;
      } catch (err) {
        setSavedVaultCards(prev => prev.map(c => c.id === id ? cardToUpdate : c));
        triggerToast("Failed to move folder.");
      }
    }
  }, [savedVaultCards, session, triggerToast]);

  const handleZenSessionComplete = useCallback(() => {
    triggerToast("Zen session complete!");
  }, [triggerToast]);

  const filterByThinker = useCallback((thinkerName: string) => {
    setFeedCards(prev => {
      let matching = prev.filter(c =>
        c.philosopher.toLowerCase().includes(thinkerName.toLowerCase())
      );
      
      // If the thinker isn't in the base feed, look for their curated Trail
      if (matching.length === 0) {
        const trail = READING_TRAILS.find(t => 
          t.thinkerIds.some(tid => 
            tid.toLowerCase() === thinkerName.toLowerCase() || 
            thinkerName.toLowerCase().includes(tid.toLowerCase()) ||
            tid.toLowerCase().includes(thinkerName.toLowerCase())
          )
        );
        if (trail) {
          const trailsContentMap = trailsContentJson as Record<string, FeedCard[]>;
          const trailCards = trailsContentMap[trail.id] || [];
          if (trailCards.length > 0) {
            matching = trailCards;
          }
        }
      }

      const rest = prev.filter(c =>
        !c.philosopher.toLowerCase().includes(thinkerName.toLowerCase())
      );
      
      // Prevent duplicates if they were just injected
      const matchingIds = new Set(matching.map(m => m.id));
      const restCleaned = rest.filter(c => !matchingIds.has(c.id));
      
      return [...matching, ...restCleaned];
    });
    setPhoneTab("explore");
    setActiveCardIndex(0);
    triggerToast(`Filtered stream: ${thinkerName}`);
  }, [triggerToast]);

  const handleStartTrail = useCallback((trailId: string) => {
    const trail = READING_TRAILS.find(t => t.id === trailId);
    if (!trail) return;

    const trailsContentMap = trailsContentJson as Record<string, FeedCard[]>;
    const trailCards = trailsContentMap[trailId] || [];

    if (trailCards.length === 0) {
      triggerToast(`Content not yet generated for ${trail.title}.`);
      return;
    }

    setActiveTrailCards(trailCards);
    setActiveCardIndex(0); 
    setPhoneTab("trail-view");
    triggerToast(`Started Trail: ${trail.title}`);
  }, [triggerToast]);

  const handleOpenConstellation = useCallback(() => setIsConstellationOpen(true), []);
  const handleOpenZenMode = useCallback(() => setIsZenModeOpen(true), []);

  const activeCard = feedCards[activeCardIndex] || INITIAL_FEED_CARDS[0];


  if (!session) {
    return (
      <div className="w-full h-[100dvh] bg-[#0A0A0A] flex items-center justify-center overflow-hidden p-4 sm:p-8">
        <Toast message={toastMessage} />
        <AuthScreen onLoginSuccess={() => { }} onTriggerToast={triggerToast} />
      </div>
    );
  }

  return (
    <div className="w-full h-[100dvh] bg-[#0A0A0A] flex items-center justify-center overflow-hidden p-0 sm:p-8">
      <div className="w-full sm:max-w-[420px] h-full flex flex-col items-center justify-center font-sans relative">
        <Toast message={toastMessage} />

        <PhoneEmulator
          phoneTab={phoneTab}
          currentDisplayCards={phoneTab === "trail-view" ? activeTrailCards : feedCards}
          activeCardIndex={activeCardIndex}

          isFetchingMore={isFetchingInfinite}
          savedVaultCards={savedVaultCards}
          onActiveCardChange={handleActiveCardChange}
          onFetchMore={fetchInfiniteFeed}
          onSetPhoneTab={setPhoneTab}
          onToggleSaveToVault={toggleSaveToVault}
          savedVaultCardIds={savedVaultCardIds}
          onDeleteFromVault={deleteFromVault}
          onTriggerToast={triggerToast}
          onOpenConstellation={handleOpenConstellation}
          onOpenZenMode={handleOpenZenMode}
          onUpdateVaultCardAnnotation={updateVaultCardAnnotation}
          onAssignToFolder={assignToFolder}
          onOpenDeepDive={handleOpenDeepDive}
          onOpenChat={handleOpenChat}
          onStartTrail={handleStartTrail}
        />
      </div>

      <AnimatePresence>
        {isConstellationOpen && (
          <ConstellationMap
            onClose={() => setIsConstellationOpen(false)}
            onFilterByThinker={filterByThinker}
          />
        )}
        {isZenModeOpen && (
          <ZenMode

            onClose={() => setIsZenModeOpen(false)}
            onSessionComplete={handleZenSessionComplete}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
