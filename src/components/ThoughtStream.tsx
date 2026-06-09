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
  onTriggerToast: (msg: string) => void;
  onOpenDeepDive?: (index: number) => void;
  onOpenChat?: (index: number) => void;
}

/**
 * ThoughtStream — CSS scroll-snap container for the vertical "TikTok" feed.
 * Tracks active card via scroll events and infinite scroll at the bottom.
 */
const ThoughtStream: React.FC<ThoughtStreamProps> = ({
  cards,
  isLoading,
  onActiveCardChange,
  onFetchMore,
  savedVaultCardIds,
  onToggleSave,
  onTriggerToast,
  onOpenDeepDive,
  onOpenChat
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [mouseX, setMouseX] = useState(0);
  const [mouseY, setMouseY] = useState(0);

  const sentinelObserverRef = useRef<IntersectionObserver | null>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);

  // Global Parallax tracking
  useEffect(() => {
    let ticking = false;

    const handleMouseMove = (e: MouseEvent) => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const x = (e.clientX / window.innerWidth - 0.5) * 20;
          const y = (e.clientY / window.innerHeight - 0.5) * 20;
          setMouseX(x);
          setMouseY(y);
          ticking = false;
        });
        ticking = true;
      }
    };

    const handleDeviceOrientation = (e: DeviceOrientationEvent) => {
      if (e.gamma === null || e.beta === null) return;
      if (!ticking) {
        requestAnimationFrame(() => {
          const x = Math.min(Math.max(e.gamma! / 4.5, -10), 10);
          const y = Math.min(Math.max((e.beta! - 45) / 4.5, -10), 10);
          setMouseX(x);
          setMouseY(y);
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
    };
  }, []);

  // Calculate active index on scroll
  const handleScroll = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;
    
    const cardHeight = container.clientHeight;
    if (cardHeight === 0) return;
    
    const newIndex = Math.round(container.scrollTop / cardHeight);
    if (newIndex !== activeIndex && newIndex >= 0 && newIndex < cards.length) {
      setActiveIndex(newIndex);
      onActiveCardChange(newIndex);
    }
  }, [activeIndex, cards.length, onActiveCardChange]);

  useEffect(() => {
    const container = containerRef.current;
    const sentinel = sentinelRef.current;
    if (!container || !sentinel) return;

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

    sentinelObserverRef.current.observe(sentinel);

    return () => {
      sentinelObserverRef.current?.disconnect();
    };
  }, [onFetchMore]);

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
      onScroll={handleScroll}
      className="thought-stream h-full w-full overflow-y-auto snap-y snap-mandatory scroll-smooth"
      style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }} // Hide scrollbar for a cleaner look
    >
      {cards.map((card, index) => (
        <ThoughtAtom
          key={card.id}
          card={card}
          layoutVariant={card.layoutVariant || LAYOUT_CYCLE[index % LAYOUT_CYCLE.length]}
          index={index}
          isSaved={savedVaultCardIds.has(card.id)}
          isActive={index === activeIndex}
          mouseX={mouseX}
          mouseY={mouseY}
          onToggleSave={onToggleSave}
          onTriggerToast={onTriggerToast}
          onOpenDeepDive={onOpenDeepDive}
          onOpenChat={onOpenChat}
        />
      ))}
      <div ref={sentinelRef} className="h-4 w-full flex-shrink-0" aria-hidden="true" />
    </div>
  );
};

export default memo(ThoughtStream);
