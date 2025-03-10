---
title: 个人博客的搭建与部署
titleTemplate: '%s - yuier'
date: 2025-03-09 21:32:16
updated: 2025-03-09 21:32:16
author: yuier
cover: 
---

## 缘起

> 你认识 [云游君](https://www.yunyoujun.cn/) 吗？

数年前，兴趣使然地，我在云游的一篇[教程](https://www.yunyoujun.cn/posts/how-to-build-your-site)的指导下成功搭建起了我的第一个博客网站。不管很快我便将其抛之脑后，现在连当时的域名都想不起来了。

[两年半](https://zh.moegirl.org.cn/%E9%B8%A1%E4%BD%A0%E5%A4%AA%E7%BE%8E)前，云游开始开发并宣传他的 [Valaxy](https://valaxy.site/) 框架。两周前，我开始考虑重新搭建我的个人博客；两天前，我开始部署我的博客。

可惜的是，当初云游的那篇入门级教程中只讲了如何白嫖 GitHub Pages, 并未涉及如何将静态文件部署到个人服务器上；而且随着博客框架的改变，当初的教程已经不再适合新的博客。因此，我在这里重新记录下我的部署过程。

<!-- more -->

当然，作为个人记录，我会略过很多基础但繁琐的内容；我假设读者能够自己搞定我文中未提到的所有步骤，如有不足望海涵。

## 总体思路

博客框架使用 Valaxy, 部署方案为 GitHub Pages 与个人服务器双部署。GitHub Pages 使用 Valaxy 提供好的工作流文件即可；个人服务器上，我搭建了一个远程 git 仓库，并使用 git hooks 实现推送后自动部署。

## 准备工作

- 远程仓库
- hook 目录
- nginx 目录

- 权限赋予

- hook 脚本编写