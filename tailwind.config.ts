import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Champagne & graphite on cool grey — light "marble luxe" theme
        base: "#EBEDEF",
        surface: "#F8F9FA",
        ink: "#2f2622",
        muted: "#6f767c",
        line: { DEFAULT: "#dde1e4", deep: "#cfd4d8" },
        champagne: { DEFAULT: "#a1804e", soft: "#c2a577" },
        gold: "#b08d57",
        silver: { DEFAULT: "#9aa1ab", soft: "#EEF0F2" },
        graphite: "#3f4650",
      },
      fontFamily: {
        serif: ["'Bricolage Grotesque'", "serif"],
        sans: ["'Space Grotesk'", "sans-serif"],
      },
      boxShadow: {
        aura: "0 10px 26px rgba(50,40,30,.10)",
        auralg: "0 20px 50px rgba(50,40,30,.16)",
        glow: "0 0 18px rgba(176,141,87,.35)",
      },
      borderRadius: { xl2: "20px" },
    },
  },
  plugins: [],
};
export default config;
