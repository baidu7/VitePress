export default {
  base: '/VitePress/',
  title: "江大爷博客",
  themeConfig: {
    search: { provider: 'local' }, // 搜索框一定要带着
    nav: [{ text: '首页', link: '/' }],
    
    // 📂 这里配置你的文件夹分类
    sidebar: [
      {
        text: '🏠 简介',
        items: [{ text: '关于本站', link: '/about' }]
      },
      {
        text: '🌱 生活随笔',
        collapsed: false,
        items: [{ text: '测试文章', link: '/测试' }]
      },
      {
        text: '💻 技术折腾',
        collapsed: false,
        items: [{ text: '环境搭建', link: '/env-setup' }]
      }
    ],
    socialLinks: [{ icon: 'github', link: 'https://github.com/baidu8' }]
  }
}