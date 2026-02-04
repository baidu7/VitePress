---
layout: page
prev: false
next: false
---

<h1 style="text-align: center;font-size: 20px;font-weight: 900;margin: 14px 0;">友情链接</h1>

<div class="features">
  <a href="https://github.com/baidu8/" target="_blank" class="vp-link">
    <div class="feature-card">
      <div class="icon">
  <img src="https://avatars.githubusercontent.com/u/84177566" alt="江大爷" class="avatar-image">
</div>
      <h4>江大爷</h4>
      <p>本站所有者</p>
    </div>
  </a>
</div>

<style scoped>
/* 1. 容器控制：只影响带有 .features 类的容器 */
.features {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 15px;
  margin-top: 24px;
}

/* 2. 链接控制：专门针对卡片里的链接，不影响徽章链接 */
.features .vp-link {
  text-decoration: none !important;
  display: block; /* 确保链接撑满卡片 */
}

/* 3. 卡片主体 */
.features .feature-card {
  border: 1px solid var(--vp-c-bg-soft);
  border-radius: 12px;
  padding: 24px;
  background-color: var(--vp-c-bg-soft);
  transition: all 0.25s;
  text-align: center;
  cursor: pointer;
  height: 100%; /* 让同一排卡片一样高 */
}

.features .feature-card:hover {
  border-color: var(--vp-c-brand-1);
  background-color: var(--vp-c-bg-mute);
  transform: translateY(-2px);
}

/* 4. 图标/头像容器：精准定位，不影响徽章图标 */
.features .feature-card .icon {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 60px;
  width: 60px;
  overflow: hidden;
  margin: 0 auto 8px auto;
}

/* 5. 关键：只让卡片里的图片变圆，不影响徽章图片 */
.features .feature-card .avatar-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
  border: 2px solid var(--vp-c-divider);
  display: block; /* 消除图片下方的微小间隙 */
}

/* 6. 文字控制 */
.features .feature-card h4 {
  margin: 0;
  font-weight: 600;
  font-size: 16px;
  color: var(--vp-c-text-1);
}

.features .feature-card p {
  margin: 8px 0 0;
  font-size: 14px;
  color: var(--vp-c-text-2);
  min-height: 40px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* 7. 手机端适配 */
@media (max-width: 640px) {
  .features {
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
  }
  .features .feature-card {
    padding: 16px 8px;
  }
  .features .feature-card .icon {
    width: 45px;
    height: 45px;
  }
}
</style>