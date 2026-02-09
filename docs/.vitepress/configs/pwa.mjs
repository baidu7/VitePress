// .vitepress/configs/pwa.mjs
export const pwaConfig = {
  registerType: 'autoUpdate',
  manifest: {
    name: '江大爷',
    short_name: '江大爷',
    theme_color: '#ffffff',
    icons: [
      { src: '/pwa-192x192.png', sizes: '192x192', type: 'image/png' },
      { src: '/pwa-512x512.png', sizes: '512x512', type: 'image/png' }
    ]
  },
  workbox: {
    skipWaiting: true,
    clientsClaim: true,
    globPatterns: ['**/*.{js,css,html,png,svg,ico}'],
    runtimeCaching: [
      {
        urlPattern: ({ request }) => request.destination === 'document',
        handler: 'NetworkFirst',
        options: { cacheName: 'pages-cache' }
      }
    ]
  }
}