---
title: 使用 nginx 部署子域名服务 —— Yuni 机器人文档的部署
titleTemplate: '%s - yuier'
date: 2026-01-11 03:18:49
updated: 2026-01-11 03:18:49
author: yuier
categories:
    - nginx
tags:
    - nginx
    - vite press
cover: 
hide: 
---

## 背景

搓了小一个月的 [Yuni](https://github.com/liyuier/Yuni3) 机器人终于差不多搓完了，决定部署一个文档出来。

我本身有一个域名和公网服务器，即本站 [yuier.com](https://yuier.com) ，因此决定就使用本站的一个子域名来部署文档 [yuni.yuier.com](https://yuni.yuier.com)

## DNS 解析

首先在域名注册商处注册新域名与解析

新建一个子域名 `yuni.yuier.com` ，然后在解析控制台 https://console.cloud.tencent.com/cns 为子域名添加一个 A 记录，主机记录我用的 @ ，IP 地址指向服务器公网 IP

![image.png](https://s2.loli.net/2026/01/11/BM3f7tGuq2IZhCK.png)

随后，根据腾讯云的提示，需要在主域名下添加两条 NS 记录，将子域名注册到两个解析商处

![image.png](https://s2.loli.net/2026/01/11/xlCI1O3EvQWug64.png)

（可选）最后，在腾讯云申请子域名的 SSL 证书，腾讯云会自动在 `yuni.yuier.com` 下添加一条名为 `_dnsauth` 的 TXT 记录

![image.png](https://s2.loli.net/2026/01/11/DjhnMwPeBmOqCxY.png)

## 文档部署

### 文档引擎

这里我用的是国内开源项目常用的 vite press 作为文档引擎。具体使用方法参考文档 [VitePress 中文文档](https://vitepress.dev/zh/) . BTW 具体开发过程中我也抄了挺多 [麦麦机器人文档](https://docs.mai-mai.org/) 的写法

### 文档部署

作为静态网页，我部署文档的方式参考本站的部署方式 [使用 nginx - docker 部署博客](https://yuier.com/posts/005-deploy-blog-by-nginx-docker) .

维护个人远程仓库 —— 使用 post-receive 脚本在线构建 —— 启动 nginx 在指定端口监听域名访问

这是我的文档服务的 nginx 配置

```conf
server {
    listen 11461;  # 11451 端口被机器人应用占了（悲）
    listen [::]:11461;
    server_name yuni.yuier.com;

    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;

    index index.html;

    location / {  # 基本就是抄的 vite press 给的示例 https://vitepress.dev/zh/guide/deploy#nginx
        root /usr/share/nginx/html;  # 根目录

        try_files $uri $uri.html $uri/ =404;

        error_page 404 /404.html;

        error_page 403 /404.html;

        location ~* ^/assets/ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }
}
```

## 流量转发

注意到我的文档服务监听的端口在 `11461` ，HTTPS 流量需要经过一层转发。这个转发操作我放到了主域名服务下，并且 SSL 认证也放到了主域名服务下，方便统一管理

直接给出主域名服务下的文档流量转发配置

```conf
server {
    listen 80;
    listen [::]:80;
    server_name yuni.yuier.com;
    
    # 301 永久重定向
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl;
    listen [::]:443 ssl;
    http2 on;
    server_name yuni.yuier.com;

    # 文档域名的 SSL 证书
    ssl_certificate /etc/nginx/ssl/yuni/yuni.yuier.com_bundle.crt;
    ssl_certificate_key /etc/nginx/ssl/yuni/yuni.yuier.com.key;

    # ssl_certificate /etc/nginx/ssl/yuni/fullchain.pem;
    # ssl_certificate_key /etc/nginx/ssl/yuni/privkey.pem;

    # SSL 协议配置
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256;
    ssl_prefer_server_ciphers on;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;

    # 安全响应头
    add_header Strict-Transport-Security "max-age=63072000; includeSubDomains; preload";
    add_header X-Content-Type-Options nosniff;
    add_header X-Frame-Options DENY;

    # 启用 OCSP Stapling 提升性能
    ssl_stapling on;
    ssl_stapling_verify on;
    resolver 8.8.8.8 1.1.1.1 valid=300s;
    resolver_timeout 5s;

    # 反向代理到 yuni.yuier.com 容器
    location / {
        proxy_pass http://yuni-doc:11461;  # 这里需要两个容器在同一个 docker net 下，具体操作可以问 AI
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

## 效果

https://yuni.yuier.com/

![image.png](https://s2.loli.net/2026/01/11/KI367RqOHuN2iMo.png)