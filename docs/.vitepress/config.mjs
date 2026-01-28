import fs from 'fs'
import path from 'path'

// 自动生成带分类的侧边栏
const getAutoSidebar = () => {
  const docsPath = path.resolve(process.cwd(), 'docs')
  const sidebar = []
  
  // 读取 docs 下的所有内容
  const items = fs.readdirSync(docsPath)

  items.forEach(item => {
    const itemPath = path.join(docsPath, item)
    const stat = fs.statSync(itemPath)

    // 如果是文件夹（且不是 .vitepress），就把它当做一个分类
    if (stat.isDirectory() && item !== '.vitepress' && item !== 'public') {
      const files = fs.readdirSync(itemPath)
        .filter(file => file.endsWith('.md'))
        .map(file => {
          const name = file.replace('.md', '')
          return { text: name, link: `/${item}/${name}` }
        })

      if (files.length > 0) {
        sidebar.push({
          text: item, // 文件夹名就是分类名
          collapsed: false,
          items: files
        })
      }
    }
  })
  
  // 最后把根目录下的零散 md 文件也加进去
  const rootFiles = items
    .filter(file => file.endsWith('.md') && file !== 'index.md')
    .map(file => {
      const name = file.replace('.md', '')
      return { text: name, link: `/${name}` }
    })
    
  if (rootFiles.length > 0) {
    sidebar.unshift({ text: '📑 杂记', items: rootFiles })
  }

  return sidebar
}

export default {
  title: "江大爷博客",
  head: [
    ['link', { rel: 'icon', href: '/favicon.ico' }],
    ['link', { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' }],
    ['meta', { name: 'theme-color', content: '#3eaf7c' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:image', content: 'https://vitepress-6k9.pages.dev/og-image.png' }],
  ],

  transformPageData(pageData) {
    const canonicalUrl = `https://vitepress-6k9.pages.dev/${pageData.relativePath.replace('.md', '.html')}`
    pageData.frontmatter.head ??= []
    pageData.frontmatter.head.push(
      ['meta', { property: 'og:title', content: pageData.title || '江大爷博客' }],
      ['meta', { property: 'og:description', content: pageData.description || '点击查看精彩内容' }],
      ['meta', { property: 'og:url', content: canonicalUrl }],
      ['meta', { property: 'og:image', content: 'https://vitepress-6k9.pages.dev/og-image.png' }]
    )
  },
				ignoreDeadLinks: true,
				vite: {
				    assetsInclude: ['**/*.webm', '**/*.mp4'], // 告诉编译器：这些是文件，别当成代码解析
				  }
				markdown: {
				    image: {
				      // 启用图片懒加载
				      lazyLoading: true
				    }
				  },

  // 1. Sitemap 必须放在这里，且前面要有逗号
  sitemap: {
    hostname: 'https://vitepress-6k9.pages.dev' 
  },

  themeConfig: {
    logo: '/logo.png',
    // 2. 社交图标
    socialLinks: [
      { icon: 'github', link: 'https://github.com/baidu8/VitePress' }
    ],
    
    // 3. 导航栏 (修正了 sitemap 的小点)
    nav: [
      { text: '🏠 首页', link: '/' },
      { text: '📜 归档', link: '/archives' },
      {
        text: '✨ 快捷功能',
        items: [
          { text: '📄 站点地图', link: '/sitemap.xml' }, // 这里改成了点
          { text: '👤 关于我', link: '/about' }
        ]
      }
    ],

    // 4. 右侧边栏
    outline: {
      level: [2, 3], 
      label: '本页目录'
    },
				
    search: { provider: 'local' },
    sidebar: getAutoSidebar(), 
  }
}