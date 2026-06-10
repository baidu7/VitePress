---
title: J-R2-drive Cloudflare R2
description: 告别繁琐配置，只需一个 Worker 即可打造带暗号验证、磨砂玻璃视觉效果的私人云盘。支持一键部署，让 R2 像空气一样简单。
tags: [Cloudflare, R2, 网盘, 开源项目, 教程]
category: [?? 网站相关, 开源分享]
cover: https://gcore.jsdelivr.net/gh/baidu7/images@main/img/img-1771268004506.jpg
date: 2026-02-16
outline: [2, 3]
---

## ?? 前言

它的定位很简单：**轻量、好看、安全**。
不需要服务器，不需要数据库，只要你有 Cloudflare 账号，就能拥有一个专属的、带暗号保护的私人网盘。

## ✨ 核心亮点

### 1. 视觉系黑金 UI
采用了磨砂玻璃（Glassmorphism）设计语言，薄荷绿点缀黑金底色，质感拉满。支持上传进度条显示，告别盲等。

### 2. 极简部署流程
支持 GitHub 一键部署按钮。通过 `wrangler.toml` 预设，即使是小白，点击一下也能在 60 秒内完成部署。

### 3. “进门暗号”安全校验
内置 Cookie 验证机制。你可以自定义“准入暗号”，拒绝任何不请自来的访客，确保 R2 存储额度不被滥用。

### 4. 灵活的列表管理
支持分页加载，支持一键复制文件直链、一键永久删除。

## ?? 快速上手

### 第一步：获取代码
访问我的 GitHub 仓库：`https://github.com/baidu7/j-r2-drive`（记得给个 Star ??）。

### 第二步：一键部署
点击 README 里的蓝色 **Deploy to Cloudflare Workers** 按钮，按照提示：
1. 绑定你的 **R2 Bucket**（如果没有，现场建一个）。
2. 设置环境变量 `ADMIN_PASS`（你的进门暗号）。

### 第三步：绑定域名
为了方便访问，建议在 Cloudflare 后台为该 Worker 绑定一个自己的二级域名。

## ??️ 进阶安全建议（老司机叮嘱）

虽然代码里已经有了暗号验证，但作为“保镖”，Cloudflare 后台还有几招可以封神：

1. **速率限制 (Rate Limiting)**：在 WAF 里设置每分钟请求限制，防止有人暴力破解暗号。
2. **地理位置过滤**：如果你只在国内用，可以在 WAF 规则里直接屏蔽掉海外 IP。
3. **安全拦截不计费**：记住，所有在 WAF 防火墙被拦下的请求，是不消耗你的 Worker 运行额度的。


## ?? 结语

**J-R2-drive** 不只是一个网盘，它是我对“极简技术”的一种追求。代码已经全部开源，欢迎各位后生拿去折腾，有 Bug 提 Issue，好用请留 Star。

让 R2 存储，从此像空气一样自由且简单。

---
**项目地址：** [GitHub/J-R2-drive](https://github.com/baidu7/j-r2-drive)