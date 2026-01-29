---
layout: page
---

# ** 友情链接**

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
.features {
  display: grid;
  /* 默认（电脑端）：根据宽度自动填充，每个卡片最小 200px */
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 15px; /* 间距稍微调小一点，给手机腾地方 */
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
		min-height: 40px;
		/* --- 新增：超过两行自动显示省略号 --- */
		display: -webkit-box;
		-webkit-line-clamp: 2; /* 这里数字是几，就显示几行 */
		-webkit-box-orient: vertical;
		overflow: hidden;
		text-overflow: ellipsis;
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
  height: 60px; /* 保持和原来的 emoji 高度一致 */
  width: 60px; /* 保持和原来的 emoji 宽度一致 */
  overflow: hidden; /* 隐藏超出容器的部分，方便图片变圆 */
  margin: 0 auto 8px auto; /* 居中并保持底部间距 */
}

.avatar-image {
  width: 100%;  /* 让图片填满父容器 */
  height: 100%; /* 让图片填满父容器 */
  object-fit: cover; /* 保持图片比例，裁剪超出部分 */
  border-radius: 50%; /* 核心：让图片变成圆形 */
		border: 2px solid var(--vp-c-divider); /* 给头像加个细边框 */
}
/* --- 新增：手机端适配 (屏幕宽度小于 640px 时触发) --- */
@media (max-width: 640px) {
  .features {
    /* 核心：强制一行显示两个，平分宽度 */
    grid-template-columns: repeat(2, 1fr); 
    gap: 10px; /* 手机端间距更紧凑 */
  }
  
  .feature-card {
    padding: 16px 8px; /* 手机端卡片内边距调小，防止文字太挤 */
  }
  
  .feature-card .icon {
    width: 45px; /* 手机端头像也缩小一点 */
    height: 45px;
  }
}
</style>