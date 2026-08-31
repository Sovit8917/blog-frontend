"use client";

import { useState } from "react";
import type { Comment } from "@/types";
import { Avatar } from "@/components/ui/Avatar";
import { timeAgo } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { MessageCircle } from "lucide-react";
import { apiFetch } from "@/lib/api/client";

/**
 * Comment thread. Reads the server-fetched initial list (approved comments
 * only — moderation happens via `PATCH /cms/comments/:id/moderate`), and posts
 * new top-level comments to `POST /comments` (requires auth; newly created
 * comments default to PENDING so they won't appear until approved).
 */
export function CommentSection({
  postId,
  initialComments,
}: {
  postId: string;
  initialComments: Comment[];
}) {
  const [comments] = useState<Comment[]>(
    Array.isArray(initialComments)
      ? initialComments
      : (initialComments as { items?: Comment[] })?.items ?? [],
  );
  const [draft, setDraft] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!draft.trim()) return;
    setSubmitting(true);
    try {
      await apiFetch("/comments", {
        method: "POST",
        body: JSON.stringify({ postId, content: draft }),
        revalidate: false,
      });
      setDraft("");
      setNotice(
        "Thanks — your comment is awaiting moderation and will appear shortly.",
      );
    } catch {
      setNotice("Please sign in to comment.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="comments" className="mt-16 border-t border-ink-100 pt-10">
      <h2 className="mb-6 flex items-center gap-2 text-xl font-bold text-ink-900">
        <MessageCircle size={20} /> Comments (
        {Array.isArray(comments) ? comments.length : 0})
      </h2>

      <form onSubmit={onSubmit} className="mb-10">
        <textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Share your thoughts…"
          rows={3}
          className="w-full resize-none rounded-xl border border-ink-200 p-4 text-sm outline-none placeholder:text-ink-400 focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
        />
        <div className="mt-2 flex items-center justify-between">
          {notice && <p className="text-xs text-ink-500">{notice}</p>}
          <Button
            type="submit"
            size="sm"
            disabled={submitting}
            className="ml-auto"
          >
            {submitting ? "Posting…" : "Post comment"}
          </Button>
        </div>
      </form>

      <ul className="space-y-6">
        {Array.isArray(comments) &&
          comments.map((c) => (
            <li key={c.id} className="flex gap-3">
              <Avatar
                src={c.user?.avatarUrl}
                name={c.user?.name ?? "Anonymous"}
                size={36}
              />
              <div className="flex-1">
                <div className="flex items-baseline gap-2">
                  <span className="text-sm font-semibold text-ink-900">
                    {c.user?.name ?? "Anonymous"}
                  </span>
                  <span className="text-xs text-ink-400">
                    {timeAgo(c.createdAt)}
                  </span>
                </div>
                <p className="mt-1 text-sm leading-relaxed text-ink-700">
                  {c.content}
                </p>
              </div>
            </li>
          ))}
        {(!Array.isArray(comments) || comments.length === 0) && (
          <p className="text-sm text-ink-400">
            Be the first to share your thoughts.
          </p>
        )}
      </ul>
    </section>
  );
}
