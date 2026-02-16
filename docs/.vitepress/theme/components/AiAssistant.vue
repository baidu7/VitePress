<script setup>
import { ref, nextTick, watch } from 'vue'
import { useData } from 'vitepress'

const { title, frontmatter } = useData() 
const isOpen = ref(false)
const inputMsg = ref('')
const inputRef = ref(null) // 引用输入框
const chatHistory = ref([{ role: 'ai', text: '江大爷遛弯去了，我是小助理，有啥事您吩咐？' }])
const loading = ref(false)
const contentRef = ref(null)

// 自动滚动到底部
const scrollToBottom = async () => {
  await nextTick()
  if (contentRef.value) {
    contentRef.value.scrollTop = contentRef.value.scrollHeight
  }
}

// 监听打开动作：自动聚焦 + 滚动
watch(isOpen, async (newVal) => {
  if (newVal) {
    await nextTick()
    inputRef.value?.focus()
    scrollToBottom()
  }
})

const askAI = async () => {
  // 【修复重点】先去空格，再判断
  const userText = inputMsg.value.trim()
  
  if (!userText || loading.value) {
    inputMsg.value = '' // 如果全是空格，直接清空
    return
  }

  chatHistory.value.push({ role: 'user', text: userText })
  inputMsg.value = '' // 清空输入框
  loading.value = true
  scrollToBottom()

  try {
    const res = await fetch('https://baidu8.indevs.in/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        prompt: userText, 
        pageTitle: title.value,
        description: frontmatter.value.description, // 抓取摘要
        history: chatHistory.value.slice(1, -1) // 保持对话上下文
      })
    })
    
    const data = await res.json()
    chatHistory.value.push({ role: 'ai', text: data.response })
  } catch (e) {
    chatHistory.value.push({ role: 'ai', text: '哎哟，估计是江大爷没缴网费，小的断网了...' })
  } finally {
    loading.value = false
    scrollToBottom()
  }
}
</script>

<template>
  <div class="ai-wrapper" :class="{ 'is-open': isOpen }">
    <div class="ai-side-tab" @click="isOpen = !isOpen">
      <span class="tab-icon">{{ isOpen ? '✖' : '💬' }}</span>
      <span class="tab-text">{{ isOpen ? '收起助理' : '小助理' }}</span>
    </div>

    <div class="ai-panel">
      <div class="ai-header">
        <span>江大爷的小助理</span>
        <button class="close-btn" @click="isOpen = false">×</button>
      </div>
      
      <div class="ai-content" ref="contentRef">
        <div v-for="(msg, index) in chatHistory" :key="index" :class="['msg', msg.role]">
          {{ msg.text }}
        </div>
        <div v-if="loading" class="msg ai thinking">小的正在琢磨...</div>
      </div>

      <div class="ai-footer">
        <input 
          ref="inputRef"
          v-model="inputMsg" 
          @keyup.enter="askAI" 
          placeholder="给助理递个话..." 
        />
        <button @click="askAI" :disabled="loading">发送</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 1. 容器：参考音乐抽屉的弹出逻辑 */
.ai-wrapper {
  position: fixed;
  right: 0;
  bottom: 190px; /* 抬高一点，别跟右下角的返回顶部撞车 */
  z-index: 2000;
  display: flex;
  align-items: flex-start;
  transition: transform 0.5s cubic-bezier(0.68, -0.55, 0.27, 1.55);
  transform: translateX(280px); /* 默认藏起来 */
}

.ai-wrapper.is-open {
  transform: translateX(0);
}

/* 2. 侧边拉手：完全复刻音乐插件 #drawer-handle 风格 */
.ai-side-tab {
    position: absolute;
    left: -21px;
    /* top: 0; */
    bottom: 0px;
    width: 22px;
    height: 90px;
  background: var(--vp-c-divider);
  border: 1px solid var(--vp-c-divider);
  color: var(--vp-c-text-1);
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 4px 0 0 4px;
  box-shadow: var(--vp-shadow-3);
}

.tab-icon { font-size: 10px; margin-bottom: 4px; }
.tab-text { 
  writing-mode: vertical-lr; 
  font-size: 10px; 
  letter-spacing: 2px; 
  opacity: 0.8;
}

/* 3. 主面板：参考 #music-drawer */
.ai-panel {
  width: 280px;
  height: 400px;
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  box-shadow: var(--vp-shadow-3);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* 4. 头部：参考 .song-title 和 #playlist-selector */
.ai-header {
  padding: 10px 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px dashed var(--vp-c-divider);
  font-weight: bold;
  font-size: 13px;
  color: #00b894; /* 统一使用大爷喜欢的绿色 */
}

.close-btn { 
  background: none; 
  border: none; 
  font-size: 18px; 
  cursor: pointer; 
  color: var(--vp-c-text-2);
  line-height: 1;
}
.close-btn:hover { color: #00b894; }

/* 5. 对话内容区 */
.ai-content {
  flex: 1;
  padding: 12px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 10px;
  background: var(--vp-c-bg-soft);
}

.msg {
  padding: 8px 12px;
  border-radius: 5px;
  font-size: 12px;
  max-width: 85%;
  line-height: 1.5;
  border: 1px solid var(--vp-c-divider);
}

/* 用户消息：激活状态绿色 */
.msg.user { 
  background: #00b894 !important; 
  color: white !important; 
  align-self: flex-end; 
  border-color: #00b894;
}

/* AI 消息：普通按钮背景色 */
.msg.ai { 
  background: var(--vp-c-bg-mute); 
  color: var(--vp-c-text-1); 
  align-self: flex-start; 
}

/* 正在思考：参考 .dot.playing 呼吸灯逻辑 */
.thinking { 
  border: none !important;
  color: #00b894 !important;
  font-size: 11px;
  animation: pulse 1s infinite;
}

/* 6. 页脚输入区 */
.ai-footer {
  padding: 12px;
  display: flex;
  gap: 6px;
  border-top: 1px solid var(--vp-c-divider);
}

.ai-footer input {
  flex: 1;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  padding: 6px 10px;
  border-radius: 5px;
  outline: none;
  font-size: 12px;
  color: var(--vp-c-text-1);
}

.ai-footer input:focus { border-color: #00b894; }

/* 发送按钮：参考 .selector-btn.active */
.ai-footer button {
  padding: 4px 12px;
  font-size: 11px;
  background: #00b894;
  color: white;
  border: 1px solid #00b894;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
}

.ai-footer button:disabled {
  background: var(--vp-c-bg-mute);
  border-color: var(--vp-c-divider);
  color: var(--vp-c-text-3);
}

/* 滚动条美化 */
.ai-content::-webkit-scrollbar { width: 4px; }
.ai-content::-webkit-scrollbar-thumb { background: var(--vp-c-divider); border-radius: 10px; }

/* 动画特效：参考音乐插件的 pulse */
@keyframes pulse { 0% {opacity: 1} 50% {opacity: 0.5} 100% {opacity: 1} }

/* 手机端隐藏助理，避免跟音乐岛打架 */
@media (max-width: 768px) {
  /* .ai-wrapper { display: none; } */
}
</style>