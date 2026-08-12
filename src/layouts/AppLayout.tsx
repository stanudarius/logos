import React, { useCallback, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ParallaxBackground } from "@/src/components/ui/ParallaxBackground";
import SocraticChat from "@/src/features/chat/components/SocraticChat";

import {
  useNavigation,
  type PhoneTab,
} from "@/src/providers/NavigationProvider";
import { useFeedContext } from "@/src/features/feed/hooks/FeedProvider";
import { useVaultContext } from "@/src/features/vault/hooks/VaultProvider";

import { DesktopSidebar } from "./components/DesktopSidebar";
import { MobileHeader } from "./components/MobileHeader";
import { MobileTabBar } from "./components/MobileTabBar";
import { FeedTab } from "./components/FeedTab";
import { VaultTab } from "./components/VaultTab";
import { TrailsTab } from "./components/TrailsTab";

export const AppLayout: React.FC = () => {
  const {
    phoneTab,
    setPhoneTab,
    activeExploreIndex,
    activeTrailIndex,
    setActiveExploreIndex,
    setActiveTrailIndex,
    setIsConstellationOpen,
    setIsZenModeOpen,
    setIsDeepDiveOpen,
  } = useNavigation();

  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatContext, setChatContext] = useState<{
    philosopher: string;
    topic: string;
    essayContext: string;
  } | null>(null);

  const {
    feedCards,
    activeTrailCards,
    isFetchingInfinite,
    isFeedExhausted,
    fetchInfiniteFeed,
    trackCardInteraction,
    feedCardsRef,
    activeTrailCardsRef,
    handleStartTrail,
  } = useFeedContext();

  React.useEffect(() => {
    if (isChatOpen) {
      const activeCard = phoneTab === "trail-view"
        ? activeTrailCards[activeTrailIndex]
        : feedCards[activeExploreIndex];
      
      if (activeCard) {
        setChatContext({
          philosopher: activeCard.philosopher || "",
          topic: activeCard.topic || "",
          essayContext:
            activeCard.presentation?.reading_parts
              ?.map((p: any) => p.text)
              .join(" ") || "",
        });
      } else {
        setChatContext(null);
      }
    }
  }, [isChatOpen, phoneTab, activeTrailIndex, activeExploreIndex, activeTrailCards, feedCards]);

  const {
    savedVaultCards,
    savedVaultCardIds,
    toggleSaveToVault,
    deleteFromVault,
    updateVaultCardAnnotation,
    assignToFolder,
  } = useVaultContext();

  const activeTabId =
    phoneTab === "trails" || phoneTab === "trail-view"
      ? "trails"
      : phoneTab === "vault"
        ? "vault"
        : "explore";

  const handleActiveCardChange = useCallback(
    (index: number) => {
      if (phoneTab === "trail-view") {
        setActiveTrailIndex(index);
      } else {
        setActiveExploreIndex(index);
      }
      trackCardInteraction(index, 1);
    },
    [
      phoneTab,
      trackCardInteraction,
      setActiveTrailIndex,
      setActiveExploreIndex,
    ],
  );

  const handleToggleSaveToVaultWrapper = useCallback(
    (index: number) => {
      const currentDeck =
        phoneTab === "trail-view"
          ? activeTrailCardsRef.current
          : feedCardsRef.current;
      const card = currentDeck[index];
      if (card) toggleSaveToVault(card, index);
    },
    [phoneTab, toggleSaveToVault, activeTrailCardsRef, feedCardsRef],
  );

  const handleOpenDeepDive = useCallback(
    (index: number) => {
      trackCardInteraction(index, 2);
    },
    [trackCardInteraction],
  );

  const handleStartTrailWrapper = useCallback(
    async (trailId: string) => {
      const success = await handleStartTrail(trailId);
      if (success) {
        setActiveTrailIndex(0);
        setPhoneTab("trail-view");
        setIsDeepDiveOpen(false);
      }
    },
    [handleStartTrail, setActiveTrailIndex, setPhoneTab, setIsDeepDiveOpen],
  );

  return (
    <div className="w-full h-[100dvh] bg-[#FAF8F3] flex flex-col sm:flex-row overflow-hidden transition-all duration-700 ease-out font-sans text-[#1C1C1E]">
      <DesktopSidebar
        activeTabId={activeTabId}
        setPhoneTab={(tab) => {
          setPhoneTab(tab);
          setIsChatOpen(false);
        }}
        savedVaultCardsCount={savedVaultCards.length}
        setIsConstellationOpen={setIsConstellationOpen}
        setIsChatOpen={setIsChatOpen}
        setIsZenModeOpen={setIsZenModeOpen}
      />

      <div className="relative z-10 flex-1 flex flex-col overflow-hidden w-full max-w-full">
        <MobileHeader
          phoneTab={phoneTab}
          setIsZenModeOpen={setIsZenModeOpen}
          setIsChatOpen={setIsChatOpen}
          setIsConstellationOpen={setIsConstellationOpen}
        />

        {/* Single parallax instance for the entire stream */}
        {(phoneTab === "explore" || phoneTab === "trail-view") && (
          <ParallaxBackground />
        )}

        <div className="flex-1 relative w-full h-full flex flex-col items-center justify-center overflow-hidden">
          <FeedTab
            id="thought-stream-explore"
            isActive={phoneTab === "explore"}
            cards={feedCards}
            isLoading={isFetchingInfinite}
            isFeedExhausted={isFeedExhausted}
            isTrailMode={false}
            onActiveCardChange={handleActiveCardChange}
            onFetchMore={fetchInfiniteFeed}
            savedVaultCardIds={savedVaultCardIds}
            onToggleSave={handleToggleSaveToVaultWrapper}
            onOpenDeepDive={handleOpenDeepDive}
          />

          <FeedTab
            id="thought-stream-trail-view"
            isActive={phoneTab === "trail-view"}
            cards={activeTrailCards}
            isLoading={isFetchingInfinite}
            isFeedExhausted={false}
            isTrailMode={true}
            onActiveCardChange={handleActiveCardChange}
            onFetchMore={fetchInfiniteFeed}
            savedVaultCardIds={savedVaultCardIds}
            onToggleSave={handleToggleSaveToVaultWrapper}
            onOpenDeepDive={handleOpenDeepDive}
          />

          <VaultTab
            isActive={phoneTab === "vault"}
            savedVaultCards={savedVaultCards}
            setPhoneTab={setPhoneTab}
            updateVaultCardAnnotation={updateVaultCardAnnotation}
            assignToFolder={assignToFolder}
            deleteFromVault={deleteFromVault}
          />

          <TrailsTab
            isActive={phoneTab === "trails"}
            onStartTrail={handleStartTrailWrapper}
          />

          <AnimatePresence>
            {isChatOpen && (
              <motion.div
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                transition={{ type: "tween", duration: 0.25, ease: "easeOut" }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[100] w-full h-full sm:h-[85vh] sm:max-h-[850px] sm:min-h-[600px] sm:max-w-[420px] sm:rounded-[32px] sm:shadow-[0_20px_60px_rgba(0,0,0,0.15),0_8px_20px_rgba(0,0,0,0.1)] bg-white overflow-hidden flex flex-col"
              >
                {(() => {
                  return chatContext ? (
                    <SocraticChat
                      philosopher={chatContext.philosopher}
                      topic={chatContext.topic}
                      essayContext={chatContext.essayContext}
                      onClose={() => setIsChatOpen(false)}
                    />
                  ) : null;
                })()}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <MobileTabBar
        activeTabId={activeTabId}
        setPhoneTab={(tab) => {
          setPhoneTab(tab);
          setIsChatOpen(false);
        }}
        savedVaultCardsCount={savedVaultCards.length}
      />
    </div>
  );
};
