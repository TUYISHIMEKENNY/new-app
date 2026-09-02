import { useEffect, useState } from "react";

export type AdminUser = {
  id: string;
  email: string;
};

export type AdminAuthState = {
  isReady: boolean;
  user: AdminUser | null;
  isAdmin: boolean;
};

const AUTH_STORAGE_KEY = "lumen_admin_session";
const USERS_STORAGE_KEY = "lumen_admin_users";

export function useAdminAuth(): AdminAuthState {
  const [isReady, setIsReady] = useState(false);
  const [user, setUser] = useState<AdminUser | null>(null);

  useEffect(() => {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    if (raw) {
      try {
        setUser(JSON.parse(raw));
      } catch {
        setUser(null);
      }
    }
    setIsReady(true);
  }, []);

  return {
    isReady,
    user,
    isAdmin: !!user,
  };
}

export function logoutAdmin() {
  localStorage.removeItem(AUTH_STORAGE_KEY);
  window.dispatchEvent(new Event("storage"));
}

export async function signUpAdmin(email: string, _password: string): Promise<void> {
  const newUser: AdminUser = {
    id: `admin-${Date.now()}`,
    email: email.trim().toLowerCase(),
  };

  const rawUsers = localStorage.getItem(USERS_STORAGE_KEY);
  const users: AdminUser[] = rawUsers ? JSON.parse(rawUsers) : [];
  users.push(newUser);
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));

  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(newUser));
  window.dispatchEvent(new Event("storage"));
}

export async function signInAdmin(email: string, _password: string): Promise<void> {
  const cleanEmail = email.trim().toLowerCase();
  const rawUsers = localStorage.getItem(USERS_STORAGE_KEY);
  const users: AdminUser[] = rawUsers ? JSON.parse(rawUsers) : [];

  let matching = users.find((u) => u.email === cleanEmail);
  if (!matching) {
    // If no admin user exists yet, allow initial sign in directly
    matching = {
      id: `admin-${Date.now()}`,
      email: cleanEmail,
    };
    users.push(matching);
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  }

  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(matching));
  window.dispatchEvent(new Event("storage"));
}
