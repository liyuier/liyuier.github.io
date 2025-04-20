---
title: OneBot 消息事件的一种持久化思路
titleTemplate: '%s - yuier'
date: 2025-04-20 18:32:52
updated: 2025-04-20 18:32:52
author: yuier
cover: 
hide: 
---

OneBot 是一种聊天机器人应用接口标准 [OneBot 11 标准](https://283375.github.io/onebot_v11_vitepress/)

<!-- more -->

省流： [持久化的需求](#持久化的需求)

## OneBot 消息事件简述

OneBot 客户端会将 QQ 消息上报至服务端，上报的数据结构被称为 “事件” 。更具体地来讲，上报消息的数据结构是 “消息事件”。上报方式有 http post 和 WebSocket 两种。

略去其他本文不关心的字段，在消息事件中，QQ 中的各种富媒体消息以请求体中的 `message` 字段提供。如果客户端支持，还有一个 `raw_message` 字段用于提供 `原始消息内容` 。

## 消息格式 —— 字符串与数组

QQ 产生的消息有多种类型，比如文本类型、图片类型、表情类型、 @ 类型等；有时一条消息中含有多个类型，比如我回复某人时，QQ 为我自动添加了 @ ；我回复时同时发送了一张图和一句话。于是我的这条消息发出后，就同时包含**回复、@、文本、图片**四种消息类型。

在 OneBot 中，上述四种类型分别产生一个 `消息段` ，4 个 `消息段` 共同组成了一条消息。

对于消息段的描述，OneBot 提供了两种方式：字符串与数组。

### 字符串格式

参见 [go-cqhttp 帮助中心: CQ 码 / CQ Code](https://docs.go-cqhttp.org/cqcode/) 。

> CQ 码是指 CQ 中特殊消息类型的文本格式, 这是它的基本语法:
> ```
> [CQ:类型,参数=值,参数=值]
> ```
>
> 例如, 下面是由一个 at 部分和一个文本部分构成的合法 CQ 消息串
> ```
> [CQ:at,qq=114514]早上好啊
> ```
>
> 例如qq号为114514的人昵称为"小明", 那么上述消息串在QQ中的渲染是这样的:
> ```
> @小明 早上好啊
> ```

观察到，对于文本消息，不进行特殊描述；只有对于其他特殊类型消息，才以 `[CQ:类型,参数=值,参数=值]` 的形式进行描述。

另外，CQ 码中，对于 `参数值` ，规定了 4 种保留字符，如果出现，需要进行转义。

| 字符 | 对应实体转义序列 |
| :--: | ---------------- |
| `&`  | `&amp;`              |
| `[`  | `&#91;`              |
| `]`  | `&#93;`              |
| `,`  | `&#44;`              |

### 数组格式

文本格式的消息段不直观，并且需要实现编解码，使用起来未免不够友好。而数组格式则更贴近实际开发需求。

对于 CQ 码的示例 `[CQ:类型,参数=值,参数=值]` ，用数组格式来表示就是：

```json
{
    "type": "类型",
    "data": {
        "参数": "值",
        "参数": "值"
    }
}
```

比如，`[CQ:at,qq=114514]早上好啊` 这条消息，用数组格式上报就是这样的：

```json
[
    {
        "type": "at",
        "data": {
            "qq": "114514",
        }
    },
    {
        "type": "text",
        "data": {
            "text": "早上好啊",
        }
    }
]
```

非常直观，非常好用。

## 持久化的需求

但是毕竟存数据库的时候不能把 json 直接存进去~~（写到这想了想好像也不是不行）~~，反正上报的时候 raw_message 字段会直接把 CQ 码报上来，有现成的持久化方案，就存这个好了。

于是，引入了需求：如何将 CQ 码反序列化为消息实体类？

其实思路倒是不难，也就力扣简单题水平，主要是需要设计一套能工作的消息实体类表示方法，在工程上有些小小的挑战。下面直接给出我的方案。

### 消息实体类设计

```java
// 消息段，定义一个父类型，所有具体类型均继承该类型
public abstract class MessageSeg<T extends MessageData> {
    // 对应消息类型
    private String type;
    // 对应数组格式中的 data 字段
    T data;
}

// data 字段，同样定义一个父类型
// 定义这个主要是为了配合消息段的定义。实际上，由于不同消息段的 data 部分参数均不同，这里的父类型不会有任何 field.
public class MessageData {

}
```

具体到实际的消息段，我将以文本消息和 @ 消息为例。

由于消息段的父类型 `MessageSeg` 已经给出了数组格式下消息段需要的 `type` 和 `data` 字段，因此子类型不需要再额外添加字段。仅需实现一些构造函数即可。重点在于各种 `data` 类。

```java
// 文本消息段
public class TextSeg extends MessageSeg<TextData> {

}

// 文本消息 data 字段
public class TextData extends MessageData {
    // 文本消息仅有一个 text 属性，保存文本字符串。
    private String text;
}
```

```java
// @ 消息段
public class AtSeg extends MessageSeg<AtData> {
    
}

// @ 消息段 data 字段
public class AtData extends MessageData {
    // 被 @ 的 QQ 号。all 表示全体成员。
    // 根据 OneBot 文档的说明，数组格式下所有 data 的字段值均为字符串类型，所以这里的 QQ 号我使用 String 类型来承接
    private String qq;
    // 被 @ 的 QQ 用户名。
    // 原版的 OneBot 标准没有这个字段，但是我使用的 LLOneBot 采用的 go-cqhttp 标准有这个字段，于是我就适配了
    private String name;
}
```

## 对 CQ 码反序列化

直接贴代码吧

```java
/**
 * 解析 CQ 码的算法
 * @param cqCode  CQ 码字符串
 * @return  解析出的消息数组
 */
private static <S extends MessageData, T extends MessageSeg<S>> ArrayList<MessageSeg<?>> parseCQToArray(String cqCode) {
    ArrayList<MessageSeg<?>> messageSegs = new ArrayList<>();
    // 遍历 CQ 码字符串
    int cqCodeLength = cqCode.length();
    T exactMessageSeg = null;
    int curIndex = 0;
    while(curIndex < cqCodeLength) {
        char curChar = cqCode.charAt(curIndex);
        // 遇到 CQ 头，开始解析消息段
        if (curChar == '[') {
            // 检查后两位是否为 CQ
            if (curIndex <= cqCodeLength - 4 &&
                cqCode.charAt(curIndex + 1) == 'C' &&
                cqCode.charAt(curIndex + 2) == 'Q' &&
                cqCode.charAt(curIndex + 3) == ':') {
                int cqHeadIndex = curIndex;
                // 解析消息段类型
                curIndex += 4;
                if (curIndex >= cqCodeLength) {
                    throw new CQSegTypeWrongException(cqCode, curIndex);
                }
                int tmpIndex = curIndex;
                // 提取消息段类型字符串
                StringBuilder messageType = new StringBuilder();
                while (cqCode.charAt(curIndex) != ',') {
                    messageType.append(cqCode.charAt(curIndex));
                    curIndex ++;
                }
                boolean canMatchValidType = false;
                // 匹配消息段类型，如果能匹配上，就进行建构
                for (MessageDataEnum dataEnum : MessageDataEnum.values()) {
                    if (messageType.toString().equals(dataEnum.toString())) {
                        canMatchValidType = true;
                        /* 实例化匹配到的消息段 */
                        // 获取子消息段实例
                        exactMessageSeg = getExactMessageSeg(String.valueOf(messageType));
                        // 解析消息 data 参数键值对
                        // 跳过逗号
                        curIndex ++;
                        if (curIndex >= cqCodeLength) {
                            throw new CQSegAttributeWrongException(cqCode, curIndex);
                        }
                        tmpIndex = curIndex;
                        // 遍历解析消息字段属性键值对
                        while (curIndex < cqCodeLength &&
                                cqCode.charAt(curIndex) != ']') {
                            // 解析键
                            StringBuilder attributeName = new StringBuilder();
                            while (curIndex < cqCodeLength &&
                                    cqCode.charAt(curIndex) != '='){
                                attributeName.append(cqCode.charAt(curIndex));
                                curIndex ++;
                            }
                            // 跳过等于号
                            curIndex ++;
                            if (curIndex >= cqCodeLength ||
                                cqCode.charAt(curIndex) == ']') {
                                throw new CQSegAttributeWrongException(cqCode, tmpIndex);
                            }
                            tmpIndex = curIndex;
                            // 解析值
                            StringBuilder attributeValue = new StringBuilder();
                            while (curIndex < cqCodeLength &&
                                    cqCode.charAt(curIndex) != ',' &&
                                    cqCode.charAt(curIndex) != ']') {
                                if (cqCode.charAt(curIndex) == '&') {
                                    /* 可能需要转义 */
                                    StringBuilder transTarget = new StringBuilder();
                                    // 检查是否可以转义
                                    Boolean canTrans = tryParseTransText(cqCode, curIndex, transTarget);
                                    if (canTrans) {
                                        // 如果可以转义，将转义后的字符加入结果，并继续遍历。
                                        attributeValue.append(transTarget);
                                        curIndex += 5;
                                        continue;
                                    }
                                }
                                attributeValue.append(cqCode.charAt(curIndex));
                                curIndex ++;
                            }
                            // 通过反射，将获取的键值对组装进消息段的 data 属性中
                            S segData = exactMessageSeg.getData();
                            Class<S> segDataClazz = (Class<S>) segData.getClass();
                            try {
                                Field attributeField = segDataClazz.getDeclaredField(StrUtil.toCamelCase(attributeName.toString()));
                                attributeField.setAccessible(true);
                                attributeField.set(segData, attributeValue.toString());
                            } catch (NoSuchFieldException | IllegalAccessException e) {
                                log.error("在 " + exactMessageSeg.getType() + " 类型下，" +
                                            "data 没有 " + attributeName +  " 属性。" +
                                            "原始 CQ 字符串：" + cqCode + " ; " +
                                            "属性开始处索引: " + tmpIndex);
                            }
                            // 如果当前索引处为 `,` , 说明当前消息段还存在参数需解析。跳过逗号。
                            if (cqCode.charAt(curIndex) == ',') {
                                curIndex ++;
                            }
                        }
                        // 建构完毕，跳出对消息段类型的匹配
                        break;
                    }
                }
                if (!canMatchValidType) {
                    throw new CQSegTypeWrongException(cqCode, tmpIndex);
                }
                // 建构完毕，此处字符应为 `]`
                if (cqCode.charAt(curIndex) != ']') {
                    throw new CQBracketNotClose(cqCode, cqHeadIndex);
                }
                // 解析出一个消息段，将其加入返回结果中
                if (exactMessageSeg != null) {
                    messageSegs.add(exactMessageSeg);
                    exactMessageSeg = null;
                    // 跳过 CQ 段的结尾 `]`
                    curIndex ++;
                }
            } else {
                throw new CQHeadWrongException(cqCode, curIndex);
            }
        } else {
            // 上文中，在遇到 CQ 头后，已经直接将对应的消息段组装了出来
            // 所以这里一定是文本消息。
            TextSeg textSeg = new TextSeg();
            textSeg.setType(MessageDataEnum.TEXT.toString());
            StringBuilder text = new StringBuilder();
            while (curIndex < cqCodeLength &&
                    cqCode.charAt(curIndex) != '[') {
                if (cqCode.charAt(curIndex) == '&') {
                    /* 可能需要转义 */
                    StringBuilder transTarget = new StringBuilder();
                    // 检查是否可以转义
                    Boolean canTrans = tryParseTransText(cqCode, curIndex, transTarget);
                    if (canTrans) {
                        // 如果可以转义，将转义后的字符加入结果，并继续遍历。
                        text.append(transTarget);
                        curIndex += 5;
                        continue;
                    }
                }
                text.append(cqCode.charAt(curIndex));
                curIndex ++;
            }
            textSeg.setData(new TextData(text.toString()));
            messageSegs.add(textSeg);
        }
    }
    return messageSegs;
}

/**
 * 尝试解析转义字符
 * @param cqCode  原始 CQ 码
 * @param curIndex  遇到 & 字符的位置
 * @param transTarget  如果能转义成功，转义结果
 * @return  是否转义成功
 */
private static Boolean tryParseTransText(String cqCode, int curIndex, StringBuilder transTarget) {
    // 如果索引不足以得到 5 字符长度的转义字符串，返回 false
    if (curIndex > cqCode.length() - 5) {
        return false;
    }
    // 获取当前位置开始的 5 个字符
    StringBuilder tmpText = new StringBuilder();
    for (int i = 0; i < 5; i ++) {
        tmpText.append(cqCode.charAt(curIndex + i));
    }
    boolean needTrans = false;
    // 直接匹配 4 种转义符
    switch (tmpText.toString()) {
        case "&amp;":
            transTarget.append("&");
            needTrans = true;
            break;
        case "&#91;":
            transTarget.append("[");
            needTrans = true;
            break;
        case "&#93;":
            transTarget.append("]");
            needTrans = true;
            break;
        case "&#44;":
            transTarget.append(",");
            needTrans = true;
            break;
        default:
            break;
    }
    return needTrans;
}

/**
 * 根据消息段类型获取确切的消息段子类
 * @param messageType  消息段类型
 * @return  初步实例化的子消息实例
 * @param <T>  MessageSeg 子类型
 */
private static <S extends MessageData, T extends MessageSeg<S>> T getExactMessageSeg(String messageType) {
    HashMap<String, T> subMessageSegMap = new HashMap<>();
    // 初始化 map

    /**
     * TODO
     * 这里有个小问题需要说明一下，整理这个 map 的工作最好在系统启动时完成，并且把这个东西放入全局数据区中，要不然每次反* 序列化都要来这么一下，实在浪费资源。我后边肯定是要优化的。
     */

    if (subMessageSegMap.isEmpty()) {
        // 获取 MessageSeg 的所有子类
        String packagePath = "com.yuier.yuni.common.domain.event.message.chain.seg";
        Reflections reflections = new Reflections(new ConfigurationBuilder().forPackages(packagePath));
        Set<Class<? extends MessageSeg>> subTypesOfMessageSeg = reflections.getSubTypesOf(MessageSeg.class);
        for (Class<? extends MessageSeg> subType : subTypesOfMessageSeg) {
            // 注册
            // 跳过接口和抽象类
            if(subType.isInterface() || Modifier.isAbstract(subType.getModifiers())){
                continue;
            }
            // 获取消息段子类上的 JsonTypeDefine 注解的值
            JsonTypeDefine typeName = subType.getAnnotation(JsonTypeDefine.class);
            String typeId = (typeName != null) ? typeName.value() : subType.getSimpleName().toLowerCase();
            if (messageType.equals(typeId)) {
                try {
                    // 实例化子类并放入 map 中
                    T subMessageSeg = (T) subType.getConstructor().newInstance();
                    subMessageSeg.setType(messageType);
                    subMessageSegMap.put(messageType, subMessageSeg);
                } catch (InstantiationException | IllegalAccessException | InvocationTargetException |
                            NoSuchMethodException e) {
                    throw new RuntimeException(e);
                }
            }
        }
    }

    return subMessageSegMap.getOrDefault(messageType, null);
}
```