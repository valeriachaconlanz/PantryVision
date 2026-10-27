import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // sends /api requests to the backend when running locally
    proxy: {
      '/api': 'http://localhost:8080',
    },
  },
})
