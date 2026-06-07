import React, { useState, useEffect, useMemo, useCallback } from "react";
import { AnimatePresence } from "motion/react";

import { INITIAL_FEED_CARDS } from "./data/feedCards";
import type { FeedCard, ContentStack, SavedVaultCard } from "./types";
import { getMoodAesthetic } from "./utils/aesthetics";
import { mapStackToFeedCards } from "./utils/cardMapper";
import Toast from "./components/Toast";
import PhoneEmulator from "./components/PhoneEmulator";
import { AuthScreen } from "./components/AuthScreen";
import { ConstellationMap } from "./components/ConstellationMap";
import { supabase } from "./lib/supabase";
import type { Session } from "@supabase/supabase-js";

export default function App() {
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [feedCards, setFeedCards] = useState<FeedCard[]>(INITIAL_FEED_CARDS);
  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const [phoneTab, setPhoneTab] = useState<"explore" | "vault">("explore");
  const [isFetchingInfinite, setIsFetchingInfinite] = useState(false);
  const [isConstellationOpen, setIsConstellationOpen] = useState(false);

  const [session, setSession] = useState<Session | null>(null);

  const [savedVaultCards, setSavedVaultCards] = useState<SavedVaultCard[]>([]);
  const [masteryPoints, setMasteryPoints] = useState<number>(120);
  const [activeStreak, setActiveStreak] = useState<number>(3);

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
      const { data: profile } = await supabase.from('profiles').select('*').eq('id', session.user.id).single();
      if (profile) {
        setMasteryPoints(profile.mastery_points || 120);
        setActiveStreak(profile.streak || 3);
      } else {
        await supabase.from('profiles').insert([{ id: session.user.id, mastery_points: 120, streak: 3 }]);
      }

      const { data: vault } = await supabase.from('vault_cards').select('*').eq('user_id', session.user.id);
      if (vault) {
        setSavedVaultCards(vault.map(row => row.card_data as SavedVaultCard));
      }
    };

    fetchData();
  }, [session]);

  const [vaultReviewIndex, setVaultReviewIndex] = useState(0);
  const [vRecallRevealed, setVRecallRevealed] = useState(false);
  const [reviewedCount, setReviewedCount] = useState(0);

  useEffect(() => { localStorage.setItem("logos_vault_cards", JSON.stringify(savedVaultCards)); }, [savedVaultCards]);
  useEffect(() => { localStorage.setItem("logos_mastery_points", masteryPoints.toString()); }, [masteryPoints]);
  useEffect(() => { localStorage.setItem("logos_streak", activeStreak.toString()); }, [activeStreak]);

  const triggerToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2800);
  }, []);

  const fetchInfiniteFeed = useCallback(async () => {
    if (isFetchingInfinite) return;
    setIsFetchingInfinite(true);
    triggerToast("Discovering new ideas...");

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rawText: "RANDOM" }),
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
        date_added: new Date().toISOString(),
        ease_factor: 2.5,
        interval: 1,
        next_review_date: new Date().toISOString(),
        review_count: 0
      };
      setSavedVaultCards(prev => [...prev, vaultCard]);
      triggerToast("Saved to Vault. Scheduled for spaced repetition.");
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

    if (vaultReviewIndex >= Math.max(1, savedVaultCards.length - 1)) {
      setVaultReviewIndex(0);
    }

    await supabase.from('vault_cards').delete().eq('user_id', session.user.id).eq('card_id', id);
  }, [triggerToast, vaultReviewIndex, savedVaultCards.length, session]);

  const submitReviewRating = useCallback((rating: "again" | "hard" | "easy") => {
    setVRecallRevealed(false);
    setReviewedCount(prev => prev + 1);

    if (rating === "easy") { setMasteryPoints(prev => prev + 25); triggerToast("Excellent recall! +25 xp"); }
    else if (rating === "hard") { setMasteryPoints(prev => prev + 10); triggerToast("Good reinforcement! +10 xp"); }
    else { triggerToast("Knowledge queued. Focus and re-trigger!"); }

    if (vaultReviewIndex < savedVaultCards.length - 1) {
      setVaultReviewIndex(prev => prev + 1);
    } else {
      setVaultReviewIndex(0);
      setActiveStreak(prev => prev + 1);
      triggerToast("Daily Spindle Active! Streak incremented.");
    }
  }, [triggerToast, vaultReviewIndex, savedVaultCards.length]);

  const handleRevealRecall = useCallback(() => setVRecallRevealed(true), []);

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
    <div className="w-full h-[100dvh] bg-[#0A0A0A] flex items-center justify-center overflow-hidden p-4 sm:p-8">
      <div className="w-full max-w-[420px] h-full flex flex-col items-center justify-center font-sans relative">
        <Toast message={toastMessage} />

        <PhoneEmulator
          phoneTab={phoneTab}
          currentDisplayCards={feedCards}
          activeAesthetic={activeAesthetic}
          isFetchingMore={isFetchingInfinite}
          savedVaultCards={savedVaultCards}
          vaultReviewIndex={vaultReviewIndex}
          vRecallRevealed={vRecallRevealed}
          reviewedCount={reviewedCount}
          masteryPoints={masteryPoints}
          onActiveCardChange={handleActiveCardChange}
          onFetchMore={fetchInfiniteFeed}
          onSetPhoneTab={setPhoneTab}
          onToggleSaveToVault={toggleSaveToVault}
          isCardSavedInVault={isCardSavedInVault}
          onDeleteFromVault={deleteFromVault}
          onRevealRecall={handleRevealRecall}
          onSubmitReviewRating={submitReviewRating}
          onTriggerToast={triggerToast}
          onOpenConstellation={() => setIsConstellationOpen(true)}
        />
      </div>

      <AnimatePresence>
        {isConstellationOpen && (
          <ConstellationMap
            onClose={() => setIsConstellationOpen(false)}
            onFilterByThinker={filterByThinker}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
