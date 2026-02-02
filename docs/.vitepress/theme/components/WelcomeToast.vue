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
  // 1. 检查是否已经欢迎过了，避免重复打扰
  const hasWelcomed = sessionStorage.getItem('hasWelcomed')
  if (hasWelcomed) return 

  // 2. 根据当前时间自动设定问候语
  const hour = new Date().getHours()
  if (hour < 6) greeting.value = '凌晨好'
  else if (hour < 11) greeting.value = '早上好'
  else if (hour < 13) greeting.value = '中午好'
  else if (hour < 18) greeting.value = '下午好'
  else greeting.value = '晚上好'

  // 3. 简单的浏览器识别
  const ua = navigator.userAgent
  if (ua.indexOf('Chrome') > -1) browser.value = 'Chrome 浏览器'
  else if (ua.indexOf('Safari') > -1) browser.value = 'Safari 浏览器'
  else browser.value = '移动端设备'

  // 4. 使用最稳的 ip.sb 接口（支持 HTTPS）
  fetch('https://api.ip.sb/geoip')
    .then(res => res.json())
    .then(data => {
      let city = data.city || '互联网'
      
      // --- 大爷专属映射区：在这里把英文翻译成中文 ---
      if (city === 'Jinan') city = '济南'
      if (city === 'Beijing') city = '北京'
      if (city === 'Shanghai') city = '上海'
      // ------------------------------------------
      
      location.value = city
    })
    .catch(() => {
      // 如果接口彻底挂了，显示这个酷炫的保底词
      location.value = '赛博空间'
    })
    .finally(() => {
      // 5. 无论定位成功与否，1秒后弹出气泡
      setTimeout(() => {
        visible.value = true
        sessionStorage.setItem('hasWelcomed', 'true')
      }, 1000)

      // 6. 停留 6 秒后自动收回气泡
      setTimeout(() => { 
        visible.value = false 
      }, 7000)
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