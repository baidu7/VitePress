import DefaultTheme from 'vitepress/theme'
import MyLayout from './MyLayout.vue'
import { onMounted, watch, nextTick, h } from 'vue' // 必须导入 h
import { useRoute } from 'vitepress'
import './custom.css'
import Encourage from './components/Encourage.vue'
import RandomQuote from './components/RandomQuote.vue'
import MusicPlayer from './components/MusicPlayer.vue' // 引入刚写好的文件

export default {
  extends: DefaultTheme,
		enhanceApp({ app }) {
		    // 2. 注册组件，这样你在 md 里写 <RandomQuote /> 就能生效了
		    app.component('RandomQuote', RandomQuote),
						app.component('MusicPlayer', MusicPlayer) // 全局注册
		  },
  Layout: MyLayout, // 指定使用您这个带动画的布局
  // 【重点修复】如果您有自定义的 MyLayout.vue，就这样写
  // 把 Encourage 组件通过插槽传给 MyLayout 或 DefaultTheme
  Layout() {
    return h(MyLayout, null, {
      'doc-footer-before': () => h(Encourage)
    })
  },

  setup() {
    const route = useRoute()

    const initFancybox = () => {
      if (typeof window !== 'undefined') {
        // 动态加载 CSS
        if (!document.getElementById('fancybox-style')) {
          const link = document.createElement('link')
          link.id = 'fancybox-style'
          link.rel = 'stylesheet'
          link.href = 'https://cdn.jsdelivr.net/npm/@fancyapps/ui@5.0/dist/fancybox/fancybox.css'
          document.head.appendChild(link)
        }

        // 动态加载 JS
        import('https://cdn.jsdelivr.net/npm/@fancyapps/ui@5.0/dist/fancybox/fancybox.esm.js').then(({ Fancybox }) => {
          Fancybox.unbind(".vp-doc img:not(.no-zoom)");
          Fancybox.close();
          Fancybox.bind(".vp-doc img:not(.no-zoom)", {
            groupAll: true,
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