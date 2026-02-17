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
  
  // 找文章里的第一张图作为封面，没图就用 Logo
  let image = 'https://828111.xyz/logo.png' 
  if (pageData.content) {
    const imgMatch = pageData.content.match(/!\[.*?\]\((.*?)\)/) || pageData.content.match(/<img.*?src=['"](.*?)['"]/)
    if (imgMatch) image = imgMatch[1].startsWith('http') ? imgMatch[1] : `https://828111.xyz${imgMatch[1].startsWith('/') ? '' : '/'}${imgMatch[1]}`
  }

  // 把元数据塞进 head
  pageData.frontmatter.head.push(
    ['meta', { name: 'wlhlauth', content: 'd3f1bc58c0daecdc337dc84a483b47fd' }],
    ['meta', { property: 'og:type', content: 'article' }],
    ['meta', { property: 'og:title', content: title }],
    ['meta', { property: 'og:description', content: description }],
    ['meta', { property: 'og:image', content: image }],
    ['meta', { property: 'og:url', content: encodeURI(canonicalUrl) }],
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }]
  )
}