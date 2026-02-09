---
title: 屏幕上有根毛
description: 随机位置出现一根毛
category: [🌐 网站相关, 代码片段]
date: 2026-01-18
tags: [js]
outline: [2, 3]
---

# 屏幕上有根毛
    

```javascript
// Code
!function() {
    var bottom = Math.floor(60 * Math.random()),
        right = Math.floor(50 * Math.random()),
        rotate = Math.floor(360 * Math.random());
    var foolsEgg = document.createElement("img");
    foolsEgg.src = "https://search-operate.cdn.bcebos.com/b028c278cbb84660f8bde79d819bc30b.png";
    foolsEgg.style.position = "fixed"; 
    foolsEgg.style.bottom = "".concat(bottom, "%");
    foolsEgg.style.right = "".concat(right, "%"); 
    foolsEgg.style.zIndex = "9999"; 
    foolsEgg.style.pointerEvents = "none";
    foolsEgg.style.width = "40%";
    foolsEgg.style.maxWidth = "190px";
    foolsEgg.style.transform = "".concat("rotate(", rotate, "deg)"); 
    document.body.append(foolsEgg);
} ();
```


<script setup>
import { onMounted, onUnmounted } from 'vue'

let eggElement = null; // 用来存这个蛋的引用

onMounted(() => {
    var bottom = Math.floor(60 * Math.random()),
        right = Math.floor(50 * Math.random()),
        rotate = Math.floor(360 * Math.random());
        
    eggElement = document.createElement("img");
    eggElement.src = "https://search-operate.cdn.bcebos.com/b028c278cbb84660f8bde79d819bc30b.png";
    eggElement.style.position = "fixed"; 
    eggElement.style.bottom = "".concat(bottom, "%");
    eggElement.style.right = "".concat(right, "%"); 
    eggElement.style.zIndex = "9999"; 
    eggElement.style.pointerEvents = "none";
    eggElement.style.width = "40%";
    eggElement.style.maxWidth = "190px";
    eggElement.style.transform = "".concat("rotate(", rotate, "deg)"); 
    
    document.body.append(eggElement);
})

// 当离开这个页面时，把蛋删掉
onUnmounted(() => {
    if (eggElement) {
        eggElement.remove();
    }
})
</script>