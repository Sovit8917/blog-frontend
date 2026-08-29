'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import * as authApi from '@/lib/api/auth';
import type { User } from '@/types';

interface AuthContextValue {
  user: User | null;
  login: (input: { email: string; password: string }) => Promise<void>;
  register: (input: { email: string; username: string; name: string; password: string }) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

// access_token lives 15min server-side (see auth.controller.ts); refresh a
// little ahead of that so an open tab never actually reaches the expiry
// window during normal use. apiFetch's reactive 401-retry (client.ts) and
// the middleware's SSR-time refresh both still cover the cases this timer
// misses (tab backgrounded/throttled, first load with a stale access_token, etc).
const BACKGROUND_REFRESH_INTERVAL_MS = 10 * 60 * 1000;

/**
 * `initialUser` is resolved server-side (see lib/auth/session.ts) so the
 * first paint already knows whether someone's signed in — no client-side
 * flash while a `/auth/me` request is in flight. Mutations here just update
 * local state optimistically and `router.refresh()` so any server components
 * reading the session (Header, /me pages) re-fetch with the new cookies.
 */
export function AuthProvider({
  initialUser,
  children,
}: {
  initialUser: User | null;
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<User | null>(initialUser);
  const router = useRouter();

  useEffect(() => {
    if (!user) return;
    const id = setInterval(() => {
      authApi.refresh().catch(() => undefined);
    }, BACKGROUND_REFRESH_INTERVAL_MS);
    return () => clearInterval(id);
  }, [user]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      login: async (input) => {
        const result = await authApi.login(input);
        setUser(result.user);
        router.refresh();
      },
      register: async (input) => {
        const result = await authApi.register(input);
        setUser(result.user);
        router.refresh();
      },
      logout: async () => {
        await authApi.logout().catch(() => undefined);
        setUser(null);
        router.refresh();
      },
    }),
    [user, router],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within <AuthProvider>');
  return ctx;
}
