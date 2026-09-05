"use client";

import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import remarkDirective from "remark-directive";
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
  Info,
  Lightbulb,
  AlertTriangle,
  AlertOctagon,
  CheckCircle2,
  type LucideIcon,
} from "lucide-react";
import React, { useState, useMemo } from "react";
import { codeToHtml } from "shiki";
import mermaid from "mermaid";
import katex from "katex";

// AST visitor plugin to transform remarkDirective (:::note, :::tip, etc.) into HTML elements
function remarkDirectivePlugin() {
  return (tree: any) => {
    function visit(node: any) {
      if (!node) return;
      if (
        node.type === "containerDirective" ||
        node.type === "leafDirective" ||
        node.type === "textDirective"
      ) {
        const data = node.data || (node.data = {});
        const hast = data.hast || (data.hast = {});
        hast.tagName = "callout";
        hast.properties = {
          ...hast.properties,
          type: node.name,
          ...(node.attributes || {}),
        };
        data.hProperties = {
          type: node.name,
          ...(node.attributes || {}),
        };
      }
      if (node.children) {
        node.children.forEach(visit);
      }
    }
    visit(tree);
  };
}

// Callout / Admonition component
function CalloutBlock({
  type = "note",
  title,
  children,
}: {
  type?: string;
  title?: string;
  children: React.ReactNode;
}) {
  const normType = type.toLowerCase();
  
  let Icon = Info;
  let borderCls = "border-sky-500/80 dark:border-sky-500/70";
  let bgCls = "bg-sky-50/70 dark:bg-sky-950/30";
  let textCls = "text-sky-950 dark:text-sky-200";
  let iconCls = "text-sky-600 dark:text-sky-400";
  let defaultTitle = "Note";

  if (normType === "tip" || normType === "idea" || normType === "success") {
    Icon = normType === "success" ? CheckCircle2 : Lightbulb;
    borderCls = "border-emerald-500/80 dark:border-emerald-500/70";
    bgCls = "bg-emerald-50/70 dark:bg-emerald-950/30";
    textCls = "text-emerald-950 dark:text-emerald-200";
    iconCls = "text-emerald-600 dark:text-emerald-400";
    defaultTitle = normType === "success" ? "Success" : "Tip";
  } else if (normType === "warning" || normType === "warn" || normType === "caution") {
    Icon = AlertTriangle;
    borderCls = "border-amber-500/80 dark:border-amber-500/70";
    bgCls = "bg-amber-50/70 dark:bg-amber-950/30";
    textCls = "text-amber-950 dark:text-amber-200";
    iconCls = "text-amber-600 dark:text-amber-400";
    defaultTitle = "Warning";
  } else if (normType === "danger" || normType === "error" || normType === "alert") {
    Icon = AlertOctagon;
    borderCls = "border-rose-500/80 dark:border-rose-500/70";
    bgCls = "bg-rose-50/70 dark:bg-rose-950/30";
    textCls = "text-rose-950 dark:text-rose-200";
    iconCls = "text-rose-600 dark:text-rose-400";
    defaultTitle = "Danger";
  } else if (normType === "important" || normType === "info") {
    Icon = Info;
    borderCls = "border-purple-500/80 dark:border-purple-500/70";
    bgCls = "bg-purple-50/70 dark:bg-purple-950/30";
    textCls = "text-purple-950 dark:text-purple-200";
    iconCls = "text-purple-600 dark:text-purple-400";
    defaultTitle = "Important";
  }

  return (
    <div
      className={`not-prose my-6 overflow-hidden rounded-xl border-l-4 ${borderCls} ${bgCls} p-4 text-sm shadow-sm transition-all`}
    >
      <div className="flex items-center gap-2 font-semibold tracking-wide">
        <Icon size={18} className={`shrink-0 ${iconCls}`} />
        <span className={`capitalize ${textCls}`}>{title || defaultTitle}</span>
      </div>
      <div className={`mt-2 leading-relaxed text-ink-800 dark:text-ink-200 [&>p]:my-1`}>
        {children}
      </div>
    </div>
  );
}

// Interactive Mermaid Diagram Component
function MermaidDiagram({ chart }: { chart: string }) {
  const [svg, setSvg] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const id = useMemo(() => `mermaid-${Math.random().toString(36).substring(2, 9)}`, []);

  React.useEffect(() => {
    let isMounted = true;
    if (!chart) return;

    mermaid.initialize({
      startOnLoad: false,
      theme: "dark",
      themeVariables: {
        darkMode: true,
        background: "#0d1117",
        mainBkg: "#1c2128",
        nodeBorder: "#444c56",
        clusterBkg: "#161b22",
        clusterBorder: "#30363d",
        lineColor: "#58a6ff",
        textColor: "#f0f6fc",
        nodeTextColor: "#ffffff",
        titleColor: "#58a6ff",
        edgeLabelBackground: "#161b22",
        actorBkg: "#1c2128",
        actorBorder: "#58a6ff",
        actorTextColor: "#ffffff",
        actorLineColor: "#58a6ff",
        signalColor: "#58a6ff",
        signalTextColor: "#ffffff",
        labelBoxBkgColor: "#1c2128",
        labelBoxBorderColor: "#444c56",
        labelTextColor: "#ffffff",
        loopTextColor: "#ffffff",
        noteBorderColor: "#d29922",
        noteBkgColor: "#2d2206",
        noteTextColor: "#e3b341",
        activationBorderColor: "#58a6ff",
        activationBkgColor: "#1c2128",
        sequenceNumberColor: "#ffffff",
        sectionBkgColor: "#1c2128",
        altSectionBkgColor: "#161b22",
        sectionBkgColor2: "#21262d",
        taskBorderColor: "#58a6ff",
        taskBkgColor: "#1f6feb",
        taskTextColor: "#ffffff",
        taskTextLightColor: "#ffffff",
        taskTextOutsideColor: "#f0f6fc",
        taskTextClickableColor: "#79c0ff",
        activeTaskBorderColor: "#79c0ff",
        activeTaskBkgColor: "#388bfd",
        gridColor: "#30363d",
        todayLineColor: "#f85149",
        fontSize: "14px",
        fontFamily: "ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif",
      },
      securityLevel: "loose",
    });

    mermaid
      .render(id, chart)
      .then(({ svg: renderedSvg }) => {
        if (isMounted) {
          setSvg(renderedSvg);
          setError(null);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err?.message || "Failed to render diagram");
        }
      });

    return () => {
      isMounted = false;
    };
  }, [chart, id]);

  if (error) {
    return (
      <div className="not-prose my-6 overflow-hidden rounded-xl border border-rose-500/40 bg-rose-950/20 p-4 text-xs font-mono text-rose-300">
        <p className="font-semibold text-rose-400 mb-2">Mermaid Diagram Syntax Notice:</p>
        <pre className="overflow-x-auto whitespace-pre-wrap">{chart}</pre>
      </div>
    );
  }

  return (
    <div className="not-prose group relative my-7 overflow-hidden rounded-2xl border border-slate-800 bg-[#0d1117] p-6 shadow-xl">
      <div className="mb-4 flex items-center justify-between border-b border-slate-800/80 pb-3 text-xs text-slate-400">
        <span className="flex items-center gap-2 font-mono font-medium text-slate-300">
          <Layers size={14} className="text-brand-400" />
          <span className="text-[11px] tracking-wider uppercase">Diagram / Architecture</span>
        </span>
      </div>
      <div
        className="mermaid-render flex justify-center overflow-x-auto [&_svg]:max-w-full [&_svg]:h-auto"
        dangerouslySetInnerHTML={{ __html: svg }}
      />
    </div>
  );
}

// KaTeX Block & Inline Renderer
function KatexBlock({
  math,
  displayMode = false,
}: {
  math: string;
  displayMode?: boolean;
}) {
  const cleanedMath = useMemo(() => {
    if (!math) return "";
    let m = math.trim();
    // Strip leading \[ or $$ if present inside the code block
    m = m.replace(/^\\\[\s*/, "").replace(/\s*\\\]$/, "");
    m = m.replace(/^\$\$\s*/, "").replace(/\s*\$\$$/, "");
    m = m.replace(/^\\\(\s*/, "").replace(/\s*\\\)$/, "");
    return m.trim();
  }, [math]);

  const html = useMemo(() => {
    if (!cleanedMath) return null;
    try {
      return katex.renderToString(cleanedMath, {
        displayMode: true,
        throwOnError: false,
        errorColor: "#f87171",
        strict: false,
        trust: true,
      });
    } catch {
      return null;
    }
  }, [cleanedMath]);

  if (!html) {
    return <code className="text-rose-400">{math}</code>;
  }

  return (
    <div
      className="katex-display my-4 overflow-x-auto text-center"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

function CodeBlock({
  className,
  children,
  ...props
}: {
  className?: string;
  children: React.ReactNode;
  [key: string]: any;
}) {
  const [copied, setCopied] = useState(false);
  const [highlightedHtml, setHighlightedHtml] = useState<string | null>(null);
  const match = /language-(\w+)/.exec(className || "");
  const language = match ? match[1] : "";
  const codeText = typeof children === "string" ? children.replace(/\n$/, "") : String(children || "").replace(/\n$/, "");

  // If rehype-katex / remark-math generated math code block
  if (language === "math" || className?.includes("math-display")) {
    return <KatexBlock math={codeText} displayMode={true} />;
  }
  if (className?.includes("math-inline")) {
    return <KatexBlock math={codeText} displayMode={false} />;
  }

  // If mermaid diagram (System Architecture, API Flow, AI Pipeline, ML Workflow, Sequence, etc.)
  if (language && language.toLowerCase() === "mermaid") {
    return <MermaidDiagram chart={codeText} />;
  }

  // If inline code
  if (!match && !className && typeof children === "string" && !children.includes("\n")) {
    return (
      <code
        className="rounded-lg bg-slate-100 dark:bg-slate-800/95 px-2 py-1 text-[0.875em] font-mono font-medium text-brand-700 dark:text-brand-300 border border-slate-200/80 dark:border-slate-700/80 shadow-2xs inline-block my-0.5 tracking-tight"
        {...props}
      >
        {children}
      </code>
    );
  }

  // Highlight using Shiki
  React.useEffect(() => {
    let isMounted = true;
    if (!codeText) return;

    const highlight = async () => {
      try {
        const html = await codeToHtml(codeText, {
          lang: language || "text",
          theme: "github-dark",
        });
        if (isMounted) {
          setHighlightedHtml(html);
        }
      } catch (err) {
        // Fallback gracefully on unknown language
        try {
          const fallbackHtml = await codeToHtml(codeText, {
            lang: "text",
            theme: "github-dark",
          });
          if (isMounted) setHighlightedHtml(fallbackHtml);
        } catch {
          // ignore
        }
      }
    };

    highlight();
    return () => {
      isMounted = false;
    };
  }, [codeText, language]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(codeText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  };

  return (
    <div className="not-prose group relative my-6 overflow-hidden rounded-xl border border-slate-700/80 bg-[#0d1117] text-slate-100 shadow-xl">
      <div className="flex items-center justify-between border-b border-slate-800 bg-[#161b22] px-4 py-2 text-xs text-slate-400">
        <span className="flex items-center gap-2 font-mono font-semibold text-slate-300">
          <span className="flex gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f56]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#ffbd2e]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#27c93f]" />
          </span>
          <span className="ml-1 text-[11px] font-semibold tracking-wider text-slate-300 uppercase">
            {language || "CODE"}
          </span>
        </span>
        <button
          type="button"
          onClick={handleCopy}
          aria-label="Copy code"
          className="flex items-center gap-1.5 rounded-md px-2.5 py-1 text-[11px] font-medium text-slate-400 transition hover:bg-slate-700/70 hover:text-slate-100"
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
      {highlightedHtml ? (
        <div
          className="shiki-container overflow-x-auto p-4 text-[13.5px] font-mono leading-relaxed text-slate-100 selection:bg-brand-600 selection:text-white [&_pre]:!bg-transparent [&_pre]:!m-0 [&_pre]:!p-0 [&_code]:!bg-transparent [&_code]:!p-0"
          dangerouslySetInnerHTML={{ __html: highlightedHtml }}
        />
      ) : (
        <pre className="overflow-x-auto p-4 text-[13.5px] font-mono leading-relaxed text-slate-200 selection:bg-brand-600 selection:text-white">
          <code className={className}>{codeText}</code>
        </pre>
      )}
    </div>
  );
}

// Icon dictionary matching common tech & career keywords
function getStepIcon(text: string): LucideIcon {
  const lower = text.toLowerCase();
  if (
    lower.includes("fundament") ||
    lower.includes("computer") ||
    lower.includes("hardware") ||
    lower.includes("cpu")
  )
    return Cpu;
  if (
    lower.includes("network") ||
    lower.includes("web") ||
    lower.includes("internet") ||
    lower.includes("dns")
  )
    return Globe;
  if (
    lower.includes("linux") ||
    lower.includes("unix") ||
    lower.includes("os") ||
    lower.includes("terminal") ||
    lower.includes("bash") ||
    lower.includes("shell") ||
    lower.includes("cli")
  )
    return Terminal;
  if (
    lower.includes("secur") ||
    lower.includes("cyber") ||
    lower.includes("protect") ||
    lower.includes("auth")
  )
    return ShieldAlert;
  if (
    lower.includes("script") ||
    lower.includes("code") ||
    lower.includes("python") ||
    lower.includes("program") ||
    lower.includes("javascript")
  )
    return Code2;
  if (
    lower.includes("tool") ||
    lower.includes("utility") ||
    lower.includes("devops") ||
    lower.includes("git")
  )
    return Wrench;
  if (
    lower.includes("lab") ||
    lower.includes("practice") ||
    lower.includes("hands-on") ||
    lower.includes("test")
  )
    return FlaskConical;
  if (
    lower.includes("specializ") ||
    lower.includes("target") ||
    lower.includes("goal") ||
    lower.includes("path")
  )
    return Target;
  if (
    lower.includes("project") ||
    lower.includes("build") ||
    (lower.includes("portfolio") && lower.includes("build"))
  )
    return Layers;
  if (
    lower.includes("resume") ||
    lower.includes("cv") ||
    lower.includes("document")
  )
    return FileSpreadsheet;
  if (
    lower.includes("interview") ||
    lower.includes("mock") ||
    lower.includes("people") ||
    lower.includes("communicat")
  )
    return Users2;
  if (
    lower.includes("job") ||
    lower.includes("role") ||
    lower.includes("hire") ||
    lower.includes("career") ||
    lower.includes("apply")
  )
    return Briefcase;
  if (lower.includes("database") || lower.includes("sql")) return Database;
  if (
    lower.includes("server") ||
    lower.includes("cloud") ||
    lower.includes("aws")
  )
    return Server;
  if (
    lower.includes("learn") ||
    lower.includes("study") ||
    lower.includes("book")
  )
    return BookOpen;
  if (lower.includes("certif") || lower.includes("degree")) return Award;
  return Sparkles;
}

// Curated vibrant theme themes for roadmap items matching reference aesthetics
const COLOR_THEMES = [
  {
    gradient:
      "from-blue-500/10 via-sky-500/5 to-white dark:from-blue-950/40 dark:via-ink-900/90 dark:to-ink-900",
    border:
      "border-blue-200/80 dark:border-blue-500/30 hover:border-blue-400 dark:hover:border-blue-400",
    nodePill:
      "bg-blue-100 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 border border-blue-300 dark:border-blue-700/60",
    nodeInner: "bg-blue-600 text-white shadow-sm shadow-blue-500/40",
    iconBox: "bg-blue-600 text-white shadow-md shadow-blue-500/30",
    glow: "hover:shadow-blue-500/15",
    line: "#3b82f6",
  },
  {
    gradient:
      "from-emerald-500/10 via-teal-500/5 to-white dark:from-emerald-950/40 dark:via-ink-900/90 dark:to-ink-900",
    border:
      "border-emerald-200/80 dark:border-emerald-500/30 hover:border-emerald-400 dark:hover:border-emerald-400",
    nodePill:
      "bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-700/60",
    nodeInner: "bg-emerald-600 text-white shadow-sm shadow-emerald-500/40",
    iconBox: "bg-emerald-600 text-white shadow-md shadow-emerald-500/30",
    glow: "hover:shadow-emerald-500/15",
    line: "#10b981",
  },
  {
    gradient:
      "from-amber-400/15 via-yellow-500/5 to-white dark:from-amber-950/40 dark:via-ink-900/90 dark:to-ink-900",
    border:
      "border-amber-200/80 dark:border-amber-500/30 hover:border-amber-400 dark:hover:border-amber-400",
    nodePill:
      "bg-amber-100 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400 border border-amber-300 dark:border-amber-700/60",
    nodeInner: "bg-amber-500 text-white shadow-sm shadow-amber-500/40",
    iconBox: "bg-amber-500 text-white shadow-md shadow-amber-500/30",
    glow: "hover:shadow-amber-500/15",
    line: "#f59e0b",
  },
  {
    gradient:
      "from-rose-500/10 via-pink-500/5 to-white dark:from-rose-950/40 dark:via-ink-900/90 dark:to-ink-900",
    border:
      "border-rose-200/80 dark:border-rose-500/30 hover:border-rose-400 dark:hover:border-rose-400",
    nodePill:
      "bg-rose-100 dark:bg-rose-950/80 text-rose-600 dark:text-rose-400 border border-rose-300 dark:border-rose-700/60",
    nodeInner: "bg-rose-500 text-white shadow-sm shadow-rose-500/40",
    iconBox: "bg-rose-500 text-white shadow-md shadow-rose-500/30",
    glow: "hover:shadow-rose-500/15",
    line: "#f43f5e",
  },
  {
    gradient:
      "from-purple-500/10 via-violet-500/5 to-white dark:from-purple-950/40 dark:via-ink-900/90 dark:to-ink-900",
    border:
      "border-purple-200/80 dark:border-purple-500/30 hover:border-purple-400 dark:hover:border-purple-400",
    nodePill:
      "bg-purple-100 dark:bg-purple-950/80 text-purple-600 dark:text-purple-400 border border-purple-300 dark:border-purple-700/60",
    nodeInner: "bg-purple-600 text-white shadow-sm shadow-purple-500/40",
    iconBox: "bg-purple-600 text-white shadow-md shadow-purple-500/30",
    glow: "hover:shadow-purple-500/15",
    line: "#a855f7",
  },
  {
    gradient:
      "from-cyan-500/10 via-teal-500/5 to-white dark:from-cyan-950/40 dark:via-ink-900/90 dark:to-ink-900",
    border:
      "border-cyan-200/80 dark:border-cyan-500/30 hover:border-cyan-400 dark:hover:border-cyan-400",
    nodePill:
      "bg-cyan-100 dark:bg-cyan-950/80 text-cyan-600 dark:text-cyan-400 border border-cyan-300 dark:border-cyan-700/60",
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
            const theme = COLOR_THEMES[idx % COLOR_THEMES.length] || COLOR_THEMES[0]!;
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
      if (line === undefined) continue;
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
        const nextLine = lines[j]?.trim();
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
        } else if (currentSteps.length === 1 && currentSteps[0]?.title) {
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
    } else if (currentSteps.length === 1 && currentSteps[0]?.title) {
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

// Preprocess LaTeX math syntax so all common math formats are normalized to standard Markdown math ($ and $$)
function normalizeMathDelimiters(markdown: string): string {
  if (!markdown) return "";
  
  let res = markdown;

  // 1. Convert ```math or ```latex code blocks (containing LaTeX equations like \[ ... \]) to $$ ... $$ display blocks
  res = res.replace(/```(?:math|latex)\s*([\s\S]*?)```/gi, (match, math) => {
    let cleaned = math.trim();
    // Strip inner \[ ... \] or $$ ... $$ if present inside the code block
    cleaned = cleaned.replace(/^\\\[\s*/, "").replace(/\s*\\\]$/, "");
    cleaned = cleaned.replace(/^\$\$\s*/, "").replace(/\s*\$\$$/, "");
    cleaned = cleaned.trim().replace(/\\+$/, "").trim();
    return `\n\n$$\n${cleaned}\n$$\n\n`;
  });

  // 2. Convert \[ ... \] or \[ ... \] with any malformed/unescaped delimiters to $$ ... $$
  res = res.replace(/\\\[([\s\S]*?)(?:\\\]|\\\]|\])/g, (match, math) => {
    const cleaned = math.trim().replace(/\\+$/, "").trim();
    return `\n\n$$\n${cleaned}\n$$\n\n`;
  });

  // 3. Ensure single-line $$ math $$ on its own line is split into multi-line $$\nmath\n$$ for remark-math block parsing
  res = res.replace(/^[ \t]*\$\$([^\n$]+)\$\$[ \t]*$/gm, (match, math) => {
    const cleaned = math.trim().replace(/\\+$/, "").trim();
    return `\n\n$$\n${cleaned}\n$$\n\n`;
  });
  
  // 4. Convert \( ... \) inline math to $ ... $
  res = res.replace(/\\\(([\s\S]*?)(?:\\\)|\\\))/g, (_, math) => {
    const cleaned = math.trim().replace(/\\+$/, "").trim();
    return `$${cleaned}$`;
  });

  return res;
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
  const normalizedContent = useMemo(() => normalizeMathDelimiters(content), [content]);
  const { segments } = useMemo(() => processRoadmapContent(normalizedContent), [normalizedContent]);

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
            remarkPlugins={[
              remarkGfm,
              [remarkMath, { singleDollarTextMath: true }],
              remarkDirective,
              remarkDirectivePlugin,
            ]}
            rehypePlugins={[
              [
                rehypeKatex,
                {
                  throwOnError: false,
                  errorColor: "#f87171",
                  strict: false,
                  trust: true,
                },
              ] as any,
              ...(slugHeadings
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
                : []),
            ]}
            components={{
              callout: CalloutBlock as any,
              img: ({ src, alt }: React.ImgHTMLAttributes<HTMLImageElement>) =>
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
              a: ({ href, children, className: linkClassName }: React.AnchorHTMLAttributes<HTMLAnchorElement>) =>
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
              table: ({ children }: React.TableHTMLAttributes<HTMLTableElement>) => (
                <div className="not-prose my-7 overflow-x-auto rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-sm bg-white dark:bg-ink-950">
                  <table className="w-full border-collapse text-left text-sm">
                    {children}
                  </table>
                </div>
              ),
              thead: ({ children }: React.HTMLAttributes<HTMLTableSectionElement>) => (
                <thead className="border-b border-slate-200/80 dark:border-slate-800 bg-slate-50/80 dark:bg-ink-900 font-semibold text-ink-900 dark:text-ink-100">
                  {children}
                </thead>
              ),
              tbody: ({ children }: React.HTMLAttributes<HTMLTableSectionElement>) => (
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/70">
                  {children}
                </tbody>
              ),
              tr: ({ children }: React.HTMLAttributes<HTMLTableRowElement>) => (
                <tr className="transition-colors hover:bg-slate-50/50 dark:hover:bg-slate-900/40">
                  {children}
                </tr>
              ),
              th: ({ children }: React.ThHTMLAttributes<HTMLTableHeaderCellElement>) => (
                <th className="whitespace-nowrap px-4 py-3 font-semibold text-ink-900 dark:text-ink-100">
                  {children}
                </th>
              ),
              td: ({ children }: React.TdHTMLAttributes<HTMLTableDataCellElement>) => (
                <td className="px-4 py-3 align-top text-ink-700 dark:text-ink-300 text-[13.5px] leading-normal">
                  {children}
                </td>
              ),
              ul: ({ children, className: ulClassName }: React.HTMLAttributes<HTMLUListElement>) => {
                const isTaskList = ulClassName?.includes("contains-task-list");
                return (
                  <ul
                    className={`my-4 space-y-2 ${
                      isTaskList
                        ? "list-none pl-0 space-y-2.5"
                        : "list-disc pl-5 marker:text-brand-500 dark:marker:text-brand-400"
                    }`}
                  >
                    {children}
                  </ul>
                );
              },
              ol: ({ children }: React.OlHTMLAttributes<HTMLOListElement>) => (
                <ol className="my-4 space-y-2 list-decimal pl-5 marker:text-brand-600 dark:marker:text-brand-400 marker:font-semibold">
                  {children}
                </ol>
              ),
              li: ({ children, className: liClassName }: React.LiHTMLAttributes<HTMLLIElement>) => {
                const isTaskItem = liClassName?.includes("task-list-item");
                return (
                  <li
                    className={`text-ink-800 dark:text-ink-200 leading-relaxed ${
                      isTaskItem
                        ? "flex items-start gap-2.5 list-none pl-0"
                        : "pl-1.5 py-0.5"
                    }`}
                  >
                    {children}
                  </li>
                );
              },
              kbd: ({ children }: React.HTMLAttributes<HTMLElement>) => (
                <kbd className="inline-flex items-center justify-center rounded-md border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 font-mono text-[0.8em] font-semibold text-ink-800 dark:text-ink-200 shadow-2xs">
                  {children}
                </kbd>
              ),
              input: ({ type, checked, disabled, ...props }: React.InputHTMLAttributes<HTMLInputElement>) => {
                if (type === "checkbox") {
                  return (
                    <input
                      type="checkbox"
                      checked={checked}
                      disabled={disabled}
                      readOnly
                      className="mt-1 h-4 w-4 rounded border-slate-300 dark:border-slate-600 text-brand-600 focus:ring-brand-500 dark:bg-slate-800"
                      {...props}
                    />
                  );
                }
                return <input type={type} {...props} />;
              },
              p: ({ children }: React.HTMLAttributes<HTMLParagraphElement>) => (
                <p className="my-3 leading-relaxed">{children}</p>
              ),
              h1: ({ children, id }: React.HTMLAttributes<HTMLHeadingElement>) => (
                <h1
                  id={id}
                  className="scroll-mt-24 font-bold text-ink-950 dark:text-ink-50 text-2xl sm:text-3xl mt-9 mb-4"
                >
                  {children}
                </h1>
              ),
              h2: ({ children, id }: React.HTMLAttributes<HTMLHeadingElement>) => (
                <h2
                  id={id}
                  className="scroll-mt-24 font-bold text-ink-950 dark:text-ink-50 text-xl sm:text-2xl mt-8 mb-3"
                >
                  {children}
                </h2>
              ),
              h3: ({ children, id }: React.HTMLAttributes<HTMLHeadingElement>) => (
                <h3
                  id={id}
                  className="scroll-mt-24 font-bold text-ink-900 dark:text-ink-100 text-lg sm:text-xl mt-6 mb-2"
                >
                  {children}
                </h3>
              ),
              h4: ({ children, id }: React.HTMLAttributes<HTMLHeadingElement>) => (
                <h4
                  id={id}
                  className="scroll-mt-24 font-semibold text-ink-800 dark:text-ink-200 text-base sm:text-lg mt-5 mb-2"
                >
                  {children}
                </h4>
              ),
              strong: ({ children }: React.HTMLAttributes<HTMLElement>) => (
                <strong className="font-semibold text-ink-950 dark:text-ink-50">
                  {children}
                </strong>
              ),
              blockquote: ({ children }: React.BlockquoteHTMLAttributes<HTMLQuoteElement>) => (
                <blockquote className="not-prose my-4 rounded-r-lg border-l-4 border-brand-500 bg-slate-50 dark:bg-slate-900/60 px-4 py-3 text-ink-700 dark:text-ink-300 text-sm leading-relaxed">
                  {children}
                </blockquote>
              ),
              hr: () => (
                <hr className="my-6 border-t border-slate-200 dark:border-slate-800" />
              ),
              code: CodeBlock as any,
              pre: ({ children }: React.HTMLAttributes<HTMLPreElement>) => <>{children}</>,
            } as any}
          >
            {segment.content}
          </ReactMarkdown>
        );
      })}
    </div>
  );
}
