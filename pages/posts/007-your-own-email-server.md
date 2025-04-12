---
title: 搭建自己的邮件服务器
titleTemplate: '%s - yuier'
date: 2025-04-06 23:07:17
updated: 2025-04-06 23:07:17
author: yuier
cover: 
hide:
---

参考文章：

[Linux搭建邮件服务器的教程，如何搭建自己的域名邮箱服务器？Poste.io邮箱服务器搭建教程](https://blog.zeruns.com/archives/822.html)

<!-- more -->

## 背景介绍

在 [使用 nginx - docker 部署博客](https://yuier.com/posts/005-deploy-blog-by-nginx-docker) 一文中，我已经使用 [yuier.com](https://yuier.com) 这个域名，基于 Nginx Docker 在我的个人服务器上启动了一个博客服务。现在，我想要在此基础上，再部署一个邮件服务器，得到一个 `me@yuier.com` 的邮件地址。

综合多方考虑，我决定使用 `Poste.io` 搭建我的邮件服务。

## 搭建

前期的准备，比如服务器、域名购买；docker 环境配置之类的就不提了，只讲关键的

### 端口开放

邮件服务需要开放的端口：

- 25
- 143
- 465
- 587
- 993

### DNS 解析

对于 `yuier.com` 域名，需要设置以下一些解析：

| **主机记录** | **记录类型** | **记录值**                                | **备注**                   |
| ------------ | ------------ | ----------------------------------------- | -------------------------- |
| mail         | A            | <服务器 IP>                               | A 记录，指向邮件服务器 IP  |
| smtp         | CNAME        | <域名>                                    |                            |
| pop          | CNAME        | <域名>                                    |                            |
| imap         | CNAME        | <域名>                                    |                            |
| @            | MX           | <域名>                                    | MX 记录，邮件服务器主记录  |
| @            | TXT          | v=spf1 mx ~all                            | SPF 记录，防垃圾邮件       |
| _dmarc       | TXT          | v=DMARC1; p=none; rua=mailto:me@yuier.com | DMARC 记录（邮件策略反馈） |

另外，为了使邮箱发送的邮件不被丢进垃圾箱，最好再搞个 [反向解析](https://zh.wikipedia.org/wiki/%E5%8F%8D%E5%90%91DNS) 

这里以腾讯云为例

![image-20250412224222240](https://s2.loli.net/2025/04/12/DazG2uSskcYjRWg.png)

### Poste.io Docker

#### 脚本编写

首先创建一个~~后面会用到的神奇妙妙小工具~~ docker 网络

> docker network create mail-network

在宿主机上准备一个文件夹用于保存 data 即可

`example/to/data`

然后写一个启动脚本

```bash
# 停止并删除旧容器（防止冲突）
docker stop email_me >/dev/null 2>&1
docker rm email_me >/dev/null 2>&1

docker run -d \
  --name email_me \
  --net=mail-network \
  -p 25:25 \
  -p 80:80 \
  -p 443:443 \
  -p 143:143 \
  -p 465:465 \
  -p 587:587 \
  -p 993:993 \
  -v /srv/email/me/data:/data \
  -e TZ=Asia/Shanghai \
  --restart=always \
  analogic/poste.io
```

为了不与 Nginx 产生端口冲突，我们可以先 docker stop 掉 Nginx 的容器

然后运行上述脚本即可。

#### 后台配置

`Poste.io` 启动后，会提供一个后台管理服务 `https://mail.example.com/admin/login` ，这一步跟着参考文章 [Linux搭建邮件服务器的教程，如何搭建自己的域名邮箱服务器？Poste.io邮箱服务器搭建教程](https://blog.zeruns.com/archives/822.html) 的 `安装和配置Poste.io` 目录走就行了，没啥好讲的。

P.S. 我刚启动服务时使用 Chrome 进不去后台界面，参考了这篇文章解决 [Chrome您的连接不是私密连接解决办法--一个比较实用的技巧分享](https://blog.csdn.net/zhuxuemin1991/article/details/106251232)

### 使用 Nginx 代理后台服务

我们希望做到的是邮件服务的后台管理界面与博客服务不产生冲突，所以我们可以使用 nginx 代理 `mail.yuier.com` 的网站服务。

#### 修改 Poste.io Docker 启动脚本

修改启动脚本，去掉其中对于 80 和 443 端口的映射：

```bash
# 停止并删除旧容器（防止冲突）
docker stop email_me >/dev/null 2>&1
docker rm email_me >/dev/null 2>&1

docker run -d \
  --name email_me \
  --net=mail-network \
  -p 25:25 \
  -p 143:143 \
  -p 465:465 \
  -p 587:587 \
  -p 993:993 \
  -v /srv/email/me/data:/data \
  -e TZ=Asia/Shanghai \
  --restart=always \
  analogic/poste.io
```

#### 获取 Poste.io 后台服务的证书

在 [后台配置](#后台配置) 小节中，我们会跟随参考文章申请 SSL 证书 👇

![image-20250412231007483](https://s2.loli.net/2025/04/12/Gdi5psFW6NVA4YI.png)

这个证书可以进入 `Poste.io` 的容器，在 `/data/ssl/` 路径下面找。可以用 `find` 命令找。我们需要的两个证书名字叫 `fullchain.pem`, `privkey.pem`

在宿主机上挂载 Nginx 的博客服务的 ssl 目录下，新建个 `email` 的目录，把这俩文件复制进去

```
# 宿主机挂载 ssl 目录
.
├── email
│   ├── fullchain.pem
│   └── private.pem
├── yuier.com_bundle.crt
└── yuier.com.key
```

#### 为 Nginx 添加 mail.yuier.com 的配置

然后在 Nginx Docker 的本地挂载 conf.d 目录下新增一个 `mail.yuier.com.conf` 配置文件

```conf
.
├── blog.conf
└── mail.yuier.com.conf
```

```conf
# Nginx 配置示例（mail.yuier.com.conf）
server {
    listen 80;
    server_name mail.yuier.com;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl;
    server_name mail.yuier.com;

    # 这里的路径填 Nginx 容器内的路径，不要填宿主机路径
    ssl_certificate /path/to/fullchain.pem;
    ssl_certificate_key /path/to/private.pem;

    # SSL 协议配置
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256;
    ssl_prefer_server_ciphers on;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;

    # 反向代理到 Poste.io 容器
    location / {
        proxy_pass https://email_me:443;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

#### 修改 Nginx 启动脚本

在 [使用 nginx - docker 部署博客](https://yuier.com/posts/005-deploy-blog-by-nginx-docker) 的 [nginx 容器](https://yuier.com/posts/005-deploy-blog-by-nginx-docker#nginx-%E5%AE%B9%E5%99%A8) 一节中，我们写了一个启动脚本 `start.sh` ，现在对其稍作修改

```bash
#!/bin/bash

# --------------------------------------------
# 定义本地路径变量（按实际路径修改！）
# --------------------------------------------
LOCAL_NGINX_DIR="/srv/blog/nginx"  # 替换为你的实际路径
LOCAL_CONF_DIR="${LOCAL_NGINX_DIR}/conf.d"
LOCAL_LOGS_DIR="${LOCAL_NGINX_DIR}/logs"
LOCAL_SSL_DIR="${LOCAL_NGINX_DIR}/ssl"
LOCAL_HTML_DIR="${LOCAL_NGINX_DIR}/html"

# --------------------------------------------
# 检查本地目录是否存在，不存在则创建
# --------------------------------------------
mkdir -p "$LOCAL_CONF_DIR" "$LOCAL_LOGS_DIR" "$LOCAL_SSL_DIR"

# --------------------------------------------
# 停止并删除旧容器（防止冲突）
# --------------------------------------------
docker stop blog >/dev/null 2>&1
docker rm blog >/dev/null 2>&1

# 与 email 在同一 docker 网络内
# 其实我也不知道这一行需不需要，但是秉持着能跑就别动的原则我还是放进来了
# 读者可以自行尝试去掉这行会不会有问题
docker network connect mail-network blog

# --------------------------------------------
# 启动Nginx容器（关键修正点）
# --------------------------------------------
docker run -d \
  --name blog \
  --network mail-network \
  -p 80:80 \
  -p 443:443 \
  -v "${LOCAL_CONF_DIR}:/etc/nginx/conf.d" \
  -v "${LOCAL_NGINX_DIR}/nginx.conf:/etc/nginx/nginx.conf" \
  -v "${LOCAL_NGINX_DIR}/mime.types:/etc/nginx/mime.types" \
  -v "${LOCAL_SSL_DIR}:/etc/nginx/ssl" \
  -v "${LOCAL_LOGS_DIR}:/var/log/nginx" \
  -v "${LOCAL_HTML_DIR}:/usr/share/nginx/html" \
  nginx:latest  # 确保镜像名称正确！

# --------------------------------------------
# 检查容器状态
# --------------------------------------------
echo "检查容器状态："
docker ps -f name=blog

# 查看日志（调试用）
echo -e "\n查看容器日志："
docker logs blog --tail 50
```

## 使用

先后执行脚本，启动 `Poste.io` 和 Nginx 的 Docker 容器即可。

日常使用的话，客户端用 `Poste.io` 提供的前台网页服务就行了。

`https://mail.yuier.com`

![image-20250412232337460](https://s2.loli.net/2025/04/12/MjxXLQdwBiRKtWr.png)

但是这样总感觉有点挫，我们可以使用 outlook ，这样显得专业一点。

![image-20250412232622891](https://s2.loli.net/2025/04/12/iCndmvkarzspuwL.png)

另外，之前用的其他邮箱，比如 QQ 邮箱，也可以加一个刚搭建的邮箱，这样方便和之前使用的邮件服务无缝衔接。

![image-20250412234657929](https://s2.loli.net/2025/04/12/LF7TJw13v2GPsCc.png)

现在，试试使用自己刚搭建的邮箱和 QQ 邮箱互发邮件吧！