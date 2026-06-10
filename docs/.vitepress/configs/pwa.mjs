export const pwaConfig = {
		registerType: 'autoUpdate',
		  // 🌟 核心修复：添加 manifest 对象，解决您截图中所有的红字报错
		  manifest: {
      id: '/',
      name: '江大爷',          // 对应报错：清单未包含 name
      short_name: '江大爷',         // 桌面图标下的简短名字
      description: '闲来无事，记点东西',
      theme_color: '#ffffff',
      background_color: '#ffffff',
      display: 'standalone',       // 让博客像 App 一样独立运行
      start_url: '/',              // 启动路径
      icons: [                     // 对应报错：清单未包含合适的图标
		      {
		        src: '/pwa-192x192.png', // 💡 请确保 public 目录下真的有这张图！
		        sizes: '192x192',
		        type: 'image/png'
		      },
		      {
		        src: '/pwa-512x512.png', // 💡 请确保 public 目录下真的有这张图！
		        sizes: '512x512',
		        type: 'image/png'
		      },
		      {
		        src: '/pwa-512x512.png',
		        sizes: '512x512',
		        type: 'image/png',
		        purpose: 'any maskable'  // 适配安卓圆角图标
		      }
		    ]
		  },
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