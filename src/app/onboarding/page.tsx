import type { Metadata } from 'next';
import { OnboardingFlow } from '@/components/auth/OnboardingFlow';
import { buildListMetadata } from '@/lib/seo/metadata';

export const metadata: Metadata = buildListMetadata({
  title: 'Set up your profile',
  description: 'A few optional details to personalize your account.',
  path: '/onboarding',
});

export default function OnboardingPage() {
  return (
    <div className="container-page flex min-h-[70vh] flex-col items-center justify-center py-16">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold text-ink-900 dark:text-ink-100">Welcome! Let&apos;s set up your profile</h1>
        <p className="mt-1.5 text-sm text-ink-500 dark:text-ink-400">
          Everything here is optional — pick whatever you&apos;d like, or skip it for now.
        </p>
      </div>
      <OnboardingFlow />
    </div>
  );
}
