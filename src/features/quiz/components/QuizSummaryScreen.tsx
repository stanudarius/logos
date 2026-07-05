import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'motion/react';
import { useFeedContext } from '@/src/features/feed/hooks/FeedProvider';
import { useVaultContext } from '@/src/features/vault/hooks/VaultProvider';
import { useNavigation } from '@/src/providers/NavigationProvider';
import { STARTER_QUOTES } from '@/src/data/quizData';
import { READING_TRAILS } from '@/src/data/trailsData';

interface QuizSummaryProps {
  answers: Record<string, string>;
  onComplete: () => void;
}

export const QuizSummaryScreen: React.FC<QuizSummaryProps> = ({ answers, onComplete }) => {
  const { handleStartTrail } = useFeedContext();
  const { toggleSaveToVault, savedVaultCards } = useVaultContext();
  const { setActiveTrailIndex, setPhoneTab } = useNavigation();
  const [isFinishing, setIsFinishing] = useState(false);
  const initialized = useRef(false);

  const selectedThinker = answers.thinker || "Socrates";
  const quotes = STARTER_QUOTES[selectedThinker] || STARTER_QUOTES["Socrates"];

  const getReflectionText = () => {
    const intent = answers.intent;
    const craving = answers.craving;
    
    let p1 = `We've built your philosophical space based on your connection with ${selectedThinker}. `;
    
    if (intent === "hard_time") {
      p1 += "Philosophy has always been a refuge in difficult times, offering enduring strength rather than temporary comfort.";
    } else if (intent === "clarity") {
      p1 += "Clear thinking is the foundation of a well-lived life, helping you cut through the noise of the modern world.";
    } else if (intent === "perspective") {
      p1 += "Stepping back to see the bigger picture is exactly what the greatest minds did when faced with complexity.";
    } else {
      p1 += "The love of wisdom is a lifelong journey, and every great philosopher started exactly where you are.";
    }

    let p2 = "";
    if (craving === "silence") {
      p2 = "Through daily reflection, your vault will become a place of inner stillness.";
    } else if (craving === "wisdom") {
      p2 = "We've curated practical insights that you can apply directly to your daily actions.";
    } else if (craving === "ideas") {
      p2 = "Prepare to grapple with profound concepts that will stretch the boundaries of your mind.";
    } else {
      p2 = "These thinkers will serve as your conversational partners across time.";
    }
    
    return { p1, p2 };
  };

  const { p1, p2 } = getReflectionText();

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;
    
    const setupAccount = async () => {
      const savedIds = new Set(savedVaultCards.map(c => c.base_id || c.id));
      
      for (const quote of quotes) {
        if (!savedIds.has(quote.base_id || quote.id)) {
          await toggleSaveToVault(quote, 0);
        }
      }
    };

    setupAccount();
  }, [quotes, toggleSaveToVault, savedVaultCards]);

  const handleExplore = async () => {
    setIsFinishing(true);
    
    const trail = READING_TRAILS.find(t =>
      t.thinkerIds.some(tid =>
        tid.toLowerCase() === selectedThinker.toLowerCase() ||
        selectedThinker.toLowerCase().includes(tid.toLowerCase()) ||
        tid.toLowerCase().includes(selectedThinker.toLowerCase())
      )
    ) || READING_TRAILS[0];

    if (trail) {
      const success = await handleStartTrail(trail.id);
      if (success) {
        setActiveTrailIndex(0);
        setPhoneTab("trail-view");
        onComplete();
      }
    } else {
      onComplete();
    }
  };

  return (
    <div className="w-full min-h-[100dvh] bg-[#FAF8F3] flex flex-col items-center p-6 md:p-8 relative overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-lg flex flex-col h-full flex-grow pt-4 pb-4"
      >
        {/* Editorial Header */}
        <div className="w-full flex items-center gap-4 mb-8">
          <div className="h-[1px] flex-grow bg-[#1C1C1E]/30"></div>
          <span className="text-[#1C1C1E] uppercase tracking-[0.2em] text-[10px] font-semibold">Prologue</span>
          <div className="h-[1px] w-6 bg-[#1C1C1E]/30"></div>
        </div>
        
        {/* Massive Serif Title */}
        <h1 className="text-5xl md:text-6xl font-serif text-[#1C1C1E] tracking-tight leading-[1.05] mb-8">
          Your<br />Logos.
        </h1>
        
        {/* Stark Divider */}
        <div className="w-full h-[1px] bg-[#1C1C1E]/20 mb-6"></div>
        
        {/* Editorial Body Text */}
        <div className="flex flex-col gap-5 text-[#1C1C1E]/80 text-lg md:text-xl leading-relaxed font-serif mb-6">
          <p>{p1}</p>
          <p>{p2}</p>
        </div>

        {/* Push button to bottom */}
        <div className="mt-auto"></div>

        {/* Sharp Editorial Button */}
        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          onClick={handleExplore}
          disabled={isFinishing}
          className="relative w-full overflow-hidden bg-[#1C1C1E] text-[#FAF8F3] disabled:opacity-70 disabled:cursor-not-allowed group border border-[#1C1C1E]"
        >
          <div className="absolute inset-0 bg-white/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          <div className="relative flex items-center justify-between py-5 px-8 font-medium uppercase tracking-[0.15em] text-sm">
            {isFinishing ? (
              <div className="flex items-center gap-4 mx-auto">
                <div className="w-4 h-4 border-2 border-[#FAF8F3]/30 border-t-[#FAF8F3] rounded-full animate-spin" />
                <span>Binding Pages...</span>
              </div>
            ) : (
              <>
                <span>Enter Your Vault</span>
                <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-2">
                  <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </>
            )}
          </div>
        </motion.button>
      </motion.div>
    </div>
  );
};
