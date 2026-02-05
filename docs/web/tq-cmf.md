---
title: 网站天气组件
description: 怎么给自己的个人网站加个天气预报，最好是能自动定位、不花钱、还不用注册 API Key 的。今天我就把这套“保姆级”的代码分享出来。
tags: [js, html, css, 分享, 代码, 天气, api]
outline: [2, 3]
---


# 给网站加个自动定位天气（纯免费）

怎么给自己的个人网站加个天气预报，最好是能自动定位、不花钱、还不用注册 API Key 的。今天我就把这套“保姆级”的代码分享出来。

> 新建js引入即可使用

## 🌟 亮点
* **自动定位**：无需 GPS，通过 IP 智能识别城市。
* **零成本**：使用开源接口，完全免费。

## 🚨 缺点
**速度有点慢**


## 🔴 实时效果演示

这是我为您搭建的一个“零依赖”天气看板。它现在正尝试探测您的位置并抓取天气：

<div class="demo-box">
  <div id="live-weather">正在调取接口...</div>
  <button onclick="window.location.reload()" class="refresh-btn">刷新测试</button>
</div>

<script setup>
import { onMounted } from 'vue'

onMounted(async () => {
  const el = document.getElementById('live-weather')
  try {
    // 1. 获取定位
    const geo = await fetch('https://api.ip.sb/geoip').then(r => r.json())
    // 2. 获取天气
    const weather = await fetch(`https://wttr.in/${geo.city}?format=j1&lang=zh`).then(r => r.json())
    const cur = weather.current_condition[0]
    
    el.innerHTML = `
      <div style="font-size: 1.2rem; color: var(--vp-c-brand); font-weight: bold;">
        📍 ${geo.city === 'Jinan' ? '济南' : geo.city}
      </div>
      <div style="margin-top: 10px;">
        ${cur.temp_C}°C · ${cur.lang_zh[0].value}
      </div>
      <div style="font-size: 0.8rem; opacity: 0.6; margin-top: 5px;">
        数据来源：wttr.in (IP 定位)
      </div>
    `
  } catch (e) {
    el.innerHTML = '⚠️ 探测失败，请检查网络（或尝试关闭代理）'
  }
})
</script>

<style scoped>
.demo-box {
  border: 2px dashed var(--vp-c-divider);
  border-radius: 12px;
  padding: 30px;
  text-align: center;
  background: var(--vp-c-bg-soft);
  margin: 20px 0;
}
.refresh-btn {
  margin-top: 15px;
  padding: 5px 15px;
  border-radius: 20px;
  background: var(--vp-c-brand);
  color: white;
  font-size: 12px;
  cursor: pointer;
}
</style>

`<div id="weather-plugin-universal">加载天气中...</div>`
::: details 点我查看代码
```js
<script>
(function() {
  const container = document.getElementById('weather-plugin-universal');
  const CACHE_KEY = 'universal_weather_cache';

  async function initWeather() {
    // 检查缓存
    const cache = JSON.parse(localStorage.getItem(CACHE_KEY) || '{}');
    if (cache.time && (Date.now() - cache.time < 3600000)) {
      render(cache.data);
      return;
    }

    try {
      // 获取定位 (ip.sb)
      const geoRes = await fetch('https://api.ip.sb/geoip');
      const geoData = await geoRes.json();
      const city = geoData.city || 'Jinan';

      // 获取天气 (wttr.in)
      const weatherRes = await fetch(`https://wttr.in/${city}?format=j1&lang=zh`);
      const wData = await weatherRes.json();
      const current = wData.current_condition[0];

      const result = {
        city: city === 'Jinan' ? '济南' : (geoData.city || city),
        temp: current.temp_C,
        desc: current.lang_zh ? current.lang_zh[0].value : '晴'
      };

      // 存入缓存并渲染
      localStorage.setItem(CACHE_KEY, JSON.stringify({ time: Date.now(), data: result }));
      render(result);
    } catch (e) {
      container.innerHTML = '📍 济南 · 晴好'; // 失败保底
    }
  }

  function render(data) {
    container.innerHTML = `
      <div style="padding: 10px; border: 1px solid #ddd; border-radius: 8px; font-size: 13px; color: #666;">
        <b style="color: #333;">📍 ${data.city}</b> | ${data.temp}°C · ${data.desc}
      </div>
    `;
  }

  initWeather();
})();
</script>
```
:::