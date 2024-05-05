import type { Config } from "tailwindcss";
const { fontFamily } = require("tailwindcss/defaultTheme");

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    fontFamily: {
      sans: ["var(--font-sans)", ...fontFamily.sans],
    },
    extend: {
      colors: {
        main: {
          100: "#F1FBFB",
          300: "#CEF1F1",
          500: "#86CED8",
          700: "#35AEBE",
          900: "#098292",
        },
        warning: {
          100: "#FFF4E4",
          500: "#D9CA7B",
          900: "#9E8E00",
        },
        error: {
          100: "#FFEEEF",
          500: "#F55C67",
          900: "#DD224F",
        },
        gray: {
          100: "#F3F5F7",
          200: "#E2E5E7",
          300: "#D4D7DD",
          400: "#CBCBCF",
          500: "#ABAFB5",
          600: "#989DA5",
          700: "#747A81",
          800: "#5A5F62",
          900: "#1F2324",
        },
        background: "#ffffff",
        foreground: "#030712",
        primary: "#098292",
        "primary-foreground": "#f9fafb",
        border: "#e5e7eb",
        input: "#e5e7eb",
        ring: "#098292", // same as primary
        secondary: "#f3f4f6",
        "secondary-foreground": "#111827",
        destructive: "#dd224f",
        "destructive-foreground": "#f9fafb",
        muted: "#f3f4f6",
        "muted-foreground": "#6b7280",
        accent: "#f3f4f6",
        "accent-foreground": "#111827",
        popover: "#ffffff",
        "popover-foreground": "#030712",
        tooltip: "#374151",
        "tooltip-foreground": "#ffffff",
        card: "#ffffff",
        "card-foreground": "#030712",
        white: "#ffffff",
      },
    },
  },
  plugins: [
    // require("tailwindcss-animate"),
    require("autoprefixer"),
    require("tailwindcss-text-fill"),
  ],
};
export default config;
