<template>
  <div class="encourage-box">
    <p>✨ {{ quote }}</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { quotes } from '../quotes.js' // 引入那50句

const quote = ref('')

onMounted(() => {
  // 从50句里随机抓一句
  quote.value = quotes[Math.floor(Math.random() * quotes.length)]
})
</script>

<style scoped>
.encourage-box {
  margin-top: 3rem;
  padding: 1.5rem;
  border-top: 1px dashed var(--vp-c-divider);
  text-align: center;
  color: var(--vp-c-text-2);
  font-style: italic;
  font-size: 0.95rem;
}
</style>
