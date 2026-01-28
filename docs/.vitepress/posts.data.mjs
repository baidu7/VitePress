import fs from 'fs'
import path from 'path'
import { globby } from 'globby' // 如果没安装这个，用下面的原生写法

export default {
  watch: ['../*.md', '../**/*.md'],
  async load() {
    const dirPath = path.resolve(process.cwd(), 'docs')
    // 递归读取所有子文件夹下的 md
    const getFiles = (dir) => {
      let results = []
      const list = fs.readdirSync(dir)
      list.forEach(file => {
        const fullPath = path.join(dir, file)
        const stat = fs.statSync(fullPath)
        if (stat && stat.isDirectory() && file !== '.vitepress') {
          results = results.concat(getFiles(fullPath))
        } else if (file.endsWith('.md') && file !== 'index.md') {
          results.push(fullPath)
        }
      })
      return results
    }

    return getFiles(dirPath).map(fullPath => {
      const relativePath = path.relative(dirPath, fullPath)
      const name = path.basename(relativePath, '.md')
      const urlPath = relativePath.replace('.md', '').replace(/\\/g, '/')
      return { text: name, link: `/VitePress/${urlPath}` }
    })
  }
}