import React, { useState, useCallback } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence, useScroll, useTransform, Variants } from "motion/react";
import { useRef } from "react";
import { Bookmark, BookmarkCheck, BookOpen, X, MessageCircle } from "lucide-react";
import type { FeedCard, LayoutVariant, ReadingPart } from "../types";
import { getInitials } from "../utils/aesthetics";
import SocraticChat from "./SocraticChat";

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
  const [isChatOpen, setIsChatOpen] = useState(false);

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

  const containerRef = useRef<HTMLDivElement>(null);
  
  // Fling Physics based on vertical scroll
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });
  const rotate = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [-15, 0, 0, 15]);
  const scale = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.85, 1, 1, 0.85]);
  const y = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [-50, 0, 0, 50]);

  return (
    <div id={`thought-atom-${index}`} ref={containerRef} className="thought-atom relative overflow-hidden" data-card-index={index}>
      {/* Main Card Surface */}
      <motion.div
        className={`h-full w-full bg-[#FAF8F3] flex flex-col relative cursor-pointer select-none layout-${layoutVariant}`}
        onClick={handleCardTap}
        style={{ rotate, scale, y }}
      >
        {/* Subtle grain texture overlay */}
        <div
          className="absolute inset-0 opacity-[0.025] pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.5'/%3E%3C/svg%3E")`,
          }}
        />

        {renderLayout(card, layoutVariant)}
      </motion.div>

      {/* Deep Dive Drawer */}
      {createPortal(
        <AnimatePresence>
          {isDeepDiveOpen && (
            <motion.div
              initial={{ y: "100%", opacity: 0, borderRadius: "40px" }}
              animate={{ y: 0, opacity: 1, borderRadius: "0px" }}
              exit={{ y: "100%", opacity: 0, borderRadius: "40px" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="absolute inset-0 z-[60] bg-[#FAF8F3] flex flex-col shadow-[0_-10px_30px_rgba(0,0,0,0.1)] pointer-events-auto"
              onClick={(e) => e.stopPropagation()}
              onWheel={(e) => e.stopPropagation()} // Stop scroll bubbling
              onTouchMove={(e) => e.stopPropagation()}
            >
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
                    onClick={(e) => { e.stopPropagation(); e.preventDefault(); setIsChatOpen(true); }}
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-[#1C1C1E] text-[#FAF8F3] hover:bg-[#2C2C2E] text-[9px] font-bold transition-all active:scale-95"
                  >
                    <MessageCircle className="w-3 h-3" />
                    <span>Debate</span>
                  </button>
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

            </motion.div>
          )}
        </AnimatePresence>,
        document.getElementById("phone-device-emulation") || document.body
      )}

      {/* Socratic Chat Overlay */}
      {createPortal(
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

/**
 * Typewriter text component for category labels
 */
const TypewriterText = ({ text, className }: { text: string; className?: string }) => {
  const container: Variants = {
    hidden: { opacity: 1 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.04, delayChildren: 0.2 },
    },
  };
  const child: Variants = {
    hidden: { opacity: 0, y: 5 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.span
      className={className}
      variants={container}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: false, amount: 0.5 }}
    >
      {text.split("").map((char, index) => (
        <motion.span key={index} variants={child}>
          {char}
        </motion.span>
      ))}
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
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, delay: 0.8 } }
};

/**
 * Renders the appropriate typographic layout for a card.
 */
function renderLayout(card: FeedCard, variant: LayoutVariant) {
  switch (variant) {
    case "thesis":
      return (
        <div className="flex-1 flex flex-col items-center justify-center text-center px-6 pb-16 relative overflow-hidden">
          <Monogram philosopher={card.philosopher} />
          <TypewriterText text={card.topic} className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#B5A48B] mb-4 relative z-10" />
          
          <motion.h1 
            variants={titleAnim} initial="hidden" whileInView="visible" viewport={{ once: false }}
            className="atom-title font-serif text-[2rem] leading-[1.08] font-semibold italic text-[#1C1C1E] mb-5 tracking-tight relative z-10"
          >
            {card.explore_title}
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
            "{card.explore_title}"
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
            {card.explore_title}. {card.explore_subtext}
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
            {card.explore_title}
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

export default ThoughtAtom;
