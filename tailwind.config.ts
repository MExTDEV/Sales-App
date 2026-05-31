import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./data/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: "#1d4ed8",
        brandLight: "#dbeafe",
        ink: "#0f172a",
        surface: "#f1f5f9"
      },
      boxShadow: {
        app: "0 18px 50px rgba(15, 23, 42, 0.12)"
      }
    }
  },
  plugins: []
};

export default config;
