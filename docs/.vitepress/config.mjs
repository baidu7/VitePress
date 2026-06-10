// .vitepress/config.mjs
import { defineConfig } from 'vitepress'
import { withPwa } from '@vite-pwa/vitepress'

// 【核心修复 1】在这里补上 getAutoNav，把它从 sidebar.mjs 里接过来
import { getCategorySidebar, getAutoNav } from './configs/sidebar.mjs'

import { pwaConfig } from './configs/pwa.mjs'
import { transformPageData } from './configs/plugins.mjs'

export default withPwa(defineConfig({
  title: "江大爷",
  description: "闲来无事，记点东西",
		sitemap: {
		    hostname: 'https://828111.xyz'
		  },
		base: '/',
		head: [
		    // 1. 给现代浏览器（Chrome, Safari, Firefox）用 SVG，清晰且支持换色
		    ['link', { rel: 'icon', href: '/favicon.svg', type: 'image/svg+xml' }],
		    
		    // 2. 给老掉牙的浏览器留个保底，放个旧款 ico
		    ['link', { rel: 'alternate icon', href: '/favicon.ico', type: 'image/png' }],
		  ],
  cleanUrls: true,
  pwa: pwaConfig,
  transformPageData,
  themeConfig: {
    sidebarMenuLabel: '菜单',
    returnToTopLabel: '返回顶部',
    outline: { level: [2, 3], label: '本页目录' },
				darkModeSwitchLabel: '外观',     // 对应 Appearance
				lightModeSwitchTitle: '切换到亮色模式',
				darkModeSwitchTitle: '切换到深色模式',
    // 【核心修复 2】只保留这一行自动导航，把下面那个手动写的 nav 删掉
    nav: getAutoNav(),
    sidebar: getCategorySidebar(),
    docFooter: { prev: '上一篇', next: '下一篇' },
    search: { 
      provider: 'local',
      options: {
        locales: {
          root: {
            translations: {
              button: {
                buttonText: '搜索文档',
                buttonAriaLabel: '搜索文档'
              },
              modal: {
                noResultsText: '无法找到相关结果',
                resetButtonTitle: '清除查询条件',
																displayDetails: '显示详情列表',
                footer: {
                  selectText: '选择',
                  navigateText: '切换',
                  closeText: '关闭'
                }
              }
            }
          }
        }
      }
    }
  }
}))