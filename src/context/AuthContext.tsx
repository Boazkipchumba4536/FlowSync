"use client";

import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import {
  type Session,
  getSession,
  signIn as authSignIn,
  signUp as authSignUp,
  signOut as authSignOut,
  demoSignIn,
  ensurePlatformAccounts,
  DEMO_EMAIL,
} from "@/lib/auth";
import { seedDemoUserData, addAuditLog } from "@/lib/store";
import { ROUTES } from "@/lib/routes";

interface AuthContextValue {
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<string | null>;
  signUp: (name: string, email: string, password: string) => Promise<string | null>;
  signOut: () => void;
  demoLogin: () => void;
  refreshSession: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const refreshSession = useCallback(() => {
    setSession(getSession());
  }, []);

  useEffect(() => {
    ensurePlatformAccounts();
    setSession(getSession());
    setLoading(false);
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    const result = authSignIn(email, password);
    if (result.ok) {
      if (email.toLowerCase() === DEMO_EMAIL) {
        seedDemoUserData(result.session.userId);
      }
      addAuditLog("login", `User signed in: ${email}`, result.session.userId);
      setSession(getSession());
      return null;
    }
    return result.error;
  }, []);

  const signUp = useCallback(async (name: string, email: string, password: string) => {
    const result = authSignUp(name, email, password);
    if (result.ok) {
      addAuditLog("signup", `New user registered: ${email}`, result.session.userId);
      setSession(getSession());
      return null;
    }
    return result.error;
  }, []);

  const signOut = useCallback(() => {
    if (session) addAuditLog("logout", `User signed out: ${session.email}`, session.userId);
    authSignOut();
    setSession(null);
    router.push(ROUTES.home);
  }, [router, session]);

  const demoLogin = useCallback(() => {
    const s = demoSignIn();
    seedDemoUserData(s.userId);
    addAuditLog("login", "Demo account accessed", s.userId);
    setSession(getSession());
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
