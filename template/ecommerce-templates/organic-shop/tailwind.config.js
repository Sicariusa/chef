const { fontFamily } = require("tailwindcss/defaultTheme");

module.exports = {
  mode: "jit",
  purge: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Poppins", ...fontFamily.sans],
      },
      colors: {
        primary: {
          DEFAULT: "#059669",
          hover: "#047857",
          light: "#10b981",
        },
        secondary: {
          DEFAULT: "#10b981",
          hover: "#059669",
          light: "#34d399",
        },
        accent: {
          DEFAULT: "#f59e0b",
          hover: "#d97706",
          light: "#fbbf24",
        },
        earth: {
          50: "#fefdf8",
          100: "#f7f6f1",
          200: "#e7e5df",
          300: "#d6d3cc",
        },
        green: {
          50: "#f0fdf4",
          500: "#10b981",
          600: "#059669",
          700: "#047857",
        },
      },
      backgroundColor: {
        base: "#fefdf8",
        surface: "#f7f6f1",
      },
      textColor: {
        primary: "#1f2937",
        secondary: "#6b7280",
      },
      borderColor: {
        DEFAULT: "#d1d5db",
        light: "#e5e7eb",
      },
      borderRadius: {
        DEFAULT: "0.5rem",
        lg: "0.75rem",
        xl: "1rem",
      },
      boxShadow: {
        natural: "0 2px 8px rgba(0, 0, 0, 0.06)",
        "natural-hover": "0 4px 12px rgba(0, 0, 0, 0.08)",
        leaf: "0 4px 15px rgba(5, 150, 105, 0.1)",
      },
      transitionDuration: {
        DEFAULT: "400ms",
      },
      spacing: {
        section: "4rem",
      },
      animation: {
        "fade-in": "fade-in 0.4s ease-out",
        "slide-up": "slide-up 0.4s ease-out",
        grow: "grow 0.4s ease-in-out",
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "slide-up": {
          "0%": { transform: "translateY(15px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        grow: {
          "0%": { transform: "scale(0.95)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
      },
      backgroundImage: {
        "gradient-earth": "linear-gradient(135deg, #f7f6f1 0%, #e7e5df 100%)",
        "gradient-leaf": "linear-gradient(135deg, #059669 0%, #10b981 100%)",
      },
    },
  },
  plugins: [],
};
