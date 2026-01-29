---
layout: page
---

<VPTeamMembers :members="links" />

<script setup>
const links = [
  {
    avatar: 'https://github.com/yyx990803.png',
    name: '尤雨溪',
    title: 'Vue & Vite 创始人',
    links: [{ icon: 'github', link: 'https://github.com/yyx990803' }]
  },
  {
    avatar: 'https://github.com/baidu8.png',
    name: '江大爷',
    title: '硬核博主',
    links: [{ icon: 'github', link: 'https://github.com/baidu8' }]
  }
]
</script>