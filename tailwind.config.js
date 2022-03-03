const { fontFamily } = require("tailwindcss/defaultTheme");

module.exports = {
  mode: "jit",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./layouts/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        "3xl": "1920px",
      },
      fontFamily: {
        inter: ["Inter", fontFamily.sans],
        ibm: ["IBM Plex Sans", fontFamily.serif],
        roboto: ["Roboto", fontFamily.serif],
        poppins: ["Poppins", fontFamily.sans],
      },
    },
  },
  variants: {
    extend: {
      borderRadius: ["hover", "group-hover"],
    },
  },
  plugins: [],
};
