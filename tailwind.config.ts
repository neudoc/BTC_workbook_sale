import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#f2f8f5",
          100: "#ddefe6",
          200: "#b9dfcd",
          300: "#89c6ab",
          400: "#54a884",
          500: "#348a68",
          600: "#256e53",
          700: "#1e5944",
          800: "#1a4738",
          900: "#163a2f",
          950: "#0c211b"
        },
        gold: {
          50: "#fbf8ef",
          100: "#f5eed7",
          200: "#eadcae",
          300: "#dcc47d",
          400: "#cfab55",
          500: "#c2953d",
          600: "#a87a32",
          700: "#875e2b",
          800: "#6f4d29",
          900: "#5d4126"
        }
      },
      fontFamily: {
        sans: ["var(--font-sans)", "Apple SD Gothic Neo", "Malgun Gothic", "sans-serif"],
        display: ["var(--font-display)", "var(--font-sans)", "serif"]
      },
      boxShadow: {
        card: "0 1px 2px rgba(15, 40, 30, 0.05), 0 8px 24px -12px rgba(15, 40, 30, 0.16)",
        "card-hover": "0 2px 4px rgba(15, 40, 30, 0.06), 0 20px 40px -16px rgba(15, 40, 30, 0.28)"
      }
    }
  },
  plugins: []
};

export default config;
