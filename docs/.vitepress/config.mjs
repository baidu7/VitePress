import fs from 'fs'
import path from 'path'

/**
 * 自动生成侧边栏的函数
 */
const getAutoSidebar = () => {
  const docsPath = path.resolve(process.cwd(), 'docs')
  let sidebar = []
  
  if (!fs.existsSync(docsPath)) return []

  // 1. 文件夹显示优先级（权重越小越靠前）
  const orderMap = {
    '🪄分享': 1,
    '🧩代码片段': 2,
    '📑 杂记': 999 
  }

  // 2. 控制文件夹默认是否展开（false 为展开，true 为折叠）
  const configMap = {
    '🪄分享': false,    
    '🧩代码片段': true, 
  }

  const items = fs.readdirSync(docsPath)

  // 遍历 docs 文件夹处理子目录
  items.forEach(item => {
    const itemPath = path.join(docsPath, item)
    const stat = fs.statSync(itemPath)

    // 只处理文件夹，排除掉 .vitepress 和 public
    if (stat.isDirectory() && item !== '.vitepress' && item !== 'public') {
      const files = fs.readdirSync(itemPath)
        .filter(file => file.endsWith('.md'))
        .map(file => {
          const name = file.replace('.md', '')
          // 【关键修复】去掉 encodeURI，保持路径原始状态，确保搜索功能能识别
          return { text: name, link: `/${item}/${name}` }
        })

      if (files.length > 0) {
        sidebar.push({
          text: item, 
          // 根据上面的 configMap 判断是否折叠，没定义的默认折叠
          collapsed: configMap[item] !== undefined ? configMap[item] : true, 
          items: files
        })
      }
    }
  })

  // 排序：让“分享”排在前面，“杂记”排在最后
  sidebar.sort((a, b) => {
    const orderA = orderMap[a.text] || 50;
    const orderB = orderMap[b.text] || 50;
    return orderA - orderB;
  })
  
  // 处理根目录（docs/ 下直接存放）的 md 文件，归类到“杂记”
  const rootFiles = items
    .filter(file => file.endsWith('.md') && file !== 'index.md' && file !== 'admin.md')
    .map(file => {
      const name = file.replace('.md', '')
      return { text: name, link: `/${name}` }
    })
    
  if (rootFiles.length > 0) {
    sidebar.push({ 
      text: '📑 杂记', 
      collapsed: true,
      items: rootFiles 
    })
  }

  return sidebar
}

export default {
  // 基础配置
  ignoreDeadLinks: true, // 忽略死链接报错，防止构建中断
  markdown: {
    image: {
      lazyLoading: true // 图片懒加载，提高访问速度
    }
  },

  title: "江大爷",
  description: "江大爷的个人博客",
  
  // 网站头部标签
  head: [
    ['link', { rel: 'icon', href: '/favicon.ico' }],
    ['meta', { name: 'theme-color', content: '#3eaf7c' }],
  ],

  // 自动为每个页面添加社交媒体分享元标签（SEO 优化）
  transformPageData(pageData) {
    const canonicalUrl = `https://vitepress-6k9.pages.dev/${pageData.relativePath.replace('.md', '.html')}`
    pageData.frontmatter.head ??= []
    pageData.frontmatter.head.push(
      ['meta', { property: 'og:title', content: pageData.title || '江大爷' }],
      ['meta', { property: 'og:url', content: encodeURI(canonicalUrl) }]
    )
  },

  // 站点地图配置，利于搜索引擎收录
  sitemap: {
    hostname: 'https://vitepress-6k9.pages.dev' 
  },

  themeConfig: {
    logo: '/logo.png',
    
    // 右上角 GitHub 链接
    socialLinks: [
      { icon: 'github', link: 'https://github.com/baidu8/' }
    ],
    
    // 顶部导航栏
    nav: [
      { text: '🏠 首页', link: '/' },
      { text: '📜 归档', link: '/archives' },
      {
        text: '✨ 快捷功能',
        items: [
          { text: '🖊️ 编辑', link: '/admin.html', target: '_blank' },
          { text: '📄 站点地图', link: '/sitemap.xml' },
          { text: '👤 关于我', link: '/about' }
        ]
      }
    ],

    // 文章内的右侧目录配置
    outline: {
      level: [2, 3], 
      label: '本页目录'
    },
    
    // 【关键】本地搜索配置 + 界面汉化
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

    // 侧边栏：使用上面定义的自动生成函数
    sidebar: getAutoSidebar(), 
  }
}