"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type AuthCustomer = {
  id?: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  phone: string | null;
  defaultAddress: {
    address1: string | null;
    address2: string | null;
    city: string | null;
    province: string | null;
    zip: string | null;
    country: string | null;
  } | null;
};

type AuthContextValue = {
  customer: AuthCustomer | null;
  hydrated: boolean;
  enabled: boolean;
  login: (
    email: string,
    password: string,
  ) => Promise<{ ok: boolean; error?: string }>;
  register: (input: {
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
  }) => Promise<{ ok: boolean; error?: string }>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [customer, setCustomer] = useState<AuthCustomer | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const [enabled, setEnabled] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const res = await fetch("/api/auth/me", { cache: "no-store" });
      const data = (await res.json()) as {
        customer?: AuthCustomer | null;
        enabled?: boolean;
      };
      setEnabled(data.enabled !== false);
      setCustomer(data.customer ?? null);
    } catch {
      setCustomer(null);
    } finally {
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const login = useCallback(async (email: string, password: string) => {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = (await res.json()) as {
        customer?: AuthCustomer;
        error?: string;
      };
      if (!res.ok) return { ok: false, error: data.error ?? "Login failed" };
      setCustomer(data.customer ?? null);
      return { ok: true };
    } catch {
      return { ok: false, error: "Login failed" };
    }
  }, []);

  const register = useCallback(
    async (input: {
      email: string;
      password: string;
      firstName?: string;
      lastName?: string;
    }) => {
      try {
        const res = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(input),
        });
        const data = (await res.json()) as {
          customer?: AuthCustomer;
          error?: string;
        };
        if (!res.ok) {
          return { ok: false, error: data.error ?? "Could not create account" };
        }
        setCustomer(data.customer ?? null);
        return { ok: true };
      } catch {
        return { ok: false, error: "Could not create account" };
      }
    },
    [],
  );

  const logout = useCallback(async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setCustomer(null);
  }, []);

  const value = useMemo(
    () => ({
      customer,
      hydrated,
      enabled,
      login,
      register,
      logout,
      refresh,
    }),
    [customer, hydrated, enabled, login, register, logout, refresh],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
