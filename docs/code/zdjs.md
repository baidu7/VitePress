---
title: 站点运行时间计算js
description: 站点运行时间计算js代码
tags: [js, 代码, html]
outline: [2, 3]
---

# 站点运行时间计算js

博客折腾久了，总得留点念想。 这是一个“开箱即用”的小玩意，帮你的博客记下每一秒。 没那些花架子，一行代码见证长情，送给爱折腾的朋友。

用法：改掉代码里的 `12/23/2020`，剩下的交给浏览器。

## 新版

代码短了，运行快了。

```html
<div id="blog-timer" style="padding: 15px; background: var(--vp-c-bg-soft); border-radius: 10px; border: 1px solid var(--vp-c-divider); text-align: center; font-family: monospace;">
    <span style="color: var(--vp-c-text-2);">本站已在这个星球运行了：</span><br/>
    <span id="sitetime" style="font-weight: bold; font-size: 1.2rem;">数据加载中...</span>
</div>
```

```js
<script>
(function() {
    // 1. 设置建站日期 (您的经典时刻)
    const birthDay = new Date("12/23/2020 21:07:13");

    function updateTimer() {
        const now = new Date();
        const diff = now - birthDay; // 毫秒差

        // 2. 现代计算逻辑：简单直接
        const d = Math.floor(diff / 86400000);
        const h = Math.floor((diff % 86400000) / 3600000);
        const m = Math.floor((diff % 3600000) / 60000);
        const s = Math.floor((diff % 60000) / 1000);

        // 3. 渲染输出：的经典红
        const target = document.getElementById('sitetime');
        if (target) {
            target.innerHTML = 
                `${d} <small>天</small> ` +
                `${h} <small>时</small> ` +
                `${m} <small>分</small> ` +
                `<span style="color: #C40000;">${s}</span> <small>秒</small>`;
        }
    }

    // 4. 使用更高效的定时器
    updateTimer();
    setInterval(updateTimer, 1000);
})();
</script>
```

## 老版

**道别**：时代变了，网页标准也变了。老兵不死，只是该“退役”休息，把接力棒交给更轻快的年轻人了。
::: details 点我查看代码
```html
<span id="span_dt_dt" style="color: #2F889A;"><font style="color:#C40000">187</font> 天 <font style="color:#C40000">0</font> 时 <font style="color:#C40000">4</font> 分 <font style="color:#C40000">39</font> 秒</span>
```
```js
<script language="javascript">function show_date_time(){
	window.setTimeout("show_date_time()", 1000);
	BirthDay=new Date("12/23/2020 21:07:13 ");
	today=new Date();
	timeold=(today.getTime()-BirthDay.getTime());
	sectimeold=timeold/1000
	secondsold=Math.floor(sectimeold);
	msPerDay=24*60*60*1000
	e_daysold=timeold/msPerDay
	daysold=Math.floor(e_daysold);
	e_hrsold=(e_daysold-daysold)*24;
	hrsold=Math.floor(e_hrsold);
	e_minsold=(e_hrsold-hrsold)*60;
	minsold=Math.floor((e_hrsold-hrsold)*60);
	seconds=Math.floor((e_minsold-minsold)*60);
	span_dt_dt.innerHTML='<font style=color:#C40000>'+daysold+'</font> 天 <font style=color:#C40000>'+hrsold+'</font> 时 <font style=color:#C40000>'+minsold+'</font> 分 <font style=color:#C40000>'+seconds+'</font> 秒';
}show_date_time();</script>
```
:::