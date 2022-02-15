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
      fontFamily: {
        inter: ["Inter", fontFamily.sans],
        poppins: ["Poppins", fontFamily.serif],
        ibm: ["IBM Plex Sans", fontFamily.serif],
      },
    },
  },
  plugins: [],
};
