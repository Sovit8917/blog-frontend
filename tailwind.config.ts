import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f2f6ff',
          100: '#e3ecff',
          200: '#c2d4ff',
          300: '#96b3ff',
          400: '#6486ff',
          500: '#3d5cf5',
          600: '#2a3fd6',
          700: '#2331ab',
          800: '#212c87',
          900: '#1f296c',
        },
        ink: {
          50: '#f7f7f8',
          100: '#eeeef0',
          200: '#d9d9de',
          300: '#b5b5bf',
          400: '#8b8b99',
          500: '#6b6b7a',
          600: '#54545f',
          700: '#43434b',
          800: '#28282d',
          900: '#18181b',
          950: '#0c0c0e',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        serif: ['var(--font-source-serif)', 'Georgia', 'serif'],
      },
      typography: ({ theme }: any) => ({
        DEFAULT: {
          css: {
            '--tw-prose-body': theme('colors.ink[700]'),
            '--tw-prose-headings': theme('colors.ink[900]'),
            '--tw-prose-links': theme('colors.brand[600]'),
            '--tw-prose-bold': theme('colors.ink[900]'),
            '--tw-prose-quotes': theme('colors.ink[600]'),
            '--tw-prose-code': theme('colors.brand[700]'),
            maxWidth: 'none',
            fontSize: '1rem',
            lineHeight: '1.65',
            p: { marginTop: '0.85em', marginBottom: '0.85em' },
            'h1, h2, h3, h4': { marginTop: '1.2em', marginBottom: '0.5em', scrollMarginTop: '5rem' },
            'ul, ol': { marginTop: '0.6em', marginBottom: '0.6em' },
            li: { marginTop: '0.25em', marginBottom: '0.25em' },
            a: { textUnderlineOffset: '3px', fontWeight: '500' },
          },
        },
      }),
      animation: {
        'fade-in': 'fadeIn .4s ease-out',
        'slide-up': 'slideUp .35s ease-out',
      },
      keyframes: {
        fadeIn: { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        slideUp: { '0%': { opacity: '0', transform: 'translateY(8px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};
export default config;
