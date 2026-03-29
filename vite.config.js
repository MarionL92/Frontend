import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/api': {
        target: 'https://backend-pfe-utbn.onrender.com',
        changeOrigin: true
      },
      '/auth': {
        target: 'https://backend-pfe-utbn.onrender.com',
        changeOrigin: true
      },
      '/health': {
        target: 'https://backend-pfe-utbn.onrender.com',
        changeOrigin: true
      }
    }
  }
})
