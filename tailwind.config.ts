import type { Config } from "tailwindcss";

/**
 * Note : le projet utilise Tailwind v4 via app/globals.css (@theme).
 * Ces tokens documentent la palette officielle du logo pour référence.
 * Les couleurs actives du site sont définies dans globals.css.
 */
export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: "#0B4372",
        green: {
          DEFAULT: "#19862B",
          bright: "#1FA336",
          soft: "#E8F5EA",
        },
        blue: {
          DEFAULT: "#0B4372",
          soft: "#1A5F8A",
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
