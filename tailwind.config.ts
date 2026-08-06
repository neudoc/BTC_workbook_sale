import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          // 파스텔 그린 (메뉴 칩 배경 등 아주 옅은 톤)
          25: "#f0f6ec",
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
        // 디자인 가이드(design-styleguidelines.md §2.1) 기준
        // 400=#CFAB55(장식/배경 전용) · 300=#DCC47D(다크 배경 텍스트) · 600=#A87A32(밝은 배경 텍스트)
        gold: {
          50: "#fbf8ef",
          100: "#f5eed7",
          200: "#eadcae",
          300: "#dcc47d",
          400: "#cfab55",
          500: "#bb9038",
          600: "#a87a32",
          700: "#8a6229",
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
