import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import yamlPlugin from "@rollup/plugin-yaml";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), yamlPlugin()],
});
