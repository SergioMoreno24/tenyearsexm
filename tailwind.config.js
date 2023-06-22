/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./*.html", "./js/*.js"],
  theme: {
    extend: {
      colors:{
        blue: {
          exm:'#00A1C6',
          exm2: '#123D81',
          exm3: '#28255A',
        },
        purple: {
          exm: '#8D568E',
        },
        yellow: {
          exm: '#FFDA2A',
        },
        green: {
          exm: '#008A55',
        },
      },
    },
  },
  plugins: [],
}

