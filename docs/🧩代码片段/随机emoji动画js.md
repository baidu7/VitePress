---
title: 随机emoji动画
description: 屏幕上会随机飘落五彩斑斓的小表情。
tags: [canvas, js, 特效]
outline: [2, 3]
---

# 🚀 随机emoji动画

**摸鱼终结者：让你的网页“动”起来**

给大家整点好玩的。折腾代码时搞了一个“Emoji 互动动画”：
1. **平时**：屏幕上会随机飘落五彩斑斓的小表情。
2. **惊喜**：如果你盯着网页看 10 秒钟不动（摸鱼检测），屏幕会瞬间蹦出一个超级大的 Emoji 占满全屏！
3. **使用**：新建`emoji.js`,引入即可

::: tip 💡
效果参考本页
:::

::: details 点我查看代码
```javascript {39-46}
(function() {
    // 1. 动态注入 CSS 样式
    const style = document.createElement('style');
    style.innerHTML = `
        .js-emoji-particle {
            position: fixed;
            pointer-events: none;
            user-select: none;
            z-index: 10000;
            animation: emojiFadeUp 2s ease-out forwards;
        }

        #js-big-emoji-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            display: none;
            justify-content: center;
            align-items: center;
            font-size: 60vw;
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(5px); /* 增加一点模糊感 */
            z-index: 20000;
            cursor: pointer;
            user-select: none;
        }

        @keyframes emojiFadeUp {
            0% { transform: translateY(0) scale(0.5); opacity: 0; }
            20% { opacity: 1; }
            100% { transform: translateY(-120px) scale(1.8); opacity: 0; }
        }
    `;
    document.head.appendChild(style);

    // 2. Emoji 资源库（手势 + 表情）
    function getRandomEmoji() {
        const ranges = [
            [0x1F600, 0x1F64F], // 表情 (Smiling faces, etc.)
            [0x1F910, 0x1F930], // 手势与新表情 (Thinking, hugging, etc.)
            [0x270A, 0x270D],   // 经典手势 (Fist, victory, etc.)
            [0x1F590, 0x1F596], // 更多手势
            [0x1F446, 0x1F450]  // 指向手势
        ];
        const range = ranges[Math.floor(Math.random() * ranges.length)];
        const codePoint = Math.floor(Math.random() * (range[1] - range[0] + 1)) + range[0];
        return String.fromCodePoint(codePoint);
    }

    // 3. 创建飘落的小 Emoji
    function spawnEmoji() {
        const el = document.createElement('div');
        el.className = 'js-emoji-particle';
        el.innerText = getRandomEmoji();
        el.style.left = Math.random() * 95 + 'vw';
        el.style.top = Math.random() * 95 + 'vh';
        el.style.fontSize = (Math.random() * 24 + 16) + 'px';
        document.body.appendChild(el);
        setTimeout(() => el.remove(), 2000);
    }

    // 持续生成
    setInterval(spawnEmoji, 400);

    // 4. 全屏大 Emoji 逻辑
    const overlay = document.createElement('div');
    overlay.id = 'js-big-emoji-overlay';
    document.body.appendChild(overlay);

    let idleTimer;
    const IDLE_THRESHOLD = 10000; // 10秒不动触发

    function showBigEmoji() {
        overlay.innerText = getRandomEmoji();
        overlay.style.display = 'flex';
    }

    function resetTimer() {
        if (overlay.style.display === 'flex') {
            overlay.style.display = 'none';
        }
        clearTimeout(idleTimer);
        idleTimer = setTimeout(showBigEmoji, IDLE_THRESHOLD);
    }

    // 监听交互：点击、移动、滚轮、按键
    ['mousedown', 'mousemove', 'keydown', 'scroll', 'touchstart'].forEach(type => {
        window.addEventListener(type, resetTimer, { passive: true });
    });

    // 初始化
    resetTimer();
})();
```
:::

<script setup>
import { onMounted, onBeforeUnmount, ref } from 'vue'

const isRunning = ref(false)
let emojiInterval, idleTimer, resetTimerFn

onMounted(() => {
    isRunning.value = true
    const style = document.createElement('style')
    style.id = 'emoji-style'
    style.innerHTML = `.js-emoji-particle { position: fixed; pointer-events: none; z-index: 10000; animation: emojiFadeUp 2s ease-out forwards; } #js-big-emoji-overlay { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; display: none; justify-content: center; align-items: center; font-size: 60vw; background: rgba(255,255,255,0.1); backdrop-filter: blur(5px); z-index: 20000; } @keyframes emojiFadeUp { 0% { transform: translateY(0) scale(0.5); opacity: 0; } 20% { opacity: 1; } 100% { transform: translateY(-120px) scale(1.8); opacity: 0; } }`;
    document.head.appendChild(style);

    const overlay = document.createElement('div');
    overlay.id = 'js-big-emoji-overlay';
    document.body.appendChild(overlay);

    resetTimerFn = () => {
        if (!isRunning.value) return;
        if (overlay) overlay.style.display = 'none';
        clearTimeout(idleTimer);
        idleTimer = setTimeout(() => {
            if (isRunning.value && overlay) {
                overlay.innerText = String.fromCodePoint(0x1F600 + Math.floor(Math.random() * 50));
                overlay.style.display = 'flex';
            }
        }, 10000);
    };

    emojiInterval = setInterval(() => {
        if (!isRunning.value) return;
        const el = document.createElement('div');
        el.className = 'js-emoji-particle';
        el.innerText = String.fromCodePoint(0x1F600 + Math.floor(Math.random() * 50));
        el.style.left = Math.random() * 95 + 'vw';
        el.style.top = Math.random() * 95 + 'vh';
        document.body.appendChild(el);
        setTimeout(() => el.remove(), 2000);
    }, 400);

    const events = ['mousedown', 'mousemove', 'keydown', 'scroll', 'touchstart'];
    events.forEach(type => window.addEventListener(type, resetTimerFn, { passive: true }));
    resetTimerFn();

    onBeforeUnmount(() => {
        isRunning.value = false;
        clearInterval(emojiInterval);
        clearTimeout(idleTimer);
        events.forEach(type => window.removeEventListener(type, resetTimerFn));
        style.remove();
        overlay.remove();
        document.querySelectorAll('.js-emoji-particle').forEach(el => el.remove());
    });
});
</script>