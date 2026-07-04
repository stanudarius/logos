import React, { useState, useCallback, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "motion/react";
import { BookOpen, X, MessageCircle, Heart } from "lucide-react";
import type { FeedCard, LayoutVariant, ReadingPart } from "../types/feed";
import { getInitials } from "../utils/aesthetics";
import SocraticChat from "./SocraticChat";
import FocusLock from "react-focus-lock";

import { InterstitialLayout } from "./layouts/InterstitialLayout";
import { ThesisLayout } from "./layouts/ThesisLayout";
import { BlockquoteLayout } from "./layouts/BlockquoteLayout";
import { FragmentLayout } from "./layouts/FragmentLayout";
import { EpigraphLayout } from "./layouts/EpigraphLayout";

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
  isActive,
  isTrailMode = false
}) => {
  const [isDeepDiveOpen, setIsDeepDiveOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [showHeart, setShowHeart] = useState(false);
  const heartTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isMountedRef = useRef(true);

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

      // Haptic feedback (Double Pop)
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate([30, 50, 30]);
      }
    },
    [index, isSaved, layoutVariant, onToggleSave]
  );

  const handleCloseDeepDive = useCallback(() => setIsDeepDiveOpen(false), []);
  const handleCloseChat = useCallback(() => setIsChatOpen(false), []);

  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div
      id={`thought-atom-${index}`}
      ref={containerRef}
      className="thought-atom relative overflow-hidden h-full w-full snap-center"
      data-card-index={index}
    >
      {/* Main Card Surface */}
      <motion.div
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

        {layoutVariant === "interstitial" && <InterstitialLayout card={card} />}
        {layoutVariant === "thesis" && <ThesisLayout card={card} />}
        {layoutVariant === "blockquote" && <BlockquoteLayout card={card} />}
        {layoutVariant === "fragment" && <FragmentLayout card={card} />}
        {(layoutVariant === "epigraph" || !layoutVariant) && <EpigraphLayout card={card} />}
      </motion.div>

      {/* Author Footer (Clickable to open Deep Dive) */}
      {layoutVariant !== "interstitial" && (
        <div
          className="absolute bottom-6 left-5 right-16 z-40 pointer-events-auto"
          onClick={(e) => {
            e.stopPropagation();
            setIsDeepDiveOpen(true);
            onOpenDeepDive?.(index);
          }}
        >
          <div className="flex items-center justify-between border-t border-[#E8E4DC] pt-3 w-full cursor-pointer group">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-[#1C1C1E] flex items-center justify-center text-[#FAF8F3] text-[11px] font-serif italic shadow-sm flex-shrink-0 group-active:scale-95 transition-transform">
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
      {layoutVariant !== "interstitial" && (
        <div className="absolute right-3 bottom-24 z-40 flex flex-col gap-5 pointer-events-auto">
          <button
            id={`bookmark-toggle-btn-${index}`}
            onClick={() => onToggleSave(index)}
            aria-label={isSaved ? "Remove from Vault" : "Save to Vault"}
            className="group flex flex-col items-center gap-1 active:scale-90 hover:scale-110 transition-transform duration-200"
          >
            <div className={`w-10 h-10 rounded-full backdrop-blur-md shadow-lg border flex items-center justify-center transition-all ${
              isSaved
                ? "bg-red-50/90 border-red-200"
                : "bg-white/80 border-[#E8E4DC]"
            }`}>
              {isSaved ? <Heart className="w-5 h-5 text-red-500 fill-current" /> : <Heart className="w-5 h-5 text-[#1C1C1E]" />}
            </div>
            <span className="text-[9px] font-bold text-[#1C1C1E] drop-shadow-sm">Save</span>
          </button>

          <button
            onClick={() => {
              setIsDeepDiveOpen(true);
              onOpenDeepDive?.(index);
            }}
            aria-label="Read Deep Dive Essay"
            className="group flex flex-col items-center gap-1 active:scale-90 hover:scale-110 transition-transform duration-200"
          >
            <div className="w-10 h-10 rounded-full bg-white/80 backdrop-blur-md shadow-lg border border-[#E8E4DC] flex items-center justify-center">
              <BookOpen className="w-4 h-4 text-[#1C1C1E]" />
            </div>
            <span className="text-[9px] font-bold text-[#1C1C1E] drop-shadow-sm">Read</span>
          </button>

          <button
            onClick={() => {
              setIsChatOpen(true);
              onOpenChat?.(index);
            }}
            aria-label="Debate with AI"
            className="group flex flex-col items-center gap-1 active:scale-90 hover:scale-110 transition-transform duration-200"
          >
            <div className="w-10 h-10 rounded-full bg-white/80 backdrop-blur-md shadow-lg border border-[#E8E4DC] flex items-center justify-center">
              <MessageCircle className="w-4 h-4 text-[#1C1C1E]" />
            </div>
            <span className="text-[9px] font-bold text-[#1C1C1E] drop-shadow-sm">Debate</span>
          </button>
        </div>
      )}

      {isActive && createPortal(
        <AnimatePresence>
          {isDeepDiveOpen && (
            <motion.div
              initial={{ y: "100%", opacity: 0, borderRadius: "40px" }}
              animate={{ y: 0, opacity: 1, borderRadius: "0px" }}
              exit={{ y: "100%", opacity: 0, borderRadius: "40px" }}
              transition={{ type: "spring", damping: 25, stiffness: 200, mass: 0.8 }}
              className="absolute inset-0 z-[60] flex flex-col shadow-[0_-10px_30px_rgba(0,0,0,0.1)] pointer-events-auto"
              style={{
                willChange: "transform, opacity, border-radius",
                background: "linear-gradient(to bottom, #F5F3ED 0%, #FFFFFF 60%)",
                borderTop: "3px solid #B5A48B",
              }}
              onClick={(e) => e.stopPropagation()}
              onWheel={(e) => e.stopPropagation()}
              onTouchMove={(e) => e.stopPropagation()}
            >
              <FocusLock returnFocus className="flex flex-col h-full w-full">
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
        </AnimatePresence>,
        document.getElementById("phone-device-emulation") || document.body
      )}

      {isActive && createPortal(
        <AnimatePresence>
          {isChatOpen && (
            <SocraticChat
              philosopher={card.philosopher}
              topic={card.topic}
              essayContext={card.presentation?.reading_parts?.map(p => p.text).join(" ") || ""}
              onClose={() => setIsChatOpen(false)}
            />
          )}
        </AnimatePresence>,
        document.getElementById("phone-device-emulation") || document.body
      )}
    </div>
  );
};

export default React.memo(ThoughtAtom);
