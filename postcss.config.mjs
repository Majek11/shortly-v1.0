// postcss.config.mjs
const config = {
  plugins: [
    "tailwindcss", // <--- CHANGE THIS LINE!
    "autoprefixer", // Make sure autoprefixer is also here if you need it
  ],
};

export default config;