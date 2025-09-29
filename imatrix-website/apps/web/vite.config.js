// ===============================
// VITE CONFIG (vite.config.js)
// ===============================
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/imatrix/',
  server: {
    proxy: {
      '/api': {
        target: 'https://web-production-5822f.up.railway.app',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
})