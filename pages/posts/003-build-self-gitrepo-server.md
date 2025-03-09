---
title: 搭建自己的 git 远程仓库服务
titleTemplate: '%s - yuier'
date: 2025-03-09 23:19:12
updated: 2025-03-09 23:19:12
author: yuier
cover: 
---

## 流程简述

假设我们已经拥有了一台 Linux 服务器，并且服务器上安装好了 git，并且已经比较熟悉 Linux 与 git 的常用操作

- 创建 git 用户，用于管理 git 仓库 —— 这样我们的仓库地址就会是 `git@your-site.com:/xxx/yyy/zzz.git`

- 配置 ssh 免密登录，这样每次拉取/推送代码时不必输入 git 用户的密码

- 创建仓库并拉取

<!-- more -->

## 实操

```bash
# 在 root 权限下创建
# 需要设置 git 账户密码
sudo useradd git
# 创建完成后 /home 路径下会创建 git 目录，可以查看一下
ll /home/

# 进入 git 目录，配置免密登录
cd /home/git
# 这里需要切换到 git 用户
su git
mkdir .ssh
cd .ssh
# authorized_keys 文件用于保存用户公钥，将本地 PC 生成的公钥粘进去。
# 如果有多个用户，每行一个公钥即可
vim authorized_keys
# 设置权限
# 如果这里无法执行 sudo 命令，提示 git is not in the sudoers file，
# 切到 root 用户，修改 /etc/sudoers 文件，在文件末尾加上一行下述内容：
# git ALL=(ALL:ALL) ALL
# 文件所有者有读、写、执行权限，同组、其他用户均无任何权限
sudo chmod -R 700 /home/git/.ssh
# 文件所有者拥有读写权限，同组、其他用户均无任何权限
sudo chmod 600 /home/git/.ssh/authorized_keys
# 在廖雪峰的教程中，还有一步限制 git 用户通过 shell 登录，但是我自己没有这个需求，所以没有这么做
# 需要的可以参考 https://liaoxuefeng.com/books/git/customize/server/index.html - 第五步，禁用shell登录

# 回到 git 用户目录，建立一个 repos 目录用于储存各个仓库
cd /home/git
mkdir repos
# 创建测试仓库
cd repos
# 创建一个空仓库
git init --bare sample.git
# 这一步将会在当前目录下创建一个 sample.git 目录，其结构如下。这就是我们的 git 远程仓库了
    repos
        └── sample.git
            ├── branches
            ├── config
            ├── description
            ├── HEAD
            ├── hooks
            ├── info
            ├── objects
            └── refs

# 本地可以正常拉取、修改、推送仓库了
git clone git@your-site.com:/home/git/repos/sample.git
# 拉下来的就是熟悉的 git 本地仓库形态
    sample
        └── .git
```