---
layout: home
---

<script setup>
import { ref, computed, onMounted, watch } from 'vue' // 揉在一起写更简洁
import { data as allPosts } from './.vitepress/posts.data.mjs'
import { useRouter } from 'vitepress'

// 1. 先定义基础变量
const pageSize = 9
const currentPage = ref(1)
const selectedTag = ref('')

// 2. 引入路由
const { route } = useRouter()

// 🌟 核心修复：把逻辑包在 watch 里，并增加 inBrowser 判断
watch(
  () => route.path + (typeof window !== 'undefined' ? window.location.search : ''), 
  () => {
    // 只在浏览器环境下跑解析逻辑
    if (typeof window !== 'undefined') {
      setTimeout(() => {
        const params = new URLSearchParams(window.location.search)
        const newTag = params.get('tag') || ''
        const newPage = parseInt(params.get('page')) || 1
        
        if (selectedTag.value !== newTag) selectedTag.value = newTag
        if (currentPage.value !== newPage) currentPage.value = newPage
        
        console.log('🚀 导航同步成功:', selectedTag.value)
      }, 50)
    }
  },
  { immediate: true }
)
// 1. 提取标签逻辑：确保即使是空也不会报错
const allTags = computed(() => {
  const tags = new Set()
  allPosts.forEach(post => {
    if (post.category) tags.add(post.category)
    if (Array.isArray(post.tags)) {
      post.tags.forEach(t => tags.add(t))
    }
  })
  return Array.from(tags)
})

// 2. 核心过滤逻辑 + 日期排序
const filteredPosts = computed(() => {
  // 先把所有文章拿出来
  let results = [...allPosts]

  // --- 新增排序逻辑：日期最新的排前面 ---
  results.sort((a, b) => {
    // 假设日期字段叫 date，如果没写日期就当成 1970年（排最后）
    const dateA = a.date ? new Date(a.date) : new Date(0)
    const dateB = b.date ? new Date(b.date) : new Date(0)
    return dateB - dateA // 倒序排：大的（新的）在前
  })

  // 如果有选中的标签，再进行过滤
  if (!selectedTag.value) return results
  return results.filter(post => 
    post.category === selectedTag.value || 
    (Array.isArray(post.tags) && post.tags.includes(selectedTag.value))
  )
})

// 3. 分页与 URL 同步
const updateRoute = (tag, page) => {
  selectedTag.value = tag
  currentPage.value = page
  const params = new URLSearchParams()
  if (tag) params.set('tag', tag)
  if (page > 1) params.set('page', page)
  const query = params.toString()
  window.history.pushState(null, '', query ? `?${query}` : window.location.pathname)
}

const filterByTag = (tag) => {
  updateRoute(tag, 1)
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const updatePage = (num) => {
  currentPage.value = num
  updateRoute(selectedTag.value, num)
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

onMounted(() => {
  const params = new URLSearchParams(window.location.search)
  selectedTag.value = params.get('tag') || ''
  currentPage.value = parseInt(params.get('page')) || 1
})

// 计算分页内容
const totalPages = computed(() => Math.ceil(filteredPosts.value.length / pageSize) || 1)
const posts = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return filteredPosts.value.slice(start, start + pageSize)
})

// 页码折叠 (保持不变...)
const visiblePageNumbers = computed(() => {
  const nums = []; const range = 2
  for (let i = 1; i <= totalPages.value; i++) {
    if (i === 1 || i === totalPages.value || (i >= currentPage.value - range && i <= currentPage.value + range)) {
      nums.push(i)
    } else if (i === currentPage.value - range - 1 || i === currentPage.value + range + 1) {
      if (!nums.includes('...')) nums.push('...')
    }
  }
  return nums.filter((item, index) => item !== '...' || nums[index - 1] !== '...')
})

const prevPage = () => { if (currentPage.value > 1) updatePage(currentPage.value - 1) }
const nextPage = () => { if (currentPage.value < totalPages.value) updatePage(currentPage.value + 1) }
const GITHUB_OWNER = 'baidu8'
const GITHUB_REPO = 'VitePress'
const latestShuo = ref('正在同步最新动态...')

const latestIssues = ref([]) // 改为存数组

onMounted(async () => {
  try {
    const res = await fetch(`https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/issues?state=open&labels=shuo&per_page=1`)
    const data = await res.json()
    if (data && data.length > 0) {
      latestIssues.value = data.map(item => {
        // 1. 先把 HTML 标签全部去掉（比如 <video>, <iframe>, <div> 等）
        let cleanText = item.body.replace(/<[^>]+>/g, '');

        // 2. 把 Markdown 的图片语法 ![alt](url) 替换成 [图片]
        cleanText = cleanText.replace(/!\[.*?\]\((.*?)\)/g, '[图片]');

        // 3. 把 Markdown 的链接语法 [text](url) 替换成里面的文字
        cleanText = cleanText.replace(/\[(.*?)\]\(.*?\)/g, '$1');

        // 4. 去掉多余的换行，只留 40 个字
        cleanText = cleanText.replace(/\n/g, ' ').trim();
        
        return {
          text: cleanText.length > 40 ? cleanText.substring(0, 40) + '...' : cleanText,
          url: '/shuo' // 💡 建议首页点击直接跳转到你的说说页面，而不是 GitHub
        }
      })
    }
  } catch (e) { console.error(e) }
})
</script>

<div class="blog-wrapper">
  <div class="blog-main">
		<div class="mobile-tag-scroller">
		  <div class="mobile-tag-list-inner">
		    <span 
		      v-for="tag in allTags" :key="'m1' + tag"
		      :class="['mobile-tag-item', { active: selectedTag === tag }]"
		      @click="filterByTag(tag)"
		    >
		      {{ tag }}
		    </span>
		    <span 
		      v-for="tag in allTags" :key="'m2' + tag"
		      :class="['mobile-tag-item', { active: selectedTag === tag }]"
		      @click="filterByTag(tag)"
		    >
		      {{ tag }}
		    </span>
		  </div>
		</div>
    <div v-if="selectedTag" class="filter-status">
      正在查看 “<strong>{{ selectedTag }}</strong>” 相关的文章
      <span class="clear-link" @click="filterByTag('')">显示全部</span>
    </div>
    <div class="blog-container">
      <div v-for="post in posts" :key="post.url" class="post-card">
        <a :href="post.url" class="post-image-link">
          <div class="post-image-wrapper">
            <img :src="post.cover" class="no-zoom" alt="cover" loading="lazy">
            <div class="post-overlay">
              <p class="overlay-desc">{{ post.description }}</p>
            </div>
          </div>
        </a>
        <div class="post-info">
          <h3 class="post-title">{{ post.title }}</h3>
          <div class="post-meta-row">
            <span class="post-date">📅 {{ post.date }}</span>
            <span 
              v-if="post.category" 
              class="post-category-tag" 
              @click.stop.prevent="filterByTag(post.category)"
            >
              {{ post.category }}
            </span>
          </div>
        </div>
      </div>
    </div>
    <div class="pagination" v-if="totalPages > 1">
      <button class="page-btn" :disabled="currentPage === 1" @click="prevPage">←</button>
      <div class="page-numbers">
        <template v-for="(page, index) in visiblePageNumbers" :key="index">
          <button 
            v-if="page !== '...'"
            :class="['num-btn', { active: currentPage === page }]"
            @click="updatePage(page)"
          >
            {{ page }}
          </button>
          <span v-else class="page-ellipsis">...</span>
        </template>
      </div>
      <button class="page-btn" :disabled="currentPage === totalPages" @click="nextPage">→</button>
    </div>
  </div>

  <aside class="blog-aside">
    <div class="info-card">
      <div class="avatar-wrapper">
        <div class="avatar-shield"></div> 
        <img src="/img/avatar.png" class="avatar">
								<div class="status-badge" title="若无烦心事，便是好时节">
								    <span>🤔</span> 
								  </div>
      </div>
      <h3 class="name">江大爷</h3>
      <p class="bio">梦到什么说什么</p>
      <div class="stats">
        <div class="item"><strong>{{ allPosts.length }}</strong><span>文章</span></div>
        <div class="item"><strong>{{ allTags.length }}</strong><span>标签</span></div>
      </div>
    </div>
				<RandomQuote />
				<div class="latest-shuo-container">
				  <div v-for="(shuo, index) in latestIssues" :key="index" class="shuo-line">
				    <span class="shuo-tag">📢</span>
				    <span class="shuo-text">{{ shuo.text }}</span>
				    <a v-if="index === 0" href="/shuo" class="shuo-link">查看说说 👉</a>
				  </div>
				  <div v-if="latestIssues.length === 0" class="shuo-line">正在同步最新动态...</div>
				</div>
    <div class="side-card tags-card">
      <div class="card-title">🏷️ 标签</div>
      <div class="tag-scroll-window">
        <div class="tag-list scroll-anim">
          <span 
            v-for="tag in allTags" 
            :key="'a' + tag"
            :class="['tag-item', { active: selectedTag === tag }]"
            @click="filterByTag(tag)"
          >
            {{ tag }}
          </span>
          <span 
            v-for="tag in allTags" 
            :key="'b' + tag"
            :class="['tag-item', { active: selectedTag === tag }]"
            @click="filterByTag(tag)"
          >
            {{ tag }}
          </span>
          <span v-if="selectedTag" class="tag-item clear" @click="filterByTag('')">× 重置</span>
        </div>
      </div>
    </div>
  </aside>
</div>


<style scoped>
.latest-shuo-container {
  margin: 10px 0; /* 💡 调小上下间距 */
  padding: 8px 14px; /* 💡 调小内部内边距 */
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-brand-soft);
  border-radius: 5px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.03);
}
.shuo-line {
  display: flex;
  align-items: center;
  gap: 10px;
  line-height: 1.8; /* 控制两行之间的行高 */
}
.shuo-line:not(:last-child) {
  border-bottom: 1px dashed var(--vp-c-divider); /* 两条说说之间加个虚线 */
  margin-bottom: 4px;
  padding-bottom: 4px;
}
.shuo-tag { font-size: 0.9rem; }
.shuo-text { 
  flex: 1; 
  font-size: 0.85rem; 
  color: var(--vp-c-text-1);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis; /* 文字太长自动变省略号 */
}
.shuo-link {
  font-size: 11px;               /* 💡 字号稍微调小，显得精致 */
  color: var(--vp-c-brand);      /* 💡 用主题色 */
  background: var(--vp-c-brand-soft); /* 💡 浅色背景 */
  padding: 2px 10px;             /* 💡 撑开按钮形状 */
  border-radius: 5px;           /* 💡 圆润的胶囊形 */
  text-decoration: none !important;
  font-weight: 600;
  white-space: nowrap;
  margin-left: 10px;
  border: 1px solid transparent;
  transition: all 0.2s ease;     /* 💡 丝滑的过渡动画 */
}

/* 💡 鼠标移上去的效果：颜色反转，更有交互感 */
.shuo-link:hover {
  background: var(--vp-c-brand);
  color: #ffffff !important;
  box-shadow: 0 2px 6px var(--vp-c-brand-soft);
  transform: translateY(-1px);   /* 💡 轻轻往上跳一下 */
}

/* 💡 适配移动端：防止按钮在小屏幕上挤在一起 */
@media (max-width: 480px) {
  .shuo-link {
    padding: 1px 6px;
    font-size: 10px;
  }
}
/* ============================================================
   2. 文章卡片 (Post Card)
   ============================================================ */
/* 图片区域 */
.post-image-link { display: block; overflow: hidden; }

.post-image-wrapper {
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 9;
}

.post-image-wrapper img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.post-card:hover .post-image-wrapper img { transform: scale(1.08); }

/* 悬停简介蒙版 */
.post-overlay {
  position: absolute;
  top: 0; left: 0; width: 100%; height: 100%;
  background: linear-gradient(
    to bottom, 
    rgba(0, 0, 0, 0.4) 0%, 
    rgba(0, 0, 0, 0.7) 100%
  ) !important;
  display: flex; align-items: center; justify-content: center;
  padding: 20px;
  opacity: 0;
  transition: opacity 0.3s ease;
  backdrop-filter: blur(4px);
  z-index: 1;
}

.post-card:hover .post-overlay { opacity: 1; }

.overlay-desc {
  color: white;
  font-size: 0.9rem;
  text-align: center;
  line-height: 1.6;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
/* 电脑端大屏幕调整 */
@media (min-width: 960px) {
  .blog-container {
    /* 关了侧边栏后，这里改成 repeat(3, 1fr) 就能出三列 */
    grid-template-columns: repeat(3, 1fr); 
  }
}

.post-title-link { text-decoration: none; color: inherit; }

.post-title-link:hover .post-title { color: var(--vp-c-brand); }

.post-category-tag {
  cursor: pointer;
  padding: 1px 8px;
  border-radius: 4px;
  color: var(--vp-c-brand);
  background-color: var(--vp-c-brand-soft);
  font-weight: 500;
  transition: all 0.2s;
}

.post-category-tag:hover {
  background-color: var(--vp-c-brand);
  color: white;
}

/* ============================================================
   3. 侧边栏 (Aside)
   ============================================================ */
/* 头像容器 */
.info-card .avatar-wrapper {
  position: relative; /* 确保子元素的 absolute 定位是相对于它 */
  width: 90px; /* 根据首页头像的实际大小调整 */
  height: 90px; /* 保持宽高一致，确保圆形 */
  margin: 0 auto 20px; /* 居中并向下留白 */
}

/* 首页头像本体 */
.info-card .avatar-wrapper .avatar {
  width: 100%;
  height: 100%;
  border-radius: 50%; /* 确保圆形 */
  object-fit: cover;
  border: 2px solid var(--vp-c-yellow-1); /* 大爷的专属高光圈 */
  transition: transform 0.5s ease-in-out; /* 平滑旋转动画 */
  /* 最关键：让图片本身不接收鼠标事件，彻底躲开插件 */
  pointer-events: none; 
}

/* 透明护盾 */
.info-card .avatar-wrapper .avatar-shield {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 50%; /* 和头像一样圆 */
  z-index: 1; /* 确保它在头像上面 */
  cursor: pointer; /* 鼠标放上去时显示手型，表示可点击或互动 */
  /* 可以加一个淡淡的背景，鼠标放上去时提示用户这里可以互动 */
  background-color: rgba(var(--vp-c-brand-1-rgb), 0.1);
  transition: background-color 0.3s;
}

/* 当鼠标划过整个容器时，让里面的头像转动 */
.info-card .avatar-wrapper:hover .avatar {
  transform: rotate(360deg);
}

/* 如果想让护盾本身也有动画，可以这样 */
/* .info-card .avatar-wrapper:hover .avatar-shield {
  background-color: rgba(var(--vp-c-brand-1-rgb), 0.2);
} */
/* 气泡本体 */
.info-card .avatar-wrapper .status-badge {
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
.info-card .avatar-wrapper:hover .status-badge {
  transform: scale(1.2);
}

/* 适配移动端，气泡稍微缩小一点点 */
@media (max-width: 640px) {
  .info-card .avatar-wrapper .status-badge {
    width: 24px;
    height: 24px;
    font-size: 14px;
    bottom: 2px;
    right: 2px;
  }
}
/* 其他 info-card 样式，根据需求调整 */
.info-card .name {
  font-size: 24px;
  font-weight: bold;
  color: var(--vp-c-text-1);
  margin-top: 10px;
		font-family: "STXingkai", "STKaiti", "Kaiti SC", "Kaiti", serif;
		letter-spacing: 2px;
}
.info-card .name:hover {
  animation: wave 0.5s ease-in-out;
}

@keyframes wave {
  0%, 100% { transform: rotate(0deg); }
  25% { transform: rotate(-5deg); }
  75% { transform: rotate(5deg); }
}
.info-card .bio {
  font-size: 14px;
  color: var(--vp-c-text-2);
  margin-top: 5px;
  min-height: 5px; /* 防止内容为空时塌陷 */
}

.info-card .stats {
  display: flex;
  justify-content: center;
  gap: 30px;
  margin-top: 25px;
  border-top: 1px solid var(--vp-c-divider);
  padding-top: 20px;
}

.info-card .stats .item strong {
  display: block;
  font-size: 20px;
  color: var(--vp-c-text-1);
  font-weight: bold;
}

.info-card .stats .item span {
  font-size: 12px;
  color: var(--vp-c-text-3);
  margin-top: 5px;
  display: block;
}
.blog-aside { width: 280px; display: flex; flex-direction: column; gap: 20px; }

.info-card, .side-card {
  background: var(--vp-c-bg-soft);
  padding: 24px;
  border-radius: 5px;
  border: 1px solid var(--vp-c-divider);
}

.info-card {
  text-align: center;
  top: 100px;
  /* position: sticky; */
  transition: all 0.3s ease;
}
.info-card:hover {
  transform: translateY(0px); /* 轻轻上浮 */
  /* box-shadow: 0 12px 30px rgba(0, 0, 0, 0.12); 阴影加深，更有空间感 */
}

.info-card::after {
  content: '江大爷'; /* 或者是博客名缩写 */
		font-family: "STXingkai", "STKaiti", "Kaiti SC", "Kaiti", serif;
  position: absolute;
  bottom: -10px;
  right: -5px;
  font-size: 40px;
  font-weight: 900;
  font-style: italic;
  color: var(--vp-c-text-1);
  opacity: 0.03; /* 极低透明度，若隐若现最迷人 */
  pointer-events: none;
}
.name { font-size: 1.25rem; font-weight: bold; margin-bottom: 6px; }

.bio { font-family: "Kaiti", "STXingkai", "STKaiti", "Kaiti SC", serif; font-size: 0.85rem; color: var(--vp-c-text-2); margin-bottom: 16px; }

.stats { display: flex; justify-content: space-around; border-top: 1px solid var(--vp-c-divider); padding-top: 16px; }

.stats strong { display: block; font-size: 1.1rem; color: var(--vp-c-text-1); }

.stats span { font-size: 0.75rem; color: var(--vp-c-text-3); }

.about-btn {
  display: block; margin-top: 18px; padding: 10px;
  background: var(--vp-c-brand); color: white !important;
  border-radius: 8px; font-size: 0.9rem; transition: opacity 0.2s;
}

.about-btn:hover { opacity: 0.9; }

/* 侧边栏标签云 */
/* 窗口：固定高度，隐藏溢出，加遮罩 */
.tag-scroll-window {
  height: 200px; /* 固定高度，可以根据喜好调整 */
  position: relative;
		scroll-behavior: smooth;
		overflow-y: auto;
		-ms-overflow-style: none;
		scrollbar-width: none;
  /* 上下渐变遮罩，产生边缘消失的高级感 */
  mask-image: linear-gradient(to bottom, transparent, black 15%, black 85%, transparent);
  -webkit-mask-image: linear-gradient(to bottom, transparent, black 15%, black 85%, transparent);
}
.tag-scroll-window::-webkit-scrollbar {
  display: none; /* 直接让滚动条不渲染 */
}
/* 列表容器：设置布局和动画 */
.tag-list.scroll-anim {
  display: flex;
  flex-wrap: wrap; /* 让标签能排开 */
  gap: 8px;
  padding: 10px 0;
  /* 动画名称 时长 线性 循环 */
  animation: slide-up 25s linear infinite; 
}

/* 鼠标放上去停止滚动，方便大爷点击 */
.tag-scroll-window:hover .scroll-anim {
  animation-play-state: paused;
}

/* 关键帧：向上滚动到一半的位置 */
/* 这里的 -50% 是因为我们放了两份一模一样的标签 */
@keyframes slide-up {
  0% { transform: translateY(0); }
  100% { transform: translateY(-50%); }
}

/* 稍微美化下标签，让它们像胶囊一样 */
.tag-item {
  padding: 4px 10px;
  font-size: 13px;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap; /* 防止标签换行打乱动画 */
}

.tag-item:hover {
  border-color: #ff5f56;
  color: #ff5f56;
}


/* ============================================================
   4. 分页器 (Pagination)
   ============================================================ */
.pagination { display: flex; align-items: center; justify-content: center; gap: 12px; margin-top: 50px; }

.page-numbers { display: flex; gap: 8px; }

.page-btn, .num-btn {
  padding: 6px 14px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  background: var(--vp-c-bg-soft);
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.2s;
}

.page-btn:not(:disabled):hover, .num-btn:hover {
  border-color: var(--vp-c-brand);
  color: var(--vp-c-brand);
}

.num-btn.active { background: var(--vp-c-brand); color: white; border-color: var(--vp-c-brand); }

.page-btn:disabled { opacity: 0.4; cursor: not-allowed; filter: grayscale(1); }

/* ============================================================
   🌟 统一响应式布局方案
   ============================================================ */
.blog-wrapper {
  display: flex;
  max-width: 1200px; /* 稍微放大一点点容器 */
  margin: 20px auto;
  gap: 25px;
  padding: 0 20px;
}

.blog-main { 
  flex: 1; 
  min-width: 0; 
}

.blog-aside { 
  width: 280px; 
  flex-shrink: 0; /* 侧边栏宽度稳住，不被挤压 */
}

/* 核心网格 */
.blog-container {
  display: grid;
  gap: 20px;
  margin-bottom: 40px;
  grid-template-columns: repeat(3, 1fr); /* 默认 3 列 */
  grid-auto-rows: 1fr; 
  align-items: stretch;
}

/* ============================================================
   2. 文章卡片 (保持高度对齐和背景撑满)
   ============================================================ */
.post-card {
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: var(--vp-c-bg-soft);
  border-radius: 5px;
  border: 1px solid var(--vp-c-divider);
  transition: all 0.25s ease;
  overflow: hidden;
}

.post-card:hover {
  border-color: var(--vp-c-brand) !important;
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(0,0,0,0.08);
}

.post-image-wrapper {
  position: relative;
  aspect-ratio: 16 / 9;
  background-color: var(--vp-c-bg-alt);
  overflow: hidden;
}

.post-image-wrapper img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.post-info {
  padding: 15px;
  display: flex;
  flex-direction: column;
  flex-grow: 1; /* 关键：撑开背景色 */
  gap: 10px;
  border-top: 1px solid var(--vp-c-divider);
}

.post-title {
  font-size: 1.05rem;
  font-weight: 700;
  line-height: 1.4;
  height: 2.8em; /* 统一标题占位 */
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.post-meta-row {
  margin-top: auto; /* 日期标签贴底 */
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.8rem;
}

.post-category-tag {
  padding: 2px 8px;
  border-radius: 4px;
  color: var(--vp-c-brand);
  background-color: var(--vp-c-brand-soft);
}

/* ============================================================
   3. 响应式魔法：精准控制平板端
   ============================================================ */

/* --- 🌟 平板端：侧边栏保留，卡片变 2 列 (850px - 1200px) --- */
@media (max-width: 1200px) {
  .blog-container {
    grid-template-columns: repeat(2, 1fr) !important; /* 减掉一列 */
  }
}

/* --- 🌟 手机端：侧边栏下移，卡片变 1 列 (小于 850px) --- */
@media (max-width: 850px) {
  .blog-wrapper {
    flex-direction: column; /* 侧边栏去下面 */
				padding: 0 0px;
  }
  .blog-aside {
    width: 100%;
				order: 2; 
				margin-top: 30px;
				/* display: none */
  }
  .blog-container {
    grid-template-columns: 1fr !important; /* 变成 1 列 */
  }
  .info-card {
    display: none !important; /* 手机端隐藏头像卡片，省地方 */
  }
  .mobile-tag-scroller {
    display: block !important; /* 显示顶部滚动标签 */
  }
/* 2. 核心：手机端隐藏右侧原本的标签卡片 */
  /* 因为顶部已经有了横向滚动的标签，下面那个就不用显示了 */
  .side-card.tags-card {
    display: none; 
  }
}

/* ============================================================
   4. 其他功能项
   ============================================================ */
.mobile-tag-scroller { display: none; }
.latest-shuo-container { margin-bottom: 20px; }
/* ============================================================
   查看样式
   ============================================================ */
/* 基础样式优化 */
.filter-status {
  display: flex;
  align-items: center;
  padding: 14px 18px;
  margin-bottom: 20px;
  background-color: var(--vp-c-bg-soft);
  border-left: 4px solid var(--vp-c-brand-1);
  border-radius: 5px; /* 稍微圆润一点更适合手机端 */
  font-size: 14px;
  line-height: 1.6; /* 增加行高，防止换行时文字打架 */
  color: var(--vp-c-text-2);
  box-shadow: var(--vp-shadow-1);
}

/* 标签文字增强 */
.filter-status strong {
  color: var(--vp-c-brand-1);
  font-weight: 600;
  padding: 0 4px;
}

/* 按钮样式 */
.filter-status .clear-link {
  margin-left: auto;
  padding: 4px 14px;
  font-size: 12px;
  background-color: var(--vp-c-bg-alt);
  border: 1px solid var(--vp-c-divider);
  border-radius: 5px;
  white-space: nowrap; /* 核心：禁止按钮文字换行 */
  cursor: pointer;
  transition: all 0.2s ease;
}

/* --- 📱 手机端深度适配 --- */
@media (max-width: 640px) {
  .filter-status {
    flex-direction: column; /* 变成垂直排列 */
    align-items: center;    /* 内容整体居中 */
    text-align: center;
    padding: 5px;
    border-left: none;      /* 手机端去掉左边条，改成顶边条更和谐 */
    border-top: 4px solid var(--vp-c-brand-1);
  }

  .filter-status .clear-link {
    margin-left: 0;         /* 去掉靠右偏移 */
    margin-top: 10px;       /* 给按钮上方留点空隙 */
    width: 100px;           /* 按钮宽度适中 */
    padding: 6px 0;         /* 稍微加高一点，方便手指点击 */
  }
}
/* ============================================================
   桌面端特殊处理 (大于 960px)
   ============================================================ */
@media (min-width: 961px) {
  /* 桌面端绝对不显示手机那个滚动条 */
  .mobile-tag-scroller {
    display: none;
  }
}
/* 默认隐藏这个滚动条 */
.mobile-tag-scroller {
  display: none;
}

@media (max-width: 960px) {
  .mobile-tag-scroller {
    display: block; /* 改为 block 容器 */
				overflow-x: auto !important;
				scrollbar-width: none;
				-ms-overflow-style: none;
				-webkit-overflow-scrolling: touch;
    padding: 12px 0;
    margin-bottom: 15px;
    /* 左右渐变遮罩 */
    mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
    -webkit-mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
  }

  .mobile-tag-list-inner {
    display: flex;
    gap: 10px;
    width: max-content; /* 核心：让内容撑开宽度 */
    /* 添加动画：40秒向左漂移一次 */
    animation: mobile-slide-left 200s linear infinite;
  }

  /* 点击或长按时停下，方便大爷选中 */
  .mobile-tag-scroller:active .mobile-tag-list-inner {
    animation-play-state: paused;
  }

  .mobile-tag-item {
    flex: 0 0 auto;
    padding: 6px 14px;
    background: var(--vp-c-bg-soft);
    border: 1px solid var(--vp-c-divider);
    border-radius: 5px; /* 稍微圆润一点更漂亮 */
    font-size: 13px;
    color: var(--vp-c-text-2);
    white-space: nowrap;
    transition: all 0.2s;
  }

  .mobile-tag-item.active {
    background: #ff5f56 !important; /* 动力红 */
    color: white !important;
    border-color: #ff5f56 !important;
  }

  /* 手机端向左无限滚动的轨迹 */
  @keyframes mobile-slide-left {
    0% { transform: translateX(0); }
    100% { transform: translateX(-50%); }
  }
}
/* 1. 强制首页导航栏所有处于“活跃状态”的文字变回黑色 */
:global(.VPCNavbar .active .text),
:global(.VPCNavbar .active .vpi-chevron-down) {
  color: var(--vp-c-text-1) !important;
  fill: var(--vp-c-text-1) !important; /* 箭头可能是 SVG 图标 */
}

/* 2. 针对截图里显示的 Flyout 菜单单独加固 */
:global(.VPFlyout.active .text) {
  color: var(--vp-c-text-1) !important;
}

/* 3. 保留鼠标悬停时的蓝色（反馈感不能丢） */
:global(.VPNavBarMenuLink:hover .text),
:global(.VPFlyout:hover .text) {
  color: var(--vp-c-brand-1) !important;
}

/* 4. 隐藏底部那根讨厌的蓝线 */
:global(.VPNavBarMenuLink.active::after) {
  display: none !important;
}
.post-image-wrapper {
  /* 💡 核心：这是一段内联的 SVG，直接作为背景图 */
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 50 50'%3E%3Ccircle cx='25' cy='25' r='20' fill='none' stroke='%23ff5f56' stroke-width='4' stroke-dasharray='31.4 31.4' stroke-linecap='round'%3E%3CanimateTransform attributeName='transform' type='rotate' from='0 25 25' to='360 25 25' dur='0.8s' repeatCount='indefinite'/%3E%3C/circle%3E%3C/svg%3E");
  background-position: center;
  background-size: 40px; /* 控制旋转圈圈的大小 */
  background-repeat: no-repeat;
}

.post-image-wrapper img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  
  /* 💡 可选：加个淡入，让图片出来时别太生硬 */
  animation: imgFadeIn 0.5s ease-in;
}

@keyframes imgFadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
</style>
