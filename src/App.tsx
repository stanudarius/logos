import React, { useState, useEffect, useMemo, useCallback } from "react";
import { AnimatePresence } from "motion/react";

// Data
import { INITIAL_FEED_CARDS } from "./data/feedCards";

// Types
import type { FeedCard, ContentStack, SavedVaultCard } from "./types";

// Utils
import { getMoodAesthetic } from "./utils/aesthetics";
import { mapStackToFeedCards } from "./utils/cardMapper";

// Components
import Toast from "./components/Toast";
import PhoneEmulator from "./components/PhoneEmulator";
import { AuthScreen } from "./components/AuthScreen";
import { ConstellationMap } from "./components/ConstellationMap";

// Supabase
import { supabase } from "./lib/supabase";
import type { Session } from "@supabase/supabase-js";

export default function App() {
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Mobile Emulation States
  const [selectedSlide, setSelectedSlide] = useState(0);
  const [feedCards, setFeedCards] = useState<FeedCard[]>(INITIAL_FEED_CARDS);
  const [slideDirection, setSlideDirection] = useState(1);
  const [previewVault, setPreviewVault] = useState(false);
  const [isDeepDive, setIsDeepDive] = useState(false);
  const [phoneTab, setPhoneTab] = useState<"explore" | "vault">("explore");
  const [isFetchingInfinite, setIsFetchingInfinite] = useState(false);
  const [isConstellationOpen, setIsConstellationOpen] = useState(false);

  // Supabase Session State
  const [session, setSession] = useState<Session | null>(null);

  // Vault State & Persistence
  const [savedVaultCards, setSavedVaultCards] = useState<SavedVaultCard[]>([]);
  const [masteryPoints, setMasteryPoints] = useState<number>(120);
  const [activeStreak, setActiveStreak] = useState<number>(3);

  // Initialize Supabase Auth
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

  // Fetch data when session loads
  useEffect(() => {
    if (!session?.user) return;

    const fetchData = async () => {
      // Fetch profile
      const { data: profile } = await supabase.from('profiles').select('*').eq('id', session.user.id).single();
      if (profile) {
        setMasteryPoints(profile.mastery_points || 120);
        setActiveStreak(profile.streak || 3);
      } else {
        await supabase.from('profiles').insert([{ id: session.user.id, mastery_points: 120, streak: 3 }]);
      }

      // Fetch vault
      const { data: vault } = await supabase.from('vault_cards').select('*').eq('user_id', session.user.id);
      if (vault) {
        setSavedVaultCards(vault.map(row => row.card_data as SavedVaultCard));
      }
    };

    fetchData();
  }, [session]);

  // Vault Spaced Repetition
  const [vaultReviewIndex, setVaultReviewIndex] = useState(0);
  const [vRecallRevealed, setVRecallRevealed] = useState(false);
  const [reviewedCount, setReviewedCount] = useState(0);

  // We are removing custom text generation in favor of infinite scrolling.
  // We keep a dummy generatedStack to satisfy types or if we fetch from API.
  const [generatedStack] = useState<ContentStack>({} as ContentStack);

  useEffect(() => { localStorage.setItem("logos_vault_cards", JSON.stringify(savedVaultCards)); }, [savedVaultCards]);
  useEffect(() => { localStorage.setItem("logos_mastery_points", masteryPoints.toString()); }, [masteryPoints]);
  useEffect(() => { localStorage.setItem("logos_streak", activeStreak.toString()); }, [activeStreak]);

  const currentDisplayCards = useMemo(() => {
    return feedCards;
  }, [feedCards]);

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

  const handleNextSlide = useCallback(() => {
    if (currentDisplayCards.length === 0) return;
    if (selectedSlide >= currentDisplayCards.length - 2 && !isFetchingInfinite) {
      fetchInfiniteFeed();
    }
    setSlideDirection(1);
    setSelectedSlide(prev => (prev < currentDisplayCards.length - 1 ? prev + 1 : prev));
    setPreviewVault(false);
  }, [currentDisplayCards.length, selectedSlide, isFetchingInfinite, fetchInfiniteFeed]);

  const handlePrevSlide = useCallback(() => {
    if (currentDisplayCards.length === 0) return;
    setSlideDirection(-1);
    setSelectedSlide(prev => (prev > 0 ? prev - 1 : currentDisplayCards.length - 1));
    setPreviewVault(false);
  }, [currentDisplayCards.length]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input
      if (document.activeElement?.tagName === "INPUT" || document.activeElement?.tagName === "TEXTAREA") {
        return;
      }

      if (e.key === "ArrowDown") {
        e.preventDefault();
        handleNextSlide();
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        handlePrevSlide();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleNextSlide, handlePrevSlide]);

  const isCardSavedInVault = useCallback((slideIdx: number) => {
    const ac = currentDisplayCards[slideIdx];
    if (!ac) return false;
    return savedVaultCards.some(
      saved => saved.explore_title === ac.explore_title && (saved.stack_id === ac.stack_id || saved.id === ac.id)
    );
  }, [currentDisplayCards, savedVaultCards]);

  const toggleSaveToVault = useCallback(async (index: number) => {
    if (!session?.user) return;

    const card = currentDisplayCards[index] || INITIAL_FEED_CARDS[0];
    const isSaved = savedVaultCards.some(c => c.stack_id === card.stack_id);

    if (isSaved) {
      setSavedVaultCards(prev => prev.filter(c => c.stack_id !== card.stack_id));
      triggerToast("Removed from Vault");
      await supabase.from('vault_cards').delete().eq('user_id', session.user.id).eq('card_id', card.stack_id);
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
        card_id: vaultCard.stack_id,
        card_data: vaultCard
      }]);
    }
  }, [currentDisplayCards, savedVaultCards, triggerToast, session]);

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

  const activeCard = currentDisplayCards[selectedSlide] || INITIAL_FEED_CARDS[0];
  const activeAesthetic = getMoodAesthetic(activeCard?.visual_mood || generatedStack.visual_mood);

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
          selectedSlide={selectedSlide}
          slideDirection={slideDirection}
          previewVault={previewVault}
          isDeepDive={isDeepDive}
          currentDisplayCards={currentDisplayCards}
          activeCard={activeCard}
          activeAesthetic={activeAesthetic}
          generatedStack={generatedStack}
          savedVaultCards={savedVaultCards}
          vaultReviewIndex={vaultReviewIndex}
          vRecallRevealed={vRecallRevealed}
          reviewedCount={reviewedCount}
          masteryPoints={masteryPoints}
          onNextSlide={handleNextSlide}
          onPrevSlide={handlePrevSlide}
          onSetPhoneTab={setPhoneTab}
          onSetPreviewVault={setPreviewVault}
          onSetDeepDive={setIsDeepDive}
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
          />
        )}
      </AnimatePresence>
    </div>
  );
}
