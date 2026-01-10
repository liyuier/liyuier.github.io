---
title: 基于 frp 的 Windows 远程桌面连接
titleTemplate: '%s - yuier'
date: 2026-01-10 08:56:41
updated: 2026-01-10 08:56:41
author: yuier
categories:
    - frp
tags:
    - 远程桌面连接
    - frp
cover: 
hide: 
---

![image.jpeg](https://s2.loli.net/2026/01/10/T2I94QwGn5CcYjW.jpg)

<!-- more -->

## 背景

快过年了，由于今年没有赚到钱，没有给自己奖励一部笔记本电脑，所以想来到过年的时候只能抱着个平板电脑回老家。

但是毕竟平板电脑在生产力这块有很大不足，于是想着搞个远程桌面连一下台式机，到时候用笔记本电脑连接台式机。

到网上搜索了一下方案，多番对比了一下，决定采用 `frp` + `Windows app` 的方案实现。

### frp

frp 是国人开发的一款开源内网穿透软件。具体的工作方式为在一台公网IP服务器上架设 frp 服务，然后在需要穿透的内网机器上启动 frp 客户端连接服务，以公网 frp 服务作为代理访问内网。

https://gofrp.org/zh-cn/

### Windows app

Windows app 是微软新近推出的跨平台远程桌面连接软件，是 Microsoft remote desktop 的继承者。现在已经支持安卓系统，我的 —— 也不知道现在是鸿蒙几的 —— matepad 平板完全支持。

## 冻手！

### Windows

首先，要开启远程桌面，要求 Windows 为专业版或企业版，不能是家庭版。

在设置里的 `系统` —— `远程桌面` 里边开启就行。最好取消一下下面那个要求设备进行网络级别身份验证连接的勾选框。远程桌面端口默认的是 3389 , 应该是可以改的，但是没什么必要，谁会非要占这个端口呢。

![image.png](https://s2.loli.net/2026/01/10/qbGce6Y4maASpfJ.png)

图中可以注意到我的设置里有点不太一样的地方，比如最上面那行的开关控件是灰色的；更上面还有一行红色小字提示“某些设置由你的组织来管理”。说实话，我也并不非常确定这种情况正不正常，现在也暂时不必提这个，后边再说。

### frp

#### 服务端

先去它的 github release 下载两份 release ，一份给我的公网 Linux 服务器，一份给我的内网 Windows PC.

https://github.com/fatedier/frp/releases/

![image.png](https://s2.loli.net/2026/01/10/WMZmdsD3BAFGtJa.png)

然后把 Linux release 里的 `frps` 和 `frps.toml` 传到服务器上。顾名思义，s 后缀的是服务端程序，c 后缀的是客户端程序。

![image.png](https://s2.loli.net/2026/01/10/HGlqa3t5DhYjuXS.png)

然后修改一下配置文件 `frps.toml`

![image.png](https://s2.loli.net/2026/01/10/8EfcX3B51dRyWhK.png)

我的配置基本都是抄这篇博客的 [Frp内网穿透搭建教学](https://www.cnblogs.com/geek233/p/18791892)

因为本次部署只需求远程桌面连接能力，所以一些花里胡哨的什么 http 、https 转发之类的功能不加上去也没关系。只需要最基本的绑定监听地址和配置认证 token 就行，再有就是可以配置一下 webserver 管理界面

然后开一个 screen 窗口，`./frps -c ./frps.toml` 启动服务端

#### 客户端

客户端的配置就这样就行了

![image.png](https://s2.loli.net/2026/01/10/Z5EVYyaNrmJStCM.png)

![image.png](https://s2.loli.net/2026/01/10/peA5oiW9s1w8BF6.png)

然后 `frps.exe -c frps.toml` 启动客户端

终端看到一堆蓝色的字，里边有 success 什么的就算成功了。

### Windows App

这个安卓安装包要用一下魔法，去 goole player 上面取。

安装没什么好说的。进去之后，点击最下面那个 PC 连接

![image.jpeg](https://s2.loli.net/2026/01/10/t8wNfeuoXbiSUKF.jpg)

然后进去之后改两个配置，一个是电脑名称，填公网服务器 IP. 

因为 Windows App 在尝试建立远程桌面连接的时候会自动寻找 3389 端口，而公网服务器的 3389 端口被客户端的 `localPort` 和 `remotePort` 配置自动映射到内网 PC  的 3389 端口上了，所以这里无需再特意填写具体端口。

![image.png](https://s2.loli.net/2026/01/10/vTVN91wmZ5fnK3J.png)

填写好之后直接点击新创建的连接即可。

## 实物图

![5b7d5a703f36c35c737c7b4f521cc69f_720.jpg](https://s2.loli.net/2026/01/10/Lg2O19yUTBaPHCK.jpg)

## 存在的问题

### 开启远程桌面的问题

实际上，建立 frp 和下载 Windows App 是比较轻松的环节，在 Windows 上开启远程桌面才是真正的折磨人，各种搞不定，我是挨个问了一遍各大 AI ，各种什么注册表，组策略，服务配置什么的给我改了个遍，才最终搞定 —— 至今我也不知道到底是哪一步作对了让我成功开启了远程桌面。

### 平板远程连接的问题

平板电脑毕竟不是原生 Windows PC ，基于 Windows App 访问 Windows 远程桌面还是有些适配上的小问题，最明显的就是输入法未适配。在连接平板的键盘上敲 shift 无法改变远程桌面上的输入法 —— 准确地说，shift 可以改变远程桌面右下角托盘区显示的输入法语言，但是无法改变平板电脑上的输入法语言；而 Windows App 又忠实地将平板电脑上的输入传输到远程桌面上，于是远程桌面上的输入法语言也就随之不产生切换了。