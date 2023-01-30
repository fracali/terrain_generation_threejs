import glsl from "vite-plugin-glsl";

export default {
  root: "src",
  build: {
    outDir: "../dist",
    emptyOutDir: true,
  },
  plugins: [glsl()],
};
