import React, { useState, useEffect, useCallback } from "react";
import {
  BookOpen, Bookmark, Network, ArrowLeft, Timer, Waypoints, X
} from "lucide-react";
import { motion } from "motion/react";
import type { FeedCard, SavedVaultCard } from "../types";
import ThoughtStream from "./ThoughtStream";
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

  return (
    <div
      id="phone-device-emulation"
      className={`relative rounded-none sm:rounded-[40px] h-[100dvh] sm:h-[90vh] sm:max-h-[850px] sm:min-h-[600px] w-full border-0 sm:border-[10px] sm:border-[#1A1A1A] bg-[#FAF8F3] shadow-none sm:shadow-[0_15px_40px_rgba(0,0,0,0.08)] flex flex-col justify-between overflow-hidden transition-all duration-700 ease-out`}
    >

      <div className="relative z-50 flex justify-end items-center text-[10px] font-bold tracking-widest uppercase px-5 pt-4 pb-2 pointer-events-none">

        {phoneTab === "explore" && (
          <div className="flex items-center gap-1.5 pointer-events-auto">
            <button
              onClick={onOpenZenMode}
              className="p-1.5 rounded-full backdrop-blur-md bg-[#1C1C1E]/5 hover:bg-[#1C1C1E]/15 transition-all text-[#1C1C1E]"
              title="Zen Mode"
            >
              <Timer className="w-5 h-5" />
            </button>
            <button
              onClick={onOpenConstellation}
              className="p-1.5 rounded-full backdrop-blur-md bg-[#1C1C1E]/5 hover:bg-[#1C1C1E]/15 transition-all text-[#1C1C1E]"
              title="View Knowledge Constellation"
            >
              <Network className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>

      <div className="relative z-10 flex-1 flex flex-col overflow-hidden">
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
            isTrailMode={phoneTab === "trail-view"}
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
          />
        </div>

        {phoneTab === "vault" && (
          <div id="vault-dashboard-emulation" className="h-full flex flex-col justify-between px-4 py-2 pt-4">
            {savedVaultCards.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-4 space-y-5">
                <div className="w-14 h-14 rounded-full bg-[#F5F3ED] flex items-center justify-center">
                  <Bookmark className="w-7 h-7 text-[#D4CFC5]" />
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

      <div className="p-1 flex items-center justify-around border-t border-[#E8E4DC]/60 pt-3 pb-2 relative z-10 bg-[#FAF8F3]/90 backdrop-blur-sm">
        <button
          id="phone-mode-explore-tab"
          onClick={() => {
            onSetPhoneTab("explore");
          }}
          className="flex flex-col items-center gap-1 group active:scale-95 transition-all focus:outline-none"
        >
          <div className={`w-9 h-9 rounded-xl border flex items-center justify-center shadow-xs transition-all ${phoneTab === "explore"
            ? "bg-[#1C1C1E] border-[#1C1C1E] text-[#FAF8F3]"
            : "border-[#E8E4DC] bg-white hover:border-[#D4CFC5] text-[#1C1C1E] shadow-2xs"
            }`}>
            <BookOpen className="w-3.5 h-3.5 stroke-[1.5]" />
          </div>
          <span className={`text-[8px] font-bold uppercase tracking-tight ${phoneTab === 'explore' ? 'text-[#1C1C1E]' : 'text-[#B5A48B]'}`}>Stream</span>
        </button>

        <button
          id="phone-mode-trails-tab"
          onClick={() => {
            onSetPhoneTab("trails");
          }}
          className="flex flex-col items-center gap-1 group active:scale-95 transition-all focus:outline-none"
        >
          <div className={`w-9 h-9 rounded-xl border flex items-center justify-center shadow-xs transition-all ${(phoneTab === "trails" || phoneTab === "trail-view")
            ? "bg-[#1C1C1E] border-[#1C1C1E] text-[#FAF8F3]"
            : "border-[#E8E4DC] bg-white hover:border-[#D4CFC5] text-[#1C1C1E] shadow-2xs"
            }`}>
            <Waypoints className="w-3.5 h-3.5 stroke-[1.5]" />
          </div>
          <span className={`text-[8px] font-bold uppercase tracking-tight ${(phoneTab === 'trails' || phoneTab === 'trail-view') ? 'text-[#1C1C1E]' : 'text-[#B5A48B]'}`}>Trails</span>
        </button>

        <button
          id="phone-mode-vault-tab"
          onClick={() => {
            onSetPhoneTab("vault");
          }}
          className="flex flex-col items-center gap-1 active:scale-95 transition-all focus:outline-none"
        >
          <div className={`w-9 h-9 rounded-xl border flex items-center justify-center shadow-xs transition-all relative ${phoneTab === "vault"
            ? "bg-[#1C1C1E] border-[#1C1C1E] text-[#FAF8F3]"
            : "border-[#E8E4DC] bg-white hover:border-[#D4CFC5] text-[#1C1C1E] shadow-2xs"
            }`}>
            <Bookmark className="w-3.5 h-3.5 fill-current stroke-[1.5]" />
            {savedVaultCards.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#B5A48B] text-white font-mono text-[7px] w-3.5 h-3.5 rounded-full flex items-center justify-center font-bold">
                {savedVaultCards.length}
              </span>
            )}
          </div>
          <span className={`text-[8px] font-bold uppercase tracking-tight ${phoneTab === 'vault' ? 'text-[#1C1C1E]' : 'text-[#B5A48B]'}`}>Vault</span>
        </button>
      </div>

      <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-32 h-1 bg-[#D4CFC5]/60 rounded-full select-none pointer-events-none hidden sm:block" />

    </div>
  );
};

export default React.memo(PhoneEmulator);
