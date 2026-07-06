import React from "react";
import { ArrowLeft, Bookmark } from "lucide-react";
import CommonplaceBook from "@/src/features/vault/components/CommonplaceBook";
import type { SavedVaultCard } from "@/src/features/vault/types";
import type { PhoneTab } from "@/src/providers/NavigationProvider";

interface VaultTabProps {
  isActive: boolean;
  savedVaultCards: SavedVaultCard[];
  setPhoneTab: (tab: PhoneTab) => void;
  updateVaultCardAnnotation: (cardId: string, annotation: string) => void;
  assignToFolder: (cardId: string, folderId: string) => void;
  deleteFromVault: (cardId: string) => void;
}

export const VaultTab: React.FC<VaultTabProps> = ({
  isActive,
  savedVaultCards,
  setPhoneTab,
  updateVaultCardAnnotation,
  assignToFolder,
  deleteFromVault,
}) => {
  return (
    <div
      id="vault-dashboard-emulation"
      className={`w-full h-full sm:h-[85vh] sm:max-h-[850px] sm:min-h-[600px] sm:max-w-[420px] sm:rounded-[32px] sm:shadow-[0_20px_60px_rgba(0,0,0,0.15),0_8px_20px_rgba(0,0,0,0.1)] overflow-hidden relative bg-[#F5F3ED] flex flex-col justify-between ${isActive ? "block" : "hidden"}`}
      style={{ WebkitMaskImage: "-webkit-radial-gradient(white, black)" }}
    >
      {savedVaultCards.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center p-4 space-y-5">
          <div className="relative w-20 h-20 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full bg-[#D4CFC5]/40 animate-breathe" />
            <div className="w-16 h-16 rounded-full bg-[#F5F3ED] flex items-center justify-center relative z-10 shadow-sm border border-[#E8E4DC]">
              <Bookmark className="w-8 h-8 text-[#B5A48B]" />
            </div>
          </div>
          <div className="space-y-2">
            <h4 className="text-lg font-serif italic text-[#1C1C1E] font-semibold">
              Your Vault is Vacant
            </h4>
            <p className="text-sm text-[#8A8A8E] font-light leading-relaxed max-w-[280px]">
              Save Thought Atoms from the Stream to begin collecting ideas in
              your Vault.
            </p>
          </div>

          <button
            onClick={() => setPhoneTab("explore")}
            className="group flex items-center gap-2 text-sm font-serif italic text-[#1C1C1E] hover:text-[#B5A48B] transition-all duration-300 mt-4"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            <span className="border-b border-[#1C1C1E]/20 group-hover:border-[#B5A48B]/40 pb-0.5 transition-all">
              Return to the Stream
            </span>
          </button>
        </div>
      ) : (
        <CommonplaceBook
          cards={savedVaultCards}
          onUpdateAnnotation={updateVaultCardAnnotation}
          onAssignToFolder={assignToFolder}
          onDeleteFromVault={deleteFromVault}
        />
      )}
    </div>
  );
};
