<template>
  <div id="quote-box">
    <div class="quote-header">
      <span class="dot"></span>
      <span class="system-title">动力装填站</span>
    </div>
    <transition name="fade" mode="out-in">
      <p :key="currentQuote" class="quote-text">{{ currentQuote }}</p>
    </transition>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { quotes } from '../quotes.js' 

const currentQuote = ref('')

onMounted(() => {
  // 初始化第一句
  if (quotes.length > 0) {
    currentQuote.value = quotes[Math.floor(Math.random() * quotes.length)]
  }
  
  // 定时切换
  setInterval(() => {
    const randomIndex = Math.floor(Math.random() * quotes.length)
    currentQuote.value = quotes[randomIndex]
  }, 5000) 
})
</script>

<style scoped>
/* --- 基础样式 (白天模式) --- */
#quote-box {
  position: relative;          /* 为绝对定位提供参考 */
  border: 2px solid #333;      /* 硬核粗边框 */
  background-color: #ffffff;
  padding: 20px;
  margin: 20px 0;
  box-shadow: 6px 6px 0px #333; /* 工业感硬阴影 */
  min-height: 100px;           /* 固定高度防止页面跳动 */
  display: flex;
  flex-direction: column;
  justify-content: center;
  overflow: hidden;            /* 隐藏切换时的溢出 */
  transition: all 0.3s ease;    /* 同步关灯动画的 300ms 时长 */
}

.quote-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
}

.system-title {
  font-size: 12px;
  font-weight: bold;
  color: #333;
  letter-spacing: 1px;
}

.dot {
  width: 10px;
  height: 10px;
  background: #ff5f56;
  border-radius: 50%;
  animation: breathe 2.5s infinite ease-in-out; /* 呼吸灯 */
}

@keyframes breathe {
  0% { opacity: 0.4; box-shadow: 0 0 2px #ff5f56; }
  50% { opacity: 1; box-shadow: 0 0 8px #ff5f56; }
  100% { opacity: 0.4; box-shadow: 0 0 2px #ff5f56; }
}

.quote-text {
  font-size: 1.15em;
  color: #34495e;               /* 深岩灰 */
  line-height: 1.6;
  font-weight: 500;
  margin: 0;
  text-shadow: 1px 1px 0px rgba(255,255,255,0.5);
}

/* --- 信号传输切换动画 --- */
.fade-enter-active {
  transition: all 0.5s ease;
}
.fade-leave-active {
  position: absolute;           /* 解决竖跳重叠 */
  width: calc(100% - 40px);
  transition: all 0.3s ease;
}
.fade-enter-from {
  opacity: 0;
  transform: translateX(-15px);
}
.fade-leave-to {
  opacity: 0;
  transform: translateX(15px);
}

/* --- 🌙 终极黑暗模式适配 (重点) --- */
/* 使用 html.dark 配合 !important 确保强制覆盖 */
html.dark #quote-box {
  background-color: #1a1a1a !important;
  border-color: #444 !important;
  box-shadow: 6px 6px 0px #000 !important;
}

html.dark .system-title {
  color: #999 !important;
}

html.dark .quote-text {
  color: #e0e0e0 !important;    /* 提升黑夜模式文字亮度 */
  text-shadow: 1px 1px 0px rgba(0,0,0,0.8) !important;
}
</style>