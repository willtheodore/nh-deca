const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  purge: ["./pages/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  darkMode: false,
  theme: {
    screens: {
      tablet: "760px",
      desktop: "1280px",
    },
    extend: {
      colors: {
        decaBlue: "#0072CE",
        blueSteel: "#586F95",
      },
      height: {
        "screen-1/2": "50vh",
        "screen-1/3": "33vh",
        "screen-2/3": "66vh",
        "screen-1/4": "25vh",
        "screen-3/4": "75vh",
      },
      width: {
        "screen-1/2": "50vw",
        "screen-1/3": "33vw",
        "screen-2/3": "66vw",
        "screen-1/4": "25vw",
        "screen-3/4": "75vw",
      },
      margin: {
        "screen-1/2": "50vh",
        "screen-1/3": "33vh",
        "screen-2/3": "66vh",
        "screen-1/4": "25vh",
        "screen-3/4": "75vh",
      },
      spacing: {
        18: "4.5rem",
        128: "32rem",
        144: "36rem",
      },
      fontFamily: {
        sans: ["source-sans-pro", ...defaultTheme.fontFamily.sans],
      },
      borderRadius: {
        "4xl": "2rem",
      },
    },
  },
};
