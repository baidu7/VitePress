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

---

<div class="footer-badges">
  <div class="left-badges">
  <img class="no-zoom" src="https://img.shields.io/badge/博主-江大爷-blue?style=flat-square" />
  <img class="no-zoom" src="https://img.shields.io/badge/内容-梦到什么说什么-98FB98?style=flat-square" />
  <img class="no-zoom" src="https://img.shields.io/badge/状态-不定期闭关-blueviolet?style=flat-square" />
  </div>
  <div class="right-badges">
  <img class="no-zoom" src="https://img.shields.io/badge/框架-VitePress-646cff?style=flat-square&logo=vite" />
  <img class="no-zoom" src="https://img.shields.io/badge/技术-Vue3-42b883?style=flat-square&logo=vuedotjs" />
  <img class="no-zoom" src="https://img.shields.io/badge/托管-Cloudflare-f38020?style=flat-square&logo=cloudflare" />
  </div>
</div>

<style scoped>
#my-badges img {
  border-radius: 0 !important;      /* 强制直角 */
}
.footer-badges {
  display: flex;                /* 开启弹性布局 */
  justify-content: space-between; /* 左右两端对齐 */
  align-items: center;
  
  position: fixed;              /* 固定定位 */
  bottom: 20px;                 /* 距离底部 20 像素 */
  left: 50%;                    /* 居中定位起点 */
  transform: translateX(-50%);  /* 完美水平居中修正 */
  
  width: 90%;                   /* 容器宽度，可以根据需要调窄点 */
  max-width: 1000px;            /* 限制最大宽度，别在大屏幕上跑太远 */
  z-index: 10;                  /* 确保它在最上层 */
  pointer-events: none;         /* 防止遮挡下层点击，但里面的徽章要能点 */
}

.left-badges, .right-badges {
  pointer-events: auto;         /* 恢复徽章的点击功能 */
  display: flex;
  gap: 10px;                    /* 徽章之间的间距 */
}

/* 手机端适配：如果屏幕太窄，自动变回一行或隐藏，避免重叠 */
@media (max-width: 768px) {
  .footer-badges {
    position: static;           /* 手机端取消固定，让它老实待在文档流里 */
    transform: none;
    width: 100%;
    flex-direction: column;     /* 垂直排列 */
    gap: 10px;
    margin-top: 50px;
  }
}
</style>