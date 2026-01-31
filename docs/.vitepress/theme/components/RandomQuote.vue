<template>
  <div id="quote-box" @click="updateQuote">
    <div class="quote-header">
      <span class="dot"></span>
      <span class="system-title">SYSTEM READY // 动力装填中...</span>
    </div>
    
    <div class="typing-viewport">
      <p :key="currentQuote" class="quote-text">
        {{ displayedText }}<span class="cursor">_</span>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
// 【修复重点】请根据您的实际目录结构调整路径。如果是同级目录用 ./quotes.js
import { quotes } from '../quotes.js' 

const currentQuote = ref('')
const displayedText = ref('')
let typingTimer = null

// 打字机逻辑函数
const typeWriter = (text, speed = 100) => {
  displayedText.value = ''
  let i = 0
  clearInterval(typingTimer)
  typingTimer = setInterval(() => {
    if (i < text.length) {
      displayedText.value += text.charAt(i)
      i++
    } else {
      clearInterval(typingTimer)
    }
  }, speed)
}

const updateQuote = () => {
  if (quotes.length > 0) {
    const randomIndex = Math.floor(Math.random() * quotes.length)
    currentQuote.value = quotes[randomIndex]
    typeWriter(currentQuote.value)
  }
}

onMounted(() => {
  updateQuote()
  // 每 10 秒自动装填一次新句子
  setInterval(updateQuote, 10000) 
})
</script>

<style>
/* --- 1. 彻底去框，轻量化布局 --- */
#quote-box {
  border: none !important;
  background: transparent !important;
  box-shadow: none !important;
  padding: 15px 0;
  margin: 30px 0;
  min-height: 80px;
  cursor: pointer;
}

.quote-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
  opacity: 0.8;
}

.system-title {
  font-family: monospace;
  font-size: 12px;
  font-weight: bold;
  color: #666;
  letter-spacing: 1px;
}

/* --- 2. 灵魂呼吸灯 --- */
.dot {
  width: 8px;
  height: 8px;
  background: #ff5f56;
  border-radius: 50%;
  animation: breathe 2.5s infinite ease-in-out;
}

@keyframes breathe {
  0%, 100% { opacity: 0.4; box-shadow: 0 0 2px #ff5f56; }
  50% { opacity: 1; box-shadow: 0 0 8px #ff5f56; }
}

/* --- 3. 文字与光标效果 --- */
.quote-text {
  font-size: 1.25em;
  color: var(--vp-c-text-1); /* 自动适配 VitePress 默认文字颜色 */
  line-height: 1.6;
  font-weight: 500;
  margin: 0;
}

.cursor {
  color: #ff5f56;
  font-weight: bold;
  margin-left: 2px;
  animation: blink 0.8s step-end infinite;
}

@keyframes blink {
  from, to { opacity: 1; }
  50% { opacity: 0; }
}

/* --- 4. 🌙 黑暗模式自适应 --- */
html.dark .system-title {
  color: #999;
}
/* 去框后背景透明，文字会自动随主题变色，无需强行覆写背景 */
</style>