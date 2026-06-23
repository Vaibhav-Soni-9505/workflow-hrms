import type { Config } from "tailwindcss";

export default {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./pages/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        "background-secondary": "var(--background-secondary)",
        "background-tertiary": "var(--background-tertiary)",
        foreground: "var(--foreground)",
        "foreground-muted": "var(--foreground-muted)",
        primary: "rgb(var(--color-primary) / <alpha-value>)",
        "primary-light": "rgb(var(--color-primary-light) / <alpha-value>)",
        "primary-dark": "rgb(var(--color-primary-dark) / <alpha-value>)",
        "primary-foreground": "rgb(var(--color-primary-foreground) / <alpha-value>)",
        accent: "rgb(var(--color-accent) / <alpha-value>)",
        "accent-light": "rgb(var(--color-accent-light) / <alpha-value>)",
        "accent-dark": "rgb(var(--color-accent-dark) / <alpha-value>)",
        "accent-foreground": "rgb(var(--color-accent-foreground) / <alpha-value>)",
        secondary: "rgb(var(--color-secondary) / <alpha-value>)",
        "secondary-foreground": "rgb(var(--color-secondary-foreground) / <alpha-value>)",
        muted: "rgb(var(--color-muted) / <alpha-value>)",
        "muted-foreground": "rgb(var(--color-muted-foreground) / <alpha-value>)",
        destructive: "rgb(var(--color-destructive) / <alpha-value>)",
        success: "rgb(var(--color-success) / <alpha-value>)",
        warning: "rgb(var(--color-warning) / <alpha-value>)",
        border: "rgb(var(--color-border) / <alpha-value>)",
        input: "rgb(var(--color-input) / <alpha-value>)",
        ring: "rgb(var(--color-ring) / <alpha-value>)",
      },
      borderRadius: {
        sm: "var(--radius-sm)",
        DEFAULT: "var(--radius-md)",
        md: "var(--radius-md)",
        lg: "var(--radius-lg)",
        xl: "var(--radius-xl)",
        "2xl": "var(--radius-2xl)",
        full: "var(--radius-full)",
      },
      boxShadow: {
        soft: "0 1px 3px 0 rgb(0 0 0 / 0.3), 0 1px 2px -1px rgb(0 0 0 / 0.3)",
        md: "0 4px 12px -1px rgb(0 0 0 / 0.4), 0 2px 6px -2px rgb(0 0 0 / 0.3)",
        lg: "0 10px 24px -3px rgb(0 0 0 / 0.5)",
        teal: "0 0 20px rgb(var(--color-primary) / 0.35)",
        orange: "0 0 20px rgb(var(--color-accent) / 0.35)",
        "inner-teal": "inset 0 0 12px rgb(var(--color-primary) / 0.15)",
      },
      keyframes: {
        "slide-up": {
          from: { transform: "translateY(12px)", opacity: "0" },
          to: { transform: "translateY(0)", opacity: "1" },
        },
        "slide-down": {
          from: { transform: "translateY(-12px)", opacity: "0" },
          to: { transform: "translateY(0)", opacity: "1" },
        },
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        "scale-in": {
          from: { transform: "scale(0.95)", opacity: "0" },
          to: { transform: "scale(1)", opacity: "1" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% center" },
          "100%": { backgroundPosition: "200% center" },
        },
        "bounce-subtle": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-3px)" },
        },
      },
      animation: {
        "slide-up": "slide-up 0.3s ease-out",
        "slide-down": "slide-down 0.3s ease-out",
        "fade-in": "fade-in 0.2s ease-out",
        "scale-in": "scale-in 0.2s ease-out",
        shimmer: "shimmer 1.5s infinite",
        "bounce-subtle": "bounce-subtle 2s ease-in-out infinite",
        "spin-slow": "spin 3s linear infinite",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      spacing: {
        18: "4.5rem",
        22: "5.5rem",
        30: "7.5rem",
        "safe-bottom": "max(1rem, env(safe-area-inset-bottom))",
      },
      maxWidth: {
        mobile: "430px",
      },
      backgroundImage: {
        "teal-gradient": "linear-gradient(135deg, rgb(var(--color-primary-dark)), rgb(var(--color-primary)))",
        "orange-gradient": "linear-gradient(135deg, rgb(var(--color-accent-dark)), rgb(var(--color-accent)))",
        "hero-gradient": "linear-gradient(135deg, rgb(var(--color-primary)) 0%, rgb(var(--color-accent)) 100%)",
        "card-gradient": "linear-gradient(145deg, rgb(30 41 59 / 0.9), rgb(15 23 42 / 0.8))",
      },
    },
  },
  plugins: [],
} satisfies Config;
