import DefaultTheme from 'vitepress/theme'
import MyLayout from './MyLayout.vue'
import mediumZoom from 'medium-zoom' // 引入插件
import { onMounted, watch, nextTick } from 'vue'
import { useData, useRoute } from 'vitepress'
import './custom.css'

export default {
  extends: DefaultTheme,
  Layout: MyLayout,
  setup() {
    const route = useRoute()
    const initZoom = () => {
      // 这里的选择器是给正文里的图片加缩放
      mediumZoom('.vp-doc img', { background: 'var(--vp-c-bg)' })
    }
    onMounted(() => initZoom())
    watch(
      () => route.path,
      () => nextTick(() => initZoom()) // 切换路由时重新绑定
    )
  }
}