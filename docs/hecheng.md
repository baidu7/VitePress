---
title: 合成水果
description: 合成水果小游戏
cover: https://gcore.jsdelivr.net/gh/baidu7/images@main/img/img-1772024908412.jpg
date: 2026-02-25
layout: page
outline: false        # 顺便把右侧大纲也关了，更清爽
breadcrumb: false     # 如果插件支持面包屑开关
lastUpdated: false    # 关掉右侧那个“最后更新”
editLink: false       # 关掉编辑链接
---
<ClientOnly>
  <component :is="'script'" src="https://cdnjs.cloudflare.com/ajax/libs/matter-js/0.19.0/matter.min.js" @load="initGame"></component>

  <div class="game-outer-container">
    <div class="game-wrapper">
      <div class="ui-layer">
        <div class="score-container">
          <div class="score-item"><span class="label">分数</span><span class="value">{{ score }}</span></div>
          <div class="score-item"><span class="label">最高</span><span class="value">{{ highScore }}</span></div>
          <div class="score-item"><span class="label">下一个</span><span class="value">{{ EMOJIS[nextLevel] }}</span></div>
        </div>
        <div class="action-icons">
								<div class="fullscreen-icon" @click="toggleFullScreen">⛶</div>
          <div class="mute-icon" @click="toggleMute">
            {{ isMuted ? '??' : '??' }}
          </div>
          <div class="reset-icon" @click="restartGame">♻️</div>
        </div>
      </div>
      <div class="danger-countdown" v-if="countdown > 0 && !isGameOver">
        <div class="count-num">{{ countdown }}</div>
        <div class="count-text">危！快合成！</div>
      </div>
      <div class="game-over-mask" v-if="isGameOver">
        <div class="glass-card">
          <div class="over-emoji">??</div>
          <div class="over-title">完犊子了</div>
          <button class="retry-btn" @click="restartGame">再来一局</button>
        </div>
      </div>
      <div id="game-container" 
        @mousedown="handleTouchStart" @mousemove="handleTouchMove" @mouseup="handleTouchEnd"
        @touchstart.passive="handleTouchStart" @touchmove.passive="handleTouchMove" @touchend.passive="handleTouchEnd"
      ></div>
    </div>
  </div>
</ClientOnly>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue';

// --- 状态与音效 ---
const isGameOver = ref(false);
const score = ref(0);
const highScore = ref(0);
const isWarning = ref(false); 
const isTouching = ref(false); 
const nextLevel = ref(0);
const countdown = ref(0);
const bgm = ref(null);
const isMuted = ref(false); // 是否静音

const EMOJIS = ['??', '??', '??', '??', '??', '??', '??', '??', '??', '??', '??'];
const SOUNDS = {
  pop: '/audio/combine.mp3', 
  drop: '/audio/drop.mp3', 
  over: '/audio/big.mp3'  
};

const playSfx = (url) => {
  const audio = new Audio(url);
  audio.volume = 0.4;
  audio.play().catch(() => {});
};

const toggleMute = () => {
  isMuted.value = !isMuted.value;
  if (!bgm.value) return;

  if (isMuted.value) {
    bgm.value.pause(); // 彻底停止声音
  } else {
    bgm.value.volume = 0.15;
    bgm.value.play().catch(() => {});
  }
};

const startBgm = () => {
  if (!bgm.value) {
    // 这里的链接换回你自己的 bgm 路径
    bgm.value = new Audio('https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3'); 
    bgm.value.loop = true;
  }
  
  // 如果当前是静音状态，直接暂停并返回，不许播放
  if (isMuted.value) {
    bgm.value.pause();
    return;
  }

  bgm.value.volume = 0.15;
  if (bgm.value.paused) {
    bgm.value.play().catch(() => {});
  }
};
// --- 全局变量 ---
let engine, render, runner, mjs;
let lastX = 0, width, height, lastSpawnTime = 0;
let countdownTimer = null;
let checkTimer = null; // 死亡判定的轮询计时器

onMounted(() => {
  // 1. 原有的逻辑：读取最高分
  highScore.value = parseInt(localStorage.getItem('watermelon_best') || 0);

  // 2. 新增的逻辑：优化手机端手感（禁用缩放，消除点击延迟）
  const meta = document.querySelector('meta[name="viewport"]');
  if (meta) {
    // 备份原本的设置，以便退出页面时还原
    const oldContent = meta.getAttribute('content');
    
    // 强制设置为：禁止用户手动缩放，从而触发浏览器的响应加速
    meta.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no');

    // 3. 离开页面时的清理工作
    onUnmounted(() => {
      meta.setAttribute('content', oldContent);
    });
  }
});

watch(score, (newVal) => {
  if (newVal > highScore.value) {
    highScore.value = newVal;
    localStorage.setItem('watermelon_best', newVal);
  }
});

// --- 游戏初始化 ---
const initGame = () => {
  if (typeof Matter === 'undefined') return;
  mjs = Matter;

  const container = document.getElementById('game-container');
  width = container.clientWidth || 360;
  height = 600;

  // 修改 initGame 里的 engine 创建
  engine = mjs.Engine.create({ 
    enableSleeping: true, // 开启睡眠模式，大幅降低 CPU 占用
    positionIterations: 6, // 默认是 6，如果卡顿可以调到 4
    velocityIterations: 4, 
    gravity: { x: 0, y: 1.5 } 
  });
  // 找到 initGame 里的 render 创建部分，修改如下：
  render = mjs.Render.create({
    element: container,
    engine: engine,
    options: {
      width: 360,
      height: 600,
      wireframes: false,
      background: 'transparent',
						showSleeping: false,    // ✨ 关键！设置为 false，睡眠中的球就不会变色了
      pixelRatio: window.devicePixelRatio || 1 // 核心：解决高清屏下的像素偏移
    }
  });

  // 边界
  const wallOptions = { isStatic: true, friction: 0.5, restitution: 0.4 };
  mjs.Composite.add(engine.world, [
    mjs.Bodies.rectangle(width/2, height - 10, width, 20, wallOptions),
    mjs.Bodies.rectangle(-25, height/2, 50, height, wallOptions),
    mjs.Bodies.rectangle(width + 25, height/2, 50, height, wallOptions)
  ]);

  // 自定义渲染
  mjs.Events.on(render, 'afterRender', () => {
    const context = render.context;
				context.shadowBlur = 0;
    const deadline = 80;
    if (isTouching.value && !isGameOver.value) {
      context.save();
      // 瞄准线改细一点，颜色淡一点
      context.setLineDash([5, 10]);
      context.beginPath();
      context.moveTo(lastX, 80);
      context.lineTo(lastX, height);
      context.strokeStyle = 'rgba(255, 255, 255, 0.1)'; 
      context.stroke();
      
      // 给预览水果加个动态浮动
      const floatY = 25 + Math.sin(Date.now() / 200) * 2;
      context.translate(lastX, floatY); 
      context.textAlign = 'center';
      context.font = '42px serif';
      // 淡淡的辉光感
      context.shadowBlur = 15;
      context.shadowColor = 'rgba(255,255,255,0.5)';
      context.fillText(EMOJIS[nextLevel.value], 0, 0);
      context.restore();
    }
    // 预览球
    if (isTouching.value && !isGameOver.value) {
      context.save();
      context.setLineDash([8, 8]);
      context.beginPath();
      context.moveTo(lastX, deadline);
      context.lineTo(lastX, height);
      context.strokeStyle = 'rgba(255, 255, 255, 0.2)';
      context.stroke();
      context.translate(lastX, 28);
      context.textAlign = 'center'; context.font = '40px serif';
      context.globalAlpha = 0.8;
      context.fillText(EMOJIS[nextLevel.value], 0, 0);
      context.restore();
    }

    // 危险线
    context.save();
    context.beginPath();
    context.setLineDash([5, 5]);
    context.moveTo(0, deadline); context.lineTo(width, deadline);
    const op = isWarning.value ? Math.abs(Math.sin(Date.now() / 200)) : 0.3;
    context.strokeStyle = isWarning.value ? `rgba(255, 71, 87, ${op})` : 'rgba(255, 255, 255, 0.3)';
    context.stroke();
    context.restore();

    // 绘制水果
    mjs.Composite.allBodies(engine.world).forEach(body => {
      if (body.label.startsWith('level_')) {
        const level = parseInt(body.label.split('_')[1]);
        context.save();
        context.translate(body.position.x, body.position.y);
        context.rotate(body.angle);
        context.textAlign = 'center'; context.textBaseline = 'middle';
        context.font = `${body.circleRadius * 2.2}px serif`;
        context.fillText(EMOJIS[level], 0, 0);
        context.restore();
      }
    });
  });

  // 碰撞
  mjs.Events.on(engine, 'collisionStart', (e) => {
    e.pairs.forEach(pair => {
      const { bodyA, bodyB } = pair;
      if (bodyA.label === bodyB.label && bodyA.label.startsWith('level_')) {
        const level = parseInt(bodyA.label.split('_')[1]);
        if (level < EMOJIS.length - 1) {
          playSfx(SOUNDS.pop);
          const newX = (bodyA.position.x + bodyB.position.x) / 2;
          const newY = (bodyA.position.y + bodyB.position.y) / 2;
          mjs.Composite.remove(engine.world, [bodyA, bodyB]);
          const nextL = level + 1;
          const newFruit = mjs.Bodies.circle(newX, newY, 18 + nextL * 6, { label: 'level_' + nextL, restitution: 0.3 });
          mjs.Composite.add(engine.world, newFruit);
          score.value += nextL * 5;
        }
      }
    });
  });

  runner = mjs.Runner.create();
  mjs.Runner.run(runner, engine);
  mjs.Render.run(render);

  // 死亡检查
  checkTimer = setInterval(() => {
    if (isGameOver.value) return;
    const bodies = mjs.Composite.allBodies(engine.world);
    const vio = bodies.some(b => !b.isStatic && b.position.y < 80 && Math.abs(b.velocity.y) < 0.1);
    isWarning.value = vio;

    if (vio && countdown.value <= 0) {
      countdown.value = 5;
      countdownTimer = setInterval(() => {
        countdown.value--;
        if (countdown.value <= 0) {
          clearInterval(countdownTimer);
          if (isWarning.value) { isGameOver.value = true; playSfx(SOUNDS.over); }
        }
      }, 1000);
    } else if (!vio) {
      if (countdownTimer) { clearInterval(countdownTimer); countdownTimer = null; }
      countdown.value = 0;
    }
  }, 500);
};

// --- 操作函数 ---
const updateX = (e) => {
  const container = document.getElementById('game-container');
  if (!container) return;
  
  const rect = container.getBoundingClientRect();
  const clientX = e.touches ? e.touches[0].clientX : e.clientX;
  
  // 核心：用 clientX 减去容器左侧距离，这样无论容器在哪，坐标都是准的
  lastX = Math.max(20, Math.min(clientX - rect.left, width - 20));
};

const handleTouchStart = (e) => { startBgm(); isTouching.value = true; updateX(e); };
const handleTouchMove = (e) => { if(isTouching.value) updateX(e); };
const handleTouchEnd = () => {
  if (!isTouching.value || isGameOver.value || !mjs) return;
  if (Date.now() - lastSpawnTime < 600) return;
  lastSpawnTime = Date.now();
  playSfx(SOUNDS.drop);
  const fruit = mjs.Bodies.circle(lastX, 40, 18, { label: 'level_' + nextLevel.value, restitution: 0.3 });
  mjs.Composite.add(engine.world, fruit);
  nextLevel.value = Math.floor(Math.random() * 3);
  isTouching.value = false;
};

const restartGame = () => {
  if (!mjs || !engine) return;
  mjs.Composite.clear(engine.world, false);
  const wallOptions = { isStatic: true, friction: 0.5, restitution: 0.4 };
  mjs.Composite.add(engine.world, [
    mjs.Bodies.rectangle(width/2, height - 10, width, 20, wallOptions),
    mjs.Bodies.rectangle(-25, height/2, 50, height, wallOptions),
    mjs.Bodies.rectangle(width + 25, height/2, 50, height, wallOptions)
  ]);
  score.value = 0; isGameOver.value = false; isWarning.value = false; countdown.value = 0;
  if (countdownTimer) { clearInterval(countdownTimer); countdownTimer = null; }
};

onUnmounted(() => {
    console.log("清理游戏资源...");
    if (bgm.value) {
      bgm.value.pause();
      bgm.value.src = ""; // 彻底切断音频源
      bgm.value = null;
    }
    // 清理计时器
    if (checkTimer) clearInterval(checkTimer);
    if (countdownTimer) clearInterval(countdownTimer);
    
    // 清理 Matter.js
    if (mjs) {
      if (runner) mjs.Runner.stop(runner);
      if (render) {
        mjs.Render.stop(render);
        if (render.canvas) render.canvas.remove();
      }
      if (engine) mjs.Engine.clear(engine);
    }
  });
const toggleFullScreen = () => {
  const elem = document.querySelector('.game-wrapper');
  const isIOS = /iPhone|iPod/.test(navigator.userAgent);

  // 1. 先检查是否处于 iOS 伪全屏状态，如果是，点击就退出
  if (elem.classList.contains('ios-fake-fullscreen')) {
    elem.classList.remove('ios-fake-fullscreen');
    return;
  }

  // 2. 如果是 iOS 设备且不在伪全屏状态，进入伪全屏
  if (isIOS) {
    elem.classList.add('ios-fake-fullscreen');
    return;
  }

  // 3. 非 iOS 设备走标准 API
  if (!document.fullscreenElement) {
    if (elem.requestFullscreen) {
      elem.requestFullscreen();
    } else if (elem.webkitRequestFullscreen) {
      elem.webkitRequestFullscreen();
    }
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    }
  }
};
</script>

<style scoped>
/* 1. 基础布局与外框 */
.game-outer-container { display: flex; justify-content: center; padding: 20px 0; user-select: none; }
.game-wrapper { 
  position: relative; width: 360px; height: 600px; 
  background: radial-gradient(circle at center, #2c3e50 0%, #000 100%);
  border: 6px solid #1a1a1a; border-radius: 30px; 
  overflow: hidden; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5); touch-action: none; 
}
#game-container { width: 100%; height: 100%; background: transparent; }

/* 2. 顶端 UI 控制层 */
.ui-layer { 
  position: absolute; top: 12px; width: 100%; z-index: 10;
  display: flex; justify-content: space-between; align-items: flex-start;
  padding: 0 15px; pointer-events: none; 
}
.score-container { display: flex; gap: 6px; }
.score-item { 
  background: rgba(255,255,255,0.1); backdrop-filter: blur(4px);
  padding: 4px 10px; border-radius: 10px; color: #fff;
  border: 1px solid rgba(255,255,255,0.1); text-align: center; min-width: 55px;
}
.label { font-size: 8px; color: #aaa; display: block; text-transform: uppercase; margin-bottom: 2px; }
.value { font-size: 16px; font-weight: bold; font-family: monospace; }

/* 3. 右侧按钮组 */
.action-icons { 
  display: flex; gap: 12px; align-items: center; pointer-events: auto;
  background: rgba(255,255,255,0.05); padding: 5px 12px; border-radius: 10px;
  backdrop-filter: blur(10px); border: 1px solid rgba(255,255,255,0.1);
}
.mute-icon, .reset-icon, .fullscreen-icon { 
  font-size: 22px; cursor: pointer; color: #fff; transition: 0.2s; user-select: none; 
}
.mute-icon:hover, .fullscreen-icon:hover { transform: scale(1.1); }
.reset-icon:hover { transform: rotate(180deg); }

/* 4. 游戏提示与状态 */
.danger-countdown { position: absolute; top: 140px; left: 50%; transform: translateX(-50%); text-align: center; z-index: 50; pointer-events: none; }
.count-num { font-size: 90px; font-weight: 900; color: #ff4757; text-shadow: 0 0 30px rgba(255,71,87,0.6); animation: pulse-zoom 0.5s infinite alternate; }
.count-text { color: #ff4757; font-weight: bold; background: rgba(0,0,0,0.6); padding: 2px 12px; border-radius: 20px; font-size: 14px; }

.game-over-mask { position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.85); display: flex; align-items: center; justify-content: center; z-index: 100; backdrop-filter: blur(5px); }
.glass-card { background: #fff; padding: 35px; border-radius: 24px; text-align: center; box-shadow: 0 10px 30px rgba(0,0,0,0.5); }
.retry-btn { background: #42b883; color: #fff; border: none; padding: 12px 35px; border-radius: 25px; cursor: pointer; font-weight: bold; transition: 0.2s; }
.retry-btn:hover { transform: scale(1.05); }

/* 5. 全屏沉浸式美化 (核心清理) */
.game-wrapper:fullscreen, .game-wrapper:-webkit-full-screen { 
  width: 100vw; height: 100vh; background: #050505; 
  display: flex; justify-content: center; align-items: center; border: none; border-radius: 0;
}
.game-wrapper:fullscreen #game-container { 
  width: 360px; height: 600px; margin: auto; position: relative;
  border: 2px solid rgba(66, 184, 131, 0.5); border-radius: 20px;
  box-shadow: 0 0 50px rgba(66, 184, 131, 0.2);
  background: radial-gradient(circle at center, #1a2a3a 0%, #000 100%);
  transform: scale(1.2); /* 适度放大，兼顾清晰度 */
  animation: setup-glow 4s infinite alternate;
}
.game-wrapper:fullscreen .ui-layer { width: 340px; top: 30px; left: 50%; transform: translateX(-50%); }

/* 6. 动画库 */
@keyframes pulse-zoom { from { transform: scale(1); } to { transform: scale(1.15); } }
@keyframes setup-glow { from { box-shadow: 0 0 30px rgba(66,184,131,0.1); } to { box-shadow: 0 0 60px rgba(66,184,131,0.3); } }
/* 在你的 CSS 中添加这一段 */
#game-container canvas {
  display: block;
  margin: 0 auto;
  /* 确保 canvas 能够平滑拉伸 */
  width: 100% !important;
  height: 100% !important;
  object-fit: contain;
}
.game-wrapper:fullscreen #game-container {
  width: 360px;
  height: 600px;
  margin: auto;
  position: relative;
  /* 解决裂缝的核心：不要直接缩放容器，而是让容器背景颜色一致 */
  border: 6px solid #1A1A1A;
  border-radius: 20px;
  box-shadow: 0 0 50px rgba(66, 184, 131, 0.4);
  transform: scale(1.15); /* 稍微减小一点缩放，留出 UI 空间 */
  animation: setup-glow 4s infinite alternate;
  /* 增加这一行，防止内部 canvas 溢出产生线条 */
  overflow: hidden; 
}
/* --- iOS 专项沉浸式补丁 (整理压缩版) --- */
.ios-fake-fullscreen {
  position: fixed !important;
  top: 0 !important; left: 0 !important;
  width: 100vw !important; height: 100vh !important;
  z-index: 99999 !important;
  background: radial-gradient(circle at center, #1a2a3a 0%, #050505 100%) !important;
  display: flex !important;
  flex-direction: column;
  align-items: center;
  /* 避开刘海并整体下移，增强长屏视觉平衡 */
  padding-top: calc(env(safe-area-inset-top) + 60px);
  overflow: hidden !important;
  touch-action: none !important;
}

.ios-fake-fullscreen #game-container {
  width: 360px; height: 600px;
  display: block; margin: 0 auto;
  /* 比例缩放：以顶部中心为原点，配合 padding 实现精准定位 */
  transform: scale(1.15);
  transform-origin: top center;
  border: 3px solid rgba(66, 184, 131, 0.4);
  border-radius: 18px;
  box-shadow: 0 0 50px rgba(0,0,0,0.8);
		/* 解决裂缝的核心：不要直接缩放容器，而是让容器背景颜色一致 */
		border: 6px solid #1A1A1A;
		border-radius: 20px;
		box-shadow: 0 0 50px rgba(66, 184, 131, 0.4);
		transform: scale(1.15); /* 稍微减小一点缩放，留出 UI 空间 */
		animation: setup-glow 4s infinite alternate;
		/* 增加这一行，防止内部 canvas 溢出产生线条 */
		overflow: hidden; 
}

.ios-fake-fullscreen .ui-layer {
  position: absolute;
  /* UI 浮动在安全区下方，不与灵动岛/刘海重叠 */
  top: calc(env(safe-area-inset-top) + 20px) !important;
  width: 90%; max-width: 340px;
  left: 50%; transform: translateX(-50%);
  pointer-events: none;
}

/* 强制横屏提示 */
@media screen and (orientation: landscape) {
  .ios-fake-fullscreen::after {
    content: "请竖屏锁定手机以获得最佳体验";
    position: absolute; top: 0; left: 0;
    width: 100%; height: 100%;
    background: rgba(0,0,0,0.95);
    color: #fff; font-weight: bold;
    display: flex; align-items: center; justify-content: center;
    z-index: 100000;
  }
}
</style>