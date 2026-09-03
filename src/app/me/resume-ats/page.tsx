import type { Metadata } from 'next';
import { buildListMetadata } from '@/lib/seo/metadata';
import { ResumeAtsAnalyzer } from '@/components/jobs/ResumeAtsAnalyzer';

export const metadata: Metadata = buildListMetadata({
  title: 'Resume ATS analysis',
  description: 'Upload your resume to get a quality score, matching open roles, and improvement tips.',
  path: '/me/resume-ats',
});

export default function ResumeAtsPage() {
  return (
    <div className="container-page py-10">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-ink-900">Resume ATS analysis</h1>
        <p className="mt-2 text-ink-500">
          Upload your resume to get a quality score, matching open roles, and concrete suggestions to improve it.
        </p>
      </header>
      <ResumeAtsAnalyzer />
    </div>
  );
}