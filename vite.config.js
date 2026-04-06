import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    vue(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'og-image.svg'],
      manifest: {
        name: 'Artemis II — Mission Control',
        short_name: 'ARTEMIS II',
        description: 'Dashboard de misión lunar en tiempo real para Artemis II.',
        theme_color: '#0d0d14',
        background_color: '#0d0d14',
        display: 'standalone',
        orientation: 'landscape',
        start_url: '/',
        scope: '/',
        icons: [
          {
            src: 'pwa-192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'pwa-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable',
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,woff2}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: { cacheName: 'google-fonts-cache', expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 } },
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: 'CacheFirst',
            options: { cacheName: 'gstatic-fonts-cache', expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 } },
          },
          {
            urlPattern: /^https:\/\/api\.nasa\.gov\/.*/i,
            handler: 'NetworkFirst',
            options: { cacheName: 'nasa-api-cache', expiration: { maxEntries: 5, maxAgeSeconds: 60 * 20 } },
          },
          {
            urlPattern: /^https:\/\/api\.spaceflightnewsapi\.net\/.*/i,
            handler: 'NetworkFirst',
            options: { cacheName: 'snapi-cache', expiration: { maxEntries: 5, maxAgeSeconds: 60 * 10 } },
          },
        ],
      },
    }),
  ],
})
