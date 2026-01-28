import DefaultTheme from 'vitepress/theme'
import MyLayout from './MyLayout.vue'
import { onMounted, watch, nextTick } from 'vue'
import { useRoute } from 'vitepress'
import './custom.css'

export default {
  extends: DefaultTheme,
  Layout: MyLayout,
  setup() {
    const route = useRoute()
    
    // 自定义的轻量级看图逻辑
    const initZoom = () => {
      const images = document.querySelectorAll('.vp-doc img')
      images.forEach(img => {
        img.onclick = () => {
          // 创建一个全屏遮罩层
          const overlay = document.createElement('div')
          overlay.style = `
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(0,0,0,0.8); z-index: 10000;
            display: flex; align-items: center; justify-content: center;
            cursor: zoom-out; transition: opacity 0.3s;
          `
          const fullImg = document.createElement('img')
          fullImg.src = img.src
          fullImg.style = 'max-width: 90%; max-height: 90%; border-radius: 8px;'
          
          overlay.appendChild(fullImg)
          document.body.appendChild(overlay)
          
          // 点击遮罩关闭
          overlay.onclick = () => {
            overlay.style.opacity = '0'
            setTimeout(() => document.body.removeChild(overlay), 300)
          }
        }
      })
    }

    onMounted(() => initZoom())
    watch(() => route.path, () => nextTick(() => initZoom()))
  }
}