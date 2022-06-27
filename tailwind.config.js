const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  content: [
    "./src/**/*.{html,ts}"
  ],
  theme: {
    screens: {
      'xs': '460px',
      ...defaultTheme.screens,
    },
    // fontFamily: {
    //   'Vazir': ['Vazir']
    // },
  },
  plugins: [],
}