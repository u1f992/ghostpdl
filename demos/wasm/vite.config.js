import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "/ghostpdl/",
  plugins: [react()],
  // https://stackoverflow.com/a/79466574
  assetsInclude: ["**/*.wasm"],
  optimizeDeps: {
    exclude: ["@u1f992/ghostpdl"],
  },
  server: {
    fs: {
      allow: [".", "../../wasm/dist"],
    },
  },
});
