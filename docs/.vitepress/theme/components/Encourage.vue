<template>
  <div v-if="quote" class="encourage-box">
    <p class="quote-text">✨ {{ quote }}</p>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vitepress'
// 请确保您的 quotes.js 放在 components 的上一级目录中
import { quotes } from '../quotes.js' 

const quote = ref('')
const route = useRoute()

/**
 * 随机获取一句语录
 */
const refreshQuote = () => {
  if (quotes && quotes.length > 0) {
    const randomIndex = Math.floor(Math.random() * quotes.length)
    quote.value = quotes[randomIndex]
  }
}

// 页面首次加载时执行
onMounted(() => {
  refreshQuote()
})

// 核心：监听路由路径变化
// 当用户从一篇文章点击跳转到另一篇文章时，触发换词
watch(
  () => route.path,
  () => {
    refreshQuote()
  }
)
</script>

<style scoped>
.encourage-box {
  /* 在正文和页脚之间留出空隙 */
  margin-top: 3rem;
  padding: 1.5rem;
  /* 使用 VitePress 标准分割线颜色 */
  border-top: 1px dashed var(--vp-c-divider);
  text-align: center;
  /* 加上一点淡入动画，切换时更柔和 */
  animation: fadeIn 0.8s ease;
}

.quote-text {
  /* 使用次级文本颜色，显得低调优雅 */
  color: var(--vp-c-text-2);
  font-style: italic;
  font-size: 0.95rem;
  line-height: 1.6;
  margin: 0;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(5px); }
  to { opacity: 1; transform: translateY(0); }
}

/* 适配移动端，窄屏时缩小间距 */
@media (max-width: 640px) {
  .encourage-box {
    margin-top: 2rem;
    padding: 1rem;
  }
}
</style>