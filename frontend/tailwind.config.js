/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: 'hsl(var(--color-brand-50))',
          100: 'hsl(var(--color-brand-100))',
          500: 'hsl(var(--color-brand-500))',
          600: 'hsl(var(--color-brand-600))',
          700: 'hsl(var(--color-brand-700))',
        },
        bg: {
          primary: 'hsl(var(--color-bg-primary))',
          secondary: 'hsl(var(--color-bg-secondary))',
          tertiary: 'hsl(var(--color-bg-tertiary))',
        },
        text: {
          primary: 'hsl(var(--color-text-primary))',
          secondary: 'hsl(var(--color-text-secondary))',
          muted: 'hsl(var(--color-text-muted))',
        },
        borderColor: 'hsl(var(--color-border))',
      }
    },
  },
  plugins: [],
}
