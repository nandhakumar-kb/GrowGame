import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig(({ command }) => {
  // Check multiple Vercel environment variables
  const isVercel = process.env.VERCEL === '1' || process.env.VERCEL_ENV || process.env.VERCEL_URL;
  const base = isVercel ? '/' : (command === 'build' ? '/GrowGame/' : '/');
  
  console.log('Build environment:', { isVercel, base, command });
  
  return {
    plugins: [
      react(),
      // Plugin to handle manifest based on environment
      {
        name: 'manifest-handler',
        closeBundle() {
          if (command === 'build') {
            const distPath = path.resolve(__dirname, 'dist');
            const manifestSource = isVercel 
              ? path.resolve(__dirname, 'public/manifest.json')
              : path.resolve(__dirname, 'public/manifest.prod.json');
            const manifestDest = path.resolve(distPath, 'manifest.json');
            
            try {
              fs.copyFileSync(manifestSource, manifestDest);
              console.log(`✓ Copied ${isVercel ? 'default' : 'production'} manifest`);
            } catch (err) {
              console.error('Failed to copy manifest:', err);
            }
          }
        }
      }
    ],
    base,
    publicDir: 'public',
  }
})
