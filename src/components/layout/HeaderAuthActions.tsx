"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth/AuthProvider";
import { Avatar } from "@/components/ui/Avatar";

export function HeaderAuthActions() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);

  if (!user) {
    return (
      <Link
        href="/login"
        className="ml-1 inline-flex items-center rounded-lg bg-ink-900 px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium text-white transition hover:bg-ink-800"
      >
        Sign in
      </Link>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="ml-1 flex items-center gap-2 rounded-full p-1 pr-2 transition hover:bg-ink-50 dark:hover:bg-ink-800"
      >
        <Avatar src={user.avatarUrl} name={user.name} size={30} />
        <span className="hidden text-sm font-medium text-ink-700 dark:text-ink-300 sm:inline">
          {user.name}
        </span>
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 z-50 mt-2 w-48 rounded-xl border border-ink-100 dark:border-ink-800 bg-white dark:bg-ink-900 p-1.5 shadow-lg">
            <Link
              href="/me/applications"
              onClick={() => setOpen(false)}
              className="block rounded-lg px-3 py-2 text-sm font-medium text-ink-700 dark:text-ink-300 hover:bg-ink-50 dark:hover:bg-ink-800"
            >
              My applications
            </Link>
            <Link
              href="/me/saved-jobs"
              onClick={() => setOpen(false)}
              className="block rounded-lg px-3 py-2 text-sm font-medium text-ink-700 dark:text-ink-300 hover:bg-ink-50 dark:hover:bg-ink-800"
            >
              Saved jobs
            </Link>
            <Link
              href="/me/job-alerts"
              onClick={() => setOpen(false)}
              className="block rounded-lg px-3 py-2 text-sm font-medium text-ink-700 dark:text-ink-300 hover:bg-ink-50 dark:hover:bg-ink-800"
            >
              Job alerts
            </Link>
            <Link
              href="/me/preferences"
              onClick={() => setOpen(false)}
              className="block rounded-lg px-3 py-2 text-sm font-medium text-ink-700 dark:text-ink-300 hover:bg-ink-50 dark:hover:bg-ink-800"
            >
              Job preferences
            </Link>
            <Link
              href="/me/resume"
              onClick={() => setOpen(false)}
              className="block rounded-lg px-3 py-2 text-sm font-medium text-ink-700 dark:text-ink-300 hover:bg-ink-50 dark:hover:bg-ink-800"
            >
              My resume
            </Link>
            <Link
              href="/me/resume-ats"
              onClick={() => setOpen(false)}
              className="block rounded-lg px-3 py-2 text-sm font-medium text-ink-700 dark:text-ink-300 hover:bg-ink-50 dark:hover:bg-ink-800"
            >
              Resume ATS analysis
            </Link>
            <Link
              href="/me/bookmarks"
              onClick={() => setOpen(false)}
              className="block rounded-lg px-3 py-2 text-sm font-medium text-ink-700 dark:text-ink-300 hover:bg-ink-50 dark:hover:bg-ink-800"
            >
              Bookmarks
            </Link>
            <div className="my-1 h-px bg-ink-100 dark:bg-ink-800" />
            {user.role === "AUTHOR" ? (
              <a
                href={`${process.env.NEXT_PUBLIC_ADMIN_URL ?? "http://localhost:3001"}/jobs`}
                onClick={() => setOpen(false)}
                className="block rounded-lg px-3 py-2 text-sm font-medium text-ink-700 dark:text-ink-300 hover:bg-ink-50 dark:hover:bg-ink-800"
              >
                Post a job
              </a>
            ) : user.role === "USER" ? (
              <Link
                href="/me/employer-access"
                onClick={() => setOpen(false)}
                className="block rounded-lg px-3 py-2 text-sm font-medium text-ink-700 dark:text-ink-300 hover:bg-ink-50 dark:hover:bg-ink-800"
              >
                Post a job (request access)
              </Link>
            ) : null}
            <div className="my-1 h-px bg-ink-100 dark:bg-ink-800" />
            <button
              onClick={() => {
                setOpen(false);
                logout();
              }}
              className="block w-full rounded-lg px-3 py-2 text-left text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30"
            >
              Sign out
            </button>
          </div>
        </>
      )}
    </div>
  );
}
