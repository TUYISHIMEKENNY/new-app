import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Session, User } from "@supabase/supabase-js";

export type AdminAuthState = {
  isReady: boolean;
  session: Session | null;
  user: User | null;
  isAdmin: boolean;
};

export function useAdminAuth(): AdminAuthState {
  const [isReady, setIsReady] = useState(false);
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    let active = true;

    // 1. Listen FIRST so we don't miss events.
    const { data: sub } = supabase.auth.onAuthStateChange((_event, s) => {
      if (!active) return;
      setSession(s);
      // Defer the role check — never await inside the callback.
      if (s?.user) {
        setTimeout(() => {
          void checkAdmin(s.user.id);
        }, 0);
      } else {
        setIsAdmin(false);
      }
    });

    // 2. Then restore the existing session.
    void supabase.auth.getSession().then(async ({ data }) => {
      if (!active) return;
      setSession(data.session);
      if (data.session?.user) {
        await checkAdmin(data.session.user.id);
      }
      setIsReady(true);
    });

    async function checkAdmin(userId: string) {
      const { data, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", userId)
        .eq("role", "admin")
        .maybeSingle();
      if (!active) return;
      setIsAdmin(!error && !!data);
    }

    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  return {
    isReady,
    session,
    user: session?.user ?? null,
    isAdmin,
  };
}
