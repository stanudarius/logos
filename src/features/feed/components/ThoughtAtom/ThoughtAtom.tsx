import React, { useState, useCallback, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "motion/react";
import { BookOpen, X, MessageCircle, Heart, Share as ShareIcon, Timer } from "lucide-react";
import type { FeedCard, LayoutVariant, ReadingPart } from "@/src/features/feed/types";
import { getInitials } from "@/src/utils/aesthetics";
import SocraticChat from "@/src/features/chat/components/SocraticChat";
import FocusLock from "react-focus-lock";

import { useNavigation } from "@/src/providers/NavigationProvider";
import { LayoutRenderer } from "./LayoutRenderer";
import { useCardExport } from "@/src/features/feed/hooks/useCardExport";

interface ThoughtAtomProps {
  card: FeedCard;
  layoutVariant: LayoutVariant;
  index: number;
  isSaved: boolean;
  onToggleSave: (index: number) => void;
  onOpenDeepDive?: (index: number) => void;
  onOpenChat?: (index: number) => void;
  isActive?: boolean;
  isTrailMode?: boolean;
}

const ThoughtAtom: React.FC<ThoughtAtomProps> = ({
  card,
  layoutVariant,
  index,
  isSaved,
  onToggleSave,
  onOpenDeepDive,
  onOpenChat,
  isActive = false,
  isTrailMode = false
}) => {
  const { setIsZenModeOpen, isDeepDiveOpen, setIsDeepDiveOpen } = useNavigation();
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [showHeart, setShowHeart] = useState(false);
  const heartTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isMountedRef = useRef(true);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      if (heartTimeoutRef.current) clearTimeout(heartTimeoutRef.current);
    };
  }, []);



  const handleDoubleTap = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      const target = e.target as HTMLElement;
      if (target.closest("button")) return;
      if (layoutVariant === "interstitial") return;

      if (!isSaved) {
        onToggleSave(index);
        setShowHeart(true);
        if (heartTimeoutRef.current) clearTimeout(heartTimeoutRef.current);
        heartTimeoutRef.current = setTimeout(() => {
          if (isMountedRef.current) setShowHeart(false);
        }, 1000);
      }

      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate([30, 50, 30]);
      }
    },
    [index, isSaved, layoutVariant, onToggleSave]
  );

  const handleCloseDeepDive = useCallback(() => setIsDeepDiveOpen(false), []);
  const handleCloseChat = useCallback(() => setIsChatOpen(false), []);

  const containerRef = useRef<HTMLDivElement>(null);
  const { isExporting, handleExportImage } = useCardExport(card, containerRef);

  return (
    <div
      id={`thought-atom-${index}`}
      ref={containerRef}
      className="thought-atom relative overflow-hidden h-full w-full snap-center"
      data-card-index={index}
    >
      {/* Main Card Surface */}
      <motion.div
        ref={cardRef}
        className={`h-full w-full bg-[#FAF8F3] flex flex-col relative select-none layout-${layoutVariant}`}
        onDoubleClick={handleDoubleTap}
      >
        {/* Subtle grain texture overlay with cinematic parallax is rendered once at PhoneEmulator level */}

        {/* Double Tap Heart Overlay */}
        <AnimatePresence>
          {showHeart && (
            <motion.div
              initial={{ scale: 0.5, opacity: 0, rotate: -15 }}
              animate={{ scale: 1.8, opacity: 0.85, rotate: 0 }}
              exit={{ scale: 2.2, opacity: 0 }}
              transition={{ type: "spring", stiffness: 220, damping: 14 }}
              className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none"
            >
              <Heart className="w-32 h-32 text-red-500 fill-current drop-shadow-2xl" />
            </motion.div>
          )}
        </AnimatePresence>

        <LayoutRenderer card={card} layoutVariant={layoutVariant} />
      </motion.div>

      {/* Author Footer (Clickable to open Deep Dive) */}
      {layoutVariant !== "interstitial" && (
        <div
          className={`absolute bottom-5 left-5 z-40 pointer-events-auto transition-all duration-300 ${isExporting ? 'right-5' : 'right-16'}`}
          onClick={(e) => {
            e.stopPropagation();
            setIsDeepDiveOpen(true);
            onOpenDeepDive?.(index);
          }}
        >
          <div className="flex items-center justify-between w-full cursor-pointer group">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-[#1C1C1E] flex items-center justify-center text-[#FAF8F3] text-[11px] font-serif italic flex-shrink-0 group-active:scale-95 transition-transform">
                {getInitials(card.philosopher)}
              </div>
              <div>
                <p className="text-[11px] font-semibold text-[#1C1C1E] tracking-tight leading-none mb-0.5 group-hover:underline">
                  {card.philosopher}
                </p>
                <p className="text-[9px] font-normal text-[#B5A48B] tracking-wide uppercase truncate max-w-[160px]">
                  {card.presentation?.title || card.topic}
                </p>
                {/* 4-card Sequence Progress Indicator */}
                {isTrailMode && (
                  <div className="flex items-center gap-1 mt-1.5">
                    {(() => {
                      const cardSequence = (index % 5) + 1;
                      return [...Array(4)].map((_, i) => (
                        <div
                          key={i}
                          className={`h-[2px] w-2.5 rounded-full transition-all ${i < cardSequence ? "bg-[#B5A48B]" : "bg-[#E8E4DC]"}`}
                        />
                      ));
                    })()}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Vertical Action Bar */}
      {layoutVariant !== "interstitial" && isActive && (
        <div className="absolute right-3 bottom-[88px] z-40 flex flex-col gap-3.5 pointer-events-auto action-bar-exclude">
          <button
            id={`bookmark-toggle-btn-${index}`}
            onClick={() => onToggleSave(index)}
            aria-label={isSaved ? "Remove from Vault" : "Save to Vault"}
            className="group flex flex-col items-center gap-1 active:scale-90 hover:scale-110 transition-transform duration-200"
          >
            <div className={`w-9 h-9 rounded-full backdrop-blur-md shadow-lg border flex items-center justify-center transition-all ${
              isSaved
                ? "bg-red-50/90 border-red-200"
                : "bg-white/80 border-[#E8E4DC]"
            }`}>
              {isSaved ? <Heart className="w-4 h-4 text-red-500 fill-current" /> : <Heart className="w-4 h-4 text-[#1C1C1E]" />}
            </div>
          </button>

          <button
            onClick={handleExportImage}
            disabled={isExporting}
            aria-label="Export as Image"
            className={`group flex flex-col items-center gap-1 active:scale-90 hover:scale-110 transition-transform duration-200 ${isExporting ? 'opacity-50 pointer-events-none' : ''}`}
          >
            <div className="w-9 h-9 rounded-full bg-white/80 backdrop-blur-md shadow-lg border border-[#E8E4DC] flex items-center justify-center">
              <ShareIcon className="w-3.5 h-3.5 text-[#1C1C1E] ml-px" />
            </div>
          </button>

          <button
            onClick={() => {
              setIsDeepDiveOpen(true);
              onOpenDeepDive?.(index);
            }}
            aria-label="Read Deep Dive Essay"
            className="group flex flex-col items-center gap-1 active:scale-90 hover:scale-110 transition-transform duration-200"
          >
            <div className="w-9 h-9 rounded-full bg-white/80 backdrop-blur-md shadow-lg border border-[#E8E4DC] flex items-center justify-center">
              <BookOpen className="w-3.5 h-3.5 text-[#1C1C1E]" />
            </div>
          </button>
        </div>
      )}

      {isActive && (
        <AnimatePresence>
          {isDeepDiveOpen && (
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "tween", duration: 0.25, ease: "easeOut" }}
              className="absolute inset-0 z-[60] flex flex-col shadow-[0_-10px_30px_rgba(0,0,0,0.1)] pointer-events-auto"
              style={{
                willChange: "transform",
                background: "linear-gradient(to bottom, #F5F3ED 0%, #FFFFFF 60%)",
                borderTop: "3px solid #B5A48B",
              }}
              onClick={(e) => e.stopPropagation()}
              onWheel={(e) => e.stopPropagation()}
              onTouchMove={(e) => e.stopPropagation()}
            >
              <FocusLock returnFocus autoFocus={false} className="flex flex-col h-full w-full">
                {/* Header */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-[#E8E4DC]">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-[#B5A48B]" />
                    <span className="text-[9px] font-bold font-mono uppercase tracking-[0.15em] text-[#B5A48B]">
                      Deep Dive
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCloseDeepDive();
                      }}
                      aria-label="Close Deep Dive"
                      className="w-7 h-7 rounded-full bg-[#F0EDE6] hover:bg-[#E8E4DC] flex items-center justify-center text-[#1C1C1E] transition-all"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Reading content */}
                <div className="flex-1 overflow-y-auto px-5 pt-5 pb-8 space-y-4" style={{ overscrollBehaviorY: "contain" }}>
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
                <div className="px-5 py-3 border-t border-[#E8E4DC] text-center text-[8px] font-mono text-[#B5A48B] uppercase tracking-widest pb-12">
                  End of Essay
                </div>

              </FocusLock>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  );
};

export default React.memo(ThoughtAtom);
