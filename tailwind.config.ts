import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          bg: "rgb(var(--c-bg) / <alpha-value>)",
          card: "rgb(var(--c-card) / <alpha-value>)",
          border: "rgb(var(--c-border) / <alpha-value>)",
          accent: "rgb(var(--c-accent) / <alpha-value>)",
          "accent-hover": "rgb(var(--c-accent-hover) / <alpha-value>)",
          code: "var(--c-code)",
          glow: "var(--c-glow)",
          header: "var(--c-header)",
          error: "rgb(var(--c-error) / <alpha-value>)",
          "error-bg": "var(--c-error-bg)",
          "error-border": "var(--c-error-border)",
        },
        white: "rgb(var(--c-text) / <alpha-value>)",
        zinc: {
          950: "rgb(var(--c-on-accent) / <alpha-value>)",
        },
        gray: {
          200: "rgb(var(--c-gray-200) / <alpha-value>)",
          300: "rgb(var(--c-gray-300) / <alpha-value>)",
          400: "rgb(var(--c-gray-400) / <alpha-value>)",
          500: "rgb(var(--c-gray-500) / <alpha-value>)",
          600: "rgb(var(--c-gray-600) / <alpha-value>)",
        },
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "-apple-system", "sans-serif"],
      },
    },
  },
  plugins: [],
} satisfies Config;
