"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export type SessionData = {
  token: string;
  nome?: string;
  email?: string;
  tipo?: "admin" | "aluno";
};

type SessionUpdater = SessionData | null | ((previous: SessionData | null) => SessionData | null);

const USER_STORAGE_KEY = "tia-maria-auth";
const TOKEN_STORAGE_KEY = "tia-maria-token";

export function useSsoSession() {
  const router = useRouter();
  const [session, setSessionState] = useState<SessionData | null>(null);
  const [initializing, setInitializing] = useState(true);

  const persistSession = useCallback((value: SessionData | null) => {
    if (typeof window === "undefined") {
      return;
    }

    if (value?.token) {
      window.localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(value));
      window.localStorage.setItem(TOKEN_STORAGE_KEY, value.token);
    } else {
      window.localStorage.removeItem(USER_STORAGE_KEY);
      window.localStorage.removeItem(TOKEN_STORAGE_KEY);
    }
  }, []);

  const updateSession = useCallback((updater: SessionUpdater) => {
    setSessionState((previous) => {
      const next = typeof updater === "function" ? (updater as (value: SessionData | null) => SessionData | null)(previous) : updater;
      persistSession(next);
      return next;
    });
  }, [persistSession]);

  const logout = useCallback(() => {
    updateSession(null);
    router.replace("/?login=1");
  }, [router, updateSession]);

  useEffect(() => {
    if (session?.token) {
      setInitializing(false);
      return;
    }

    if (typeof window === "undefined") {
      return;
    }

    const currentUrl = new URL(window.location.href);
    const tokenParam = currentUrl.searchParams.get("token")?.trim() ?? "";

    if (tokenParam) {
      updateSession({ token: tokenParam });
      currentUrl.searchParams.delete("token");
      const cleanPath = `${currentUrl.pathname}${currentUrl.search}${currentUrl.hash}`;
      router.replace(cleanPath || "/", { scroll: false });
      setInitializing(false);
      return;
    }

    const stored = window.localStorage.getItem(USER_STORAGE_KEY);
    if (!stored) {
      setInitializing(false);
      router.replace("/?login=1");
      return;
    }

    try {
      const parsed = JSON.parse(stored) as SessionData | null;
      if (!parsed?.token) {
        throw new Error("invalid-session");
      }
      updateSession(parsed);
    } catch (error) {
      console.warn("Falha ao restaurar sessão local", error);
      updateSession(null);
      router.replace("/?login=1");
    } finally {
      setInitializing(false);
    }
  }, [router, session?.token, updateSession]);

  return { session, initializing, logout, updateSession };
}
