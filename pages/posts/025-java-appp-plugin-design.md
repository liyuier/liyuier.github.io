---
title: Java 应用下简单插件系统的设计 - 插件代码开发与插件 jar 加载
titleTemplate: '%s - yuier'
date: 2025-12-24 11:06:02
updated: 2025-12-24 11:06:02
author: yuier
categories:
    - Java
tags:
    - Java
    - SpringBoot
    - 插件系统
cover: 
hide: 
---

## 背景

依然是我正在开发的 QQ 机器人应用。众所周知每个 QQ 机器人应用都支持插件系统，所以我也决定为我的应用实现一个插件系统。

## 简介

本文主要讲插件的开发与加载，插件管理涉及业务功能，不多作涉及。

插件加载流程主要分为以下一些步骤

1. 扫描指定路径下 jar 包
2. 解析 jar 包，加载 .class 文件
3. 解析 jar 包中与 .class 对应的元数据
4. 组装插件实例

### 项目结构与开发方式

我的项目是一个多模块的 SpringBoot 项目。其中 `application` 模块为启动类模块，其下有一个 `plugins` 目录作为插件 jar 包目录。

在项目根目录下，有一个 `plugin-repo` 目录，用于存放各个插件项目源码。

![image.png](https://s2.loli.net/2025/12/24/iuT1wBDLplVYmWf.png)

如图所示，是一个示例项目的结构。一个项目下支持多个插件类存在。每个插件类都需要在 `metadata.json` 中创建对应的 meta 描述，否则无法加载。下面是示例项目的 `metadata.json` .

```json
[
  {
    "id": "active.OhaYo",
    "name": "主动插件示例",
    "version": "0.0.1",
    "description": "定时任务插件示例，每天早上会向 bot master 问好。",
    "author": "Yuier me@yuier.com",
    "dependencies": []
  },
  {
    "id": "command.HelloCommand",
    "name": "指令插件示例",
    "version": "0.0.1",
    "description": "一个示例插件，在群聊内发送“/test”，bot 会响应 “Hello Command!”",
    "author": "Yuier me@yuier.com",
    "dependencies": []
  },
  {
    "id": "pattern.HelloPattern",
    "name": "规则插件示例",
    "version": "0.0.1",
    "description": "一个示例插件，在群聊内发送带有“你好”的消息，bot 会响应 “你好，我是 Yuni !”",
    "author": "Yuier me@yuier.com",
    "dependencies": []
  }
]
```

插件项目在 `pom.xml` 中引入机器人应用依赖，并配置构建完成后自动复制 jar 包到目标路径下

```xml
<!-- 父模块中以 dependencyManagement 引入了统一依赖管理，因此后边无需再次引入。
     直接声明 dependencies 即可 -->
<parent>
    <groupId>com.yuier.yuni</groupId>
    <artifactId>yuni3</artifactId>
    <version>0.0.1-SNAPSHOT</version>
</parent>

<!-- 模块信息 -->
<artifactId>example</artifactId>
<version>0.0.1-SNAPSHOT</version>
<name>example</name>
<description>yuni-example</description>

<dependencies>

    <!-- 引入其他子模块 -->
    <dependency>
        <groupId>com.yuier.yuni</groupId>
        <artifactId>yuni-plugin</artifactId>
        <version>0.0.1-SNAPSHOT</version>
    </dependency>

</dependencies>

<build>
    <plugins>
        <!-- 将构建结果输出到 application 目录下-->
        <plugin>
            <groupId>org.apache.maven.plugins</groupId>
            <artifactId>maven-dependency-plugin</artifactId>
            <executions>
                <execution>
                    <id>copy-plugin-jar</id>
                    <phase>package</phase>
                    <goals>
                        <goal>copy</goal>
                    </goals>
                    <configuration>
                        <artifactItems>
                            <artifactItem>
                                <groupId>${project.groupId}</groupId>
                                <artifactId>${project.artifactId}</artifactId>
                                <version>${project.version}</version>
                                <outputDirectory>../../yuni-application/plugins</outputDirectory>
                            </artifactItem>
                        </artifactItems>
                    </configuration>
                </execution>
            </executions>
        </plugin>
    </plugins>
</build>
```

## 插件加载流程

### 扫描 jar 包

```java
public File[] loadPluginJars(String pluginDirectoryPath) {
    File pluginDir = new File(pluginDirectoryPath);

    if (!pluginDir.exists() || !pluginDir.isDirectory()) {
        log.warn("插件目录不存在: {}", pluginDirectoryPath);
        return new File[] {};
    }

    // 使用 FilenameFilter 过滤 jar 包
    File[] jarFiles = pluginDir.listFiles((dir, name) -> name.endsWith(".jar"));
    if (jarFiles == null) {
        log.warn("插件目录为空: {}", pluginDirectoryPath);
        return new File[] {};
    }
    return jarFiles;
}
```

### 解析元数据

```java
/**
 * 批量解析插件元数据
 * 由于插件系统支持一个项目中创建多个插件类，因此这个方法需要返回一个元数据列表
 * @param jarFile  包含插件的 jar 包
 * @return  插件元数据列表
 * @throws Exception  异常
 */
public List<PluginMetadata> parseAll(File jarFile) throws Exception {
    // 使用 try-with-resources 确保 JAR 文件被正确关闭
    try (JarFile jar = new JarFile(jarFile)) {
        // 从 JAR 文件中获取元数据文件
        JarEntry metadataEntry = (JarEntry) jar.getEntry("metadata.json");
        if (metadataEntry == null) {
            throw new IllegalArgumentException("metadata.json not found in JAR: " + jarFile.getName());
        }

        // 读取元数据文件，反序列化为 PluginMetadata 对象
        try (InputStream is = jar.getInputStream(metadataEntry)) {
            try {
                PluginMetadata[] dataArr = objectMapper.readValue(is, PluginMetadata[].class);
                return List.of(dataArr);
            } catch (Exception e) {
                // 如果无法解析为数组，尝试解析为单个对象
                is.close();  // 关闭当前流
                try (InputStream is2 = jar.getInputStream(metadataEntry)) {  // 重新打开流  /* 圈复杂度爆表 */
                    PluginMetadata singleResult = objectMapper.readValue(is2, PluginMetadata.class);
                    return List.of(singleResult);
                }
            }
        }
    }
}
```

### 加载插件类

```java
// 自定义一个类加载器
public PluginClassLoader create(File jarFile) throws MalformedURLException {
    URL jarUrl = null;
    try {
        // 将 jar 包转换为 URL ，供 URLClassLoader 类加载器加载
        jarUrl = jarFile.toURI().toURL();
    } catch (MalformedURLException e) {
        throw new RuntimeException(e);
    }
    return new PluginClassLoader(new URL[]{jarUrl},  // 指定 jar 包
            Thread.currentThread().getContextClassLoader());  // 指定父类加载器，使用当前线程的上下文类加载器，确保可以访问到 Spring 容器中的类
}

/**
 * 扫描 jar 包，使用自定义类加载器加载插件类
 * 遍历 JAR 包中的所有 .class 文件，找出符合插件规范的类
 * @param jarFile JAR 文件
 * @param classLoader 类加载器
 * @return 插件类列表
 * @throws Exception 扫描过程中发生的异常
 */
private List<Class<?>> scanPluginClasses(File jarFile, PluginClassLoader classLoader) throws Exception {
    List<Class<?>> pluginClasses = new ArrayList<>();
    try (JarFile jar = new JarFile(jarFile)) {
        // 遍历 JAR 包中的所有文件
        Enumeration<JarEntry> entries = jar.entries();
        while (entries.hasMoreElements()) {
            JarEntry entry = entries.nextElement();
            // 检查是否为 .class 文件
            if (entry.getName().endsWith(".class")) {
                String className = entry.getName()
                        .substring(0, entry.getName().length() - 6)  // 移除 .class 后缀
                        .replace('/', '.');  // 将路径分割符替换为 .

                // 加载类并检查是否为插件
                Class<?> clazz = classLoader.loadClass(className);
                if (isPluginClass(clazz)) {
                    pluginClasses.add(clazz);
                }
            }
        }
    }
    return pluginClasses;
}
```

### 组装插件实例

```java
/**
 * 创建插件实例
 * 使用上面解析出的元数据和加载的插件类组装
 * @param pluginClass      插件类
 * @param metadataList     元数据类列表
 * @param pluginModuleName 插件模块名
 * @return 插件实例
 * @throws Exception 异常
 */
private PluginInstance createPluginInstance(Class<?> pluginClass, List<PluginMetadata> metadataList, String pluginModuleName) throws Exception {
    String pluginClassName = pluginClass.getName();
    // 遍历元数据列表，寻找与插件类相匹配的元数据
    for (PluginMetadata pluginMetadata : metadataList) {
        if (pluginClassName.equals(pluginMetadata.getId())) {
            return createPluginInstance(pluginClass, pluginMetadata);
        }
    }
    throw new RuntimeException("Plugin " + pluginClassName + " 没有找到与之对应的元数据配置！");
}

/**
 * 创建插件实例
 * @param pluginClass  插件类
 * @param metadata  元数据类
 * @return  插件实例
 * @throws Exception  异常
 */
private PluginInstance createPluginInstance(Class<?> pluginClass, PluginMetadata metadata) throws Exception {
    // 实例化插件
    YuniPlugin plugin = (YuniPlugin) pluginClass.getDeclaredConstructor().newInstance();

    if (plugin instanceof ScheduledPlugin) {
        // 组装一个携带一些业务相关字段的 pluginInstance，具体细节不赘述
        return createActivePluginInstance((ScheduledPlugin) plugin, metadata);
    } else if (plugin instanceof PassivePlugin) {
        // 同上
        return createPassivePluginInstance((PassivePlugin<?, ?>) plugin, metadata);
    } else {
        throw new IllegalArgumentException("Unknown plugin type: " + pluginClass.getName());
    }
}
```

### 插件注册

```java
// 拿到 assembleFromJar 方法组装出的插件实例列表，进行业务相关的注册操作，实际上就是放到一个大 Map 里，不作赘述
List<PluginInstance> pluginInstances = pluginInstanceAssembler.assembleFromJar(jarFile);
registerPluginInstances(pluginInstances);
```

## 效果

首先看一下启动时的命令行回显

![image.png](https://s2.loli.net/2025/12/24/gc4f15GADUNmnYL.png)

然后是插件功能演示

![image.png](https://s2.loli.net/2025/12/24/iEhMABlG1pfjTHX.png)

![image.png](https://s2.loli.net/2025/12/24/LCSAMVfqt9p7adF.png)

## 后话

