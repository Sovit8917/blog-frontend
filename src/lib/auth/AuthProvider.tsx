"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth/client";
import { sendSignupOtp, verifySignupOtp, completeSignup } from "@/lib/api/auth-otp";
import type { User } from "@/types";

interface AuthContextValue {
  user: User | null;
  login: (input: { email: string; password: string }) => Promise<void>;
  loginWithGoogle: (redirectTo?: string) => Promise<void>;
  // Sign-up is OTP-first: an account is only created once the code sent
  // to the address has actually been verified.
  //   1. sendSignupOtp    — email a 6-digit code
  //   2. verifySignupOtp  — check the code (no account yet)
  //   3. finishSignup     — create the account + sign in
  sendSignupOtp: (email: string) => Promise<void>;
  verifySignupOtp: (email: string, otp: string) => Promise<void>;
  finishSignup: (input: {
    email: string;
    otp: string;
    name: string;
    username: string;
    password: string;
  }) => Promise<{ onboardingRequired: boolean }>;
  logout: () => Promise<void>;
}

/** Thrown by `login()` specifically when the credentials are correct but
 *  the account hasn't verified its email yet — lets callers show a
 *  "please verify" screen instead of a generic error message. */
export class EmailNotVerifiedError extends Error {
  constructor(public email: string) {
    super('Please verify your email address before signing in.');
    this.name = 'EmailNotVerifiedError';
  }
}

const AuthContext = createContext<AuthContextValue | null>(null);

function toUser(
  sessionUser: Record<string, unknown> | null | undefined,
): User | null {
  if (!sessionUser) return null;
  return {
    id: sessionUser.id as string,
    username: sessionUser.username as string,
    name: sessionUser.name as string,
    email: sessionUser.email as string,
    avatarUrl: (sessionUser.image as string | null) ?? null,
    bio: (sessionUser.bio as string | null) ?? null,
    role: sessionUser.role as User["role"],
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
        if (error) {
          // Better Auth uses this code when the password is correct but
          // the account's email hasn't been verified yet — surface that
          // distinctly so the UI can point them at verification instead
          // of just saying "invalid email or password".
          if (error.code === "EMAIL_NOT_VERIFIED") {
            throw new EmailNotVerifiedError(input.email);
          }
          throw new Error(error.message || "Invalid email or password");
        }
        setUser(toUser(data?.user as Record<string, unknown> | undefined));
        router.refresh();
      },
      loginWithGoogle: async (redirectTo = "/") => {
        const callbackURL = new URL(
          redirectTo,
          window.location.origin,
        ).toString();

        await authClient.signIn.social({
          provider: "google",
          callbackURL,
        });
      },
      sendSignupOtp: async (email) => {
        await sendSignupOtp(email);
      },
      verifySignupOtp: async (email, otp) => {
        await verifySignupOtp(email, otp);
      },
      finishSignup: async (input) => {
        const result = await completeSignup(input);
        setUser(toUser(result.user as unknown as Record<string, unknown>));
        router.refresh();
        return { onboardingRequired: result.onboardingRequired };
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
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
  return ctx;
}
