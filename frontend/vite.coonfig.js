// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    react({
      // Use classic runtime to avoid dynamic evaluation
      jsxRuntime: 'classic',
      // Disable fast refresh if causing CSP issues
      fastRefresh: process.env.NODE_ENV !== 'production',
    }),
  ],
  build: {
    // Prevent code splitting for better CSP compliance
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
    // Use terser for better minification without eval
    minify: 'terser',
    terserOptions: {
      compress: {
        // Avoid constructs that use eval()
        evaluate: false,
      },
    },
  },
  // Add CSP-related headers for development server
  server: {
    headers: {
      'Content-Security-Policy': "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline';"
    }
  }
})