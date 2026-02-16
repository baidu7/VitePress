---
title: jsDelivr链接收集与优缺点对比
description: jsDelivr收集与优缺点对比，安全提醒和强制刷新方法
tags: [jsDelivr, cdn, npm, github]
category: [🌐 网站相关, 信息分享]
cover: https://gcore.jsdelivr.net/gh/baidu8/images@main/img/img-1771268004506.jpg
date: 2026-02-17
outline: [2, 3]
---

这些链接主要围绕 **jsDelivr** 的不同节点和 **GitHub 原始地址**。它们的核心用途是作为“图床”或“脚本加速器”，将 GitHub 仓库里的文件转化为可以直接访问的链接。

---

## 🚀 cdn优缺点对比表

| 链接前缀 | 服务节点 / 类型 | 优点 | 缺点 | 建议场景 |
| --- | --- | --- | --- | --- |
| `cdn.jsdelivr.net` | **官方主线路** | 自动选择全球最优节点，带宽大。 | 在国内部分地区访问不稳定，时有被封锁。 | 常规全球化项目。 |
| `fastly.jsdelivr.net` | **Fastly 节点** | 在某些 CDN 受阻时作为备用，速度较快。 | 稳定性受限于 Fastly 与运营商的链路。 | 备用线路。 |
| `gcore.jsdelivr.net` | **GCore 节点** | 对亚洲（尤其是中国大陆）链路相对友好。 | 缓存更新可能存在延迟。 | **推荐**：国内访问较快。 |
| `testingcf.jsdelivr.net` | **Cloudflare 测试点** | 走 CF 线路，抗攻击强，节点多。 | 仅作为测试节点，稳定性不保证。 | 临时或小众需求。 |
| `quantil.jsdelivr.net` | **Quantil 节点** | 针对亚太地区优化。 | 知名度较低，偶尔会出现解析失败。 | 特定地区加速。 |
| `originfastly.jsdelivr.net` | **回源节点** | 绕过缓存，直接获取最新资源。 | 速度慢，不适合大规模访问，容易被限流。 | 调试最新代码/文件。 |
| `raw.githubusercontent.com` | **GitHub 官方原生** | **最权威**，文件实时更新，无缓存。 | **国内几乎无法直连**，速度极慢。 | 仅限海外环境或本地开发。 |
| `jsd.onmicrosoft.cn/gh/` | **国内特供版** | 专门针对国内线路优化，速度极快，稳定性极佳。 | 由第三方维护，非 jsDelivr 官方，长期政策不确定。 | **首选**：国内网页引用图片/脚本。 |
| `cdn.staticaly.com/gh/` | **Staticaly** | 纯净的 CDN 服务，自动压缩 JS/CSS，支持分支刷新。 | 缓存更新有时比 jsDelivr 还慢。 | 静态网页资源托管。 |
| `raw.staticdn.net/` | **StaticDN** | 简单直接的 GitHub Raw 加速，国内访问较好。 | 不支持 jsDelivr 的某些高级语法（如文件合并）。 | 纯文件加速。 |
| `jsdelivr.b-cdn.net/gh/` | **BunnyCDN 镜像** | 走 BunnyCDN 全球加速，在海外和国内部分地区表现优异。 | 知名度较低，偶尔会被运营商劫持。 | 备用线路。 |
---


### 💡 核心知识点（必看）

1. **缓存机制**：除了 `raw.githubusercontent`，其他 `jsdelivr` 节点都有很强的缓存。如果修改了 GitHub 的图片但链接没变，页面可能还显示旧图。
* **解决：** 在版本号后加 `@latest`（如 `.../gh/user/repo@latest/...`）或刷新 CDN 缓存。


2. **文件大小限制**：jsDelivr 通常限制单个文件最大为 **20MB**。如果上传的图片或视频超过这个限制，链接会报错。
3. **安全性**：这些链接都是公开的。**千万不要**把包含密码、Token 等敏感信息的配置文件传到公开仓库并通过这些链接访问。

### 🛠️ 推荐用法示例

如果想在博客里引用 GitHub `user` 用户的 `repo` 仓库下 `img/1.jpg`：

* **追求国内速度：** `https://gcore.jsdelivr.net/gh/user/repo/img/1.jpg`
* **追求稳定：** `https://cdn.jsdelivr.net/gh/user/repo/img/1.jpg`
* **强制刷新最新版：** `https://cdn.jsdelivr.net/gh/user/repo@latest/img/1.jpg`

> jsDelivr 官方提供的 CDN 缓存刷新工具，标准格式`https://purge.jsdelivr.net/gh/用户名/仓库名@版本号/文件路径`强制 CDN 节点去 GitHub 拉取最新文件。例子`https://purge.jsdelivr.net/gh/user/repo/img/1.jpg`刷新该图片的缓存。

## 🛠️ NPM 非 GitHub

如果链接里包含 `/npm/` 而不是 `/gh/`，以下几个大厂的镜像站更稳：

* **字节跳动静态资源库：** `https://lf6-cdn-tos.bytecdntp.com/cdn/expire-1-M/...`
* *优点：* 国内顶级大厂，速度无敌。


* **知乎镜像 (unpkg)：** `https://unpkg.zhimg.com/...`
* *优点：* 完美同步 NPM 官方库，国内加载速度快。


* **Cloudflare (cdnjs)：** `https://cdnjs.cloudflare.com/ajax/libs/...`
* *优点：* 全球最强 CDN，安全性极高。

### 💡 一个“万能”的转换思路

记住这个规律：大多数 jsDelivr 镜像站的后缀都是一样的，只需要**更换域名前缀**即可：

1. **官方：** `cdn.jsdelivr.net`
2. **紧急切换：** `fastly.jsdelivr.net`
3. **国内加速：** `jsd.onmicrosoft.cn`

## ⚠️ 安全提醒

如果在项目中使用这些加速链接，建议加上 **SRI（子资源完整性）** 校验。

> **例子：** `<script src="链接" integrity="sha384-xxx" crossorigin="anonymous"></script>`
> 这样可以防止 CDN 节点如果被黑，恶意脚本也不会在你的网页上运行。

获取 integrity 指纹（也叫 SRI 哈希值）有几种非常方便的方法。
1. 从 CDN 官网直接复制（最快）
如果你使用的是像 jsDelivr 或 cdnjs 这样的大型平台，它们在提供链接的同时，通常就附带了 SRI 指纹。

cdnjs: 搜索你需要的库，点击“Copy HTML”，它会自动包含 integrity 属性。

jsDelivr: 虽然它的首页简洁，但如果你进入某个包的具体页面，通常也能找到。

2. 使用在线生成工具（最方便）
如果你手头已经有一个 GitHub 加速链接，想给它配个指纹，可以使用专门的生成器网站：

推荐：SRI Hash Generator

用法： 把你的 `https://cdn.jsdelivr.net/...` 链接往里一粘贴，它就会立刻算出 sha256、sha384 或 sha512 的完整 HTML 代码，你直接复制即可。

3. 使用命令行工具（最专业）
如果你是开发者，或者想给本地的文件算个指纹再上传，可以用 openssl 命令。在终端（Terminal/PowerShell）里输入：

```Bash
cat 文件名.js | openssl dgst -sha384 -binary | openssl base64 -A
```
这会输出一串以 sha384- 开头的 Base64 字符串，这就是指纹。

4. 浏览器开发者工具（最极客）
如果你已经把脚本引入了网页，但没加指纹，你可以：
打开网页，按 F12。
在 Network（网络） 面板找到那个 JS 文件。
虽然浏览器不会直接显示哈希，但如果你写错了一个错误的指纹（比如 `integrity="sha384-123"`），浏览器会在 Console（控制台） 报错：
“Expected 'sha384-123' but the computed hash was 'sha384-实际的正确指纹'...”

直接把控制台里报错给出的正确指纹复制出来就好了。（这属于“反向白嫖”浏览器的计算能力）。

### 🎗️️ 特别提醒

如果引用的链接是类似 `.../gh/user/repo@latest/main.js`（带 latest 或没有版本号的），千万不要加 `integrity`！

原因： 因为 latest 意味着文件会随时更新。一旦文件内容变了，指纹也就变了。

结果： 只要更新了代码，旧的指纹就会失效，导致你的网站直接崩溃（脚本无法加载）。

所以，只有在链接中带有固定版本号（如 @1.2.3）时，才建议加上指纹。