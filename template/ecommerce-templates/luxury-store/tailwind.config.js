const { fontFamily } = require("tailwindcss/defaultTheme");

module.exports = {
  mode: "jit",
  purge: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        serif: ["Playfair Display", ...fontFamily.serif],
        sans: ["Inter", ...fontFamily.sans],
      },
      colors: {
        primary: {
          DEFAULT: "#1e293b",
          hover: "#0f172a",
        },
        secondary: {
          DEFAULT: "#94a3b8",
          hover: "#64748b",
        },
        accent: {
          DEFAULT: "#d4af37",
          hover: "#b8941f",
        },
        gold: {
          light: "#f4e4bc",
          DEFAULT: "#d4af37",
          dark: "#b8941f",
        },
      },
      backgroundColor: {
        base: "#fefefe",
        surface: "#f9fafb",
      },
      textColor: {
        primary: "#0f172a",
        secondary: "#475569",
      },
      borderColor: {
        DEFAULT: "#e5e7eb",
      },
      borderRadius: {
        DEFAULT: "0.25rem",
        lg: "0.5rem",
      },
      boxShadow: {
        luxury: "0 4px 20px rgba(0, 0, 0, 0.08)",
        "luxury-hover": "0 8px 30px rgba(0, 0, 0, 0.12)",
        gold: "0 2px 10px rgba(212, 175, 55, 0.3)",
      },
      transitionDuration: {
        DEFAULT: "400ms",
      },
      spacing: {
        section: "4rem",
      },
      letterSpacing: {
        luxury: "0.05em",
      },
      animation: {
        "fade-in": "fade-in 0.4s ease-out",
        "slide-up": "slide-up 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
        "scale-in": "scale-in 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
        shimmer: "shimmer 2s infinite",
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "slide-up": {
          "0%": { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        "scale-in": {
          "0%": { transform: "scale(0.9)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        shimmer: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.7" },
        },
      },
    },
  },
  plugins: [],
};
