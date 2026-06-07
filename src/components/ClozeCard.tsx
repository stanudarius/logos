import React, { useState, useCallback } from "react";

interface ClozeCardProps {
  /** Alternating segments: even indices = visible text, odd indices = blanked words */
  segments: string[];
  /** Called when all blanks have been revealed */
  onAllRevealed: () => void;
}

/**
 * ClozeCard — Renders a "fill-in-the-blank" text block for spaced repetition.
 * Hidden segments appear as tappable blanks that reveal with a spring animation.
 */
const ClozeCard: React.FC<ClozeCardProps> = ({ segments, onAllRevealed }) => {
  const blankedIndices = segments
    .map((_, i) => i)
    .filter((i) => i % 2 === 1);

  const [revealedSet, setRevealedSet] = useState<Set<number>>(new Set());

  const handleReveal = useCallback(
    (index: number) => {
      setRevealedSet((prev) => {
        const next = new Set(prev);
        next.add(index);

        // Check if all blanks are now revealed
        if (blankedIndices.every((i) => next.has(i))) {
          // Delay so the animation plays first
          setTimeout(() => onAllRevealed(), 350);
        }

        return next;
      });
    },
    [blankedIndices, onAllRevealed]
  );

  return (
    <div className="space-y-4">
      {/* Cloze label */}
      <div className="inline-flex items-center gap-1.5 text-[8px] font-bold tracking-widest bg-[#F5F3ED] text-[#B5A48B] border border-[#E8E4DC] px-2 py-0.5 rounded uppercase">
        Cloze Recall
      </div>

      {/* The text with blanks */}
      <p className="text-sm font-serif italic text-[#1C1C1E] leading-relaxed">
        {segments.map((segment, i) => {
          const isBlanked = i % 2 === 1;

          if (!isBlanked) {
            return <span key={i}>{segment}</span>;
          }

          if (revealedSet.has(i)) {
            return (
              <span key={i} className="cloze-revealed animate-reveal-pop">
                {segment}
              </span>
            );
          }

          return (
            <span
              key={i}
              className="cloze-blank"
              onClick={() => handleReveal(i)}
              role="button"
              aria-label="Reveal hidden word"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  handleReveal(i);
                }
              }}
            />
          );
        })}
      </p>

      {/* Progress indicator */}
      <div className="flex items-center gap-1.5 pt-1">
        {blankedIndices.map((idx) => (
          <div
            key={idx}
            className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
              revealedSet.has(idx)
                ? "bg-[#1C1C1E] scale-110"
                : "bg-[#D4CFC5]"
            }`}
          />
        ))}
        <span className="text-[8px] font-mono text-[#B5A48B] ml-1.5">
          {revealedSet.size}/{blankedIndices.length} revealed
        </span>
      </div>
    </div>
  );
};

export default ClozeCard;
