import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      // 'prompt'：有新版本時只通知，由使用者決定何時更新
      registerType: 'prompt',
      manifest: {
        name: 'phub 作品商店',
        short_name: 'phub',
        description: '瀏覽、開啟、下載我做的所有網站與程式',
        lang: 'zh-TW',
        theme_color: '#0f172a',
        background_color: '#0f172a',
        display: 'standalone',
        icons: [
          { src: 'pwa-64x64.png', sizes: '64x64', type: 'image/png' },
          { src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png' },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any',
          },
          {
            src: 'maskable-icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
      workbox: {
        // 程式本體與圖示：預先快取，離線也能開啟
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
        cleanupOutdatedCaches: true,
        navigateFallback: 'index.html',
        // 專案清單不預先快取，改成「有網路就抓最新，沒網路才用舊的」
        runtimeCaching: [
          {
            urlPattern: ({ url }) => url.pathname.endsWith('/projects.json'),
            handler: 'NetworkFirst',
            options: {
              cacheName: 'phub-projects',
              networkTimeoutSeconds: 5,
              cacheableResponse: { statuses: [200] },
              expiration: { maxEntries: 1 },
            },
          },
        ],
      },
    }),
  ],
})