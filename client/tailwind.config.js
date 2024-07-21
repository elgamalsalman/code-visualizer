import colors from "tailwindcss/colors";

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        transparent: "transparent",
        current: "currentColor",
        "background-dark": {
          50: "#f8fafc",
          100: "#f1f5f9",
          200: "#e2e8f0",
          300: "#cbd5e1",
          400: "#94a3b8",
          500: "#64748b",
          600: "#475569",
          700: "#334155",
          750: "#283548",
          800: "#1e293b",
          850: "#172033",
          900: "#0f172a",
          950: "#020617",
        },
      },
      keyframes: {
        "soft-pulse": {
          "0%, 100%": { opacity: "0.05" },
          "50%": { opacity: "0.1" },
        },
        "square-pulse": {
          "0%, 50%": { opacity: "1" }, // Change this value to your desired min opacity
          "51%, 100%": { opacity: "0" }, // Change this value to your desired max opacity
        },
      },
      animation: {
        "soft-pulse": "soft-pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "square-pulse":
          "square-pulse 1.25s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
    },
  },
  plugins: [],
};
