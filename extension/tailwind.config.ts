import type { Config } from "tailwindcss"

export default {
  content: ["./src/**/*.{ts,tsx,html}"],
  theme: {
    extend: {
      colors: {
        forest: {
          50: "#F0F4F3",
          100: "#D9E3E0",
          200: "#B3C7C0",
          300: "#8CABA0",
          400: "#668F80",
          500: "#3C5148",
          600: "#355146",
          700: "#2D4A3E",
          800: "#243B32",
          900: "#1C2C25",
          950: "#0F1A15",
        },
        coral: {
          50: "#FFF5F2",
          100: "#FFE8E1",
          200: "#FFD1C4",
          300: "#FFB5A0",
          400: "#FF9A85",
          500: "#FF7759",
          600: "#E5634A",
          700: "#CC503B",
          800: "#B33D2C",
          900: "#992A1D",
          950: "#661A10",
        },
        peach: {
          50: "#FFF7F5",
          100: "#FFEDE8",
          200: "#FFD9CF",
          300: "#FFC5B6",
          400: "#FFB19D",
          500: "#EC8469",
          600: "#D4705A",
          700: "#BC5C4B",
          800: "#A4483C",
          900: "#8C342D",
          950: "#5C1E18",
        },
        alabaster: "#F8F8F5",
        volcanic: "#1A1D19",
      },
      fontFamily: {
        sans: ["-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "Helvetica", "Arial", "sans-serif"],
        display: ["-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "Helvetica", "Arial", "sans-serif"],
      },
      borderRadius: {
        DEFAULT: "0.75rem",
      },
    },
  },
  plugins: [],
} satisfies Config
