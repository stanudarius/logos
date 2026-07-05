import React from "react";
import {
  BookOpen, Bookmark, Network, ArrowLeft, Timer, Waypoints
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import type { FeedCard } from "@/src/features/feed/types";
import type { SavedVaultCard } from "@/src/features/vault/types";
import ThoughtStream from "@/src/features/feed/components/ThoughtStream";
import { ParallaxBackground } from "@/src/components/ui/ParallaxBackground";
import CommonplaceBook from "@/src/features/vault/components/CommonplaceBook";
import ReadingTrailsDashboard from "@/src/features/trails/components/ReadingTrailsDashboard";

interface AppLayoutProps {
  // Display state
  phoneTab: "explore" | "vault" | "trails" | "trail-view";
  feedCards: FeedCard[];
  activeTrailCards: FeedCard[];
  activeCardIndex: number;

  isFetchingMore: boolean;
  isFeedExhausted: boolean;

  // Vault state
  savedVaultCards: SavedVaultCard[];

  // Callbacks
  onActiveCardChange: (index: number) => void;
  onFetchMore: () => void;
  onSetPhoneTab: (tab: "explore" | "vault" | "trails" | "trail-view") => void;
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

export const AppLayout: React.FC<AppLayoutProps> = ({
  phoneTab,
  feedCards,
  activeTrailCards,
  isFetchingMore,
  isFeedExhausted,
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
    (phoneTab === "trails" || phoneTab === "trail-view") ? "trails" :
    phoneTab === "vault" ? "vault" : "explore";

  return (
    <div className="w-full h-[100dvh] bg-[#FAF8F3] flex flex-col sm:flex-row overflow-hidden transition-all duration-700 ease-out font-sans text-[#1C1C1E]">
      
      {/* ── Desktop Sidebar ── */}
      <div className="hidden sm:flex w-64 bg-[#F5F3ED] border-r border-[#E8E4DC] flex-col py-8 px-4 z-20 shadow-[1px_0_10px_rgba(0,0,0,0.02)]">
        <div className="flex items-center gap-3 mb-10 px-2">
          {/* Monogram Logo */}
          <div className="w-9 h-9 bg-black rounded-lg flex items-center justify-center shadow-md">
             <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5">
              <path d="M8 40 L24 8 L40 40" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <span className="font-serif italic font-semibold text-xl tracking-tight">Logos</span>
        </div>
        
        <nav className="flex-1 flex flex-col gap-2">
          {NAV_TABS.map(({ id, label, Icon }) => {
            const isActive = id === activeTabId;
            const showBadge = id === "vault" && savedVaultCards.length > 0;
            return (
              <button
                key={id}
                onClick={() => onSetPhoneTab(id as any)}
                className={`flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all text-left ${
                  isActive ? "bg-[#1C1C1E] text-white shadow-md scale-[1.02]" : "text-[#8A8A8E] hover:bg-[#E8E4DC]/60 hover:text-[#1C1C1E]"
                }`}
              >
                <Icon className="w-5 h-5 stroke-[2]" />
                <span className="font-medium text-sm tracking-wide">{label}</span>
                {showBadge && (
                  <span className={`ml-auto text-xs font-bold px-2 py-0.5 rounded-full ${isActive ? 'bg-white/20 text-white' : 'bg-[#1C1C1E]/10 text-[#1C1C1E]'}`}>
                    {savedVaultCards.length}
                  </span>
                )}
              </button>
            )
          })}
        </nav>
        
        {/* Desktop actions */}
        {(phoneTab === "explore" || phoneTab === "trail-view") && (
          <div className="mt-auto space-y-2 pt-4 border-t border-[#E8E4DC]/60">
            <button
              onClick={onOpenConstellation}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-left text-[#8A8A8E] hover:bg-[#E8E4DC]/60 hover:text-[#1C1C1E]"
            >
              <Network className="w-5 h-5" />
              <span className="font-medium text-sm tracking-wide">Constellation</span>
            </button>
            <button
              onClick={onOpenZenMode}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-left text-[#8A8A8E] hover:bg-[#E8E4DC]/60 hover:text-[#1C1C1E]"
            >
              <Timer className="w-5 h-5" />
              <span className="font-medium text-sm tracking-wide">Zen Mode</span>
            </button>
          </div>
        )}
      </div>

      {/* ── Main Content Area ── */}
      <div className="relative z-10 flex-1 flex flex-col overflow-hidden w-full max-w-full">
        
        {/* Mobile Status bar / header */}
        <div className="sm:hidden relative z-50 flex justify-between items-center px-5 pt-5 pb-3 bg-gradient-to-b from-[#FAF8F3] to-[#FAF8F3]/0">
           <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-black rounded flex items-center justify-center">
              <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5">
                <path d="M8 40 L24 8 L40 40" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <span className="font-serif italic font-semibold tracking-tight text-[#1C1C1E]">Logos</span>
           </div>
          {(phoneTab === "explore" || phoneTab === "trail-view") && (
            <div className="flex items-center gap-2">
              <button onClick={onOpenZenMode} className="p-2 rounded-full bg-[#1C1C1E]/5 hover:bg-[#1C1C1E]/10 transition-colors">
                <Timer className="w-4 h-4 text-[#1C1C1E]" />
              </button>
              <button onClick={onOpenConstellation} className="p-2 rounded-full bg-[#1C1C1E]/5 hover:bg-[#1C1C1E]/10 transition-colors">
                <Network className="w-4 h-4 text-[#1C1C1E]" />
              </button>
            </div>
          )}
        </div>

        {/* Single parallax instance for the entire stream */}
        {(phoneTab === "explore" || phoneTab === "trail-view") && <ParallaxBackground />}

        {/* Content Routing */}
        <div className="flex-1 relative w-full h-full flex flex-col items-center justify-center overflow-hidden">
          <div id="thought-stream-explore" className={`w-full h-full sm:h-[85vh] sm:max-h-[850px] sm:min-h-[600px] sm:max-w-[420px] sm:rounded-[32px] sm:shadow-[0_20px_60px_rgba(0,0,0,0.15),0_8px_20px_rgba(0,0,0,0.1)] overflow-hidden relative bg-[#FAF8F3] ${phoneTab === "explore" ? "block" : "hidden"}`}>
            <ThoughtStream
              cards={feedCards}
              isLoading={isFetchingMore}
              isFeedExhausted={isFeedExhausted}
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

          <div id="thought-stream-trail-view" className={`w-full h-full sm:h-[85vh] sm:max-h-[850px] sm:min-h-[600px] sm:max-w-[420px] sm:rounded-[32px] sm:shadow-[0_20px_60px_rgba(0,0,0,0.15),0_8px_20px_rgba(0,0,0,0.1)] overflow-hidden relative bg-[#FAF8F3] ${phoneTab === "trail-view" ? "block" : "hidden"}`}>
            <ThoughtStream
              cards={activeTrailCards}
              isLoading={isFetchingMore}
              isFeedExhausted={false}
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
            <div id="vault-dashboard-emulation" className="h-full w-full max-w-5xl mx-auto flex flex-col justify-between px-4 py-2 pt-4 sm:pt-8 sm:px-8">
              {savedVaultCards.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-4 space-y-5">
                  <div className="relative w-20 h-20 flex items-center justify-center">
                    <div className="absolute inset-0 rounded-full bg-[#D4CFC5]/40 animate-breathe" />
                    <div className="w-16 h-16 rounded-full bg-[#F5F3ED] flex items-center justify-center relative z-10 shadow-sm border border-[#E8E4DC]">
                      <Bookmark className="w-8 h-8 text-[#B5A48B]" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-lg font-serif italic text-[#1C1C1E] font-semibold">
                      Your Vault is Vacant
                    </h4>
                    <p className="text-sm text-[#8A8A8E] font-light leading-relaxed max-w-[280px]">
                      Save Thought Atoms from the Stream to begin collecting ideas in your Vault.
                    </p>
                  </div>

                  <button
                    onClick={() => onSetPhoneTab("explore")}
                    className="group flex items-center gap-2 text-sm font-serif italic text-[#1C1C1E] hover:text-[#B5A48B] transition-all duration-300 mt-4"
                  >
                    <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
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
            <div className="h-full w-full max-w-5xl mx-auto sm:pt-6">
               <ReadingTrailsDashboard onStartTrail={onStartTrail} />
            </div>
          )}
        </div>
      </div>

      {/* ── Mobile Navigation Tab Bar ── */}
      <div className="sm:hidden relative z-20 border-t border-[#E8E4DC]/70 bg-[#FAF8F3]/95 backdrop-blur-md pb-safe">
        <div className="flex items-end justify-around pt-3 pb-4 px-2">
          {NAV_TABS.map(({ id, label, Icon }) => {
            const isActive = id === activeTabId;
            const showBadge = id === "vault" && savedVaultCards.length > 0;

            return (
              <button
                key={id}
                onClick={() => onSetPhoneTab(id as any)}
                className="flex flex-col items-center gap-1.5 group active:scale-95 transition-all focus:outline-none min-w-[56px]"
              >
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-300 relative ${
                  isActive
                    ? "bg-[#1C1C1E] text-[#FAF8F3] shadow-md"
                    : "bg-white border border-[#E8E4DC] text-[#1C1C1E] shadow-sm"
                }`}>
                  <Icon className="w-5 h-5 stroke-[1.5]" />
                  {showBadge && (
                    <span className="absolute -top-1.5 -right-1.5 bg-[#B5A48B] text-white font-mono text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold border-2 border-[#FAF8F3]">
                      {savedVaultCards.length}
                    </span>
                  )}
                </div>
                <span className={`text-[10px] font-bold uppercase tracking-tight transition-colors ${
                  isActive ? "text-[#1C1C1E]" : "text-[#B5A48B]"
                }`}>
                  {label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
