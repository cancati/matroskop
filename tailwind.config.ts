import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // matroskop.com'dan alınan değerler
        brand: {
          DEFAULT: "#033147",
          dark:    "#06476B",
          light:   "#e8eef6",
        },
        accent: {
          yellow:  "#e1b12c",
          blue:    "#82c9ff",
          green:   "#a8e6cf",
          cream:   "#f9e6b3",
          lavender:"#e5b4ff",
        },
        surface: {
          DEFAULT: "#f8f8f8",
          section: "#f0f2f6",
          card:    "#ffffff",
        },
        muted: "#888888",
        cta:   "#382673",
        // Form renkleri
        form: {
          border:  "#e4e9f8",
          primary: "#382673",
          placeholder: "#606266",
          text:    "#383c41",
        },
      },
      fontFamily: {
        sans: ["Plus Jakarta Sans", "sans-serif"],
      },
      fontSize: {
        base: ["17px", { lineHeight: "30px" }],
      },
      maxWidth: {
        container: "1650px",
        content:   "1300px",
      },
      borderRadius: {
        pill: "200px",
      },
      height: {
        header: "93px",
      },
    },
  },
  plugins: [],
};

export default config;
