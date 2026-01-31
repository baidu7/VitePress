<template>
  <div id="quote-box">
    <div class="quote-header">
      <span class="dot"></span> 动力装填站
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
  background: #ff5f56;
  display: inline-block;
  border-radius: 50%; /* 变成圆点 */
  
  /* 核心：添加动画 */
  animation: breathe 2.5s infinite ease-in-out;
}

@keyframes breathe {
  0% {
    transform: scale(0.9);
    opacity: 0.4;
    box-shadow: 0 0 0px #ff5f56;
  }
  50% {
    transform: scale(1.1); /* 呼吸时微动，更有灵气 */
    opacity: 1;
    box-shadow: 0 0 8px #ff5f56; /* 发光效果 */
  }
  100% {
    transform: scale(0.9);
    opacity: 0.4;
    box-shadow: 0 0 0px #ff5f56;
  }
}
.quote-text {
  font-size: 1.15em;
  color: #34495e; /* 深岩灰 */
  line-height: 1.8;
  font-weight: 500;
  /* 关键：给文字一点微妙的阴影，增加立体感 */
  text-shadow: 1px 1px 0px rgba(255,255,255,0.5); 
}

/* 信号传输（打字机感）切换动画 */
.fade-enter-active {
  animation: typing-look 0.8s steps(20, end); /* 模拟打字跳动感 */
}

.fade-leave-active {
  transition: all 0.3s ease;
}
.fade-enter-from {
  opacity: 0;
  transform: translateX(-10px); /* 从左侧滑入，像打印头移动 */
}

.fade-leave-to {
  opacity: 0;
  transform: translateX(10px);  /* 向右侧消失 */
}

/* 定义打字跳动模拟动画 */
@keyframes typing-look {
  from {
    width: 0;
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
.quote-text::before {
  content: "“";
  font-size: 2em;
  color: rgba(52, 73, 94, 0.1); /* 浅浅的颜色，不挡字 */
  position: absolute;
  margin-left: -20px;
  margin-top: -10px;
}

/* 切换动画：淡淡地浮现 */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>