/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    maxWidth: {
      "5/6": "90%",
    },
    minWidth: {
      "1/3": "35%",
      "1/4": "25%",
      "1/2": "50%",
    },
    extend: {},
  },
  plugins: [],
};
