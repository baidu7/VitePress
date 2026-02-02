<template>
  <Transition name="fade">
    <div v-if="visible" class="welcome-toast">
      <div class="toast-content">
        <span class="toast-icon">🚀</span>
        <div class="toast-text">
          <p class="greeting">{{ greeting }}！来自 {{ location }} 的朋友</p>
          <p class="details">使用 {{ browser }} 访问本站</p>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const visible = ref(false)
const greeting = ref('')
const location = ref('远方')
const browser = ref('神秘设备')
onMounted(() => {
  // --- 1. 新增：检查是否已经欢迎过了 ---
  const hasWelcomed = sessionStorage.getItem('hasWelcomed')
  if (hasWelcomed) {
    console.log('大爷，刚才打过招呼了，这次咱闭嘴。')
    return // 直接结束，不执行下面的逻辑
  }
  // 1. 根据时间定问候语
  const hour = new Date().getHours()
  if (hour < 6) greeting.value = '凌晨好，熬夜辛苦了'
  else if (hour < 11) greeting.value = '早上好'
  else if (hour < 13) greeting.value = '中午好'
  else if (hour < 18) greeting.value = '下午好'
  else greeting.value = '晚上好'

  // 2. 识别浏览器
  const ua = navigator.userAgent
  if (ua.indexOf('Chrome') > -1) browser.value = 'Chrome 浏览器'
  else if (ua.indexOf('Safari') > -1) browser.value = 'Safari 浏览器'
  else browser.value = '移动端设备'

  // 3. 抓取地理位置
  fetch('https://pv.sohu.com/cityjson?ie=utf-8')
    .then(res => res.text())
    .then(data => {
      const match = data.match(/"cname":\s*"([^"]+)"/)
      if (match) location.value = match[1]
    })
    .finally(() => {
      // 这里的 500 代表 0.5 秒后弹出，让用户先进站站稳
						visible.value = true
      setTimeout(() => { 
							sessionStorage.setItem('hasWelcomed', 'true')
						}, 500)
      // 这里的 6000 代表 6 秒后自动消失
      setTimeout(() => { visible.value = false }, 6000)
    })
})
</script>

<style scoped>
/* --- 基础样式（电脑端） --- */
.welcome-toast {
  position: fixed;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(8px);
  color: white;
  padding: 12px 24px;
  border-radius: 15px;
  z-index: 1000000;
  box-shadow: 0 4px 20px rgba(0,0,0,0.4);
  border: 1px solid rgba(255,255,255,0.1);
  min-width: 280px; /* 保证电脑端有一定宽度 */
}

.toast-content { display: flex; align-items: center; gap: 12px; }
.toast-icon { font-size: 24px; }
.toast-text { text-align: left; }
.greeting { font-weight: bold; margin: 0; font-size: 15px; white-space: nowrap; }
.details { font-size: 12px; opacity: 0.7; margin: 0; white-space: nowrap; }

/* --- 📱 手机端适配逻辑 --- */
@media (max-width: 768px) {
  .welcome-toast {
    bottom: 20px; /* 离底部近一点 */
    padding: 10px 18px;
    min-width: auto; /* 撤销固定宽度 */
    width: 90%; /* 宽度占屏幕 90%，两边留点缝 */
    border-radius: 15px; /* 手机上用圆角矩形比大圆柱更协调 */
  }
  
  .toast-icon { font-size: 20px; }
  .greeting { font-size: 14px; white-space: normal; } /* 允许换行，防止文字溢出 */
  .details { font-size: 11px; white-space: normal; }
}

/* 动画保持不变 */
.fade-enter-active, .fade-leave-active { transition: all 0.6s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; transform: translate(-50%, 20px); }
</style>