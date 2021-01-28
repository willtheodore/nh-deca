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
			spacing: {
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
