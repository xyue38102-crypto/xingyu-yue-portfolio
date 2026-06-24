import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import fs from "node:fs";
import path from "node:path";

const isGitHubPages = process.env.GITHUB_PAGES === "true";

const removeLocalVideoBundle = () => ({
  name: "remove-local-video-bundle",
  closeBundle() {
    if (!isGitHubPages) return;
    fs.rmSync(path.resolve(__dirname, "dist/generated-videos"), {
      force: true,
      recursive: true
    });
  }
});

export default defineConfig({
  base: isGitHubPages ? "/xingyu-yue-portfolio/" : "/",
  plugins: [react(), removeLocalVideoBundle()],
  server: {
    fs: {
      allow: [path.resolve(__dirname, "..")]
    }
  }
});
