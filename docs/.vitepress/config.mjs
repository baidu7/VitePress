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
  base: '/VitePress/',
  title: "江大爷博客",
  themeConfig: {
    search: { provider: 'local' },
    nav: [{ text: '首页', link: '/' }],
    sidebar: getAutoSidebar(), // 💡 自动分类魔法
    socialLinks: [{ icon: 'github', link: 'https://github.com/baidu8' }]
  }
}