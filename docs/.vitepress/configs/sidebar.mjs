// .vitepress/configs/sidebar.mjs
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { getFileTitle } from './plugins.mjs'

const docsPath = path.resolve(process.cwd(), 'docs')

/**
 * 核心逻辑：基于 Frontmatter 的 category 数组生成顶栏
 * 逻辑：category: ['网站', '域名'] -> 顶栏显示“网站”，下拉显示“域名”
 */
export const getAutoNav = () => {
  const navMap = {}
  
  const scanFiles = (dir) => {
    if (!fs.existsSync(dir)) return
    const files = fs.readdirSync(dir)
    files.forEach(file => {
      const fullPath = path.join(dir, file)
      if (fs.statSync(fullPath).isDirectory() && !['.vitepress', 'public', 'node_modules'].includes(file)) {
        scanFiles(fullPath)
      } else if (file.endsWith('.md') && !['index.md', 'about.md', 'admin.md'].includes(file)) {
        const { data } = matter(fs.readFileSync(fullPath, 'utf-8'))
        
        // 模仿 posts.data.mjs 的处理方式
        if (data.category) {
          const cateArray = Array.isArray(data.category) ? data.category : [data.category]
          const [mainCate, subCate] = cateArray
          
          if (!navMap[mainCate]) navMap[mainCate] = new Set()
          if (subCate) navMap[mainCate].add(subCate)
        }
      }
    })
  }

  scanFiles(docsPath)

  const nav = [{ text: '🏠 首页', link: '/' }]

  Object.keys(navMap).forEach(main => {
    const subCates = Array.from(navMap[main])
    if (subCates.length > 0) {
      nav.push({
        text: main,
        items: subCates.map(sub => ({
          text: sub,
          // 统一跳转逻辑，链接到分类聚合（或者根据您的路由习惯改）
          link: `/?tag=${encodeURIComponent(sub)}` 
        }))
      })
    } else {
      nav.push({ text: main, link: `/?tag=${encodeURIComponent(main)}` })
    }
  })

  nav.push({
      text: '✨ 更多',
      items: [
        { text: '🖊️ 编辑', link: '/admin.html', target: '_blank' },
        { text: '🗺️ 站点地图', link: '/sitemap.xml' },
        { text: '👤 关于我', link: '/about' }
      ]
    })
  return nav
}

/**
 * 侧边栏逻辑：也要按这个“细分分类”来聚合
 */
export const getCategorySidebar = () => {
  const categoriesMap = {}
  const scanFiles = (dir) => {
    if (!fs.existsSync(dir)) return
    const files = fs.readdirSync(dir)
    files.forEach(file => {
      const fullPath = path.join(dir, file)
      if (fs.statSync(fullPath).isDirectory() && !['.vitepress', 'public', 'node_modules'].includes(file)) {
        scanFiles(fullPath)
      } else if (file.endsWith('.md') && !['index.md'].includes(file)) {
        const { data } = matter(fs.readFileSync(fullPath, 'utf-8'))
        if (data.category) {
          const cateArray = Array.isArray(data.category) ? data.category : [data.category]
          const cate = cateArray[cateArray.length - 1] // 取最细分的那个
          
          if (!categoriesMap[cate]) categoriesMap[cate] = []
          
          const link = '/' + path.relative(docsPath, fullPath).replace(/\\/g, '/').replace('.md', '')
          categoriesMap[cate].push({ 
            text: data.title || getFileTitle(fullPath, file), 
            link, 
            date: data.date ? new Date(data.date) : new Date(0) 
          })
        }
      }
    })
  }
  scanFiles(docsPath)
  
  const sidebar = {}
  Object.keys(categoriesMap).forEach(cate => {
    const items = categoriesMap[cate].sort((a, b) => b.date - a.date)
    items.forEach(item => { sidebar[item.link] = [{ text: `📂 更多 [${cate}]`, items }] })
  })
  return sidebar
}