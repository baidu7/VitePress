import fs from 'fs'
import path from 'path'

export default {
  watch: ['../*.md'],
  load() {
    const dirPath = path.resolve(__dirname, '../../')
    return fs.readdirSync(dirPath)
      .filter(file => file.endsWith('.md') && file !== 'index.md')
      .map(file => {
        const name = file.replace('.md', '')
        // 注意：这里需要根据你的 base 路径调整
        return { text: name, link: `/VitePress/${name}` }
      })
  }
}