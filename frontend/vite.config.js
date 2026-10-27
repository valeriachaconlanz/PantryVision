import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // Forward /api calls to the Spring Boot backend during development
    proxy: {
      '/api': 'http://localhost:8080',
    },
  },
})
