/** @type {import('tailwindcss').Config} */
export default {
    content: [
      "./index.html",
      "./src/**/*.{js,jsx}",
    ],
    theme: {
      extend: {
        colors: {
          primary: {
            DEFAULT: '#4F46E5',
            light: '#818CF8',
            dark: '#4338CA',
          },
          secondary: {
            DEFAULT: '#10B981',
            light: '#34D399',
            dark: '#059669',
          },
        },
      },
    },
    plugins: [],
  }