/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        black_1: "#22242a", // Light shade
        black_2: "#1b1e22", // Dark shade

        blue_1: "#1777ff", // ...
        gray: "#504c4f",
      },
    },
  },
  plugins: [],
};
