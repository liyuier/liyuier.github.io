---
title: 自建 CICD 工作流
titleTemplate: '%s - yuier'
date: 2026-06-12 13:11:33
updated: 2026-06-12 13:11:33
author: yuier
categories:
    - 运维
tags:
    - CI/CD
cover: 
hide: 
---

## 背景

[Yuni](https://github.com/liyuier/Yuni3) 的[主体](https://zh.wikipedia.org/wiki/%E4%B8%BB%E4%BD%93%E6%80%9D%E6%83%B3)部分开发已近尾声，正好前段时间 DS 发布了 v4 ，在 [maimai](https://docs.mai-mai.org/) 上用的体验不错，遂在 DS API 文档里偷师了一手[接入克劳德的小寄巧](https://api-docs.deepseek.com/zh-cn/quick_start/agent_integrations/claude_code)，在其大力帮助下搭建了一个简单的 CI/CD 工作流

## 整体总结

代码推送 --> gitea 代码托管 & 构建 action --> 构建产物推送到本地 docker 镜像服务 register --> 触发本地 webhook --> webhook 服务拉取镜像，部署

## 环境搭建

### gitea 代码托管

先启动个 docker 

```bash
docker run -d --name gitea --restart always \
    -p 3000:3000 -p 2222:22 \
    -v /srv/docker/gitea/data:/data \
    gitea/gitea:latest
```

> 上面把 22 端口映射为 2222 端口是为了避免与主机的 22 端口冲突。如果推拉代码都走 http 协议，那这个映射可以去掉

然后浏览器访问 3000 端口，进行一些初始化相关的工作。页面上会有引导，当时没截图，现在就不补了。

### gitea action runner

到 gitea 的官方仓库下载一下 runner 二进制文件

https://gitea.com/gitea/runner/releases

然后放到环境目录

```bash
chmod 777 <package_name> gitea-runner
mv gitea-runner /usr/local/bin/gitea-runner
```

进入 gitea 的 runner 管理页面 `<location>/-/admin/actions/runners` ，点击左上角 `创建新运行器` 复制一下 token

![pasted-image-1781244795666.webp](https://files.seeusercontent.com/2026/06/12/oQ5j/pasted-image-1781244795666.webp)

最后注册一个运行器

```bash
gitea-runner register \
    --instance http://localhost:3000 \
    --token b4kAY3VemF4Q6pgMNEENelzgswtGLaQ6RBRiKiDg \
    --name vps-runner \
    --labels ubuntu-latest:host

# 后台启动守护进程
nohup gitea-runner daemon > /srv/docker/gitea/runner/log/gitea-runner.log 2>&1 &
echo "Runner daemon started, PID: $!"
```

运行器貌似会默认启动一个容器用来跑工作流；但我为了省事，就选择 host 模式，直接在本地跑工作流。反正就一个构建-推送 docker 镜像的工作，也不可能把环境搞炸了。

done

![pasted-image-1781245435396.webp](https://files.seeusercontent.com/2026/06/12/9Csp/pasted-image-1781245435396.webp)

### 本地 docker 镜像仓库

docker 启动脚本：

先在当前目录下创建 `data/`, `config/` 两个目录；config 下创建一个 `config.yml`

```yaml
# config.yml
version: 0.1
log:
  fields:
    service: registry
storage:
  filesystem:
    rootdirectory: /var/lib/registry
  delete:
    enabled: true
http:
  addr: :5000
  headers:
    Access-Control-Allow-Origin: ["http://192.168.0.103:11461"]  # 留给 webui 用
    Access-Control-Allow-Methods: ["GET", "HEAD", "OPTIONS"]
```

然后启动脚本

```bash
docker run -d --name registry --restart always \
    -p 5000:5000 \
    -v /srv/docker/registry/data:/var/lib/registry \
    -v /srv/docker/registry/config/config.yml:/etc/docker/registry/config.yml:ro \
    registry:2
```

然后启动 webui 脚本

```
docker run -d --name registry-ui --restart always \
    -p 11461:80 \
    -e REGISTRY_URL="http://192.168.0.103:5000" \
    joxit/docker-registry-ui
```

### webhook

```bash
apt install webhook
```

## 工作流设置

### gitea action

在项目的 `.gitea/workflows` 目录下创建一个 `deploy.yml`

```yaml
name: Build and Deploy
on:
  push:
    branches: [master]
  workflow_dispatch:

jobs:
  deploy:
    runs-on: ubuntu-latest  # 选择 runner
    steps:
      - name: Checkout  # 拉取项目代码
        run: |
          git clone --depth 1 http://192.168.0.103:3000/yuier/Yuni3.git .  

      - name: Docker build & push  # 构建并推送镜像
        run: |
          docker build -t localhost:5000/yuni3:latest .
          docker push localhost:5000/yuni3:latest

      - name: Notify deploy  # 通知 webhook. 这里第二行其实也是要用一个 token 的，在 github 上是要用环境变量传入的。但这里反正是本地部署，我就随便明文了
        run: |
          curl -X POST http://localhost:9000/hooks/deploy-yuni3 \
            -H "Authorization: Bearer yuni-deploy-token" \
            -H "Content-Type: application/json" \
            -d '{}'
```

### webhook 配置

找个地方放配置文件 `hooks.json`

```json
[{
    "id": "deploy-yuni3",
    "execute-command": "/srv/docker/yuni/deploy.sh",
    "command-working-directory": "/srv/docker/yuni",
    "include-command-output-in-response": true,
    "trigger-rule": {
      "match": {
        "type": "value",
        "value": "Bearer yuni-deploy-token",
        "parameter": {
          "source": "header",
          "name": "Authorization"
        }
      }
    }
}]
```

然后启动

```bash
#                    配置文件        工作端口            日志输出文件
nohup webhook -hooks hooks.json -port 9000 -verbose > /path/to/logs/webhook.log 2>&1 &
```

### 部署脚本

即 `hooks.json` 中的 `deploy.sh`

```bash
#!/bin/bash
# Yuni3 VPS 私有部署脚本
# 由 webhook 触发，或手动执行
set -euo pipefail

DEPLOY_DIR="/srv/docker/yuni"
IMAGE="localhost:5000/yuni3:latest"

#################
# 省略其他周边工作
#################

# ── 拉取镜像 ──
echo "[deploy] 拉取镜像 $IMAGE ..."
docker pull "$IMAGE"

# ── 重启容器 ──
if docker ps -q -f name=yuni3 | grep -q .; then
  echo "停止旧容器"
  docker stop yuni3 && docker rm yuni3
fi

docker run -d \
  --name yuni3 --restart always \
  -p 11451:11451 \
  -p 11452:11452 \
  -p 11533:3005 \
  -v "$DEPLOY_DIR/config:/app/config:ro" \
  -v "$DEPLOY_DIR/data:/app/data" \
  -v "$DEPLOY_DIR/logs:/app/logs" \
  -v "$DEPLOY_DIR/plugins:/app/plugins" \
  -v "/etc/localtime:/etc/localtime:ro" \
  -v "/etc/timezone:/etc/timezone:ro" \
  "$IMAGE"

echo "[deploy] 完成。日志: docker logs -f yuni3"
```

## 效果展示

修改项目后，推送代码至 gitea 即可触发流程

gitea action 👇

![pasted-image-1781246851228.webp](https://files.seeusercontent.com/2026/06/12/1Mgh/pasted-image-1781246851228.webp)

docker 镜像仓库 👇

![pasted-image-1781249239828.webp](https://files.seeusercontent.com/2026/06/12/vw0U/pasted-image-1781249239828.webp)

webhook 日志 👇

![pasted-image-1781249298645.webp](https://files.seeusercontent.com/2026/06/12/cEp0/pasted-image-1781249298645.webp)

docker 部署情况 👇

```bash
root@Randosoru:/srv/docker/registry# docker ps | grep yuni
8090a62df0e1   localhost:5000/yuni3:latest     "/app/entrypoint.sh"      3 hours ago     Up 3 hours     0.0.0.0:11451-11452->11451-11452/tcp, [::]:11451-11452->11451-11452/tcp, 0.0.0.0:11533->3005/tcp, [::]:11533->3005/tcp   yuni3
```