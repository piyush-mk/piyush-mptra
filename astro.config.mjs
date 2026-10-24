import { defineConfig } from "astro/config";

export default defineConfig({
  site: "https://piyushmoha.com",
  output: "static",
  trailingSlash: "never",
  build: { format: "file", inlineStylesheets: "never" },
  devToolbar: { enabled: false },
  vite: { build: { assetsInlineLimit: 0 } },
});
