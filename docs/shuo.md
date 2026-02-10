---
title: 我的说说
---

<script setup>
import { ref, onMounted, watch } from 'vue'

const GITHUB_OWNER = 'baidu8'
const GITHUB_REPO = 'VitePress'
const LABEL = 'shuo'

const issues = ref([])
const loading = ref(false)
const hasMore = ref(true)
const page = ref(1)
const showPostBox = ref(false)
const newContent = ref('')
const token = ref('')
const isPublishing = ref(false)

onMounted(() => {
  if (typeof window !== 'undefined') {
    token.value = localStorage.getItem('gh_token') || ''
    fetchIssues()
  }
})

watch(token, (v) => { if (typeof window !== 'undefined') localStorage.setItem('gh_token', v) })

async function fetchIssues(isMore = false) {
  if (loading.value) return
  loading.value = true
  if (isMore) page.value++
  try {
    const res = await fetch(`https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/issues?state=open&labels=${LABEL}&page=${page.value}&per_page=10`)
    const data = await res.json()
    if (isMore) issues.value = [...issues.value, ...data]
    else issues.value = data
    hasMore.value = data.length === 10
  } catch (e) { console.error(e) }
  loading.value = false
}

async function publishShuo() {
  if (!newContent.value || !token.value) return
  isPublishing.value = true
  try {
    const res = await fetch(`https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/issues`, {
      method: 'POST',
      headers: { 'Authorization': `token ${token.value}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: `说说 ${new Date().toLocaleDateString()}`, body: newContent.value, labels: [LABEL] })
    })
    if (res.ok) {
      const newItem = await res.json()
      issues.value = [newItem, ...issues.value]
      newContent.value = ''; showPostBox.value = false
    }
  } catch (e) { alert('发布失败') }
  isPublishing.value = false
}

async function deleteShuo(num) {
  if (!confirm('确定删除？')) return
  try {
    const res = await fetch(`https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/issues/${num}`, {
      method: 'PATCH',
      headers: { 'Authorization': `token ${token.value}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ state: 'closed' })
    })
    if (res.ok) issues.value = issues.value.filter(i => i.number !== num)
  } catch (e) { alert('删除失败') }
}

function insertIframe() {
  const template = `\n<div class="iframe-container">\n<iframe src="这里填链接&autoplay=0" title="" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen loading="lazy" sandbox="allow-scripts allow-same-origin allow-forms"></iframe>\n</div>\n`;
  // 直接追加到内容后面
  newContent.value += template;
  // 提示一下大爷，别忘了改链接
  console.log("视频模板已插入，记得改链接哦！");
}
function insertvideo() {
  const template = `\n<video controls playsinline preload="metadata" style="width: 100%; aspect-ratio: 16/9; border-radius: 8px;">\n  <source src="/movie.mp4" type="video/mp4">\n  您的浏览器不支持播放该视频。\n</video>\n`;
  
  // 别忘了把这行字塞进输入框里
  newContent.value += template;
}

const parseMD = (t) => {
  if (!t) return ''
  return t
    .replace(/!\[.*?\]\((.*?)\)/g, '<img src="$1" style="max-width:100%; border-radius:8px; margin:10px 0; display:block;" />')
    .replace(/^## (.*$)/gm, '<h2 style="color:var(--vp-c-brand); margin:15px 0 10px;">$1</h2>')
    .replace(/\*\*(.*?)\*\*/g, '<strong style="color:var(--vp-c-brand);">$1</strong>')
    .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" style="color:var(--vp-c-brand);">$1</a>')
    .replace(/\n/g, '<br>')
}
</script>

<div class="shuo-container">
  <button @click="showPostBox = !showPostBox" class="toggle-btn">
    {{ showPostBox ? '🙈 收起' : '✍️ 说点什么...' }}
  </button>
  
  <div v-if="showPostBox" class="post-box">
    <div class="quick-tags">
      <span @click="newContent += '✨ '">✨ 闪光</span>
      <span @click="newContent += '![插图]() '">🖼️ 插图</span>
			<span @click="insertIframe" style="color: #00a1d6;">📺 iframe</span>
			<span @click="insertvideo" style="color: #00a1d6;">📹 视频</span>
      <span @click="newContent += '[链接]() '">🔗 链接</span>
      <span @click="newContent = ''" style="color:#ff4d4f">🧹 清空</span>
    </div>
    <textarea v-model="newContent" placeholder="想说点啥？" rows="4"></textarea>
    <div style="display:flex; gap:10px;">
      <input type="password" v-model="token" placeholder="Token" class="token-input">
      <button @click="publishShuo" :disabled="isPublishing" class="send-btn">发布</button>
    </div>
  </div>

  <div v-for="item in issues" :key="item.id" class="shuo-card">
    <div v-html="parseMD(item.body)" class="shuo-body"></div>
    <div class="shuo-footer">
      <span>{{ new Date(item.created_at).toLocaleString() }}</span>
      <div style="display:flex; gap:15px; align-items:center;">
        <button v-if="token" @click="deleteShuo(item.number)" class="del-btn">🗑️ 删除</button>
        <a :href="item.html_url" target="_blank" class="cmt-btn">
          💬 评论 <span v-if="item.comments > 0" class="cnt">{{ item.comments }}</span>
        </a>
      </div>
    </div>
  </div>

  <div v-if="hasMore" style="text-align:center; margin-top:20px;">
    <button @click="fetchIssues(true)" :disabled="loading" class="more-btn">
      {{ loading ? '加载中...' : '更多' }}
    </button>
  </div>
</div>

<style scoped>
.shuo-container { max-width: 600px; margin: 20px auto; }
.toggle-btn { width: 100%; padding: 10px; border: 1px dashed var(--vp-c-brand); color: var(--vp-c-brand); border-radius: 8px; cursor: pointer; background: transparent; }
.post-box { margin-top: 15px; padding: 15px; background: var(--vp-c-bg-soft); border-radius: 8px; border: 1px solid var(--vp-c-divider); }
.quick-tags { margin-bottom: 8px; display: flex; gap: 8px; flex-wrap: wrap; }
.quick-tags span { font-size: 0.8rem; padding: 2px 8px; background: var(--vp-c-bg); border: 1px solid var(--vp-c-divider); border-radius: 4px; cursor: pointer; }
textarea { width: 100%; padding: 10px; background: var(--vp-c-bg); border: 1px solid var(--vp-c-divider); color: inherit; margin-bottom: 10px; border-radius: 6px; }
.token-input { flex: 1; padding: 5px 10px; background: var(--vp-c-bg); border: 1px solid var(--vp-c-divider); color: inherit; border-radius: 4px; }
.send-btn { background: var(--vp-c-brand); color: white; padding: 5px 20px; border-radius: 4px; border: none; cursor: pointer; font-weight: bold; }
.shuo-card { background: var(--vp-c-bg-soft); border: 1px solid var(--vp-c-divider); border-radius: 12px; padding: 20px; margin-top: 20px; }
.shuo-body { line-height: 1.6; }
.shuo-footer { margin-top: 15px; display: flex; justify-content: space-between; font-size: 0.8rem; color: var(--vp-c-text-2); border-top: 1px dashed var(--vp-c-divider); padding-top: 10px; }
.del-btn { background: transparent; color: #ff4d4f; border: none; cursor: pointer; opacity: 0.7; }
.cmt-btn { text-decoration: none !important; color: inherit; }
.cnt { background: var(--vp-c-brand); color: white; padding: 0 4px; border-radius: 8px; font-size: 10px; }
.more-btn { padding: 8px 25px; border: 1px solid var(--vp-c-brand); color: var(--vp-c-brand); background: transparent; border-radius: 20px; cursor: pointer; }
</style>