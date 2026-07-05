import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import type { Session } from "@supabase/supabase-js";

export function useAuth() {
  const [session, setSession] = useState<Session | null>(null);
  const [isRecoveringPassword, setIsRecoveringPassword] = useState(false);

  useEffect(() => {
    let isMounted = true;
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (isMounted) setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (isMounted) {
        setSession(session);
        if (event === 'PASSWORD_RECOVERY') {
          setIsRecoveringPassword(true);
        }
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  return { session, isRecoveringPassword, setIsRecoveringPassword };
}
