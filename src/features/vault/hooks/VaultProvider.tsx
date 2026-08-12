import React, { createContext, useContext, ReactNode } from "react";
import { useVault as useVaultHook } from "./useVault";
import { useAuth } from "@/src/features/auth/hooks/useAuth";
import { useFeedContext } from "@/src/features/feed/hooks/FeedProvider";

type VaultContextType = ReturnType<typeof useVaultHook>;

const VaultContext = createContext<VaultContextType | undefined>(undefined);

export const VaultProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { session } = useAuth();
  const { trackCardInteraction } = useFeedContext();

  const vaultState = useVaultHook(session, trackCardInteraction);

  return (
    <VaultContext.Provider value={vaultState}>{children}</VaultContext.Provider>
  );
};

export const useVaultContext = () => {
  const context = useContext(VaultContext);
  if (!context) {
    throw new Error("useVaultContext must be used within a VaultProvider");
  }
  return context;
};
