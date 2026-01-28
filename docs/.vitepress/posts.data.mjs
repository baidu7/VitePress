import fs from 'fs'
import path from 'path'

export default {
  watch: ['../*.md'],
  load() {
    const dirPath = path.resolve(process.cwd(), 'docs')
    return fs.readdirSync(dirPath)
      .filter(file => file.endsWith('.md') && file !== 'index.md')
      .map(file => {
        const name = file.replace('.md', '')
        return {
          text: name,
          // 这里的链接要加上你的仓库名 base 路径
          link: `/VitePress/${name}`
        }
      })
  }
}