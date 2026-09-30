import { defineConfig } from 'vite'
import { reactRouter } from '@react-router/dev/vite'

export default defineConfig({
  base: process.env.GITHUB_PAGES === 'true' ? '/portfolio-website/' : '/',
  plugins: [reactRouter()],
  server: {
    port: 4173,
  },
})
