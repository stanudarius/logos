import React from "react";
import { Timer, MessageCircle, Network } from "lucide-react";
import { useNavigation, type PhoneTab } from "@/src/providers/NavigationProvider";

interface MobileHeaderProps {
  phoneTab: PhoneTab;
  setIsZenModeOpen: (open: boolean) => void;
  setIsChatOpen: (open: boolean) => void;
  setIsConstellationOpen: (open: boolean) => void;
}

export const MobileHeader: React.FC<MobileHeaderProps> = ({
  phoneTab,
  setIsZenModeOpen,
  setIsChatOpen,
  setIsConstellationOpen,
}) => {
  const { isDeepDiveOpen } = useNavigation();

  return (
    <div className={`sm:hidden absolute top-0 inset-x-0 z-50 flex justify-between items-center px-5 pt-[max(env(safe-area-inset-top),1.25rem)] pb-3 pointer-events-none transition-opacity duration-300 ${isDeepDiveOpen ? "opacity-0" : "opacity-100"}`}>
      {!(phoneTab === "vault" || phoneTab === "trails") && (
        <div className={`flex items-center gap-2 opacity-80 ${isDeepDiveOpen ? "pointer-events-none" : "pointer-events-auto"}`}>
          <div className="w-5 h-5 bg-black rounded flex items-center justify-center">
            <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-3 h-3">
              <path d="M8 40 L24 8 L40 40" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <span className="font-serif italic font-semibold tracking-tight text-[#1C1C1E] text-sm">Logos</span>
        </div>
      )}
      {(phoneTab === "explore" || phoneTab === "trail-view") && (
        <div className={`flex items-center gap-1 opacity-60 ${isDeepDiveOpen ? "pointer-events-none" : "pointer-events-auto"}`}>
          <button onClick={() => setIsZenModeOpen(true)} className="p-1.5 rounded-full bg-transparent hover:bg-[#1C1C1E]/5 transition-colors">
            <Timer className="w-3.5 h-3.5 text-[#1C1C1E]" />
          </button>
          <button onClick={() => setIsChatOpen(true)} className="p-1.5 rounded-full bg-transparent hover:bg-[#1C1C1E]/5 transition-colors">
            <MessageCircle className="w-3.5 h-3.5 text-[#1C1C1E]" />
          </button>
          <button onClick={() => setIsConstellationOpen(true)} className="p-1.5 rounded-full bg-transparent hover:bg-[#1C1C1E]/5 transition-colors">
            <Network className="w-3.5 h-3.5 text-[#1C1C1E]" />
          </button>
        </div>
      )}
    </div>
  );
};
