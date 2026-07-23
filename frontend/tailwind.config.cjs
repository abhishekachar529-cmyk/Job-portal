/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#2563EB',
        primaryDark: '#0F172A',
        teal: '#14B8A6',
        lightBg: '#F8FAFC',
        cardBlue: '#EFF6FF',
        success: '#10B981',
        error: '#EF4444',
        warning: '#F59E0B',
        muted: '#64748B',
        border: '#CBD5E1',
      },
    },
  },
  plugins: [],
}