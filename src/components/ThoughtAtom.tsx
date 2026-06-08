import React, { useState, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Bookmark, BookmarkCheck, BookOpen, X } from "lucide-react";
import type { FeedCard, LayoutVariant, ReadingPart } from "../types";
import { getInitials } from "../utils/aesthetics";

interface ThoughtAtomProps {
  card: FeedCard;
  layoutVariant: LayoutVariant;
  index: number;
  isSaved: boolean;
  onToggleSave: () => void;
  onTriggerToast: (msg: string) => void;
}

/**
 * ThoughtAtom — A single full-screen typographic poster card.
 * Renders one of four distinct typography compositions and handles
 * inline deep-dive drawer reveal on tap.
 */
const ThoughtAtom: React.FC<ThoughtAtomProps> = ({
  card,
  layoutVariant,
  index,
  isSaved,
  onToggleSave,
  onTriggerToast,
}) => {
  const [isDeepDiveOpen, setIsDeepDiveOpen] = useState(false);

  const handleCardTap = useCallback(
    (e: React.MouseEvent) => {
      // Don't trigger deep dive if clicking a button
      const target = e.target as HTMLElement;
      if (target.closest("button")) return;
      setIsDeepDiveOpen(true);
      onTriggerToast("Opening Deep Dive essay!");
    },
    [onTriggerToast]
  );

  const handleCloseDeepDive = useCallback(() => {
    setIsDeepDiveOpen(false);
    onTriggerToast("Closed Deep Dive reading layer.");
  }, [onTriggerToast]);

  return (
    <div id={`thought-atom-${index}`} className="thought-atom relative" data-card-index={index}>
      {/* Main Card Surface */}
      <div
        className={`h-full w-full bg-[#FAF8F3] flex flex-col relative cursor-pointer select-none layout-${layoutVariant}`}
        onClick={handleCardTap}
      >
        {/* Subtle grain texture overlay */}
        <div
          className="absolute inset-0 opacity-[0.025] pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.5'/%3E%3C/svg%3E")`,
          }}
        />

        {renderLayout(card, layoutVariant)}

        {/* Attribution Footer */}
        <div className="absolute bottom-0 left-0 right-0 px-5 pb-5">
          <div className="flex items-center justify-between border-t border-[#E8E4DC] pt-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-[#1C1C1E] flex items-center justify-center text-[#FAF8F3] text-[11px] font-serif italic shadow-sm flex-shrink-0">
                {getInitials(card.philosopher)}
              </div>
              <div>
                <p className="text-[11px] font-semibold text-[#1C1C1E] tracking-tight leading-none mb-0.5">
                  {card.philosopher}
                </p>
                <p className="text-[9px] font-normal text-[#B5A48B] tracking-wide uppercase truncate max-w-[160px]">
                  {card.presentation?.title || card.topic}
                </p>
                {/* 4-card Sequence Progress Indicator */}
                <div className="flex items-center gap-1 mt-1.5">
                  {(() => {
                    const match = card.id.match(/_(\d+)$/);
                    const cardSequence = match ? parseInt(match[1], 10) : 1;
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
              id={`bookmark-toggle-btn-${index}`}
              onClick={(e) => {
                e.stopPropagation();
                onToggleSave();
              }}
              className={`flex items-center gap-1 text-[10px] font-semibold py-1.5 px-2.5 rounded-xl border transition-all active:scale-95 ${
                isSaved
                  ? "bg-[#1C1C1E] border-[#1C1C1E] text-[#FAF8F3]"
                  : "bg-white/80 border-[#E8E4DC] text-[#1C1C1E] hover:bg-white hover:border-[#D4CFC5]"
              }`}
            >
              {isSaved ? (
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
      </div>

      {/* Deep Dive Drawer */}
      <AnimatePresence>
        {isDeepDiveOpen && (
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 260 }}
            className="deep-dive-drawer absolute inset-x-0 bottom-0 top-[8%] bg-[#FAF9F5] z-30 flex flex-col rounded-t-[28px] shadow-[0_-8px_40px_rgba(0,0,0,0.12)] border-t border-[#E8E4DC]"
          >
            {/* Drawer handle */}
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 rounded-full bg-[#D4CFC5]" />
            </div>

            {/* Drawer header */}
            <div className="flex items-center justify-between px-5 pb-3 border-b border-[#E8E4DC]">
              <div className="flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-[#B5A48B]" />
                <span className="text-[9px] font-bold font-mono uppercase tracking-[0.15em] text-[#B5A48B]">
                  Deep Dive
                </span>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleCloseDeepDive();
                }}
                className="w-7 h-7 rounded-full bg-[#F0EDE6] hover:bg-[#E8E4DC] flex items-center justify-center text-[#1C1C1E] transition-all"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Reading content */}
            <div className="flex-1 overflow-y-auto px-5 pt-5 pb-8 space-y-4">
              <div className="mb-3 space-y-1.5">
                <span className="text-[9px] font-bold font-mono uppercase tracking-[0.2em] text-[#B5A48B] block">
                  {card.topic}
                </span>
                <h2 className="text-lg font-serif italic text-[#1C1C1E] font-semibold leading-tight">
                  {card.presentation?.title || card.topic}
                </h2>
                <p className="text-[10px] font-mono text-[#B5A48B]/80 font-bold mt-0.5">
                  {card.philosopher}
                </p>
              </div>

              {card.presentation?.reading_parts?.map(
                (part: ReadingPart, partIdx: number, arr: ReadingPart[]) => (
                  <div key={partIdx} className="space-y-1.5 animate-fade-in-up" style={{ animationDelay: `${partIdx * 0.08}s` }}>
                    <p className="text-xs leading-relaxed text-[#3A3A3E] font-serif font-light text-justify">
                      {part.text}
                    </p>
                    {partIdx < arr.length - 1 && (
                      <div className="flex justify-center py-2.5">
                        <span className="text-[8px] text-[#D4CFC5]">❖</span>
                      </div>
                    )}
                  </div>
                )
              )}
            </div>

            {/* Footer */}
            <div className="px-5 py-3 border-t border-[#E8E4DC] text-center text-[8px] font-mono text-[#B5A48B] uppercase tracking-widest">
              End of Essay
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

/**
 * Renders the appropriate typographic layout for a card.
 */
function renderLayout(card: FeedCard, variant: LayoutVariant) {
  switch (variant) {
    case "thesis":
      return (
        <div className="flex-1 flex flex-col items-center justify-center text-center px-6 pb-16">
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#B5A48B] mb-4">
            {card.topic}
          </span>
          <h1 className="atom-title font-serif text-[2rem] leading-[1.08] font-semibold italic text-[#1C1C1E] mb-5 tracking-tight">
            {card.explore_title}
          </h1>
          <p className="atom-subtext text-[0.8125rem] leading-[1.7] text-[#6B6B6F] font-light max-w-[85%]">
            {card.explore_subtext}
          </p>
        </div>
      );

    case "blockquote":
      return (
        <div className="flex-1 flex flex-col justify-center text-right px-6 pr-6 pl-8 pb-16 relative overflow-hidden">
          {/* Giant monogram watermark */}
          <span className="atom-monogram absolute left-[-1.5rem] top-1/2 -translate-y-1/2 font-[var(--font-literary)] text-[14rem] font-semibold text-[#1C1C1E] opacity-[0.03] leading-none pointer-events-none select-none">
            {getInitials(card.philosopher).charAt(0)}
          </span>
          <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#B5A48B] mb-4 relative z-[1]">
            {card.topic}
          </span>
          <h1 className="atom-title text-[1.375rem] leading-[1.35] font-normal italic text-[#1C1C1E] mb-4 relative z-[1]" style={{ fontFamily: "var(--font-literary)" }}>
            "{card.explore_title}"
          </h1>
          <p className="atom-subtext text-[0.75rem] leading-[1.65] text-[#6B6B6F] font-light relative z-[1]">
            {card.explore_subtext}
          </p>
        </div>
      );

    case "fragment":
      return (
        <div className="flex-1 flex flex-col justify-center px-5 pb-16">
          <div className="flex items-center gap-2 mb-5">
            <div className="h-[2px] w-8 bg-[#B5A48B] opacity-50" />
            <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#B5A48B]">
              {card.topic}
            </span>
          </div>
          <h1 className="atom-title text-[1.125rem] leading-[1.6] font-medium text-[#1C1C1E] text-justify mb-5" style={{ letterSpacing: "-0.025em", fontFamily: "var(--font-sans)", hyphens: "auto" }}>
            {card.explore_title}. {card.explore_subtext}
          </h1>
          <p className="atom-subtext text-[0.8125rem] leading-[1.6] text-[#8A8A8E] font-normal italic text-justify font-serif">
            — {card.philosopher}
          </p>
        </div>
      );

    case "epigraph":
      return (
        <div className="flex-1 flex flex-col items-center justify-center text-center px-7 pb-16">
          <span className="atom-label text-[0.625rem] font-bold uppercase tracking-[0.25em] text-[#B5A48B] mb-5">
            {card.topic}
          </span>
          <div className="atom-rule w-8 h-px bg-[#D4CFC5] mb-5" />
          <h1 className="atom-title text-[1.5rem] leading-[1.35] font-normal italic text-[#1C1C1E] mb-5" style={{ fontFamily: "var(--font-literary)" }}>
            {card.explore_title}
          </h1>
          <div className="atom-rule-bottom w-8 h-px bg-[#D4CFC5] mb-4" />
          <p className="atom-subtext text-[0.6875rem] leading-[1.7] text-[#8A8A8E] font-light max-w-[90%]">
            {card.explore_subtext}
          </p>
        </div>
      );
  }
}

export default ThoughtAtom;
