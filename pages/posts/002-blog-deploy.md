---
title: 个人博客的搭建与部署
titleTemplate: '%s - yuier'
date: 2025-03-10 21:32:16
updated: 2025-03-10 21:32:16
author: yuier
cover: 
hide: true
---

## 缘起

> 你认识 [云游君](https://www.yunyoujun.cn/) 吗？

数年前，兴趣使然地，我在云游的一篇[教程](https://www.yunyoujun.cn/posts/how-to-build-your-site)的指导下成功搭建起了我的第一个博客网站。不过很快我便将其抛之脑后，现在连当时的域名都想不起来了。

[两年半](https://zh.moegirl.org.cn/%E9%B8%A1%E4%BD%A0%E5%A4%AA%E7%BE%8E)前，云游开始开发并宣传他的 [Valaxy](https://valaxy.site/) 框架。两周前，我开始考虑重新搭建我的个人博客；两天前，我开始部署我的博客。

可惜的是，当初云游的那篇入门级教程中只讲了如何白嫖 GitHub Pages, 并未涉及如何将静态文件部署到个人服务器上；而且随着博客框架的改变，当初的教程已经不再适合新的博客。因此，我在这里重新记录下我的部署过程。

<!-- more -->

当然，作为个人记录，我会略过很多基础但繁琐的内容；我假设读者能够自己搞定我文中未提到的所有步骤，如有不足望海涵。

## 搭建博客

这里就不细讲了，Valaxy 的文档写得还是挺详细的，照着做没问题：[快速上手](https://valaxy.site/guide/getting-started)

记得对默认配置进行个性化的修改。如果对我的修改感兴趣，可以把我的仓库克隆到本地参考：

[liyuier.github.io](https://github.com/liyuier/liyuier.github.io)

## 部署博客

### 总体思路

部署方案为 GitHub Pages 与个人服务器双部署。GitHub Pages 使用 Valaxy 提供好的工作流文件即可。个人服务器上，我搭建了一个远程 git 仓库，并使用 git hooks ，收到本地推送后，将代码再克隆到服务器上的构建目录；再执行构建命令，最后将构建出的文件复制到 nginx 工作目录，最终自动部署。

### 准备工作

#### 远程仓库

见我的另一篇博文 [搭建自己的 git 远程仓库服务](https://yuier.com/posts/001-build-self-gitrepo-server)

最终搭建出的博客远程仓库地址为 `/home/git/repos/liyuier.github.io.git`

#### 构建目录

`/usr/dev/blog/liyuier.github.io` . 实际上就是在服务器上的 “本地仓库”

#### nginx 工作目录

`/usr/share/nginx/html` . 用于保存构建后的文件

#### 权限赋予

git hook 脚本由 `git` 用户执行，而脚本需要有权限修改 nginx 的工作目录。为此需要进行权限修改。

默认情况下，nginx 由 `www-data` 组下的 `www-data` 用户执行工作进程。为了实现我们的目标，我们需要将 nginx 工作目录所属的用户组改为 `www-data` ，然后赋予组内成员对该目录的全读写执行权限，最后将 `git` 用户加入 `www-data` 组内。

```bash
# 1. 将目录组改为 www-data
sudo chgrp -R www-data /usr/share/nginx/html
# 2. 赋予 www-data 组读写执行权限
sudo chmod -R g+rwx /usr/share/nginx/html
# 3. 将 git 用户加入 www-data 组
sudo usermod -aG www-data git
```

### 开始工作

#### hook 脚本编写

进入远程仓库的 `hooks` 目录下，即 `/home/git/repos/liyuier.github.io.git/hooks` 目录

创建名为 `post-receive` 的文件，并加入以下内容：

```bash [post-receive]
# 定义日志文件路径（推荐存放在 git 用户有权限的目录）
LOG_FILE="/home/git/logs/blog_deploy.log"
DEPLOY_LOG_DIR=$(dirname "$LOG_FILE")

# 创建日志目录（如果不存在）
mkdir -p "$DEPLOY_LOG_DIR"
chown git:git "$DEPLOY_LOG_DIR"  # 确保目录所有权

# 重定向所有输出到日志文件（追加模式）
exec >> "$LOG_FILE" 2>&1

# 添加时间戳分隔符
echo -e "\n\n=== $(date '+%Y-%m-%d %H:%M:%S') 开始部署 ==="

#!/bin/bash  # 指定使用 bash shell 解释器

# 定义变量：工作目录路径（必须与之前创建的目录一致）
TARGET="/usr/dev/blog/liyuier.github.io"

# 定义变量：Nginx 的网站根目录（最终部署位置）
DEPLOY_DIR="/usr/share/nginx/html"

# 定义变量：Git 裸仓库路径（用于 git 命令操作）
GIT_DIR="/home/git/repos/liyuier.github.io.git"

echo "➜ Starting auto deployment..."  # 输出开始提示信息

# 强制检出代码到工作目录（--work-tree 指定工作区，--git-dir 指定仓库位置）
git --work-tree=$TARGET --git-dir=$GIT_DIR checkout -f

# 切换到工作目录（准备执行构建命令）
cd $TARGET

# 安装依赖（--frozen-lockfile 表示严格使用 lock 文件版本，避免版本冲突）
pnpm install --frozen-lockfile

# 执行构建命令（根据项目配置，生成 dist/ 目录）
pnpm run build

# 清理旧的部署文件（避免残留文件干扰）
sudo rm -rf $DEPLOY_DIR/*

# 递归复制构建结果到 Nginx 目录（-a 参数保留文件属性）
sudo cp -a dist/* $DEPLOY_DIR/

# 修改部署目录所有权（假设 Nginx 以 www-data 用户运行）
# sudo chown -R root $DEPLOY_DIR

echo "✅ Deployment completed! Nginx content updated."  # 输出完成提示

# 检查配置语法
if ! sudo nginx -t; then
  echo "❌ Nginx 配置测试失败，拒绝重载" >&2
  exit 1
fi

# 执行重载
sudo nginx -s reload
echo "🔄 Nginx 已平滑重载"
```

## 最终实践

> 这里为了~~减少我的工作量~~文章简洁，先假设读者已经在服务器上准备好了部署环境，具体来说就是搭设起 nginx 服务器；准备好了博客的构建环境（pnpm）

在本地 PC 上，添加一篇博文，然后提交

```bash
git add .
git commit -m "你对本次提交的描述"
```

由于采用 GitHub Pages 与个人服务器双部署，为了减少心神损耗，建议写个简单的脚本实现这一步。用 Windows 开发就写个 `deploy.bat` ，用 Linux 就写个 `deploy.sh`

```
# 这里假设已经分别为本地仓库绑定了 GitHub 仓和个人远程仓
# 查看远程仓库绑定情况
# git remote -v
# GitHub 仓
# origin  git@github.com:liyuier/liyuier.github.io.git (fetch)
# origin  git@github.com:liyuier/liyuier.github.io.git (push)
# 个人远程仓
# yuier   git@yuier.com:/home/git/repos/liyuier.github.io.git (fetch)
# yuier   git@yuier.com:/home/git/repos/liyuier.github.io.git (push)
```

```bash [deploy.bat / deploy.sh]
# 反正博客只有自己一个人开发，直接 push -f 
# 具体推送的分支也可以自定义，并相应处理 GitHub 工作流文件与上面的 git hook 脚本
# 我这里懒得折腾，直接推主分支，反正就一个自己用的博客
git push -f origin master
git push -f yuier master
```

执行脚本后，推送到 GitHub 仓会比较快；而推送到个人仓，由于需要执行 git hook 脚本进行构建与部署，会稍微卡一会，耐心等待就好。

等全部执行完毕后，就可以在浏览器里输入 `<你的 nginx 服务地址>` 访问网站了。如果部署有问题，就可以去 git hook 中配置的日志文件 `/home/git/logs/blog_deploy.log` 中查看详情。

![image.png](https://s2.loli.net/2025/03/11/PcqsQJvOKZXAkgE.png)

## 附录

关于 nginx 服务的搭建，其实可讲可不讲，因为网上的相关文章太多了，写得好的也很多，我无意再添无足轻重的一笔。这里只挑一些别人写得少的东西记录下来。

### 域名解析、服务备案

一般的云服务商都会对这两块提供详细的引导，跟着做就行了。我用的是腾讯云，个人感觉除了备案本身的繁琐外没遇到什么牙白的事情。

### SSL 证书的申请与配置

申请同样在腾讯云上一站式达成。腾讯云现在（2025 年 3 月）可以免费申请 50 个证书，每个证书有效期 90 天，够用很久很久的了。

申请完后，可以参考 [证书安装](https://cloud.tencent.com/document/product/400/35244#.E8.AF.81.E4.B9.A6.E5.AE.89.E8.A3.85) 这个地方在 nginx 服务下配置。

### 最后贴一下我的 nginx.conf

```nginx [/etc/nginx/nginx.conf]
#运行用户，默认就是 www-data 组下的 www-data
user www-data www-data;

#启动进程,通常设置成和cpu的数量相等
worker_processes 2;

#全局错误日志
error_log  /usr/share/nginx/logs/error.log;
error_log  /usr/share/nginx/logs/notice.log  notice;
error_log  /usr/share/nginx/logs/info.log  info;

#PID文件，记录当前启动的nginx的进程ID
pid        /run/nginx.pid;

#工作模式及连接数上限
events {
    worker_connections 1024;    #单个后台worker process进程的最大并发链接数
}

#设定http服务器，利用它的反向代理功能提供负载均衡支持
http {

    # 这一坨来自腾讯云推荐配置
    # 新增 HTTPS 优化配置
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 5m;
    ssl_protocols TLSv1.2 TLSv1.3;  # 禁用旧版协议
    ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:HIGH:!aNULL:!MD5:!RC4:!DHE;
    ssl_prefer_server_ciphers on;

    # 全局开启文件指纹验证
    etag on;    

    #设定mime类型(邮件支持类型),类型由mime.types文件定义
    include       /usr/share/nginx/conf/mime.types;
    default_type  application/octet-stream;

    #设定日志
        log_format  main  '[$remote_addr] - [$remote_user] [$time_local] "$request" '
                      '$status $body_bytes_sent "$http_referer" '
                      '"$http_user_agent" "$http_x_forwarded_for"';

    access_log    /usr/share/nginx/logs/access.log main;
    rewrite_log     on;

    #sendfile 指令指定 nginx 是否调用 sendfile 函数（zero copy 方式）来输出文件，对于普通应用，
    #必须设为 on,如果用来进行下载等应用磁盘IO重负载应用，可设置为 off，以平衡磁盘与网络I/O处理速度，降低系统的uptime.
    sendfile        on;
    #tcp_nopush     on;

    #连接超时时间
    keepalive_timeout  120;
    tcp_nodelay        on;

        #gzip压缩开关
        #gzip  on;

    #设定实际的服务器列表
    #upstream zp_server1{
    #    server 127.0.0.1:8089;
    #}

    # 强制 HTTP 跳转 HTTPS（重要！）
    server {
        listen 80;
        server_name yuier.com;

        # 301 永久重定向
        return 301 https://$host$request_uri;
    }

    #HTTPS服务器
    server {

        listen 443 ssl http2;  # 启用 HTTP/2
        server_name yuier.com;
        
        # SSL 证书配置（请修改为你的实际路径）
        ssl_certificate /usr/share/nginx/ssl/yuier.com_bundle.crt;  # 证书链文件
        ssl_certificate_key /usr/share/nginx/ssl/yuier.com.key;  # 私钥文件

        # 启用 OCSP Stapling 提升性能
        ssl_stapling on;
        ssl_stapling_verify on;
        resolver 8.8.8.8 1.1.1.1 valid=300s;
        resolver_timeout 5s;

        # 安全响应头
        add_header Strict-Transport-Security "max-age=63072000; includeSubDomains; preload";
        add_header X-Content-Type-Options nosniff;
        add_header X-Frame-Options DENY;

        gzip on;
        gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;

        index index.html;

        location / {
            # content location
            # root /app;
            root /usr/share/nginx/html;
    
            # exact matches -> reverse clean urls -> folders -> not found
            try_files $uri $uri.html $uri/ =404;

            # non existent pages
            error_page 404 /404.html;

            # a folder without index.html raises 403 in this setup
            error_page 403 /404.html;

            # adjust caching headers
            # files in the assets folder have hashes filenames
            location ~* ^/assets/ {
                expires 1y;
                add_header Cache-Control "public, immutable";
            }
        }
    }
}
```

上面提到了 `mime.types` 文件，简单说就是配置对于不同文件类型的请求的响应。下面是我的该文件内容：

``` [mime.types]
types {
    text/html                             html htm shtml;
    text/css                              css;
    text/xml                              xml;
    image/gif                             gif;
    image/jpeg                            jpeg jpg;
    application/javascript                js;
    application/atom+xml                  atom;
    application/rss+xml                   rss;

    text/mathml                           mml;
    text/plain                            txt;
    text/vnd.sun.j2me.app-descriptor      jad;
    text/vnd.wap.wml                      wml;
    text/x-component                      htc;

    image/png                             png;
    image/tiff                            tif tiff;
    image/vnd.wap.wbmp                    wbmp;
    image/x-icon                          ico;
    image/x-jng                           jng;
    image/x-ms-bmp                        bmp;
    image/svg+xml                         svg svgz;
    image/webp                            webp;

    application/font-woff                 woff;
    application/java-archive              jar war ear;
    application/json                      json;
    application/mac-binhex40              hqx;
    application/msword                    doc;
    application/pdf                       pdf;
    application/postscript                ps eps ai;
    application/rtf                       rtf;
    application/vnd.apple.mpegurl         m3u8;
    application/vnd.ms-excel              xls;
    application/vnd.ms-fontobject         eot;
    application/vnd.ms-powerpoint         ppt;
    application/vnd.wap.wmlc              wmlc;
    application/vnd.google-earth.kml+xml  kml;
    application/vnd.google-earth.kmz      kmz;
    application/x-7z-compressed           7z;
    application/x-cocoa                   cco;
    application/x-java-archive-diff       jardiff;
    application/x-java-jnlp-file          jnlp;
    application/x-makeself                run;
    application/x-perl                    pl pm;
    application/x-pilot                   prc pdb;
    application/x-rar-compressed          rar;
    application/x-redhat-package-manager  rpm;
    application/x-sea                     sea;
    application/x-shockwave-flash         swf;
    application/x-stuffit                 sit;
    application/x-tcl                     tcl tk;
    application/x-x509-ca-cert            der pem crt;
    application/x-xpinstall               xpi;
    application/xhtml+xml                 xhtml;
    application/xspf+xml                  xspf;
    application/zip                       zip;

    application/octet-stream              bin exe dll;
    application/octet-stream              deb;
    application/octet-stream              dmg;
    application/octet-stream              iso img;
    application/octet-stream              msi msp msm;

    application/vnd.openxmlformats-officedocument.wordprocessingml.document    docx;
    application/vnd.openxmlformats-officedocument.spreadsheetml.sheet          xlsx;
    application/vnd.openxmlformats-officedocument.presentationml.presentation  pptx;

    audio/midi                            mid midi kar;
    audio/mpeg                            mp3;
    audio/ogg                             ogg;
    audio/x-m4a                           m4a;
    audio/x-realaudio                     ra;

    video/3gpp                            3gpp 3gp;
    video/mp2t                            ts;
    video/mp4                             mp4;
    video/mpeg                            mpeg mpg;
    video/quicktime                       mov;
    video/webm                            webm;
    video/x-flv                           flv;
    video/x-m4v                           m4v;
    video/x-mng                           mng;
    video/x-ms-asf                        asx asf;
    video/x-ms-wmv                        wmv;
    video/x-msvideo                       avi;
}
```

## 以 nginx 部署

(To be done...)