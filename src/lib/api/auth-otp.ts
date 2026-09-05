import { apiFetch } from '@/lib/api/client';
import type { User } from '@/types';

export function sendSignupOtp(email: string) {
  return apiFetch<{ sent: boolean }>('/signup-otp/send', {
    method: 'POST',
    body: JSON.stringify({ email }),
    revalidate: false,
  });
}

export function verifySignupOtp(email: string, otp: string) {
  return apiFetch<{ verified: boolean }>('/signup-otp/verify', {
    method: 'POST',
    body: JSON.stringify({ email, otp }),
    revalidate: false,
  });
}

export interface CompleteSignupInput {
  email: string;
  otp: string;
  name: string;
  username: string;
  password: string;
}

export function completeSignup(input: CompleteSignupInput) {
  // Not wrapped in the usual { success, data } envelope (the backend
  // controller writes the response directly so it can also forward
  // Better Auth's session cookie) — apiFetch's unwrap check just falls
  // through to returning the body as-is, so this still works.
  return apiFetch<{ user: User; onboardingRequired: boolean }>('/signup-otp/complete', {
    method: 'POST',
    body: JSON.stringify(input),
    revalidate: false,
  });
}
