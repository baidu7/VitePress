<script setup lang="ts">
import { useData } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import { nextTick, provide, watch, onMounted } from 'vue' // 增加 watch 和 onMounted
import WelcomeToast from './components/WelcomeToast.vue'

const { Layout } = DefaultTheme
const { isDark } = useData()

// --- 💡 核心：定义一个专门改“头顶颜色”的函数 ---
const updateThemeColor = () => {
  const color = isDark.value ? '#1b1b1f' : '#ffffff' // 深色模式用灰黑，浅色用纯白
  const meta = document.querySelector('meta[name="theme-color"]')
  if (meta) {
    meta.setAttribute('content', color) // 动态修改 PWA 状态栏颜色
  }
}

// 页面加载和每次切换模式时，都同步一下颜色
onMounted(updateThemeColor)
watch(isDark, updateThemeColor)

// --- 1. 您原有的圆形切换动画逻辑 ---
const enableTransitions = () =>
  'startViewTransition' in document &&
  window.matchMedia('(prefers-reduced-motion: no-preference)').matches

provide('toggle-appearance', async ({ clientX: x, clientY: y }: MouseEvent) => {
  if (!enableTransitions()) {
    isDark.value = !isDark.value
    return
  }

  const clipPath = [
    `circle(0px at ${x}px ${y}px)`,
    `circle(${Math.hypot(
      Math.max(x, innerWidth - x),
      Math.max(y, innerHeight - y)
    )}px at ${x}px ${y}px)`
  ]

  await (document as any).startViewTransition(async () => {
    isDark.value = !isDark.value
    await nextTick()
    // 在这里切换时，watch 会自动触发 updateThemeColor
  }).ready

  document.documentElement.animate(
    { clipPath: isDark.value ? clipPath.reverse() : clipPath },
    {
      duration: 300,
      easing: 'ease-in',
      fill: 'forwards',
      pseudoElement: `::view-transition-${isDark.value ? 'old' : 'new'}(root)`
    }
  )
})
</script>

<template>
  <Layout>
    <template #doc-footer-before>
      <slot name="doc-footer-before" />
    </template>

    <template #layout-bottom>
      <MusicPlayer />
    </template>
  </Layout>
  <WelcomeToast />
</template>

<style>
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