import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#f3faf7",
          100: "#dff4ea",
          200: "#b8e7d2",
          300: "#7dd2b0",
          400: "#3db48a",
          500: "#1f946f",
          600: "#15765a",
          700: "#115f4a",
          800: "#0f4c3c",
          900: "#0b3d31"
        }
      }
    }
  },
  plugins: []
};

export default config;

