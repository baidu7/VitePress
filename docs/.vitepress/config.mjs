import fs from 'fs'
import path from 'path'

/**
 * 自动生成侧边栏的函数
 */
const getAutoSidebar = () => {
  const docsPath = path.resolve(process.cwd(), 'docs')
  let sidebar = []
  
  if (!fs.existsSync(docsPath)) return []

  const orderMap = { '🪄分享': 1, '🧩代码片段': 2, '📑 杂记': 999 }
  const configMap = { '🪄分享': false, '🧩代码片段': true }

  const items = fs.readdirSync(docsPath)

  items.forEach(item => {
    const itemPath = path.join(docsPath, item)
    const stat = fs.statSync(itemPath)

    if (stat.isDirectory() && item !== '.vitepress' && item !== 'public') {
      const files = fs.readdirSync(itemPath)
        .filter(file => file.endsWith('.md'))
        .map(file => {
          const name = file.replace('.md', '')
          return { text: name, link: `/${item}/${name}` }
        })

      if (files.length > 0) {
        sidebar.push({
          text: item, 
          collapsed: configMap[item] !== undefined ? configMap[item] : true, 
          items: files
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

export default {
  // 1. 基础配置
  ignoreDeadLinks: true,
  markdown: { image: { lazyLoading: true } },
  title: "江大爷",
  description: "江大爷的个人博客",
  
  // 2. 网站头部
  head: [
    ['link', { rel: 'icon', href: '/favicon.ico' }],
    ['meta', { name: 'theme-color', content: '#3eaf7c' }],
  ],

  // 3. 站点地图 (必须在 export 第一层)
  sitemap: {
    hostname: 'https://baidu8.indevs.in/' 
  },

  // 4. 自动化处理 (SEO & Tags)
  transformPageData(pageData) {
    pageData.frontmatter.head ??= []
    const canonicalUrl = `https://baidu8.indevs.in/${pageData.relativePath.replace('.md', '.html')}`
    // --- 核心逻辑：自动抓取第一张图 ---
        // --- 安全的自动抓图逻辑 ---
            let image = 'https://baidu8.indevs.in/logo.png' 
            
            // 加个安全锁：只有当页面有内容时才去 match
            if (pageData.content) {
              const imgMatch = pageData.content.match(/!\[.*?\]\((.*?)\)/)
              if (imgMatch && imgMatch[1]) {
                const firstImg = imgMatch[1]
                image = firstImg.startsWith('http') 
                  ? firstImg 
                  : `https://baidu8.indevs.in${firstImg.startsWith('/') ? '' : '/'}${firstImg}`
              }
            }
    // --------------------------------
    // OG 标签
    pageData.frontmatter.head.push(
          // 通用分享标准
          ['meta', { property: 'og:type', content: 'article' }],
          ['meta', { property: 'og:title', content: title }],
          ['meta', { property: 'og:description', content: description }],
          ['meta', { property: 'og:image', content: image }],
          ['meta', { property: 'og:url', content: encodeURI(canonicalUrl) }],
          
          // Twitter 大图卡片
          ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
          ['meta', { name: 'twitter:image', content: image }],
    
          // 微信/移动端优化
          ['meta', { itemprop: 'image', content: image }]
        )

    // Tags 自动转 Keywords
    if (pageData.frontmatter.tags) {
      const tags = pageData.frontmatter.tags
      const keywordsStr = Array.isArray(tags) ? tags.join(', ') : tags
      pageData.frontmatter.head.push(['meta', { name: 'keywords', content: keywordsStr }])
    }
  },

  // 5. 主题配置 (所有的 UI 界面设置都在这里)
  themeConfig: {
    logo: '/logo.png',
    sidebarMenuLabel: '菜单',
    returnToTopLabel: '返回顶部',
    docFooter: { prev: '上一页', next: '下一页' },
    lastUpdatedText: '最后更新于',

    socialLinks: [
      { icon: 'github', link: 'https://github.com/baidu8/' }
    ],
    
    nav: [
      { text: '🏠 首页', link: '/' },
      {
        text: '✨ 更多',
        items: [
          { text: '🖊️ 编辑', link: '/admin.html', target: '_blank' },
          { text: '📜 归档', link: '/archives' },
          { text: '📄 站点地图', link: '/sitemap.xml' },
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
}