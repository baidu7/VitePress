// .vitepress/configs/plugins.mjs
import fs from 'fs'

/**
 * 智能获取文章标题
 */
export const getFileTitle = (filePath, defaultName) => {
  try {
    const content = fs.readFileSync(filePath, 'utf-8')
    const titleMatch = content.match(/^title:\s*(.*?)\s*$/m)
    if (titleMatch && titleMatch[1]) return titleMatch[1].replace(/['"]/g, '').trim()
    const h1Match = content.match(/^#\s+(.*)/m)
    if (h1Match) return h1Match[1].trim()
    return defaultName
  } catch { return defaultName }
}

/**
 * 分享卡片 SEO 逻辑
 */
export const transformPageData = (pageData) => {
  pageData.frontmatter.head ??= []
  
  const title = pageData.frontmatter.title || pageData.title || '江大爷'
  const description = pageData.frontmatter.description || '江大爷的个人博客'
  const canonicalUrl = `https://828111.xyz/${pageData.relativePath.replace('.md', '')}`
  
  // 1. 默认封面图
  let image = 'https://828111.xyz/logo.png' 

  // 2. 【核心逻辑】直接读取元数据里的 cover 字段
  // VitePress 会自动把 frontmatter 里的内容放在 pageData.frontmatter 对象里
  if (pageData.frontmatter.cover) {
    const rawCover = pageData.frontmatter.cover
    
    // 如果是网络图片，直接用；如果是本地路径，补齐域名
    if (rawCover.startsWith('http')) {
      image = rawCover
    } else {
      const cleanImg = rawCover.startsWith('/') ? rawCover : `/${rawCover}`
      image = `https://828111.xyz${cleanImg}`
    }
    console.log(`[SEO 插件] 已成功为页面加载封面图: ${image}`)
  } else {
    // 如果没有 cover，您可以选择是否继续尝试从正文抓，
    // 或者干脆就用默认 logo，这样最稳，不容易报错。
    console.log(`[SEO 插件] 页面无 cover 字段，使用默认 Logo: ${pageData.relativePath}`)
  }

  // 把元数据塞进 head
  pageData.frontmatter.head.push(
    ['meta', { name: 'baidu-site-verification', content: 'codeva-sPPB7tmo0c' }],
    ['meta', { property: 'og:type', content: 'article' }],
    ['meta', { property: 'og:title', content: title }],
    ['meta', { property: 'og:description', content: description }],
    ['meta', { property: 'og:image', content: image }],
    ['meta', { property: 'og:url', content: encodeURI(canonicalUrl) }],
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }]
  )
}