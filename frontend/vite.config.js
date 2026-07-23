import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5175,
    host: true,
    hmr: {
      overlay: false
    }
  },
  optimizeDeps: {
    force: true,
    include: ['react', 'react-dom', 'react-router-dom', 'react-redux', '@reduxjs/toolkit', 'recharts', 'react-hot-toast', 'react-icons']
  }
})