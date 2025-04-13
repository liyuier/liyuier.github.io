---
title: 使用 Jackson 反序列化自动适配子类
titleTemplate: '%s - yuier'
date: 2025-03-26 23:56:28
updated: 2025-03-26 23:56:28
author: yuier
cover: 
hide: 
---

本文采用方法完全来自于 [10 分钟轻松学会 Jackson 反序列化自动适配子类](https://zhuanlan.zhihu.com/p/357911357) ；本文仅补充笔者实践部分工作。

<!-- more -->

## 问题引入

我一直在开发一款 QQ 机器人服务端程序项目，该项目适配 [OneBot 11 标准](https://283375.github.io/onebot_v11_vitepress/) ; 我的问题就是这个标准中的 [事件](https://283375.github.io/onebot_v11_vitepress/event/index.html) 上报机制引入的。

关于 QQ 机器人比较详细的科普（其实也没有很详细），可以参考我的 [QQ 机器人漫谈](https://yuier.com/posts/003-qq-bot-brief-introduce) ; 直入正题地说呢，OneBot 标准定义了一个 `客户端` 和一个 `服务端` 配合提供 QQ 机器人服务；其中客户端用于模拟官方 QQ 客户端，与 QQ 服务器通信，并向服务端上报诸如每条聊天记录、加群退群、禁言、好友申请等一系列消息，服务端处理这些消息，并操作客户端，实现完整的 QQ 机器人服务。

客户端向服务端上报的这些消息，在 OneBot 标准中被统一整合为 `事件` . 原文：

> 事件是用户需要从 OneBot 被动接收的数据，有以下几个大类：
> - 消息事件，包括私聊消息、群消息等
> - 通知事件，包括群成员变动、好友变动等
> - 请求事件，包括加群请求、加好友请求等
> - 元事件，包括 OneBot 生命周期、心跳等
> 
> 在所有能够推送事件的通信方式中（HTTP POST、正向和反向 WebSocket），事件都以 JSON 格式表示。

然后坑爹的事情就来了：按道理，这么多不同类型的事件，应该以 URL 区分，上报到服务端不同接口进行处理，这样服务端程序才好编写，业务也好隔离；但是 OneBot 不这样，他规定所有事件全部打到一个接口里，然后以某个字段进行区分。

自然，事件内部还细分事件；比如消息事件就细分为群聊消息和私聊消息；群聊消息又分为匿名和非匿名；每个事件里还有子事件。。。总之乱得一比，我不知道当年 CQHTTP 插件的作者是在什么样的精神状态下设计出这样一套协议的。

但是总归这个协议现在是最普及的 QQ 机器人协议，我又选择了 ~~SpringBoot~~ Java 这种强类型静态语言开发我的服务端程序，于是硬着头皮上了。

我预期的效果是：在 Controller 层，收到报文后，能够自动反序列化请求体为具体的子类型。比如收到一个群聊消息的报文，就自动反序列化为 `GroupMessageEvent` 对象；而不必手动地从最顶端的 `OneBotEvent` 对象，先转成 `MessageEvent` ，再转成 `GroupMessageEvent` ... 

为了实现这一目标，我检索了很多博客，终于给我找着一个解决方案，就是本文开头给出的文章链接: [10 分钟轻松学会 Jackson 反序列化自动适配子类](https://zhuanlan.zhihu.com/p/357911357) .

## 思路

其实就是基于 SpringBoot 默认的反序列化框架 `Jackson` 实现的，具体来讲，主要有以下几步：

- 在父类上加入注解 `JsonTypeInfo` ，指定以某个字段，例如 `key` 的值决定具体适配哪个子类。

- 在子类上增加一个自定义的注解，比如可以命名为 `JsonTypeDefine` ，该注解用于注明当父类的 `key` 字段为何值时，应映射为当前子类。

- 上一步只是我们的预期效果，实际上当然不会仅仅因为我们加一个自定义的注解, Jackson 就能自动把子类和 key 字段值关联起来。因此，需要在系统初始化时，增加这样一个关联的流程。对于 SpringBoot 项目，可以定义一个 listener 用于完成该流程。

## 实现

### 预期效果

定义一个 OneBot 类，以类中的 `postType` 字段值去解析到不同子类；当该字段值为 `message` 时，解析为 `MessageEvent` ；

`MessageEvent` 同样需要继续解析，以 `messageType` 字段的值去解析到不同子类；当该字段值为 `group` 时，解析为 `GroupMessageEvent` ，当值为 `private` 时，解析为 `PrivateMessageEvent` 

### 代码

> 为了节省篇幅，只给出关键代码，如上述 [思路](#思路) 小节中提到的关键注解、部分关键字段； 其余非关键代码，如 lombok 相关注解、字段风格映射规则注解 `JsonNaming` 、非关键字段等均不会给出。

```java
import com.fasterxml.jackson.annotation.JsonTypeInfo;

// OneBotEvent
@JsonTypeInfo(use = JsonTypeInfo.Id.NAME,  // 使用子类名称来自动适配子类
              property = "postType",  // 指定配置子类型的字段为 postType
              defaultImpl = OneBotEvent.class,  // 未设置 postType 时默认的解析类型，这里设为 OneBotEvent 本身
              visible = true)  // 反序列化时 property 配置的字段是否解析出值放在结果中
public class OneBotEvent {

    /**
     * 事件类型。此处用于标注子类
     * message：消息事件
     * notice：通知事件
     * request：请求事件
     * meta_event：元事件
     */
    private String postType;
}
```

```java
// MessageEvent
@JsonTypeDefine("message")  // 当 OneBotEvent 的 postType 值为 message 时，解析为本类
@JsonTypeInfo(use = JsonTypeInfo.Id.NAME,  // 使用子类名称来自动适配子类
        property = "message_type",  // 指定配置子类型的字段为 messageType .
                                    // 这里用下划线风格是因为要采用实际上报的请求中的字段。
        defaultImpl = MessageEvent.class,  // 未设置 messageType 时默认的解析类型，这里设为 OneBotEvent 本身
        visible = true)  // 反序列化时 property 配置的字段是否解析出值放在结果中
public class MessageEvent extends OneBotEvent { ... }
```

```java
// GroupMessageEvent
@JsonTypeDefine("group")  // 当 MessageEvent 的 messageType 值为 group 时，解析为本类
public class GroupMessageEvent extends MessageEvent { ... }
```

```java
// PrivateMessageEvent
@JsonTypeDefine("private")  // 当 MessageEvent 的 messageType 值为 private 时，解析为本类
public class PrivateMessageEvent extends MessageEvent { ... }
```

```java
import com.fasterxml.jackson.annotation.JsonTypeInfo;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.jsontype.NamedType;
import org.reflections.Reflections;

// 扫描注册环节。该方法在一个 listener 中使用。
private void improveJacksonDeserialize() {
    // 定义扫描包
    String packageName = "com.yuier.yuni.common";

    Reflections reflections = new Reflections(packageName);
    /*
    * 注册子类型，使用名称建立关联
    */
    // 使用开源库 Reflections 扫描 JsonTypeInfo 定义的基类
    // 这里会扫出来 OneBotEvent 和 MessageEvent
    Set<Class<?>> types = reflections.getTypesAnnotatedWith(JsonTypeInfo.class);
    // 遍历基类
    for (Class<?> type : types) {
        // 使用开源库 Reflections 扫描子类
        Set<Class<?>> subClazzSet = (Set<Class<?>>) reflections.getSubTypesOf(type);
        if(CollectionUtils.isEmpty(subClazzSet)){
            continue;
        }
        // 遍历子类
        for (Class<?> subClazz : subClazzSet) {
            // 跳过接口和抽象类
            if(subClazz.isInterface() || Modifier.isAbstract(subClazz.getModifiers())){
                continue;
            }
            // 提取 JsonTypeDefine 注解
            JsonTypeDefine extendClassDefine = subClazz.getAnnotation(JsonTypeDefine.class);
            if (extendClassDefine == null) {
                continue;
            }
            /*
            * NamedType(Class<?> clazz, String name) 将一个类与其逻辑名称关联起来
            * ObjectMapper.registerSubtypes(NamedType... types) ~~黑魔法~~ 完成我们希望的注册效果
            */
            objectMapper.registerSubtypes(new NamedType(subClazz, extendClassDefine.value()));
        }
    }
    System.out.println("Done.");
}
```

大概就这些了。

## 效果演示

如图所示，在 Controller 层，接口入参为 OneBotEvent 类型；而实际收到请求后，该请求被自动解析为了 MessageEvent 类型。

![image.png](https://s2.loli.net/2025/04/13/nbrS78tNuO2pXyK.png)