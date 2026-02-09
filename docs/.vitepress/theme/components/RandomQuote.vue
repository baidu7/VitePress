<template>
  <div id="quote-box" @click="updateQuote">
    <div class="quote-header">
      <span class="dot"></span>
      <span class="system-title">LOG // {{ currentStatus }}</span>
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
import { quotes } from '../quotes.js' 

const currentQuote = ref('')
const displayedText = ref('')
const currentStatus = ref('SYSTEM READY')
let typingTimer = null

const typeWriter = (text, speed = 60) => {
  displayedText.value = ''
  let i = 0
  clearInterval(typingTimer)
  currentStatus.value = 'LOADING...'
  typingTimer = setInterval(() => {
    if (i < text.length) {
      displayedText.value += text.charAt(i)
      i++
    } else {
      clearInterval(typingTimer)
      currentStatus.value = 'SYSTEM READY'
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
  setInterval(updateQuote, 12000) 
})
</script>

<style scoped>
#quote-box {
  padding: 12px 16px;
  margin: 16px 0;
  background: var(--vp-c-bg-soft);
  border-radius: 5px;
  border: 1px solid var(--vp-c-divider);
  transition: all 0.3s ease;
  cursor: pointer;
}

#quote-box:hover {
  border-color: #4761B8; /* 悬停时边框也微微泛红，呼应呼吸灯 */
}

.quote-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.system-title {
  font-family: var(--vp-font-family-mono);
  font-size: 11px;
  font-weight: 600;
  color: var(--vp-c-text-3);
  letter-spacing: 1.5px;
  text-transform: uppercase;
}

/* --- 红色呼吸灯回归 --- */
.dot {
  width: 7px;
  height: 7px;
  background: #ff5f56; /* 经典的动力红 */
  border-radius: 50%;
  animation: breathe 2.5s infinite ease-in-out;
}

@keyframes breathe {
  0%, 100% { 
    opacity: 0.4; 
    transform: scale(0.9);
    box-shadow: 0 0 2px #ff5f56;
  }
  50% { 
    opacity: 1; 
    transform: scale(1.1); 
    box-shadow: 0 0 8px #ff5f56; 
  }
}

/* --- 文字占位优化 --- */
.quote-text {
  font-size: 0.95rem;
  color: var(--vp-c-text-1);
  line-height: 1.6;
  font-weight: 400;
  margin: 0;
  /* 关键：按 1.6 的行高预留两行空间 (1.6 * 2 = 3.2em) */
  min-height: 3.2em; 
  display: -webkit-box;
  -webkit-line-clamp: 2; /* 最多显示两行，多了隐藏 */
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.cursor {
  color: #ff5f56; /* 光标也用红色 */
  font-weight: bold;
  margin-left: 2px;
  animation: blink 1s step-end infinite;
}

@keyframes blink {
  from, to { opacity: 1; }
  50% { opacity: 0; }
}
</style>