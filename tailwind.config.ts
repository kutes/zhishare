import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/data/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Legacy tokens kept temporarily so existing pages do not break during migration.
        ink: "#172033",
        muted: "#617086",
        line: "#dbe6f3",
        surface: "#ffffff",

        // Final public redesign tokens: black / white / gray interface.
        mono: {
          950: "#000000",
          925: "#050505",
          900: "#080808",
          850: "#0c0c0c",
          800: "#111111",
          750: "#181818",
          700: "#242424",
          650: "#2f2f2f",
          600: "#3a3a3a",
          500: "#525252",
          400: "#6b6b6b",
          300: "#a3a3a3",
          200: "#d4d4d4",
          100: "#f5f5f5",
          50: "#fafafa",
        },

        // Solar colors are only for the real sun, corona, flare, and local glow.
        // Do not use solar colors for UI icons, badges, headings, or buttons.
        solar: {
          50: "#fff8e5",
          100: "#fff1c7",
          200: "#f6d88d",
          300: "#f6c56b",
          400: "#f2a93b",
          500: "#d9821f",
          600: "#a85c12",
          700: "#653308",
        },

        glass: {
          weak: "rgba(255, 255, 255, 0.035)",
          DEFAULT: "rgba(255, 255, 255, 0.052)",
          strong: "rgba(255, 255, 255, 0.075)",
          lift: "rgba(255, 255, 255, 0.095)",
          smoke: "rgba(8, 8, 8, 0.72)",
          deep: "rgba(0, 0, 0, 0.82)",
        },

        glassLine: {
          weak: "rgba(255, 255, 255, 0.08)",
          DEFAULT: "rgba(255, 255, 255, 0.13)",
          bright: "rgba(255, 255, 255, 0.2)",
          solar: "rgba(246, 197, 107, 0.18)",
        },
      },

      borderRadius: {
        "4xl": "2rem",
        "5xl": "2.5rem",
      },

      boxShadow: {
        soft: "0 18px 45px rgba(23, 32, 51, 0.08)",
        glass:
          "0 22px 60px rgba(0, 0, 0, 0.34), inset 0 1px 0 rgba(255, 255, 255, 0.08)",
        "glass-hover":
          "0 28px 80px rgba(0, 0, 0, 0.46), inset 0 1px 0 rgba(255, 255, 255, 0.11)",
        "solar-soft":
          "0 0 90px rgba(246, 197, 107, 0.16), 0 0 180px rgba(217, 130, 31, 0.1)",
        "solar-strong":
          "0 0 140px rgba(246, 197, 107, 0.24), 0 0 260px rgba(217, 130, 31, 0.14)",
        "inner-glass": "inset 0 1px 0 rgba(255, 255, 255, 0.08)",
      },

      backgroundImage: {
        "page-void":
          "radial-gradient(circle at 82% 18%, rgba(246, 197, 107, 0.085), transparent 24rem), radial-gradient(circle at 18% 12%, rgba(255, 255, 255, 0.04), transparent 18rem), linear-gradient(180deg, #000000 0%, #050505 46%, #000000 100%)",
        "glass-panel":
          "linear-gradient(180deg, rgba(255, 255, 255, 0.07), rgba(255, 255, 255, 0.026))",
        "glass-sheen":
          "linear-gradient(110deg, transparent 0%, rgba(255, 255, 255, 0.08) 45%, transparent 70%)",
        "solar-radial":
          "radial-gradient(circle, #fff8e5 0%, #f6c56b 22%, #f2a93b 42%, #d9821f 62%, rgba(217, 130, 31, 0.3) 78%, transparent 100%)",
        "solar-corona":
          "radial-gradient(circle, rgba(255, 241, 199, 0.18) 0%, rgba(246, 197, 107, 0.12) 34%, rgba(217, 130, 31, 0.07) 58%, transparent 74%)",
        "mono-grid":
          "linear-gradient(rgba(255,255,255,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.035) 1px, transparent 1px)",
      },

      keyframes: {
        "card-float": {
          "0%, 100%": {
            transform: "translate3d(0, 0, 0)",
          },
          "50%": {
            transform: "translate3d(0, -3px, 0)",
          },
        },
        "glass-sheen": {
          "0%": {
            transform: "translateX(-120%) skewX(-14deg)",
            opacity: "0",
          },
          "18%": {
            opacity: "1",
          },
          "55%": {
            opacity: "0.65",
          },
          "100%": {
            transform: "translateX(140%) skewX(-14deg)",
            opacity: "0",
          },
        },
        "solar-rotate": {
          "0%": {
            transform: "rotate(0deg) scale(1)",
          },
          "100%": {
            transform: "rotate(360deg) scale(1)",
          },
        },
        "solar-corona": {
          "0%, 100%": {
            opacity: "0.52",
            transform: "scale(1)",
            filter: "blur(18px)",
          },
          "50%": {
            opacity: "0.78",
            transform: "scale(1.035)",
            filter: "blur(22px)",
          },
        },
        "solar-flare": {
          "0%, 100%": {
            opacity: "0.32",
            transform: "translate3d(0, 0, 0) scaleY(0.92)",
          },
          "45%": {
            opacity: "0.68",
            transform: "translate3d(-10px, -6px, 0) scaleY(1.08)",
          },
        },
        "slow-drift": {
          "0%, 100%": {
            transform: "translate3d(0, 0, 0)",
          },
          "50%": {
            transform: "translate3d(0, -10px, 0)",
          },
        },
      },

      animation: {
        "card-float": "card-float 7s ease-in-out infinite",
        "glass-sheen": "glass-sheen 1.25s ease-out forwards",
        "solar-rotate": "solar-rotate 220s linear infinite",
        "solar-corona": "solar-corona 8s ease-in-out infinite",
        "solar-flare": "solar-flare 9s ease-in-out infinite",
        "slow-drift": "slow-drift 16s ease-in-out infinite",
      },

      backdropBlur: {
        glass: "20px",
        deep: "28px",
      },

      fontFamily: {
        sans: ['"PingFang SC"', '"Microsoft YaHei"', "Arial", "sans-serif"],
        display: ['"PingFang SC"', '"Microsoft YaHei"', "Arial", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
