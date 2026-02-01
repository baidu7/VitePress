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
      <div class="song-title">{{ currentSong.name }}</div>
      
      <div class="progress-box">
        <span class="time">{{ formatTime(currentTime) }}</span>
        <input type="range" :max="duration" :value="currentTime" @input="onSeek" step="0.1">
        <span class="time">{{ formatTime(duration) }}</span>
      </div>

      <div class="btn-group">
        <button @click="prev">上曲</button>
        <button @click="togglePlay" class="main-btn">{{ isPlaying ? '停止' : '播放' }}</button>
        <button @click="next">下曲</button>
        <button class="list-btn" @click="isListOpen = !isListOpen">歌单 ↓</button>
      </div>

      <div id="p-list" :class="{ 'show': isListOpen }">
        <div v-for="(s, i) in playlist" :key="i" 
             :class="['s-item', { 'active': index === i }]"
             @click="playIndex(i)">
          {{ i + 1 }}. {{ s.name }}
        </div>
      </div>
    </div>
  </div>

  <audio ref="audioRef" :src="currentSong.url" @timeupdate="onUpdate" @loadedmetadata="onLoaded" @ended="next"></audio>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

// 歌曲列表：文件记得放进根目录的 public 文件夹
const playlist = [
  { name: "Stars", url: "https://mr1.doubanio.com/484a8df54b09620ae3c9eeb48875f1a7/1/fm/song/p195694_128k.mp4", lrc: "" },
  { name: "示例歌曲", url: "https://www.w3schools.com/html/horse.mp3", lrc: "" }
]

const index = ref(0)
const isPlaying = ref(false)
const isDrawerOpen = ref(false)
const isListOpen = ref(false)
const currentTime = ref(0)
const duration = ref(0)
const currentLyricText = ref('')
const lrcLines = ref([])
const audioRef = ref(null)

const currentSong = computed(() => playlist[index.value])

const formatTime = (s) => {
  let m = Math.floor(s / 60); s = Math.floor(s % 60);
  return (m < 10 ? '0' : '') + m + ":" + (s < 10 ? '0' : '') + s;
}

const parseLrc = async (path) => {
  lrcLines.value = []; if (!path) return;
  try {
    const res = await fetch(path); const text = await res.text();
    text.split('\n').forEach(line => {
      const m = line.match(/\[(\d+):(\d+\.?\d*)\](.*)/);
      if (m) lrcLines.value.push({ time: parseInt(m[1])*60 + parseFloat(m[2]), text: m[3].trim() });
    });
  } catch (e) { console.log('歌词暂未就绪'); }
}

const togglePlay = () => {
  if (isPlaying.value) audioRef.value.pause();
  else audioRef.value.play();
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
  index.value = i; parseLrc(currentSong.value.lrc);
  setTimeout(() => { audioRef.value.play(); isPlaying.value = true; }, 50);
}

const next = () => playIndex((index.value + 1) % playlist.length);
const prev = () => playIndex((index.value - 1 + playlist.length) % playlist.length);

onMounted(() => { parseLrc(currentSong.value.lrc); })
</script>

<style scoped>
/* 适配 VitePress 光暗模式的 CSS */
#lyric-island { position: fixed; top: 40px; left: 50%; transform: translateX(-50%); z-index: 1001; opacity: 0; transition: 0.5s; pointer-events: none; }
#lyric-island.show { opacity: 1; }
.lyric-text { font-size: 22px; font-weight: bold; color: #ff5f56; text-shadow: 2px 2px 4px rgba(0,0,0,0.1); }

#music-drawer { 
  position: fixed; left: 0; bottom: 80px; width: 280px; z-index: 1000;
  background: var(--vp-c-bg); border: 1px solid var(--vp-c-divider);
  transform: translateX(-100%); transition: 0.4s; box-shadow: 4px 0 10px rgba(0,0,0,0.1);
}
#music-drawer.open { transform: translateX(0); }

#drawer-handle { 
  position: absolute; right: -32px; top: -1px; width: 32px; height: 100px;
  background: var(--vp-c-brand); color: #fff; cursor: pointer;
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  border-radius: 0 4px 4px 0;
}
.handle-text { writing-mode: vertical-lr; font-size: 11px; letter-spacing: 3px; }

.drawer-content { padding: 15px; color: var(--vp-c-text-1); }
.song-title { font-weight: bold; font-size: 14px; margin-bottom: 8px; }
.progress-box { display: flex; align-items: center; gap: 8px; margin-bottom: 10px; }
.time { font-size: 10px; opacity: 0.6; width: 35px; }
input[type="range"] { flex: 1; accent-color: #ff5f56; cursor: pointer; }

.btn-group { display: flex; flex-wrap: wrap; gap: 4px; }
.btn-group button { 
  flex: 1; padding: 6px; border: 1px solid var(--vp-c-divider); 
  background: var(--vp-c-bg-soft); color: var(--vp-c-text-1); font-size: 12px; cursor: pointer;
}
.list-btn { flex: 1 1 100% !important; margin-top: 4px; }

#p-list { max-height: 0; overflow: hidden; transition: 0.3s; }
#p-list.show { max-height: 150px; overflow-y: auto; margin-top: 10px; border-top: 1px dashed var(--vp-c-divider); }
.s-item { padding: 6px; font-size: 12px; cursor: pointer; }
.s-item.active { color: #ff5f56; font-weight: bold; background: var(--vp-c-bg-mute); }

.dot { width: 6px; height: 6px; background: #fff; border-radius: 50%; margin-bottom: 8px; animation: b 2s infinite; }
@keyframes b { 0%,100% {opacity:0.4} 50% {opacity:1} }
</style>