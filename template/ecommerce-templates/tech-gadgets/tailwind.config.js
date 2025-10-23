const { fontFamily } = require("tailwindcss/defaultTheme");

module.exports = {
  mode: "jit",
  purge: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Poppins", ...fontFamily.sans],
        mono: ["JetBrains Mono", ...fontFamily.mono],
      },
      colors: {
        primary: {
          DEFAULT: "#6366f1",
          hover: "#4f46e5",
          light: "#818cf8",
        },
        secondary: {
          DEFAULT: "#8b5cf6",
          hover: "#7c3aed",
          light: "#a78bfa",
        },
        accent: {
          DEFAULT: "#06b6d4",
          hover: "#0891b2",
          light: "#22d3ee",
        },
        dark: {
          50: "#1e293b",
          100: "#0f172a",
          200: "#020617",
        },
      },
      backgroundColor: {
        base: "#0f172a",
        surface: "#1e293b",
        glass: "rgba(30, 41, 59, 0.7)",
      },
      textColor: {
        primary: "#f8fafc",
        secondary: "#cbd5e1",
      },
      borderColor: {
        DEFAULT: "#334155",
        glass: "rgba(255, 255, 255, 0.1)",
      },
      borderRadius: {
        DEFAULT: "0.75rem",
        xl: "1rem",
        "2xl": "1.5rem",
      },
      boxShadow: {
        neon: "0 0 20px rgba(99, 102, 241, 0.5)",
        "neon-hover": "0 0 30px rgba(99, 102, 241, 0.7)",
        glass: "0 8px 32px 0 rgba(0, 0, 0, 0.37)",
      },
      backdropBlur: {
        glass: "10px",
      },
      transitionDuration: {
        DEFAULT: "250ms",
      },
      spacing: {
        section: "3rem",
      },
      animation: {
        "fade-in": "fade-in 0.25s ease-out",
        "slide-up": "slide-up 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)",
        "scale-in": "scale-in 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)",
        glow: "glow 2s ease-in-out infinite",
        float: "float 3s ease-in-out infinite",
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
        "scale-in": {
          "0%": { transform: "scale(0.9)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        glow: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.5" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-tech": "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        "gradient-cyber": "linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #06b6d4 100%)",
      },
    },
  },
  plugins: [],
};
