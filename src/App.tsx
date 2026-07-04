import React, { useState, useCallback } from "react";
import { AnimatePresence } from "motion/react";

import { AppLayout } from "./components/AppLayout";
import { AuthScreen } from "./components/AuthScreen";
import { ConstellationMap } from "./components/ConstellationMap";
import ZenMode from "./components/ZenMode";
import { ResetPasswordScreen } from "./components/ResetPasswordScreen";

import { useAuth } from "./hooks/useAuth";
import { useFeed } from "./hooks/useFeed";
import { useVault } from "./hooks/useVault";

import { READING_TRAILS } from "./data/trailsData";

export default function App() {
  const [activeExploreIndex, setActiveExploreIndex] = useState(0);
  const [activeTrailIndex, setActiveTrailIndex] = useState(0);
  const [phoneTab, setPhoneTab] = useState<"explore" | "vault" | "trails" | "trail-view">("explore");
  const activeCardIndex = phoneTab === "trail-view" ? activeTrailIndex : activeExploreIndex;

  const [isConstellationOpen, setIsConstellationOpen] = useState(false);
  const [isZenModeOpen, setIsZenModeOpen] = useState(false);

  // ── Custom Hooks for Modularity ──
  const { session, isRecoveringPassword, setIsRecoveringPassword } = useAuth();
  
  const { 
    feedCards, activeTrailCards, isFetchingInfinite, isFeedExhausted, 
    trackCardInteraction, fetchInfiniteFeed, handleStartTrail, feedCardsRef, activeTrailCardsRef
  } = useFeed(phoneTab);

  const {
    savedVaultCards, savedVaultCardIds, toggleSaveToVault, deleteFromVault,
    updateVaultCardAnnotation, assignToFolder
  } = useVault(session, trackCardInteraction);

  // ── Event Handlers ──
  const handleActiveCardChange = useCallback((index: number) => {
    if (phoneTab === "trail-view") {
      setActiveTrailIndex(index);
    } else {
      setActiveExploreIndex(index);
    }
    trackCardInteraction(index, 1);
  }, [phoneTab, trackCardInteraction]);

  const handleToggleSaveToVaultWrapper = useCallback((index: number) => {
    const currentDeck = phoneTab === "trail-view" ? activeTrailCardsRef.current : feedCardsRef.current;
    const card = currentDeck[index];
    if (card) toggleSaveToVault(card, index);
  }, [phoneTab, toggleSaveToVault, activeTrailCardsRef, feedCardsRef]);

  const handleOpenDeepDive = useCallback((index: number) => {
    trackCardInteraction(index, 2);
  }, [trackCardInteraction]);

  const handleOpenChat = useCallback((index: number) => {
    trackCardInteraction(index, 2);
  }, [trackCardInteraction]);

  const handleOpenConstellation = useCallback(() => setIsConstellationOpen(true), []);
  const handleOpenZenMode = useCallback(() => setIsZenModeOpen(true), []);

  const handleStartTrailWrapper = useCallback(async (trailId: string) => {
    const success = await handleStartTrail(trailId);
    if (success) {
      setActiveTrailIndex(0);
      setPhoneTab("trail-view");
    }
  }, [handleStartTrail]);

  const filterByThinker = useCallback(async (thinkerName: string) => {
    const trail = READING_TRAILS.find(t =>
      t.thinkerIds.some(tid =>
        tid.toLowerCase() === thinkerName.toLowerCase() ||
        thinkerName.toLowerCase().includes(tid.toLowerCase()) ||
        tid.toLowerCase().includes(thinkerName.toLowerCase())
      )
    );

    if (trail) {
      handleStartTrailWrapper(trail.id);
    }
  }, [handleStartTrailWrapper]);

  // ── Render Branches ──
  if (isRecoveringPassword) {
    return (
      <div className="w-full h-[100dvh] bg-[#0A0A0A] flex items-center justify-center overflow-hidden p-4 sm:p-8">
        <ResetPasswordScreen onPasswordReset={() => setIsRecoveringPassword(false)} />
      </div>
    );
  }

  if (!session) {
    return (
      <div className="w-full h-[100dvh] bg-[#0A0A0A] flex items-center justify-center overflow-hidden p-4 sm:p-8">
        <AuthScreen />
      </div>
    );
  }

  return (
    <div className="w-full h-[100dvh] bg-[#FAF8F3] flex overflow-hidden p-0">
      <AppLayout
        phoneTab={phoneTab}
        feedCards={feedCards}
        activeTrailCards={activeTrailCards}
        activeCardIndex={activeCardIndex}
        isFetchingMore={isFetchingInfinite}
        isFeedExhausted={isFeedExhausted}
        savedVaultCards={savedVaultCards}
        onActiveCardChange={handleActiveCardChange}
        onFetchMore={fetchInfiniteFeed}
        onSetPhoneTab={setPhoneTab}
        onToggleSaveToVault={handleToggleSaveToVaultWrapper}
        savedVaultCardIds={savedVaultCardIds}
        onDeleteFromVault={deleteFromVault}
        onOpenConstellation={handleOpenConstellation}
        onOpenZenMode={handleOpenZenMode}
        onUpdateVaultCardAnnotation={updateVaultCardAnnotation}
        onAssignToFolder={assignToFolder}
        onOpenDeepDive={handleOpenDeepDive}
        onOpenChat={handleOpenChat}
        onStartTrail={handleStartTrailWrapper}
      />

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
            onSessionComplete={() => {}}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
