'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { authClient } from '@/lib/auth/client';
import type { User } from '@/types';

interface AuthContextValue {
  user: User | null;
  login: (input: { email: string; password: string }) => Promise<void>;
  loginWithGoogle: (redirectTo?: string) => Promise<void>;
  register: (input: {
    email: string;
    username: string;
    name: string;
    password: string;
  }) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function toUser(sessionUser: Record<string, unknown> | null | undefined): User | null {
  if (!sessionUser) return null;
  return {
    id: sessionUser.id as string,
    username: sessionUser.username as string,
    name: sessionUser.name as string,
    email: sessionUser.email as string,
    avatarUrl: (sessionUser.image as string | null) ?? null,
    bio: (sessionUser.bio as string | null) ?? null,
    role: sessionUser.role as User['role'],
  };
}

/**
 * `initialUser` is resolved server-side (see lib/auth/session.ts, which reads
 * Better Auth's session cookie) so the first paint already knows whether
 * someone's signed in. After that, `authClient.useSession()` keeps things in
 * sync client-side — Better Auth's session cookie carries a short-lived
 * cache that's automatically refreshed, so unlike the old JWT setup there's
 * no manual refresh-token timer to run here anymore.
 */
export function AuthProvider({
  initialUser,
  children,
}: {
  initialUser: User | null;
  children: React.ReactNode;
}) {
  const { data: session, isPending } = authClient.useSession();
  const [user, setUser] = useState<User | null>(initialUser);
  const router = useRouter();

  useEffect(() => {
    if (isPending) return;
    setUser(toUser(session?.user as Record<string, unknown> | undefined));
  }, [session, isPending]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      login: async (input) => {
        const { data, error } = await authClient.signIn.email(input);
        if (error) throw new Error(error.message || 'Invalid email or password');
        setUser(toUser(data?.user as Record<string, unknown> | undefined));
        router.refresh();
      },
      loginWithGoogle: async (redirectTo = '/') => {
        await authClient.signIn.social({ provider: 'google', callbackURL: redirectTo });
      },
      register: async (input) => {
        const { data, error } = await authClient.signUp.email({
          email: input.email,
          password: input.password,
          name: input.name,
          // additionalField declared on the backend (src/auth/better-auth.ts)
          username: input.username,
        } as Parameters<typeof authClient.signUp.email>[0]);
        if (error) throw new Error(error.message || 'Could not create account');
        setUser(toUser(data?.user as Record<string, unknown> | undefined));
        router.refresh();
      },
      logout: async () => {
        await authClient.signOut().catch(() => undefined);
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
