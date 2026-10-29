/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["selector", '[data-theme="dark"]'],
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // all theme colours come from CSS variables (see app/globals.css) so light/dark can swap
        sage: { DEFAULT: "rgb(var(--sage) / <alpha-value>)", soft: "rgb(var(--sage-soft) / <alpha-value>)" },
        ink: "rgb(var(--ink) / <alpha-value>)",
        muted: "rgb(var(--muted) / <alpha-value>)",
        matrix: "rgb(var(--accent) / <alpha-value>)",
        accent2: "rgb(var(--accent2) / <alpha-value>)",
        gold: "rgb(var(--gold) / <alpha-value>)",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "Inter", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "JetBrains Mono", "ui-monospace", "monospace"],
      },
      backgroundColor: {
        glass: "var(--glass)",
        panel: "var(--panel)",
        track: "var(--track)",
      },
      borderColor: {
        glass: "var(--glass-border)",
      },
      boxShadow: {
        glow: "0 0 22px rgb(var(--accent) / 0.28)",
        gold: "0 0 22px rgb(var(--gold) / 0.25)",
      },
    },
  },
  plugins: [],
};
