import type { Metadata } from 'next';
import Link from 'next/link';
import { Code2 } from 'lucide-react';
import { listSkills } from '@/lib/api';
import { buildListMetadata } from '@/lib/seo/metadata';

export const metadata: Metadata = buildListMetadata({
  title: 'Developer Resources',
  description: 'Browse jobs by skill and technology.',
  path: '/skills',
});

export const revalidate = 300;

export default async function SkillsPage() {
  const skills = await listSkills();
  const sorted = [...skills].sort((a, b) => (b._count?.jobs ?? 0) - (a._count?.jobs ?? 0));

  return (
    <div className="container-page py-10">
      <header className="mb-10 max-w-2xl">
        <p className="text-sm font-semibold uppercase tracking-wider text-brand-600">Developer Resources</p>
        <h1 className="mt-1 text-3xl font-bold text-ink-900 sm:text-4xl">Learn a skill, then find the job</h1>
        <p className="mt-3 text-ink-500">
          Each technology below has its own hub: tutorials and articles to learn it, plus the
          open roles currently hiring for it.
        </p>
      </header>

      {sorted.length === 0 ? (
        <div className="rounded-xl border border-dashed border-ink-200 py-16 text-center text-ink-400">
          No skills listed yet.
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {sorted.map((skill) => (
            <Link
              key={skill.id}
              href={`/skills/${skill.slug}`}
              className="group flex items-center justify-between gap-2 rounded-xl border border-ink-100 px-4 py-3.5 transition hover:border-brand-200 hover:shadow-sm"
            >
              <span className="flex items-center gap-2 font-medium text-ink-800 group-hover:text-brand-600">
                <Code2 size={15} className="text-ink-300 group-hover:text-brand-400" />
                {skill.name}
              </span>
              <span className="text-xs font-medium text-ink-400">{skill._count?.jobs ?? 0}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
