---
title: 
titleTemplate: '%s - yuier'
date: 2025-10-31 15:01:50
updated: 2025-10-31 15:01:50
author: yuier
cover: 
hide: true
---

## 个人博客证书

### 申请证书

https://console.cloud.tencent.com/ssl

![image.png](https://s2.loli.net/2025/10/31/v8dT2pLgC65QPht.png)

一般一两分钟就行

### 下载证书

回到上面的链接，点开最新证书

![image.png](https://s2.loli.net/2025/10/31/jt4PBNmEKecDU8V.png)

![image.png](https://s2.loli.net/2025/10/31/ROvahUxIFSNsGdb.png)

F:\Codes\Create\Blog\ssl证书

### 上传与刷新证书

将 `yuier.com_bundle.crt` 与 `yuier.com.key` 上传到服务器的 `/srv/blog/nginx/ssl` 目录下

运行 `/srv/blog/nginx/start.sh`

访问 `https://yuier.com/` 检查效果

## 邮箱证书

### 访问邮箱后台

https://mail.yuier.com/admin/server/

会出现提示 `你的连接不是专用连接`

在页面空白处敲出 `thisisunsafe` 即可

账密在浏览器密码管理器里有

### 申请新证书

![image.png](https://s2.loli.net/2025/10/31/7sfiw1GmBachEdk.png)

![image.png](https://s2.loli.net/2025/10/31/eSXn2ypB1Tqi7o8.png)

### 刷新证书

运行 `/root/utils/refresh_mail_certificates.sh` 脚本。其内容如下：

```bash
cd /srv/blog/nginx/ssl/email
rm fullchain.pem
rm private.pem
cd /srv/email/me/data/ssl/letsencrypt/mail.yuier.com
cp fullchain.pem /srv/blog/nginx/ssl/email/fullchain.pem
cp private.pem /srv/blog/nginx/ssl/email/private.pem

cd /srv/blog/nginx/
./start.sh
```