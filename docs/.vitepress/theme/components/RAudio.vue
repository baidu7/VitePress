<template>
  <div class="j-audio-player">
    <div class="j-audio-header">
      <div class="j-audio-icon">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="#16a34a"><path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/></svg>
      </div>
      <div class="j-audio-info">
        <div class="title">{{ title }}</div>
        <div class="subtitle">{{ subtitle }}</div>
      </div>
    </div>
    <audio controls preload="metadata">
      <source :src="src" type="audio/mp4">
    </audio>
  </div>
</template>

<script setup>
defineProps({
  src: String,
  title: { type: String, default: '本页音频' },
  subtitle: { type: String, default: '相关的' }
})
</script>

<style scoped>
/* 这里贴入刚才那段 CSS，去掉 .j-audio-player 前缀，或者保持原样也可 */
/* J-R2-drive 专用：清新博客版播放器全局样式 */
.j-audio-player {
    background: rgba(255, 255, 255, 0.75);
    backdrop-filter: blur(10px);
    border: 1px solid #e2e8f0;
    border-radius: 5px;
    padding: 16px;
    margin: 0 0 24px 0;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
    font-family: system-ui, -apple-system, sans-serif;
}

.j-audio-header {
    display: flex;
    align-items: center;
    margin-bottom: 12px;
}

.j-audio-icon {
    width: 36px;
    height: 36px;
    background: #f0fdf4;
    border: 1px solid #bbf7d0;
    border-radius: 5px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 12px;
}

.j-audio-info .title {
    color: #1e293b;
    font-size: 14px;
    font-weight: 600;
}

.j-audio-info .subtitle {
    color: #64748b;
    font-size: 11px;
    margin-top: 2px;
}

.j-audio-player audio {
    width: 100%;
    height: 36px;
    outline: none;
}
.j-audio-player audio {
    width: 100%;
    height: 36px;
    outline: none;
    /* --- 核心美化代码 --- */
    filter: sepia(20%) saturate(70%) hue-rotate(90deg) brightness(1.05); 
    opacity: 0.9;
    transition: opacity 0.3s;
}

.j-audio-player audio:hover {
    opacity: 1; /* 鼠标放上去时颜色更亮一点 */
}
</style>