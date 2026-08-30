---
title: 我的说说
layout: page
---
<script setup>
import { ref, onMounted, watch } from 'vue'
import ImageHelper from '@theme/components/ImageHelper.vue'
const GITHUB_OWNER = 'baidu7'
const GITHUB_REPO = 'baidu7.github.io'
const IMG_OWNER = 'baidu7'
const IMG_REPO = 'images'
const LABEL = 'shuo'
const issues = ref([])
const loading = ref(false)
const hasMore = ref(true)
const page = ref(1)
const showPostBox = ref(false)
const newContent = ref('')
const token = ref('')
const isPublishing = ref(false)

// ========== 新增：视频互斥暂停功能 ==========
function pauseAllOtherVideos(currentEl) {
  // 暂停所有原生mp4视频
  document.querySelectorAll('video').forEach(vid => {
    if (vid !== currentEl && !vid.paused) {
      vid.pause()
    }
  })
  // 发送暂停指令给支持postMessage的iframe播放器(Youtube)
  document.querySelectorAll('iframe').forEach(iframe => {
    if (iframe !== currentEl && iframe.contentWindow) {
      iframe.contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*')
    }
  })
}

// 给页面所有video绑定play监听，防止重复绑定
function bindVideoMutualPause() {
  document.querySelectorAll('video').forEach(vid => {
    if (vid.dataset.bindPlay) return
    vid.dataset.bindPlay = "1"
    vid.addEventListener('play', (e) => {
      pauseAllOtherVideos(e.target)
    })
  })
}

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

    // DOM渲染完成后，给新加载出来的视频绑定互斥暂停事件
    setTimeout(() => {
      bindVideoMutualPause()
    }, 100)

  } catch (e) { console.error(e) }
  loading.value = false
}

async function publishShuo() {
  if (!newContent.value || !token.value) return
  isPublishing.value = true
  const lines = newContent.value.trim().split('\n')
  let firstLine = lines[0].replace(/[#*`]/g, '').trim()
  const titleText = firstLine.length > 20 ? firstLine.slice(0, 20) + '...' : firstLine
  const finalTitle = titleText || `说说 ${new Date().toLocaleString()}`
  try {
    const res = await fetch(`https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/issues`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token.value.trim()}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        title: finalTitle,
        body: newContent.value,
        labels: [LABEL]
      })
    })

    if (res.ok) {
      const newItem = await res.json()
      issues.value = [newItem, ...issues.value]
      newContent.value = ''
      showPostBox.value = false
      // 刚发布的内容也要绑定视频暂停事件
      setTimeout(() => {
        bindVideoMutualPause()
      }, 100)
    } else {
      const err = await res.json()
      alert(`发布失败：${err.message}`)
    }
  } catch (e) {
    alert('网络错误')
  } finally {
    isPublishing.value = false
  }
}
async function deleteShuo(num) {
  if (!confirm('确定删除？')) return
  try {
    const res = await fetch(`https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/issues/${num}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token.value.trim()}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ state: 'closed' })
    })
    if (res.ok) {
      issues.value = issues.value.filter(i => i.number !== num)
    } else {
      alert('删除失败，可能权限不足')
    }
  } catch (e) {
    alert('删除过程中发生错误')
  }
}
function insertIframe() {
  const template = `\n<div class="iframe-container">\n<iframe src="这里填链接&autoplay=0" title="" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen loading="lazy" sandbox="allow-scripts allow-same-origin allow-forms"></iframe>\n</div>\n`;
  newContent.value += template;
}
function insertvideo() {
  const template = `\n<video controls playsinline preload="metadata" style="width: 100%; aspect-ratio: 16/9; border-radius: 5px;">\n  <source src="/movie.mp4" type="video/mp4">\n  您的浏览器不支持播放该视频。\n</video>\n`;
  newContent.value += template;
}
const handleImageSuccess = (cdnUrl) => {
  const el = document.querySelector('.post-box textarea')
  const imgMd = `\n![插图](${cdnUrl})\n`
  if (el) {
    const start = el.selectionStart
    const end = el.selectionEnd
    const text = newContent.value
    newContent.value = text.substring(0, start) + imgMd + text.substring(end)
  } else {
    newContent.value += imgMd
  }
}
const parseMD = (t) => {
  if (!t) return ''
  t = t.replace(/!\[(.*?)\]\((.*?)\)/g, (match, alt, url) => {
    const videoExt = /\.(mp4|webm)$/i
    if (videoExt.test(url)) {
      return `<video controls playsinline preload="metadata" style="width: 100%; border-radius: 5px; margin: 10px 0; display:block;">
        <source src="${url}" type="video/mp4">
        浏览器不支持播放视频
      </video>`
    } else {
      return `<img src="${url}" style="max-width:100%; border-radius:5px; margin:10px 0; display:block;" />`
    }
  })
  t = t.replace(/^## (.*$)/gm, '<h2 style="color:var(--vp-c-brand); margin:15px 0 10px;">$1</h2>')
  t = t.replace(/\*\*(.*?)\*\*/g, '<strong style="color:var(--vp-c-brand);">$1</strong>')
  t = t.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" style="color:var(--vp-c-brand);">$1</a>')
  t = t.replace(/\n/g, '<br>')
  t = t.replace(/<\/div><br>/g, '</div>')
  t = t.replace(/<\/video><br>/g, '</video>')
  return t
}
</script>

<div class="shuo-container">
  <button @click="showPostBox = true" class="float-post-btn" title="点我写说说">
    ✍️
  </button>
<transition name="fade">
  <div v-if="showPostBox" class="modal-mask" @click.self="showPostBox = false">
    <div class="post-box modal-content">
      <span class="close-x" @click="showPostBox = false">×</span>
      <h3 style="margin: 0 0 15px 0; font-size: 18px;">✍ 发布说说</h3>
      <div class="quick-tags">
        <span @click="newContent += '✨ '">✨ 闪光</span>
        <span @click="newContent += '![插图]() '">📷️ 插图</span>
        <span @click="insertIframe" style="color: #00a1d6;">🎞 iframe</span>
        <span @click="insertvideo" style="color: #00a1d6;">📽 视频</span>
        <span @click="newContent += '[链接]() '">🔗 链接</span>
        <ImageHelper
          :token="token"
          :owner="IMG_OWNER"
          :repo="IMG_REPO"
          @success="handleImageSuccess"
        />
        <span @click="newContent = ''" style="color:#ff4d4f">🧹 清空</span>
      </div>
      <textarea v-model="newContent" placeholder="此时此刻想说点啥？" rows="6"></textarea>
      <div style="display:flex; gap:10px; margin-top: 15px;">
        <input type="password" v-model="token" placeholder="输入令牌(Token)" class="token-input">
        <button @click="publishShuo" :disabled="isPublishing" class="send-btn">
          {{ isPublishing ? '发布中...' : '发布' }}
        </button>
      </div>
    </div>
  </div>
</transition>
  <div v-for="item in issues" :key="item.id" class="shuo-card">
    <div class="shuo-header">
      <img src="/img/avatar.png" class="shuo-avatar no-zoom" data-no-zoom />
      <div class="shuo-meta">
        <span class="shuo-author">江大爷</span>
        <span class="shuo-time">{{ new Date(item.created_at).toLocaleString() }}</span>
      </div>
    </div>
    <div v-html="parseMD(item.body)" class="shuo-body vp-doc"></div>
    <div class="shuo-footer">
      <div style="display:flex; gap:15px; align-items:center; margin-left: auto;">
        <button v-if="token" @click="deleteShuo(item.number)" class="del-btn">🗑️ 删除</button>
        <a :href="item.html_url" target="_blank" class="cmt-btn">
          🗯 评论 <span v-if="item.comments > 0" class="cnt">{{ item.comments }}</span>
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
.shuo-card {
  background: var(--vp-c-bg-soft);
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 20px;
  border: 1px solid var(--vp-c-divider);
  word-break: break-word;
}
.shuo-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}
.shuo-avatar {
  width: 42px !important;
  height: 42px !important;
  border-radius: 50% !important;
  object-fit: cover;
  border: 1.5px solid var(--vp-c-brand-soft);
  margin: 0 !important;
}
.shuo-card:hover .shuo-avatar {
  transform: scale(1.05);
  transition: transform 0.3s ease;
}
.shuo-meta {
  display: flex;
  flex-direction: column;
}
.shuo-author {
  font-weight: bold;
  font-size: 1.05rem;
	font-family: "STXingkai", "STKaiti", "Kaiti SC", "Kaiti", serif;
  color: var(--vp-c-text-1);
}
.shuo-time {
  font-size: 0.85rem;
  color: var(--vp-c-text-2);
}
.shuo-body {
  margin-left: 2px;
  margin-bottom: 15px;
}
.shuo-footer {
  border-top: 1px solid var(--vp-c-divider);
  padding-top: 10px;
  display: flex;
  justify-content: flex-end;
}
.shuo-container { max-width: 600px; margin: 20px auto; padding: 0 23px;}
.toggle-btn { width: 100%; padding: 10px; border: 1px dashed var(--vp-c-brand); color: var(--vp-c-brand); border-radius: 5px; cursor: pointer; background: transparent; }
.post-box { margin-top: 15px; padding: 15px; background: var(--vp-c-bg-soft); border-radius: 5px; border: 1px solid var(--vp-c-divider); }
.quick-tags {
    margin-bottom: 8px;
    display: flex;
    gap: 8px;
    align-items: center;
    flex-wrap: wrap;
}
.quick-tags span { font-size: 0.8rem; padding: 2px 8px; border: 1px solid var(--vp-c-divider); border-radius: 5px; cursor: pointer; }
.quick-tags span:hover { border-color: var(--vp-c-brand); color: var(--vp-c-brand); }
.float-post-btn {
  position: fixed;
  bottom: 40px;
  right: 30px;
  width: 56px;
  height: 56px;
  background: var(--vp-c-brand);
  border-radius: 50%;
  font-size: 24px;
  border: none;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0,0,0,0.2);
  z-index: 999;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s;
}
.float-post-btn:hover { transform: scale(1.1); }
.modal-mask {
  position: fixed;
  top: 0; left: 0;
  width: 100%; height: 100%;
  background: rgba(0,0,0,0.6);
  backdrop-filter: blur(5px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}
.modal-content {
  width: 90%;
  max-width: 550px;
  background: var(--vp-c-bg);
  padding: 25px;
  border-radius: 12px;
  position: relative;
  border: 1px solid var(--vp-c-divider);
}
@media (max-width: 768px) {
  .modal-content {
    align-self: flex-start;
    margin-top: 50px;
  }
}
.close-x {
  position: absolute;
  top: 15px; right: 20px;
  font-size: 24px;
  cursor: pointer;
  color: var(--vp-c-text-2);
}
.close-x:hover { color: #ff4d4f; }
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
textarea { width: 100%; padding: 10px; background: var(--vp-c-bg); border: 1px solid var(--vp-c-divider); color: inherit; margin-bottom: 10px; border-radius: 6px; }
.token-input { flex: 1; padding: 5px 10px; background: var(--vp-c-bg); border: 1px solid var(--vp-c-divider); color: inherit; border-radius: 4px; }
.send-btn { background: var(--vp-c-brand); color: white; padding: 5px 20px; border-radius: 4px; border: none; cursor: pointer; font-weight: bold; }
.shuo-card { background: var(--vp-c-bg-soft); border: 1px solid var(--vp-c-divider); border-radius: 5px; padding: 20px; margin-top: 20px; }
.shuo-body { line-height: 1.6; }
.shuo-footer { margin-top: 15px; display: flex; justify-content: space-between; font-size: 0.8rem; color: var(--vp-c-text-2); border-top: 1px dashed var(--vp-c-divider); padding-top: 10px; }
.del-btn { background: transparent; color: #ff4d4f; border: none; cursor: pointer; opacity: 0.7; }
.cmt-btn { text-decoration: none !important; color: inherit; }
.cnt { background: var(--vp-c-brand); color: white; padding: 0 4px; border-radius: 5px; font-size: 10px; }
.more-btn { padding: 8px 25px; border: 1px solid var(--vp-c-brand); color: var(--vp-c-brand); background: transparent; border-radius: 20px; cursor: pointer; }
</style>
