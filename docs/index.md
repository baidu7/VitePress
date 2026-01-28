---
layout: home
---

# 📝 我的文章归档

<div v-for="post in posts" :key="post.link" style="margin: 20px 0; padding: 15px; border: 1px solid #eee; border-radius: 8px;">
  <a :href="post.link" style="font-size: 1.2rem; font-weight: bold; color: var(--vp-c-brand);">
    {{ post.text }}
  </a>
</div>

<script setup>
import { data as posts } from './.vitepress/posts.data.mjs'
</script>