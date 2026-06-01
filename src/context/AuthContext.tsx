"use client";

import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { authApi } from "@/lib/services";
import { ApiError } from "@/lib/api-client";
import type { SessionUser } from "@/lib/types";
import { ROUTES } from "@/lib/routes";

interface AuthContextValue {
  session: SessionUser | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<string | null>;
  signUp: (name: string, email: string, password: string) => Promise<string | null>;
  signOut: () => Promise<void>;
  demoLogin: () => Promise<void>;
  refreshSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<SessionUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const refreshSession = useCallback(async () => {
    try {
      const { user } = await authApi.me();
      setSession(user);
    } catch {
      setSession(null);
    }
  }, []);

  useEffect(() => {
    refreshSession().finally(() => setLoading(false));
  }, [refreshSession]);

  const signIn = useCallback(async (email: string, password: string) => {
    try {
      const { user } = await authApi.login(email, password);
      setSession(user);
      return null;
    } catch (e) {
      return e instanceof ApiError ? e.message : "Sign in failed";
    }
  }, []);

  const signUp = useCallback(async (name: string, email: string, password: string) => {
    try {
      const { user } = await authApi.signup(name, email, password);
      setSession(user);
      return null;
    } catch (e) {
      return e instanceof ApiError ? e.message : "Sign up failed";
    }
  }, []);

  const signOut = useCallback(async () => {
    await authApi.logout();
    setSession(null);
    router.push(ROUTES.home);
  }, [router]);

  const demoLogin = useCallback(async () => {
    const { user } = await authApi.demo();
    setSession(user);
    router.push(ROUTES.dashboard);
  }, [router]);

  return (
    <AuthContext.Provider value={{ session, loading, signIn, signUp, signOut, demoLogin, refreshSession }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
