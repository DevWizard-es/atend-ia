/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: {
          DEFAULT: "#0052FF",
          foreground: "#FFFFFF",
        },
        sidebar: {
          DEFAULT: "#F8FAFC",
          foreground: "#0F172A",
          active: "#0052FF14",
        }
      },
    },
  },
  plugins: [],
};
