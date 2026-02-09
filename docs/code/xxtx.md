---
title: 下雪特效
description: 漂亮的下雪特效js
tags: [canvas, js, 特效]
category: [🌐 网站相关, 代码片段]
date: 2026-01-18
outline: [2, 3]
---

# 下雪特效js

```js
! function () {
    let t = document.getElementById("snow-canvas");
    t || ((t = document.createElement("canvas")).id = "snow-canvas", Object.assign(t.style, {
        position: "fixed",
        top: "0",
        left: "0",
        width: "100vw",
        height: "100vh",
        pointerEvents: "none",
        zIndex: "99999",
        display: "block"
    }), document.body.appendChild(t));
    const i = t.getContext("2d");
    let e, n, s = [];
    const a = 100,
        h = new Image;

    function o() {
        e = window.innerWidth, n = window.innerHeight, t.width = e, t.height = n
    }
    h.src = "https://s2.loli.net/2026/01/10/R23AUFtcbYyE7CH.png";
    class d {
        constructor() {
            this.init()
        }
        init() {
            this.x = Math.random() * e, this.y = Math.random() * n, this.size = 15 * Math.random() + 10, this.speed =
                1 * Math.random() + .5, this.velX = .5 * Math.random() - .25, this.opacity = .5 * Math.random() +
                .5, this.rotation = Math.random() * Math.PI * 2, this.spin = .02 * Math.random() - .01
        }
        update() {
            this.y += this.speed, this.x += this.velX, this.rotation += this.spin, this.y > n && (this.y = -20,
                this.x = Math.random() * e)
        }
        draw() {
            i.save(), i.globalAlpha = this.opacity, i.translate(this.x, this.y), i.rotate(this.rotation), i.drawImage(
                h, -this.size / 2, -this.size / 2, this.size, this.size), i.restore()
        }
    }

    function r() {
        i.clearRect(0, 0, e, n), s.forEach(t => {
            t.update(), t.draw()
        }), requestAnimationFrame(r)
    }
    h.onload = function () {
        o();
        for (let t = 0; t < a; t++) s.push(new d);
        r()
    }, window.addEventListener("resize", o)
}();
```