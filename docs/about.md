---
title: 👤 关于我
prev: false
next: false
---

# 👤 关于我

这里是 **江大爷** 的博客。

### 🌟 个人简介
* **坐标**：山东济南
* **兴趣**：折腾 这个、研究 那个、打打 游戏、说说 梦话。

### 📩 联系方式
- **GitHub**: [baidu8](https://github.com/baidu8)
- **Email**: [1@828111.xyz](mailto:1@828111.xyz)

### 🛠️ 本站技术栈
- **框架**: [VitePress](https://vitepress.dev/)
- **部署**: [Cloudflare Pages](https://pages.cloudflare.com/)
- **域名**: [828111.xyz](https://828111.xyz)


## ⏳ 岁月见证 · 博客年鉴

<div style="margin: 2rem 0; padding: 20px; background: var(--vp-c-bg-soft); border: 1px solid var(--vp-c-divider); border-radius: 12px; text-align: center;">
  <div style="font-size: 0.9rem; color: var(--vp-c-text-2); margin-bottom: 10px;">本站已稳定运行</div>
  
  <div style="display: flex; justify-content: center; gap: 10px; font-weight: bold; font-family: monospace;">
    <span style="font-size: 1.5rem;"><span id="d_num">0</span> <small style="font-size: 0.8rem; opacity: 0.6;">天</small></span>
    <span style="font-size: 1.5rem;"><span id="h_num">0</span> <small style="font-size: 0.8rem; opacity: 0.6;">时</small></span>
    <span style="font-size: 1.5rem;"><span id="m_num">0</span> <small style="font-size: 0.8rem; opacity: 0.6;">分</small></span>
    <span style="font-size: 1.5rem; color: #C40000;"><span id="s_num">0</span> <small style="font-size: 0.8rem; opacity: 0.6;">秒</small></span>
  </div>

  <div style="margin-top: 10px; font-size: 0.8rem; color: var(--vp-c-text-3);">自 2026年01月20日 启航</div>
</div>

<script setup>
import { onMounted, onUnmounted } from 'vue'

onMounted(() => {
  const update = () => {
    const start = new Date("01/20/2026 21:07:13")
    const now = new Date()
    const diff = now - start
    
    // 直接操作 DOM，这是在 MD 里最稳妥的办法
    document.getElementById('d_num').innerText = Math.floor(diff / (24 * 3600 * 1000))
    document.getElementById('h_num').innerText = Math.floor((diff % (24 * 3600 * 1000)) / (3600 * 1000))
    document.getElementById('m_num').innerText = Math.floor((diff % (3600 * 1000)) / (60 * 1000))
    document.getElementById('s_num').innerText = Math.floor((diff % (60 * 1000)) / 1000)
  }

  update()
  const timer = setInterval(update, 1000)
  
  // 离开页面时记得清理
  onUnmounted(() => clearInterval(timer))
})
</script>
