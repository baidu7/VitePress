import fs from 'fs'
import path from 'path'

// 自动生成带分类的侧边栏
const getAutoSidebar = () => {
  const docsPath = path.resolve(process.cwd(), 'docs')
  const sidebar = []
  
  if (!fs.existsSync(docsPath)) return []

  const items = fs.readdirSync(docsPath)

  items.forEach(item => {
    const itemPath = path.join(docsPath, item)
    const stat = fs.statSync(itemPath)

    if (stat.isDirectory() && item !== '.vitepress' && item !== 'public') {
      const files = fs.readdirSync(itemPath)
        .filter(file => file.endsWith('.md'))
        .map(file => {
          const name = file.replace('.md', '')
          // 【修复点】对包含中文或 Emoji 的路径进行编码，解决 Build 报错
          return { text: name, link: encodeURI(`/${item}/${name}`) }
        })

      if (files.length > 0) {
        sidebar.push({
          text: item, 
          collapsed: false,
          items: files
        })
      }
    }
  })
  
  const rootFiles = items
    .filter(file => file.endsWith('.md') && file !== 'index.md')
    .map(file => {
      const name = file.replace('.md', '')
      return { text: name, link: encodeURI(`/${name}`) }
    })
    
  if (rootFiles.length > 0) {
    sidebar.unshift({ text: '📑 杂记', items: rootFiles })
  }

  return sidebar
}

export default {
  // 顶层配置
  ignoreDeadLinks: true, 
  
  vite: {
    // 强制将视频后缀视为资源，解决 Rollup failed to resolve import 报错
    assetsInclude: ['**/*.webm', '**/*.mp4', '**/*.mov', '**/*.PNG', '**/*.JPG'], 
  },
  
  markdown: {
    image: {
      lazyLoading: true // 开启图片懒加载
    }
  },

  title: "江大爷博客",
  head: [
    ['link', { rel: 'icon', href: '/favicon.ico' }],
    ['link', { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' }],
    ['meta', { name: 'theme-color', content: '#3eaf7c' }],
  ],

  transformPageData(pageData) {
    const canonicalUrl = `https://vitepress-6k9.pages.dev/${pageData.relativePath.replace('.md', '.html')}`
    pageData.frontmatter.head ??= []
    pageData.frontmatter.head.push(
      ['meta', { property: 'og:title', content: pageData.title || '江大爷博客' }],
      ['meta', { property: 'og:url', content: encodeURI(canonicalUrl) }]
    )
  },

  sitemap: {
    hostname: 'https://vitepress-6k9.pages.dev' 
  },

  themeConfig: {
    logo: '/logo.png',
    socialLinks: [
      { icon: 'github', link: 'https://github.com/baidu8/VitePress' }
    ],
    
    nav: [
      { text: '🏠 首页', link: '/' },
      { text: '📜 归档', link: '/archives' },
      {
        text: '✨ 快捷功能',
        items: [
          { text: '📄 站点地图', link: '/sitemap.xml' },
          { text: '👤 关于我', link: '/about' }
        ]
      }
    ],

    outline: {
      level: [2, 3], 
      label: '本页目录'
    },
        
    search: { provider: 'local' },
    sidebar: getAutoSidebar(), 
  }
}