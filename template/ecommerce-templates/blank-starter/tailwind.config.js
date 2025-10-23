const { fontFamily } = require("tailwindcss/defaultTheme");

module.exports = {
  mode: "jit",
  purge: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", ...fontFamily.sans],
      },
      colors: {
        primary: {
          DEFAULT: "#4f46e5",
          hover: "#4338ca",
        },
        secondary: {
          DEFAULT: "#6b7280",
          hover: "#4b5563",
        },
        accent: {
          DEFAULT: "#8b5cf6",
          hover: "#7c3aed",
        },
      },
      backgroundColor: {
        base: "#ffffff",
        surface: "#f9fafb",
      },
      textColor: {
        primary: "#111827",
        secondary: "#6b7280",
      },
      borderColor: {
        DEFAULT: "#e5e7eb",
      },
      borderRadius: {
        DEFAULT: "0.5rem",
        lg: "0.75rem",
      },
      boxShadow: {
        DEFAULT: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
        hover: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
      },
      transitionDuration: {
        DEFAULT: "200ms",
      },
      spacing: {
        section: "2rem",
      },
      animation: {
        "fade-in": "fade-in 0.2s ease-out",
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};
