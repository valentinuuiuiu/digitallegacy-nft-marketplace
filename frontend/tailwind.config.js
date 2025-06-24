module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    fontFamily: {
      'sans': ['Poppins', 'sans-serif']
    },
    extend: {
      colors: {
        primary: '#3b82f6',
        secondary: '#64748b',
        dark: '#1e293b',
        light: '#f1f5f9',
      }
    },
  },
  plugins: [],
}