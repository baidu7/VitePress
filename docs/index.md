---
layout: doc
prev: false
next: false
---

<h1 style="text-align: center;font-size: 30px;font-weight: 900;">🚀 江大爷的随想空间</h1>

<p style="text-align: center;font-size: 20px;font-weight: 900;color: #777777;" class="">记录生活，分享点滴，梦到什么说什么，主打随意</p>

### 🔍 快速开始
* **找文章**：直接看左边的目录，点击分类即可展开。
* **搜内容**：点击右上角的搜索框，或按 `Ctrl + K` 快速查找。
* **换心情**：点击右上角的太阳/月亮图标，体验丝滑的切换动画。

<RandomQuote />

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
#footer-console {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  
  /* 强行直角设计 */
  border: 2px solid #333;      /* 深色粗边框增强工业感 */
  border-radius: 0 !important; /* 彻底干掉圆角 */
  
  padding: 10px 20px;
  margin: 60px auto 30px;
  background: #f9f9f9;         /* 纯净浅色背景 */
  max-width: fit-content;
  box-shadow: 6px 6px 0px #333; /* 这种硬阴影跟直角最搭 */
}

/* 内部的小组也可以强制直角（如果图片自带圆角，这一招能封印它） */
#left-group img, 
#right-group img {
  border-radius: 0 !important; /* 强制徽章本身也变直角 */
  border: 1px solid #eee;
}

.divider {
  width: 2px;
  height: 30px;
  background: #333;
}

/* 适配手机端 */
@media (max-width: 640px) {
  #footer-console {
    flex-direction: column;
    box-shadow: 4px 4px 0px #333;
  }
  .divider {
    width: 80%;
    height: 2px;
  }
}
</style>