import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        cream: "#FFF8EC",
        ink: "#2B2440",
        grape: "#7C5CFF",
        bubblegum: "#FF6FA5",
        mango: "#FFB648",
        mint: "#3DDC97",
        sky: "#4DB6FF",
      },
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        body: ["var(--font-body)", "sans-serif"],
      },
      boxShadow: {
        chunky: "0 4px 0 rgba(43,36,64,0.9)",
        "chunky-sm": "0 2px 0 rgba(43,36,64,0.9)",
      },
      borderRadius: {
        blob: "2rem",
      },
      keyframes: {
        pop: {
          "0%": { transform: "scale(0.85)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        float: {
          "0%,100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-6px)" },
        },
        rise: {
          "0%": { transform: "translateY(0)", opacity: "1" },
          "100%": { transform: "translateY(-40px)", opacity: "0" },
        },
      },
      animation: {
        pop: "pop 0.18s ease-out",
        float: "float 3s ease-in-out infinite",
        rise: "rise 1s ease-out forwards",
      },
    },
  },
  plugins: [],
};
export default config;
