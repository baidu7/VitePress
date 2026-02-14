---
title: 👤 关于我
outline: false        # 顺便把右侧大纲也关了，更清爽
breadcrumb: false     # 如果插件支持面包屑开关
lastUpdated: false    # 关掉右侧那个“最后更新”
editLink: false       # 关掉编辑链接
---

# 👤 关于我
* **坐标**：山东济南
* **兴趣**：折腾 这个、研究 那个、打打 游戏、说说 梦话。

### 📩 联系方式
- **GitHub**: [baidu8](https://github.com/baidu8)
- **Email**: [1@828111.xyz](mailto:1@828111.xyz)

### 🚀 折腾足迹
<br />
<div class="timeline-item">

**2026.02** 自定义播放器，实现了平滑的点击交互和 PWA 适配。

</div>

<div class="timeline-item">

**2026.01** 将个人博客迁移至 VitePress 架构，并部署于 Cloudflare Pages。

</div>

<div class="timeline-item">

**2025.12** 开始深入研究 Vue 3 响应式原理。

</div>


### 🛠️ 核心装备库

<br />
<div class="about-card">
  <span class="skill-tag">VitePress</span>
  <span class="skill-tag">Vue 3.0</span>
  <span class="skill-tag">Tailwind CSS</span>
  <span class="skill-tag">Cloudflare</span>
  <span class="skill-tag">Git / GitHub</span>
  <span class="skill-tag">JavaScript</span>
</div>


## ⏳ 岁月见证

<div style="margin: 2rem 0; padding: 20px; background: var(--vp-c-bg-soft); border: 1px solid var(--vp-c-divider); border-radius: 5px; text-align: center;">
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
<style>
.article-top-box { display: none !important; }
.vp-doc a {
  /* 1. 去除下划线 */
  text-decoration: none;
  
  /* 2. 让颜色跟随父级文字，或者直接定死颜色 */
  color: #00b894; 
}

/* 💡 建议：虽然平时不显示，但鼠标摸上去时给点反馈，用户体验更好 */
.vp-doc a:hover {
  color: #00b894; /* 摸上去变果冻绿 */
  text-decoration: underline; /* 此时可以考虑加回下划线，或者干脆不加 */
}
/* 技能标签 */
.skill-tag {
  display: inline-block;
  padding: 4px 12px;
  margin: 4px;
  border-radius: 5px;
  background: rgba(0, 184, 148, 0.1);
  color: #00b894;
  font-size: 14px;
  font-weight: bold;
}
/* 时间轴 */
.timeline-item {
  border-left: 2px solid #00b894;
  padding-left: 20px;
  margin-bottom: 20px;
  position: relative;
}
.timeline-item::before {
  content: "";
  position: absolute;
  left: -7px;
  top: 5px;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #00b894;
}
</style>