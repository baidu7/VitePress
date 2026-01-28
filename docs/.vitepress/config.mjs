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
  // 💡 这里的 head 保持通用配置
  head: [
    // 1. 标准 Favicon
    ['link', { rel: 'icon', href: '/favicon.ico' }],
    
    // 2. 苹果 iOS 图标 (添加到主屏幕时的样式)
    ['link', { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' }],
    
    // 3. Android / Chrome 移动端浏览器颜色
    ['meta', { name: 'theme-color', content: '#3eaf7c' }],
    
    // 4. 社交分享 (OG 标签) 的标题自动生成
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:image', content: 'https://vitepress-6k9.pages.dev/og-image.png' }],
  ],

  // 🪄 自动生成逻辑：为每篇文章动态注入分享标签
  transformPageData(pageData) {
    const canonicalUrl = `https://vitepress-6k9.pages.dev/${pageData.relativePath.replace('.md', '.html')}`
    pageData.frontmatter.head ??= []
    pageData.frontmatter.head.push(
      ['meta', { property: 'og:title', content: pageData.title || '江大爷博客' }],
      ['meta', { property: 'og:description', content: pageData.description || '点击查看精彩内容' }],
      ['meta', { property: 'og:url', content: canonicalUrl }],
      // 如果没有给单篇文章设置封面图，则统一使用 public 下的 og-image.png
      ['meta', { property: 'og:image', content: 'https://vitepress-6k9.pages.dev/og-image.png' }]
    )
  },

  themeConfig: {
    logo: '/logo.png',
    search: { provider: 'local' },
    sidebar: getAutoSidebar(), // 沿用你的全自动分类
  }
}