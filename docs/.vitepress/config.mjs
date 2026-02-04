import fs from 'fs'
import path from 'path'
import { defineConfig } from 'vitepress'
import { withPwa } from '@vite-pwa/vitepress'

/**
 * 辅助函数：智能获取文章标题
 */
const getFileTitle = (filePath, defaultName) => {
  try {
    const content = fs.readFileSync(filePath, 'utf-8')
    
    // 1. 严格匹配顶部的 Frontmatter
    // 加上 m 修饰符，确保 ^ 能匹配每一行的开头
    const titleMatch = content.match(/^title:\s*(.*?)\s*$/m) 
    if (titleMatch && titleMatch[1]) {
      // 去掉可能存在的引号
      return titleMatch[1].replace(/['"]/g, '').trim() 
    }

    // 2. 如果没写 title，再找 H1
    const h1Match = content.match(/^#\s+(.*)/m)
    if (h1Match) return h1Match[1].trim()

    return defaultName
  } catch (e) {
    return defaultName
  }
}

/**
 * 自动生成侧边栏的函数
 */
const getAutoSidebar = () => {
  const docsPath = path.resolve(process.cwd(), 'docs')
  let sidebar = []
  if (!fs.existsSync(docsPath)) return []
		const configMap = {
				'notes': false
			}
// 1. 【一级目录】显示名称映射 (硬盘名: 显示名)
  const displayNameMap = {
    'web': '🌐 网站相关',
    'sp': '💾 软件插件',
    'code': '🧩 代码片段',
    'notes': '📑 杂记'
  }

  // 2. 【二级目录】显示名称映射 (📌 后面显示的名字)
  const subDisplayNameMap = {
    'ym': '域名折腾',
    'ft': '框架主题'
    // 这里您可以继续增加...
  }

  // 3. 【排序配置】(数字越小越靠前)
  const orderMap = { 
    'web': 1, '🌐网站相关': 1,
    'sp': 2, '💾软件插件': 2,
    'code': 3, '🧩代码片段': 3,
    'notes': 999
  }

  const items = fs.readdirSync(docsPath)
  items.forEach(item => {
    const itemPath = path.join(docsPath, item)
    if (fs.statSync(itemPath).isDirectory() && !['.vitepress', 'public'].includes(item)) {
      const subItems = fs.readdirSync(itemPath)
      let folderItems = [], fileItems = []

      subItems.forEach(sub => {
        const subPath = path.join(itemPath, sub)
        const subStat = fs.statSync(subPath)
        if (subStat.isDirectory()) {
          const subFiles = fs.readdirSync(subPath).filter(f => f.endsWith('.md')).map(f => {
            const name = f.replace('.md', ''), title = getFileTitle(path.join(subPath, f), name)
            return { text: title, link: `/${item}/${sub}/${name}` }
          })
          if (subFiles.length > 0) {
            folderItems.push({ text: '📌 ' + (subDisplayNameMap[sub] || sub), collapsed: true, items: subFiles })
          }
        } else if (sub.endsWith('.md')) {
          const name = sub.replace('.md', ''), title = getFileTitle(subPath, name)
          fileItems.push({ text: title, link: `/${item}/${name}` })
        }
      })
      sidebar.push({ 
        text: displayNameMap[item] || item, 
        originalName: item, 
        // 如果 configMap 里对应的名字是 false，就展开，否则默认折叠
        collapsed: configMap[item] === false ? false : true, 
        items: [...folderItems, ...fileItems] 
      })
    }
  })
  sidebar.sort((a, b) => (orderMap[a.originalName] || 50) - (orderMap[b.originalName] || 50))
  return sidebar
}

export default withPwa(defineConfig({
  ignoreDeadLinks: true,
  markdown: { image: { lazyLoading: true } },
  cleanUrls: true,
  title: "江大爷",
  description: "江大爷的个人博客",
  
  head: [
    ['link', { rel: 'icon', href: '/favicon.ico' }],
    ['meta', { name: 'theme-color', content: '#ffffff' }],
    ['link', { rel: 'apple-touch-icon', href: '/logo.png' }],
  ],

  sitemap: { hostname: 'https://828111.xyz', lastmodDateOnly: false },

  // --- PWA 重新补齐 ---
  pwa: {
    registerType: 'autoUpdate',
    manifest: {
      name: '江大爷',
      short_name: '江大爷',
      description: '江大爷的个人博客',
      theme_color: '#ffffff',
      start_url: '/',
      display: 'standalone',
      background_color: '#ffffff',
      icons: [
        { src: '/pwa-192x192.png', sizes: '192x192', type: 'image/png' },
        { src: '/pwa-512x512.png', sizes: '512x512', type: 'image/png' }
      ]
    },
    workbox: {
      globPatterns: ['**/*.{js,css,html,png,svg,ico}'],
      navigateFallbackDenylist: [/^\/sitemap.xml$/]
    }
  },

  // --- 分享卡片逻辑补齐 ---
  transformPageData(pageData) {
    pageData.frontmatter.head ??= []
    const title = pageData.title || '江大爷'
    const description = pageData.frontmatter.description || '江大爷的个人博客'
    const canonicalUrl = `https://828111.xyz/${pageData.relativePath.replace('.md', '')}`
    let image = 'https://828111.xyz/logo.png' 
    if (pageData.content) {
      const imgMatch = pageData.content.match(/!\[.*?\]\((.*?)\)/) || pageData.content.match(/<img.*?src=['"](.*?)['"]/)
      if (imgMatch) image = imgMatch[1].startsWith('http') ? imgMatch[1] : `https://828111.xyz${imgMatch[1].startsWith('/') ? '' : '/'}${imgMatch[1]}`
    }
    pageData.frontmatter.head.push(
      ['meta', { property: 'og:type', content: 'article' }],
      ['meta', { property: 'og:title', content: title }],
      ['meta', { property: 'og:description', content: description }],
      ['meta', { property: 'og:image', content: image }],
      ['meta', { property: 'og:url', content: encodeURI(canonicalUrl) }],
      ['meta', { name: 'twitter:card', content: 'summary_large_image' }]
    )
  },

  themeConfig: {
    logo: '/logo.png',
    sidebarMenuLabel: '菜单',
    returnToTopLabel: '返回顶部',
    docFooter: { prev: '上一页', next: '下一页' },
    outline: { level: [2, 3], label: '本页目录' },
    
    nav: [
      { text: '🏠 首页', link: '/' },
      { text: '✨ 更多', items: [
        { text: '🖊️ 编辑', link: '/admin.html', target: '_blank' },
        { text: '🗺 站点地图', link: '/sitemap.xml' },
        { text: '👤 关于我', link: '/about' }
      ]}
    ],

    // --- 搜索框中文翻译补齐 ---
    search: {
      provider: 'local',
      options: {
        locales: {
          root: {
            translations: {
              button: { buttonText: '搜索文档', buttonAriaLabel: '搜索文档' },
              modal: { noResultsText: '无法找到相关结果', resetButtonTitle: '清除查询条件', footer: { selectText: '选择', navigateText: '切换', closeText: '关闭' } }
            }
          }
        }
      }
    },

    sidebar: getAutoSidebar()
  }
}))