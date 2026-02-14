<template>
  <div id="lyric-island" :class="{ 'show': isPlaying && currentLyricText }">
    <div class="lyric-text">{{ currentLyricText }}</div>
  </div>

  <div id="music-drawer" :class="{ 'open': isDrawerOpen }">
    <div id="drawer-handle" @click="isDrawerOpen = !isDrawerOpen">
      <div class="dot" :class="{ 'playing': isPlaying }"></div>
      <span class="handle-text">播放器</span>
    </div>
    
				<div id="playlist-selector">
				  <span class="selector-label">频道：</span>
				  <button @click="changePlaylist('60198')" :class="{active: currentPid=='60198'}">经典</button>
				  <button @click="changePlaylist('3778678')" :class="{active: currentPid=='3778678'}">热歌</button>
				  <button @click="changePlaylist('local')" :class="{active: currentPid=='local'}">❤️ 我的收藏</button>
				</div>
				
    <div class="drawer-content">
      <div class="song-header">
        <div class="album-cover" :class="{ 'rotate': isPlaying }">
          <img :src="currentSong?.pic || '/img/avatar.png'" alt="cover">
        </div>
        <div class="song-title">{{ currentSong?.name || '等待加载...' }}</div>
      </div>
      
      <div class="progress-box">
        <span class="time">{{ formatTime(currentTime) }}</span>🔊
        <input type="range" :max="duration" :value="currentTime" @input="onSeek" step="0.1">
        <span class="time">{{ formatTime(duration) }}</span>
      </div>

      <div class="btn-group">
        <button class="icon-btn" @click="prev" title="上一曲">
          <svg viewBox="0 0 24 24" width="20" height="20"><path fill="currentColor" d="M6 18V6h2v12H6m3.5-6L18 18V6l-8.5 6Z"/></svg>
        </button>
        
        <button class="icon-btn play-main" @click="togglePlay" :title="isPlaying ? '停止' : '播放'">
          <svg v-if="!isPlaying" viewBox="0 0 24 24" width="24" height="24"><path fill="currentColor" d="M8 5.14v14l11-7l-11-7Z"/></svg>
          <svg v-else viewBox="0 0 24 24" width="24" height="24"><path fill="currentColor" d="M14 19h4V5h-4v14M6 19h4V5H6v14Z"/></svg>
        </button>
      
        <button class="icon-btn" @click="next" title="下一曲">
          <svg viewBox="0 0 24 24" width="20" height="20"><path fill="currentColor" d="M16 18h2V6h-2v12M6 18l8.5-6L6 6v12Z"/></svg>
        </button>
      
        <button class="icon-btn list-toggle" :class="{ 'active': isListOpen }" @click="isListOpen = !isListOpen" title="歌单">
          <svg viewBox="0 0 24 24" width="20" height="20"><path fill="currentColor" d="M3 13h2v-2H3v2m0 4h2v-2H3v2m0-8h2V7H3v2m4 4h14v-2H7v2m0 4h14v-2H7v2m0-8h14V7H7v2Z"/></svg>
        </button>
      </div>

      <div id="p-list" :class="{ 'show': isListOpen }">
        <div v-for="(s, i) in fullList" :key="i" 
             :class="['s-item', { 'active': index === i }]"
             @click="playIndex(i)">
          {{ i + 1 }}. {{ s.name }} <span v-if="s.isCloud" class="tag-cloud">云</span>
        </div>
      </div>
    </div>
  </div>

  <audio ref="audioRef" :src="currentSong?.url" @timeupdate="onUpdate" @loadedmetadata="onLoaded" @ended="next"></audio>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

// --- 1. 配置区 ---
const localList = [
  { 
    name: "Stars - Janis Ian", 
    url: "https://mr1.doubanio.com/484a8df54b09620ae3c9eeb48875f1a7/1/fm/song/p195694_128k.mp4", 
    lrc: "/Janis-Ian-Stars.lrc", 
    pic: "https://gcore.jsdelivr.net/gh/baidu8/images@main/img/img-1771058961517.jpg",
    isCloud: false 
  }
]
const API_BASE = 'https://api.i-meto.com/meting/api?server=netease&type=playlist&id='

const fullList = ref([]) 
const index = ref(0)
const isPlaying = ref(false)
const isDrawerOpen = ref(false)
const isListOpen = ref(false)
const currentTime = ref(0)
const duration = ref(0)
const currentLyricText = ref('')
const lrcLines = ref([])
const audioRef = ref(null)

// 💡 改进：当前播放的歌曲对象，独立保存
const activeSong = ref(null)
const currentSong = computed(() => activeSong.value || fullList.value[index.value])

const currentPid = ref('local'); 

// --- 2. 核心功能 ---

const changePlaylist = async (id) => {
  if (currentPid.value === id && fullList.value.length > 0) return; 
  currentPid.value = id;
  
  isListOpen.value = true;
  
  // 💡 重点：这里不再执行 isPlaying = false，也不清空正在播的 activeSong
  // 只清空列表显示，让用户觉得“频道换了”，但耳朵听着没断
  fullList.value = [];
  
  if (id === 'local') {
    fullList.value = [...localList];
  } else {
    await fetchCloudList(id); 
  }
  
  // 💡 注意：这里不去调 playIndex(0, false)，因为那会强行切歌
  // 咱们只重置滚动条
  setTimeout(() => {
    const listEl = document.getElementById('p-list');
    if (listEl) listEl.scrollTop = 0;
  }, 100);
}

const fetchCloudList = async (id = currentPid.value) => { 
  if (id === 'local') return;
  try {
    const res = await fetch(API_BASE + id); 
    const data = await res.json();
    const cloudSongs = data.map(s => ({
      name: s.title + ' - ' + s.author,
      url: s.url,
      lrc: s.lrc, 
      pic: s.pic,
      isCloud: true
    }));
    fullList.value = [...fullList.value, ...cloudSongs];
  } catch (e) {
    console.error('云端加载失败');
  }
}

const parseLrc = async (path) => {
  lrcLines.value = []; 
  currentLyricText.value = '';
  if (!path) return;
  try {
    const res = await fetch(path); 
    const text = await res.text();
    const lines = text.split('\n');
    lines.forEach(line => {
      const m = line.match(/\[(\d+):(\d+\.?\d*)\](.*)/);
      if (m) lrcLines.value.push({ time: parseInt(m[1])*60 + parseFloat(m[2]), text: m[3].trim() });
    });
  } catch (e) { console.log('歌词解析失败'); }
}

const togglePlay = () => {
  if (!currentSong.value) return;
  // 第一次播放逻辑
  if (currentTime.value === 0 && lrcLines.value.length === 0) {
    playIndex(index.value, true);
    return;
  }
  
  if (isPlaying.value) {
    audioRef.value.pause();
  } else {
    audioRef.value.play().catch(() => {});
  }
  isPlaying.value = !isPlaying.value;
}

const onUpdate = () => {
  currentTime.value = audioRef.value.currentTime;
  if (lrcLines.value.length) {
    const line = lrcLines.value.findLast(item => item.time <= currentTime.value);
    if (line) currentLyricText.value = line.text;
  }
}

const onLoaded = () => { 
  duration.value = audioRef.value.duration; 
  // 剔出短曲目
  if (duration.value > 0 && duration.value < 40) {
    fullList.value.splice(index.value, 1); 
    if (index.value >= fullList.value.length) index.value = 0;
    playIndex(index.value, isPlaying.value); 
    return;
  }
  if (currentPid.value !== 'local' && index.value >= fullList.value.length - 2) {
    fetchCloudList(currentPid.value);
  }
}

const onSeek = (e) => { 
  if (audioRef.value) audioRef.value.currentTime = e.target.value; 
}

const playIndex = async (i, autoPlay = true) => { 
  if (!fullList.value[i]) return;
  
  index.value = i;
  activeSong.value = fullList.value[i]; // 💡 锁定当前播放的对象

  if (activeSong.value.lrc) {
    await parseLrc(activeSong.value.lrc); 
  } else {
    lrcLines.value = [];
    currentLyricText.value = '';
  }

  if (autoPlay) {
    setTimeout(() => {
      if (audioRef.value) {
        audioRef.value.play()
          .then(() => { isPlaying.value = true; })
          .catch(() => { isPlaying.value = false; });
      }
    }, 150);
  } else {
    isPlaying.value = false; 
    if (audioRef.value) audioRef.value.pause();
  }
}

const next = () => playIndex((index.value + 1) % fullList.value.length, true);
const prev = () => playIndex((index.value - 1 + fullList.value.length) % fullList.value.length, true);

const formatTime = (s) => {
  if (isNaN(s)) return "00:00";
  let m = Math.floor(s / 60); s = Math.floor(s % 60);
  return (m < 10 ? '0' : '') + m + ":" + (s < 10 ? '0' : '') + s;
}

onMounted(async () => { 
  // 初始化加载
  if (currentPid.value === 'local') {
    fullList.value = [...localList];
  } else {
    await fetchCloudList();
  }
  // 初始只加载数据，不出声
  await playIndex(0, false); 
})
</script>

<style scoped>
#playlist-selector {
  padding: 10px;
  display: flex;
  gap: 5px;
  align-items: center;
  border-bottom: 1px dashed var(--vp-c-divider);
}
.selector-label { font-size: 10px; opacity: 0.6; }
#playlist-selector button {
  font-size: 10px;
  padding: 2px 8px;
  border-radius: 10px;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-soft);
}
#playlist-selector button.active {
  background: #00b894;
  color: white;
  border-color: #00b894;
}
/* 按钮组基础排版 */
.btn-group {
  display: flex;
  align-items: center;
  justify-content: space-around; /* 均匀分布 */
  margin-top: 15px;
  gap: 10px;
}

/* 通用图标按钮样式 */
.icon-btn {
  background: none !important;
  border: none !important;
  padding: 8px !important;
  cursor: pointer;
  color: var(--vp-c-text-2); /* 默认用次要文字颜色，比较柔和 */
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
}

.icon-btn:hover {
  color: #00b894; /* 悬停变绿 */
  background: rgba(0, 184, 148, 0.1) !important;
  transform: scale(1.1);
}

/* 播放按钮大一点，突出重点 */
.play-main {
  color: #00b894;
  transform: scale(1.2);
}
.play-main:hover {
  transform: scale(1.3);
}

/* 列表开启时的状态 */
.list-toggle.active {
  color: #00b894;
  background: rgba(0, 184, 148, 0.1) !important;
}

/* 调整封面旋转动画，让它更有质感 */
.album-cover {
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}
/* 保持原有样式，新增/修改部分： */
.song-header { display: flex; align-items: center; gap: 10px; margin-bottom: 10px; }
.album-cover { 
  width: 40px; height: 40px; border-radius: 50%; overflow: hidden; 
  border: 2px solid #333; flex-shrink: 0; transition: transform 0.5s;
}
.album-cover img { width: 100%; height: 100%; object-fit: cover; }
.rotate { animation: disk-rotate 10s linear infinite; }
@keyframes disk-rotate { from {transform: rotate(0deg)} to {transform: rotate(360deg)} }

.tag-cloud { font-size: 8px; background: #00b89422; color: #00b894; padding: 1px 3px; border-radius: 3px; margin-left: 5px; }
.dot.playing { background: #00b894; box-shadow: 0 0 8px #00b894; animation: pulse 1s infinite; }
@keyframes pulse { 0% {opacity: 1} 50% {opacity: 0.5} 100% {opacity: 1} }
/* ============================================================
   1. 电脑端默认样式 (顶部悬浮)
   ============================================================ */
#lyric-island { 
  position: fixed; 
  top: 25px;            /* 电脑端钉在顶部 */
  left: 50%; 
  transform: translateX(-50%); 
  z-index: 9999;        /* 确保它是最高层级 */
  opacity: 0; 
  transition: all 0.5s ease; 
  pointer-events: none;
  width: auto;          /* 电脑端自适应文字宽度 */
  max-width: 80%;
  text-align: center;
}

#lyric-island.show { 
  opacity: 1; 
}

.lyric-text { 
  font-size: 20px; 
  font-weight: bold; 
  color: #00b894; 
  text-shadow: 0 2px 10px rgba(0,0,0,0.1);
  display: inline-block;
  white-space: nowrap;  /* 电脑端尽量一行显示 */
  line-height: 1.4;
}

/* ============================================================
   2. 📱 手机端适配 (屏幕底部浮动)
   ============================================================ */
@media (max-width: 768px) {
  #lyric-island {
    top: auto;          /* 清除顶部的定位 */
    bottom: 30px;       /* 改为钉在屏幕底部 */
    width: 90%;         /* 手机端宽度占满 */
  }

  .lyric-text {
    font-size: 15px;    /* 字号稍微调大一点点，14px有时太小 */
    background: rgba(var(--vp-c-bg-rgb), 0.85); /* 适配深色/浅色模式背景 */
    backdrop-filter: blur(10px);               /* 磨砂玻璃感 */
    padding: 8px 16px;
    border-radius: 5px;
    box-shadow: 0 4px 15px rgba(0,0,0,0.15);
    border: 1px solid var(--vp-c-divider);
    white-space: normal; /* 允许折行，防止长歌词溢出 */
    color: #00b894;      /* 保持您的专属红色 */
  }

  /* 播放器抽屉适配：防止在手机端遮挡歌词 */
  #music-drawer {
    width: 200px; 
    bottom: 100px;      /* 抽屉往上抬一点，别跟歌词岛打架 */
  }
}

/* ============================================================
   3. 音乐播放器基础样式 (保持您的逻辑)
   ============================================================ */
#music-drawer { 
  position: fixed; 
  left: 0; 
  bottom: 80px; 
  width: 240px; 
  z-index: 2000; 
  background: var(--vp-c-bg); 
  border: 1px solid var(--vp-c-divider); 
  transform: translateX(-100%); 
  transition: 0.4s cubic-bezier(0.18, 0.89, 0.32, 1.28); 
  box-shadow: var(--vp-shadow-3);
}

#music-drawer.open { transform: translateX(0); }

#drawer-handle { 
  position: absolute; 
  right: -23px; 
  top: -1px; 
  width: 22px; 
  height: 90px; 
  background: var(--vp-c-divider); 
  border: 1px solid var(--vp-c-divider); 
  color: var(--vp-c-text-1); 
  cursor: pointer; 
  display: flex; 
  flex-direction: column; 
  align-items: center; 
  justify-content: center; 
  border-radius: 0 4px 4px 0; 
}

.handle-text { writing-mode: vertical-lr; font-size: 10px; letter-spacing: 2px; }
.drawer-content { padding: 12px; color: var(--vp-c-text-1); }
.song-title { font-weight: bold; font-size: 13px; margin-bottom: 5px; border-bottom: 1px dashed var(--vp-c-divider); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.progress-box { display: flex; align-items: center; gap: 5px; margin: 8px 0; }
.time { font-size: 9px; opacity: 0.6; width: 30px; font-family: monospace; }
input[type="range"] { flex: 1; accent-color: #ff5f56; height: 3px; cursor: pointer; }
.btn-group { display: flex; flex-wrap: wrap; gap: 3px; }
.btn-group button { padding: 5px; border: 1px solid var(--vp-c-divider); background: var(--vp-c-bg-soft); color: var(--vp-c-text-1); font-size: 11px; cursor: pointer; }
.list-btn { flex: 100% !important; margin-top: 3px; }
#p-list { max-height: 0; overflow: hidden; transition: 0.3s ease-out; }
#p-list.show { max-height: 200px; overflow-y: auto; margin-top: 8px; border-top: 1px solid var(--vp-c-divider); }
.s-item { padding: 6px; font-size: 11px; cursor: pointer; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; border-bottom: 1px solid var(--vp-c-bg-soft); }
.s-item.active { color: #ff5f56; font-weight: bold; background: var(--vp-c-bg-mute); }
.dot { width: 5px; height: 5px; background: #ff5f56; border-radius: 50%; margin-bottom: 6px; animation: b 2s infinite; }
@keyframes b { 0%,100% {opacity:0.3} 50% {opacity:1} }
</style>