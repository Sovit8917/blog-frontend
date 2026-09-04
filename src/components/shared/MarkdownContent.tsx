"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import {
  Link2,
  Check,
  Copy,
  Terminal,
  Server,
  ShieldAlert,
  Code2,
  Wrench,
  FlaskConical,
  Target,
  Layers,
  FileSpreadsheet,
  Users2,
  Briefcase,
  Sparkles,
  Compass,
  Cpu,
  Database,
  Globe,
  Lock,
  Search,
  BookOpen,
  Rocket,
  Award,
  type LucideIcon,
} from "lucide-react";
import React, { useState, useMemo } from "react";

function CodeBlock({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  const [copied, setCopied] = useState(false);
  const match = /language-(\w+)/.exec(className || "");
  const language = match ? match[1] : "";
  const codeText = String(children).replace(/\n$/, "");

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(codeText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  };

  // If inline code
  if (
    !match &&
    !className &&
    typeof children === "string" &&
    !children.includes("\n")
  ) {
    return (
      <code className="rounded-md bg-slate-100 dark:bg-slate-800/90 px-1.5 py-0.5 text-[0.875em] font-mono font-medium text-brand-700 dark:text-brand-300 border border-slate-200/60 dark:border-slate-700/60 shadow-2xs">
        {children}
      </code>
    );
  }

  return (
    <div className="not-prose group relative my-6 overflow-hidden rounded-xl border border-slate-800/80 bg-[#0d1117] text-slate-200 shadow-md">
      <div className="flex items-center justify-between border-b border-slate-800/90 bg-[#161b22] px-4 py-2 text-xs text-slate-400">
        <span className="flex items-center gap-2 font-mono font-semibold text-slate-300">
          <span className="flex gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-red-500/80" />
            <span className="h-2.5 w-2.5 rounded-full bg-amber-500/80" />
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/80" />
          </span>
          <span className="ml-1 text-[11px] tracking-wider uppercase">
            {language || "CODE"}
          </span>
        </span>
        <button
          type="button"
          onClick={handleCopy}
          aria-label="Copy code"
          className="flex items-center gap-1.5 rounded-md px-2.5 py-1 text-[11px] font-medium text-slate-400 transition hover:bg-slate-700 hover:text-slate-100"
        >
          {copied ? (
            <>
              <Check size={13} className="text-emerald-400" />
              <span className="text-emerald-400">Copied!</span>
            </>
          ) : (
            <>
              <Copy size={13} />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
      <pre className="overflow-x-auto p-4 text-[13.5px] font-mono leading-relaxed text-slate-100 selection:bg-brand-600 selection:text-white">
        <code className={className}>{codeText}</code>
      </pre>
    </div>
  );
}

// Icon dictionary matching common tech & career keywords
function getStepIcon(text: string): LucideIcon {
  const lower = text.toLowerCase();
  if (lower.includes("fundament") || lower.includes("computer") || lower.includes("hardware") || lower.includes("cpu")) return Cpu;
  if (lower.includes("network") || lower.includes("web") || lower.includes("internet") || lower.includes("dns")) return Globe;
  if (lower.includes("linux") || lower.includes("unix") || lower.includes("os") || lower.includes("terminal") || lower.includes("bash") || lower.includes("shell") || lower.includes("cli")) return Terminal;
  if (lower.includes("secur") || lower.includes("cyber") || lower.includes("protect") || lower.includes("auth")) return ShieldAlert;
  if (lower.includes("script") || lower.includes("code") || lower.includes("python") || lower.includes("program") || lower.includes("javascript")) return Code2;
  if (lower.includes("tool") || lower.includes("utility") || lower.includes("devops") || lower.includes("git")) return Wrench;
  if (lower.includes("lab") || lower.includes("practice") || lower.includes("hands-on") || lower.includes("test")) return FlaskConical;
  if (lower.includes("specializ") || lower.includes("target") || lower.includes("goal") || lower.includes("path")) return Target;
  if (lower.includes("project") || lower.includes("build") || lower.includes("portfolio") && lower.includes("build")) return Layers;
  if (lower.includes("resume") || lower.includes("cv") || lower.includes("document")) return FileSpreadsheet;
  if (lower.includes("interview") || lower.includes("mock") || lower.includes("people") || lower.includes("communicat")) return Users2;
  if (lower.includes("job") || lower.includes("role") || lower.includes("hire") || lower.includes("career") || lower.includes("apply")) return Briefcase;
  if (lower.includes("database") || lower.includes("sql")) return Database;
  if (lower.includes("server") || lower.includes("cloud") || lower.includes("aws")) return Server;
  if (lower.includes("learn") || lower.includes("study") || lower.includes("book")) return BookOpen;
  if (lower.includes("certif") || lower.includes("degree")) return Award;
  return Sparkles;
}

// Curated vibrant theme themes for roadmap items matching reference aesthetics
const COLOR_THEMES = [
  {
    gradient: "from-blue-500/10 via-sky-500/5 to-white dark:from-blue-950/40 dark:via-ink-900/90 dark:to-ink-900",
    border: "border-blue-200/80 dark:border-blue-500/30 hover:border-blue-400 dark:hover:border-blue-400",
    nodePill: "bg-blue-100 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 border border-blue-300 dark:border-blue-700/60",
    nodeInner: "bg-blue-600 text-white shadow-sm shadow-blue-500/40",
    iconBox: "bg-blue-600 text-white shadow-md shadow-blue-500/30",
    glow: "hover:shadow-blue-500/15",
    line: "#3b82f6",
  },
  {
    gradient: "from-emerald-500/10 via-teal-500/5 to-white dark:from-emerald-950/40 dark:via-ink-900/90 dark:to-ink-900",
    border: "border-emerald-200/80 dark:border-emerald-500/30 hover:border-emerald-400 dark:hover:border-emerald-400",
    nodePill: "bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-700/60",
    nodeInner: "bg-emerald-600 text-white shadow-sm shadow-emerald-500/40",
    iconBox: "bg-emerald-600 text-white shadow-md shadow-emerald-500/30",
    glow: "hover:shadow-emerald-500/15",
    line: "#10b981",
  },
  {
    gradient: "from-amber-400/15 via-yellow-500/5 to-white dark:from-amber-950/40 dark:via-ink-900/90 dark:to-ink-900",
    border: "border-amber-200/80 dark:border-amber-500/30 hover:border-amber-400 dark:hover:border-amber-400",
    nodePill: "bg-amber-100 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400 border border-amber-300 dark:border-amber-700/60",
    nodeInner: "bg-amber-500 text-white shadow-sm shadow-amber-500/40",
    iconBox: "bg-amber-500 text-white shadow-md shadow-amber-500/30",
    glow: "hover:shadow-amber-500/15",
    line: "#f59e0b",
  },
  {
    gradient: "from-rose-500/10 via-pink-500/5 to-white dark:from-rose-950/40 dark:via-ink-900/90 dark:to-ink-900",
    border: "border-rose-200/80 dark:border-rose-500/30 hover:border-rose-400 dark:hover:border-rose-400",
    nodePill: "bg-rose-100 dark:bg-rose-950/80 text-rose-600 dark:text-rose-400 border border-rose-300 dark:border-rose-700/60",
    nodeInner: "bg-rose-500 text-white shadow-sm shadow-rose-500/40",
    iconBox: "bg-rose-500 text-white shadow-md shadow-rose-500/30",
    glow: "hover:shadow-rose-500/15",
    line: "#f43f5e",
  },
  {
    gradient: "from-purple-500/10 via-violet-500/5 to-white dark:from-purple-950/40 dark:via-ink-900/90 dark:to-ink-900",
    border: "border-purple-200/80 dark:border-purple-500/30 hover:border-purple-400 dark:hover:border-purple-400",
    nodePill: "bg-purple-100 dark:bg-purple-950/80 text-purple-600 dark:text-purple-400 border border-purple-300 dark:border-purple-700/60",
    nodeInner: "bg-purple-600 text-white shadow-sm shadow-purple-500/40",
    iconBox: "bg-purple-600 text-white shadow-md shadow-purple-500/30",
    glow: "hover:shadow-purple-500/15",
    line: "#a855f7",
  },
  {
    gradient: "from-cyan-500/10 via-teal-500/5 to-white dark:from-cyan-950/40 dark:via-ink-900/90 dark:to-ink-900",
    border: "border-cyan-200/80 dark:border-cyan-500/30 hover:border-cyan-400 dark:hover:border-cyan-400",
    nodePill: "bg-cyan-100 dark:bg-cyan-950/80 text-cyan-600 dark:text-cyan-400 border border-cyan-300 dark:border-cyan-700/60",
    nodeInner: "bg-cyan-600 text-white shadow-sm shadow-cyan-500/40",
    iconBox: "bg-cyan-600 text-white shadow-md shadow-cyan-500/30",
    glow: "hover:shadow-cyan-500/15",
    line: "#06b6d4",
  },
];

interface RoadmapStep {
  title: string;
}

function RoadmapTimeline({ steps }: { steps: RoadmapStep[] }) {
  if (!steps || steps.length === 0) return null;

  return (
    <div className="not-prose my-10 w-full select-none py-2">
      <div className="relative mx-auto max-w-[580px]">
        {/* Continuous Flowing Track Line */}
        <div className="absolute left-[20px] sm:left-1/2 top-5 bottom-5 w-[3px] -translate-x-1/2 rounded-full bg-slate-300 dark:bg-slate-700/80" />

        <div className="flex flex-col gap-6 sm:gap-8">
          {steps.map((step, idx) => {
            const theme = COLOR_THEMES[idx % COLOR_THEMES.length];
            const StepIcon = getStepIcon(step.title);
            const isEven = idx % 2 === 0;

            return (
              <div
                key={idx}
                className="group relative flex items-center gap-3.5 sm:gap-0"
              >
                {/* Mobile Left-side Pill Badge */}
                <div className="relative z-20 flex shrink-0 sm:hidden">
                  <div
                    className={`flex items-center justify-center rounded-full p-1 shadow-sm transition-transform duration-300 group-hover:scale-110 ${theme.nodePill}`}
                  >
                    <div
                      className={`flex h-8 w-8 items-center justify-center rounded-full font-mono text-xs font-black ${theme.nodeInner}`}
                    >
                      {idx + 1}
                    </div>
                  </div>
                </div>

                {/* Desktop Left Column (Active on Even items) */}
                <div
                  className={`hidden sm:flex sm:w-1/2 sm:pr-8 sm:relative sm:items-center ${
                    isEven ? "justify-end" : "invisible pointer-events-none"
                  }`}
                >
                  {isEven && (
                    <>
                      {/* Smooth Horizontal Connecting Bridge */}
                      <div className="absolute right-0 top-1/2 h-[2px] w-8 -translate-y-1/2 bg-slate-300 dark:bg-slate-700 transition-all duration-300 group-hover:bg-slate-400 dark:group-hover:bg-slate-500" />

                      <div
                        className={`relative z-10 w-full max-w-[245px] rounded-2xl border ${theme.border} bg-white dark:bg-ink-900 bg-gradient-to-br ${theme.gradient} px-4 py-3 shadow-sm transition-all duration-300 group-hover:-translate-y-0.5 group-hover:shadow-md ${theme.glow}`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${theme.iconBox} transition-transform duration-300 group-hover:scale-105`}
                          >
                            <StepIcon className="h-5 w-5 stroke-[2.2]" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <span className="text-[14px] font-bold tracking-tight text-ink-900 dark:text-ink-50 leading-snug break-words">
                              {step.title}
                            </span>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>

                {/* Desktop Center Vertical Pill Capsule Node */}
                <div className="relative z-20 hidden sm:flex sm:w-0 sm:items-center sm:justify-center">
                  <div
                    className={`flex items-center justify-center -translate-x-1/2 rounded-full px-1.5 py-1.5 shadow-sm transition-all duration-300 group-hover:scale-115 ${theme.nodePill}`}
                  >
                    <div
                      className={`flex h-8 w-8 items-center justify-center rounded-full font-mono text-[12px] font-black ${theme.nodeInner}`}
                    >
                      {idx + 1}
                    </div>
                  </div>
                </div>

                {/* Desktop Right Column (Active on Odd items) / Mobile Card */}
                <div
                  className={`flex-1 sm:w-1/2 sm:pl-8 sm:relative sm:items-center ${
                    !isEven ? "sm:flex sm:justify-start" : "sm:hidden"
                  }`}
                >
                  {/* Smooth Horizontal Connecting Bridge (Desktop) */}
                  <div className="hidden sm:block absolute left-0 top-1/2 h-[2px] w-8 -translate-y-1/2 bg-slate-300 dark:bg-slate-700 transition-all duration-300 group-hover:bg-slate-400 dark:group-hover:bg-slate-500" />

                  <div
                    className={`relative z-10 w-full sm:max-w-[245px] rounded-2xl border ${theme.border} bg-white dark:bg-ink-900 bg-gradient-to-br ${theme.gradient} px-4 py-3 shadow-sm transition-all duration-300 group-hover:-translate-y-0.5 group-hover:shadow-md ${theme.glow}`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${theme.iconBox} transition-transform duration-300 group-hover:scale-105`}
                      >
                        <StepIcon className="h-5 w-5 stroke-[2.2]" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <span className="text-[14px] font-bold tracking-tight text-ink-900 dark:text-ink-50 leading-snug break-words">
                          {step.title}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/**
 * Parses markdown to detect step sequences separated by arrows
 * Handles bold markers (**text**), linebreaks, and arrows (↓, ⬇, ➔, ->, -->)
 */
function processRoadmapContent(content: string) {
  if (!content) return { segments: [] };

  // Split by code blocks first so we don't parse inside code
  const codeBlockSplitRegex = /(```[\s\S]*?```)/g;
  const rawParts = content.split(codeBlockSplitRegex);

  const segments: Array<{
    type: "markdown" | "roadmap";
    content?: string;
    steps?: RoadmapStep[];
  }> = [];

  for (const part of rawParts) {
    if (part.startsWith("```")) {
      segments.push({ type: "markdown", content: part });
      continue;
    }

    const lines = part.split(/\r?\n/);
    let currentSteps: RoadmapStep[] = [];
    let currentMarkdownLines: string[] = [];
    let pendingStep: string | null = null;
    let expectingArrow = false;

    const isArrowLine = (line: string) => {
      const trimmed = line.trim();
      return (
        trimmed === "↓" ||
        trimmed === "⬇" ||
        trimmed === "➔" ||
        trimmed === "->" ||
        trimmed === "-->" ||
        trimmed === "|" ||
        trimmed === "v" ||
        trimmed === "V"
      );
    };

    const cleanStepTitle = (line: string) => {
      return line
        .trim()
        .replace(/^(\*\*|__)+/, "")
        .replace(/(\*\*|__)+$/, "")
        .trim();
    };

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const trimmed = line.trim();

      if (!trimmed) {
        // Blank line
        if (pendingStep && !expectingArrow) {
          // If we had a step and now hit blank lines before arrow
          continue;
        } else if (expectingArrow) {
          continue;
        } else {
          currentMarkdownLines.push(line);
        }
        continue;
      }

      if (isArrowLine(trimmed)) {
        if (pendingStep) {
          currentSteps.push({ title: cleanStepTitle(pendingStep) });
          pendingStep = null;
          expectingArrow = false;
        }
        continue;
      }

      // Check if next non-empty line is an arrow or previous had arrow
      if (currentSteps.length > 0 && !pendingStep) {
        // We are currently in a chain, this line is the next step!
        pendingStep = line;
        expectingArrow = true;
        continue;
      }

      // Lookahead to check if this line is followed by an arrow
      let nextIsArrow = false;
      for (let j = i + 1; j < lines.length; j++) {
        const nextLine = lines[j].trim();
        if (!nextLine) continue;
        if (isArrowLine(nextLine)) {
          nextIsArrow = true;
        }
        break;
      }

      if (nextIsArrow) {
        // Flush previous markdown lines
        if (currentMarkdownLines.length > 0) {
          segments.push({
            type: "markdown",
            content: currentMarkdownLines.join("\n"),
          });
          currentMarkdownLines = [];
        }
        pendingStep = line;
        expectingArrow = true;
      } else {
        // If we had an active chain ending here
        if (pendingStep) {
          currentSteps.push({ title: cleanStepTitle(pendingStep) });
          pendingStep = null;
        }
        if (currentSteps.length >= 2) {
          segments.push({
            type: "roadmap",
            steps: currentSteps,
          });
          currentSteps = [];
        } else if (currentSteps.length === 1) {
          currentMarkdownLines.push(currentSteps[0].title);
          currentSteps = [];
        }
        currentMarkdownLines.push(line);
      }
    }

    // Flush any remaining steps
    if (pendingStep) {
      currentSteps.push({ title: cleanStepTitle(pendingStep) });
      pendingStep = null;
    }

    if (currentSteps.length >= 2) {
      segments.push({
        type: "roadmap",
        steps: currentSteps,
      });
    } else if (currentSteps.length === 1) {
      currentMarkdownLines.push(currentSteps[0].title);
    }

    if (currentMarkdownLines.length > 0) {
      segments.push({
        type: "markdown",
        content: currentMarkdownLines.join("\n"),
      });
    }
  }

  return { segments };
}

export function MarkdownContent({
  content,
  slugHeadings = true,
  className = "",
}: {
  content: string;
  slugHeadings?: boolean;
  className?: string;
}) {
  const { segments } = useMemo(
    () => processRoadmapContent(content),
    [content]
  );

  return (
    <div
      className={`prose prose-ink dark:prose-invert max-w-none ${className}`}
    >
      {segments.map((segment, index) => {
        if (segment.type === "roadmap" && segment.steps) {
          return <RoadmapTimeline key={index} steps={segment.steps} />;
        }

        return (
          <ReactMarkdown
            key={index}
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
                  <figure className="my-8 overflow-hidden rounded-2xl border border-slate-200/70 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 shadow-sm">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={src}
                      alt={alt || ""}
                      loading="lazy"
                      className="h-auto w-full max-h-[600px] object-cover"
                    />
                    {alt && (
                      <figcaption className="p-3 text-center text-xs font-medium text-ink-500 dark:text-ink-400 border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-ink-950/40">
                        {alt}
                      </figcaption>
                    )}
                  </figure>
                ) : null,
              a: ({ href, children, className: linkClassName }) =>
                linkClassName?.includes("anchor-link") ? (
                  <a href={href} className={linkClassName} aria-hidden>
                    <Link2 size={16} />
                  </a>
                ) : (
                  <a
                    href={href}
                    className="font-medium text-brand-600 dark:text-brand-400 underline decoration-brand-300 dark:decoration-brand-600 underline-offset-[3px] transition hover:decoration-brand-600 dark:hover:decoration-brand-300"
                    target={href?.startsWith("http") ? "_blank" : undefined}
                    rel={
                      href?.startsWith("http")
                        ? "noopener noreferrer"
                        : undefined
                    }
                  >
                    {children}
                  </a>
                ),
              table: ({ children }) => (
                <div className="not-prose my-7 overflow-x-auto rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-sm bg-white dark:bg-ink-950">
                  <table className="w-full border-collapse text-left text-sm">
                    {children}
                  </table>
                </div>
              ),
              thead: ({ children }) => (
                <thead className="border-b border-slate-200/80 dark:border-slate-800 bg-slate-50/80 dark:bg-ink-900 font-semibold text-ink-900 dark:text-ink-100">
                  {children}
                </thead>
              ),
              tbody: ({ children }) => (
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/70">
                  {children}
                </tbody>
              ),
              tr: ({ children }) => (
                <tr className="transition-colors hover:bg-slate-50/50 dark:hover:bg-slate-900/40">
                  {children}
                </tr>
              ),
              th: ({ children }) => (
                <th className="whitespace-nowrap px-4 py-3 font-semibold text-ink-900 dark:text-ink-100">
                  {children}
                </th>
              ),
              td: ({ children }) => (
                <td className="px-4 py-3 align-top text-ink-700 dark:text-ink-300 text-[13.5px] leading-normal">
                  {children}
                </td>
              ),
              ul: ({ children }) => (
                <ul className="my-4 space-y-2 list-disc pl-5 marker:text-brand-500 dark:marker:text-brand-400">
                  {children}
                </ul>
              ),
              ol: ({ children }) => (
                <ol className="my-4 space-y-2 list-decimal pl-5 marker:text-brand-600 dark:marker:text-brand-400 marker:font-semibold">
                  {children}
                </ol>
              ),
              li: ({ children }) => (
                <li className="text-ink-800 dark:text-ink-200 leading-relaxed pl-1">
                  {children}
                </li>
              ),
              p: ({ children }) => (
                <p className="my-3 leading-relaxed">{children}</p>
              ),
              h1: ({ children, id }) => (
                <h1
                  id={id}
                  className="scroll-mt-24 font-bold text-ink-950 dark:text-ink-50 text-2xl sm:text-3xl mt-9 mb-4"
                >
                  {children}
                </h1>
              ),
              h2: ({ children, id }) => (
                <h2
                  id={id}
                  className="scroll-mt-24 font-bold text-ink-950 dark:text-ink-50 text-xl sm:text-2xl mt-8 mb-3"
                >
                  {children}
                </h2>
              ),
              h3: ({ children, id }) => (
                <h3
                  id={id}
                  className="scroll-mt-24 font-bold text-ink-900 dark:text-ink-100 text-lg sm:text-xl mt-6 mb-2"
                >
                  {children}
                </h3>
              ),
              h4: ({ children, id }) => (
                <h4
                  id={id}
                  className="scroll-mt-24 font-semibold text-ink-800 dark:text-ink-200 text-base sm:text-lg mt-5 mb-2"
                >
                  {children}
                </h4>
              ),
              strong: ({ children }) => (
                <strong className="font-semibold text-ink-950 dark:text-ink-50">
                  {children}
                </strong>
              ),
              blockquote: ({ children }) => (
                <blockquote className="not-prose my-4 rounded-r-lg border-l-4 border-brand-500 bg-slate-50 dark:bg-slate-900/60 px-4 py-3 text-ink-700 dark:text-ink-300 text-sm leading-relaxed">
                  {children}
                </blockquote>
              ),
              hr: () => (
                <hr className="my-6 border-t border-slate-200 dark:border-slate-800" />
              ),
              code: CodeBlock as any,
              pre: ({ children }) => <>{children}</>,
            }}
          >
            {segment.content}
          </ReactMarkdown>
        );
      })}
    </div>
  );
}
