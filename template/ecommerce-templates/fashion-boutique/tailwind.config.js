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
          DEFAULT: "#ec4899",
          hover: "#db2777",
          light: "#f9a8d4",
        },
        secondary: {
          DEFAULT: "#f472b6",
          hover: "#ec4899",
          light: "#fbcfe8",
        },
        accent: {
          DEFAULT: "#a855f7",
          hover: "#9333ea",
          light: "#d8b4fe",
        },
        pink: {
          50: "#fdf4ff",
          100: "#fce7f3",
          200: "#fbcfe8",
          500: "#ec4899",
          600: "#db2777",
        },
      },
      backgroundColor: {
        base: "#fdf4ff",
        surface: "#ffffff",
      },
      textColor: {
        primary: "#1f2937",
        secondary: "#6b7280",
      },
      borderColor: {
        DEFAULT: "#fce7f3",
        accent: "#f472b6",
      },
      borderRadius: {
        DEFAULT: "1rem",
        xl: "1.5rem",
        "2xl": "2rem",
        blob: "30% 70% 70% 30% / 30% 30% 70% 70%",
      },
      boxShadow: {
        pink: "0 4px 20px rgba(236, 72, 153, 0.2)",
        "pink-hover": "0 8px 30px rgba(236, 72, 153, 0.3)",
        playful: "0 10px 40px rgba(236, 72, 153, 0.15)",
      },
      transitionDuration: {
        DEFAULT: "350ms",
      },
      spacing: {
        section: "2.5rem",
      },
      animation: {
        "fade-in": "fade-in 0.35s ease-out",
        "slide-up": "slide-up 0.35s cubic-bezier(0.68, -0.55, 0.265, 1.55)",
        "scale-in": "scale-in 0.35s cubic-bezier(0.68, -0.55, 0.265, 1.55)",
        bounce: "bounce 1s infinite",
        wiggle: "wiggle 0.5s ease-in-out",
        pulse: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
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
          "0%": { transform: "scale(0.8) rotate(-5deg)", opacity: "0" },
          "100%": { transform: "scale(1) rotate(0deg)", opacity: "1" },
        },
        wiggle: {
          "0%, 100%": { transform: "rotate(-3deg)" },
          "50%": { transform: "rotate(3deg)" },
        },
      },
      backgroundImage: {
        "gradient-pink": "linear-gradient(135deg, #ec4899 0%, #f472b6 50%, #a855f7 100%)",
        "gradient-playful": "linear-gradient(135deg, #fce7f3 0%, #fbcfe8 100%)",
      },
    },
  },
  plugins: [],
};
