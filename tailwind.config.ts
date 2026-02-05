import type { Config } from "tailwindcss";
import typography from "@tailwindcss/typography";

const config: Config = {
  darkMode: "class",
  content: ["./src/**/*.{ts,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        accent: {
          500: "#f5a524",
          600: "#e0951c",
        },
      },
    },
  },
  plugins: [typography],
};

export default config;
