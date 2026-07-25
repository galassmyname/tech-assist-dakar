import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#1E3A8A",
          light: "#3B5BDB",
          dark: "#122A66",
        },
        accent: {
          DEFAULT: "#16A34A",
          dark: "#15803D",
        },
        surface: {
          DEFAULT: "#DCE6FA",   // fond general du site : bleu clair
          muted: "#EAF1FF",     // fond des zones secondaires : bleu tres clair
        },
        ink: {
          DEFAULT: "#1E3A8A",
          muted: "#3B5B8C",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
        heading: ["var(--font-heading)", "sans-serif"],
      },
      borderRadius: {
        xl: "1rem",
      },
    },
  },
  plugins: [],
};

export default config;