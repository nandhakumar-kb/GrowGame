import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ command }) => ({
  plugins: [react()],
  // Use root path for Vercel, /GrowGame/ for GitHub Pages
  base: process.env.VERCEL ? '/' : (command === 'build' ? '/GrowGame/' : '/'),
}))
