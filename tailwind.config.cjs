/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        pre: '#FFC107',
        cinema: '#FF3D00',
        teatro: '#00E676',
        concerti: '#00B0FF',
        clubbing: '#7C4DFF',
      },
    },
  },
  plugins: [],
}
