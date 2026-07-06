import { useState, useEffect } from "react";
import { supabase } from "@/src/lib/supabase";
import type { Session } from "@supabase/supabase-js";

export function useAuth() {
  const [session, setSession] = useState<Session | null>(null);
  const [isRecoveringPassword, setIsRecoveringPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasCompletedQuiz, setHasCompletedQuiz] = useState<boolean | undefined>(undefined);

  useEffect(() => {
    let isMounted = true;
    let latestRequestId = 0;

    const fetchProfile = async (userId: string) => {
      const requestId = ++latestRequestId;
      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("has_completed_quiz")
          .eq("id", userId)
          .single();

        if (error && error.code !== "PGRST116") {
          console.error("Error fetching profile:", error);
        }

        if (isMounted && requestId === latestRequestId) {
          if (data) {
            setHasCompletedQuiz(!!data.has_completed_quiz);
          } else {
            setHasCompletedQuiz(false);
          }
          setIsLoading(false);
        }
      } catch (err) {
        console.error("Profile fetch error:", err);
        if (isMounted && requestId === latestRequestId) setIsLoading(false);
      }
    };

    supabase.auth
      .getSession()
      .then(({ data: { session } }) => {
        if (isMounted) {
          setSession(session);
          if (session?.user) {
            fetchProfile(session.user.id);
          } else {
            setIsLoading(false);
          }
        }
      })
      .catch((err) => {
        console.error("Auth session error:", err);
        if (isMounted) setIsLoading(false);
      });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (isMounted) {
        setSession(session);
        if (event === "PASSWORD_RECOVERY") {
          setIsRecoveringPassword(true);
        }
        if (session?.user) {
          setIsLoading(true);
          fetchProfile(session.user.id);
        } else {
          setHasCompletedQuiz(false);
          setIsLoading(false);
        }
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const completeQuiz = async (preferences: Record<string, string>) => {
    if (!session?.user) return;
    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          has_completed_quiz: true,
          quiz_preferences: preferences,
        })
        .eq("id", session.user.id);

      if (error) throw error;
      setHasCompletedQuiz(true);
    } catch (err) {
      console.error("Failed to update quiz status:", err);
      setHasCompletedQuiz(true);
    }
  };

  return {
    session,
    isRecoveringPassword,
    setIsRecoveringPassword,
    isLoading,
    hasCompletedQuiz,
    completeQuiz,
  };
}
