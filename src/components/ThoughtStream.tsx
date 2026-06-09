import React, { useRef, useEffect, useCallback, useState } from "react";
import type { FeedCard, LayoutVariant } from "../types";
import ThoughtAtom from "./ThoughtAtom";

const LAYOUT_CYCLE: LayoutVariant[] = ["thesis", "blockquote", "fragment", "epigraph"];

interface ThoughtStreamProps {
  cards: FeedCard[];
  isLoading: boolean;
  onActiveCardChange: (index: number) => void;
  onFetchMore: () => void;
  isCardSaved: (index: number) => boolean;
  onToggleSave: (index: number) => void;
  onTriggerToast: (msg: string) => void;
  onOpenDeepDive?: (index: number) => void;
  onOpenChat?: (index: number) => void;
}

/**
 * ThoughtStream — CSS scroll-snap container for the vertical "TikTok" feed.
 * Uses IntersectionObserver for tracking the active card and triggering
 * infinite scroll at the bottom. Hardware-accelerated via native scrolling.
 */
const ThoughtStream: React.FC<ThoughtStreamProps> = ({
  cards,
  isLoading,
  onActiveCardChange,
  onFetchMore,
  isCardSaved,
  onToggleSave,
  onTriggerToast,
  onOpenDeepDive,
  onOpenChat
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const sentinelObserverRef = useRef<IntersectionObserver | null>(null);

  // Track which card is centered via IntersectionObserver
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
            const idx = Number(
              (entry.target as HTMLElement).dataset.cardIndex
            );
            if (!isNaN(idx)) {
              setActiveIndex(idx);
              onActiveCardChange(idx);
            }
          }
        }
      },
      {
        root: container,
        threshold: 0.5,
      }
    );

    const atoms = container.querySelectorAll(".thought-atom");
    atoms.forEach((atom) => observerRef.current?.observe(atom));

    return () => {
      observerRef.current?.disconnect();
    };
  }, [cards.length, onActiveCardChange]);

  // Infinite scroll sentinel — observe the last 2 cards
  useEffect(() => {
    const container = containerRef.current;
    if (!container || cards.length < 2) return;

    sentinelObserverRef.current = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            onFetchMore();
          }
        }
      },
      {
        root: container,
        threshold: 0.1,
      }
    );

    const atoms = container.querySelectorAll(".thought-atom");
    const sentinel = atoms[atoms.length - 2]; // 2nd to last card
    if (sentinel) {
      sentinelObserverRef.current.observe(sentinel);
    }

    return () => {
      sentinelObserverRef.current?.disconnect();
    };
  }, [cards.length, onFetchMore]);

  // Keyboard navigation for desktop (scroll by card height)
  const scrollToCard = useCallback(
    (direction: "up" | "down") => {
      const container = containerRef.current;
      if (!container) return;
      const nextIndex =
        direction === "down"
          ? Math.min(activeIndex + 1, cards.length - 1)
          : Math.max(activeIndex - 1, 0);

      const atoms = container.querySelectorAll(".thought-atom");
      atoms[nextIndex]?.scrollIntoView({ behavior: "smooth", block: "center" });
    },
    [activeIndex, cards.length]
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        document.activeElement?.tagName === "INPUT" ||
        document.activeElement?.tagName === "TEXTAREA"
      ) {
        return;
      }
      if (e.key === "ArrowDown") {
        e.preventDefault();
        scrollToCard("down");
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        scrollToCard("up");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [scrollToCard]);

  /** Programmatically scroll to first card (used after filter) */
  const scrollToTop = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;
    container.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  // Expose scrollToTop via ref-based imperative handle
  // (parent can also just re-render with new cards which resets scroll)
  useEffect(() => {
    // Reset scroll position when cards array is re-ordered (filter by thinker)
    const container = containerRef.current;
    if (container) {
      container.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
    }
  }, [cards[0]?.id]); // Re-run when the first card changes (i.e., re-sorted)

  return (
    <div
      ref={containerRef}
      className="thought-stream h-full w-full overflow-y-auto snap-y snap-mandatory scroll-smooth"
      style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }} // Hide scrollbar for a cleaner look
    >
      {cards.map((card, index) => (
        <ThoughtAtom
          key={card.id}
          card={card}
          layoutVariant={LAYOUT_CYCLE[index % LAYOUT_CYCLE.length]}
          index={index}
          isSaved={isCardSaved(index)}
          onToggleSave={onToggleSave}
          onTriggerToast={onTriggerToast}
          onOpenDeepDive={onOpenDeepDive}
          onOpenChat={onOpenChat}
        />
      ))}
    </div>
  );
};

export default ThoughtStream;
