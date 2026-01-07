---
title: Yuni3 机器人部署备忘录
titleTemplate: '%s - yuier'
date: 2026-01-08 00:10:59
updated: 2026-01-08 00:10:59
author: yuier
categories:
    - qq机器人
tags:
    - qq机器人
cover: 
hide: index
---

## OneBot 前端

使用 NapCat 作为前端

部署过程参考 [安装 NapCat](https://napneko.github.io/guide/install)

我使用的是 Docker 方式部署

https://github.com/NapNeko/NapCat-Docker

### 配置

起一个 ws 服务器

![image.png](https://s2.loli.net/2026/01/08/VbgWkyJAjHRGcUp.png)

## 基础设施

> 应用根目录为 `srv/bot/yuni`

### 数据库

为了方便，我使用的是 SQLite 数据库

本地已经有开发过程中产生的 SQLite 数据库文件了，直接上传到应用根目录的 `data` 目录下

### redis

也是在服务器上搭建的 redis 服务

## 业务适配

### 应用构建

在启动类 `yuni-application` 的 `pom.xml` 中添加 `<build>` 配置

```xml
<!-- SpringBoot打包插件（生成可执行Jar） -->
<build>
    <plugins>
        <plugin>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-maven-plugin</artifactId>
            <executions>
                <execution>
                    <goals>
                        <goal>repackage</goal>
                    </goals>
                </execution>
            </executions>
        </plugin>
    </plugins>
    <!-- 自定义Jar包名称（简化部署） -->
    <finalName>yuni-app</finalName>
</build>
```

应用 jar 包本地构建，然后上传到应用根目录下

### 插件

插件 jar 包上传到应用根目录的 `plugins` 目录下

### 生产配置

在应用根目录的 `config/application-prod.yml` 中编写生产配置

注意要在配置中显式标明这是生产配置

```yml
spring:
  config:
    activate:
      on-profile: prod
```

### 最终部署目录结构

```
.
├── config
│   └── application-prod.yml
├── data
│   └── yuni3.db
├── logs
│   ├── 略
├── plugins
│   ├── daily-news-0.0.1-SNAPSHOT.jar
│   ├── event-manage-0.0.1-SNAPSHOT.jar
│   ├── example-0.0.1-SNAPSHOT.jar
│   ├── maimai-0.0.1-SNAPSHOT.jar
│   └── plugin-manage-0.0.1-SNAPSHOT.jar
├── start_yuni.sh
└── yuni-app.jar
```

## 启动脚本

简单在根目录下写了个启动脚本

```bash
# start_yuni.sh
# 执行 jar 包为 yuni-app.jar
# 指定应用的配置为 prod 配置
# 引入外部配置 ./config/application-prod.yml
java -jar yuni-app.jar \
--spring.profiles.active=prod \
--spring.config.location=./config/application-prod.yml
```

我使用 screen 执行脚本

![image.png](https://s2.loli.net/2026/01/08/NLK2H57fOSviAGY.png)

## 补充：麦麦

我的 Yuni 做了一个麦麦的适配，因此需要再启动一个麦麦机器人

麦麦本体部署参考: [MaiBot 部署指南](https://docs.mai-mai.org/manual/deployment/)

我的适配插件模拟 NapCat 前端与麦麦进行交互，所以麦麦那边使用 NapCat 适配器

麦麦-NapCat 适配器: [MaiBot Napcat Adapter](https://docs.mai-mai.org/manual/adapters/napcat.html)