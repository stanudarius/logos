import React, { createContext, useContext, ReactNode } from "react";
import { useFeed as useFeedHook } from "./useFeed";
import type { FeedCard } from "@/src/features/feed/types";
import { useNavigation } from "@/src/providers/NavigationProvider";

type FeedContextType = ReturnType<typeof useFeedHook>;

const FeedContext = createContext<FeedContextType | undefined>(undefined);

export const FeedProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { phoneTab } = useNavigation();
  const feedState = useFeedHook(phoneTab);

  return (
    <FeedContext.Provider value={feedState}>{children}</FeedContext.Provider>
  );
};

export const useFeedContext = () => {
  const context = useContext(FeedContext);
  if (!context) {
    throw new Error("useFeedContext must be used within a FeedProvider");
  }
  return context;
};
