---
title: Redis 与数据库数据一致性的一种方式
titleTemplate: '%s - yuier'
date: 2025-07-05 17:38:04
updated: 2025-07-05 17:38:04
author: yuier
cover: 
hide: true
---

## 架构

```mermaid
graph LR
    mysql[MySQL]
    binlog[binlog]
    canal[canal]
    mq[mq]
    app[应用程序]
    redis[Redis]

    mysql --记录日志--> binlog
    binlog  --被 canal 监听--> canal
    canal --通知消息队列--> mq
    mq --应用程序消费消息--> app
    app --刷新 Redis--> redis

```