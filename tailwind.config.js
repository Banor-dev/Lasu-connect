/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: "#10231F", // deep pine-navy, primary dark surface
          800: "#16302A",
          700: "#1E3D35",
        },
        marigold: {
          DEFAULT: "#F2A93B", // danfo-yellow accent, the signature color
          600: "#DB9527",
          100: "#FDEBC9",
        },
        parchment: "#FBF7EE", // warm off-white background
        coral: "#E85C4A", // alert / urgent accent, used sparingly
        slate: {
          650: "#475A55",
        },
      },
      fontFamily: {
        display: ["Sora", "sans-serif"],
        body: ["Inter", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      borderRadius: {
        xl2: "1.25rem",
      },
    },
  },
  plugins: [],
};
