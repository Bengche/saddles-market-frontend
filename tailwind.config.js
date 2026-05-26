/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./context/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#1C3557",
          50: "#EBF0F7",
          100: "#C8D6EA",
          200: "#94ADCF",
          300: "#6089B4",
          400: "#3664A0",
          500: "#1C3557",
          600: "#162A45",
          700: "#101F34",
          800: "#0B1522",
          900: "#050A11",
        },
        gold: {
          DEFAULT: "#C4A862",
          50: "#FBF7EE",
          100: "#F4EBCC",
          200: "#E9D799",
          300: "#DEC366",
          400: "#C4A862",
          500: "#8B6914",
          600: "#6F5410",
          700: "#533F0C",
          800: "#372A08",
          900: "#1B1504",
        },
        cream: {
          DEFAULT: "#F5EFE6",
          50: "#FDFCFA",
          100: "#FAFAF7",
          200: "#F5EFE6",
          300: "#EDE5D8",
          400: "#E0D5C3",
          500: "#CEBFA6",
        },
      },
      fontFamily: {
        serif: ["var(--font-playfair)", "Georgia", "Cambria", "serif"],
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        luxury: "0 4px 24px -4px rgba(28, 53, 87, 0.12)",
        "luxury-lg": "0 12px 48px -8px rgba(28, 53, 87, 0.18)",
        gold: "0 4px 20px -2px rgba(196, 168, 98, 0.35)",
        card: "0 2px 16px rgba(28, 53, 87, 0.08)",
        "card-hover": "0 8px 32px rgba(28, 53, 87, 0.16)",
      },
      animation: {
        "fade-in": "fadeIn 0.6s ease-out",
        "slide-up": "slideUp 0.5s ease-out",
        "slide-down": "slideDown 0.3s ease-out",
        "scale-in": "scaleIn 0.3s ease-out",
        shimmer: "shimmer 2s infinite",
      },
      keyframes: {
        fadeIn: { "0%": { opacity: "0" }, "100%": { opacity: "1" } },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideDown: {
          "0%": { opacity: "0", transform: "translateY(-12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        scaleIn: {
          "0%": { opacity: "0", transform: "scale(0.95)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        shimmer: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(100%)" },
        },
      },
      transitionTimingFunction: {
        luxury: "cubic-bezier(0.4, 0, 0.2, 1)",
        "bounce-in": "cubic-bezier(0.34, 1.56, 0.64, 1)",
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
