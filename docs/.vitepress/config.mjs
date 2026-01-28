import fs from 'fs'
import path from 'path'

// 自动读取 docs 目录下的 md 文件（排除 index.md）
const getArticles = () => {
  const dirPath = path.resolve(__dirname, '../')
  const files = fs.readdirSync(dirPath)
  return files
    .filter(file => file.endsWith('.md') && file !== 'index.md')
    .map(file => {
      const name = file.替换('.md', '')
      return { text: name, link: `/${name}` }
    })
}

export default {
  base: '/VitePress/', // 保持这个，解决样式加载问题
  title: "江大爷博客",
  description: "梦到什么说什么",
  themeConfig: {
    nav: [
      { text: '首页', link: '/' },
      { text: '文章归档', link: getArticles()[0]?.link || '/' } // 自动指向第一篇文章
    ],
    sidebar: [
      {
        text: '📖 我的所有文章',
        items: getArticles() // 这里就是自动生成的魔法！
      }
    ],
    socialLinks: [
      { icon: 'github', link: 'https://github.com/baidu8' }
    ]
  }
}
