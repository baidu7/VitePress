export default {
  title: "江大爷博客",
  description: "梦到什么说什么",
  themeConfig: {
    // 右上角的导航栏
    nav: [
      { text: '首页', link: '/' },
      { text: '我的文章', link: '/my-first-post' } // 这里的 link 要对应你 md 文件的名字
    ],
    // 左侧的文章列表
    sidebar: [
      {
        text: '文章列表',
        items: [
          { text: '第一篇文章', link: '/my-first-post' }, 
          // 以后每写一篇新文章，就在这里加一行
        ]
      }
    ],
    socialLinks: [
      { icon: 'github', link: 'https://github.com/baidu8' }
    ]
  }
}
