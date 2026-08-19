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
				  <button 
				    @click="changePlaylist('988690134')" 
				    :class="{ active: currentPid == '988690134' }"
				    class="selector-btn"
				  >
				    ❤️  经典老歌
				  </button>
				<button 
				    @click="changePlaylist('2232469985')" 
				    :class="{ active: currentPid == '2232469985' }"
				    class="selector-btn"
				  >
				   📻 欧美老歌 
				  </button>
				  <div class="channel-container">
				    <button class="channel-toggle" @click="showMenu = !showMenu">
				      {{ showMenu ? '🔼️ 收起' : '◀️ 更多' }}
				    </button>
				    
				    <Transition name="fade">
				      <div v-if="showMenu" class="channel-menu">
				        <div 
				          v-for="ch in myChannels" 
				          :key="ch.id" 
				          class="channel-item"
				          :class="{ active: currentPid === ch.id }"
				          @click="changePlaylist(ch.id); showMenu = false"
				        >
				          {{ ch.name }}
				        </div>
				      </div>
				    </Transition>
				  </div>
				</div>
				
    <div class="drawer-content">
      <div class="song-header">
        <div class="album-cover" :class="{ 'rotate': isPlaying }">
          <img :src="currentSong?.pic || '/img/avatar.png'" alt="cover">
        </div>
        <div class="song-title">{{ currentSong?.name || '等待加载...' }}</div>
      </div>
      
      <div class="progress-box">
        <span class="time">{{ formatTime(currentTime) }}</span>
        <input 
          v-if="!isLiveStream"
          type="range" 
          :max="duration || 0" 
          :value="currentTime" 
          @input="onSeek" 
          @mousedown="isDragging=true"
          @mouseup="isDragging=false"
          @mouseleave="isDragging=false"
          step="0.1"
        >
        <span class="time">{{ isLiveStream ? '♾️' : formatTime(duration) }}</span>
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
             :class="['s-item', { 'active': playingIndex === i }]"
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
    name: "FM", 
    url: "http://lhttp.qingting.fm/live/1671/64k.mp3", 
    lrc: "", 
    pic: "/img/avatar.png",
    isCloud: false 
  }
]
const API_BASE = 'https://api.i-meto.com/meting/api?server=netease&type=playlist&id='
const fullList = ref([]) 
const index = ref(0)
const playingIndex = ref(-1) // -1 = 无高亮
const isPlaying = ref(false)
const isDrawerOpen = ref(false)
const isListOpen = ref(false)
const currentTime = ref(0)
const duration = ref(0)
const currentLyricText = ref('')
const lrcLines = ref([])
const audioRef = ref(null)
const currentPid = ref('local'); 
const isLiveStream = ref(false)
const isDragging = ref(false)
// ?? 侦察兵：预检下一首的隐藏播放器
const scoutAudio = typeof Audio !== 'undefined' ? new Audio() : null;
// --- 频道配置区 ---
const myChannels = [
  { name: '❤️ 收藏', id: 'local' },
  { name: '🚩 飙升榜', id: '19723756' },
  { name: '🎸 新歌榜', id: '3779629' }, 
  { name: '🔥 热歌榜', id: '3778678' },
  { name: '🎐 古风单', id: '17645418779' }
]
const showMenu = ref(false) 
const activeSong = ref(null)
const currentSong = computed(() => activeSong.value || fullList.value[index.value] || localList[0])
// --- 2. 核心功能 ---
const changePlaylist = async (id) => {
  if (currentPid.value === id && fullList.value.length > 0) return; 
  currentPid.value = id;
  isListOpen.value = true;
  fullList.value = []; 
  playingIndex.value = -1; //切换列表清空高亮！！
  
  if (id === 'local') {
    fullList.value = [...localList];
  } else {
    await fetchCloudList(id); 
  }
  
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
      url: s.url, lrc: s.lrc, pic: s.pic, isCloud: true
    }));
    fullList.value = [...fullList.value, ...cloudSongs];
  } catch (e) {
    console.error('云端加载失败');
  }
}
const playIndex = async (i, autoPlay = true) => { 
  if (!fullList.value[i]) return;
  index.value = i;
  playingIndex.value = i; //点击播放才开启高亮
  activeSong.value = fullList.value[i]; 
  if ('mediaSession' in navigator) {
    const [title, artist] = activeSong.value.name.split(' - ');
    navigator.mediaSession.metadata = new MediaMetadata({
      title: title,
      artist: artist || '未知歌手',
      artwork: [{ src: activeSong.value.pic, sizes: '512x512' }]
    });
    navigator.mediaSession.setActionHandler('previoustrack', prev);
    navigator.mediaSession.setActionHandler('nexttrack', next);
  }
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
  }
}
const parseLrc = async (path) => {
  lrcLines.value = []; 
  currentLyricText.value = '';
  if (!path) return;
  try {
    const res = await fetch(path); 
    const text = await res.text();
    text.split('\n').forEach(line => {
      const m = line.match(/\[(\d+):(\d+\.?\d*)\](.*)/);
      if (m) lrcLines.value.push({ time: parseInt(m[1])*60 + parseFloat(m[2]), text: m[3].trim() });
    });
  } catch (e) { }
}
const togglePlay = () => {
  if (!currentSong.value) return;
  if (isPlaying.value) {
    audioRef.value.pause();
  } else {
    audioRef.value.play().catch(() => {});
  }
  isPlaying.value = !isPlaying.value;
}
const onUpdate = () => {
  if (!audioRef.value) return;
  if(!isDragging.value){
      currentTime.value = audioRef.value.currentTime;
  }
  
  if(!isFinite(audioRef.value.duration)){
    isLiveStream.value = true;
  }else{
    isLiveStream.value = false;
  }

  if (lrcLines.value.length) {
    const line = lrcLines.value.findLast(item => item.time <= currentTime.value);
    if (line) currentLyricText.value = line.text;
  }
}
const onLoaded = () => { 
  if (!audioRef.value) return;
  if(isFinite(audioRef.value.duration)){
    duration.value = audioRef.value.duration;
    isLiveStream.value = false;
  }else{
    isLiveStream.value = true;
  }

  if (currentPid.value !== 'local' && index.value >= fullList.value.length - 2) {
    fetchCloudList(currentPid.value);
  }
}
// --- ?? 核心：侦察兵预检逻辑 ---
const preCheckSong = (targetIdx, direction = 'next') => {
  return new Promise((resolve) => {
    if (fullList.value.length === 0) return resolve(targetIdx);
    let safeIdx = (targetIdx + fullList.value.length) % fullList.value.length;
    const song = fullList.value[safeIdx];
    
    // 如果没有侦察兵或这首歌是本地的，直接放行
    if (!song || !scoutAudio || !song.isCloud) return resolve(safeIdx);
    scoutAudio.src = song.url;
    scoutAudio.muted = true;
    const cleanup = () => {
      scoutAudio.removeEventListener('loadedmetadata', onMetadata);
      scoutAudio.removeEventListener('error', onError);
    };
    const onMetadata = () => {
      cleanup();
      if (scoutAudio.duration > 0 && scoutAudio.duration < 60) {
        console.log(`江大爷巡检：剔除短歌 [${song.name}]`);
        fullList.value.splice(safeIdx, 1);
        if (fullList.value.length === 0) return resolve(0);
        let nextTarget = direction === 'next' ? safeIdx : safeIdx - 1;
        resolve(preCheckSong(nextTarget, direction));
      } else {
        resolve(safeIdx);
      }
    };
    const onError = () => { cleanup(); resolve(safeIdx); };
    scoutAudio.addEventListener('loadedmetadata', onMetadata);
    scoutAudio.addEventListener('error', onError);
    setTimeout(() => { cleanup(); resolve(safeIdx); }, 2500); // 2.5秒超时
  });
};
const next = async () => {
  let targetIdx = (index.value + 1) % fullList.value.length;
  const finalIdx = await preCheckSong(targetIdx, 'next');
  playIndex(finalIdx, true);
};
const prev = async () => {
  let targetIdx = (index.value - 1 + fullList.value.length) % fullList.value.length;
  const finalIdx = await preCheckSong(targetIdx, 'prev');
  playIndex(finalIdx, true);
};
const onSeek = (e) => { 
  if (audioRef.value) audioRef.value.currentTime = e.target.value; 
}
const formatTime = (s) => {
  // 同时拦截：undefined、null、NaN、Infinity、-Infinity、负数
  if (s == null || isNaN(s) || !isFinite(s) || s < 0) {
    return "00:00";
  }
  let m = Math.floor(s / 60);
  let sec = Math.floor(s % 60);
  return (m < 10 ? '0' : '') + m + ":" + (sec < 10 ? '0' : '') + sec;
}
onMounted(async () => { 
  currentPid.value = 'local';
  fullList.value = [...localList];
  await playIndex(0, false); 
  
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible" && isPlaying.value && audioRef.value?.paused) {
      audioRef.value.play().catch(() => {});
    }
  });
})
</script>

<style scoped>
/* ============================================================
   1. 布局容器 (Selectors & Headers)
   ============================================================ */
#playlist-selector {
  padding: 6px;
  display: flex;
  gap: 6px;
  align-items: center;
  border-bottom: 1px dashed var(--vp-c-divider);
}

.song-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
}

.selector-label { 
  font-size: 10px; 
  opacity: 0.6; 
}

/* ============================================================
   2. 按钮系统 (Buttons)
   ============================================================ */
/* 频道切换基础按钮 */
.selector-btn, 
.channel-toggle, 
#playlist-selector button {
  padding: 4px 10px;
  font-size: 10px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 5px;
  background: var(--vp-c-bg-mute);
  cursor: pointer;
  white-space: nowrap;
  color: var(--vp-c-text-1);
  transition: all 0.2s ease;
}

.selector-btn, 
.channel-toggle, 
#playlist-selector button:hover {
    border-color: #00b894;
}

/* 激活状态：统一使用大爷喜欢的绿色主题 */
.selector-btn.active, 
#playlist-selector button.active {
  background: #00b894 !important;
  color: white !important;
  border-color: #00b894 !important;
}

/* 图标按钮组 (播放、上一首等) */
.btn-group {
  display: flex;
  align-items: center;
  justify-content: space-around;
  margin-top: 15px;
  gap: 10px;
}

.icon-btn {
  background: none !important;
  border: none !important;
  padding: 8px !important;
  cursor: pointer;
  color: var(--vp-c-text-2);
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
}

.icon-btn:hover, .list-toggle.active {
  color: #00b894;
  background: rgba(0, 184, 148, 0.1) !important;
  transform: scale(1.1);
}

.play-main {
  color: #00b894;
  transform: scale(1.2);
}

/* ============================================================
   3. 频道下拉菜单 (Dropdown Menu)
   ============================================================ */
.channel-container {
  position: relative;
  display: inline-block;
}

.channel-menu {
  position: absolute;
  bottom: 130%; /* 向上弹出，留出空隙 */
  right: 0;
  width: 130px;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 5px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.2);
  z-index: 999;
  overflow: hidden;
}

.channel-item {
  padding: 8px 12px;
  font-size: 13px;
  cursor: pointer;
  transition: background 0.2s;
  white-space: nowrap;
}

.channel-item:hover {
  background: rgba(0, 184, 148, 0.1);
  color: #00b894;
}

.channel-item.active {
  color: #00b894;
  font-weight: bold;
  background: var(--vp-c-default-soft);
}

/* ============================================================
   4. 动画与特效 (Animations)
   ============================================================ */
/* 封面旋转 */
.album-cover {
  width: 40px; height: 40px; border-radius: 50%; overflow: hidden;
  border: 2px solid #333; flex-shrink: 0; transition: transform 0.5s;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}
.album-cover img { width: 100%; height: 100%; object-fit: cover; }

.rotate { animation: disk-rotate 10s linear infinite; }
@keyframes disk-rotate { from { transform: rotate(0deg) } to { transform: rotate(360deg) } }

/* 呼吸灯效果 */
.dot.playing {
  background: #00b894;
  box-shadow: 0 0 8px #00b894;
  animation: pulse 1s infinite;
}
@keyframes pulse { 0% {opacity: 1} 50% {opacity: 0.5} 100% {opacity: 1} }

/* 其它小装饰 */
.tag-cloud { 
  font-size: 8px; background: rgba(0, 184, 148, 0.13); color: #00b894; 
  padding: 1px 3px; border-radius: 3px; margin-left: 5px; 
}

/* 渐变过渡 */
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
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
   2. ?? 手机端适配 (屏幕底部浮动)
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
		transition: transform 0.5s cubic-bezier(0.68, -0.55, 0.27, 1.55);
  /* transition: 0.4s cubic-bezier(0.18, 0.89, 0.32, 1.28); */
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