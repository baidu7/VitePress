import DefaultTheme from 'vitepress/theme'
import MyLayout from './MyLayout.vue'
import { onMounted, watch, nextTick } from 'vue'
import { useRoute } from 'vitepress'
// 引入 Fancybox 样式（直接引用 CDN，省去安装麻烦）
import 'https://cdn.jsdelivr.net/npm/@fancyapps/ui@5.0/dist/fancybox/fancybox.css'
import './custom.css'

export default {
  extends: DefaultTheme,
  Layout: MyLayout,
  setup() {
    const route = useRoute()

    // 整合后的看图逻辑：支持全屏、左右切换、手势缩放
    const initFancybox = () => {
      // 只有在浏览器环境下运行
      if (typeof window !== 'undefined') {
        // 动态引入 JS 模块，保证兼容性
        import('https://cdn.jsdelivr.net/npm/@fancyapps/ui@5.0/dist/fancybox/fancybox.esm.js').then(({ Fancybox }) => {
          
          // 在重新绑定前先销毁旧实例，防止重复绑定导致翻页混乱
          Fancybox.unbind(".vp-doc img");
          Fancybox.close();

          // 绑定所有文章内的图片
          Fancybox.bind(".vp-doc img", {
            groupAll: true, // 关键：将页面内所有图片连成画廊，支持下一张切换
            compact: false, // 手机端不压缩 UI
            dragToClose: true, // 向下滑动关闭
            Image: {
              zoom: true, // 支持点击放大
            },
            Toolbar: {
              display: {
                left: ["infobar"],
                middle: [],
                right: ["iterateZoom", "slideshow", "fullScreen", "download", "thumbs", "close"],
              },
            },
          });
        });
      }
    }

    // 1. 首次加载页面时初始化
    onMounted(() => {
      initFancybox()
    })

    // 2. 监听路由变化，跳转到新文章时重新绑定图片
    watch(
      () => route.path,
      () => nextTick(() => initFancybox())
    )
  }
}