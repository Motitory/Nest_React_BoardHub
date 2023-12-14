module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // 모든 JavaScript 및 TypeScript 파일 내의 Tailwind 클래스 검색
    "./public/index.html", // public/index.html 내의 클래스도 포함
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
