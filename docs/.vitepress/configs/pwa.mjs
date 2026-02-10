export const pwaConfig = {
  registerType: 'autoUpdate',
  // ... manifest 部分保持不变 ...
  workbox: {
    skipWaiting: true,
    clientsClaim: true,
    // 💡 建议 1: 从预缓存中去掉 html
    // 让网页每次都去撞一下网络，确保拿到最新的入口文件
    globPatterns: ['**/*.{js,css,png,svg,ico}'], 
    
    runtimeCaching: [
      {
        urlPattern: ({ request }) => request.destination === 'document',
        handler: 'NetworkFirst', // 💡 这里是对的：先网后地，但可以加个超时
        options: {
          cacheName: 'pages-cache',
          networkTimeoutSeconds: 3, // 💡 建议 2: 3秒没连上网再看缓存
          expiration: {
            maxEntries: 50,
            maxAgeSeconds: 60 * 60 * 24
          }
        }
      },
      // 💡 建议 3: 给图片单独加一个缓存策略，让它“缓存优先”
      {
        urlPattern: ({ request }) => request.destination === 'image',
        handler: 'CacheFirst',
        options: {
          cacheName: 'image-cache',
          expiration: { maxEntries: 100, maxAgeSeconds: 60 * 60 * 24 * 30 }
        }
      }
    ]
  }
}