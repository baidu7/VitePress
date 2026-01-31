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
/* 顶部主标题区域的硬核直角框 */
.main-header-box {
  border: 2px solid #333;      /* 硬核粗边框 */
  background: #fff;
  padding: 25px;               /* 比卡片和金句框稍大一点的内边距 */
  margin: 0 auto 30px auto;    /* 自动居中，底部留空 */
  box-shadow: 6px 6px 0px #333; /* 更大的硬阴影，突出主标题 */
  border-radius: 0 !important; /* 强制直角 */
  transition: all 0.3s ease;   /* 颜色切换过渡 */
}

/* 🌙 黑暗模式适配 */
.dark .main-header-box {
  background: #1a1a1a !important;
  border-color: #444 !important;
  box-shadow: 6px 6px 0px #000 !important;
}

/* 如果标题文字在黑暗模式下看不清，也可以这样调整 */
.dark .main-header-box h1,
.dark .main-header-box p,
.dark .main-header-box li {
  color: #eee !important;
}
.card-container {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  margin: 30px 0;
  width: 100%;
}

/* 2. 卡片本体：解决溢出的关键是 overflow: hidden */
.nav-card {
  /* 电脑端 4 个一排的计算方式 */
  flex: 1 1 calc(25% - 15px); 
  min-width: 0;                /* 重点：防止子元素把 flex 容器撑开 */
  display: flex;
  align-items: center;
  padding: 12px;
  border: 2px solid #333;
  background: #fff;
  text-decoration: none !important;
  transition: all 0.2s ease;
  box-shadow: 4px 4px 0px #333;
  overflow: hidden;            /* 裁掉跑出去的内容 */
}

/* 3. 文字区域：一定要设置宽度或 flex-shrink */
.card-content {
  flex: 1;
  min-width: 0;                /* 重点：让内容区可以收缩 */
}

.card-title {
  font-weight: 900;
  font-size: 15px;
  color: #333;
  margin-bottom: 2px;
  /* 标题也防一手溢出 */
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.card-desc {
  font-size: 12px;
  color: #666;
  /* 重点：这就是变省略号的神技 */
  white-space: nowrap;         /* 禁止换行 */
  overflow: hidden;            /* 隐藏超出部分 */
  text-overflow: ellipsis;     /* 变成省略号 */
  display: block;              /* 确保它占满一行 */
}

/* 📱 手机端适配：强制 2 个一排 */
@media (max-width: 640px) {
  .nav-card {
    flex: 1 1 calc(50% - 15px); /* 手机端各占 50% */
    min-width: calc(50% - 15px);
  }
}

/* 🌙 黑暗模式同步（保持原样） */
.dark .nav-card { background: #1a1a1a; border-color: #444; box-shadow: 4px 4px 0px #000; }
.dark .card-title { color: #eee; }
.dark .card-desc { color: #aaa; }
/* 图标容器 */
.card-icon {
  width: 32px;            /* 固定宽度，保证文字对齐 */
  height: 32px;           /* 固定高度 */
  margin-right: 12px;
  flex-shrink: 0;         /* 重点：防止图片被挤扁 */
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 图片本身 */
.card-icon img {
  width: 100%;
  height: 100%;
  object-fit: contain;    /* 保证图片比例不失真 */
  border-radius: 4px;     /* 如果您想硬核到底，可以改成 0 */
  cursor: default !important; /* 彻底干掉放大镜指针 */
}
.dark .card-icon img {
  filter: brightness(0.9); /* 稍微降低一点亮度，不刺眼 */
}
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
  transition: all 0.3s ease;    /* 增加一个颜色切换的过渡，更丝滑 */
}

/* 🌙 黑暗模式适配：当 html 包含 .dark 类时生效 */
:slotted(.dark) #footer-console, 
.dark #footer-console {
  background: #1a1a1a !important;   /* 深色背景 */
  border-color: #555 !important;    /* 边框稍微亮一点点 */
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
    box-shadow: 4px 4px 0px #333;
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