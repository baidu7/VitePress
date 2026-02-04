import fs from 'fs'
import path from 'path'
import { defineConfig } from 'vitepress'
import { withPwa } from '@vite-pwa/vitepress' // 引入 PWA 插件

/**
 * 自动生成侧边栏的函数
 */
const getAutoSidebar = () => {
  const docsPath = path.resolve(process.cwd(), 'docs')
  let sidebar = []
  if (!fs.existsSync(docsPath)) return []

  const orderMap = { '🌐网站相关': 1, '💾软件插件': 2, '🧩代码片段': 3, '🪄分享': 4, '📑 杂记': 999 }
  const configMap = { '🌐网站相关': false, '🪄分享': true, '🧩代码片段': true }
  const items = fs.readdirSync(docsPath)

  items.forEach(item => {
    const itemPath = path.join(docsPath, item)
    const stat = fs.statSync(itemPath)
    if (stat.isDirectory() && item !== '.vitepress' && item !== 'public') {
      const subItems = fs.readdirSync(itemPath)
      let folderItems = []
      let fileItems = []

      subItems.forEach(sub => {
        const subPath = path.join(itemPath, sub)
        const subStat = fs.statSync(subPath)
        if (subStat.isDirectory()) {
          const subFiles = fs.readdirSync(subPath)
            .filter(f => f.endsWith('.md'))
            .map(f => {
              const name = f.replace('.md', '')
              return { text: name, link: `/${item}/${sub}/${name}` }
            })
          if (subFiles.length > 0) {
            folderItems.push({ text: '📌 ' + sub, collapsed: true, items: subFiles })
          }
        } else if (sub.endsWith('.md')) {
          const name = sub.replace('.md', '')
          fileItems.push({ text: name, link: `/${item}/${name}` })
        }
      })
      const children = [...folderItems, ...fileItems]
      if (children.length > 0) {
        sidebar.push({
          text: item, 
          collapsed: configMap[item] !== undefined ? configMap[item] : true, 
          items: children
        })
      }
    }
  })
  sidebar.sort((a, b) => (orderMap[a.text] || 50) - (orderMap[b.text] || 50))
  const rootFiles = items
    .filter(file => file.endsWith('.md') && file !== 'index.md' && file !== 'admin.md')
    .map(file => {
      const name = file.replace('.md', '')
      return { text: name, link: `/${name}` }
    })
  if (rootFiles.length > 0) {
    sidebar.push({ text: '📑 杂记', collapsed: true, items: rootFiles })
  }
  return sidebar
}

// 使用 withPwa 包装原有的配置
export default withPwa(defineConfig({
  ignoreDeadLinks: true,
  markdown: { image: { lazyLoading: true } },
  cleanUrls: true,
  title: "江大爷",
  description: "江大爷的个人博客",
  
  head: [
    ['link', { rel: 'icon', href: '/favicon.ico' }],
    ['meta', { name: 'theme-color', content: '#3eaf7c' }],
    ['link', { rel: 'apple-touch-icon', href: '/logo.png' }], // 苹果手机图标支持
  ],

  sitemap: {
    hostname: 'https://828111.xyz/' 
  },

  // --- PWA 核心配置开始 ---
  pwa: {
    registerType: 'autoUpdate', // 自动更新，省心！
    injectRegister: 'auto',
    manifest: {
      name: '江大爷',
      short_name: '江大爷',
      description: '江大爷的个人博客',
      theme_color: '#ffffff',
      start_url: '/',
      display: 'standalone', // 关键！让它看起来像个独立的 App
      background_color: '#ffffff',
      icons: [
        {
          src: '/pwa-192x192.png', // 这里暂用您的 logo，建议准备一张 192x192 的
          sizes: '192x192',
          type: 'image/png'
        },
        {
          src: '/pwa-512x512.png',
          sizes: '512x512',
          type: 'image/png'
        }
      ]
    },
    workbox: {
      globPatterns: ['**/*.{js,css,html,png,svg,ico}'] // 离线缓存的文件类型
    }
  },
  // --- PWA 核心配置结束 ---

  transformPageData(pageData) {
      pageData.frontmatter.head ??= []
      const title = pageData.title || '江大爷'
      const description = pageData.frontmatter.description || '江大爷的个人博客'
      const canonicalUrl = `https://828111.xyz/${pageData.relativePath.replace('.md', '.html')}`
      let image = 'https://828111.xyz/logo.png' 
      
      if (pageData.content) {
        const mdMatch = pageData.content.match(/!\[.*?\]\((.*?)\)/)
        const htmlMatch = pageData.content.match(/<img.*?src=['"](.*?)['"]/)
        const firstImg = (mdMatch ? mdMatch[1] : null) || (htmlMatch ? htmlMatch[1] : null)
  
        if (firstImg) {
          image = firstImg.startsWith('http') 
            ? firstImg 
            : `https://828111.xyz${firstImg.startsWith('/') ? '' : '/'}${firstImg}`
        }
      }

      pageData.frontmatter.head.push(
        ['meta', { property: 'og:type', content: 'article' }],
        ['meta', { property: 'og:title', content: title }],
        ['meta', { property: 'og:description', content: description }],
        ['meta', { property: 'og:image', content: image }],
        ['meta', { property: 'og:url', content: encodeURI(canonicalUrl) }],
        ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
        ['meta', { name: 'twitter:image', content: image }]
      )
  
      if (pageData.frontmatter.tags) {
        const keywordsStr = Array.isArray(pageData.frontmatter.tags) ? pageData.frontmatter.tags.join(', ') : pageData.frontmatter.tags
        pageData.frontmatter.head.push(['meta', { name: 'keywords', content: keywordsStr }])
      }
    },

  themeConfig: {
    logo: '/logo.png',
    sidebarMenuLabel: '菜单',
    returnToTopLabel: '返回顶部',
    docFooter: { prev: '上一页', next: '下一页' },
    
    nav: [
      { text: '🏠 首页', link: '/' },
      {
        text: '✨ 更多',
        items: [
          { text: '🖊️ 编辑', link: '/admin.html', target: '_blank' },
          { text: '🗺 站点地图', link: '/sitemap.xml' },
          { text: '👤 关于我', link: '/about' }
        ]
      }
    ],

    outline: { level: [2, 3], label: '本页目录' },
    
    search: { 
      provider: 'local',
      options: {
        locales: {
          root: {
            translations: {
              button: { buttonText: '搜索文档', buttonAriaLabel: '搜索文档' },
              modal: {
                noResultsText: '无法找到相关结果',
                resetButtonTitle: '清除查询条件',
                footer: { selectText: '选择', navigateText: '切换', closeText: '关闭' }
              }
            }
          }
        }
      }
    },

    sidebar: getAutoSidebar()
  }
}))