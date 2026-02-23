// .vitepress/configs/sidebar.mjs
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { getFileTitle } from './plugins.mjs'

const docsPath = path.resolve(process.cwd(), 'docs')

/**
 * ==========================================================
 * 🔧 老江的自定义排序配置
 * ==========================================================
 */
// 1. 顶栏主分类排序（从左到右）
const navOrder = ['🌐 网站相关', '💾 软件插件', '📑 杂记']

// 2. 侧边栏分类排序（如果您希望侧边栏也按某种顺序）
// const sidebarOrder = ['网站', '域名', '技术', '生活']
/** ========================================================== */

/**
 * 核心逻辑：生成顶栏
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

  // 基础菜单：首页永远在最左
  const nav = [{ text: '🏠 首页', link: '/' }]

  // 获取分类并排序
  const sortedCategories = Object.keys(navMap).sort((a, b) => {
    const indexA = navOrder.indexOf(a)
    const indexB = navOrder.indexOf(b)
    if (indexA === -1 && indexB === -1) return a.localeCompare(b)
    if (indexA === -1) return 1
    if (indexB === -1) return -1
    return indexA - indexB
  })
// 构建菜单项
  sortedCategories.forEach(main => {
    const subCates = Array.from(navMap[main])
    if (subCates.length > 0) {
      nav.push({
        text: main,
        items: subCates.map(sub => ({
          text: sub,
          link: `/?tag=${encodeURIComponent(sub)}&refresh=true`
        }))
      })
    } else {
      // 🌟 这里要把 sub 改成 main，因为这个分类没有子级
      nav.push({ text: main, link: `/?tag=${encodeURIComponent(main)}&refresh=true` })
    }
  })

  // 结尾菜单：“更多”永远在最后
  nav.push({
    text: '✨ 更多',
    items: [
      { text: '🔗 友联', link: '/links' },
						{ text: '🍉 合成水果', link: '/hecheng' },
      { text: '🗺️ 站点地图', link: '/sitemap.xml' },
      { text: '👤 关于我', link: '/about' }
    ]
  })

  return nav
}

/**
 * 侧边栏逻辑
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
          const cate = cateArray[cateArray.length - 1] 
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
  // 这里也进行了排序处理
  Object.keys(categoriesMap).forEach(cate => {
    const items = categoriesMap[cate].sort((a, b) => b.date - a.date)
    items.forEach(item => { 
      sidebar[item.link] = [{ text: `📂 更多 [${cate}]`, items }] 
    })
  })
  return sidebar
}