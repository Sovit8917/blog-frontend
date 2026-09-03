import Link from "next/link";
import Image from "next/image";
import { BadgeCheck, MapPin, Briefcase } from "lucide-react";
import type { Company } from "@/types";

export function CompanyCard({ company }: { company: Company }) {
  return (
    <Link
      href={`/companies/${company.slug}`}
      className="group flex flex-col gap-3 rounded-xl border border-ink-100 dark:border-ink-800 p-5 transition hover:border-brand-200 dark:hover:border-brand-700 hover:shadow-sm"
    >
      <div className="relative flex h-14 w-14 items-center justify-center overflow-hidden rounded-lg bg-ink-100 dark:bg-ink-800">
        {company.logoUrl ? (
          <Image
            src={company.logoUrl}
            alt={company.name}
            fill
            className="object-cover"
          />
        ) : (
          <span className="text-lg font-bold text-ink-400 dark:text-ink-500">
            {company.name[0]}
          </span>
        )}
      </div>

      <div>
        <h3 className="flex items-center gap-1.5 font-semibold text-ink-900 dark:text-ink-100 transition group-hover:text-brand-600 dark:group-hover:text-brand-400">
          {company.name}
          {company.isVerified && (
            <BadgeCheck size={15} className="text-brand-500 dark:text-brand-400" />
          )}
        </h3>
        {company.location && (
          <p className="mt-0.5 flex items-center gap-1 text-xs text-ink-400 dark:text-ink-500">
            <MapPin size={12} /> {company.location}
          </p>
        )}
      </div>

      {company.description && (
        <p className="line-clamp-2 text-sm text-ink-500 dark:text-ink-400">
          {company.description}
        </p>
      )}

      {company._count && (
        <p className="mt-auto flex items-center gap-1 text-xs font-medium text-brand-600 dark:text-brand-400">
          <Briefcase size={12} /> {company._count.jobs} open role
          {company._count.jobs === 1 ? "" : "s"}
        </p>
      )}
    </Link>
  );
}
