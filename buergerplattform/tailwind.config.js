/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./*.html', './assets/app.js', './assets/legal.js'],
  theme: {
    extend: {
      colors: { fw: { DEFAULT: '#EE7202', dark: '#B85000', light: '#FFF1E4' } }
    }
  },
  plugins: []
};
