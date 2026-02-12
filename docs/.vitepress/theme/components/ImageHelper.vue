<template>
  <div class="image-helper-wrap">
    <button class="tool-btn" @click="$refs.fileInput.click()">
      <span v-if="loading">⏳</span>
      <span v-else>📷 传图</span>
    </button>
    <input 
      type="file" 
      ref="fileInput" 
      @change="handleUpload" 
      style="display:none" 
      accept="image/*" 
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps(['token', 'owner', 'repo'])
const emit = defineEmits(['success', 'error', 'busy'])
const loading = ref(false)

const handleUpload = async (e) => {
  const file = e.target.files[0]
  if (!file || !props.token) return
  
  loading.value = true
  emit('busy', '🚀 正在压缩并同步 CDN...')

  const reader = new FileReader()
  reader.readAsDataURL(file)
  reader.onload = (event) => {
    const img = new Image()
    img.src = event.target.result
    img.onload = async () => {
      // --- 核心压缩逻辑 ---
      const canvas = document.createElement('canvas')
      const MAX_WIDTH = 1200
      let width = img.width, height = img.height
      if (width > MAX_WIDTH) { height *= MAX_WIDTH / width; width = MAX_WIDTH; }
      canvas.width = width; canvas.height = height
      const ctx = canvas.getContext('2d')
      ctx.imageSmoothingEnabled = true
      ctx.imageSmoothingQuality = 'high'
      ctx.drawImage(img, 0, 0, width, height)

      // 转换为 Base64
      const base64 = canvas.toDataURL('image/jpeg', 0.82).split(',')[1]
      const fileName = `img-${Date.now()}.jpg`
      const path = `img/${fileName}`

      try {
        const res = await fetch(`https://api.github.com/repos/${props.owner}/${props.repo}/contents/${path}`, {
          method: 'PUT',
          headers: { 'Authorization': `token ${props.token}` },
          body: JSON.stringify({ message: 'Upload Image', content: base64 })
        })

        if (res.ok) {
          // 返回 jsDelivr 链接
          const cdnUrl = `https://gcore.jsdelivr.net/gh/${props.owner}/${props.repo}@main/${path}`
          emit('success', cdnUrl)
        } else {
          emit('error', '上传失败：权限或路径问题')
        }
      } catch (err) {
        emit('error', '网络异常')
      } finally {
        loading.value = false
      }
    }
  }
}
</script>

<style scoped>
.tool-btn {
  background: var(--vp-c-bg-soft);
  padding: 4px 12px;
  border-radius: 6px;
  font-size: 12px;
  border: 1px solid var(--vp-c-divider);
  cursor: pointer;
  transition: all 0.2s;
}
.tool-btn:hover { border-color: var(--vp-c-brand); color: var(--vp-c-brand); }
</style>