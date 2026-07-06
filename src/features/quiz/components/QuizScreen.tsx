import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { QUIZ_QUESTIONS } from "@/src/data/quizData";
import { QuizSummaryScreen } from "./QuizSummaryScreen";

export const QuizScreen: React.FC<{
  onComplete: (answers: Record<string, string>) => void;
}> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const advanceTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (advanceTimeoutRef.current) clearTimeout(advanceTimeoutRef.current);
    },
    [],
  );

  const handleSelect = (questionId: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
    if (advanceTimeoutRef.current) clearTimeout(advanceTimeoutRef.current);
    advanceTimeoutRef.current = setTimeout(
      () => setCurrentStep((prev) => prev + 1),
      300,
    );
  };

  if (currentStep >= QUIZ_QUESTIONS.length) {
    return (
      <QuizSummaryScreen
        answers={answers}
        onComplete={() => onComplete(answers)}
      />
    );
  }

  const question = QUIZ_QUESTIONS[currentStep];

  return (
    <div className="w-full h-[100dvh] bg-[#FAF8F3] flex flex-col items-center justify-center p-6 relative overflow-y-auto">
      <div className="absolute top-[max(env(safe-area-inset-top),3rem)] w-full px-8 flex justify-center mt-4">
        <div className="flex gap-2">
          {QUIZ_QUESTIONS.map((_, i) => (
            <div
              key={i}
              className={`h-1 rounded-full transition-all duration-500 ${i <= currentStep ? "w-6 bg-[#1C1C1E]" : "w-2 bg-[#E8E4DC]"}`}
            />
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-md flex flex-col gap-8"
        >
          <h2 className="text-3xl font-serif text-[#1C1C1E] text-center leading-tight mb-4">
            {question.question}
          </h2>

          <div
            className={
              question.options.length > 5
                ? "grid grid-cols-2 gap-3"
                : "flex flex-col gap-3"
            }
          >
            {question.options.map((opt, index) => (
              <button
                key={opt.value}
                onClick={() => handleSelect(question.id, opt.value)}
                className={`w-full py-4 rounded-2xl border transition-all duration-200 
                  ${question.options.length > 5 ? "px-3 text-center" : "px-6 text-left"}
                  ${question.options.length > 5 && index === question.options.length - 1 && question.options.length % 2 !== 0 ? "col-span-2" : ""}
                  ${
                    answers[question.id] === opt.value
                      ? "border-[#1C1C1E] bg-[#1C1C1E] text-[#FAF8F3] shadow-md transform scale-[0.98]"
                      : "border-[#E8E4DC] bg-white text-[#1C1C1E] hover:border-[#1C1C1E] hover:shadow-sm"
                  }`}
              >
                <span
                  className={
                    question.options.length > 5
                      ? "text-[15px] font-medium leading-tight block"
                      : "text-lg"
                  }
                >
                  {opt.label}
                </span>
              </button>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
