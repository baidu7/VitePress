<script setup>
import { ref, nextTick, watch } from 'vue'
import { useData } from 'vitepress'

const { title, frontmatter } = useData() 
const isOpen = ref(false)
const inputMsg = ref('')
const inputRef = ref(null) 
const chatHistory = ref([{ role: 'ai', text: '我是江大爷的助理，有事您吩咐。' }])
const loading = ref(false)
const contentRef = ref(null)

const scrollToBottom = async () => {
  await nextTick()
  if (contentRef.value) {
    contentRef.value.scrollTop = contentRef.value.scrollHeight
  }
}

// 监听打开动作
watch(isOpen, async (newVal) => {
  if (newVal) {
    scrollToBottom()
    // ?? 建议：打开时自动聚焦到输入框，省得再点一下
    setTimeout(() => inputRef.value?.focus(), 100)
  }
})

const askAI = async () => {
  const userText = inputMsg.value.trim()
  if (!userText || loading.value) {
    inputMsg.value = '' 
    return
  }

  chatHistory.value.push({ role: 'user', text: userText })
  inputMsg.value = '' 
  loading.value = true
  scrollToBottom()

  try {
    const res = await fetch('https://baidu8.indevs.in/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        prompt: userText, 
        pageTitle: title.value,
        description: frontmatter.value.description,
        // ?? 优化点：只取最近 6 条历史，防止请求头过大
        history: chatHistory.value.slice(-7, -1) 
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

// ?? 新增：处理回车发送
const handleEnter = (e) => {
  if (!e.shiftKey) { // 如果不是按住 Shift，直接发送
    e.preventDefault()
    askAI()
  }
}

</script>

<template>
  <div class="ai-wrapper" :class="{ 'is-open': isOpen }">
    <div class="ai-side-tab" @click="isOpen = !isOpen">
      <div v-if="!isOpen" class="unread-dot">1</div>
      
      <span class="tab-icon">{{ isOpen ? '✕' : '🤖' }}</span>
      <span class="tab-text">{{ isOpen ? '隐藏' : '助理' }}</span>
    </div>

    <div class="ai-panel">
      <div class="ai-header">
        <div class="header-left">
          <span class="status-indicator"></span>
          <span class="header-title">江大爷的助理</span>
          <span class="header-status">在线</span> 
        </div>
        <button class="close-btn" @click="isOpen = false" title="关闭助理">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
            <path d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12 17 15.59z"/>
          </svg>
        </button>
      </div>
      
      <div class="ai-content" ref="contentRef">
        <div v-for="(msg, index) in chatHistory" :key="index" :class="['msg-row', msg.role]">
          <img v-if="msg.role === 'ai'" class="chat-avatar" src="/img/aitx.svg" alt="助理">
          
          <div class="msg-content">
            <div class="msg-inner">{{ msg.text }}</div>
          </div>
        
          <img v-if="msg.role === 'user'" 
               class="chat-avatar" 
               :src="`https://api.dicebear.com/7.x/avataaars/svg?seed=${visitorSeed}`" 
               alt="访客">
        </div>
        <div v-if="loading" class="msg ai thinking">
           <span class="dot-ani">...</span> 小的琢磨中
        </div>
      </div>

      <div class="ai-footer">
        <input 
            ref="inputRef"
            v-model="inputMsg" 
            :disabled="loading"
            @keydown.enter.prevent="askAI" 
            :placeholder="loading ? '助理正在思考中...' : '给助理递个话...'" 
          />
        <button class="send-btn" @click="askAI" :disabled="!inputMsg.trim() || loading">
          <svg viewBox="0 0 24 24" width="18" height="18"><path fill="currentColor" d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"></path></svg>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 消息红点样式 */
.unread-dot {
  position: absolute;
  top: -0px;
  right: 6px;
  background: #ff4757; /* 醒目的红色 */
  color: white;
  font-size: 8px;
  font-weight: bold;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0 10px rgba(255, 71, 87, 0.5);
  animation: breath 2s infinite; /* 呼吸动效 */
  z-index: 10;
}

/* 呼吸动画：让红点微微放大缩小 */
@keyframes breath {
  0% { transform: scale(1); box-shadow: 0 0 5px rgba(255, 71, 87, 0.5); }
  50% { transform: scale(1.1); box-shadow: 0 0 12px rgba(255, 71, 87, 0.8); }
  100% { transform: scale(1); box-shadow: 0 0 5px rgba(255, 71, 87, 0.5); }
}

/* 当鼠标悬停在拉手时，红点可以跳得快一点，提示点击 */
.ai-side-tab:hover .unread-dot {
  background: #ff6b81;
  animation: breath 0.5s infinite;
}
.msg-row {
  display: flex;
  gap: 10px;
  width: 100%;
}

/* 助理模式：默认从左往右 */
.msg-row.ai { align-items: flex-start; }

/* 访客模式：反向排列 */
.msg-row.user { 
  flex-direction: row-reverse; 
  align-items: flex-start; 
}

.chat-avatar {
  width: 32px;
  height: 32px;
  border-radius: 8px; /* 方圆型比纯圆更有设计感 */
  flex-shrink: 0;
  background: var(--vp-c-bg-soft);
}

.msg-content {
  max-width: calc(100% - 80px); /* 给头像留出空间 */
}

.msg-inner {
  padding: 8px 12px;
  font-size: 13px;
  line-height: 1.5;
  word-break: break-all; /* 防止长字符串撑爆面板 */
}
/* 容器逻辑 */
.ai-wrapper {
  position: fixed;
  right: 0;
  bottom: 170px; 
  z-index: 2000;
  display: flex;
  align-items: flex-end;
		transition: transform 0.6s cubic-bezier(0.68, -0.6, 0.32, 1.6);
  transform: translateX(300px);
}

.ai-wrapper.is-open {
  transform: translateX(-20px); /* 稍微离开边缘一点，更好看 */
}

/* 侧边拉手 */
.ai-side-tab {
  position: absolute;
  left: -23px;
  bottom: 20px;
  width: 23px;
  height: 90px;
  background: var(--vp-c-bg-elv);
  border: 1px solid var(--vp-c-divider);
  border-right: none;
  color: var(--vp-c-text-1);
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 12px 0 0 12px;
  box-shadow: -4px 0 15px rgba(0,0,0,0.05);
}

.tab-icon { font-size: 14px; margin-bottom: 6px; }
.tab-text { 
  writing-mode: vertical-lr; 
  font-size: 11px; 
  letter-spacing: 2px;
  font-weight: 500;
}

/* 主面板 */
.ai-panel {
  width: 300px;
  height: 450px;
  background: var(--vp-c-bg-elv);
  border: 1px solid var(--vp-c-divider);
  border-radius: 16px;
  box-shadow: var(--vp-shadow-5);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  backdrop-filter: blur(10px); /* 增加毛玻璃感 */
}

/* 头部 */

.header-info { display: flex; align-items: center; gap: 8px; font-size: 14px; font-weight: 600; color: var(--vp-c-brand); }
.status-dot { width: 8px; height: 8px; background: #00b894; border-radius: 50%; box-shadow: 0 0 8px #00b894; }

/* 优雅的关闭按钮 */
.close-btn {
  background: none;
  border: none;
  color: var(--vp-c-text-3); /* 比之前更柔和的颜色 */
  cursor: pointer;
  padding: 5px; /* 增加点击区域 */
  border-radius: 50%; /* 圆形点击区域 */
  transition: all 0.2s ease;
  display: flex; /* 让SVG居中 */
  align-items: center;
  justify-content: center;
}
.close-btn:hover {
  background: var(--vp-c-bg-soft); /* 悬停时有背景色 */
  color: var(--vp-c-brand); /* 悬停时变主题色 */
  transform: rotate(90deg); /* 旋转动画 */
}
/* ai-header */
.ai-header {
  padding: 15px 18px; /* 稍微增加内边距 */
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid var(--vp-c-divider);
  
  /* 核心：半透明磨砂背景 */
  background: var(--vp-c-bg-elv); 
  backdrop-filter: blur(15px); /* 磨砂效果 */
  -webkit-backdrop-filter: blur(15px); /* 兼容 Safari */
  position: sticky; /* 头部可以吸顶，虽然这里不明显 */
  top: 0;
  z-index: 10;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 8px; /* 元素间距 */
}
.status-indicator {
  width: 9px; /* 稍微大一点的绿点 */
  height: 9px;
  background: #00b894; /* 翠绿色 */
  border-radius: 50%;
  box-shadow: 0 0 8px rgba(0, 184, 148, 0.6); /* 呼吸灯光晕 */
  animation: pulse-indicator 1.5s infinite alternate; /* 呼吸动画 */
}

.header-title {
  font-size: 15px; /* 标题字号 */
  font-weight: 700; /* 加粗 */
  color: var(--vp-c-text-1);
}

.header-status {
  font-size: 11px; /* 在线状态字号 */
  color: #00b894; /* 绿色文字 */
  font-weight: 500;
  opacity: 0.8;
  margin-left: -4px; /* 稍微靠近标题 */
}
/* 内容区 */
.ai-content {
  flex: 1;
  padding: 16px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 12px;
}
/* 在这里添加伪元素样式 */
.ai-content::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url('/img/AI.svg'); /* 您的图标链接 */
  background-repeat: no-repeat;
  background-position: center center;
  background-size: 120px;
  opacity: 0.1; /* 机器人图标的透明度 */
  pointer-events: none; /* 确保不影响点击和滚动 */
  z-index: 0; /* 确保在消息气泡下面 */
}

.msg {
  display: flex;
  flex-direction: column;
  max-width: 85%;
}

.msg-inner {
  padding: 10px 14px;
  border-radius: 14px;
  font-size: 13px;
  line-height: 1.6;
  box-shadow: 0 2px 5px rgba(0,0,0,0.02);
}
@keyframes blink {
  0% { opacity: .2; }
  20% { opacity: 1; }
  100% { opacity: .2; }
}
.msg.user { align-self: flex-end; }
.msg.user .msg-inner {
  background: var(--vp-c-brand);
  color: #fff;
  border-bottom-right-radius: 2px;
}

.msg.ai { align-self: flex-start; }
.msg.ai .msg-inner {
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
  border-bottom-left-radius: 2px;
  border: 1px solid var(--vp-c-divider);
}

/* 思考状态 */
.thinking { font-size: 12px; color: var(--vp-c-text-3); padding-left: 4px; }
.dot-ani { animation: pulse 1s infinite; }

/* 页脚 */
.ai-footer {
  padding: 12px 16px;
  display: flex;
  align-items: center;
  gap: 10px;
  background: var(--vp-c-bg-soft);
  border-top: 1px solid var(--vp-c-divider);
}

.ai-footer input {
  flex: 1;
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  padding: 8px 14px;
  border-radius: 20px;
  font-size: 13px;
  transition: all 0.2s;
}
.ai-footer input:focus { border-color: var(--vp-c-brand); }

.send-btn {
  width: 34px;
  height: 34px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--vp-c-brand);
  color: white;
  border-radius: 50%;
  transition: transform 0.2s, opacity 0.2s;
}
.send-btn:disabled { opacity: 0.5; cursor: not-allowed; }
.send-btn:hover:not(:disabled) { transform: scale(1.05); }

/* 动画 */
@keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }

/* 滚动条 */
.ai-content::-webkit-scrollbar { width: 4px; }
.ai-content::-webkit-scrollbar-thumb { background: var(--vp-c-divider); border-radius: 10px; }
/* 头部绿点呼吸动画 */
@keyframes pulse-indicator {
  0% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.1); opacity: 0.7; }
  100% { transform: scale(1); opacity: 1; }
}

/* 手机端适配 */
@media (max-width: 768px) {
  .ai-header { padding: 12px 15px; }
  .header-title { font-size: 14px; }
  .header-status { display: none; } /* 手机端隐藏“在线”文字，节省空间 */
  .status-indicator { width: 8px; height: 8px; }
}
</style>