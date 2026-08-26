import { colors as dsColors } from "./src/design-system/tailwind.tokens.js";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: { extend: { colors: dsColors } },
  plugins: [],
};
