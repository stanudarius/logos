import React, { useState, useEffect, useCallback } from "react";
import {
  BookOpen, Bookmark, BookmarkCheck, X,
  Brain, Trash2, HelpCircle, Network, ArrowLeft, Timer
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import type { FeedCard, MoodAesthetic, SavedVaultCard, ReadingPart, JournalEntry } from "../types";
import { getInitials } from "../utils/aesthetics";
import ThoughtStream from "./ThoughtStream";
import ClozeCard from "./ClozeCard";
import Journal from "./Journal";

interface PhoneEmulatorProps {
  // Display state
  phoneTab: "explore" | "vault";
  currentDisplayCards: FeedCard[];
  activeCardIndex: number;
  activeAesthetic: MoodAesthetic;
  isFetchingMore: boolean;

  // Vault state
  savedVaultCards: SavedVaultCard[];
  vaultReviewIndex: number;
  vRecallRevealed: boolean;
  reviewedCount: number;
  masteryPoints: number;

  // Callbacks
  onActiveCardChange: (index: number) => void;
  onFetchMore: () => void;
  onSetPhoneTab: (tab: "explore" | "vault") => void;
  onToggleSaveToVault: (idx: number) => void;
  isCardSavedInVault: (idx: number) => boolean;
  onDeleteFromVault: (id: string) => void;
  onRevealRecall: () => void;
  onSubmitReviewRating: (rating: "again" | "hard" | "easy") => void;
  onTriggerToast: (msg: string) => void;
  onOpenConstellation?: () => void;
  onOpenZenMode?: () => void;
  journalEntries: JournalEntry[];
  onAddJournalEntry: (cardId: string, text: string) => void;
  onDeleteJournalEntry: (entryId: string) => void;
}

const PhoneEmulator: React.FC<PhoneEmulatorProps> = ({
  phoneTab,
  currentDisplayCards,
  activeCardIndex,
  activeAesthetic,
  isFetchingMore,
  savedVaultCards,
  vaultReviewIndex,
  vRecallRevealed,
  reviewedCount,
  masteryPoints,
  onActiveCardChange,
  onFetchMore,
  onSetPhoneTab,
  onToggleSaveToVault,
  isCardSavedInVault,
  onDeleteFromVault,
  onRevealRecall,
  onSubmitReviewRating,
  onTriggerToast,
  onOpenConstellation,
  onOpenZenMode,
  journalEntries,
  onAddJournalEntry,
  onDeleteJournalEntry
}) => {
  const [currentTime, setCurrentTime] = useState<string>("9:41");
  const [clozeComplete, setClozeComplete] = useState(false);
  const [isSharing, setIsSharing] = useState(false);

  const handleShareClick = useCallback(async () => {
    if (isSharing) return;
    setIsSharing(true);
    try {
      const { toPng } = await import("html-to-image");
      const node = document.getElementById(`thought-atom-${activeCardIndex}`);
      if (!node) throw new Error("Card node not found");

      onTriggerToast("Generating shareable image...");
      
      // Temporarily hide the deep dive drawer and buttons if they exist
      const dataUrl = await toPng(node, { 
        quality: 0.95,
        pixelRatio: 2,
        filter: (el) => {
          // Filter out the bookmark toggle and drawer when capturing
          if (el.tagName === 'BUTTON' && el.id?.startsWith('bookmark-toggle')) return false;
          if (el.classList && el.classList.contains('deep-dive-drawer')) return false;
          return true;
        }
      });

      const philosopher = currentDisplayCards[activeCardIndex]?.philosopher || "philosophy";
      const filename = `${philosopher.replace(/\s+/g, '-').toLowerCase()}-logos.png`;

      // Try native share API first (mobile)
      if (navigator.share) {
        const res = await fetch(dataUrl);
        const blob = await res.blob();
        const file = new File([blob], filename, { type: blob.type });
        try {
          await navigator.share({
            title: 'Logos Philosophy Stack',
            text: `Check out this insight from ${philosopher}!`,
            files: [file]
          });
          onTriggerToast("Shared successfully!");
        } catch (shareErr) {
          // User might have cancelled share
          console.log(shareErr);
        }
      } else {
        // Fallback to direct download
        const link = document.createElement("a");
        link.download = filename;
        link.href = dataUrl;
        link.click();
        onTriggerToast("Saved to downloads!");
      }
    } catch (err) {
      console.error(err);
      onTriggerToast("Failed to generate image.");
    } finally {
      setIsSharing(false);
    }
  }, [activeCardIndex, isSharing, currentDisplayCards, onTriggerToast]);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      let hours = now.getHours();
      const minutes = now.getMinutes();
      hours = hours % 12 || 12; // 12-hour format
      setCurrentTime(`${hours}:${minutes.toString().padStart(2, '0')}`);
    };
    updateTime(); // Initial set
    const interval = setInterval(updateTime, 10000); // Check every 10 seconds
    return () => clearInterval(interval);
  }, []);

  // Reset cloze state when vault card changes
  useEffect(() => {
    setClozeComplete(false);
  }, [vaultReviewIndex]);

  const handleClozeAllRevealed = useCallback(() => {
    setClozeComplete(true);
  }, []);

  const currentVaultCard = savedVaultCards[vaultReviewIndex];
  const hasCloze = currentVaultCard?.quote && currentVaultCard.quote.length > 0;

  return (
    <div
      id="phone-device-emulation"
      className={`relative rounded-none sm:rounded-[40px] h-[100dvh] sm:h-[90vh] sm:max-h-[850px] sm:min-h-[600px] w-full border-0 sm:border-[10px] sm:border-[#1A1A1A] bg-[#FAF8F3] shadow-none sm:shadow-[0_15px_40px_rgba(0,0,0,0.08)] flex flex-col justify-between overflow-hidden transition-all duration-700 ease-out`}
    >

      {/* Simulated top notch & Constellation Trigger */}
      <div className="relative z-50 flex justify-between items-center text-[10px] font-bold tracking-widest uppercase px-5 pt-4 pb-2 pointer-events-none">
        <div className="flex items-center gap-2">
          <span className="opacity-45 text-[#1C1C1E] hidden sm:block">{currentTime}</span>
          
          {/* Generating Indicator (Status Bar) */}
          {isFetchingMore && (
            <div className="flex items-center gap-1 px-2 py-0.5 bg-white/40 backdrop-blur-md border border-[#1C1C1E]/10 rounded-full animate-in fade-in zoom-in duration-300">
              <div className="flex items-center gap-0.5">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="w-[3px] h-[3px] rounded-full bg-[#B5A48B]"
                    style={{
                      animation: `pulse 1.4s ease-in-out ${i * 0.2}s infinite`,
                    }}
                  />
                ))}
              </div>
              <span className="text-[7px] font-mono uppercase tracking-widest text-[#1C1C1E] font-medium leading-none">
                Gen
              </span>
            </div>
          )}
        </div>

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
              onClick={handleShareClick}
              disabled={isSharing}
              className="p-1.5 rounded-full backdrop-blur-md bg-[#1C1C1E]/5 hover:bg-[#1C1C1E]/15 transition-all text-[#1C1C1E] disabled:opacity-50"
              title="Share Snapshot"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" x2="12" y1="2" y2="15"/></svg>
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

      {/* Animated Body Display */}
      <div className="relative z-10 flex-1 flex flex-col overflow-hidden">

        {/* EXPLORE FEED — THOUGHT STREAM */}
        {phoneTab === "explore" && (
          <>
            <ThoughtStream
              cards={currentDisplayCards}
              isLoading={isFetchingMore}
              onActiveCardChange={onActiveCardChange}
              onFetchMore={onFetchMore}
              isCardSaved={isCardSavedInVault}
              onToggleSave={onToggleSaveToVault}
              onTriggerToast={onTriggerToast}
            />

            {/* Static Attribution Footer Overlay */}
            {currentDisplayCards[activeCardIndex] && (
              <div className="absolute bottom-[60px] left-0 right-0 px-5 pb-5 z-20 pointer-events-none">
                <div className="flex items-center justify-between border-t border-[#E8E4DC]/60 pt-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-full bg-[#1C1C1E] flex items-center justify-center text-[#FAF8F3] text-[11px] font-serif italic shadow-sm flex-shrink-0">
                      {getInitials(currentDisplayCards[activeCardIndex].philosopher)}
                    </div>
                    <div>
                      <p className="text-[11px] font-semibold text-[#1C1C1E] tracking-tight leading-none mb-0.5">
                        {currentDisplayCards[activeCardIndex].philosopher}
                      </p>
                      <p className="text-[9px] font-normal text-[#B5A48B] tracking-wide uppercase truncate max-w-[160px]">
                        {currentDisplayCards[activeCardIndex].presentation?.title || currentDisplayCards[activeCardIndex].topic}
                      </p>
                      {/* 4-card Sequence Progress Indicator */}
                      <div className="flex items-center gap-1 mt-1.5">
                        {(() => {
                          const currentCard = currentDisplayCards[activeCardIndex];
                          let cardSequence = 1;
                          const genMatch = currentCard.id.match(/_card_(\d+)_/);
                          if (genMatch) {
                            cardSequence = parseInt(genMatch[1], 10) + 1;
                          } else {
                            const match = currentCard.id.match(/_(\d+)$/);
                            cardSequence = match ? parseInt(match[1], 10) : 1;
                          }
                          return [...Array(4)].map((_, i) => (
                            <div
                              key={i}
                              className={`h-[2px] w-2.5 rounded-full transition-all ${
                                i < cardSequence ? "bg-[#B5A48B]" : "bg-[#E8E4DC]"
                              }`}
                            />
                          ));
                        })()}
                      </div>
                    </div>
                  </div>

                  {/* Bookmark toggle */}
                  <button
                    id={`bookmark-toggle-btn-${activeCardIndex}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleSaveToVault(activeCardIndex);
                    }}
                    className={`pointer-events-auto flex items-center gap-1 text-[10px] font-semibold py-1.5 px-2.5 rounded-xl border transition-all active:scale-95 ${
                      isCardSavedInVault(activeCardIndex)
                        ? "bg-[#1C1C1E] border-[#1C1C1E] text-[#FAF8F3]"
                        : "bg-white/80 border-[#E8E4DC] text-[#1C1C1E] hover:bg-white hover:border-[#D4CFC5]"
                    }`}
                  >
                    {isCardSavedInVault(activeCardIndex) ? (
                      <>
                        <BookmarkCheck className="w-3.5 h-3.5 fill-current" />
                        <span>Saved</span>
                      </>
                    ) : (
                      <>
                        <Bookmark className="w-3.5 h-3.5" />
                        <span>Save</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </>
        )}

        {/* THE VAULT — SPACED REPETITION SPINDLE */}
        {phoneTab === "vault" && (
          <div id="vault-dashboard-emulation" className="h-full flex flex-col justify-between px-4 py-2">

            {savedVaultCards.length === 0 ? (
              /* ===== EMPTY STATE CTA ===== */
              <div className="flex-1 flex flex-col items-center justify-center text-center p-4 space-y-5">
                <div className="w-14 h-14 rounded-full bg-[#F5F3ED] flex items-center justify-center">
                  <Brain className="w-7 h-7 text-[#D4CFC5]" />
                </div>
                <div className="space-y-2">
                  <h4 className="text-sm font-serif italic text-[#1C1C1E] font-semibold">
                    Your Vault is Vacant
                  </h4>
                  <p className="text-[11px] text-[#8A8A8E] font-light leading-relaxed max-w-[240px]">
                    Spaced repetition requires material. Save Thought Atoms from the Stream to begin forging memory.
                  </p>
                </div>

                {/* Interactive CTA */}
                <button
                  onClick={() => {
                    onSetPhoneTab("explore");
                    onTriggerToast("Returning to the Stream.");
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
              /* ===== ACTIVE VAULT REVIEW ===== */
              <div className="flex-1 flex flex-col justify-between bg-white/95 p-4 rounded-3xl border border-[#E8E4DC] shadow-xs">

                {/* Active card info header */}
                <div className="flex items-center justify-between pb-2 border-b border-[#E8E4DC]">
                  <div>
                    <span className="text-[8px] font-mono text-[#B5A48B] uppercase block">Recall Spindle Queue</span>
                    <span className="text-[10px] font-semibold text-[#1C1C1E] truncate max-w-[120px] block">
                      {currentVaultCard?.explore_title}
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    <Journal
                      cardId={currentVaultCard?.id || ""}
                      cardTitle={currentVaultCard?.explore_title || ""}
                      entries={journalEntries}
                      onAddEntry={onAddJournalEntry}
                      onDeleteEntry={onDeleteJournalEntry}
                    />
                    <button
                      id={`delete-vault-item-${currentVaultCard?.id}`}
                      onClick={() => onDeleteFromVault(currentVaultCard?.id)}
                    className="text-[#D4CFC5] hover:text-red-500 p-1 transition-colors"
                    title="Delete bookmark"
                  >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Central Question/Cloze Display */}
                <div className="my-2 space-y-2 flex-1 flex flex-col justify-center">
                  {hasCloze ? (
                    /* === CLOZE DELETION MODE === */
                    <ClozeCard
                      segments={currentVaultCard.quote!}
                      onAllRevealed={handleClozeAllRevealed}
                    />
                  ) : (
                    /* === STANDARD Q&A MODE === */
                    <>
                      <span className="text-[9px] font-mono text-[#B5A48B] uppercase tracking-wider block font-bold">RECALL QUESTION</span>
                      <div className="text-xs font-serif italic text-[#1C1C1E] font-medium leading-relaxed">
                        {currentVaultCard?.vault_question}
                      </div>

                      <AnimatePresence>
                        {vRecallRevealed && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-3 pt-3 border-t border-dashed border-[#E8E4DC] space-y-1"
                          >
                            <span className="text-[9px] font-mono text-[#5CB888] uppercase tracking-wider block font-bold">CORRECT RECALL</span>
                            <p className="text-xs text-[#3A3A3E] font-light leading-relaxed">
                              {currentVaultCard?.vault_answer}
                            </p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </>
                  )}
                </div>

                {/* Interactive Testing controls */}
                <div className="pt-2 border-t border-[#E8E4DC]">
                  {hasCloze ? (
                    /* Cloze mode grading — shows after all blanks revealed */
                    clozeComplete ? (
                      <div className="space-y-1.5 animate-fade-in-up">
                        <span className="text-[8px] font-mono text-[#B5A48B] text-center block">How accurately did you recall?</span>
                        <div className="grid grid-cols-3 gap-1.5">
                          <button
                            onClick={() => { onSubmitReviewRating("again"); setClozeComplete(false); }}
                            className="py-1.5 bg-red-50 hover:bg-red-100 border border-red-200 text-red-700 rounded-lg text-[9px] font-bold transition-all active:scale-95"
                          >
                            Again
                          </button>
                          <button
                            onClick={() => { onSubmitReviewRating("hard"); setClozeComplete(false); }}
                            className="py-1.5 bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-700 rounded-lg text-[9px] font-bold transition-all active:scale-95"
                          >
                            Hard
                          </button>
                          <button
                            onClick={() => { onSubmitReviewRating("easy"); setClozeComplete(false); }}
                            className="py-1.5 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-700 rounded-lg text-[9px] font-bold transition-all active:scale-95"
                          >
                            Easy
                          </button>
                        </div>
                      </div>
                    ) : (
                      <p className="text-[9px] font-mono text-[#B5A48B] text-center py-2">
                        Tap each blank to reveal the hidden term
                      </p>
                    )
                  ) : (
                    /* Standard Q&A mode grading */
                    !vRecallRevealed ? (
                      <button
                        id="reveal-recall-btn"
                        onClick={onRevealRecall}
                        className="w-full py-2 bg-[#1C1C1E] text-[#FAF8F3] hover:bg-[#2C2C2E] rounded-xl text-xs font-semibold flex items-center justify-center gap-1 shadow-sm transition-all active:scale-95"
                      >
                        <span>Reveal Recall Answer</span>
                        <HelpCircle className="w-3 h-3" />
                      </button>
                    ) : (
                      <div className="space-y-1.5">
                        <span className="text-[8px] font-mono text-[#B5A48B] text-center block">How accurate was your memory?</span>

                        <div className="grid grid-cols-3 gap-1.5">
                          <button
                            id="rate-recall-again"
                            onClick={() => onSubmitReviewRating("again")}
                            className="py-1.5 bg-red-50 hover:bg-red-100 border border-red-200 text-red-700 rounded-lg text-[9px] font-bold transition-all active:scale-95"
                          >
                            Again (0)
                          </button>
                          <button
                            id="rate-recall-hard"
                            onClick={() => onSubmitReviewRating("hard")}
                            className="py-1.5 bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-700 rounded-lg text-[9px] font-bold transition-all active:scale-95"
                          >
                            Hard (3d)
                          </button>
                          <button
                            id="rate-recall-easy"
                            onClick={() => onSubmitReviewRating("easy")}
                            className="py-1.5 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-700 rounded-lg text-[9px] font-bold transition-all active:scale-95"
                          >
                            Easy (7d)
                          </button>
                        </div>
                      </div>
                    )
                  )}
                </div>

                <div className="mt-2 text-[8px] font-mono text-[#B5A48B] flex justify-between">
                  <span>Reviewed: {reviewedCount} cards</span>
                  <span>Level: {masteryPoints > 200 ? "Grandmaster" : masteryPoints > 140 ? "Scholar" : "Novice"}</span>
                </div>

              </div>
            )}
          </div>
        )}

      </div>

      {/* Bottom tab bar */}
      <div className="p-1 flex items-center justify-around border-t border-[#E8E4DC]/60 pt-3 pb-2 relative z-10 bg-[#FAF8F3]/90 backdrop-blur-sm">
        <button
          id="phone-mode-explore-tab"
          onClick={() => {
            onSetPhoneTab("explore");
            onTriggerToast("Switched to active Explore Feed.");
          }}
          className="flex flex-col items-center gap-1 group active:scale-95 transition-all focus:outline-none"
        >
          <div className={`w-9 h-9 rounded-xl border flex items-center justify-center shadow-xs transition-all ${
            phoneTab === "explore"
              ? "bg-[#1C1C1E] border-[#1C1C1E] text-[#FAF8F3]"
              : "border-[#E8E4DC] bg-white hover:border-[#D4CFC5] text-[#1C1C1E] shadow-2xs"
          }`}>
            <BookOpen className="w-3.5 h-3.5 stroke-[1.5]" />
          </div>
          <span className={`text-[8px] font-bold uppercase tracking-tight ${phoneTab === 'explore' ? 'text-[#1C1C1E]' : 'text-[#B5A48B]'}`}>Stream</span>
        </button>

        <button
          id="phone-mode-vault-tab"
          onClick={() => {
            onSetPhoneTab("vault");
            onTriggerToast("Opened Spaced Repetition Spindle.");
          }}
          className="flex flex-col items-center gap-1 active:scale-95 transition-all focus:outline-none"
        >
          <div className={`w-9 h-9 rounded-xl border flex items-center justify-center shadow-xs transition-all relative ${
            phoneTab === "vault"
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

      {/* Home Indicator */}
      <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-32 h-1 bg-[#D4CFC5]/60 rounded-full select-none pointer-events-none hidden sm:block" />

    </div>
  );
};

export default PhoneEmulator;
