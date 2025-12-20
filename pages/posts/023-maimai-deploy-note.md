---
title: 麦麦机器人部署备忘录
titleTemplate: '%s - yuier'
date: 2025-12-21 01:53:39
updated: 2025-12-21 01:53:39
author: yuier
categories:
    - qqbot
tags:
    - maimai
    - qqbot
cover: 
hide: true
---

## QQ 客户端

使用的是 napcat

启动使用 docker

docker 脚本参考 https://github.com/NapNeko/NapCat-Docker 的 README

在机器上的位置是 `/srv/ntqq/napcat` 下的 `github_napcat_docker_install.sh`

直接运行即可

运行后使用

```bash
docker logs napcat
```

命令查看日志

![image.png](https://s2.loli.net/2025/12/21/rRSeIxjc5aUovWh.png)

然后打开 http://<宿主机ip>:6099/webui 进入 webui 面板，要求输入 token ，就是上图框里框出的部分

### 配置

由于上述 docker 启动脚本中设定了容器为 host 模式，因此配置时无需考虑内外网

![image.png](https://s2.loli.net/2025/12/21/bzhQjdONfenlLXq.png)

直接把答案端上来就好。配置一个 WS 客户端，蓝框中为关键参数

与 `MaiBot-Napcat-Adapter/config.toml` 中的参数对应

![image.png](https://s2.loli.net/2025/12/21/AJKeSTEz3oaNWfr.png)

## maimai

麦麦不直接与 napcat 交互，而是使用一个 adapter 作为中转

其中 adapter 作为服务器等待 napcat 连接，并且作为客户端主动连接 bot