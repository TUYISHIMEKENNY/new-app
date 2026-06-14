import { useEffect, useState } from "react";

export type AdminAuthState = {
  isReady: boolean;
  user: { email: string } | null;
  isAdmin: boolean;
};

const AUTH_KEY = "lumen_admin_user";
const CREDENTIALS_KEY = "lumen_admin_credentials";
const AUTH_EVENT = "lumen_auth_change";

export function useAdminAuth(): AdminAuthState {
  const [isReady, setIsReady] = useState(false);
  const [user, setUser] = useState<{ email: string } | null>(null);

  useEffect(() => {
    const checkAuth = () => {
      const stored = localStorage.getItem(AUTH_KEY);
      if (stored) {
        try {
          setUser(JSON.parse(stored));
        } catch (e) {
          localStorage.removeItem(AUTH_KEY);
          setUser(null);
        }
      } else {
        setUser(null);
      }
      setIsReady(true);
    };

    checkAuth();
    window.addEventListener(AUTH_EVENT, checkAuth);
    window.addEventListener("storage", checkAuth);
    return () => {
      window.removeEventListener(AUTH_EVENT, checkAuth);
      window.removeEventListener("storage", checkAuth);
    };
  }, []);

  return {
    isReady,
    user,
    isAdmin: !!user,
  };
}

export function loginAdmin(email: string) {
  localStorage.setItem(AUTH_KEY, JSON.stringify({ email }));
  window.dispatchEvent(new Event(AUTH_EVENT));
}

export function logoutAdmin() {
  localStorage.removeItem(AUTH_KEY);
  window.dispatchEvent(new Event(AUTH_EVENT));
}

export async function signUpAdmin(email: string, password: string): Promise<void> {
  // Simulate network latency
  await new Promise((resolve) => setTimeout(resolve, 500));
  const normalizedEmail = email.trim().toLowerCase();
  
  const usersRaw = localStorage.getItem(CREDENTIALS_KEY);
  const users: Record<string, string> = usersRaw ? JSON.parse(usersRaw) : {};
  
  if (users[normalizedEmail]) {
    throw new Error("User already exists.");
  }
  
  users[normalizedEmail] = password;
  localStorage.setItem(CREDENTIALS_KEY, JSON.stringify(users));
  loginAdmin(normalizedEmail);
}

export async function signInAdmin(email: string, password: string): Promise<void> {
  // Simulate network latency
  await new Promise((resolve) => setTimeout(resolve, 500));
  const normalizedEmail = email.trim().toLowerCase();
  
  const usersRaw = localStorage.getItem(CREDENTIALS_KEY);
  const users: Record<string, string> = usersRaw ? JSON.parse(usersRaw) : {};
  
  if (!users[normalizedEmail] || users[normalizedEmail] !== password) {
    throw new Error("Invalid email or password.");
  }
  
  loginAdmin(normalizedEmail);
}
