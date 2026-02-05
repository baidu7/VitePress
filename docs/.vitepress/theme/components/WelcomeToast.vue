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
  // 1. 【策略升级】由 sessionStorage 改为 localStorage，并加入日期检查
  // 这样能做到“每天只弹一次”，而不是“每次开浏览器都弹”，更高级
  const today = new Date().toDateString()
  const lastWelcomed = localStorage.getItem('lastWelcomedDate')
  if (lastWelcomed === today) return 

  // 2. 根据当前时间自动设定问候语
  const hour = new Date().getHours()
  if (hour < 6) greeting.value = '凌晨好'
  else if (hour < 11) greeting.value = '早上好'
  else if (hour < 13) greeting.value = '中午好'
  else if (hour < 18) greeting.value = '下午好'
  else greeting.value = '晚上好'

  // 3. 浏览器识别优化
  const ua = navigator.userAgent
  if (ua.indexOf('Chrome') > -1) browser.value = 'Chrome 浏览器'
  else if (ua.indexOf('Safari') > -1) browser.value = 'Safari 浏览器'
  else if (ua.indexOf('Firefox') > -1) browser.value = 'Firefox 浏览器'
  else browser.value = '移动端设备'

  // 4. 获取定位并翻译
  fetch('https://api.ip.sb/geoip')
    .then(res => res.json())
    .then(data => {
      // 预设一个常用城市翻译表
      const cityMap = {
        'Jinan': '济南', 'Beijing': '北京', 'Shanghai': '上海', 
        'Guangzhou': '广州', 'Shenzhen': '深圳', 'Hangzhou': '杭州',
        'Chengdu': '成都', 'Wuhan': '武汉', 'Nanjing': '南京'
      }
      location.value = cityMap[data.city] || data.city || '互联网'
    })
    .catch(() => {
      location.value = '赛博空间'
    })
    .finally(() => {
      // 5. 1.5秒后弹出，给用户一点心理准备
      setTimeout(() => {
        visible.value = true
        localStorage.setItem('lastWelcomedDate', today) // 记录今天已欢迎过
      }, 1500)

      // 6. 7秒后自动收回
      setTimeout(() => { 
        visible.value = false 
      }, 8500)
    })
})
</script>

<style scoped>
.welcome-toast {
  position: fixed;
  /* 【关键优化】使用 env 确保在 iPhone 等全面屏手机下不被底栏遮挡 */
  bottom: calc(30px + env(safe-area-inset-bottom));
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  color: white;
  padding: 14px 24px;
  border-radius: 18px;
  z-index: 1000000;
  box-shadow: 0 8px 32px rgba(0,0,0,0.3);
  border: 1px solid rgba(255,255,255,0.15);
  min-width: 300px;
}

.toast-content { display: flex; align-items: center; gap: 15px; }
.toast-icon { font-size: 26px; }
.toast-text { text-align: left; }
.greeting { font-weight: 600; margin: 0; font-size: 15px; line-height: 1.4; }
.details { font-size: 12px; opacity: 0.6; margin: 2px 0 0 0; }

/* --- 📱 手机端深度适配 --- */
@media (max-width: 768px) {
  .welcome-toast {
    bottom: calc(20px + env(safe-area-inset-bottom));
    width: 88%;
    min-width: unset;
    padding: 12px 20px;
  }
  .greeting { font-size: 14px; }
  .details { font-size: 11px; }
}

/* 丝滑的淡入淡出及位移动画 */
.fade-enter-active, .fade-leave-active { transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1); }
.fade-enter-from, .fade-leave-to { opacity: 0; transform: translate(-50%, 30px); }
</style>