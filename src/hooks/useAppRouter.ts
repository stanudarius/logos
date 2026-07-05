import { useEffect } from "react";
import { useAuth } from "@/src/features/auth/hooks/useAuth";

export const useAppRouter = () => {
  const { session, isRecoveringPassword, setIsRecoveringPassword, isLoading } = useAuth();

  let currentRoute = "/";
  if (!isLoading) {
    if (isRecoveringPassword) {
      currentRoute = "/reset-password";
    } else if (!session) {
      currentRoute = "/auth";
    }
  }

  useEffect(() => {
    if (!isLoading && currentRoute !== "/") {
      window.history.replaceState(null, '', currentRoute);
    }
  }, [currentRoute, isLoading]);

  return { session, isRecoveringPassword, setIsRecoveringPassword, isLoading };
};
