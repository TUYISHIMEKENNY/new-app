import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase";
import type { User } from "@supabase/supabase-js";

export type AdminAuthState = {
  isReady: boolean;
  user: User | null;
  isAdmin: boolean;
};

export function useAdminAuth(): AdminAuthState {
  const [isReady, setIsReady] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Get current session on mount
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setIsReady(true);
    });

    // Listen for auth state changes (sign in, sign out, token refresh)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setIsReady(true);
    });

    return () => subscription.unsubscribe();
  }, []);

  return {
    isReady,
    user,
    // Any authenticated Supabase user is treated as admin.
    // For finer control you can check user.app_metadata.role === 'admin'.
    isAdmin: !!user,
  };
}

export function logoutAdmin() {
  supabase.auth.signOut();
}

export async function signUpAdmin(email: string, password: string): Promise<void> {
  const { error } = await supabase.auth.signUp({ email, password });
  if (error) throw new Error(error.message);
}

export async function signInAdmin(email: string, password: string): Promise<void> {
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw new Error(error.message);
}
