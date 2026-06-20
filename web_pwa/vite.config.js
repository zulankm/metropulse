import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  base: '/', // Deployment URL: metropulse-zeta.vercel.app — served from root, no sub-path needed
  plugins: [
    react(),
    VitePWA({
      registerType: 'prompt',
      manifest: false, // We set this to false because you already built a great custom manifest.json!
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,json}']
      }
    })
  ]
})
