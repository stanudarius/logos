import React from "react";
import ThoughtStream from "@/src/features/feed/components/ThoughtStream";
import type { FeedCard } from "@/src/features/feed/types";

interface FeedTabProps {
  id: string;
  isActive: boolean;
  cards: FeedCard[];
  isLoading: boolean;
  isFeedExhausted: boolean;
  isTrailMode: boolean;
  onActiveCardChange: (index: number) => void;
  onFetchMore: () => void;
  savedVaultCardIds: Set<string>;
  onToggleSave: (index: number) => void;
  onOpenDeepDive: (index: number) => void;
  onOpenChat: (index: number) => void;
}

export const FeedTab: React.FC<FeedTabProps> = ({
  id,
  isActive,
  cards,
  isLoading,
  isFeedExhausted,
  isTrailMode,
  onActiveCardChange,
  onFetchMore,
  savedVaultCardIds,
  onToggleSave,
  onOpenDeepDive,
  onOpenChat
}) => {
  return (
    <div id={id} className={`w-full h-full sm:h-[85vh] sm:max-h-[850px] sm:min-h-[600px] sm:max-w-[420px] sm:rounded-[32px] sm:shadow-[0_20px_60px_rgba(0,0,0,0.15),0_8px_20px_rgba(0,0,0,0.1)] overflow-hidden relative bg-[#FAF8F3] ${isActive ? "block" : "hidden"}`}
         style={{ WebkitMaskImage: '-webkit-radial-gradient(white, black)' }}>
      <ThoughtStream
        cards={cards}
        isLoading={isLoading}
        isFeedExhausted={isFeedExhausted}
        onActiveCardChange={onActiveCardChange}
        onFetchMore={onFetchMore}
        savedVaultCardIds={savedVaultCardIds}
        onToggleSave={onToggleSave}
        onOpenDeepDive={onOpenDeepDive}
        onOpenChat={onOpenChat}
        isTrailMode={isTrailMode}
        isActiveTab={isActive}
      />
    </div>
  );
};
