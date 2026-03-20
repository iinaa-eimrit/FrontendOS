/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  darkMode: ["class", '[data-theme="dark"]'],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          "Inter",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
        mono: ["JetBrains Mono", "Fira Code", "SF Mono", "monospace"],
        display: ["Cal Sans", "Inter", "sans-serif"],
      },
      colors: {
        brand: {
          50: "var(--fos-brand-50, #EFF6FF)",
          100: "var(--fos-brand-100, #DBEAFE)",
          200: "var(--fos-brand-200, #BFDBFE)",
          300: "var(--fos-brand-300, #93C5FD)",
          400: "var(--fos-brand-400, #60A5FA)",
          500: "var(--fos-brand-500, #3B82F6)",
          600: "var(--fos-brand-600, #2563EB)",
          700: "var(--fos-brand-700, #1D4ED8)",
          800: "var(--fos-brand-800, #1E40AF)",
          900: "var(--fos-brand-900, #1E3A8A)",
        },
      },
      animation: {
        "fade-in": "fadeIn 0.2s ease-out",
        "slide-up": "slideUp 0.3s ease-out",
        "slide-down": "slideDown 0.3s ease-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(10px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        slideDown: {
          "0%": { transform: "translateY(-10px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};
