<script setup>
import { ref, onMounted } from 'vue'
import { quotes } from './quotes.js' // 确保路径正确

const currentQuote = ref('')
const isVisible = ref(false)

const updateQuote = () => {
  isVisible.value = false // 切换时先隐藏，触发重新打字
  setTimeout(() => {
    const randomIndex = Math.floor(Math.random() * quotes.length)
    currentQuote.value = quotes[randomIndex]
    isVisible.value = true
  }, 300)
}

onMounted(() => {
  updateQuote()
  setInterval(updateQuote, 8000) // 每8秒自动更新一次
})
</script>

<template>
  <div id="quote-box" @click="updateQuote">
    <div class="quote-header">
      <div class="dot"></div>
      <span class="system-title">SYSTEM READY // 动力装填中...</span>
    </div>
    
    <div class="typing-viewport">
      <transition name="type-fade">
        <p v-if="isVisible" class="quote-text">
          {{ currentQuote }}
          <span class="cursor">_</span>
        </p>
      </transition>
    </div>
  </div>
</template>

<style>
/* --- 1. 基础容器：彻底去框、轻量化 --- */
#quote-box {
  margin: 40px 0;
  padding: 15px 0;
  background: transparent !important;
  border: none !important;
  box-shadow: none !important;
  cursor: pointer;
  min-height: 100px;
  transition: all 0.3s ease;
}

/* --- 2. 头部状态栏 --- */
.quote-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 15px;
  opacity: 0.7;
}

.system-title {
  font-family: monospace; /* 使用等宽字体更有科技感 */
  font-size: 12px;
  font-weight: bold;
  letter-spacing: 2px;
  color: #666;
}

/* --- 3. 呼吸灯 --- */
.dot {
  width: 8px;
  height: 8px;
  background: #ff5f56;
  border-radius: 50%;
  animation: breathe 2.5s infinite ease-in-out;
}

@keyframes breathe {
  0%, 100% { opacity: 0.4; transform: scale(0.9); }
  50% { opacity: 1; transform: scale(1.1); box-shadow: 0 0 8px #ff5f56; }
}

/* --- 4. 打字机文字效果 --- */
.typing-viewport {
  overflow: hidden;
}

.quote-text {
  font-size: 1.25em;
  line-height: 1.6;
  color: #333;
  font-weight: 500;
  margin: 0;
  display: inline;
  position: relative;
}

/* 光标闪烁 */
.cursor {
  font-weight: bold;
  color: #ff5f56;
  animation: blink 0.8s infinite;
  margin-left: 2px;
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}

/* 文字切入动画 */
.type-fade-enter-active {
  transition: all 0.5s ease-out;
}
.type-fade-enter-from {
  opacity: 0;
  transform: translateX(-10px);
}

/* --- 5. 黑暗模式自适应 --- */
html.dark .quote-text {
  color: #e0e0e0 !important;
}

html.dark .system-title {
  color: #888;
}

/* 适配手机端 */
@media (max-width: 640px) {
  .quote-text {
    font-size: 1.1em;
  }
}
</style>