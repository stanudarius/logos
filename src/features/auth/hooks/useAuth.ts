import { useState, useEffect } from "react";
import { supabase } from "@/src/lib/supabase";
import type { Session } from "@supabase/supabase-js";

export function useAuth() {
  const [session, setSession] = useState<Session | null>(null);
  const [isRecoveringPassword, setIsRecoveringPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasCompletedQuiz, setHasCompletedQuiz] = useState(false);

  useEffect(() => {
    let isMounted = true;
    
    const fetchProfile = async (userId: string) => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('has_completed_quiz')
          .eq('id', userId)
          .single();
          
        if (error && error.code !== 'PGRST116') {
          console.error("Error fetching profile:", error);
        }
        
        if (isMounted && data) {
          setHasCompletedQuiz(!!data.has_completed_quiz);
        }
      } catch (err) {
        console.error("Profile fetch error:", err);
      }
    };

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (isMounted) {
        setSession(session);
        if (session?.user) {
          fetchProfile(session.user.id).finally(() => {
            if (isMounted) setIsLoading(false);
          });
        } else {
          setIsLoading(false);
        }
      }
    }).catch((err) => {
      console.error("Auth session error:", err);
      if (isMounted) setIsLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (isMounted) {
        setSession(session);
        if (event === 'PASSWORD_RECOVERY') {
          setIsRecoveringPassword(true);
        }
        if (session?.user) {
          setIsLoading(true);
          fetchProfile(session.user.id).finally(() => {
            if (isMounted) setIsLoading(false);
          });
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

  const completeQuiz = async (preferences: any) => {
    if (!session?.user) return;
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          has_completed_quiz: true,
          quiz_preferences: preferences
        })
        .eq('id', session.user.id);
        
      if (error) throw error;
      setHasCompletedQuiz(true);
    } catch (err) {
      console.error("Failed to update quiz status:", err);
      setHasCompletedQuiz(true); 
    }
  };

  return { session, isRecoveringPassword, setIsRecoveringPassword, isLoading, hasCompletedQuiz, completeQuiz };
}
