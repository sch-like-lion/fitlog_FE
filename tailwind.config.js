/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#E9E3DF',  // 연한 베이지
          orange: '#FF7A30', // 오렌지
          navy: '#465C88',   // 네이비
          black: '#000000',  // 블랙
        },
        // 별칭으로도 사용 가능하도록
        'custom-beige': '#E9E3DF',
        'custom-orange': '#FF7A30',
        'custom-navy': '#465C88',
        'custom-black': '#000000',
      },
      borderRadius: {
        'custom': '12px',
        'custom-lg': '16px',
        'custom-xl': '20px',
      }
    },
  },
  plugins: [],
}
