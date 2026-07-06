import { useEffect } from "react";
import { useAuth } from "@/src/features/auth/hooks/useAuth";

export const useAppRouter = () => {
  const {
    session,
    isRecoveringPassword,
    setIsRecoveringPassword,
    isLoading,
    hasCompletedQuiz,
    completeQuiz,
  } = useAuth();

  let currentRoute = "";
  if (!isLoading) {
    if (isRecoveringPassword) {
      currentRoute = "/reset-password";
    } else if (!session) {
      currentRoute = "/auth";
    } else if (!hasCompletedQuiz) {
      currentRoute = "/quiz";
    } else {
      currentRoute = "/";
    }
  }

  useEffect(() => {
    if (!isLoading && currentRoute !== "") {
      if (window.location.pathname !== currentRoute) {
        window.history.pushState(null, "", currentRoute);
      }
    }
  }, [currentRoute, isLoading]);

  return {
    session,
    isRecoveringPassword,
    setIsRecoveringPassword,
    isLoading,
    hasCompletedQuiz,
    completeQuiz,
  };
};
