---
layout: home
---

<script setup>
import { data as allPosts } from './.vitepress/posts.data.mjs'
import { useBlog } from './.vitepress/theme/utils/useBlog.js'

// 一行代码调用所有逻辑
const { 
  currentPage, selectedTag, allTags, posts, totalPages, 
  filterByTag, updatePage, prevPage, nextPage, 
  latestIssues, visiblePageNumbers 
} = useBlog(allPosts)
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