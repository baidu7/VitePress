---
layout: page
title: 友情链接
---

# 🤝 友情链接

<div class="features">
  <a href="https://www.baidu.com" target="_blank" class="vp-link">
    <div class="feature-card">
      <div class="icon">🔍</div>
      <h4>百度</h4>
      <p>搜索引擎老大</p>
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
</style>