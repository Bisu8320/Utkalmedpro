import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          ui: ['lucide-react']
        }
      }
    }
  },
  define: {
    // Ensure environment variables are properly defined for production
    'import.meta.env.VITE_API_URL': JSON.stringify(process.env.VITE_API_URL || 'https://your-backend-api.com/api'),
    'import.meta.env.VITE_WS_URL': JSON.stringify(process.env.VITE_WS_URL || 'wss://your-backend-api.com'),
  }
})