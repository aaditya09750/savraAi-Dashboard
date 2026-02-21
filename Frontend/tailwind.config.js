/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
      },
      colors: {
        brand: {
          purple: '#F3F0FF', // Sidebar bg
          purpleDark: '#5B4E8E',
          primary: '#8B5CF6',
        },
        pastel: {
          purple: '#F3E8FF',
          green: '#DCFCE7',
          rose: '#FFE4E6',
          yellow: '#FEF9C3',
          orange: '#FFEDD5',
          blue: '#DBEAFE',
        },
      },
      boxShadow: {
        'card': '0 4px 20px rgba(0, 0, 0, 0.03)',
        'floating': '0 10px 30px rgba(0, 0, 0, 0.1)',
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
      }
    },
  },
  plugins: [],
};
