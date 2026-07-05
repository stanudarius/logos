import React, { useRef, useEffect, useCallback, useState, memo } from "react";
import type { FeedCard, LayoutVariant } from "@/src/features/feed/types";
import ThoughtAtom from "@/src/features/feed/components/ThoughtAtom/ThoughtAtom";

const LAYOUT_CYCLE: LayoutVariant[] = ["thesis", "blockquote", "fragment", "epigraph"];

interface ThoughtStreamProps {
  cards: FeedCard[];
  isLoading: boolean;
  isFeedExhausted?: boolean;
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
  isFeedExhausted = false,
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
      { root: container, threshold: 0.6 }
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
        rootMargin: "0px 0px 100% 0px",
      }
    );

    sentinelObserverRef.current.observe(sentinel);

    return () => {
      if (sentinelObserverRef.current) {
        sentinelObserverRef.current.disconnect();
      }
    };
  }, [isActiveTab]);

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
    const container = containerRef.current;
    if (container) {
      container.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
    }
  }, [cards[0]?.id]);

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

      {/* ── Skeleton Loading State (Initial Load) ── */}
      {cards.length === 0 && isLoading && (
        <div className="w-full h-full flex flex-col items-center justify-center space-y-12 snap-center shrink-0">
          {[1, 2].map((i) => (
            <div key={i} className="w-full h-full sm:h-[80%] max-w-[420px] mx-auto p-8 sm:p-12 flex flex-col items-center justify-center opacity-40">
              <div className="w-24 h-[9px] bg-gradient-to-r from-[#E8E4DC] via-[#D4CFC5] to-[#E8E4DC] rounded-sm mb-12 animate-pulse" />
              <div className="w-full max-w-[280px] h-8 bg-gradient-to-r from-[#E8E4DC] via-[#D4CFC5] to-[#E8E4DC] rounded-sm mb-4 animate-pulse" />
              <div className="w-3/4 max-w-[200px] h-8 bg-gradient-to-r from-[#E8E4DC] via-[#D4CFC5] to-[#E8E4DC] rounded-sm mb-16 animate-pulse" />
              <div className="w-full max-w-[300px] space-y-3">
                <div className="w-full h-[13px] bg-gradient-to-r from-[#E8E4DC] via-[#D4CFC5] to-[#E8E4DC] rounded-sm animate-pulse" />
                <div className="w-[90%] h-[13px] bg-gradient-to-r from-[#E8E4DC] via-[#D4CFC5] to-[#E8E4DC] rounded-sm animate-pulse" />
                <div className="w-[75%] h-[13px] bg-gradient-to-r from-[#E8E4DC] via-[#D4CFC5] to-[#E8E4DC] rounded-sm animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Background Pagination Loading Spinner ── */}
      {cards.length > 0 && isLoading && !isFeedExhausted && (
        <div className="h-32 w-full flex-shrink-0 flex flex-col items-center justify-center opacity-50 space-y-4 snap-center">
          <div className="w-5 h-5 border-2 border-[#1C1C1E] border-t-transparent rounded-full animate-spin" />
          <p className="text-[9px] font-mono tracking-widest uppercase text-[#1C1C1E]">Summoning Thoughts...</p>
        </div>
      )}

      {/* ── End of Stream Card ── */}
      {isFeedExhausted && cards.length > 0 && !isTrailMode && (
        <div className="w-full h-full snap-start shrink-0 flex flex-col items-center justify-center bg-[#FAF8F3] px-8 text-center">
          <div className="w-12 h-12 rounded-full border border-[#D4CFC5] flex items-center justify-center mb-6">
            <div className="w-2 h-2 rounded-full bg-[#1C1C1E] opacity-20" />
          </div>
          <h2 className="text-2xl font-serif italic font-semibold text-[#1C1C1E] mb-4">
            The Stream Ebbs
          </h2>
          <p className="text-sm font-sans font-light text-[#8A8A8E] max-w-[240px] leading-relaxed">
            You have reached the limits of the current constellation. Return later as more thoughts coalesce.
          </p>
        </div>
      )}

      <div ref={sentinelRef} className="h-4 w-full flex-shrink-0" aria-hidden="true" />
    </div>
  );
};

export default memo(ThoughtStream);
