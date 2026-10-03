import React from "react";
import { Network, MessageCircle, Timer } from "lucide-react";
import { NAV_TABS } from "../constants";
import type { PhoneTab } from "@/src/providers/NavigationProvider";

interface DesktopSidebarProps {
  activeTabId: string;
  setPhoneTab: (tab: PhoneTab) => void;
  savedVaultCardsCount: number;
  setIsConstellationOpen: (open: boolean) => void;
  setIsChatOpen: (open: boolean) => void;
  setIsZenModeOpen: (open: boolean) => void;
}

export const DesktopSidebar: React.FC<DesktopSidebarProps> = ({
  activeTabId,
  setPhoneTab,
  savedVaultCardsCount,
  setIsConstellationOpen,
  setIsChatOpen,
  setIsZenModeOpen,
}) => {
  return (
    <div className="hidden sm:flex w-64 bg-[#F5F3ED] border-r border-[#E8E4DC] flex-col py-8 px-4 z-20 shadow-[1px_0_10px_rgba(0,0,0,0.02)]">
      <div className="flex items-center gap-3 mb-10 px-2">
        <div className="w-9 h-9 bg-black rounded-lg flex items-center justify-center shadow-md">
          <svg
            viewBox="0 0 48 48"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-5 h-5"
          >
            <path
              d="M8 40 L24 8 L40 40"
              stroke="white"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <span className="font-serif italic font-semibold text-xl tracking-tight">
          Logos
        </span>
      </div>

      <nav className="flex-1 flex flex-col gap-2" role="tablist">
        {NAV_TABS.map(({ id, label, Icon }) => {
          const isActive = id === activeTabId;
          const showBadge = id === "vault" && savedVaultCardsCount > 0;
          return (
            <button
              key={id}
              role="tab"
              aria-selected={isActive}
              onClick={() => setPhoneTab(id as PhoneTab)}
              className={`flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all text-left ${
                isActive
                  ? "bg-[#1C1C1E] text-white shadow-md scale-[1.02]"
                  : "text-[#8A8A8E] hover:bg-[#E8E4DC]/60 hover:text-[#1C1C1E]"
              }`}
            >
              <Icon className="w-5 h-5 stroke-[2]" />
              <span className="font-medium text-sm tracking-wide">{label}</span>
              {showBadge && (
                <span
                  className={`ml-auto text-xs font-bold px-2 py-0.5 rounded-full ${isActive ? "bg-white/20 text-white" : "bg-[#1C1C1E]/10 text-[#1C1C1E]"}`}
                >
                  {savedVaultCardsCount}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      <div className="mt-auto space-y-2 pt-4 border-t border-[#E8E4DC]/60">
        <button
          onClick={() => setIsConstellationOpen(true)}
          className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all text-left text-[#8A8A8E] hover:bg-[#E8E4DC]/60 hover:text-[#1C1C1E]"
        >
          <Network className="w-5 h-5 stroke-[2]" />
          <span className="font-medium text-sm tracking-wide">
            Constellation
          </span>
        </button>

        <button
          onClick={() => setIsChatOpen(true)}
          className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all text-left text-[#8A8A8E] hover:bg-[#E8E4DC]/60 hover:text-[#1C1C1E]"
        >
          <MessageCircle className="w-5 h-5 stroke-[2]" />
          <span className="font-medium text-sm tracking-wide">
            Socratic Chat
          </span>
        </button>

        <button
          onClick={() => setIsZenModeOpen(true)}
          className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all text-left text-[#8A8A8E] hover:bg-[#E8E4DC]/60 hover:text-[#1C1C1E]"
        >
          <Timer className="w-5 h-5 stroke-[2]" />
          <span className="font-medium text-sm tracking-wide">Zen Mode</span>
        </button>
      </div>
    </div>
  );
};
