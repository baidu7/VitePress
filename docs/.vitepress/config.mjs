import fs from 'fs'
import path from 'path'

/**
 * 自动生成侧边栏的函数
 * 功能：支持二级目录，且文件夹永远排在普通文件前面
 */
const getAutoSidebar = () => {
  const docsPath = path.resolve(process.cwd(), 'docs')
  let sidebar = []
  
  if (!fs.existsSync(docsPath)) return []

  // 1. 定义一级大类的顺序和展开状态
  const orderMap = { '🌐网站相关': 1, '💾软件插件': 2, '🧩代码片段': 3, '🪄分享': 4, '📑 杂记': 999 }
  const configMap = { '🌐网站相关': false, '🪄分享': true, '🧩代码片段': true }

  const items = fs.readdirSync(docsPath)

  items.forEach(item => {
    const itemPath = path.join(docsPath, item)
    const stat = fs.statSync(itemPath)

    // 只处理 docs 下的一级文件夹
    if (stat.isDirectory() && item !== '.vitepress' && item !== 'public') {
      const subItems = fs.readdirSync(itemPath)
      
      let folderItems = [] // 专门装：二级文件夹（子分类）
      let fileItems = []   // 专门装：当前文件夹下的 MD 文件

      subItems.forEach(sub => {
        const subPath = path.join(itemPath, sub)
        const subStat = fs.statSync(subPath)

        if (subStat.isDirectory()) {
          // 如果是二级文件夹，抓取里面的 MD
          const subFiles = fs.readdirSync(subPath)
            .filter(f => f.endsWith('.md'))
            .map(f => {
              const name = f.replace('.md', '')
              return { text: name, link: `/${item}/${sub}/${name}` }
            })
          
          if (subFiles.length > 0) {
            folderItems.push({
              text: '📌 ' + sub,
              collapsed: true,
              items: subFiles
            })
          }
        } else if (sub.endsWith('.md')) {
          // 如果是普通文件
          const name = sub.replace('.md', '')
          fileItems.push({ text: name, link: `/${item}/${name}` })
        }
      })

      // 【核心逻辑】：将文件夹排在文件前面
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

  // 2. 对一级大类进行排序
  sidebar.sort((a, b) => (orderMap[a.text] || 50) - (orderMap[b.text] || 50))
  
  // 3. 处理根目录下的散篇 MD（即杂记）
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
		cleanUrls: true,
  title: "江大爷",
  description: "江大爷的个人博客",
  
  // 2. 网站头部
  head: [
    ['link', { rel: 'icon', href: '/favicon.ico' }],
    ['meta', { name: 'theme-color', content: '#3eaf7c' }],
  ],

  // 3. 站点地图 (必须在 export 第一层)
  sitemap: {
    hostname: 'https://828111.xyz/' 
  },

  transformPageData(pageData) {
      pageData.frontmatter.head ??= []
      
      // 【保险 1】先定义好变量，防止报错 "is not defined"
      const title = pageData.title || '江大爷'
      const description = pageData.frontmatter.description || '江大爷的个人博客'
      const canonicalUrl = `https://828111.xyz/${pageData.relativePath.replace('.md', '.html')}`
  
      // --- 升级版：全能抓图逻辑（支持 MD 和 HTML 格式） ---
          let image = 'https://828111.xyz/logo.png' 
          
          if (pageData.content) {
            // 1. 先尝试找 Markdown 格式的图: ![alt](url)
            const mdMatch = pageData.content.match(/!\[.*?\]\((.*?)\)/)
            // 2. 再尝试找 HTML 格式的图: <img src="url" ...>
            const htmlMatch = pageData.content.match(/<img.*?src=['"](.*?)['"]/)
      
            // 谁先出现就抓谁（或者优先抓 MD 格式）
            const firstImg = (mdMatch ? mdMatch[1] : null) || (htmlMatch ? htmlMatch[1] : null)
      
            if (firstImg) {
              image = firstImg.startsWith('http') 
                ? firstImg 
                : `https://baidu8.indevs.in${firstImg.startsWith('/') ? '' : '/'}${firstImg}`
            }
          }
      // ----------------------------------------------
  
      // 塞入社交媒体分享卡片
      pageData.frontmatter.head.push(
        ['meta', { property: 'og:type', content: 'article' }],
        ['meta', { property: 'og:title', content: title }],
        ['meta', { property: 'og:description', content: description }],
        ['meta', { property: 'og:image', content: image }],
        ['meta', { property: 'og:url', content: encodeURI(canonicalUrl) }],
        ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
        ['meta', { name: 'twitter:image', content: image }],
        ['meta', { itemprop: 'image', content: image }]
      )
  
      // SEO 关键词自动化
      if (pageData.frontmatter.tags) {
        const keywordsStr = Array.isArray(pageData.frontmatter.tags) 
          ? pageData.frontmatter.tags.join(', ') 
          : pageData.frontmatter.tags
        pageData.frontmatter.head.push(['meta', { name: 'keywords', content: keywordsStr }])
      }
    },

  // 5. 主题配置 (所有的 UI 界面设置都在这里)
  themeConfig: {
    logo: '/logo.png',
    sidebarMenuLabel: '菜单',
    returnToTopLabel: '返回顶部',
    docFooter: { prev: '上一页', next: '下一页' },

    // socialLinks: [
    //   { icon: 'github', link: 'https://github.com/baidu8/' }
    // ],
    
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
}