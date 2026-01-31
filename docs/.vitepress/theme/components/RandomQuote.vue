<template>
  <div id="quote-box">
    <div class="quote-header">
      <span class="dot"></span> 随想云播报
    </div>
    <transition name="fade" mode="out-in">
      <p :key="currentQuote" class="quote-text">{{ currentQuote }}</p>
    </transition>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { quotes } from '../quotes.js' // 确保路径对应您的 quotes.js

const currentQuote = ref(quotes[0])

onMounted(() => {
  setInterval(() => {
    const randomIndex = Math.floor(Math.random() * quotes.length)
    currentQuote.value = quotes[randomIndex]
  }, 5000) // 每 5 秒换一句
})
</script>

<style scoped>
#quote-box {
  border: 2px solid #333;
  background: #fff;
  padding: 20px;
  margin: 20px 0;
  box-shadow: 6px 6px 0px #333; /* 呼应底部的硬阴影 */
  min-height: 80px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.quote-header {
  font-size: 12px;
  font-weight: bold;
  color: #333;
  margin-bottom: 10px;
  text-transform: uppercase;
  display: flex;
  align-items: center;
  gap: 5px;
}

.dot {
  width: 8px;
  height: 8px;
  background: #ff5f56; /* 红色小圆点，模拟系统窗口 */
  display: inline-block;
}

.quote-text {
  font-size: 1.1em;
  color: #555;
  margin: 0;
  line-height: 1.6;
  font-style: italic;
}

/* 切换动画：淡淡地浮现 */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>