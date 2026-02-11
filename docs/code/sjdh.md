---
title: 四季动画js
description: 随四季变化显示不同特效js
tags: [canvas, js, 特效]
category: [🌐 网站相关, 代码片段]
date: 2026-01-18
outline: [2, 3]
---

# 四季动画js

1. 随四季变化显示不同特效
2. 用和风天气api，不同天气显示不同效果

::: code-group
```javascript [四季.js]
(function() {
    /**
     * 【1. 图片素材配置】
     * 建议使用 64x64 或 128x128 的透明 PNG
     */
    const assets = {
        spring: 'img/樱花.png', // 樱花瓣
        summer: 'img/绿叶.png', // 绿叶
        autumn: 'img/枫叶.png', // 枫叶
        winter: 'img/雪花.png'  // 雪花
    };

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    // pointer-events:none 保证点击穿透，不影响网页操作
    canvas.style.cssText = 'position:fixed;top:0;left:0;pointer-events:none;z-index:999999;';
    document.body.appendChild(canvas);

    let width, height, particles = [];
    let currentSeason = ''; 
    let imgObj = new Image();

    /**
     * 【2. 切换季节与密度控制】
     */
    function setSeason(s) {
        if (!assets[s]) return;
        currentSeason = s;
        const newImg = new Image();
        newImg.src = assets[s];
        newImg.onload = () => {
            imgObj = newImg;
            particles = [];
            
            // --- 调节密度 ---
            // 这里的数字就是屏幕上同时出现的粒子数量
            const counts = { 
                spring: 50,  // 樱花建议中等密度
                summer: 30,  // 绿叶建议稀疏一点，显得清爽
                autumn: 60,  // 枫叶建议多一点，有凋零感
                winter: 80  // 雪花建议多一些，营造氛围
            };
            
            for (let i = 0; i < (counts[s] || 50); i++) {
                particles.push(new Particle(true));
            }
            console.log(`当前效果：${s} (按1-4切换)`);
        };
    }

    // 键盘监听逻辑
    window.addEventListener('keydown', (e) => {
        const keyMap = { '1': 'spring', '2': 'summer', '3': 'autumn', '4': 'winter' };
        if (keyMap[e.key]) setSeason(keyMap[e.key]);
    });

    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resize);
    resize();

    /**
     * 【3. 粒子物理类】
     * 这里决定了每一个物体的“性格”
     */
    class Particle {
        constructor(randomY = false) {
            this.reset(randomY);
        }

        reset(randomY = false) {
            // --- 调节大小 ---
            // Math.random() * 范围 + 基础大小
            this.size = Math.random() * 15 + 15; 
            
            this.x = Math.random() * width;
            this.y = randomY ? Math.random() * height : -50;
            
            this.phi = Math.random() * Math.PI * 2; 
            this.period = Math.random() * 100 + 100; // 波动周期（值越大摆动越慢）
            
            /**
             * --- 核心参数调节面板 ---
             * velY: 垂直速度（越大掉得越快）
             * velX: 水平速度（正数向右吹，负数向左吹）
             * spinSpeed: 旋转速度（值越大转得越快）
             */
            switch(currentSeason) {
                case 'spring':
                    this.velY = Math.random() * 0.8 + 0.5; // 樱花较轻，慢速下落
                    this.velX = Math.random() * 1.2 + 0.8; // 春风较大，向右偏移
                    this.spinSpeed = Math.random() * 0.05 + 0.02;
                    break;
                case 'summer':
                    this.velY = Math.random() * 0.4 + 0.3; // 绿叶极慢，像在漂浮
                    this.velX = Math.random() * 0.4 - 0.2; // 几乎没风，随机微动
                    this.spinSpeed = 0.01; 
                    break;
                case 'autumn':
                    this.velY = Math.random() * 0.8 + 0.6; // 枫叶重，下落快
                    this.velX = Math.random() * 0.8 - 0.2; // 受风影响
                    this.spinSpeed = Math.random() * 0.04 + 0.02; // 枫叶旋转剧烈
                    break;
                case 'winter':
                    this.velY = Math.random() * 1.0 + 0.8; // 雪花匀速
                    this.velX = 0; // 雪花通常垂直，不设置横向风
                    this.spinSpeed = Math.random() * 0.02;
                    break;
            }
            this.angle = Math.random() * Math.PI * 2;
            this.opacity = Math.random() * 0.6 + 0.4;
        }

        update(tick) {
            const time = tick / this.period;

            /**
             * --- 轨迹算法调节 ---
             */
            switch(currentSeason) {
                case 'spring':
                    // 樱花：y轴带一点正弦波动，x轴加速滑动
                    this.y += this.velY + Math.sin(time * 1.5) * 0.5;
                    this.x += this.velX; 
                    this.angle += this.spinSpeed;
                    break;

                case 'summer':
                    // 绿叶：s型平滑轨迹，angle随波摆动（不转圈）
                    this.y += this.velY;
                    this.x += Math.sin(time * 0.5) * 1.5; // 左右晃动幅度
                    this.angle = Math.sin(time * 0.5) * 0.5; // 摆动角度限制
                    break;

                case 'autumn':
                    // 枫叶：利用abs函数制造出“一跳一跳”的阻力感
                    this.y += this.velY + Math.abs(Math.cos(time * 4)) * 1.0;
                    this.x += this.velX + Math.sin(time * 2) * 2;
                    this.angle = Math.sin(tick * this.spinSpeed) * 0.4;  // 只晃不转
                    break;

                case 'winter':
                    // 雪花：最纯净的线性下落
                    this.y += this.velY;
                    this.x += Math.sin(time) * 0.3; // 极小的空气浮动
                    this.angle += this.spinSpeed;
                    break;
            }

            // --- 边界检查 ---
            // 如果粒子出了屏幕，就重置到顶部
            if (this.y > height + 50 || this.x > width + 50 || this.x < -50) {
                this.reset(false);
            }
        }

        draw() {
            if (!imgObj.complete || !currentSeason) return;
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(this.angle);
            ctx.globalAlpha = this.opacity;
            
            // 冬天额外开启远近感（越透明的雪花越小）
            let displaySize = this.size;
            if (currentSeason === 'winter') {
                displaySize *= (this.opacity + 0.5); 
            }

            ctx.drawImage(imgObj, -displaySize/2, -displaySize/2, displaySize, displaySize);
            ctx.restore();
        }
    }

    /**
     * 【4. 动画驱动】
     */
    let tick = 0;
    function animate() {
        tick++;
        ctx.clearRect(0, 0, width, height);
        particles.forEach(p => {
            p.update(tick);
            p.draw();
        });
        requestAnimationFrame(animate);
    }

    // 启动逻辑
    const m = new Date().getMonth();
    const startS = (m >= 2 && m <= 4) ? 'spring' : (m >= 5 && m <= 7) ? 'summer' : (m >= 8 && m <= 10) ? 'autumn' : 'winter';
    setSeason(startS);
    animate();

})();
```

```javascript [四季加天气.js]
(function() {
    /**
     * 【1. 素材路径配置】
     */
    const assets = {
        spring: 'img/樱花.png',
        summer: 'img/绿叶.png',
        autumn: 'img/枫叶.png',
        winter: 'img/雪花.png',
        cloud:  'img/云.png' 
    };
    
    // 已经填入你提供的 KEY
    const WEATHER_KEY = '自己的key'; 

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.style.cssText = 'position:fixed;top:0;left:0;pointer-events:none;z-index:999999;';
    document.body.appendChild(canvas);

    let width, height, particles = [], splashes = [];
    let currentSeason = 'spring', currentWeather = 'clear'; 
    
    /**
     * 【新功能：自动季节判断】
     * 3-5月 春 | 6-8月 夏 | 9-11月 秋 | 12-2月 冬
     */
    function autoGetSeason() {
        const month = new Date().getMonth() + 1; 
        if (month >= 3 && month <= 5) return 'spring';
        if (month >= 6 && month <= 8) return 'summer';
        if (month >= 9 && month <= 11) return 'autumn';
        return 'winter';
    }

    // 图片加载池
    const imgPool = {};
    Object.keys(assets).forEach(key => {
        imgPool[key] = new Image();
        imgPool[key].src = assets[key];
    });

    // 快捷键映射
    const weatherMap = { 'q': 'clear', 'w': 'rain', 'e': 'windy', 'r': 'cloudy' };
    const seasonMap = { '1': 'spring', '2': 'summer', '3': 'autumn', '4': 'winter' };

    window.addEventListener('keydown', (e) => {
        const key = e.key.toLowerCase();
        if (seasonMap[key]) { currentSeason = seasonMap[key]; refreshParticles(); }
        else if (weatherMap[key]) { currentWeather = weatherMap[key]; refreshParticles(); }
    });

    async function syncWeather() {
        if (WEATHER_KEY === '你的API_KEY' || !WEATHER_KEY) return;
        try {
            const ipRes = await fetch('https://ipapi.co/json/');
            const ipData = await ipRes.json();
            const loc = `${ipData.longitude},${ipData.latitude}`;
            // 注意：此处使用了你提供的和风天气 API 地址
            const res = await fetch(`自己的地址?location=${loc}&key=${WEATHER_KEY}`);
            const data = await res.json();
            if (data.code === '200') {
                const text = data.now.text;
                if (text.includes('雨')) currentWeather = 'rain';
                else if (text.includes('风')) currentWeather = 'windy';
                else if (text.includes('阴') || text.includes('云') || text.includes('霾')) currentWeather = 'cloudy';
                else currentWeather = 'clear';
                refreshParticles();
            }
        } catch (e) { console.error("天气同步失败"); }
    }

    function refreshParticles() {
        particles = [];
        const countMap = { 
            clear: 60,   
            rain: 100,   
            windy: 80,   
            cloudy: 5    
        };
        let count = countMap[currentWeather] || 50;
        for (let i = 0; i < count; i++) particles.push(new Particle(true));
    }

    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resize);
    resize();

    class Splash {
        constructor(x, y) {
            this.x = x; this.y = y;
            this.vx = (Math.random() - 0.5) * 4;
            this.vy = -Math.random() * 3 - 2;
            this.gravity = 0.25;
            this.life = 1.0;
        }
        update() { 
            this.x += this.vx; this.y += this.vy; 
            this.vy += this.gravity; 
            this.life -= 0.04;
        }
        draw() {
            ctx.fillStyle = `rgba(100, 130, 160, ${this.life})`;
            ctx.beginPath(); ctx.arc(this.x, this.y, 1.5, 0, Math.PI * 2); ctx.fill();
        }
    }

    class Particle {
        constructor(randomY = false) { this.reset(randomY); }

        reset(randomY = false) {
            this.opacity = Math.random() * 0.5 + 0.3;
            this.angle = Math.random() * Math.PI * 2;
            
            if (currentWeather === 'cloudy') {
                this.x = randomY ? Math.random() * width : -300;
                this.y = Math.random() * height * 0.4;
                this.size = Math.random() * 80 + 130;
                this.velX = Math.random() * 0.3 + 0.2;
                this.velY = 0;
            } else if (currentWeather === 'windy') {
                this.x = randomY ? Math.random() * width : -200;
                this.y = Math.random() * height;
                this.velX = Math.random() * 15 + 15;
                this.velY = (Math.random() - 0.5) * 2;
                this.len = Math.random() * 150 + 100;
            } else if (currentWeather === 'rain') {
                this.x = Math.random() * width;
                this.y = randomY ? Math.random() * height : -100;
                this.velY = Math.random() * 5 + 10;
                this.velX = 0;
            } else {
                this.x = Math.random() * width;
                this.y = randomY ? Math.random() * height : -100;
                this.size = Math.random() * 15 + 15;
                const s = currentSeason;
                this.velY = s === 'summer' ? 0.4 : (s === 'autumn' ? 1.0 : 0.7);
                this.velX = (Math.random() - 0.5) * 0.5 + (s === 'spring' ? 0.8 : 0);
                this.spinSpeed = s === 'autumn' ? 0.05 : 0.02;
            }
        }

        update(tick) {
            if (currentWeather === 'rain') {
                this.y += this.velY;
                if (this.y >= height - 5) {
                    for(let i=0; i<3; i++) splashes.push(new Splash(this.x, height - 2));
                    this.reset(false);
                }
            } else {
                this.x += (this.velX || 0);
                this.y += (this.velY || 0);
                this.angle += (this.spinSpeed || 0);
                if(currentWeather === 'clear') this.x += Math.sin(tick / 50) * 0.5;
            }
            let limit = (currentWeather === 'cloudy') ? width + 500 : width + 200;
            if (this.x > limit || this.y > height + 200 || this.y < -300) this.reset(false);
        }

        draw() {
            ctx.save();
            ctx.globalAlpha = this.opacity;
            if (currentWeather === 'rain') {
                ctx.strokeStyle = `rgba(80, 110, 150, ${this.opacity})`;
                ctx.lineWidth = 2;
                ctx.beginPath(); ctx.moveTo(this.x, this.y); ctx.lineTo(this.x, this.y + 20); ctx.stroke();
            } else if (currentWeather === 'windy') {
                ctx.strokeStyle = `rgba(180, 180, 180, 0.4)`;
                ctx.lineWidth = 1;
                ctx.beginPath(); ctx.moveTo(this.x, this.y); ctx.lineTo(this.x - this.len, this.y); ctx.stroke();
            } else if (currentWeather === 'cloudy') {
                const img = imgPool['cloud'];
                if (img.complete && img.naturalWidth > 0) {
                    ctx.drawImage(img, this.x, this.y, this.size, this.size * 0.6);
                } else {
                    ctx.fillStyle = 'rgba(200, 220, 240, 0.15)';
                    ctx.beginPath(); ctx.arc(this.x, this.y, 40, 0, Math.PI*2); ctx.fill();
                }
            } else {
                const img = imgPool[currentSeason];
                if (img.complete && img.naturalWidth > 0) {
                    ctx.translate(this.x, this.y);
                    ctx.rotate(this.angle);
                    ctx.drawImage(img, -this.size/2, -this.size/2, this.size, this.size);
                }
            }
            ctx.restore();
        }
    }

    function animate(tick) {
        ctx.clearRect(0, 0, width, height);
        particles.forEach(p => { p.update(tick); p.draw(); });
        splashes = splashes.filter(s => s.life > 0);
        splashes.forEach(s => { s.update(); s.draw(); });
        requestAnimationFrame(() => animate(tick + 1));
    }

    /**
     * 【启动区】
     */
    syncWeather();                   // 随后联网尝试同步当前天气
    currentSeason = autoGetSeason(); // 启动时立刻根据月份判断季节
    refreshParticles();              // 根据自动判断的季节生成第一批粒子
    animate(0);                      // 开启循环动画
})();
```
:::


<script setup>
import { onMounted, onUnmounted } from 'vue'

onMounted(() => {
    (function() {
        const assets = {
            spring: 'https://gcore.jsdelivr.net/gh/baidu8/images@main/img/樱花.png',
            summer: 'https://gcore.jsdelivr.net/gh/baidu8/images@main/img/绿叶.png',
            autumn: 'https://gcore.jsdelivr.net/gh/baidu8/images@main/img/枫叶.png',
            winter: 'https://gcore.jsdelivr.net/gh/baidu8/images@main/img/雪花.png',
            cloud:  'https://gcore.jsdelivr.net/gh/baidu8/images@main/img/cloud.png' 
        };

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.style.cssText = 'position:fixed;top:0;left:0;pointer-events:none;z-index:999998;';
        document.body.appendChild(canvas);

        // --- 新增：切换控制台 UI ---
        const controls = document.createElement('div');
        controls.style.cssText = 'position:fixed;bottom:20px;right:20px;display:flex;gap:8px;z-index:999999;opacity:0.3;transition:opacity 0.3s;';
        controls.onmouseenter = () => controls.style.opacity = '1';
        controls.onmouseleave = () => controls.style.opacity = '0.3';
        
        const modes = [
            { id: '1', name: '春', type: 'season', val: 'spring', color: '#ffb7c5' },
            { id: '2', name: '夏', type: 'season', val: 'summer', color: '#7cfc00' },
            { id: '3', name: '秋', type: 'season', val: 'autumn', color: '#ff8c00' },
            { id: '4', name: '冬', type: 'season', val: 'winter', color: '#fff' },
            { id: 'Q', name: '晴', type: 'weather', val: 'clear', color: '#ffd700' },
            { id: 'W', name: '雨', type: 'weather', val: 'rain', color: '#00bfff' },
            { id: 'E', name: '风', type: 'weather', val: 'windy', color: '#adff2f' },
            { id: 'R', name: '云', type: 'weather', val: 'cloudy', color: '#ccc' }
        ];

        modes.forEach(m => {
            const btn = document.createElement('button');
            btn.innerText = m.name;
            btn.style.cssText = `padding:4px 8px;border:1px solid ${m.color};background:rgba(0,0,0,0.5);color:${m.color};cursor:pointer;border-radius:4px;font-size:12px;`;
            btn.onclick = () => {
                if(m.type === 'season') currentSeason = m.val;
                else currentWeather = m.val;
                refreshParticles();
            };
            controls.appendChild(btn);
        });
        document.body.appendChild(controls);
        // --- 控制台结束 ---

        let width, height, particles = [], splashes = [];
        let currentSeason = 'spring', currentWeather = 'clear'; 

        function autoGetSeason() {
            const month = new Date().getMonth() + 1; 
            if (month >= 3 && month <= 5) return 'spring';
            if (month >= 6 && month <= 8) return 'summer';
            if (month >= 9 && month <= 11) return 'autumn';
            return 'winter';
        }

        const imgPool = {};
        Object.keys(assets).forEach(key => {
            imgPool[key] = new Image();
            imgPool[key].src = assets[key];
        });

        async function syncWeather() {
            try {
                const res = await fetch('https://wttr.in/?format=j1');
                const data = await res.json();
                const desc = data.current_condition[0].weatherDesc[0].value.toLowerCase();
                if (desc.includes('rain') || desc.includes('shower')) currentWeather = 'rain';
                else if (desc.includes('wind')) currentWeather = 'windy';
                else if (desc.includes('cloud') || desc.includes('overcast')) currentWeather = 'cloudy';
                else currentWeather = 'clear';
                refreshParticles();
            } catch (e) { 
                currentWeather = 'clear';
                refreshParticles();
            }
        }

        function refreshParticles() {
            particles = [];
            const countMap = { clear: 40, rain: 80, windy: 60, cloudy: 6 };
            let count = countMap[currentWeather] || 40;
            for (let i = 0; i < count; i++) particles.push(new Particle(true));
        }

        function resize() {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        }
        window.addEventListener('resize', resize);
        resize();

        class Splash {
            constructor(x, y) {
                this.x = x; this.y = y;
                this.vx = (Math.random() - 0.5) * 4;
                this.vy = -Math.random() * 3 - 2;
                this.gravity = 0.25;
                this.life = 1.0;
            }
            update() { this.x += this.vx; this.y += this.vy; this.vy += this.gravity; this.life -= 0.04; }
            draw() {
                ctx.fillStyle = `rgba(100, 130, 160, ${this.life})`;
                ctx.beginPath(); ctx.arc(this.x, this.y, 1.5, 0, Math.PI * 2); ctx.fill();
            }
        }

        class Particle {
            constructor(randomY = false) { this.reset(randomY); }
            reset(randomY = false) {
                this.opacity = Math.random() * 0.5 + 0.3;
                this.angle = Math.random() * Math.PI * 2;
                if (currentWeather === 'cloudy') {
                    this.x = randomY ? Math.random() * width : -300;
                    this.y = Math.random() * height * 0.3;
                    this.size = Math.random() * 100 + 150;
                    this.velX = Math.random() * 0.2 + 0.1;
                } else if (currentWeather === 'rain') {
                    this.x = Math.random() * width;
                    this.y = randomY ? Math.random() * height : -100;
                    this.velY = Math.random() * 5 + 10;
                } else if (currentWeather === 'windy') {
                    this.x = randomY ? Math.random() * width : -200;
                    this.y = Math.random() * height;
                    this.velX = Math.random() * 10 + 10;
                    this.len = Math.random() * 100 + 50;
                } else {
                    this.x = Math.random() * width;
                    this.y = randomY ? Math.random() * height : -100;
                    this.size = Math.random() * 10 + 15;
                    const s = currentSeason;
                    this.velY = s === 'summer' ? 0.5 : (s === 'autumn' ? 1.2 : 0.8);
                    this.velX = (Math.random() - 0.5) * 0.5 + (s === 'spring' ? 1.0 : 0);
                    this.spinSpeed = s === 'autumn' ? 0.04 : 0.02;
                }
            }
            update(tick) {
                if (currentWeather === 'rain') {
                    this.y += this.velY;
                    if (this.y >= height - 5) {
                        for(let i=0; i<2; i++) splashes.push(new Splash(this.x, height - 2));
                        this.reset(false);
                    }
                } else {
                    this.x += (this.velX || 0); this.y += (this.velY || 0);
                    this.angle += (this.spinSpeed || 0);
                }
                if (this.x > width + 400 || this.y > height + 200 || this.y < -200) this.reset(false);
            }
            draw() {
                ctx.save();
                ctx.globalAlpha = this.opacity;
                if (currentWeather === 'rain') {
                    ctx.strokeStyle = '#506e96'; ctx.lineWidth = 2;
                    ctx.beginPath(); ctx.moveTo(this.x, this.y); ctx.lineTo(this.x, this.y + 20); ctx.stroke();
                } else if (currentWeather === 'cloudy') {
                    if (imgPool['cloud'].complete) ctx.drawImage(imgPool['cloud'], this.x, this.y, this.size, this.size * 0.6);
                } else if (currentWeather === 'windy') {
                    ctx.strokeStyle = 'LightSkyBlue'; ctx.beginPath(); ctx.moveTo(this.x, this.y); ctx.lineTo(this.x - this.len, this.y); ctx.stroke();
                } else {
                    const img = imgPool[currentSeason];
                    if (img.complete) {
                        ctx.translate(this.x, this.y); ctx.rotate(this.angle);
                        ctx.drawImage(img, -this.size/2, -this.size/2, this.size, this.size);
                    }
                }
                ctx.restore();
            }
        }

        function animate(tick) {
            ctx.clearRect(0, 0, width, height);
            particles.forEach(p => { p.update(tick); p.draw(); });
            splashes = splashes.filter(s => s.life > 0);
            splashes.forEach(s => { s.update(); s.draw(); });
            requestAnimationFrame(() => animate(tick + 1));
        }

        currentSeason = autoGetSeason();
        syncWeather();
        animate(0);
        
        window._weather_canvas = canvas;
        window._weather_controls = controls;
    })();
})

onUnmounted(() => {
    if (window._weather_canvas) window._weather_canvas.remove();
    if (window._weather_controls) window._weather_controls.remove();
})
</script>