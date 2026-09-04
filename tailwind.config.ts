import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#f2f6ff",
          100: "#e3ecff",
          200: "#c2d4ff",
          300: "#96b3ff",
          400: "#6486ff",
          500: "#3d5cf5",
          600: "#2a3fd6",
          700: "#2331ab",
          800: "#212c87",
          900: "#1f296c",
        },
        ink: {
          50: "#f7f7f8",
          100: "#eeeef0",
          200: "#d9d9de",
          300: "#b5b5bf",
          400: "#8b8b99",
          500: "#6b6b7a",
          600: "#54545f",
          700: "#43434b",
          800: "#28282d",
          900: "#18181b",
          950: "#0c0c0e",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        serif: ["var(--font-source-serif)", "Georgia", "serif"],
      },
      typography: ({ theme }: any) => ({
        DEFAULT: {
          css: {
            "--tw-prose-body": theme("colors.ink[800]"),
            "--tw-prose-headings": theme("colors.ink[950]"),
            "--tw-prose-links": theme("colors.brand[600]"),
            "--tw-prose-bold": theme("colors.ink[950]"),
            "--tw-prose-quotes": theme("colors.ink[700]"),
            "--tw-prose-code": theme("colors.brand[700]"),
            "--tw-prose-hr": theme("colors.ink[200]"),
            maxWidth: "none",
            fontSize: "1rem",
            lineHeight: "1.7",
            letterSpacing: "-0.011em",
            p: {
              marginTop: "0.65em",
              marginBottom: "0.65em",
            },
            h1: {
              fontSize: "2rem",
              marginTop: "1.2em",
              marginBottom: "0.4em",
              lineHeight: "1.25",
              fontWeight: "700",
              letterSpacing: "-0.025em",
            },
            h2: {
              fontSize: "1.45rem",
              marginTop: "1.25em",
              marginBottom: "0.4em",
              lineHeight: "1.3",
              fontWeight: "700",
              letterSpacing: "-0.02em",
              scrollMarginTop: "5.5rem",
            },
            h3: {
              fontSize: "1.2rem",
              marginTop: "1em",
              marginBottom: "0.3em",
              lineHeight: "1.35",
              fontWeight: "600",
              letterSpacing: "-0.015em",
              scrollMarginTop: "5.5rem",
            },
            h4: {
              fontSize: "1.05rem",
              marginTop: "0.85em",
              marginBottom: "0.25em",
              lineHeight: "1.4",
              fontWeight: "600",
              scrollMarginTop: "5.5rem",
            },
            "ul, ol": {
              marginTop: "0.5em",
              marginBottom: "0.5em",
              paddingLeft: "1.25em",
            },
            li: {
              marginTop: "0.2em",
              marginBottom: "0.2em",
              lineHeight: "1.6",
            },
            hr: {
              marginTop: "1.5em",
              marginBottom: "1.5em",
              borderColor: theme("colors.ink[200]"),
            },
            a: {
              textUnderlineOffset: "3px",
              fontWeight: "500",
              transition: "color 0.15s ease",
            },
            strong: {
              fontWeight: "600",
              color: theme("colors.ink[950]"),
            },
          },
        },
        // Powers `dark:prose-invert` on long-form content
        invert: {
          css: {
            "--tw-prose-invert-body": theme("colors.ink[200]"),
            "--tw-prose-invert-headings": theme("colors.ink[50]"),
            "--tw-prose-invert-links": theme("colors.brand[400]"),
            "--tw-prose-invert-bold": theme("colors.ink[50]"),
            "--tw-prose-invert-quotes": theme("colors.ink[300]"),
            "--tw-prose-invert-code": theme("colors.brand[300]"),
            "--tw-prose-invert-bullets": theme("colors.ink[500]"),
            "--tw-prose-invert-hr": theme("colors.ink[800]"),
            "--tw-prose-invert-th-borders": theme("colors.ink[700]"),
            "--tw-prose-invert-td-borders": theme("colors.ink[800]"),
            "--tw-prose-invert-captions": theme("colors.ink[400]"),
            hr: {
              borderColor: theme("colors.ink[800]"),
            },
            strong: {
              color: theme("colors.ink[50]"),
            },
          },
        },
      }),
      animation: {
        "fade-in": "fadeIn .4s ease-out",
        "slide-up": "slideUp .35s ease-out",
      },
      keyframes: {
        fadeIn: { "0%": { opacity: "0" }, "100%": { opacity: "1" } },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
export default config;
