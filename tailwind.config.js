/** @type {import('tailwindcss').Config} */

export default {
    content: [
      "./index.html",
      "./src/**/*.{vue,js,ts,jsx,tsx}",
    ],
    theme: {
    extend: {},
    colors: {
      transparent: "transparent",
      current: "currentColor",
      grey: {
        lightest: "#B4B4B4",
        lighter: "#A4A4A4",
        light: "#535353",
        DEFAULT: "#2A2A28",
        dark: "#1D1D1B",
        darker: "#0C0B0B"
      },
      white: {
        DEFAULT: "#fff",
        dark: "#F1F1F1"
      },
      primary: {
        lighter: "#B6FFFF",
        DEFAULT: "#16DBDB",
        darker: "#00B2FF"
      },
      xummblue: {
        DEFAULT: "#3459FB"
      },
      black: '#000',
      green: {
        DEFAULT: "#5CB829",
      },
      red: {
        50: "#fef2f2",
        100: "#fee2e2",
        400: "#fca5a5",
        500: "#ef4444",
        DEFAULT: "#D1342E",
      },
    },
  },
  plugins: [],
}

