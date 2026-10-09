import { defineConfig, lazyPlugins } from "vite-plus";
import { reactRouter } from "@react-router/dev/vite";
import { lintConfig, toolingIgnorePatterns } from "./tools/lint.config";

export default defineConfig({
  staged: {
    "*": "vp check --fix",
  },
  fmt: { ignorePatterns: toolingIgnorePatterns },
  lint: lintConfig,
  test: {
    // Vitest v4 compatibility: preserve mock call history.
    // Remove after tests no longer rely on calls from setup or earlier tests.
    // https://viteplus.dev/guide/vitest-v5#remove-unneeded-compatibility-settings
    // https://vitest.dev/guide/migration/#clearmocks-is-enabled-by-default
    clearMocks: false,
  },
  base: process.env.GITHUB_PAGES === "true" ? "/portfolio-website/" : "/",
  plugins: lazyPlugins(() => [reactRouter()]),
  server: {
    port: 4173,
  },
});
