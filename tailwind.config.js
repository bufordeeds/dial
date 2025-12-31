/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        coffee: {
          900: "#1a1412",
          800: "#2d2421",
          700: "#3d322d",
          600: "#5c4a42",
          500: "#7a5f52",
        },
        cream: {
          100: "#f5f0eb",
          200: "#e8dfd6",
          300: "#d4c4b5",
          400: "#c0a994",
        },
        espresso: {
          DEFAULT: "#c17f59",
          light: "#d4a077",
          dark: "#a66b47",
        },
      },
      fontFamily: {
        sans: ["System"],
      },
    },
  },
  plugins: [],
};
