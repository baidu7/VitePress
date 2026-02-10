---
title: J-nav纯静态导航
description: 配合 J-Mark 插件，实现书签到导航站的零手工同步
tags: [工具推荐, 极简, 开源项目, J-nav, J-Mark]
category: [🌐 网站相关, 开源分享]
date: 2026-01-19
outline: [2, 3]
next:
  text: 'J-nav配套插件J-Mark'
  link: '/sp/J-Mark'
---

# J-nav：一款能从浏览器书签“自动进化”的纯静态导航

## 🌟 缘起：书签栏的“终极归宿”

我们都有过这种烦恼：浏览器书签存了几百个，找起来费劲；用商业导航站，又怕隐私泄露或广告满天飞。

于是我折腾出了 **J-nav** —— 一个极致纯净的静态导航项目。它不设后台、不接数据库，所有的链接都随你浏览器书签的导出而更新。

极致精简，三个文件加书签数据即可开启你的书签导航网站，体验飞一般的速度

### 🔗 项目名片
- **项目仓库**：[baidu8/J-nav](https://github.com/baidu8/J-nav)
- **配套插件**：[J-Mark (Edge Addons)](https://microsoftedge.microsoft.com/addons/detail/kjphfpemhomnhfcojhgbombbipkginma)
- **Demo**：[江大爷个人导航](https://8.828111.xyz)
- **核心理念**：即插即用，数据随身。

---

## ✨ 为什么它与众不同？

### 1. 丝滑的同步体验：J-Mark 插件
这是 J-nav 的“灵魂”。以往维护导航站需要手动改代码，现在：
- 安装 **J-Mark** 插件。
- 点击“导出数据”，直接生成 `data.js`。
- 将文件替换到 J-nav 目录下，导航站瞬间完成更新。

### 2. 经典的“左侧列表 + 右侧链接”
回归最符合直觉的导航布局。左侧侧边栏快速切换分类，右侧网格平铺链接。

### 3. 细节控的自我修养
- **图标自动抓取**：J-nav 会自动尝试获取目标网站的 Favicon。
- **优雅退级**：如果网站没设图标？别担心，它会自动抓取网站标题的**首个文字**生成漂亮的文字头像，保证视觉不突兀。
- **手机端双栏适配**：在移动端，它不会像普通导航站那样挤成一团，而是采用**双栏显示**，在单手操作和信息密度之间取得了完美平衡。

---

## 🛠️ 快速上手

1. **部署 J-nav**：
   Fork [J-nav 仓库](https://github.com/baidu8/J-nav)，开启 GitHub Pages 即可拥有你的域名。

2. **管理书签**：
   在 Edge 或 GitHub 中安装 [J-Mark](https://github.com/baidu8/J-Mark)。在插件中整理好你的分类。

3. **数据更新**：
   点击插件导出的 `data.js` 覆盖到仓库，搞定！

---

## 💡 结语

J-nav 并不是要做最强大的导航站，而是要做最“省心”的收藏夹。如果你也讨厌繁琐的配置，想让吃灰的书签发挥余热，J-nav 可能是你的最佳选择。

::: tip 💡 提示
目前 J-Mark 已在 Edge 商店上架，安装[J-Mark (Edge Addons)](https://microsoftedge.microsoft.com/addons/detail/kjphfpemhomnhfcojhgbombbipkginma) 即可开启你的极简导航之旅。
:::