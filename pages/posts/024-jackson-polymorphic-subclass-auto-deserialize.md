---
title: Jackson 对于多态子类的自动反序列化 
titleTemplate: '%s - yuier'
date: 2025-12-24 02:16:28
updated: 2025-12-24 02:16:28
author: yuier
categories:
    - Java
tags:
    - Jackson
    - Java
    - SpringBoot
cover: 
hide: 
---

我正在开发一款 QQ 机器人应用程序。作为后台服务，它与前台客户端通信使用的是 [OneBot](https://283375.github.io/onebot_v11_vitepress/) 协议。

OneBot 协议客户端上报 QQ 事件的方式非常怪异，给我的开发造成很大困扰。

<!-- more -->

## 背景

[事件](https://283375.github.io/onebot_v11_vitepress/event/index.html) 是 OneBot 对于上报内容的统称，有四种分类：

* 消息事件

* 通知事件

* 请求事件

* 元事件

不同的事件上报的路径完全相同，用于区分不同事件的方式是某个关键字段的值。

![image.png](https://s2.loli.net/2025/12/24/viLek3xSQKfagmA.png)

不同的事件仅共享部分字段，而根据字段值的不同，又在其后拥有自己独有的字段。事件下还有子事件，子事件的也采用这种区分方式。

## 问题

我使用的是 SpringBoot 作为开发应用的框架，它会对收到的请求自动进行反序列化，并注入 Controller 层的方法参数中。

但是由于 OneBot 不友好的协议设计，导致原生 SpringBoot 无法自动将上报事件映射为各子实体类，于是我强迫症犯了，必须要找到一个方法完美解决这个问题

## 解决

检索许久，在网上查找到这样一份博客 [10 分钟轻松学会 Jackson 反序列化自动适配子类](https://zhuanlan.zhihu.com/p/357911357)，看起来符合我的要求。

简单说就是用 JsonTypeInfo 标识基类以定义映射子类的原则；然后用一个自定义注解标识子类；应用启动时自动扫描标注了自定义注解的子类，将其与父类的映射关系注册到 ObjectMapper 中，Jackson 在反序列化时便可以自动 “找到” 子类

## 代码

我让 AI 根据这个思路写了一份代码，注释如下。关键方法分别为 `performScan()` 与 `applyTo()` 。前者执行扫描工作，并将父、子类的映射关系保存到自身缓存中；后者提供一个外部接口，用于配置类提供 `ObjectMapper` 时将扫描结果注册进去。

```java
@Component
@Slf4j
public class PolymorphicRegistrationProcessor {

    // 存储基类与其所有子类的映射关系
    private final Map<Class<?>, Set<Class<?>>> polymorphicMappings = new ConcurrentHashMap<>();
    private final Map<Class<?>, String> typeNameMap = new ConcurrentHashMap<>();

    private volatile boolean initialized = false;

    public PolymorphicRegistrationProcessor() {
        // 预注册基类
        registerPolymorphicBaseClass(OneBotEvent.class);
        registerPolymorphicBaseClass(MessageSegment.class);
    }

    /**
     * 注册基类
     * @param baseClass
     */
    public void registerPolymorphicBaseClass(Class<?> baseClass) {
        polymorphicMappings.putIfAbsent(baseClass, new HashSet<>());
    }

    /**
     * 注册子类到指定基类
     * @param baseClass 基类
     * @param subType 子类
     */
    public void registerSubType(Class<?> baseClass, Class<?> subType) {
        // 确保基类在映射表中存在，然后添加子类
        polymorphicMappings.computeIfAbsent(baseClass, k -> new HashSet<>())
                .add(subType);
    }

    /**
     * 初始化
     */
    public void initializeIfNeeded() {
        if (initialized) return;

        try {
            performScan();
            initialized = true;
            log.info("Polymorphic types registered.");
        } catch (Exception e) {
            throw new RuntimeException("Failed to initialize polymorphic types", e);
        }
    }

    /**
     * 核心：执行包扫描并注册多态类型到缓存中
     * 1. 使用 Spring 扫描器查找所有带 @PolymorphicSubType 注解的类
     * 2. 解析注解中的类型名称（或自动推断）
     * 3. 确定子类的基类（通过父类是否包含 @JsonTypeInfo）
     * 4. 将子类注册到基类的映射表中
     */
    private void performScan() throws Exception {
        // 很难想象这个类的命名人的心理状态
        ClassPathScanningCandidateComponentProvider scanner =
                new ClassPathScanningCandidateComponentProvider(false);

        // 规定扫描对象为携带了 @PolymorphicSubType 注解的类
        scanner.addIncludeFilter(new AnnotationTypeFilter(PolymorphicSubType.class));

        // 扫描路径
        String packageToScan = "com.yuier.yuni.core";
        // 执行扫描
        java.util.Set<org.springframework.beans.factory.config.BeanDefinition> candidates =
                scanner.findCandidateComponents(packageToScan);

        // 遍历所有候选类
        for (org.springframework.beans.factory.config.BeanDefinition candidate : candidates) {
            String className = candidate.getBeanClassName();

            try {
                Class<?> clazz = Class.forName(className);
                PolymorphicSubType annotation = clazz.getAnnotation(PolymorphicSubType.class);

                // 从注解获取子类的类型名称。在本应用案例中，这个名称会在父类的关键字段的值中体现
                String typeName = annotation.value();
                if (typeName == null || typeName.trim().isEmpty()) {
                    typeName = inferTypeName(clazz);  // 如果子类注解中没有提供本子类的名称，则使用自动推断
                }
                typeNameMap.put(clazz, typeName);

                // 查找子类打了 @JsonTypeInfo 注解的基类
                Class<?> baseClass = findPolymorphicBaseClass(clazz);
                if (baseClass != null) {
                    // 注册到缓存中
                    registerSubType(baseClass, clazz);
                }
            } catch (Exception e) {
                System.err.println("处理类失败: " + className);
                e.printStackTrace();
            }
        }
    }

    /**
     * 提供给外部的接口，供应用启动时注册 ObjectMapper 使用
     * @param mapper ObjectMapper
     */
    public void applyTo(ObjectMapper mapper) {
        initializeIfNeeded(); // 确保完成初始化

        // 遍历所有缓存中的映射
        for (Map.Entry<Class<?>, Set<Class<?>>> entry : polymorphicMappings.entrySet()) {
            Set<Class<?>> subTypes = entry.getValue();

            // 为每个子类生成 NamedType
            List<NamedType> namedTypes = subTypes.stream()
                    .map(clazz -> new NamedType(clazz, typeNameMap.getOrDefault(clazz, inferTypeName(clazz))))
                    .toList();

            if (!namedTypes.isEmpty()) {
                mapper.registerSubtypes(namedTypes.toArray(new NamedType[0]));
            }
        }
    }

    /**
     * 自动推断类型名称（用于JSON序列化标识）
     * 规则：
     * 1. 类名以 "Event" 结尾 → 去掉 "Event" 后转小写（如 MessageEvent → message）
     * 2. 类名以 "Segment" 结尾 → 去掉 "Segment" 后转小写（如 ImageSegment → image）
     * 3. 其他情况 → 直接转小写
     * @param clazz 类
     * @return 类型名称
     */
    private String inferTypeName(Class<?> clazz) {
        String simpleName = clazz.getSimpleName();
        if (simpleName.endsWith("Event")) {
            return lowerFirst(simpleName.substring(0, simpleName.length() - 5));
        } else if (simpleName.endsWith("Segment")) {
            return lowerFirst(simpleName.substring(0, simpleName.length() - 7));
        }
        return lowerFirst(simpleName);
    }

    private String lowerFirst(String str) {
        if (str == null || str.isEmpty()) return str;
        return Character.toLowerCase(str.charAt(0)) + str.substring(1);
    }

    /**
     * 递归查找子类的基类
     * 逻辑：
     * 1. 从子类开始向上遍历父类链
     * 2. 遇到第一个包含 @JsonTypeInfo 注解的父类即为基类
     * @param subType 子类
     * @return 基类
     */
    private Class<?> findPolymorphicBaseClass(Class<?> subType) {
        Class<?> current = subType.getSuperclass();
        while (current != null && current != Object.class) {
            if (current.isAnnotationPresent(com.fasterxml.jackson.annotation.JsonTypeInfo.class)) {
                return current;
            }
            current = current.getSuperclass();
        }
        return null;
    }

    public Set<Class<?>> getSubTypes(Class<?> baseClass) {
        return polymorphicMappings.getOrDefault(baseClass, Collections.emptySet());
    }
}
```

其他相关代码

```java
// 配置类，用于提供 ObjectMapper
@Configuration
public class JacksonConfig {

    @Autowired
    private final PolymorphicRegistrationProcessor registrationProcessor;

    @Bean
    public ObjectMapper objectMapper() {
        ObjectMapper mapper = new ObjectMapper();
        // 对于实体类中未定义的字段不进行反序列化
        mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
        // 反序列化时下划线风格转驼峰风格
        mapper.setPropertyNamingStrategy(PropertyNamingStrategies.SNAKE_CASE);

        registrationProcessor.applyTo(mapper);
        return mapper;
    }
}
```

```java
// 父类上添加的注解
@JsonTypeInfo(
        use = JsonTypeInfo.Id.NAME,  // 指定类型标识的生成方式为类的简短名称
        include = JsonTypeInfo.As.EXISTING_PROPERTY,  // 类型信息已经存在于 json 中，Jackson 无需额外添加
        property = "post_type",  // 存储类型信息的关键字段
        visible = true  // 反序列化后的结果显示关键字段，即此处的 postType 字段
)
public class OneBotEvent {

}
```

```java
// 子类只需要添加一个自定义注解即可
@PolymorphicSubType
public class MessageEvent extends OneBotEvent {
    
}
```