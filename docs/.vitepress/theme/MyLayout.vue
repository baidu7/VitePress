<script setup lang="ts">
import { useData } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import { nextTick, provide, watch, onMounted, onUnmounted, ref } from 'vue' // 增加了 onUnmounted 和 ref
import WelcomeToast from './components/WelcomeToast.vue'
import AiAssistant from './components/AiAssistant.vue'

const { frontmatter, isDark, page } = useData()
const { Layout } = DefaultTheme

// 在 script setup 里的逻辑
const getRelativeTime = (date: string | number) => {
  const dateSource = date || page.value.lastUpdated;
  if (!dateSource) return '最近';

  const targetDate = new Date(dateSource);
  const now = new Date();
  const diff = Math.floor((now.getTime() - targetDate.getTime()) / (1000 * 60 * 60 * 24));
  
  if (isNaN(diff)) return dateSource; 
  if (diff <= 0) return '今天';
  if (diff < 7) return `${diff} 天前`;
  if (diff < 30) return `${Math.floor(diff / 7)} 周前`;
  if (diff < 365) return `${Math.floor(diff / 30)} 个月前`;
  return `${Math.floor(diff / 365)} 年前`;
}

// --- 1. 运行计时逻辑 (新增) ---
const runTime = ref({ d: 0, h: 0, m: 0, s: 0 })
let timerId: any = null

const updateRunTime = () => {
  const start = new Date("01/20/2026 21:07:13")
  const now = new Date()
  const diff = now.getTime() - start.getTime()
  
  runTime.value = {
    d: Math.floor(diff / (24 * 3600 * 1000)),
    h: Math.floor((diff % (24 * 3600 * 1000)) / (3600 * 1000)),
    m: Math.floor((diff % (3600 * 1000)) / (60 * 1000)),
    s: Math.floor((diff % (60 * 1000)) / 1000)
  }
}

// --- 2. 主题颜色同步逻辑 ---
const updateThemeColor = () => {
  const color = isDark.value ? '#1b1b1f' : '#ffffff'
  const meta = document.querySelector('meta[name="theme-color"]')
  if (meta) meta.setAttribute('content', color)
}

// 生命周期钩子
onMounted(() => {
  updateThemeColor()
  updateRunTime()
  timerId = setInterval(updateRunTime, 1000)
})

onUnmounted(() => {
  if (timerId) clearInterval(timerId)
})

watch(isDark, updateThemeColor)

// --- 3. 圆形切换动画逻辑 ---
const enableTransitions = () =>
  'startViewTransition' in document &&
  window.matchMedia('(prefers-reduced-motion: no-preference)').matches

provide('toggle-appearance', async () => {
  if (!enableTransitions()) {
    isDark.value = !isDark.value
    return
  }

  // 1. 定义卷轴展开的路径（从中间的一条线，向上下两端展开）
  const clipPath = [
    'inset(50% 0 50% 0)', // 起点：中间的一条横线（上下都缩进50%）
    'inset(0 0 0 0)'      // 终点：完全展开
  ]

  await (document as any).startViewTransition(async () => {
    isDark.value = !isDark.value
    await nextTick()
  }).ready

  // 2. 执行动画
  document.documentElement.animate(
    {
      // 切换模式时，路径正反运行
      clipPath: isDark.value ? clipPath.reverse() : clipPath
    },
    {
      duration: 600, // 卷轴展开要慢一点才优雅
      easing: 'cubic-bezier(0.645, 0.045, 0.355, 1)', // 经典的平滑展开曲线
      fill: 'forwards',
      pseudoElement: `::view-transition-${isDark.value ? 'old' : 'new'}(root)`
    }
  )
})
</script>

<template>
  <Layout>
			<template #sidebar-nav-before>
			  <div class="sidebar-profile">
			    <div class="avatar-box">
			      <img src="/img/avatar.png" alt="江大爷" class="sidebar-avatar" />
									<div class="status-badge" title="若无烦心事，便是好时节">
									    <span>🤔</span> 
									  </div>
			    </div>
			    <div class="profile-info">
			      <h3 class="user-name">江大爷</h3>
			      <p class="user-motto">梦到什么说什么</p>
			    </div>
			  </div>
			</template>
    <template #doc-before>
          <div class="article-top-box">
              <div class="custom-breadcrumb">
                <a href="/">🏠 首页</a> 
                <span class="sep"> / </span> 
                
                <span v-if="frontmatter.category" class="curr-cat">
                  <a 
                    :href="'/?tag=' + (Array.isArray(frontmatter.category) ? frontmatter.category[frontmatter.category.length - 1] : frontmatter.category)" 
                    class="cat-link"
                  >
                    {{ Array.isArray(frontmatter.category) ? frontmatter.category[frontmatter.category.length - 1] : frontmatter.category }}
                  </a>
                </span>
                <span v-else class="curr-cat">📝 正文</span>
              </div>
              <div class="article-subtitle-meta">
                <span>最后更新：{{ getRelativeTime(frontmatter.date) }}</span>
              </div>
												</div>
    </template>

    <template #doc-footer-before>
      <slot name="doc-footer-before" />
    </template>

    <template #layout-bottom>
					<footer v-if="frontmatter.layout === 'home'" class="custom-footer">
					    <div class="footer-container">
					      
					      <div class="footer-badges">
					        <img class="no-zoom" src="/img/badges/jdy.svg" />
					        <img class="no-zoom" src="/img/badges/sy.svg" />
					        <img class="no-zoom" src="/img/badges/zt.svg" />
					        <img class="no-zoom" src="/img/badges/vitepress.svg" />
					        <img class="no-zoom" src="/img/badges/vue.svg" />
					        <img class="no-zoom" src="/img/badges/cloudflare.svg" />
					      </div>
					
					      <div class="footer-status">
					        <span class="running-time">
					            🚀 本站已稳定运行：
					            <span class="time-unit"><b>{{ runTime.d }}</b> 天</span>
					            <span class="time-unit"><b>{{ runTime.h }}</b> 时</span>
					            <span class="time-unit"><b>{{ runTime.m }}</b> 分</span>
					            <span class="time-unit s-unit"><b>{{ runTime.s }}</b> 秒</span>
					          </span>
					          
					          <span class="footer-copy-inline">
					            <span class="sep"> | </span>
					            © {{ new Date().getFullYear() }} 江大爷 · 既然来了，就多坐会儿
					          </span>
					      </div>

					    </div>
					  </footer>
      <MusicPlayer />
    </template>
  </Layout>
		<AiAssistant />
  <WelcomeToast />
</template>

<style>
/* 卷轴边缘的“发光”效果 */
::view-transition-new(root) {
  /* 在展开的边缘加一个白色的亮条，模拟卷轴的轴心 */
  mask-image: linear-gradient(
    to bottom,
    transparent,
    black 10%,
    black 90%,
    transparent
  );
  filter: drop-shadow(0 0 15px rgba(255, 255, 255, 0.2));
}

::view-transition-old(root),
::view-transition-new(root) {
  animation: none;
  mix-blend-mode: normal;
}
.sidebar-profile .avatar-box .status-badge {
  position: absolute;
  bottom: 1px;   /* 距离底部位置 */
  right: 1px;    /* 距离右侧位置 */
  width: 28px;   /* 气泡大小 */
  height: 28px;
  background-color: var(--vp-c-bg); /* 跟随主题背景色 */
  border: 2px solid var(--vp-c-bg-soft); /* 浅色边框增加层次感 */
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
		cursor: pointer;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15); /* 阴影是灵魂 */
  z-index: 2; /* 确保在护盾之上，这样鼠标放上去能显示 title */
  transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

/* 鼠标划过头像，气泡跟着有个俏皮的小缩放 */
.sidebar-profile 。:hover .status-badge {
  transform: scale(1.2);
}

/* 适配移动端，气泡稍微缩小一点点 */
@media (max-width: 640px) {
  .sidebar-profile 。 .status-badge {
    width: 24px;
    height: 24px;
    font-size: 14px;
    bottom: 2px;
    right: 2px;
  }
}
/* 侧边栏卡片容器 */
.sidebar-profile {
  padding: 24px;
  background: var(--vp-sidebar-bg-color);
  border-bottom: 1px solid var(--vp-c-divider);
  margin-bottom: 12px;
  display: flex;
  flex-direction: column;
  align-items: center; /* 居中显大气，或者选 flex-start 跟截图一致 */
  text-align: center;
}

/* 头像外框（加个呼吸灯效果或阴影更高级） */
.avatar-box {
  position: relative;
  width: 80px;
  height: 80px;
  margin-bottom: 12px;
}

.sidebar-avatar {
  width: 100%;
  height: 100%;
  border-radius: 50%; /* 圆形头像 */
  border: 2px solid var(--vp-c-yellow-1); /* 给头像套个主题色的圈 */
  object-fit: cover;
  transition: transform 0.5s;
}

/* 鼠标划过头像转一圈，大爷也年轻一把 */
.sidebar-avatar:hover {
  transform: rotate(360deg);
}

/* 名字和寄语 */
.user-name {
  font-size: 18px;
  font-weight: 700;
  color: var(--vp-c-text-1);
  margin: 0;
		font-family: "STXingkai", "STKaiti", "Kaiti SC", "Kaiti", serif;
}

.user-motto {
  font-size: 13px;
  color: var(--vp-c-text-2);
  margin-top: 6px;
  line-height: 1.4;
		font-family: "Kaiti", "STXingkai", "STKaiti", "Kaiti SC", serif;
}

/* 针对电脑端：如果电脑端不想显示（因为电脑端侧边栏常驻），可以隐藏它 */
/* 但很多博主电脑端也留着，看大爷您的喜好 */
@media (min-width: 960px) {
  /* 如果想在电脑端隐藏，取消下面注释 */
  .sidebar-profile { display: none; }
}

	.footer-badges img {
	  height: 20px; /* Shields.io 默认高度通常是 20px */
	  width: auto;
	  display: inline-block;
	  vertical-align: middle;
	}
/* 针对首页的微调 */
.custom-footer {
  margin-top: 40px;
  padding: 40px 20px;
  background: transparent; /* 去掉背景色，更通透 */
  border-top: 1px solid var(--vp-c-divider);
  text-align: center;
}
	
	.footer-container {
	  max-width: 1150px;
	  margin: 0 auto;
	  display: flex;
	  flex-direction: column;
	  gap: 20px;
	}
	
	/* 徽章间距 */
	.footer-badges {
	  display: flex;
	  justify-content: center;
	  flex-wrap: wrap;
	  gap: 8px;
	}
	
	/* 运行状态样式 */
	.footer-status {
	  font-size: 14px;
	  color: var(--vp-c-text-2);
	}
	
/* 天、时、分：数字颜色跟随主题（黑白自适应） */
.time-unit b {
  color: var(--vp-c-text-1); 
  font-family: monospace;
  font-size: 16px;
  margin: 0 2px;
}

/* 秒：数字固定为红色 */
.s-unit b {
  color: #ff5f56 !important;
}
	
	/* 版权样式 */
	.footer-copyright {
	  font-size: 13px;
	  color: var(--vp-c-text-3);
	  border-top: 1px solid var(--vp-c-gutter);
	  padding-top: 20px;
	}
	
	.footer-links {
	  margin-top: 10px;
	  display: flex;
	  justify-content: center;
	  gap: 15px;
	}
	
	.footer-links a {
	  color: var(--vp-c-text-3);
	  text-decoration: none;
	}
	
	.footer-links a:hover {
	  color: var(--vp-c-brand);
	}
	
	@media (max-width: 768px) {
	  .footer-badges { gap: 5px; }
	  .footer-status { font-size: 13px; }
	}
	
	/* 放在 custom.css 里 */
.article-top-box {
  padding: 12px 16px;
  background: var(--vp-c-bg-alt); /* 浅色背景 */
  border-left: 3px solid #ff5f56; /* 左侧加一根动力红立柱，瞬间起范儿 */
		transition: all 0.3s ease;
  border-radius: 4px;
  margin-bottom: 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.custom-breadcrumb {
  font-size: 14px;
  font-weight: 500;
}

.curr-cat {
  color: var(--vp-c-text-1);
		font-weight: 600;
		  /* 如果有多个分类，让斜杠颜色淡一点 */
		  letter-spacing: 0.5px;
}
.cat-link {
  color: var(--vp-c-brand-1); /* 用您的主题蓝色或红色 */
  font-weight: 600;
  text-decoration: none;
  padding: 2px 4px;
}

.cat-link:hover {
  text-decoration: underline; /* 悬停加个下划线，更有点击感 */
  background: transparent;    /* 之前那个红底色如果觉得太重可以去掉 */
}

/* 让斜杠看起来只是个分隔符，不可点 */
.curr-cat {
  font-size: 14px;
}
.article-subtitle-meta {
	font-family: monospace; /* 用等宽字体更有技术感 */
  opacity: 0.7;
  font-size: 12px;
  color: var(--vp-c-text-3);
}

/* 手机端适配：如果太挤了就上下排列 */
@media (max-width: 640px) {
  .article-top-box {
    /* flex-direction: column; */
    align-items: flex-start;
    gap: 8px;
  }
}
/* 保持您原有的动画 CSS */
::view-transition-old(root),
::view-transition-new(root) {
  animation: none;
  mix-blend-mode: normal;
}

::view-transition-old(root),
.dark::view-transition-new(root) {
  z-index: 1;
}

::view-transition-new(root),
.dark::view-transition-old(root) {
  z-index: 9999;
}

.VPSwitchAppearance {
  width: 22px !important;
}

.VPSwitchAppearance .check {
  transform: none !important;
}
</style>