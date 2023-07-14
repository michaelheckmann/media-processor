/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      borderWidth: {
        1: "1px",
      },
      fontSize: {
        "2xs": ".65rem",
      },
      animation: {
        "spin-slow": "spin 3s linear infinite",
      },
      transitionProperty: {
        width: "width",
      },
    },
  },
  plugins: [],
};
