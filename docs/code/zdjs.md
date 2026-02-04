---
title: 站点运行时间计算js
description: 站点运行时间计算js代码
tags: [js, 代码, html]
outline: [2, 3]
---

# 站点运行时间计算js


html代码
```html
<span id="span_dt_dt" style="color: #2F889A;"><font style="color:#C40000">187</font> 天 <font style="color:#C40000">0</font> 时 <font style="color:#C40000">4</font> 分 <font style="color:#C40000">39</font> 秒</span>
```
js代码
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
