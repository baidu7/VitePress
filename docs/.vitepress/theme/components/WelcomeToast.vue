<template>
  <Transition name="fade">
    <div v-if="visible" class="welcome-toast">
      <div class="toast-content">
        <span class="toast-icon">🚀</span>
        <div class="toast-text">
          <p class="greeting">{{ greeting }}！来自 {{ location }} 的朋友</p>
          <p class="details">识别到您正使用 {{ browser }} 访问本站</p>
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

  // 3. 抓取地理位置 (借用搜狐免费接口)
  fetch('https://pv.sohu.com/cityjson?ie=utf-8')
    .then(res => res.text())
    .then(data => {
      const match = data.match(/"cname":\s*"([^"]+)"/)
      if (match) location.value = match[1]
    })
    .finally(() => {
      // 显示 5 秒后消失
      visible.value = true
      setTimeout(() => { visible.value = false }, 5000)
    })
})
</script>

<style scoped>
.welcome-toast {
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 12px 20px;
  border-radius: 50px;
  z-index: 9999;
  box-shadow: 0 4px 15px rgba(0,0,0,0.3);
}
.toast-content { display: flex; align-items: center; gap: 12px; }
.toast-icon { font-size: 20px; }
.greeting { font-weight: bold; margin: 0; }
.details { font-size: 12px; opacity: 0.8; margin: 0; }
.fade-enter-active, .fade-leave-active { transition: opacity 0.5s, transform 0.5s; }
.fade-enter-from, .fade-leave-to { opacity: 0; transform: translate(-50%, 20px); }
</style>