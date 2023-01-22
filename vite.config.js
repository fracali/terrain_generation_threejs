import glsl from "vite-plugin-glsl";

export default {
  root: "src",
  build: {
    outDir: "../public",
    emptyOutDir: true,
  },
  plugins: [glsl()],
};
