import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  base: '/metropulse/', // IMPORTANT: Change this to match your exact GitHub repository name!
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
