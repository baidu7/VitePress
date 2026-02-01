<template>
  <div id="lyric-island" :class="{ 'show': isPlaying && currentLyricText }">
    <div class="lyric-text">{{ currentLyricText }}</div>
  </div>

  <div id="music-drawer" :class="{ 'open': isDrawerOpen }">
    <div id="drawer-handle" @click="isDrawerOpen = !isDrawerOpen">
      <div class="dot"></div>
      <span class="handle-text">播放器</span>
    </div>
    
    <div class="drawer-content">
      <div class="song-title">{{ currentSong?.name || '等待加载...' }}</div>
      
      <div class="progress-box">
        <span class="time">{{ formatTime(currentTime) }}</span>
        <input type="range" :max="duration" :value="currentTime" @input="onSeek" step="0.1">
        <span class="time">{{ formatTime(duration) }}</span>
      </div>

      <div class="btn-group">
        <button @click="prev">上曲</button>
        <button @click="togglePlay">{{ isPlaying ? '停止' : '播放' }}</button>
        <button @click="next">下曲</button>
        <button class="list-btn" @click="isListOpen = !isListOpen">
          {{ isListOpen ? '收起歌单 ↑' : '歌单列表 ↓' }}
        </button>
      </div>

      <div id="p-list" :class="{ 'show': isListOpen }">
        <div v-for="(s, i) in fullList" :key="i" 
             :class="['s-item', { 'active': index === i }]"
             @click="playIndex(i)">
          {{ i + 1 }}. {{ s.name }} <span v-if="s.isCloud" style="font-size:9px;opacity:0.5;">(云)</span>
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
  { name: "Stars", url: "https://mr1.doubanio.com/484a8df54b09620ae3c9eeb48875f1a7/1/fm/song/p195694_128k.mp4", lrc: "/Janis-Ian-Stars.lrc", isCloud: false }
]
const NETEASE_PLAYLIST_ID = '17426483259' // 👈 这里换成您自己的网易云歌单 ID
const API_BASE = 'https://api.i-meto.com/meting/api?server=netease&type=playlist&id='

const fullList = ref([...localList])
const index = ref(0)
const isPlaying = ref(false)
const isDrawerOpen = ref(false)
const isListOpen = ref(false)
const currentTime = ref(0)
const duration = ref(0)
const currentLyricText = ref('')
const lrcLines = ref([])
const audioRef = ref(null)

const currentSong = computed(() => fullList.value[index.value])

// --- 2. 核心功能 ---
const formatTime = (s) => {
  let m = Math.floor(s / 60); s = Math.floor(s % 60);
  return (m < 10 ? '0' : '') + m + ":" + (s < 10 ? '0' : '') + s;
}

const fetchCloudList = async () => {
  try {
    const res = await fetch(API_BASE + NETEASE_PLAYLIST_ID);
    const data = await res.json();
    const cloudSongs = data.map(s => ({
      name: s.title + ' - ' + s.author,
      url: s.url,
      lrc: s.lrc, // 接口自带歌词地址
      isCloud: true
    }));
    fullList.value = [...localList, ...cloudSongs]; // 本地在上，云端在下
  } catch (e) {
    console.error('云端歌单加载失败，仅显示本地曲目');
  }
}

const parseLrc = async (path) => {
  lrcLines.value = []; if (!path) { currentLyricText.value = ''; return; }
  try {
    const res = await fetch(path); const text = await res.text();
    text.split('\n').forEach(line => {
      const m = line.match(/\[(\d+):(\d+\.?\d*)\](.*)/);
      if (m) lrcLines.value.push({ time: parseInt(m[1])*60 + parseFloat(m[2]), text: m[3].trim() });
    });
  } catch (e) { currentLyricText.value = ''; }
}

const togglePlay = () => {
  if (!audioRef.value.src) { playIndex(0); return; }
  isPlaying.value ? audioRef.value.pause() : audioRef.value.play();
  isPlaying.value = !isPlaying.value;
}

const onUpdate = () => {
  currentTime.value = audioRef.value.currentTime;
  if (lrcLines.value.length) {
    const line = lrcLines.value.findLast(item => item.time <= currentTime.value);
    if (line) currentLyricText.value = line.text;
  }
}

const onLoaded = () => { duration.value = audioRef.value.duration; }
const onSeek = (e) => { audioRef.value.currentTime = e.target.value; }

const playIndex = (i) => {
  index.value = i;
  parseLrc(currentSong.value.lrc);
  setTimeout(() => { audioRef.value.play(); isPlaying.value = true; }, 100);
}

const next = () => playIndex((index.value + 1) % fullList.value.length);
const prev = () => playIndex((index.value - 1 + fullList.value.length) % fullList.value.length);

onMounted(() => { 
  fetchCloudList(); // 初始化获取歌单
})
</script>

<style scoped>
/* 此处粘贴之前发您的 Scoped 样式即可，保持一致性 */
#lyric-island { position: fixed; top: 40px; left: 50%; transform: translateX(-50%); z-index: 2001; opacity: 0; transition: 0.5s; pointer-events: none; }
#lyric-island.show { opacity: 1; }
.lyric-text { font-size: 20px; font-weight: bold; color: #ff5f56; text-shadow: 0 0 5px rgba(0,0,0,0.1); }
#music-drawer { position: fixed; left: 0; bottom: 80px; width: 240px; z-index: 2000; background: var(--vp-c-bg); border: 1px solid var(--vp-c-divider); transform: translateX(-100%); transition: 0.4s cubic-bezier(0.18, 0.89, 0.32, 1.28); }
#music-drawer.open { transform: translateX(0); }
#drawer-handle { position: absolute; right: -23px; top: -1px; width: 22px; height: 90px; background: var(--vp-c-divider); border: 1px solid var(--vp-c-divider); color: var(--vp-c-text-1); cursor: pointer; display: flex; flex-direction: column; align-items: center; justify-content: center; border-radius: 0 4px 4px 0; }
.handle-text { writing-mode: vertical-lr; font-size: 10px; letter-spacing: 2px; }
.drawer-content { padding: 12px; color: var(--vp-c-text-1); }
.song-title { font-weight: bold; font-size: 13px; margin-bottom: 5px; border-bottom: 1px dashed var(--vp-c-divider); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.progress-box { display: flex; align-items: center; gap: 5px; margin: 8px 0; }
.time { font-size: 9px; opacity: 0.6; width: 30px; font-family: monospace; }
input[type="range"] { flex: 1; accent-color: #ff5f56; height: 3px; cursor: pointer; }
.btn-group { display: flex; flex-wrap: wrap; gap: 3px; }
.btn-group button { flex: 1; padding: 5px; border: 1px solid var(--vp-c-divider); background: var(--vp-c-bg-soft); color: var(--vp-c-text-1); font-size: 11px; cursor: pointer; }
.list-btn { flex: 100% !important; margin-top: 3px; }
#p-list { max-height: 0; overflow: hidden; transition: 0.3s ease-out; }
#p-list.show { max-height: 200px; overflow-y: auto; margin-top: 8px; border-top: 1px solid var(--vp-c-divider); }
.s-item { padding: 6px; font-size: 11px; cursor: pointer; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; border-bottom: 1px solid var(--vp-c-bg-soft); }
.s-item.active { color: #ff5f56; font-weight: bold; background: var(--vp-c-bg-mute); }
.dot { width: 5px; height: 5px; background: #ff5f56; border-radius: 50%; margin-bottom: 6px; animation: b 2s infinite; }
@keyframes b { 0%,100% {opacity:0.3} 50% {opacity:1} }
</style>