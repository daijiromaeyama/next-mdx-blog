module.exports = {
  purge: ['./components/**/*.tsx', './pages/**/*.tsx'],
  content: [],
  theme: {
    extend: {},
  },
  plugins: [require('@tailwindcss/typography')],
}
