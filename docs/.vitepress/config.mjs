import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// 自动读取 docs 目录下的 md 文件
const getArticles = () => {
  // 路径指向 docs 根目录
  const dirPath = path.resolve(__dirname, '../../')
  const files = fs.readdirSync(dirPath)
  return files
    .filter(file => file.endsWith('.md') && file !== 'index.md')
    .map(file => {
      const name = file.replace('.md', '') // 修正：这里必须用英文 replace
      return { text: name, link: `/${name}` }
    })
}

export default {
  base: '/VitePress/', 
  title: "江大爷博客",
  description: "梦到什么说什么",
  themeConfig: {
    nav: [
      { text: '首页', link: '/' },
      { text: '文章归档', link: getArticles()[0]?.link || '/' }
    ],
    sidebar: [
      {
        text: '📖 我的所有文章',
        items: getArticles() 
      }
    ],
    socialLinks: [
      { icon: 'github', link: 'https://github.com/baidu8' }
    ]
  }
}
