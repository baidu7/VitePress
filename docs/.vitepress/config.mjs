import fs from 'fs'
import path from 'path'
const getAutoSidebar = () => {
  const docsPath = path.resolve(process.cwd(), 'docs')
  let sidebar = []
  
  if (!fs.existsSync(docsPath)) return []

  // 1. 定义排序权重：数值越小越靠前
  const orderMap = {
    '🪄分享': 1,
    '🧩代码片段': 2,
    // 其他文件夹如果没有定义，默认排在中间
    '📑 杂记': 999  // 确保杂记永远在最后
  }
const configMap = {
  '🪄分享': false,    // false 代表展开
  '🧩代码片段': true, // true 代表折叠
}
  const items = fs.readdirSync(docsPath)

  // 处理文件夹分类
  items.forEach(item => {
    const itemPath = path.join(docsPath, item)
    const stat = fs.statSync(itemPath)

    if (stat.isDirectory() && item !== '.vitepress' && item !== 'public') {
      const files = fs.readdirSync(itemPath)
        .filter(file => file.endsWith('.md'))
        .map(file => {
          const name = file.replace('.md', '')
          return { text: name, link: encodeURI(`/${item}/${name}`) }
        })

      if (files.length > 0) {
              sidebar.push({
                text: item, 
                // 这里你刚才少了一个逗号！
                collapsed: configMap[item] !== undefined ? configMap[item] : true, 
                items: files
              })
            }
    }
  })

  // 2. 对已经生成的文件夹列表进行排序
  sidebar.sort((a, b) => {
    const orderA = orderMap[a.text] || 50; // 默认给个中间值 50
    const orderB = orderMap[b.text] || 50;
    return orderA - orderB;
  })
  
  // 处理根目录下的杂记文件
  const rootFiles = items
    .filter(file => file.endsWith('.md') && file !== 'index.md')
    .map(file => {
      const name = file.replace('.md', '')
      return { text: name, link: encodeURI(`/${name}`) }
    })
    
  if (rootFiles.length > 0) {
    // 3. 将杂记作为最后一个对象 push 进去
    sidebar.push({ 
      text: '📑 杂记', 
      collapsed: true, // 建议杂记默认折叠，让侧边栏更干净
      items: rootFiles 
    })
  }

  return sidebar
}

export default {
  // 顶层配置
  ignoreDeadLinks: true, 
  markdown: {
    image: {
      lazyLoading: true // 开启图片懒加载
    }
  },

  title: "江大爷",
  head: [
    ['link', { rel: 'icon', href: '/favicon.ico' }],
    ['link', { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' }],
    ['meta', { name: 'theme-color', content: '#3eaf7c' }],
  ],

  transformPageData(pageData) {
    const canonicalUrl = `https://vitepress-6k9.pages.dev/${pageData.relativePath.replace('.md', '.html')}`
    pageData.frontmatter.head ??= []
    pageData.frontmatter.head.push(
      ['meta', { property: 'og:title', content: pageData.title || '江大爷' }],
      ['meta', { property: 'og:url', content: encodeURI(canonicalUrl) }]
    )
  },

  sitemap: {
    hostname: 'https://vitepress-6k9.pages.dev' 
  },

  themeConfig: {
    logo: '/logo.png',
    socialLinks: [
      { icon: 'github', link: 'https://github.com/baidu8/' }
    ],
    
    nav: [
      { text: '🏠 首页', link: '/' },
      { text: '📜 归档', link: '/archives' },
      {
        text: '✨ 快捷功能',
        items: [
									 { text: '🖊️编辑', link: '/admin.html', target: '_blank' },
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