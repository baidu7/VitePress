---
layout: doc
prev: false
next: false
---

<div class="main-header-box">
  <h1>江大爷的随想空间</h1>
  <p>记录生活，分享点滴，梦到什么说什么，主打随意</p>
  <ul>
    <li>找文章：戳右上角的搜索框，快捷键 <kbd>Ctrl</kbd> + <kbd>K</kbd> 快速查找。</li>
  </ul>
</div>

<RandomQuote />

---

<div class="card-container">
  <a class="nav-card" href="https://github.com/baidu8/" target="_blank">
    <div class="card-icon"><img class="no-zoom" src="https://avatars.githubusercontent.com/u/84177566" /></div>
    <div class="card-content">
      <div class="card-title">江大爷</div>
      <div class="card-desc">本站所有者</div>
    </div>
  </a>
  <a class="nav-card" href="https://github.com/baidu8/" target="_blank">
    <div class="card-icon"><img class="no-zoom" src="https://avatars.githubusercontent.com/u/84177566" /></div>
    <div class="card-content">
      <div class="card-title">占位</div>
      <div class="card-desc">占位</div>
    </div>
  </a>
  <a class="nav-card" href="https://github.com/baidu8/" target="_blank">
    <div class="card-icon"><img class="no-zoom" src="https://avatars.githubusercontent.com/u/84177566" /></div>
    <div class="card-content">
      <div class="card-title">占位</div>
      <div class="card-desc">占位</div>
    </div>
  </a>
  <a class="nav-card" href="https://github.com/baidu8/" target="_blank">
    <div class="card-icon"><img class="no-zoom" src="https://avatars.githubusercontent.com/u/84177566" /></div>
    <div class="card-content">
      <div class="card-title">占位</div>
      <div class="card-desc">占位</div>
    </div>
  </a>
</div>

---

<div id="footer-console">
  <div id="left-group">
  <img class="no-zoom" src="https://img.shields.io/badge/博主-江大爷-blue?style=flat-square" />
  <img class="no-zoom" src="https://img.shields.io/badge/内容-随意-98FB98?style=flat-square" />
  <img class="no-zoom" src="https://img.shields.io/badge/状态-不定期闭关-blueviolet?style=flat-square" />
  </div>
  <div class="divider"></div>
  <div id="right-group">
  <img class="no-zoom" src="https://img.shields.io/badge/框架-VitePress-646cff?style=flat-square&logo=vite" />
  <img class="no-zoom" src="https://img.shields.io/badge/技术-Vue3-42b883?style=flat-square&logo=vuedotjs" />
  <img class="no-zoom" src="https://img.shields.io/badge/托管-Cloudflare-f38020?style=flat-square&logo=cloudflare" />
  </div>
</div>

<style scoped>
/* 标题区：不封口，只留左侧立柱 */
.main-header-box {
  border-left: 4px solid #ff5f56; /* 呼应下方红色 */
  padding-left: 20px;
  margin-bottom: 40px;
  background: transparent;
}
.card-container {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin: 20px 0;
  width: 100%;
}

.nav-card {
  flex: 1 1 calc(25% - 12px);
  min-width: 0;
  display: flex;
  align-items: center;
  /* 重点 1：调低高度，缩减上下 padding */
  padding: 8px 12px; 
  border: 1px solid #e2e2e2;
  background: #fff;
  text-decoration: none !important;
  box-shadow: 2px 2px 0px rgba(0,0,0,0.05);
  transition: all 0.2s ease;
  overflow: hidden; /* 确保内容不溢出 */
}

.nav-card:hover {
  transform: translate(1px, 1px); /* 细微按压感 */
  box-shadow: 0px 0px 0px transparent;
  border-color: #5483c9c7;
}

.card-icon {
  width: 24px;  /* 稍微缩小图标，配合低高度 */
  height: 24px;
  margin-right: 10px;
  flex-shrink: 0;
}

.card-content {
  flex: 1;
  min-width: 0; /* 允许子元素缩放以触发省略号 */
}

.card-title {
  font-weight: bold;
  font-size: 14px;
  color: #333;
  margin: 0;
  /* 标题防溢出 */
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.card-desc {
  font-size: 11px;
  color: #999;
  margin: 0;
  /* 重点 2：简介强制单行省略 */
  white-space: nowrap; 
  overflow: hidden;
  text-overflow: ellipsis;
  display: block; 
}

/* 🌙 黑暗模式 */
.dark .nav-card {
  background: #1a1a1a;
  border-color: #333;
}
.dark .nav-card:hover { border-color: #ff5f56; }
.dark .card-title { color: #eee; }
.dark .card-desc { color: #777; }

/* 📱 手机端：2 个一排 */
@media (max-width: 640px) {
  .nav-card {
    flex: 1 1 calc(50% - 12px);
    min-width: calc(50% - 12px);
  }
}
#footer-console {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 20px;
    border: 2px solid #f1f1f5;
    border-radius: 0 !important;
    padding: 10px 20px;
    margin: 60px auto 30px;
    background: #f6f6f7;
    max-width: fit-content;
    box-shadow: 6px 6px #c8d2dd;
    transition: all .3s ease;
}

/* 🌙 黑暗模式适配：当 html 包含 .dark 类时生效 */
:slotted(.dark) #footer-console, 
.dark #footer-console {
  background: #1a1a1a !important;   /* 深色背景 */
  border-color: #1e1e1e !important;    /* 边框稍微亮一点点 */
  box-shadow: 6px 6px 0px #000 !important; /* 纯黑阴影更深邃 */
}

/* 内部的小组也可以强制直角 */
#left-group img, 
#right-group img {
  border-radius: 0 !important; /* 强制徽章本身也变直角 */
  border: 1px solid #eee;
}

/* 🌙 黑暗模式下的徽章边框 */
.dark #left-group img, 
.dark #right-group img {
  border-color: #333;
}

.divider {
  width: 2px;
  height: 30px;
  background: #333;
}

/* 🌙 黑暗模式下的分割线 */
.dark .divider {
  background: #555;
}

/* 适配手机端 */
@media (max-width: 640px) {
  #footer-console {
    flex-direction: column;
    box-shadow: 4px 4px 0px #c8d2dd;
  }
  .dark #footer-console {
    box-shadow: 4px 4px 0px #000;
  }
  .divider {
    width: 80%;
    height: 2px;
  }
}
</style>