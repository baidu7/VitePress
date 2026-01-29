---
layout: page
---
    
    

# 🤝 友情链接

<div class="features">
  <a href="https://www.baidu.com" target="_blank" class="vp-link">
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
.features {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
  margin-top: 24px;
}
.feature-card {
  border: 1px solid var(--vp-c-bg-soft);
  border-radius: 12px;
  padding: 24px;
  background-color: var(--vp-c-bg-soft);
  transition: border-color 0.25s, background-color 0.25s;
  text-align: center;
  cursor: pointer;
}
.feature-card:hover {
  border-color: var(--vp-c-brand-1);
  background-color: var(--vp-c-bg-mute);
}
.feature-card .icon {
  font-size: 40px;
  margin-bottom: 8px;
}
.feature-card h4 {
  margin: 0;
  font-weight: 600;
  font-size: 16px;
}
.feature-card p {
  margin: 8px 0 0;
  font-size: 14px;
  color: var(--vp-c-text-2);
}
.vp-link {
  text-decoration: none !important;
}
	.feature-card .icon {
  font-size: 40px; /* 这个可以留着，也可以删掉，因为图片有自己的大小 */
  margin-bottom: 8px;
  /* 增加 flex 布局，让图片在 icon 容器中居中 */
  display: flex;
  justify-content: center;
  align-items: center;
  height: 40px; /* 保持和原来的 emoji 高度一致 */
  width: 40px; /* 保持和原来的 emoji 宽度一致 */
  overflow: hidden; /* 隐藏超出容器的部分，方便图片变圆 */
  margin: 0 auto 8px auto; /* 居中并保持底部间距 */
}

.avatar-image {
  width: 100%;  /* 让图片填满父容器 */
  height: 100%; /* 让图片填满父容器 */
  object-fit: cover; /* 保持图片比例，裁剪超出部分 */
  border-radius: 50%; /* 核心：让图片变成圆形 */
}
</style>