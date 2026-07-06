import React from "react";
import { NAV_TABS } from "../constants";
import type { PhoneTab } from "@/src/providers/NavigationProvider";

interface MobileTabBarProps {
  activeTabId: string;
  setPhoneTab: (tab: PhoneTab) => void;
  savedVaultCardsCount: number;
}

export const MobileTabBar: React.FC<MobileTabBarProps> = ({
  activeTabId,
  setPhoneTab,
  savedVaultCardsCount,
}) => {
  return (
    <div className="sm:hidden relative z-20 bg-[#FAF8F3] pb-[max(env(safe-area-inset-bottom),0.5rem)]">
      <div className="flex items-end justify-around pt-2 pb-2 px-2 pointer-events-auto" role="tablist">
        {NAV_TABS.map(({ id, label, Icon }) => {
          const isActive = id === activeTabId;
          const showBadge = id === "vault" && savedVaultCardsCount > 0;

          return (
            <button
              key={id}
              role="tab"
              aria-selected={isActive}
              onClick={() => setPhoneTab(id as PhoneTab)}
              aria-label={label}
              className="flex flex-col items-center gap-1 group active:scale-95 transition-all focus:outline-none min-w-[56px]"
            >
              <div
                className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-300 relative ${
                  isActive
                    ? "bg-[#1C1C1E] text-[#FAF8F3] shadow-md"
                    : "bg-white border border-[#E8E4DC] text-[#1C1C1E] shadow-sm"
                }`}
              >
                <Icon className="w-4 h-4 stroke-[1.5]" />
                {showBadge && (
                  <span className="absolute -top-1 -right-1 bg-[#B5A48B] text-white font-mono text-[8px] px-2 h-3.5 rounded-full flex items-center justify-center font-bold border border-[#FAF8F3]">
                    {savedVaultCardsCount}
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
