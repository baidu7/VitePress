import { createContentLoader } from 'vitepress'
import fs from 'node:fs'
import path from 'node:path'

// --- 1. 本地图库扫描逻辑 ---
let defaultCovers = []
const getLocalCovers = () => {
  if (defaultCovers.length > 0) return defaultCovers
  
  // 指向您的图片文件夹：public/default-covers
  const coversDir = path.resolve(process.cwd(), 'docs/public/default-covers')
  
  if (fs.existsSync(coversDir)) {
    defaultCovers = fs.readdirSync(coversDir)
      .filter(file => /\.(webp|png|jpg|jpeg|gif|svg)$/i.test(file))
      .map(file => `/default-covers/${file}`) // 转换为 web 访问路径
  }
  return defaultCovers
}

export default createContentLoader('**/*.md', {
  transform(raw) {
    const localCovers = getLocalCovers()

    return raw
      .filter(page => {
        const isIndex = page.url === '/' || page.url.endsWith('/') || page.url.includes('index.html')
        const isExclude = ['/admin', '/links', '/about'].some(path => page.url.includes(path))
        return !isIndex && !isExclude
      })
      .map(page => {
        const front = page.frontmatter
        
        // --- 2. 分类处理 ---
        const rawCate = front.category || ''
        const cateArray = Array.isArray(rawCate) ? rawCate : (rawCate ? [rawCate] : [])
        // --- 3. 标签大清洗 ---
        const rawTags = front.tags || []
        // 第一步：确保 tags 也是个数组
        const initialTags = Array.isArray(rawTags) ? rawTags : [rawTags]
								// 第二步：额外保险 —— 排除掉所有在 category 数组里出现过的词
								const combinedTags = initialTags.filter(tag => {
								          if (!tag) return false
								          const cleanTag = tag.trim()
								          
								          // 检查这个标签是否与分类数组里的任何一项“撞车”
								          return !cateArray.some(cate => {
								            const cleanCate = cate.trim()
								            // 只要分类包含标签（如 "🌐 网站相关" 包含 "网站相关"）
								            // 或者标签包含分类
								            return cleanCate.includes(cleanTag) || cleanTag.includes(cleanCate)
								          })
								        })
								
        // --- 4. 随机图保底逻辑 ---
        let finalCover = front.cover
        if (!finalCover && localCovers.length > 0) {
          // 使用 url 的长度和字符编码生成固定随机数，保证每篇文章配图固定
          const hash = page.url.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
          finalCover = localCovers[hash % localCovers.length]
        } else if (!finalCover) {
          // 如果本地文件夹没图，用您之前的那个 GitHub 链接保底
          finalCover = 'https://github.com/user-attachments/assets/6fc9bc33-9998-48f6-b1b9-cce7e0e05656'
        }

        return {
          title: front.title || '无题',
          url: page.url,
          cover: finalCover,
          date: formatDate(front.date),
          description: front.description || '点击阅读全文...',
          // 显示数组最后一个细分分类
          category: cateArray.length > 0 ? cateArray[cateArray.length - 1] : '', 
          tags: combinedTags 
        }
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  }
})

function formatDate(raw) {
  const date = raw ? new Date(raw) : new Date()
  if (isNaN(date.getTime())) return '2026年02月08日'
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  return `${year}年${month}月${day}日`
}