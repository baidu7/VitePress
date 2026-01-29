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

    // 修复版：支持全屏切换且不影响 Build 打包
    const initFancybox = () => {
      // 检查是否在浏览器环境，防止 Build 报错
      if (typeof window !== 'undefined') {
        // 动态加载 CSS (解决报错的关键)
        if (!document.getElementById('fancybox-style')) {
          const link = document.createElement('link')
          link.id = 'fancybox-style'
          link.rel = 'stylesheet'
          link.href = 'https://cdn.jsdelivr.net/npm/@fancyapps/ui@5.0/dist/fancybox/fancybox.css'
          document.head.appendChild(link)
        }

        // 动态加载 JS 模块
        import('https://cdn.jsdelivr.net/npm/@fancyapps/ui@5.0/dist/fancybox/fancybox.esm.js').then(({ Fancybox }) => {
          // 清除旧绑定
          Fancybox.unbind(".vp-doc img");
          Fancybox.close();

          // 重新绑定文章内的所有图片
          Fancybox.bind(".vp-doc img", {
            groupAll: true, // 开启“下一张”功能
            compact: false,
            Image: { zoom: true },
            Toolbar: {
              display: {
                left: ["infobar"],
                middle: [],
                right: ["iterateZoom", "slideshow", "fullScreen", "download", "thumbs", "close"],
              },
            },
          });
        }).catch(err => console.error('Fancybox 加载失败:', err));
      }
    }

    onMounted(() => initFancybox())
    
    watch(
      () => route.path,
      () => nextTick(() => initFancybox())
    )
  }
}