---
title: J-nav配套插件J-Mark
description: 深度体验一款支持文件夹筛选的书签导出神器
tags: [工具推荐, 浏览器插件, 开源项目, J-nav, J-Mark, 插件]
category: [💾 软件插件, 插件]
date: 2026-01-18
outline: [2, 3]
prev:
  text: 'J-nav纯静态导航'
  link: '/web/J-nav'
next:
  text: 'J-Git浏览器插件'
  link: '/sp/J-Git'
---

# J-nav配套插件J-Mark

让你的浏览器书签一键“变身”精美导航站

## 🚀 你的书签栏，不该只是“吃灰”的列表

每个人浏览器里都存了几百个书签，但真正好用、美观的导航站却寥寥无几。手动维护导航站太累？试试 **J-Mark**。它能直接读取你的书签结构，让你在“管理书签”的同时，顺便就搞定了一个高逼格的个人导航页。

---

## 🛠️ 主角登场：J-Mark

<center><img src="https://cdn.jsdelivr.net/gh/baidu8/J-Mark@main/Snipaste_2026-02-04_01-19-40.png" style="width: 50%;" /></center>

**J-Mark** 是一款专门为书签导出设计的浏览器扩展。

### 1. 灵活的文件夹筛选
如果你有几百个文件夹，并不是所有都适合放上导航站。J-Mark 提供了极其好用的**选择机制**：
- **精准筛选**：勾选你想要导出的文件夹，屏蔽私人或杂乱的分类。
- **高效搜索**：文件夹太多找不到？直接在插件内**搜索文件夹名称**，快速定位。
- **批量操作**：支持**一键全选/反选**，几秒钟就能完成导出配置。

### 2. 多种安装方式
- **商店直达**：[Edge 外挂商店下载](https://microsoftedge.microsoft.com/addons/detail/kjphfpemhomnhfcojhgbombbipkginma)（推荐，自动更新）。
- **开源下载**：[GitHub - baidu8/J-Mark](https://github.com/baidu8/J-Mark)（支持手动加载安装）。

---

## 🎨 产出物：极简导航页 J-nav

通过 J-Mark 一键导出的 `data.js`，配合配套的静态导航模板 **[J-nav](https://github.com/baidu8/J-nav)**，你可以瞬间拥有：

- **左侧分类 + 右侧链接**：最经典的导航体验。
- **手机端双栏显示**：针对移动端专门优化的排版。
- **纯静态加载**：无需服务器，GitHub Pages 秒开。


---

## 💡 怎么用最爽？

1. **整理书签**：在浏览器里把想展示的链接归类到几个文件夹。
2. **J-Mark 导出**：打开插件，通过**搜索或全选**功能勾选这些文件夹，点击“导出数据”。
3. **部署上线**：将生成的 `data.js` 替换到你的导航仓库，搞定！

---

## 🌟 结语

J-Mark 的核心价值在于：**它不改变你的使用习惯**。你依然在用浏览器自带的书签功能，但它给了你一个更体面、更跨平台的展示方式。

如果你也想让书签栏焕发新生，强烈建议尝试一下。

::: tip 💡 提示
如果你还嫌麻烦，再弄上这个插件[J-git](/sp/J-Git)GitHub都不用登了
:::

> **项目地址**：
> - 插件：[baidu8/J-Mark](https://github.com/baidu8/J-Mark)
> - 导航：[baidu8/J-nav](https://github.com/baidu8/J-nav)