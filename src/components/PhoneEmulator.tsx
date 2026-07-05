import React, { useState, useEffect, useCallback } from "react";
import {
  BookOpen, Bookmark, Network, ArrowLeft, Timer, Waypoints
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import type { FeedCard, SavedVaultCard } from "../types";
import ThoughtStream from "./ThoughtStream";
import { ParallaxBackground } from "./ThoughtAtom";
import CommonplaceBook from "./CommonplaceBook";
import ReadingTrailsDashboard from "./ReadingTrailsDashboard";

interface PhoneEmulatorProps {
  // Display state
  phoneTab: "explore" | "vault" | "trails" | "trail-view";
  feedCards: FeedCard[];
  activeTrailCards: FeedCard[];
  activeCardIndex: number;

  isFetchingMore: boolean;

  // Vault state
  savedVaultCards: SavedVaultCard[];

  // Callbacks
  onActiveCardChange: (index: number) => void;
  onFetchMore: () => void;
  onSetPhoneTab: (tab: "explore" | "vault") => void;
  onToggleSaveToVault: (idx: number) => void;
  savedVaultCardIds: Set<string>;
  onOpenConstellation?: () => void;
  onOpenZenMode?: () => void;
  onUpdateVaultCardAnnotation: (cardId: string, text: string) => void;
  onAssignToFolder: (id: string, folderName: string | undefined) => void;
  onDeleteFromVault: (id: string) => void;
  onOpenDeepDive?: (index: number) => void;
  onOpenChat?: (index: number) => void;
  onStartTrail: (trailId: string) => void;
}

const NAV_TABS = [
  { id: "explore", label: "Stream", Icon: BookOpen },
  { id: "trails",  label: "Trails", Icon: Waypoints },
  { id: "vault",   label: "Vault",  Icon: Bookmark },
] as const;

const PhoneEmulator: React.FC<PhoneEmulatorProps> = ({
  phoneTab,
  feedCards,
  activeTrailCards,
  activeCardIndex,
  isFetchingMore,
  savedVaultCards,
  savedVaultCardIds,
  onActiveCardChange,
  onFetchMore,
  onSetPhoneTab,
  onToggleSaveToVault,
  onOpenConstellation,
  onOpenZenMode,
  onUpdateVaultCardAnnotation,
  onAssignToFolder,
  onDeleteFromVault,
  onOpenDeepDive,
  onOpenChat,
  onStartTrail
}) => {

  const activeTabId =
    phoneTab === "trail-view" ? "trails" :
    phoneTab === "vault"      ? "vault"  : "explore";

  return (
    <div
      id="phone-device-emulation"
      className="relative rounded-none sm:rounded-[40px] h-[100dvh] sm:h-[90vh] sm:max-h-[850px] sm:min-h-[600px] w-full border-0 sm:border-[10px] sm:border-[#1A1A1A] bg-[#FAF8F3] shadow-none sm:shadow-[0_20px_60px_rgba(0,0,0,0.20),0_8px_20px_rgba(0,0,0,0.12)] flex flex-col justify-between overflow-hidden transition-all duration-700 ease-out"
    >
      {/* ── Status bar / header ── */}
      <div className="relative z-50 flex justify-end items-center px-4 pt-4 pb-2 pointer-events-none border-b border-[#E8E4DC]/40 shadow-[0_1px_0_rgba(0,0,0,0.03)]">
        {phoneTab === "explore" && (
          <div className="flex items-center gap-2 pointer-events-auto">
            <button
              onClick={onOpenZenMode}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full backdrop-blur-md bg-[#1C1C1E]/6 hover:bg-[#1C1C1E]/12 border border-[#1C1C1E]/8 hover:border-[#1C1C1E]/15 transition-all text-[#1C1C1E] text-[10px] font-semibold tracking-wider uppercase"
              title="Zen Mode"
            >
              <Timer className="w-3.5 h-3.5" />
              <span>Focus</span>
            </button>
            <button
              onClick={onOpenConstellation}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full backdrop-blur-md bg-[#1C1C1E]/6 hover:bg-[#1C1C1E]/12 border border-[#1C1C1E]/8 hover:border-[#1C1C1E]/15 transition-all text-[#1C1C1E] text-[10px] font-semibold tracking-wider uppercase"
              title="View Knowledge Constellation"
            >
              <Network className="w-3.5 h-3.5" />
              <span>Map</span>
            </button>
          </div>
        )}
      </div>

      {/* ── Main content area ── */}
      <div className="relative z-10 flex-1 flex flex-col overflow-hidden">
        {/* Single parallax instance for the entire stream */}
        {(phoneTab === "explore" || phoneTab === "trail-view") && <ParallaxBackground />}

        <div id="thought-stream-explore" className={`h-full w-full ${phoneTab === "explore" ? "block" : "hidden"}`}>
          <ThoughtStream
            cards={feedCards}
            isLoading={isFetchingMore}
            onActiveCardChange={onActiveCardChange}
            onFetchMore={onFetchMore}
            savedVaultCardIds={savedVaultCardIds}
            onToggleSave={onToggleSaveToVault}
            onOpenDeepDive={onOpenDeepDive}
            onOpenChat={onOpenChat}
            isTrailMode={false}
            isActiveTab={phoneTab === "explore"}
          />
        </div>

        <div id="thought-stream-trail-view" className={`h-full w-full ${phoneTab === "trail-view" ? "block" : "hidden"}`}>
          <ThoughtStream
            cards={activeTrailCards}
            isLoading={isFetchingMore}
            onActiveCardChange={onActiveCardChange}
            onFetchMore={onFetchMore}
            savedVaultCardIds={savedVaultCardIds}
            onToggleSave={onToggleSaveToVault}
            onOpenDeepDive={onOpenDeepDive}
            onOpenChat={onOpenChat}
            isTrailMode={phoneTab === "trail-view"}
            isActiveTab={phoneTab === "trail-view"}
          />
        </div>

        {phoneTab === "vault" && (
          <div id="vault-dashboard-emulation" className="h-full flex flex-col justify-between px-4 py-2 pt-4">
            {savedVaultCards.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-4 space-y-5">
                <div className="relative w-16 h-16 flex items-center justify-center">
                  {/* Breathing pulse ring */}
                  <div className="absolute inset-0 rounded-full bg-[#D4CFC5]/40 animate-breathe" />
                  <div className="w-14 h-14 rounded-full bg-[#F5F3ED] flex items-center justify-center relative z-10">
                    <Bookmark className="w-7 h-7 text-[#D4CFC5]" />
                  </div>
                </div>
                <div className="space-y-2">
                  <h4 className="text-sm font-serif italic text-[#1C1C1E] font-semibold">
                    Your Vault is Vacant
                  </h4>
                  <p className="text-[11px] text-[#8A8A8E] font-light leading-relaxed max-w-[240px]">
                    Save Thought Atoms from the Stream to begin collecting ideas in your Vault.
                  </p>
                </div>

                <button
                  onClick={() => {
                    onSetPhoneTab("explore");
                  }}
                  className="group flex items-center gap-2 text-[12px] font-serif italic text-[#1C1C1E] hover:text-[#B5A48B] transition-all duration-300 mt-2"
                >
                  <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
                  <span className="border-b border-[#1C1C1E]/20 group-hover:border-[#B5A48B]/40 pb-0.5 transition-all">
                    Return to the Stream
                  </span>
                </button>
              </div>
            ) : (
              <CommonplaceBook
                cards={savedVaultCards}
                onUpdateAnnotation={onUpdateVaultCardAnnotation}
                onAssignToFolder={onAssignToFolder}
                onDeleteFromVault={onDeleteFromVault}
              />
            )}
          </div>
        )}

        {phoneTab === "trails" && (
          <ReadingTrailsDashboard onStartTrail={onStartTrail} />
        )}
      </div>

      {/* ── Navigation Tab Bar ── */}
      <div className="relative z-20 border-t border-[#E8E4DC]/70 bg-[#FAF8F3]/95 backdrop-blur-sm">
        <div className="flex items-end justify-around pt-3 pb-2 px-2">
          {NAV_TABS.map(({ id, label, Icon }) => {
            const isActive =
              id === "trails" ? (phoneTab === "trails" || phoneTab === "trail-view") :
              id === activeTabId;

            const showBadge = id === "vault" && savedVaultCards.length > 0;

            return (
              <button
                key={id}
                id={`phone-mode-${id}-tab`}
                onClick={() => onSetPhoneTab(id as "explore" | "vault")}
                className="flex flex-col items-center gap-1.5 group active:scale-95 transition-all focus:outline-none min-w-[56px]"
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 relative ${
                  isActive
                    ? "bg-[#1C1C1E] text-[#FAF8F3] shadow-[0_4px_14px_rgba(28,28,30,0.25)]"
                    : "bg-white border border-[#E8E4DC] text-[#1C1C1E] hover:border-[#D4CFC5] shadow-[0_1px_4px_rgba(0,0,0,0.04)] hover:shadow-[0_2px_8px_rgba(0,0,0,0.07)]"
                }`}>
                  <Icon className="w-4 h-4 stroke-[1.5]" />
                  {showBadge && (
                    <span className="absolute -top-1 -right-1 bg-[#B5A48B] text-white font-mono text-[7px] w-3.5 h-3.5 rounded-full flex items-center justify-center font-bold">
                      {savedVaultCards.length}
                    </span>
                  )}
                </div>
                <span className={`text-[9px] font-bold uppercase tracking-tight transition-colors ${
                  isActive ? "text-[#1C1C1E]" : "text-[#B5A48B]"
                }`}>
                  {label}
                </span>
              </button>
            );
          })}
        </div>

        {/* Home bar indicator */}
        <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-28 h-[4px] bg-[#D4CFC5]/70 rounded-full select-none pointer-events-none hidden sm:block" />
      </div>
    </div>
  );
};

export default React.memo(PhoneEmulator);
