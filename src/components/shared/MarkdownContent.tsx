import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import Image from "next/image";
import { Link2 } from "lucide-react";

/**
 * One markdown renderer shared by blog posts and job descriptions, so
 * long-form copy — including "quick facts" style tables and requirement
 * bullet lists — always gets the same clear, structural treatment instead of
 * each page hand-rolling its own <ReactMarkdown> config.
 *
 * `slugHeadings` is on by default (blog posts use it for the ToC / deep
 * links); job descriptions turn it off since job pages don't have a ToC and
 * repeated H2s like "Requirements" across postings would otherwise collide
 * on id="requirements".
 */
export function MarkdownContent({
  content,
  slugHeadings = true,
  className = "",
}: {
  content: string;
  slugHeadings?: boolean;
  className?: string;
}) {
  return (
    <div className={`prose prose-ink dark:prose-invert max-w-none ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={
          slugHeadings
            ? [
                rehypeSlug,
                [
                  rehypeAutolinkHeadings,
                  {
                    behavior: "append",
                    properties: {
                      className: ["anchor-link"],
                      ariaHidden: true,
                      tabIndex: -1,
                    },
                  },
                ],
              ]
            : []
        }
        components={{
          img: ({ src, alt }) =>
            src ? (
              <span className="my-8 block overflow-hidden rounded-xl">
                <Image
                  src={src}
                  alt={alt || ""}
                  width={1400}
                  height={800}
                  className="h-auto w-full object-cover"
                  sizes="(max-width: 768px) 100vw, 70ch"
                />
              </span>
            ) : null,
          a: ({ href, children, className: linkClassName }) =>
            linkClassName?.includes("anchor-link") ? (
              <a href={href} className={linkClassName} aria-hidden>
                <Link2 size={15} />
              </a>
            ) : (
              <a
                href={href}
                className="link-underline"
                target={href?.startsWith("http") ? "_blank" : undefined}
                rel={
                  href?.startsWith("http") ? "noopener noreferrer" : undefined
                }
              >
                {children}
              </a>
            ),
          // Wrap tables so wide "quick facts" tables scroll on mobile instead
          // of blowing out the layout, and give them the bordered,
          // clearly-structured look requested for job/detail tables.
          table: ({ children }) => (
            <div className="not-prose my-6 overflow-x-auto rounded-xl border border-ink-100 dark:border-ink-800">
              <table className="w-full border-collapse text-left text-sm">
                {children}
              </table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="bg-ink-50 dark:bg-ink-900">{children}</thead>
          ),
          tr: ({ children }) => (
            <tr className="border-b border-ink-100 dark:border-ink-800 last:border-0">
              {children}
            </tr>
          ),
          th: ({ children }) => (
            <th className="whitespace-nowrap px-4 py-3 font-semibold text-ink-900 dark:text-ink-100">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="px-4 py-3 align-top text-ink-700 dark:text-ink-300">{children}</td>
          ),
          ul: ({ children }) => <ul className="my-2 space-y-1">{children}</ul>,
          ol: ({ children }) => <ol className="my-2 space-y-1">{children}</ol>,
          li: ({ children }) => (
            <li className="marker:text-brand-400 pl-1 leading-snug">
              {children}
            </li>
          ),
          blockquote: ({ children }) => (
            <blockquote className="not-prose my-6 rounded-r-lg border-l-4 border-brand-300 dark:border-brand-700 bg-brand-50/60 dark:bg-brand-900/40 px-5 py-3 text-ink-700 dark:text-ink-300">
              {children}
            </blockquote>
          ),
          code: ({ children, className: codeClassName }) =>
            codeClassName ? (
              <code className={codeClassName}>{children}</code>
            ) : (
              <code className="rounded bg-ink-100 dark:bg-ink-800 px-1.5 py-0.5 text-[0.9em] text-brand-700 dark:text-brand-400">
                {children}
              </code>
            ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
