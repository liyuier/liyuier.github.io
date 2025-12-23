---
title: QQ 机器人架构梳理
titleTemplate: "%s - yuier"
date: 2025-12-19 00:33:19
updated: 2025-12-19 00:33:19
author: yuier
categories:
  - qq机器人
tags:
  - qq机器人
  - 大饼
cover:
hide: true
---

## 前言

我的 QQ 机器人已经写了两版了，但是感觉都总是不得劲。思来想去，应该是每次开写的时候都没有梳理好整体思路，打开 IDEA 就是干，不免写着写着就出现各种意料之外的情况。

于是今天晚上我找[千问](https://www.qianwen.com/)聊了一下这个话题，我们俩一起畅想了一番 QQ 机器人的设计

## 整体架构

在我给出的多次英明指导下，千问勤勤恳恳地为我输出了一套让我比较满意的架构。

在这个架构中提供了简单的权限模块、插件模块。这将会是我下一个机器人的蓝图（虽然最终发现这跟我上一个烂尾的机器人没啥区别就是了）

```mermaid
graph TB
    subgraph "输入层"
        A[好友A在群123456发送: /报时]
        B[QQ协议适配器]
    end

    subgraph "核心处理层"
        C[主机器人: handleMessage]
        D[会话管理器: updateSession]
        E[插件管理器: findMatch]
        F[权限验证器: check]
    end

    subgraph "业务逻辑层"
        G[报时插件: execute]
        H[通用回复处理器: process]
    end

    subgraph "输出层"
        I[消息输出器: send]
        J[QQ协议输出]
    end

    subgraph "数据存储"
        K[Redis缓存]
        L[MongoDB数据库]
    end

    %% 消息处理流程
    A --> B
    B --> C

    %% 会话更新
    C --> D
    D --> K

    %% 插件匹配
    C --> E
    E -->|匹配到报时插件| F
    E -->|未匹配插件| H

    %% 权限验证
    F --> L
    L --> F
    F -->|权限通过| G
    F -->|权限拒绝| I

    %% 业务执行
    G --> I
    H --> I

    %% 消息输出
    I --> J
    J --> M[群123456显示: 当前时间是 2024年01月15日 14:30:25]

    style A fill:#e1f5fe
    style M fill:#e8f5e8
    style G fill:#fff3e0
    style C fill:#f3e5f5
    style F fill:#ffebee
```

## 插件系统

插件系统是一个开放的框架必须支持的，尤其对于 qq bot 这样尤其需要活跃社区的产品。

千问建议我基于 Spring 提供的 @EventListener 机制扩展我的插件系统，这一机制天然适合 qq bot 这样事件驱动的系统。

```mermaid
graph TB
    subgraph "Spring容器"
        A[TimeReportPlugin实例]
        B[WeatherPlugin实例]
        C[MusicPlugin实例]
        D[Event Multicaster]
    end

    subgraph "事件处理"
        E[ApplicationEventPublisher.publishEvent]
        F[遍历所有监听器]
        G1{TimeReportPlugin<br>.shouldHandle?}
        G2{WeatherPlugin<br>.shouldHandle?}
        G3{MusicPlugin<br>.shouldHandle?}
        H1[TimeReportPlugin.processEvent]
        H2[WeatherPlugin.processEvent]
        H3[MusicPlugin.processEvent]
    end

    E --> D
    D --> F
    F --> G1
    F --> G2
    F --> G3
    G1 -->|true| H1
    G1 -->|false| I[跳过]
    G2 -->|true| H2
    G2 -->|false| I
    G3 -->|true| H3
    G3 -->|false| I

    style A fill:#e1f5fe
    style B fill:#e8f5e8
    style C fill:#fff3e0
    style H1 fill:#ffcdd2
    style H2 fill:#c8e6c9
    style H3 fill:#bbdefb
```

## 项目结构

```
qq-bot/                              # 父项目（根目录）
├── pom.xml                         # 父POM，管理所有子模块
├── README.md
├── docs/
│   ├── architecture.md
│   └── plugin-development-guide.md
├── qq-bot-core/                    # 核心模块（接口定义、基础模型）
│   ├── pom.xml
│   └── src/main/java/com/example/qbot/core/
│       ├── api/
│       │   ├── Plugin.java                    # 插件基础接口
│       │   ├── CommandPlugin.java             # 命令插件接口
│       │   ├── EventPlugin.java               # 事件插件接口
│       │   └── MessageHandlerPlugin.java      # 消息处理器插件接口
│       ├── model/
│       │   ├── MessageEvent.java              # 消息事件基础模型
│       │   ├── GroupMessageEvent.java         # 群消息事件
│       │   ├── PrivateMessageEvent.java       # 私聊消息事件
│       │   └── PluginContext.java             # 插件上下文
│       ├── session/
│       │   └── MessageSession.java            # 消息会话对象
│       ├── cqcode/
│       │   └── CqCodeParser.java              # CQ码解析器
│       └── annotation/
│           └── PluginInfo.java                # 插件信息注解
├── qq-bot-domain/                  # 领域模型模块
│   ├── pom.xml
│   └── src/main/java/com/example/qbot/domain/
│       ├── entity/
│       │   └── PluginMetadata.java            # 插件元数据
│       ├── repository/
│       │   └── PluginRepository.java          # 插件仓库接口
│       └── service/
│           └── PluginService.java             # 插件服务接口
├── qq-bot-plugin-system/           # 插件系统核心模块
│   ├── pom.xml
│   └── src/main/java/com/example/qbot/plugin/
│       ├── PluginManager.java                 # 插件管理器
│       ├── PluginRegistry.java                # 插件注册器
│       ├── PluginClassLoader.java             # 插件类加载器
│       └── PluginLifecycleManager.java        # 插件生命周期管理
├── qq-bot-command-system/          # 指令系统模块
│   ├── pom.xml
│   └── src/main/java/com/example/qbot/command/
│       ├── CommandRegistry.java               # 命令注册器
│       ├── CommandMatcher.java                # 命令匹配器
│       ├── CommandProcessor.java              # 命令处理器
│       └── handler/
│           └── CommandHandler.java            # 命令处理器接口
├── qq-bot-adapter/                 # 适配器模块（协议通信）
│   ├── pom.xml
│   └── src/main/java/com/example/qbot/adapter/
│       ├── qq/
│       │   ├── QqProtocolAdapter.java        # QQ协议适配器（Go-CQHTTP/Mirai）
│       │   ├── QqMessageConverter.java       # QQ消息格式转换器
│       │   └── QqConnectionManager.java      # QQ连接管理器
│       └── websocket/
│           └── QqWebSocketHandler.java       # QQ WebSocket消息处理器
├── qq-bot-bot-engine/              # 机器人引擎模块
│   ├── pom.xml
│   └── src/main/java/com/example/qbot/engine/
│       ├── BotManager.java                    # 机器人管理器
│       ├── MessageProcessor.java              # 消息处理器
│       ├── RobotMessenger.java                # 机器人消息发送器
│       └── event/
│           └── EventPublisher.java            # 事件发布器
├── qq-bot-web-api/                 # Web API模块
│   ├── pom.xml
│   └── src/main/java/com/example/qbot/web/
│       ├── QqBotWebApplication.java          # Web应用启动类
│       ├── controller/
│       │   ├── PluginController.java         # 插件管理控制器
│       │   ├── CommandController.java        # 命令管理控制器
│       │   └── BotController.java            # 机器人管理控制器
│       └── config/
│           └── WebSocketConfig.java          # WebSocket配置
├── qq-bot-application/             # 主应用模块（可执行JAR）
│   ├── pom.xml
│   ├── src/main/java/com/example/qbot/app/
│   │   └── QqBotApplication.java             # 主应用启动类
│   └── src/main/resources/
│       ├── application.yml                   # 应用配置
│       ├── banner.txt                        # 启动横幅
│       └── plugins/                          # 插件存放目录
└── plugins/                        # 插件开发目录（独立项目）
    ├── time-plugin/
    │   ├── pom.xml
    │   └── src/main/java/com/example/plugins/time/
    │       ├── TimePlugin.java               # 时间插件主类
    │       └── handlers/
    │           ├── TimeCommandHandler.java   # 时间命令处理器
    │           └── DateCommandHandler.java   # 日期命令处理器
    └── weather-plugin/
        ├── pom.xml
        └── src/main/java/com/example/plugins/weather/
            ├── WeatherPlugin.java            # 天气插件主类
            └── handlers/
                └── WeatherCommandHandler.java # 天气命令处理器
```

### core 模块

提供基础的注解、异常、工具类和数据模型

被其他所有模块依赖

### domain 模块

数据库实体类、仓库接口、领域服务

### 插件系统模块

插件加载、管理、生命周期控制

### 指令系统

指令解析、匹配、执行

### 适配器模块

外部系统集成

### engine 模块

机器人核心逻辑，消息处理，事件分发

### web 模块

提供 web 接口

### application 模块

整合其他模块

## 图表

```mermaid
graph TB
    subgraph "主程序层"
        A[OneBot Adapter] --> B[Event Dispatcher]
        B --> C[Permission Manager]
        C --> D[Plugin Manager]
        D --> E[Plugin Registry]
    end

    subgraph "插件层"
        F[Plugin Instance 1] --> G[Matcher 1]
        F --> H[Matcher 2]
        I[Plugin Instance 2] --> J[Matcher 3]
        I --> K[Matcher 4]
        L[Plugin Instance N] --> M[Matcher 5]
        L --> N[Matcher 6]
    end

    subgraph "权限层"
        O[Group Config 1] --> P[User Permissions]
        Q[Group Config 2] --> R[User Permissions]
        S[Global Config] --> T[Default Rules]
    end

    subgraph "热重载层"
        U[File Watcher] --> V[Hot Reload Monitor]
        V --> W[Class Loader Manager]
        W --> X[Plugin Reloader]
    end

    A --> U
    D --> V
    E --> W
    C --> O
    C --> Q
    C --> S
```

```mermaid
graph LR
    A[用户A] --> B[群1]
    A --> C[群2]
    D[用户B] --> B
    D --> C

    B --> E[插件X: 启用]
    B --> F[插件Y: 禁用]
    C --> G[插件X: 禁用]
    C --> H[插件Y: 启用]

    E --> I[用户A在群1对插件X: ADMIN权限]
    F --> J[用户A在群1对插件Y: 无权限]
    G --> K[用户A在群2对插件X: MEMBER权限]
    H --> L[用户A在群2对插件Y: ADMIN权限]
```

```mermaid
sequenceDiagram
    participant Bot as OneBot Adapter
    participant ED as Event Dispatcher
    participant PM as Permission Manager
    participant MM as Plugin Manager
    participant Plugin as Plugin

    Bot->>ED: Receive Event
    ED->>MM: Dispatch Event
    MM->>PM: Check Permission
    PM-->>MM: Permission Result
    alt Has Permission
        MM->>MM: Match Event with Plugin Matchers
        alt Event Matches
            MM->>Plugin: Call onEvent()
            Plugin-->>MM: Process Event
            MM-->>ED: Event Handled
        end
    end
    ED-->>Bot: Response
```

```
yuni-bot/
├── application.jar                 # 主程序
├── plugins/                       # 插件目录
│   ├── plugin1.jar
│   ├── plugin2.jar
│   └── development/
│       └── dev-plugin.class
├── config/
│   └── group-permissions.json     # 权限配置
└── logs/
```

public class PassivePluginInstance implements PluginInstance {

    ...
    private YuniEventDetector<?> detector;
    ...
}