import { createAuthClient } from 'better-auth/react';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000';

// Better Auth is mounted at `/auth/*` on the backend, OUTSIDE the `/api/v1`
// prefix used by the rest of the API (see basePath in the backend's
// src/auth/better-auth.ts and the exclude rule in main.ts).
export const authClient = createAuthClient({
  baseURL: `${API_URL}/auth`,
  fetchOptions: {
    credentials: 'include',
  },
});

export const { useSession, signIn, signUp, signOut, forgetPassword, resetPassword } = authClient;

// Shape of `session.user` as returned by Better Auth, including the
// `username`/`role`/`bio` additionalFields declared on the backend.
export interface SessionUser {
  id: string;
  email: string;
  name: string;
  username: string;
  role: 'SUPER_ADMIN' | 'ADMIN' | 'EDITOR' | 'AUTHOR' | 'USER';
  image?: string | null;
  bio?: string | null;
  emailVerified: boolean;
}
