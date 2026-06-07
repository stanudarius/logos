import React, { useState, useEffect } from "react";
import { 
  BookOpen, Bookmark, BookmarkCheck, X, 
  Brain, Trash2, HelpCircle, Network
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import type { FeedCard, MoodAesthetic, SavedVaultCard, ReadingPart } from "../types";
import { getInitials } from "../utils/aesthetics";

// Stable animation variants — defined outside to avoid re-creation
const verticalSlideVariants = {
  enter: (dir: number) => ({
    y: dir > 0 ? 350 : -350,
    opacity: 0,
    scale: 0.96
  }),
  center: {
    y: 0,
    opacity: 1,
    scale: 1,
    transition: {
      y: { type: "spring", stiffness: 320, damping: 28 },
      opacity: { duration: 0.25 }
    }
  },
  exit: (dir: number) => ({
    y: dir > 0 ? -350 : 350,
    opacity: 0,
    scale: 0.96,
    transition: {
      y: { type: "spring", stiffness: 320, damping: 28 },
      opacity: { duration: 0.2 }
    }
  })
};

interface PhoneEmulatorProps {
  // Display state
  phoneTab: "explore" | "vault";
  selectedSlide: number;
  slideDirection: number;
  previewVault: boolean;
  isDeepDive: boolean;
  currentDisplayCards: FeedCard[];
  activeCard: FeedCard;
  activeAesthetic: MoodAesthetic;
  generatedStack: { topic: string; philosopher: string; presentation?: { title: string; reading_parts: ReadingPart[] } };
  
  // Vault state
  savedVaultCards: SavedVaultCard[];
  vaultReviewIndex: number;
  vRecallRevealed: boolean;
  reviewedCount: number;
  masteryPoints: number;

  // Callbacks
  onNextSlide: () => void;
  onPrevSlide: () => void;
  onSetPhoneTab: (tab: "explore" | "vault") => void;
  onSetPreviewVault: (val: boolean) => void;
  onSetDeepDive: (val: boolean) => void;
  onToggleSaveToVault: (idx: number) => void;
  isCardSavedInVault: (idx: number) => boolean;
  onDeleteFromVault: (id: string) => void;
  onRevealRecall: () => void;
  onSubmitReviewRating: (rating: "again" | "hard" | "easy") => void;
  onTriggerToast: (msg: string) => void;
  onOpenConstellation?: () => void;
}

const PhoneEmulator: React.FC<PhoneEmulatorProps> = ({
  phoneTab,
  selectedSlide,
  slideDirection,
  previewVault,
  isDeepDive,
  currentDisplayCards,
  activeCard,
  activeAesthetic,
  generatedStack,
  savedVaultCards,
  vaultReviewIndex,
  vRecallRevealed,
  reviewedCount,
  masteryPoints,
  onNextSlide,
  onPrevSlide,
  onSetPhoneTab,
  onSetPreviewVault,
  onSetDeepDive,
  onToggleSaveToVault,
  isCardSavedInVault,
  onDeleteFromVault,
  onRevealRecall,
  onSubmitReviewRating,
  onTriggerToast,
  onOpenConstellation
}) => {
  const [currentTime, setCurrentTime] = useState<string>("9:41");

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

  return (
      <div 
        id="phone-device-emulation"
        className={`relative rounded-[40px] h-[90vh] max-h-[850px] min-h-[600px] w-full border-[10px] border-[#1A1A1A] ${activeAesthetic.bg} ${activeAesthetic.glow} flex flex-col justify-between p-6 md:p-8 overflow-hidden transition-all duration-700 ease-out shadow-2xl`}
      >
        
        {/* Visual Mood Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-transparent opacity-50 pointer-events-none" />

        {/* Simulated top notch & Constellation Trigger */}
        <div className="relative z-50 flex justify-between items-center text-[10px] font-bold tracking-widest uppercase px-1 pointer-events-none">
          <span className={`opacity-45 ${activeAesthetic.text}`}>{currentTime}</span>
          
          {phoneTab === "explore" && !isDeepDive && !previewVault && (
            <button 
              onClick={onOpenConstellation}
              className={`p-1.5 rounded-full backdrop-blur-md bg-white/5 hover:bg-white/20 transition-all pointer-events-auto ${activeAesthetic.text}`}
              title="View Knowledge Constellation"
            >
              <Network className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Animated Body Display */}
        <div className="relative z-10 flex-1 flex flex-col justify-center my-6 overflow-hidden">
          
          {/* EXPLORE FEED SCROLLER VIEW */}
          {phoneTab === "explore" && (
            <AnimatePresence mode="wait" custom={slideDirection}>
              {!previewVault ? (
                <motion.div
                  key={`slide-${selectedSlide}`}
                  custom={slideDirection}
                  variants={verticalSlideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  className="space-y-5 flex flex-col justify-center h-full cursor-grab active:cursor-grabbing pb-12"
                  drag="y"
                  dragConstraints={{ top: 0, bottom: 0 }}
                  onDragEnd={(_e, info) => {
                    if (info.offset.y < -50) {
                      onNextSlide();
                    } else if (info.offset.y > 50) {
                      onPrevSlide();
                    }
                  }}
                >
                  {/* Micro-Label */}
                  <div>
                    <span className={`text-[12px] font-bold uppercase tracking-[0.2em] block mb-1.5 ${activeAesthetic.accent}`}>
                      {activeCard?.topic || generatedStack.topic}
                    </span>
                    <div className="h-[2px] w-12 bg-[#B5A48B] opacity-40"></div>
                  </div>

                  {/* Display typography */}
                  <h1 className={`text-3xl font-serif leading-[1.1] mb-3 italic font-semibold ${activeAesthetic.text}`}>
                    {activeCard?.explore_title}
                  </h1>
                  
                  <p className={`text-[14px] leading-relaxed font-light mb-6 ${activeAesthetic.sub}`}>
                    {activeCard?.explore_subtext}
                  </p>

                  {/* Attribution badge */}
                  <div className={`flex items-center gap-3 pt-4 border-t ${activeAesthetic.border}`}>
                    <div className="w-11 h-11 rounded-full bg-[#1A1A1A] flex items-center justify-center text-white text-[13px] font-serif italic shadow-sm flex-shrink-0">
                      {getInitials(activeCard?.philosopher || "A C")}
                    </div>
                    <div 
                      onClick={() => {
                        onSetDeepDive(true);
                        onTriggerToast("Opening Deep Dive essay!");
                      }}
                      className="cursor-pointer group/read hover:opacity-80 transition-all flex-1 text-left"
                      title="Click to read full Deep Dive Essay"
                    >
                      <p className={`text-[12px] font-semibold tracking-tight group-hover/read:underline ${activeAesthetic.text}`}>{activeCard?.philosopher}</p>
                      <div className="flex items-center gap-1.5">
                        <p className="text-[10px] font-normal text-amber-500 tracking-wide uppercase truncate max-w-[200px]">{activeCard?.presentation?.title || activeCard?.topic || "The Myth of Sisyphus"}</p>
                        <span className="text-[10px] text-amber-500 transition-transform group-hover/read:translate-x-0.5">→</span>
                      </div>
                    </div>
                  </div>

                  {/* Bookmark button */}
                  <div className="pt-4 flex items-center justify-end">
                    <button
                      id={`bookmark-toggle-btn-${selectedSlide}`}
                      onClick={() => onToggleSaveToVault(selectedSlide)}
                      className={`flex items-center gap-1.5 text-[11px] font-semibold py-1.5 px-3 rounded-xl border transition-all ${
                        isCardSavedInVault(selectedSlide)
                          ? "bg-emerald-500 border-emerald-500 text-white shadow-xs"
                          : "bg-white/80 border-gray-200 text-black hover:bg-white"
                      }`}
                    >
                      {isCardSavedInVault(selectedSlide) ? (
                        <>
                          <BookmarkCheck className="w-4 h-4 text-white fill-current" />
                          <span>In Vault</span>
                        </>
                      ) : (
                        <>
                          <Bookmark className="w-4 h-4 text-gray-500" />
                          <span>Bookmark</span>
                        </>
                      )}
                    </button>
                  </div>
                </motion.div>
              ) : (
                // Quick Q&A card flip
                <motion.div
                  key={`vault-flip-${selectedSlide}`}
                  initial={{ opacity: 0, rotateY: -75 }}
                  animate={{ opacity: 1, rotateY: 0 }}
                  exit={{ opacity: 0, rotateY: 75 }}
                  transition={{ duration: 0.35 }}
                  className="space-y-4 bg-white/95 p-5 rounded-2xl border border-gray-150 shadow-sm h-full flex flex-col justify-between"
                >
                  <div>
                    <div className="inline-flex items-center gap-1 text-[8px] font-bold tracking-widest bg-emerald-50 text-emerald-700 border border-emerald-200 px-1.5 py-0.5 rounded uppercase font-semibold mb-2">
                      RECALL SNAPSHOT
                    </div>
                    
                    <div className="space-y-1">
                      <span className="text-[9px] font-mono text-gray-400 uppercase tracking-wider block">Question Preview</span>
                      <div className="text-xs font-serif italic text-black font-medium leading-relaxed">
                        {activeCard?.vault_question}
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-gray-100 space-y-1">
                    <span className="text-[9px] font-mono text-emerald-600 uppercase tracking-wider block font-bold">Direct Answer</span>
                    <div className="text-xs leading-relaxed text-gray-700 font-light">
                      {activeCard?.vault_answer}
                    </div>
                  </div>

                  <button 
                    id="flip-back-explore"
                    onClick={() => onSetPreviewVault(false)}
                    className="w-full py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg text-[10px] text-gray-600 font-semibold"
                  >
                    Flip Back to Explore Screen
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          )}

          {/* THE VAULT ACTIVE RECALL TEST VIEW */}
          {phoneTab === "vault" && (
            <div id="vault-dashboard-emulation" className="h-full flex flex-col justify-between space-y-2">
              
              {savedVaultCards.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-3 space-y-3">
                  <div className="w-12 h-12 rounded-full bg-neutral-100 flex items-center justify-center">
                    <Brain className="w-6 h-6 text-neutral-400" />
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-gray-800">Your Vault is Vacant</h4>
                    <p className="text-[11px] text-gray-500 font-light leading-relaxed mt-1">
                      Spaced repetition requires material. Return to the <strong>Explore Feed</strong> and click the <strong>Bookmark</strong> controls to load knowledge pieces into testing memory.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex-1 flex flex-col justify-between bg-white/95 p-4 rounded-3xl border border-gray-100 shadow-xs">
                  
                  {/* Active card info header */}
                  <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                    <div>
                      <span className="text-[8px] font-mono text-gray-400 uppercase block">Recall Spindle Queue</span>
                      <span className="text-[10px] font-semibold text-black truncate max-w-[120px] block">
                        {savedVaultCards[vaultReviewIndex]?.explore_title}
                      </span>
                    </div>
                    
                    <button 
                      id={`delete-vault-item-${savedVaultCards[vaultReviewIndex]?.id}`}
                      onClick={() => onDeleteFromVault(savedVaultCards[vaultReviewIndex]?.id)}
                      className="text-gray-400 hover:text-red-500 p-1"
                      title="Delete bookmark"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Central Question Display */}
                  <div className="my-2 space-y-2 flex-1 flex flex-col justify-center">
                    <span className="text-[9px] font-mono text-gray-400 uppercase tracking-wider block font-bold">ANKI QUESTION</span>
                    <div className="text-xs font-serif italic text-black font-medium leading-relaxed">
                      {savedVaultCards[vaultReviewIndex]?.vault_question}
                    </div>

                    <AnimatePresence>
                      {vRecallRevealed && (
                        <motion.div 
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="mt-3 pt-3 border-t border-dashed border-gray-150 space-y-1"
                        >
                          <span className="text-[9px] font-mono text-emerald-600 uppercase tracking-wider block font-bold">CORRECT RECALL</span>
                          <p className="text-xs text-gray-700 font-light leading-relaxed">
                            {savedVaultCards[vaultReviewIndex]?.vault_answer}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Interactive Testing controls */}
                  <div className="pt-2 border-t border-gray-100">
                    {!vRecallRevealed ? (
                      <button
                        id="reveal-recall-btn"
                        onClick={onRevealRecall}
                        className="w-full py-2 bg-black text-white hover:bg-neutral-800 rounded-xl text-xs font-semibold flex items-center justify-center gap-1 shadow-sm transition-all active:scale-95"
                      >
                        <span>Reveal Recall Answer</span>
                        <HelpCircle className="w-3 h-3" />
                      </button>
                    ) : (
                      <div className="space-y-1.5">
                        <span className="text-[8px] font-mono text-gray-400 text-center block">How accurate was your memory?</span>
                        
                        <div className="grid grid-cols-3 gap-1.5">
                          <button
                            id="rate-recall-again"
                            onClick={() => onSubmitReviewRating("again")}
                            className="py-1.5 bg-red-50 hover:bg-red-100 border border-red-200 text-red-700 rounded-lg text-[9px] font-bold transition-all"
                          >
                            Again (0)
                          </button>
                          <button
                            id="rate-recall-hard"
                            onClick={() => onSubmitReviewRating("hard")}
                            className="py-1.5 bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-700 rounded-lg text-[9px] font-bold transition-all"
                          >
                            Hard (3d)
                          </button>
                          <button
                            id="rate-recall-easy"
                            onClick={() => onSubmitReviewRating("easy")}
                            className="py-1.5 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-700 rounded-lg text-[9px] font-bold transition-all"
                          >
                            Easy (7d)
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="mt-2 text-[8px] font-mono text-gray-400 flex justify-between">
                    <span>Reviewed: {reviewedCount} cards</span>
                    <span>Level: {masteryPoints > 200 ? "Grandmaster" : masteryPoints > 140 ? "Scholar" : "Novice"}</span>
                  </div>

                </div>
              )}
            </div>
          )}

        </div>

        {/* Bottom tab bar */}
        <div className="p-1 flex items-center justify-around border-t border-slate-100/40 pt-3 pb-2 relative z-10">
          <button 
            id="phone-mode-explore-tab"
            onClick={() => {
              onSetPhoneTab("explore");
              onSetPreviewVault(false);
              onTriggerToast("Switched to active Explore Feed.");
            }}
            className="flex flex-col items-center gap-1 group active:scale-95 transition-all focus:outline-none"
          >
            <div className={`w-9 h-9 rounded-xl border flex items-center justify-center shadow-xs transition-all ${
              phoneTab === "explore" 
                ? "bg-black border-black text-white" 
                : "border-gray-100 bg-white hover:border-gray-200 text-black shadow-2xs"
            }`}>
              <BookOpen className="w-3.5 h-3.5 stroke-[1.5]" />
            </div>
            <span className={`text-[8px] font-bold uppercase tracking-tight ${phoneTab === 'explore' ? 'text-black' : 'text-[#888888]'}`}>Explore</span>
          </button>

          <button 
            id="phone-mode-vault-tab"
            onClick={() => {
              onSetPhoneTab("vault");
              onSetPreviewVault(false);
              onTriggerToast("Opened Spaced Repetition Spindle.");
            }}
            className="flex flex-col items-center gap-1 active:scale-95 transition-all focus:outline-none"
          >
            <div className={`w-9 h-9 rounded-xl border flex items-center justify-center shadow-xs transition-all relative ${
              phoneTab === "vault" 
                ? "bg-emerald-600 border-emerald-600 text-white" 
                : "border-[#EBF5EE] bg-white hover:border-emerald-100 text-emerald-800 shadow-2xs"
            }`}>
              <Bookmark className="w-3.5 h-3.5 fill-current stroke-[1.5]" />
              {savedVaultCards.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white font-mono text-[7px] w-3.5 h-3.5 rounded-full flex items-center justify-center font-bold">
                  {savedVaultCards.length}
                </span>
              )}
            </div>
            <span className={`text-[8px] font-bold uppercase tracking-tight ${phoneTab === 'vault' ? 'text-emerald-700 font-bold' : 'text-[#888888]'}`}>My Vault</span>
          </button>
        </div>

        {/* Home Indicator */}
        <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-32 h-1 bg-neutral-200/60 rounded-full select-none pointer-events-none" />

        {/* DEEP DIVE ESSAY OVERLAY */}
        <AnimatePresence>
          {isDeepDive && (
            <motion.div
              id="deep-dive-presentation-sheet"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 220 }}
              className="absolute inset-[4px] bottom-[2px] bg-[#FAF9F5] z-30 flex flex-col p-5 rounded-[36px] shadow-2xl border border-[#B5A48B]/30"
            >
              {/* Deep dive header */}
              <div className="flex items-center justify-between pb-2 border-b border-neutral-200">
                <div className="flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-[#B5A48B]" />
                </div>
                <button
                  id="close-deep-dive-sheet-btn"
                  onClick={() => {
                    onSetDeepDive(false);
                    onTriggerToast("Closed Deep Dive reading layer.");
                  }}
                  className="w-6 h-6 rounded-full bg-neutral-100 hover:bg-neutral-250 flex items-center justify-center text-neutral-800 transition-all focus:outline-none focus:ring-1 focus:ring-neutral-300"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Reading content */}
              <div className="flex-1 overflow-y-auto pt-4 space-y-4 pr-1 scrollbar-thin text-left">
                <div className="mb-2.5 space-y-1">
                  <span className="text-[9px] font-bold font-mono uppercase tracking-[0.2em] text-[#B5A48B] block">
                    {activeCard?.topic || generatedStack.topic}
                  </span>
                  <h2 className="text-xl font-serif italic text-black font-semibold leading-tight">
                    {activeCard?.presentation?.title || generatedStack.presentation?.title || "The Myth of Sisyphus"}
                  </h2>
                  <p className="text-[10px] font-mono text-[#B5A48B]/80 font-bold mt-0.5">Author: {activeCard?.philosopher || generatedStack.philosopher}</p>
                </div>

                {(activeCard?.presentation?.reading_parts || generatedStack.presentation?.reading_parts)?.map((part: ReadingPart, index: number, arr: ReadingPart[]) => (
                  <div key={index} className="space-y-1.5">
                    <p className="text-xs leading-relaxed text-neutral-800 font-serif font-light text-justify">
                      {part.text}
                    </p>
                    {index < arr.length - 1 && (
                      <div className="flex justify-center py-2">
                        <span className="text-[8px] text-neutral-300">❖</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div className="pt-2.5 border-t border-gray-200 text-center text-[8px] font-mono text-gray-400 uppercase tracking-widest">
                End of Presentation Essay
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
  );
};

export default PhoneEmulator;
