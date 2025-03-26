---
title: 使用 nginx - docker 部署博客
titleTemplate: '%s - yuier'
date: 2025-03-25 23:45:36
updated: 2025-03-25 23:45:36
author: yuier
cover: 
hide: 
---

不使用 docker 部署步骤见 [个人博客的搭建与部署](https://yuier.com/posts/002-blog-deploy) （不推荐）

<!-- more -->

## 极简版

假设读者已经完成了购买服务器；安装 Linux(Ubuntu) 系统；购买域名；域名备案（如有需要）；申请并下载 ssl 证书；在服务器上配置 git 、node、pnpm 环境；安装 docker 并拉取 `nginx:latest` 镜像；参考 [Valaxy - Getting Started](https://valaxy.site/guide/getting-started) 在本地搭建起博客服务等一系列前置工作。

### 需要使用的工作目录和文件

> 免责声明：以下所有目录具体路径选择理由均为俺寻思这么整能行，并不代表笔者认定以下为最佳实践

#### git 工作流

我的持续部署思路是这样的：本地修改好 blog —— 通过 git 推送到服务器上的远程仓 —— 在远程仓上使用 git hooks 完成仓库 pull 到（服务器上的）本地并构建 —— 最终将构建产物复制到 nginx 工作目录（的挂载目录下）

~~正如上面所说，我选择这套工作流的理由也是俺寻思这么整能行~~

- git 远程仓库，用于本地修改 blog 后将代码推送到服务器

    参考 [搭建自己的 git 远程仓库服务](https://yuier.com/posts/001-build-self-gitrepo-server) ，最终在 `/home/git/repos/liyuier.github.io.git` 下搭建起博客的远程仓库

    在本地博客仓库，使用 `git remote add` 命令将该仓库添加为本地仓的远程仓库。我这里将其命名为 `yuier`

    ```bash
    $ git remote -v
    origin  git@github.com:liyuier/liyuier.github.io.git (fetch)
    origin  git@github.com:liyuier/liyuier.github.io.git (push)
    yuier   git@yuier.com:/home/git/repos/liyuier.github.io.git (fetch)  # 这里就是远程仓
    yuier   git@yuier.com:/home/git/repos/liyuier.github.io.git (push)
    ```

- 服务器构建工作目录

    本地代码推送到远程仓后，通过 `git hooks` 脚本将代码 pull 到服务器上另一个目录下并执行构建工作

    这里我选择放在 `/usr/dev/blog/liyuier.github.io`

- 构建结果存放目录

    构建完毕后，再次将 `dist` 目录下的构建产物复制到第三个目录下，第三个目录会在 nginx 容器启动时挂载为容器内 nginx 的工作目录，于是 nginx 容器便可以以我们的构建产物启动服务

    这个目录我选择 `/srv/blog/nginx/html`

- git hooks

    在 `/home/git/repos/liyuier.github.io.git/hooks` 目录下，新建一个名为 `post-receive` 的文件。该文件会在接收到 git 推送后自动执行。

    ```bash
    # 定义日志文件路径（推荐存放在 git 用户有权限的目录）
    LOG_FILE="/home/git/logs/blog_deploy.log"
    DEPLOY_LOG_DIR=$(dirname "$LOG_FILE")

    # 创建日志目录（如果不存在）
    mkdir -p "$DEPLOY_LOG_DIR"
    sudo chown git:git "$DEPLOY_LOG_DIR"  # 确保目录所有权

    # 重定向所有输出到日志文件（追加模式）
    exec >> "$LOG_FILE" 2>&1

    # 添加时间戳分隔符
    echo -e "\n\n=== $(date '+%Y-%m-%d %H:%M:%S') 开始部署 ==="

    #!/bin/bash  # 指定使用 bash shell 解释器

    # 定义变量：工作目录路径（必须与之前创建的目录一致）
    TARGET="/usr/dev/blog/liyuier.github.io"

    # 定义变量：Nginx 的网站根目录（最终部署位置）
    DEPLOY_DIR="/srv/blog/nginx/html"

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
    # 感觉用 docker 部署的话，这一步没必要
    # sudo chown -R root $DEPLOY_DIR

    echo "✅ Deployment completed! Nginx content updated."  # 输出完成提示

    # 检查配置语法
    # 定义变量
    CONTAINER_NAME="blog"  # 替换为你的容器名称或ID

    # 检查 Nginx 配置文件语法
    sudo docker exec $CONTAINER_NAME nginx -t > /dev/null 2>&1

    # 判断命令执行结果
    if [ $? -eq 0 ]; then
        echo "Nginx 配置文件语法正确"
    else
        echo "Nginx 配置文件语法错误，请检查！"
        exit 1
    fi

    # 执行重载
    sudo docker exec $CONTAINER_NAME nginx -s reload
    echo "🔄 Nginx 已平滑重载"
    ```

    脚本中有很多 `sudo` 命令，为了使脚本执行时不需要输入密码，需要修改 `sudoers` 文件。具体方法可以参考 [让Linux用户sudo操作免密码](https://bingozb.github.io/views/default/58.html) .
    
#### nginx 容器

这部分，我们需要准备 nginx 容器启动脚本、nginx 配置文件、nginx 容器挂载目录等。

这些就不解释了，通用做法。

- nginx 挂载目录

    上文中我们准备的构建结果存放目录其实就是整个挂载目录 “套装” 的一部分。完整的环境是这样的：

    ```bash
    $ pwd
    /srv/blog/nginx
    $ tree -L 1
    .
    ├── conf.d
    │   └── blog.conf  # 博客服务配置
    ├── html
    │   ├── index.html  # 构建产物
    │   ├── ...
    ├── logs
    │   ├── access.log  # 访问日志
    │   ├── error.log  # 各等级日志
    │   ├── info.log
    │   └── notice.log
    ├── mime.types  # 指定不同类型资源处理方式的文件，具体可以问大模型
    ├── nginx.conf  # 主配置
    ├── ssl
    │   ├── yuier.com_bundle.crt  # ssl 证书文件
    │   └── yuier.com.key
    └── start.sh  # nginx docker 启动脚本
    ```

- 各文件内容

    - blog.conf

        ``` conf
        # 强制 HTTP 跳转 HTTPS（重要！）
        server {
            listen 80;
            server_name yuier.com;

            # 301 永久重定向
            return 301 https://$host$request_uri;
        }

        #HTTPS服务器
        server {

            listen 443 ssl;  # 启用 HTTP/2
            server_name yuier.com;
            
            # SSL 证书配置（请修改为你的实际路径）
            ssl_certificate /etc/nginx/ssl/yuier.com_bundle.crt;  # 证书链文件
            ssl_certificate_key /etc/nginx/ssl/yuier.com.key;  # 私钥文件

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
        ```

    - mime.types

        ```types
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

    - nginx.conf

        其实这个文件是先简单 docker run 起一个容器，然后用 

        > docker cp <容器ID或名称>:<容器内的路径> <主机上的目标路径>

        命令复制出来的。

        ``` conf
        user  nginx;
        worker_processes  auto;

        error_log  /var/log/nginx/error.log notice;
        pid        /var/run/nginx.pid;


        events {
            worker_connections  1024;
        }


        http {
            include       /etc/nginx/mime.types;
            default_type  application/octet-stream;

            log_format  main  '$remote_addr - $remote_user [$time_local] "$request" '
                            '$status $body_bytes_sent "$http_referer" '
                            '"$http_user_agent" "$http_x_forwarded_for"';

            access_log  /var/log/nginx/access.log  main;

            sendfile        on;
            #tcp_nopush     on;

            keepalive_timeout  65;

            #gzip  on;

            # 将 conf.d 目录下所有文件都 include 进来。即上文中的 blog.conf 文件就会被 include
            include /etc/nginx/conf.d/*.conf;
        }
        ```

    - start.sh

        ```bash
        #!/bin/bash

        # 该脚本会以 nginx:latest 镜像启动一个名为 blog 的容器
        # 如果下述命令执行时存在权限问题，就都改成 sudo 好了

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

        # --------------------------------------------
        # 启动Nginx容器（关键修正点）
        # -p 选项用于映射端口；冒号前为主机端口，冒号后为容器端口
        # -v 选项用于挂载路径；冒号前为主机路径，冒号后为容器路径
        # --------------------------------------------
        docker run -d \
        --name blog \
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

### Blog，启动！

万事俱备。首先执行 `./start.sh` 启动容器，访问 `your-site.domain` 确认 nginx 容器正常工作。

然后本地修改 blog ，完成后使用

```bash
# 因为这是我自己用的项目，所以直接用 -f 推 master 分支。反正在 github 那边还有个备份
# （虽然 github 那边同样用的 -f 推 master ，笑）
git push -f yuier master
```

命令将修改推送到服务器上的远程仓，触发 git hooks 脚本，并实现自动构建、部署。

读者当前看到的网站就是通过这种方式部署的。