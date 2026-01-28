export default {
  base: '/VitePress/',
  title: "江大爷博客",
  description: "梦到什么说什么",
  themeConfig: {
    // 🔍 开启本地搜索
    search: {
      provider: 'local'
    },
    nav: [
      { text: '首页', link: '/' }
    ],
    // 📂 文件夹形式的边栏
    sidebar: [
      {
        text: '📖 文章合集',
        collapsed: false, // 是否默认折叠
        items: [
          // 你可以手动加几个分类，或者保持我们之前的自动逻辑
          // 如果想纯自动，可以参考下面这个简单的配置
          { text: '返回首页', link: '/' },
        ]
      }
    ],
    socialLinks: [
      { icon: 'github', link: 'https://github.com/baidu8' }
    ]
  }
}