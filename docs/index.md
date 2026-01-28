---
layout: home
---

# 📝 我的文章列表

<div v-for="post in posts" :key="post.link" style="margin: 15px 0; padding: 20px; border: 2px solid #3eaf7c; border-radius: 12px; background: #f9f9f9;">
  <a :href="post.link" style="font-size: 1.25rem; font-weight: 600; color: #3eaf7c; text-decoration: none;">
    📄 {{ post.text }}
  </a>
</div>

<script setup>
import { data as posts } from './.vitepress/posts.data.mjs'
</script>