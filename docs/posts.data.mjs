import fs from 'fs'
import path from 'path'

export default {
  watch: ['../*.md', '../**/*.md'],
  load() {
    const dirPath = path.resolve(process.cwd(), 'docs')
    
    // 递归读取所有子文件夹下的 md 文件
    const getFiles = (dir) => {
      let results = []
      const list = fs.readdirSync(dir)
      list.forEach(file => {
        const fullPath = path.join(dir, file)
        const stat = fs.statSync(fullPath)
        // 排除 .vitepress 文件夹和 index.md
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
      // 将 Windows 路径的反斜杠 \ 统一替换为正斜杠 /
      const urlPath = relativePath.replace('.md', '').replace(/\\/g, '/')
      return { 
        text: name, 
        link: `/VitePress/${urlPath}` 
      }
    })
  }
}