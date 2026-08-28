import type { Company } from '@/types';
import { CompanyCard } from './CompanyCard';

export function CompanyGrid({ companies }: { companies: Company[] }) {
  if (companies.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-ink-200 py-16 text-center text-ink-400">
        No companies found.
      </div>
    );
  }
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {companies.map((company) => (
        <CompanyCard key={company.id} company={company} />
      ))}
    </div>
  );
}
