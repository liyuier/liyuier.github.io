---
title: 旧笔记本翻新
titleTemplate: '%s - yuier'
date: 2026-02-07 01:21:03
updated: 2026-02-07 01:21:03
author: yuier
categories:
    - 家里云
tags:
    - 家里云
    - 重装系统
    - 装机
    - Linux
cover: 
hide: 
---

![image.jpg](https://s2.loli.net/2026/02/07/7KDI4Xk2sN8HxvT.jpg)

<!-- more -->

## 背景

最近想起了我毕业之后就一直在吃灰的破笔记本。决定废物利用，翻新一下它，将它装上 Linux 系统，作一个家里云。

## 状况评估

我的笔记本型号是 ThinkPad E580, 2019 年本科入学时购买。如今虽然才六七年，但是状态已经很差了。键盘大片失灵；机械硬盘每次开机时随机掉盘；屏幕最大分辨率锁在 1366*768 .

### 拆机硬件检查

固态，也是系统盘，是一块 BIWIN 的 128G 固态

![image.jpeg](https://s2.loli.net/2026/02/07/KAxl2GB6nOCIv8E.jpg)

蓝牙、WiFi 模块

![image.jpeg](https://s2.loli.net/2026/02/07/Ozg5hZKCsReyQU3.jpg)

内存是两条三星的 M471A1K43CB1-CTD

![image.jpeg](https://s2.loli.net/2026/02/07/3TR4BKnHEYDquJl.jpg)

![image.png](https://s2.loli.net/2026/02/07/rObYTP2qEU9M8JC.png)

机械硬盘没拍正面照片，是一块希捷的 1T 酷鱼硬盘

由于机械硬盘老是掉盘，于是收拾了一下盘里值得保留的文件之后，直接把排线拔了

![image.jpeg](https://s2.loli.net/2026/02/07/HPwfUJim38sGnFh.jpg)

屏幕是一块 NT156WHM-N45

![image.jpeg](https://s2.loli.net/2026/02/07/5sbAILaDFNz6npr.jpg)

## 重装系统

重装一个 Linux 系统，选择的发行版是人民群众喜闻乐见的 Ubuntu. 版本选择的是 24.04.3.

具体过程就不细讲了，总之做好启动盘之后安装 Linux 系统还是挺简单的

这是刚装好时更新 apt 源拍的照片

![image.jpeg](https://s2.loli.net/2026/02/07/USl84LGWXQHNq6K.jpg)

## 更换配件

换了一个键盘和一个 1080p 屏幕，成本 ￥300

![image.jpg](https://s2.loli.net/2026/02/07/W6mrnuLOU92dIYX.jpg)
![image.jpg](https://s2.loli.net/2026/02/07/Lk6dPCMAtINbSsa.jpg)

换屏现场

![image.jpeg](https://s2.loli.net/2026/02/07/NctYn6GOFofKRWP.jpg)

刚拆下的旧键盘

![image.jpeg](https://s2.loli.net/2026/02/07/HBTVh6FuI52cfzO.jpg)

新键盘不带小红点，我把旧键盘的小红点拆了下来装了上去，可以用。小红点部件没拍照片，只录了装好后的效果。

<style>
.video-container {
    position: relative;
    width: 100%;
    /* 16:9 宽高比 = (9 / 16) * 100% = 56.25% */
    padding-bottom: 56.25%; 
    height: 0;
    overflow: hidden; /* 防止内容溢出 */
}
.video-container iframe {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    /* 继承父元素的宽高，实现响应式 */
}
</style>

<div class="video-container">
<iframe 
    src="//player.bilibili.com/player.html?isOutside=true&aid=116025135728487&bvid=BV1zBFjzhEk4&cid=35874079912&p=1" 
    scrolling="no" 
    border="0" 
    frameborder="no" 
    framespacing="0" 
    allowfullscreen="true">
</iframe>
</div>

### 其他配件

其实本来还准备换硬盘和内存的，但是鉴于现在这俩价格都涨势喜人，决定还是先就这样用着吧，反正也没打算当主力机用，能让这破笔记本起死回生已经满意了。

## 家里云

登录 TP-LINK 管理页 [192.168.0.1](http://192.168.0.1) ，给笔记本电脑设置一下 IP 与 MAC 绑定

![image.png](https://s2.loli.net/2026/02/07/qES3mnuPpL7IBfR.png)

笔记本上开启 SSH 服务

![image.png](https://s2.loli.net/2026/02/07/T3pINmBzJsFKgrO.png)

就可以在主力机上远程到笔记本上了

![image.png](https://s2.loli.net/2026/02/07/uZ2hNCvdpysj5wR.png)

再参考设置笔记本合盖不休眠

https://zhuanlan.zhihu.com/p/563111574

就可以实现插着电丢角落里当家里云服务器用了。

## 关于笔记本主机名

Randosoru 是片假名 ランドソル 的罗马音，中文翻译兰德索尔，是游戏 [公主连结](https://game.bilibili.com/pcr/) 中的主要地图的名称。

## Ubuntu 桌面壁纸

动态壁纸本来打算用 wallpaper engine 设置的，但貌似没啥用。于是就找了俩其他的动态壁纸软件

星火动态壁纸
https://www.fantacy.online/

Hidamari
https://github.com/jeffshee/hidamari

不过想来其实也没啥机会用就是了，毕竟主要是当服务器用的。