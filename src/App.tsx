import React from "react";
import { AnimatePresence } from "motion/react";
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';
import { Capacitor } from '@capacitor/core';

import { AppLayout } from "@/src/layouts/AppLayout";
import { AuthScreen } from "@/src/features/auth/components/AuthScreen";
import { ConstellationMap } from "@/src/features/graph/components/ConstellationMap";
import ZenMode from "@/src/features/zen/components/ZenMode";
import { ResetPasswordScreen } from "@/src/features/auth/components/ResetPasswordScreen";

import { useAppRouter } from "@/src/hooks/useAppRouter";
import { NavigationProvider, useNavigation } from "@/src/providers/NavigationProvider";
import { FeedProvider } from "@/src/features/feed/hooks/FeedProvider";
import { VaultProvider } from "@/src/features/vault/hooks/VaultProvider";

import { READING_TRAILS } from "@/src/data/trailsData";
import { useFeedContext } from "@/src/features/feed/hooks/FeedProvider";

const AuthenticatedApp = () => {
  const { isConstellationOpen, setIsConstellationOpen, isZenModeOpen, setIsZenModeOpen, phoneTab, setPhoneTab, setActiveTrailIndex } = useNavigation();
  const { handleStartTrail } = useFeedContext();

  const filterByThinker = async (thinkerName: string) => {
    const trail = READING_TRAILS.find(t =>
      t.thinkerIds.some(tid =>
        tid.toLowerCase() === thinkerName.toLowerCase() ||
        thinkerName.toLowerCase().includes(tid.toLowerCase()) ||
        tid.toLowerCase().includes(thinkerName.toLowerCase())
      )
    );

    if (trail) {
      const success = await handleStartTrail(trail.id);
      if (success) {
        setActiveTrailIndex(0);
        setPhoneTab("trail-view");
      }
    }
  };

  return (
    <div className="w-full h-[100dvh] bg-[#FAF8F3] flex overflow-hidden p-0">
      <AppLayout />

      <AnimatePresence>
        {isConstellationOpen && (
          <ConstellationMap
            onClose={() => setIsConstellationOpen(false)}
            onFilterByThinker={filterByThinker}
          />
        )}
        {isZenModeOpen && (
          <ZenMode
            onClose={() => setIsZenModeOpen(false)}
            onSessionComplete={() => {}}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default function App() {
  const { session, isRecoveringPassword, setIsRecoveringPassword, isLoading } = useAppRouter();

  let content;

  if (isLoading) {
    content = (
      <div className="flex items-center justify-center h-[100dvh] w-full bg-[#FAF8F3]">
        <div className="w-16 h-16 bg-[#F5F3ED] rounded-2xl flex items-center justify-center border border-[#E8E4DC] shadow-inner animate-pulse">
          <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-9 h-9">
            <path d="M8 40 L24 8 L40 40" stroke="#1C1C1E" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.9" />
            <path d="M16 28 L34 28" stroke="#1C1C1E" strokeWidth="2" strokeLinecap="round" opacity="0.5" />
          </svg>
        </div>
      </div>
    );
  } else if (isRecoveringPassword) {
    content = (
      <div className="w-full h-[100dvh] bg-[#FAF8F3] flex items-center justify-center overflow-hidden p-0">
        <ResetPasswordScreen onPasswordReset={() => setIsRecoveringPassword(false)} />
      </div>
    );
  } else if (!session) {
    content = (
      <div className="w-full h-[100dvh] bg-[#FAF8F3] flex items-center justify-center overflow-hidden p-0">
        <AuthScreen />
      </div>
    );
  } else {
    content = (
      <NavigationProvider>
        <FeedProvider>
          <VaultProvider>
            <AuthenticatedApp />
          </VaultProvider>
        </FeedProvider>
      </NavigationProvider>
    );
  }

  // Only render Vercel analytics on web platform, as Capacitor may cause CORS or origin issues with Vercel APIs.
  const isWeb = !Capacitor.isNativePlatform();

  return (
    <>
      {content}
      {isWeb && <Analytics />}
      {isWeb && <SpeedInsights />}
    </>
  );
}
