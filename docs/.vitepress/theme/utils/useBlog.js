// useBlog.js
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vitepress'

export function useBlog(allPosts) {
  const pageSize = 9
  const currentPage = ref(1)
  const selectedTag = ref('')
  const { route } = useRouter()

  // 1. 同步函数
  const syncEverything = () => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search)
      selectedTag.value = params.get('tag') || ''
      currentPage.value = parseInt(params.get('page')) || 1
    }
  }

  // 2. 监听与巡逻
  watch(() => route.path + (typeof window !== 'undefined' ? window.location.search : ''), syncEverything)

  onMounted(() => {
    syncEverything()
    setInterval(() => {
      if (typeof window !== 'undefined') {
        const tagFromUrl = new URLSearchParams(window.location.search).get('tag') || ''
        if (tagFromUrl !== selectedTag.value) syncEverything()
      }
    }, 500)
  })

  // 3. 标签与过滤逻辑
  const allTags = computed(() => {
    const tags = new Set()
    allPosts.forEach(post => {
      if (post.category) tags.add(post.category)
      if (Array.isArray(post.tags)) post.tags.forEach(t => tags.add(t))
    })
    return Array.from(tags)
  })

  const filteredPosts = computed(() => {
    let results = [...allPosts]
    results.sort((a, b) => (b.date ? new Date(b.date) : 0) - (a.date ? new Date(a.date) : 0))
    if (!selectedTag.value) return results
    return results.filter(post => 
      post.category === selectedTag.value || (Array.isArray(post.tags) && post.tags.includes(selectedTag.value))
    )
  })

  // 4. 分页逻辑
  const totalPages = computed(() => Math.ceil(filteredPosts.value.length / pageSize) || 1)
  const posts = computed(() => {
    const start = (currentPage.value - 1) * pageSize
    return filteredPosts.value.slice(start, start + pageSize)
  })

  const updateRoute = (tag, page) => {
    selectedTag.value = tag
    currentPage.value = page
    const params = new URLSearchParams()
    if (tag) params.set('tag', tag)
    if (page > 1) params.set('page', page)
    const query = params.toString()
    window.history.pushState(null, '', query ? `?${query}` : window.location.pathname)
  }

  const filterByTag = (tag) => { updateRoute(tag, 1); window.scrollTo({ top: 0, behavior: 'smooth' }) }
  const updatePage = (num) => { updateRoute(selectedTag.value, num); window.scrollTo({ top: 0, behavior: 'smooth' }) }

  // 5. GitHub Issues (说说) 逻辑
  const latestIssues = ref([])
  onMounted(async () => {
    try {
      const res = await fetch(`https://api.github.com/repos/baidu7/baidu7.github.io/issues?state=open&labels=shuo&per_page=1`)
      const data = await res.json()
      if (data?.length > 0) {
        latestIssues.value = data.map(item => {
          let cleanText = item.body.replace(/<[^>]+>/g, '').replace(/!\[.*?\]\((.*?)\)/g, '[图片]').replace(/\[(.*?)\]\(.*?\)/g, '$1').replace(/\n/g, ' ').trim()
          return { text: cleanText.length > 40 ? cleanText.substring(0, 40) + '...' : cleanText, url: '/shuo' }
        })
      }
    } catch (e) { console.error(e) }
  })

  // 把 HTML 里要用的变量和函数都“交”出去
  return {
    currentPage, selectedTag, allTags, filteredPosts, posts, totalPages,
    filterByTag, updatePage, prevPage: () => { if (currentPage.value > 1) updatePage(currentPage.value - 1) },
    nextPage: () => { if (currentPage.value < totalPages.value) updatePage(currentPage.value + 1) },
    latestIssues,
    visiblePageNumbers: computed(() => {
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
  }
}