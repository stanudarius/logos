import React, { useRef, useEffect, useCallback, useState, memo } from "react";
import type { FeedCard, LayoutVariant } from "../types";
import ThoughtAtom from "./ThoughtAtom";

const LAYOUT_CYCLE: LayoutVariant[] = ["thesis", "blockquote", "fragment", "epigraph"];

interface ThoughtStreamProps {
  cards: FeedCard[];
  isLoading: boolean;
  onActiveCardChange: (index: number) => void;
  onFetchMore: () => void;
  savedVaultCardIds: Set<string>;
  onToggleSave: (index: number) => void;
  onOpenDeepDive?: (index: number) => void;
  onOpenChat?: (index: number) => void;
  isTrailMode?: boolean;
  isActiveTab?: boolean;
}

/**
 * ThoughtStream — CSS scroll-snap container for the vertical feed.
 * Tracks active card via scroll events and infinite scroll at the bottom.
 */
const ThoughtStream: React.FC<ThoughtStreamProps> = ({
  cards,
  isLoading,
  onActiveCardChange,
  onFetchMore,
  savedVaultCardIds,
  onToggleSave,
  onOpenDeepDive,
  onOpenChat,
  isTrailMode = false,
  isActiveTab = true
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const sentinelObserverRef = useRef<IntersectionObserver | null>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);

  const cardObserverRef = useRef<IntersectionObserver | null>(null);

  const isLoadingRef = useRef(isLoading);
  useEffect(() => {
    isLoadingRef.current = isLoading;
  }, [isLoading]);

  const onFetchMoreRef = useRef(onFetchMore);
  useEffect(() => {
    onFetchMoreRef.current = onFetchMore;
  }, [onFetchMore]);

  // Active card tracking via IntersectionObserver (O(1) performance instead of onScroll reflows)
  useEffect(() => {
    if (!isActiveTab) {
      if (cardObserverRef.current) {
        cardObserverRef.current.disconnect();
        cardObserverRef.current = null;
      }
      return;
    }

    const container = containerRef.current;
    if (!container) return;

    if (cardObserverRef.current) {
      cardObserverRef.current.disconnect();
    }

    cardObserverRef.current = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const indexStr = entry.target.getAttribute("data-card-index");
            if (indexStr !== null) {
              const newIndex = parseInt(indexStr, 10);
              setActiveIndex((prev) => {
                if (prev !== newIndex) {
                  onActiveCardChange(newIndex);

                  // Backup trigger
                  if (newIndex >= cards.length - 2 && !isLoadingRef.current) {
                    onFetchMoreRef.current();
                  }
                  return newIndex;
                }
                return prev;
              });
            }
          }
        }
      },
      { root: container, threshold: 0.6 } // Card is considered active when 60% visible
    );

    const atoms = container.querySelectorAll(".thought-atom");
    atoms.forEach((atom) => cardObserverRef.current?.observe(atom));

    return () => {
      if (cardObserverRef.current) {
        cardObserverRef.current.disconnect();
      }
    };
  }, [cards.length, onActiveCardChange, isActiveTab]);



  useEffect(() => {
    if (!isActiveTab) {
      if (sentinelObserverRef.current) {
        sentinelObserverRef.current.disconnect();
        sentinelObserverRef.current = null;
      }
      return;
    }

    const container = containerRef.current;
    const sentinel = sentinelRef.current;
    if (!container || !sentinel) return;

    sentinelObserverRef.current = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            onFetchMoreRef.current();
          }
        }
      },
      {
        root: container,
        threshold: 0,
        rootMargin: "0px 0px 100% 0px", // Trigger fetch 1 full viewport height before hitting bottom
      }
    );

    sentinelObserverRef.current.observe(sentinel);

    return () => {
      if (sentinelObserverRef.current) {
        sentinelObserverRef.current.disconnect();
      }
    };
  }, [isActiveTab]);

  // Keyboard navigation for desktop (scroll by card height)
  const activeIndexRef = useRef(activeIndex);
  activeIndexRef.current = activeIndex;

  const scrollToCard = useCallback(
    (direction: "up" | "down") => {
      const container = containerRef.current;
      if (!container) return;
      const nextIndex =
        direction === "down"
          ? Math.min(activeIndexRef.current + 1, cards.length - 1)
          : Math.max(activeIndexRef.current - 1, 0);

      const atoms = container.querySelectorAll(".thought-atom");
      atoms[nextIndex]?.scrollIntoView({ behavior: "smooth", block: "center" });
    },
    [cards.length]
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
          layoutVariant={card.layoutVariant || LAYOUT_CYCLE[index % LAYOUT_CYCLE.length]}
          index={index}
          isSaved={savedVaultCardIds.has(card.base_id || card.id)}
          isActive={index === activeIndex}
          onToggleSave={onToggleSave}
          onOpenDeepDive={onOpenDeepDive}
          onOpenChat={onOpenChat}
          isTrailMode={isTrailMode}
        />
      ))}
      {cards.length === 0 && isLoading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center opacity-50 space-y-4">
          <div className="w-6 h-6 border-2 border-[#1C1C1E] border-t-transparent rounded-full animate-spin" />
          <p className="text-[10px] font-mono tracking-widest uppercase text-[#1C1C1E]">Summoning Thoughts...</p>
        </div>
      )}
      <div ref={sentinelRef} className="h-4 w-full flex-shrink-0" aria-hidden="true" />
    </div>
  );
};

export default memo(ThoughtStream);
