/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        Inter: ["Inter", "sans-serif"],
      },
      visibility: ["group-hover"],
      animation: {
        fadeIn: "fadeIn 250ms",
        shiftRL: "shiftRL .15s ease-in-out",
        shiftLR: "shiftLR .15s ease-in-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        shiftRL: {
          "0%": { transform: "translateX(80%)" },
          "100%": { transform: "translate(0%)" },
        },
        shiftLR: {
          "0%": { transform: "translateX(-80%)" },
          "100%": { transform: "translate(0%)" },
        },
        grow: {
          "0%": { transform: "scale(1)" },
          "100%": { transform: "scale(1.05)" },
        },
      },
    },
  },
  plugins: [],
};
