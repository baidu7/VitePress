<template>
  <div class="friends-container">
    <div v-if="loading" class="loading-status">正在喊他们请稍等...</div>
    <div v-else class="friends-grid">
      <a v-for="link in links" :key="link.url" :href="link.url" target="_blank" class="friend-card">
        <img :src="link.avatar" :alt="link.name" class="avatar" @error="handleImgError">
        <div class="info">
          <div class="name">{{ link.name }}</div>
          <div class="desc">{{ link.desc }}</div>
        </div>
      </a>
    </div>

    <hr class="divider" />
<div class="my-info-card">
  <div class="card-header">
    <span class="icon">??</span> <b>本站信息（欢迎互换）</b>
  </div>
  <div class="info-content">
    <div class="info-item"><span>名称：</span><code>江大爷</code></div>
    <div class="info-item"><span>链接：</span><code>https://828111.xyz/</code></div>
    <div class="info-item"><span>头像：</span><code>https://828111.xyz/img/avatar.png</code></div>
    <div class="info-item"><span>简介：</span><code>梦到什么说什么</code></div>
  </div>
  <p class="copy-hint">直接复制上面的内容挂到贵站即可</p>
</div>
    <div class="apply-section">
      <h3>?? 申请友链</h3>
      <p class="hint">请先在贵站挂好本站链接：<b>828111.xyz</b></p>
      
      <div class="form-group">
        <input v-model="applyForm.name" placeholder="网站名称" />
        <input v-model="applyForm.url" placeholder="网站链接 (http...)" />
        <input v-model="applyForm.avatar" placeholder="头像链接" />
        <input v-model="applyForm.desc" placeholder="一句话简介" />
        
        <button @click="submitApply" :disabled="isSubmitting">
          {{ isSubmitting ? '保镖正在查岗...' : '立即提交' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

// 配置区域
const DATA_REPO = "baidu7/links"
const CF_WORKER_URL = "https://daye.gv.uy" // ?? 记得换成你的CF地址！

const links = ref([])
const loading = ref(true)
const isSubmitting = ref(false)
const applyForm = ref({ name: '', url: '', avatar: '', desc: '' })

// 获取友链数据
const fetchLinks = async () => {
  try {
    // 加个随机数防止CDN缓存死硬不更新
    const res = await fetch(`${CF_WORKER_URL}?t=${Date.now()}`)
    links.value = await res.json()
  } catch (e) {
    console.error("加载友链失败")
  } finally {
    loading.value = false
  }
}

// 提交申请
const submitApply = async () => {
  const { name, url, avatar, desc } = applyForm.value
  if (!name || !url || !avatar) return alert('信息得填全呀！')

  isSubmitting.value = true
  try {
    const res = await fetch(CF_WORKER_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(applyForm.value)
    })
    
    const result = await res.json()
    alert(result.msg) // 显示 CF 返回的“查岗结果”
    
    if (res.ok) {
      applyForm.value = { name: '', url: '', avatar: '', desc: '' }
      fetchLinks() // 成功了刷新一下列表，看新人上墙
    }
  } catch (e) {
    alert('网络拉胯了，稍后再试')
  } finally {
    isSubmitting.value = false
  }
}

const handleImgError = (e) => {
  e.target.src = '/logo.png' // 头像挂了用占位图
}

onMounted(fetchLinks)
</script>

<style scoped>
.my-info-card {
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 10px;
  padding: 16px;
  margin: 15px 0 25px 0;
}
.card-header {
  margin-bottom: 12px;
  font-size: 0.95em;
  color: #333;
}
.info-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 8px;
}
.info-item {
  font-size: 0.85em;
  color: #666;
  display: flex;
  align-items: center;
}
.info-item span {
  width: 50px;
  flex-shrink: 0;
}
code {
  background: #fff;
  border: 1px solid #ddd;
  padding: 2px 6px;
  border-radius: 4px;
  font-family: monospace;
  color: #e83e8c;
  word-break: break-all;
}
.copy-hint {
  font-size: 0.8em;
  color: #999;
  margin-top: 10px;
  font-style: italic;
}
.friends-container { max-width: 800px; margin: 0 auto; padding: 20px; }
.friends-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 15px; }
.friend-card { 
  display: flex; align-items: center; padding: 15px; border: 1px solid #eee; 
  border-radius: 8px; text-decoration: none; color: inherit; transition: 0.3s;
}
.friend-card:hover { background: #f9f9f9; transform: translateY(-3px); box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
.avatar { width: 50px; height: 50px; border-radius: 50%; margin-right: 15px; object-fit: cover; }
.name { font-weight: bold; margin-bottom: 4px; }
.desc { font-size: 0.85em; color: #666; }
.loading-status { text-align: center; padding: 50px; color: #999; }

.divider { margin: 40px 0; border: none; border-top: 1px dashed #ddd; }
.apply-section { background: #fdfdfd; padding: 20px; border-radius: 12px; border: 1px solid #eee; }
.hint { font-size: 0.9em; color: #e67e22; margin-bottom: 15px; }
.form-group { display: flex; flex-direction: column; gap: 10px; }
.form-group input { padding: 10px; border: 1px solid #ddd; border-radius: 6px; outline: none; }
.form-group button { 
  padding: 12px; background: #3eaf7c; color: white; border: none; 
  border-radius: 6px; cursor: pointer; font-weight: bold;
}
.form-group button:disabled { background: #ccc; cursor: not-allowed; }
</style>