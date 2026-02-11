---
layout: page
title: 写作空间
---
<div v-if="!fakeLoggedIn" class="fake-login-overlay" :class="{ 'mobile-preview-active': isMobilePreview }">
  <div class="fake-login-card">
    <transition name="pop">
      <div v-if="customAlert" class="custom-alert">
        {{ alertMsg }}
      </div>
    </transition>
    <div class="card-icon">🔐</div>
    <p>请输入账号密码</p>
    <div class="fake-form">
      <div class="input-group">
        <input type="text" v-model="fakeUser" placeholder="账号" />
      </div>
      <div class="input-group">
        <input type="password" v-model="fakePass" placeholder="密码" />
      </div>
      <div class="fake-btns">
        <button class="btn-cancel" @click="goBack">取消</button>
        <button class="btn-login" @click="handleFakeLogin">登录</button>
      </div>
    </div>
  </div>
</div>

<div class="jdy-writer" :class="{ 'mobile-preview-active': isMobilePreview }">
  <div class="writer-header">
    <div class="header-logo">JDY <span style="color:var(--vp-c-brand)">WRITER</span></div>
    <div class="token-wrap">
      <input type="password" v-model="token" placeholder="密码" />
      <button @click="saveToken">{{ tokenSaved ? '已登录' : '登录' }}</button>
    </div>
  </div>

  <div class="writer-ctrl">
    <div class="path-input-wrap">
      <input type="text" v-model="filePath" placeholder="docs/index.md" />
    </div>
    <div class="main-btns">
      <button class="btn-pub" @click="submitFile" :disabled="loading">
        {{ loading ? '...' : '发布' }}
      </button>
      <button class="btn-del" @click="deleteFile">🗑️</button>
    </div>
  </div>

  <div class="file-scroller">
    <div class="file-chip root" @click="fetchFiles('docs')">🏠 根目录</div>
    <div v-for="file in fileList" :key="file.path" 
         class="file-chip" :class="{ active: filePath === file.path }"
         @click="handleFileClick(file)">
      {{ file.type === 'dir' ? '📁' : '' }} {{ file.name }}
    </div>
  </div>

  <div class="fast-tools">
    <button @click="insertTag('warning')">⚠️ 警告</button>
    <button @click="insertTag('tip')">💡 提示</button>
    <button @click="insertTag('details')">📁 折叠</button>
    <button @click="insertTag('video')">📹 视频</button>
				<button @click="insertTag('iframe')">🎞️️ iframe</button>
    <button @click="insertTag('grid')">🖼️ 网格</button>
    <button @click="insertTag('jz')">🀄 居中</button>
    <button @click="insertTag('meta')">⚙️ 设置</button>
				<ImageHelper 
				  :token="token" 
				  :owner="IMG_OWNER"  :repo="IMG_REPO"    @success="handleImageSuccess"
				  @error="showAlert"
				  @busy="showAlert"
				/>
    <button @click="createNewFile" style="color:var(--vp-c-brand)">➕ 新建</button>
  </div>

  <div class="workbench">
    <div class="editor-area">
      <textarea id="mdEditor"></textarea>
    </div>
    <div class="preview-area markdown-body" id="preview-box">
      <div v-if="!previewHtml" class="empty-tip">等待输入内容...</div>
      <div v-html="previewHtml"></div>
    </div>
  </div>

  <button class="mobile-preview-btn" @click="isMobilePreview = !isMobilePreview">
    {{ isMobilePreview ? '✍️ 返回编辑' : '👁️ 查看预览' }}
  </button>
</div>

<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/easymde/dist/easymde.min.css">

<script setup>
import { ref, onMounted } from 'vue'
import ImageHelper from '@theme/components/ImageHelper.vue'

const token = ref('')
const tokenSaved = ref(false)
const fileList = ref([])
const filePath = ref('')
const currentSha = ref('')
const loading = ref(false)
const previewHtml = ref('')
const isMobilePreview = ref(false)
let easyMDE = null

const fakeLoggedIn = ref(false)
const fakeUser = ref('')
const fakePass = ref('')
const customAlert = ref(false)
const alertMsg = ref('')

const showAlert = (msg) => {
  alertMsg.value = msg
  customAlert.value = true
  setTimeout(() => { customAlert.value = false }, 2500)
}

const handleFakeLogin = () => {
  if (!fakeUser.value && !fakePass.value) {
    fakeLoggedIn.value = true
    return
  }

  if (fakeUser.value && !fakePass.value) {
    showAlert('⚠️ 请输入管理员访问密码')
    return
  }

  if (!fakeUser.value && fakePass.value) {
    showAlert('⚠️ 请输入管理员登录账号')
    return
  }

  showAlert('❌ 验证失败：账号或密码错误')
}

const goBack = () => { window.location.href = '/' }

const handleImageSuccess = (cdnUrl) => {
  const cm = easyMDE.codemirror
  let docValue = easyMDE.value()
  
  // 1. 检查有没有 cover: 标记
  const hasCover = /cover:\s*.*?\n/.test(docValue)

  if (hasCover) {
    // 情况 A：已经有 cover 字段了，直接替换（不管后面有没有链接）
    const newVal = docValue.replace(/cover:\s*.*?\n/, `cover: ${cdnUrl}\n`)
    easyMDE.value(newVal)
    showAlert('✅ 封面已更新')
  } else if (docValue.trim().startsWith('---')) {
    // 情况 B：有 Frontmatter（---开头），但里面没写 cover
    // 我们把它插在第一个 --- 后面
    const newVal = docValue.replace(/---\n/, `---\ncover: ${cdnUrl}\n`)
    easyMDE.value(newVal)
    showAlert('✨ 已自动创建封面字段')
  } else {
    // 情况 C：压根没写 Frontmatter，或者是在正文里
    // 这种还是作为普通插图插在光标处最稳，免得破坏文章结构
    cm.replaceSelection(`\n![描述](${cdnUrl})\n`)
    showAlert('✅ 插图已插入')
  }
}

// 主仓库（存文章的）
const OWNER = 'baidu8'
const REPO = 'VitePress' 

// 图床仓库（存图片的）
const IMG_OWNER = 'baidu8' // 如果是同一个账号，就还写你的名字
const IMG_REPO = 'images'  // 这里填新仓库的名字

onMounted(async () => {
  token.value = localStorage.getItem('gh_token') || ''
  if(token.value) tokenSaved.value = true
  
  const [EasyMDEModule, MarkedModule] = await Promise.all([
    import('https://cdn.jsdelivr.net/npm/easymde/dist/easymde.min.js'),
    import('https://cdn.jsdelivr.net/npm/marked/marked.min.js')
  ])
  
  easyMDE = new EasyMDE({
    element: document.getElementById('mdEditor'),
    spellChecker: false,
    status: false,
    minHeight: '500px',
    toolbar: [
"bold", "italic", "strikethrough", "heading", "|", 
    "quote", "code","horizontal-rule", "|", 
    "unordered-list", "ordered-list", "|", 
    "link", "image", "|", 
    "guide"
				],
    placeholder: "在这里挥洒才华...",
  })

  // 实时同步预览
  easyMDE.codemirror.on("change", () => {
    const val = easyMDE.value()
				// 【新增】用正则表达式把 --- 之间的内容替换掉，不让它显示在预览区
				  const cleanVal = val.replace(/^---[\s\S]*?---\n/, '')
    // 模拟容器转换
    previewHtml.value = window.marked.parse(cleanVal.replace(/:::\s(\w+).*\n/g, '> **$1**: \n\n'))
  })

  if (token.value) fetchFiles('docs')
})

const saveToken = () => {
  localStorage.setItem('gh_token', token.value); tokenSaved.value = true; fetchFiles('docs')
}

const fetchFiles = async (path) => {
  const res = await fetch(`https://api.github.com/repos/${OWNER}/${REPO}/contents/${path}`, {
    headers: { 'Authorization': `token ${token.value}` }
  })
  if (res.ok) fileList.value = await res.json()
}

const handleFileClick = (f) => f.type === 'dir' ? fetchFiles(f.path) : loadFile(f.path)

const loadFile = async (path) => {
  loading.value = true
  const res = await fetch(`https://api.github.com/repos/${OWNER}/${REPO}/contents/${path}`, {
    headers: { 'Authorization': `token ${token.value}` }
  })
  const data = await res.json()
  easyMDE.value(decodeURIComponent(escape(atob(data.content))))
  filePath.value = path; currentSha.value = data.sha; loading.value = false
}

const submitFile = async () => {
  if (!filePath.value) return alert('路径？')
  loading.value = true
  const content = btoa(unescape(encodeURIComponent(easyMDE.value())))
  const res = await fetch(`https://api.github.com/repos/${OWNER}/${REPO}/contents/${filePath.value}`, {
    method: 'PUT',
    headers: { 'Authorization': `token ${token.value}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ message: 'Update', content, sha: currentSha.value || undefined })
  })
  if (res.ok) {
    const d = await res.json(); currentSha.value = d.content.sha; alert('✅ 已同步至云端')
  }
  loading.value = false
}

const createNewFile = () => {
  const name = prompt("文件名（建议格式：blog/文件名.md）:", "blog/new-post.md")
  if (name) {
    // 1. 自动获取当前日期 YYYY-MM-DD
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const today = `${year}-${month}-${day}`;

    // 2. 更新路径并清空旧 SHA
    filePath.value = `docs/${name}`;
    currentSha.value = '';

    // 3. 填充完整模版
    const template = `---
title: 标题
description: 简介
tags: [标签, ]
category: [分类, ]
cover: 
date: ${today}
outline: [2, 3]
---

# 在这里开始写作...`;

    easyMDE.value(template);
  }
}

const deleteFile = async () => {
  if (!confirm('确定删？')) return
  await fetch(`https://api.github.com/repos/${OWNER}/${REPO}/contents/${filePath.value}`, {
    method: 'DELETE',
    headers: { 'Authorization': `token ${token.value}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ message: 'Delete', sha: currentSha.value })
  })
  location.reload()
}

const insertTag = (type) => {
  const cm = easyMDE.codemirror
  const map = {
    tip: '\n::: tip 💡\n\n:::\n',
    warning: '\n::: warning ⚠\n\n:::\n',
    details: '\n::: details 点击展开\n\n:::\n',
				video: '\n<video controls playsinline preload="metadata" style="aspect-ratio: 16/9;">\n<source src="/movie.mp4" type="video/mp4">\n您的浏览器不支持播放该视频。\n</video>\n',
    iframe: '\n	<div class="iframe-container">\n<iframe src="这里填链接&autoplay=0" title="" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen loading="lazy" sandbox="allow-scripts allow-same-origin allow-forms"></iframe>\n</div>\n',
    grid: '\n<div id="image-grid">\n<img src="" />\n</div>\n',
    jz: '\n<center><img src="" style="width:50%" /></center>\n',
    meta: '---\ntitle: 标题\ndescription: 简介\ntags: [标签, ]\ncategory: [分类, ]\ncover: \ndate: 2026-02-11\noutline: [2, 3]\n---\n'
  }
  cm.replaceSelection(map[type] || ''); cm.focus()
}
</script>

<style scoped>
/* 强制压制编辑器内所有“伪标题”的大小 */
:deep(.CodeMirror) .cm-header-1, 
:deep(.CodeMirror) .cm-header-2, 
:deep(.CodeMirror) .cm-header-3,
:deep(.CodeMirror) .cm-header {
    font-size: 1.1em !important; /* 强制变回普通大小 */
    font-weight: normal !important; /* 取消加粗 */
    line-height: 1.5 !important;
    color: var(--vp-c-text-1) !important; /* 颜色也变回普通文本色 */
}

/* 专门给横线 --- 降温，不让它撑开距离 */
:deep(.CodeMirror) .cm-hr {
    line-height: 1 !important;
    color: var(--vp-c-divider) !important;
}
/* 压缩每一行的高度，让它看起来更紧凑 */
:deep(.CodeMirror-code) .CodeMirror-line {
    padding-top: 2px !important;
    padding-bottom: 2px !important;
}
.jdy-writer { max-width: 1000px; margin: 0 auto; padding: 20px; color: var(--vp-c-text-1); }

/* 头部 */
.writer-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
.header-logo { font-weight: bold; font-size: 1.2rem; }
.token-wrap input { background: var(--vp-c-bg-soft); border: 1px solid var(--vp-c-divider); padding: 4px 10px; border-radius: 6px; font-size: 11px; width: 120px; margin-right: 8px; }
.token-wrap button { font-size: 12px; font-weight: bold; }

/* 路径与控制 */
.writer-ctrl { align-items: center; display: flex; gap: 10px; margin-bottom: 15px; }
.path-input-wrap { flex: 1; }
.path-input-wrap input { width: 100%; background: var(--vp-c-bg-soft); border: 1px solid var(--vp-c-divider); padding: 10px 15px; border-radius: 5px; outline: none; transition: border 0.3s; }
.path-input-wrap input:focus { border-color: var(--vp-c-brand); }
.btn-pub { padding: 10px 15px;background: var(--vp-c-brand); color: #fff; border-radius: 5px; font-weight: bold; }
.btn-del { padding: 10px 15px;background: #fee2e2; color: #ef4444; border-radius: 5px; }

/* 文件流 */
.file-scroller { display: flex; gap: 8px; overflow-x: auto; padding-bottom: 10px; margin-bottom: 15px; }
.file-chip { background: var(--vp-c-bg-soft); border: 1px solid var(--vp-c-divider); padding: 5px 14px; border-radius: 5px; white-space: nowrap; font-size: 13px; cursor: pointer; transition: 0.2s; }
.file-chip:hover { border-color: var(--vp-c-brand); }
.file-chip.active { background: var(--vp-c-brand-soft); color: var(--vp-c-brand); border-color: var(--vp-c-brand); }

/* 工具 */
.fast-tools { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 15px; }
.fast-tools button { background: var(--vp-c-bg-soft); padding: 4px 12px; border-radius: 5px; font-size: 12px; transition: all 0.2s; border: 1px solid var(--vp-c-divider); }
.fast-tools button:active {
  transform: scale(0.95); /* 点击时的物理反馈 */
  background: var(--vp-c-brand-soft);
}
.fast-tools button:hover {
    border-color: var(--vp-c-brand);
}
/* 工作台：核心改动 */
.workbench { display: flex; gap: 20px; align-items: stretch; height: calc(100vh - 350px); min-height: 500px; }
.editor-area { flex: 1; border: 1px solid var(--vp-c-divider); border-radius: 5px; overflow: hidden; background: var(--vp-c-bg); }
.preview-area { flex: 1; border: 1px solid var(--vp-c-divider); border-radius: 5px; padding: 25px; overflow-y: auto; background: var(--vp-c-bg-soft); }
.empty-tip { color: var(--vp-c-text-3); text-align: center; margin-top: 50px; font-style: italic; }

/* 手机端按钮 */
.mobile-preview-btn { display: none; position: fixed; bottom: 20px; right: 20px; z-index: 100; background: var(--vp-c-brand); color: white; padding: 10px 20px; border-radius: 5px; box-shadow: 0 4px 12px rgba(0,0,0,0.2); font-weight: bold; }

/* 手机端适配逻辑 */
@media (max-width: 768px) {
  .mobile-preview-btn { display: block; }
  .workbench { height: calc(100vh - 300px); }
  .preview-area { display: none; }
  
  /* 预览激活状态 */
  .mobile-preview-active .preview-area { 
    display: block; position: fixed; top: 0; left: 0; right: 0; bottom: 0; 
    z-index: 90; background: var(--vp-c-bg); border: none; border-radius: 0;
    padding-bottom: 80px;
  }
  .mobile-preview-active .editor-area { display: none; }
  .mobile-preview-active .writer-ctrl, 
  .mobile-preview-active .file-scroller,
  .mobile-preview-active .fast-tools,
  .mobile-preview-active .writer-header { display: none; }
}

:deep(.CodeMirror) { border: none !important; font-size: 15px; background: transparent !important; }
:deep(.editor-toolbar) { background: var(--vp-c-bg-soft) !important; border: none !important; border-bottom: 1px solid var(--vp-c-divider) !important; }
/* =============
   手机端适配逻辑
   ============= */
@media (max-width: 768px) {
  /* ... 原有的逻辑保留 ... */

  /* 核心修改：工具栏变宫格布局 */
  .fast-tools {
    display: grid;
    grid-template-columns: repeat(4, 1fr); /* 每行均匀分配 4 个 */
    gap: 8px;
    padding: 10px;
    background: var(--vp-c-bg-alt); /* 淡淡的底色区分区域 */
    border-radius: 5px;
    margin-bottom: 5px;
  }

  .fast-tools button {
    display: flex;
    flex-direction: column; /* 图标在上文字在下，更有 APP 感 */
    align-items: center;
    justify-content: center;
    padding: 8px 0;
    font-size: 11px; /* 字号调小一点 */
    background: var(--vp-c-bg);
    border: 1px solid var(--vp-c-divider);
    border-radius: 5px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.02);
  }

  /* 让“新建”按钮跨两列，显眼一点 */
  .fast-tools button:last-child {
    grid-column: span 2;
    flex-direction: row;
    gap: 5px;
    font-weight: bold;
    border-color: var(--vp-c-brand-soft);
  }

  /* 调整文件流：手机端可以稍微高一点点好点 */
  .file-chip {
    padding: 8px 16px;
    font-size: 12px;
  }
}
/* 遮罩背景：稍微带点暗色渐变 */
.fake-login-overlay {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: radial-gradient(circle at center, var(--vp-c-bg-soft) 0%, var(--vp-c-bg) 100%);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(10px);
}

/* ===================
   登录卡片：更有悬浮感
   =================== */
.fake-login-card {
  position: relative;
  width: 90%;
  max-width: 380px;
  background: var(--vp-c-bg);
  padding: 40px 30px;
  border-radius: 5px;
  border: 1px solid var(--vp-c-divider);
  box-shadow: 0 20px 50px rgba(0,0,0,0.15);
  text-align: center;
}

.card-icon { font-size: 40px; margin-bottom: 15px; }

/* 灵动通知弹窗：像岛一样滑出 */
.custom-alert {
  position: absolute;
  top: -20px;
  left: 50%;
  transform: translateX(-50%);
  background: #1e293b;
  color: #fff;
  padding: 10px 20px;
  border-radius: 5px;
  font-size: 13px;
  white-space: nowrap;
  box-shadow: 0 10px 20px rgba(0,0,0,0.2);
  z-index: 10000;
}

/* 弹窗动画 */
.pop-enter-active, .pop-leave-active { transition: all 0.3s cubic-bezier(0.18, 0.89, 0.32, 1.28); }
.pop-enter-from { opacity: 0; top: 0; }
.pop-leave-to { opacity: 0; top: -20px; }

/* 输入框聚焦效果 */
.input-group input {
  width: 100%;
  background: var(--vp-c-bg-alt);
  border: 1.5px solid transparent;
  padding: 14px;
  border-radius: 5px;
  margin-bottom: 15px;
  transition: all 0.3s;
}
.input-group input:focus {
  border-color: var(--vp-c-brand);
  background: var(--vp-c-bg);
  box-shadow: 0 0 0 4px var(--vp-c-brand-soft);
}

/* 按钮设计 */
.fake-btns { display: flex; gap: 12px; margin-top: 10px; }
.btn-login { flex: 2; background: var(--vp-c-brand); color: white; border-radius: 5px; font-weight: bold; padding: 12px; transition: opacity 0.2s; }
.btn-login:active { opacity: 0.8; }
.btn-cancel { flex: 1; background: var(--vp-c-bg-soft); border: 1px solid var(--vp-c-divider); border-radius: 5px; font-size: 14px; }
</style>