import React, { useState, useCallback, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence, useTransform, Variants, useMotionValue, useSpring } from "motion/react";

import { BookOpen, X, MessageCircle, Heart } from "lucide-react";
import type { FeedCard, LayoutVariant, ReadingPart } from "../types";
import { getInitials } from "../utils/aesthetics";
import SocraticChat from "./SocraticChat";
import FocusLock from "react-focus-lock";

interface ThoughtAtomProps {
  card: FeedCard;
  layoutVariant: LayoutVariant;
  index: number;
  isSaved: boolean;
  onToggleSave: (index: number) => void;
  onTriggerToast: (msg: string) => void;
  onOpenDeepDive?: (index: number) => void;
  onOpenChat?: (index: number) => void;
  isActive?: boolean;
}

const ParallaxBackground = () => {
  const motionX = useMotionValue(0);
  const motionY = useMotionValue(0);
  const smoothX = useSpring(motionX, { damping: 40, stiffness: 150 });
  const smoothY = useSpring(motionY, { damping: 40, stiffness: 150 });

  useEffect(() => {
    let ticking = false;
    let rAF: number;

    const handleMouseMove = (e: MouseEvent) => {
      if (!ticking) {
        rAF = requestAnimationFrame(() => {
          const x = (e.clientX / window.innerWidth - 0.5) * 20;
          const y = (e.clientY / window.innerHeight - 0.5) * 20;
          motionX.set(x);
          motionY.set(y);
          ticking = false;
        });
        ticking = true;
      }
    };

    const handleDeviceOrientation = (e: DeviceOrientationEvent) => {
      if (e.gamma === null || e.beta === null) return;
      if (!ticking) {
        rAF = requestAnimationFrame(() => {
          const x = Math.min(Math.max(e.gamma! / 4.5, -10), 10);
          const y = Math.min(Math.max((e.beta! - 45) / 4.5, -10), 10);
          motionX.set(x);
          motionY.set(y);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    if (typeof window !== 'undefined' && window.DeviceOrientationEvent) {
      window.addEventListener("deviceorientation", handleDeviceOrientation, { passive: true });
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (typeof window !== 'undefined' && window.DeviceOrientationEvent) {
        window.removeEventListener("deviceorientation", handleDeviceOrientation);
      }
      cancelAnimationFrame(rAF);
    };
  }, [motionX, motionY]);

  return (
    <motion.div
      id="parallax-bg"
      style={{
        x: smoothX,
        y: smoothY,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.5'/%3E%3C/svg%3E")`,
      }}
      className="absolute inset-0 opacity-[0.035] pointer-events-none scale-[1.05]"
    />
  );
};


const ThoughtAtom: React.FC<ThoughtAtomProps> = ({
  card,
  layoutVariant,
  index,
  isSaved,
  onToggleSave,
  onTriggerToast,
  onOpenDeepDive,
  onOpenChat,
  isActive
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
        }, 800);
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
        {/* Subtle grain texture overlay with cinematic parallax (ONLY rendered when active to save GPU texture memory) */}
        {isActive && <ParallaxBackground />}

        {/* Double Tap Heart Overlay */}
        <AnimatePresence>
          {showHeart && (
            <motion.div
              initial={{ scale: 0.5, opacity: 0, rotate: -15 }}
              animate={{ scale: 1.5, opacity: 0.8, rotate: 0 }}
              exit={{ scale: 2, opacity: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
              className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none"
            >
              <Heart className="w-32 h-32 text-red-500 fill-current drop-shadow-2xl" />
            </motion.div>
          )}
        </AnimatePresence>

        {renderLayout(card, layoutVariant, index)}
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
                <div className="flex items-center gap-1 mt-1.5">
                  {(() => {
                    // Progress reflects the 4-card rhythm leading up to an interstitial, 
                    // or the position in a 4-card Trail.
                    const cardSequence = (index % 5) + 1;
                    return [...Array(4)].map((_, i) => (
                      <div
                        key={i}
                        className={`h-[2px] w-2.5 rounded-full transition-all ${i < cardSequence ? "bg-[#B5A48B]" : "bg-[#E8E4DC]"
                          }`}
                      />
                    ));
                  })()}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Vertical Action Bar (TikTok Style) */}
      {layoutVariant !== "interstitial" && (
        <div className="absolute right-3 bottom-24 z-40 flex flex-col gap-5 pointer-events-auto">
          <button
            id={`bookmark-toggle-btn-${index}`}
            onClick={() => onToggleSave(index)}
            aria-label={isSaved ? "Remove from Vault" : "Save to Vault"}
            className="group flex flex-col items-center gap-1 active:scale-90 transition-transform"
          >
            <div className="w-10 h-10 rounded-full bg-white/80 backdrop-blur-md shadow-lg border border-[#E8E4DC] flex items-center justify-center">
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
            className="group flex flex-col items-center gap-1 active:scale-90 transition-transform"
          >
            <div className="w-10 h-10 rounded-full bg-[#1C1C1E] shadow-lg border border-[#3A3A3E] flex items-center justify-center">
              <BookOpen className="w-4 h-4 text-[#FAF8F3]" />
            </div>
            <span className="text-[9px] font-bold text-[#1C1C1E] drop-shadow-sm">Read</span>
          </button>

          <button
            onClick={() => {
              setIsChatOpen(true);
              onOpenChat?.(index);
            }}
            aria-label="Debate with AI"
            className="group flex flex-col items-center gap-1 active:scale-90 transition-transform"
          >
            <div className="w-10 h-10 rounded-full bg-[#FAF8F3] shadow-lg border border-[#D4CFC5] flex items-center justify-center">
              <MessageCircle className="w-4 h-4 text-[#B5A48B]" />
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
              className="absolute inset-0 z-[60] bg-[#FAF8F3] flex flex-col shadow-[0_-10px_30px_rgba(0,0,0,0.1)] pointer-events-auto"
              style={{ willChange: "transform, opacity, border-radius" }}
              onClick={(e) => e.stopPropagation()}
              onWheel={(e) => e.stopPropagation()} // Stop scroll bubbling
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

const TypewriterText = ({ text, className, speed = 0.04, delay = 0.2 }: { text: string; className?: string; speed?: number; delay?: number }) => {
  return (
    <motion.span
      className={className}
      initial={{ opacity: 0, y: 5 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: delay, ease: "easeOut" }}
      viewport={{ once: true, amount: 0.1 }}
      style={{ display: "inline-block", willChange: "transform, opacity" }}
    >
      {text}
    </motion.span>
  );
};

/**
 * Universal Giant Monogram
 */
const Monogram = ({ philosopher }: { philosopher: string }) => (
  <motion.span
    initial={{ scale: 1.4, opacity: 0 }}
    whileInView={{ scale: 1, opacity: 0.07 }}
    transition={{ duration: 1.2, ease: "easeOut" }}
    viewport={{ once: false, amount: 0.2 }}
    style={{ willChange: "transform, opacity" }}
    className="atom-monogram absolute left-[-1.5rem] top-1/2 -translate-y-1/2 font-[var(--font-literary)] text-[14rem] font-semibold text-[#1C1C1E] leading-none pointer-events-none select-none z-0"
  >
    {getInitials(philosopher).charAt(0)}
  </motion.span>
);

/**
 * Common Animation Variants
 */
const titleAnim = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0, opacity: 1,
    transition: { type: "spring", stiffness: 200, damping: 15, delay: 0.5 }
  }
};

const descAnim = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, delay: 0.8, ease: "easeOut" } }
};

/**
 * Renders the appropriate typographic layout for a card.
 */
function renderLayout(card: FeedCard, variant: LayoutVariant, index: number = 0) {
  switch (variant) {
    case "interstitial": {
      const words = card.explore_title.split(' ');
      const hugeWord = words[words.length - 1];
      const restTitle = words.slice(0, -1).join(' ') || card.topic;

      return (
        <div className="flex-1 w-full h-full bg-[#F5F0E8] relative overflow-hidden">

          {/* ENORMOUS bleeding word - pinned to top right, colliding with the edge */}
          <motion.div
            initial={{ x: 50, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="absolute top-8 -right-12 text-[14rem] sm:text-[16rem] font-serif italic tracking-tighter leading-[0.75] text-[#E6DFD3] select-none pointer-events-none z-0"
            style={{ willChange: "transform, opacity" }}
          >
            {hugeWord}
          </motion.div>

          {/* Extreme tension split: Muted terracotta line physically slicing the layout */}
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "circOut" }}
            className="absolute top-[45%] left-0 w-[65%] h-[2px] bg-[#C1694F] origin-left z-10"
          />

          {/* The rest of the title - tiny, mono, sitting exactly on the structural slice */}
          <div className="absolute top-[45%] left-6 -translate-y-full pb-3 z-10">
            <span className="text-[9px] font-mono uppercase tracking-[0.4em] text-[#2C2825]">
              {restTitle}
            </span>
          </div>

          {/* Body text: Pinned hard to the right edge, under the slice, uncomfortably narrow */}
          <motion.div
            variants={descAnim} initial="hidden" whileInView="visible" viewport={{ once: false }}
            className="absolute top-[45%] right-6 pt-6 w-[55%] z-10"
          >
            <p className="text-[13px] font-serif text-[#2C2825] leading-[1.65] text-right">
              {card.explore_subtext}
            </p>
          </motion.div>

        </div>
      );
    }

    case "thesis":
      return (
        <div className="flex-1 flex flex-col items-center justify-center text-center px-6 pb-16 relative overflow-hidden">
          <Monogram philosopher={card.philosopher} />
          <TypewriterText text={card.topic} className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#B5A48B] mb-4 relative z-10" />

          <motion.h1
            variants={titleAnim} initial="hidden" whileInView="visible" viewport={{ once: false }}
            className="atom-title font-serif text-[2rem] leading-[1.08] font-semibold italic text-[#1C1C1E] mb-5 tracking-tight relative z-10"
          >
            <TypewriterText text={card.explore_title} speed={0.015} delay={0.4} />
          </motion.h1>
          <motion.p
            variants={descAnim} initial="hidden" whileInView="visible" viewport={{ once: false }}
            className="atom-subtext text-[0.8125rem] leading-[1.7] text-[#6B6B6F] font-light max-w-[85%] relative z-10"
          >
            {card.explore_subtext}
          </motion.p>
        </div>
      );

    case "blockquote":
      return (
        <div className="flex-1 flex flex-col justify-center text-right px-6 pr-6 pl-8 pb-16 relative overflow-hidden">
          <Monogram philosopher={card.philosopher} />

          <TypewriterText text={card.topic} className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#B5A48B] mb-4 relative z-10" />

          <motion.h1
            variants={titleAnim} initial="hidden" whileInView="visible" viewport={{ once: false }}
            className="atom-title text-[1.375rem] leading-[1.35] font-normal italic text-[#1C1C1E] mb-4 relative z-10" style={{ fontFamily: "var(--font-literary)" }}
          >
            "<TypewriterText text={card.explore_title} speed={0.015} delay={0.4} />"
          </motion.h1>
          <motion.p
            variants={descAnim} initial="hidden" whileInView="visible" viewport={{ once: false }}
            className="atom-subtext text-[0.75rem] leading-[1.65] text-[#6B6B6F] font-light relative z-10"
          >
            {card.explore_subtext}
          </motion.p>
        </div>
      );

    case "fragment":
      return (
        <div className="flex-1 flex flex-col justify-center px-5 pb-16 relative overflow-hidden">
          <Monogram philosopher={card.philosopher} />

          <div className="flex items-center gap-2 mb-5 relative z-10">
            <div className="h-[2px] w-8 bg-[#B5A48B] opacity-50" />
            <TypewriterText text={card.topic} className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#B5A48B]" />
          </div>
          <motion.h1
            variants={titleAnim} initial="hidden" whileInView="visible" viewport={{ once: false }}
            className="atom-title text-[1.125rem] leading-[1.6] font-medium text-[#1C1C1E] text-justify mb-5 relative z-10" style={{ letterSpacing: "-0.025em", fontFamily: "var(--font-sans)", hyphens: "auto" }}
          >
            <TypewriterText text={card.explore_title} speed={0.015} delay={0.4} />. {card.explore_subtext}
          </motion.h1>
          <motion.p
            variants={descAnim} initial="hidden" whileInView="visible" viewport={{ once: false }}
            className="atom-subtext text-[0.8125rem] leading-[1.6] text-[#8A8A8E] font-normal italic text-justify font-serif relative z-10"
          >
            — {card.philosopher}
          </motion.p>
        </div>
      );

    case "epigraph":
      return (
        <div className="flex-1 flex flex-col items-center justify-center text-center px-7 pb-16 relative overflow-hidden">
          <Monogram philosopher={card.philosopher} />

          <TypewriterText text={card.topic} className="atom-label text-[0.625rem] font-bold uppercase tracking-[0.25em] text-[#B5A48B] mb-5 relative z-10 block" />

          <div className="atom-rule w-8 h-px bg-[#D4CFC5] mb-5 relative z-10" />
          <motion.h1
            variants={titleAnim} initial="hidden" whileInView="visible" viewport={{ once: false }}
            className="atom-title text-[1.5rem] leading-[1.35] font-normal italic text-[#1C1C1E] mb-5 relative z-10" style={{ fontFamily: "var(--font-literary)" }}
          >
            <TypewriterText text={card.explore_title} speed={0.015} delay={0.4} />
          </motion.h1>
          <div className="atom-rule-bottom w-8 h-px bg-[#D4CFC5] mb-4 relative z-10" />
          <motion.p
            variants={descAnim} initial="hidden" whileInView="visible" viewport={{ once: false }}
            className="atom-subtext text-[0.6875rem] leading-[1.7] text-[#8A8A8E] font-light max-w-[90%] relative z-10"
          >
            {card.explore_subtext}
          </motion.p>
        </div>
      );
  }
}

export default React.memo(ThoughtAtom);
