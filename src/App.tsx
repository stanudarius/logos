import React, { useState, useEffect, useCallback, useRef } from "react";
import { AnimatePresence } from "motion/react";

import { INITIAL_FEED_CARDS } from "./data/feedCards";
import type { FeedCard, SavedVaultCard } from "./types";
import { getMoodAesthetic } from "./utils/aesthetics";
import { mapStackToFeedCards } from "./utils/cardMapper";
import Toast from "./components/Toast";
import PhoneEmulator from "./components/PhoneEmulator";
import { AuthScreen } from "./components/AuthScreen";
import { ConstellationMap } from "./components/ConstellationMap";
import ZenMode from "./components/ZenMode";
import { supabase } from "./lib/supabase";
import type { Session } from "@supabase/supabase-js";

export default function App() {
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [feedCards, setFeedCards] = useState<FeedCard[]>(() => {
    const groups: Record<string, FeedCard[]> = {};
    INITIAL_FEED_CARDS.forEach(card => {
      if (!groups[card.philosopher]) groups[card.philosopher] = [];
      groups[card.philosopher].push(card);
    });
    const shuffledPhilosophers = Object.keys(groups).sort(() => Math.random() - 0.5);
    return shuffledPhilosophers.flatMap(p => groups[p]);
  });
  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const [phoneTab, setPhoneTab] = useState<"explore" | "vault">("explore");
  const [isFetchingInfinite, setIsFetchingInfinite] = useState(false);
  const [isConstellationOpen, setIsConstellationOpen] = useState(false);
  const [isZenModeOpen, setIsZenModeOpen] = useState(false);

  const [session, setSession] = useState<Session | null>(null);

  const [savedVaultCards, setSavedVaultCards] = useState<SavedVaultCard[]>([]);

  // Rabbit Hole Algorithm: Ephemeral Session Tracking
  const sessionInterests = useRef<Record<string, number>>({});

  const trackCardInteraction = useCallback((index: number, weight: number) => {
    setFeedCards(currentFeed => {
      const card = currentFeed[index];
      if (card) {
        sessionInterests.current[card.philosopher] = (sessionInterests.current[card.philosopher] || 0) + weight;
        sessionInterests.current[card.topic] = (sessionInterests.current[card.topic] || 0) + weight;
      }
      return currentFeed;
    });
  }, []);

  const handleOpenDeepDive = useCallback((index: number) => {
    trackCardInteraction(index, 2);
  }, [trackCardInteraction]);

  const handleOpenChat = useCallback((index: number) => {
    trackCardInteraction(index, 2);
  }, [trackCardInteraction]);


  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!session?.user) return;

    const fetchData = async () => {
      const { data: profile } = await supabase.from('profiles').select('id').eq('id', session.user.id).single();
      if (!profile) {
        await supabase.from('profiles').insert([{ id: session.user.id }]);
      }

      const { data: vault } = await supabase.from('vault_cards').select('*').eq('user_id', session.user.id);
      if (vault) {
        setSavedVaultCards(vault.map(row => row.card_data as SavedVaultCard));
      }
    };

    fetchData();
  }, [session]);


  const triggerToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2800);
  }, []);

  const fetchInfiniteFeed = useCallback(async () => {
    if (isFetchingInfinite) return;
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
      if (response.ok) {
        const data = await response.json();
        const newFeedItems = mapStackToFeedCards(data);
        setFeedCards(prev => [...prev, ...newFeedItems]);
      }
    } catch (err: unknown) {
      console.error(err);
      triggerToast("Failed to fetch next sequence.");
    } finally {
      setIsFetchingInfinite(false);
    }
  }, [isFetchingInfinite, triggerToast]);

  /** Active card tracking — driven by ThoughtStream's IntersectionObserver */
  const handleActiveCardChange = useCallback((index: number) => {
    setActiveCardIndex(index);
  }, []);

  const isCardSavedInVault = useCallback((slideIdx: number) => {
    const ac = feedCards[slideIdx];
    if (!ac) return false;
    return savedVaultCards.some(saved => saved.id === ac.id);
  }, [feedCards, savedVaultCards]);

  const toggleSaveToVault = useCallback(async (index: number) => {
    if (!session?.user) return;

    const card = feedCards[index] || INITIAL_FEED_CARDS[0];
    const isSaved = savedVaultCards.some(c => c.id === card.id);

    if (isSaved) {
      setSavedVaultCards(prev => prev.filter(c => c.id !== card.id));
      triggerToast("Removed from Vault");
      await supabase.from('vault_cards').delete().eq('user_id', session.user.id).eq('card_id', card.id);
    } else {
      const vaultCard: SavedVaultCard = {
        ...card,
        date_added: new Date().toISOString()
      };
      setSavedVaultCards(prev => [...prev, vaultCard]);
      trackCardInteraction(index, 3); // High signal for saving
      triggerToast("Saved to Corkboard.");
      await supabase.from('vault_cards').insert([{
        user_id: session.user.id,
        card_id: vaultCard.id,
        card_data: vaultCard
      }]);
    }
  }, [feedCards, savedVaultCards, triggerToast, session]);

  const deleteFromVault = useCallback(async (id: string) => {
    if (!session?.user) return;

    setSavedVaultCards(prev => prev.filter(c => c.id !== id));
    triggerToast("Card removed from vault.");

    await supabase.from('vault_cards').delete().eq('user_id', session.user.id).eq('card_id', id);
  }, [triggerToast, savedVaultCards.length, session]);

  const updateVaultCardAnnotation = useCallback(async (id: string, annotation: string) => {
    setSavedVaultCards(prev => prev.map(c => c.id === id ? { ...c, annotation } : c));
    
    if (session?.user) {
      // Find the updated card to sync to supabase
      const updatedCard = savedVaultCards.find(c => c.id === id);
      if (updatedCard) {
        const newCardData = { ...updatedCard, annotation };
        await supabase.from('vault_cards').update({ card_data: newCardData }).eq('user_id', session.user.id).eq('card_id', id);
      }
    }
  }, [savedVaultCards, session]);

  const assignToFolder = useCallback(async (id: string, folderName: string | undefined) => {
    let newCardData: SavedVaultCard | undefined;
    
    setSavedVaultCards(prev => prev.map(c => {
      if (c.id === id) {
        newCardData = { ...c, user_folder: folderName };
        return newCardData;
      }
      return c;
    }));
    
    // We defer the Supabase call slightly to ensure the local state map created the object
    setTimeout(async () => {
      if (session?.user && newCardData) {
        await supabase.from('vault_cards').update({ card_data: newCardData }).eq('user_id', session.user.id).eq('card_id', id);
      }
    }, 0);
    
    triggerToast(folderName ? `Moved to ${folderName}` : "Removed from folder");
  }, [session, triggerToast]);

  const handleZenSessionComplete = useCallback(() => {
    triggerToast("Zen session complete!");
  }, [triggerToast]);

  /**
   * Filter-by-Thinker: Re-sort feedCards so that cards matching
   * the selected philosopher bubble to the top. Non-matching cards
   * are preserved below for continued discovery.
   */
  const filterByThinker = useCallback((thinkerName: string) => {
    setFeedCards(prev => {
      const matching = prev.filter(c =>
        c.philosopher.toLowerCase().includes(thinkerName.toLowerCase())
      );
      const rest = prev.filter(c =>
        !c.philosopher.toLowerCase().includes(thinkerName.toLowerCase())
      );
      return [...matching, ...rest];
    });
    setPhoneTab("explore");
    triggerToast(`Filtered stream: ${thinkerName}`);
  }, [triggerToast]);

  const activeCard = feedCards[activeCardIndex] || INITIAL_FEED_CARDS[0];
  const activeAesthetic = getMoodAesthetic(activeCard?.visual_mood);

  if (!session) {
    return (
      <div className="w-full h-[100dvh] bg-[#0A0A0A] flex items-center justify-center overflow-hidden p-4 sm:p-8">
        <AuthScreen onLoginSuccess={() => { }} />
      </div>
    );
  }

  return (
    <div className="w-full h-[100dvh] bg-[#0A0A0A] flex items-center justify-center overflow-hidden p-0 sm:p-8">
      <div className="w-full sm:max-w-[420px] h-full flex flex-col items-center justify-center font-sans relative">
        <Toast message={toastMessage} />

        <PhoneEmulator
          phoneTab={phoneTab}
          currentDisplayCards={feedCards}
          activeCardIndex={activeCardIndex}
          activeAesthetic={activeAesthetic}
          isFetchingMore={isFetchingInfinite}
          savedVaultCards={savedVaultCards}
          onActiveCardChange={handleActiveCardChange}
          onFetchMore={fetchInfiniteFeed}
          onSetPhoneTab={setPhoneTab}
          onToggleSaveToVault={toggleSaveToVault}
          isCardSavedInVault={isCardSavedInVault}
          onDeleteFromVault={deleteFromVault}
          onTriggerToast={triggerToast}
          onOpenConstellation={() => setIsConstellationOpen(true)}
          onOpenZenMode={() => setIsZenModeOpen(true)}
          onUpdateVaultCardAnnotation={updateVaultCardAnnotation}
          onAssignToFolder={assignToFolder}
          onOpenDeepDive={handleOpenDeepDive}
          onOpenChat={handleOpenChat}
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
            aesthetic={activeAesthetic}
            onClose={() => setIsZenModeOpen(false)}
            onSessionComplete={handleZenSessionComplete}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
