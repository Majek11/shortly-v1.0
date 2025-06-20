// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  // 1. Tell Tailwind where to scan for class names (important for all your components)
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',      // For Pages Router
    './components/**/*.{js,ts,jsx,tsx,mdx}', // For your reusable components
    './app/**/*.{js,ts,jsx,tsx,mdx}',        // For App Router pages and layouts
    './src/**/*.{js,ts,jsx,tsx,mdx}',        // If you're using a src directory
    './app/globals.css',                     // Also important to scan your CSS for @apply directives
  ],
  theme: {
    extend: {
      // 2. Define your custom colors, mapping them to the CSS variables from globals.css
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      // If you're using --radius for rounded corners, define it here:
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      // You can add other extends here like fontFamily, boxShadow, etc.
    },
  },
  plugins: [],
};