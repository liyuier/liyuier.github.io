---
title: JVM 类加载流程
titleTemplate: '%s - yuier'
date: 2025-11-12 18:23:33
updated: 2025-11-12 18:23:33
author: yuier
categories:
    - JVM
tags:
    - JVM
    - Java
    - 八股文
cover: 
hide: index
---

* 加载
* 验证
* 准备
* 解析
* 初始化

<!-- more -->

## 加载

* 获取二进制字节流

    通过类的全限定名（如 java.lang.string）获取其二进制字节流，通常来自 `.class` 文件，也可以是网络、数据库等

* 将字节流转换为运行时数据结构

    将字节流解析为内部表示，并存入方法区 —— JDK 8+ 为Metaspace

    * 类的元信息（类名、父类、接口列表）
    * 字段表（Field Info）
    * 方法表（Method Info），包括字节码
    * 常量池（Constant Pool）
    * 访问标志（public、final、abstract 等）
    * 静态变量的声明（但不赋值，赋值在“准备”阶段）

    这些数据结构在 JVM 内部使用，Java 程序只可以通过反射间接访问

* 创建代表该类的对象

    在堆中创建一个该类的 `Class<?>` 实例，该实例也是反射的入口

    ```java
    Class<String> clazz = String.class;
    Method[] methods = clazz.getMethods(); // 通过 Class 对象访问元数据
    ```

    另外，该 `Class` 对象的引用也会存入方法区中，与类元数据一起

总结，`Class` 对象本身在堆中，但其类元数据在方法区。

加载阶段的本质是：把类的字节码变成 JVM 内部可识别的结构，并提供一个 Class 对象供程序使用。

## 验证

确保字节码符合 JVM 规范

* 文件格式验证

    魔数是否正确；版本号是否当前 JVM 支持；访问标志是否合理，字段、方法等结构是否完整
    这是**唯一基于字节流的验证**，后续阶段都基于 JVM 内部数据结构，即方法区中的元信息
    会抛出 `java.lang.ClassFormatError`

* 元数据验证

    **对字节码描述的语义进行分析，确保其符合 Java 语言规范**

    是否有父类、是否继承了被 final 修饰的类；非抽象类是否实现了所有接口方法、方法重写是否合法；字段、方法名是否与父类冲突、抽象类是否包含抽象方法等

    本质是对类的“静态结构”进行语义校验，类似于编译器在编译期做的检查，但 JVM 必须再次确认（因为字节码可能被篡改）。

* 字节码验证

    最复杂，最关键的一步，通过数据流和控制流分析，**确保字节码运行时不会破坏 JVM 的状态**

    操作数栈是否溢出、跳转指令是否指向合法的字节码位置、方法调用的参数数量和类型是否匹配、类型转换是否安全、返回类型是否与方法声明一致、局部变量表访问是否越界、对象使用前是否已初始化。。。。

    通过模拟执行字节码来验证

    可能抛出 `java.lang.VerifyError`

* 符号引用验证

    确保解析阶段能正确完成，即类、方法、字段等符号引用真实存在且可访问

    可能抛出 `java.lang.NoSuchFieldError`、`java.lang.NoSuchMethodError`、`java.lang.IllegalAccessError` 等

## 准备

为类变量（static 变量）分配内存并设置初始值，这里不是程序中定义的初始值，而是类型的默认零值，如

```java
public static int value = 123;
```

在准备阶段，value 会被赋值为 0，而非 123；真正的赋值在最后的初始化阶段

另外，final static 基本类型或 string 常量由于被放入常量池，因此在准备阶段会直接赋值为程序指定的值。

## 解析

将常量池中的符号引用替换为直接引用。

* 符号引用是以一组符号描述目标，如类名、方法名、字段名等，与内存布局无关，存在于 Class 文件的常量池中

* 直接引用时指向目标的指针、偏移量、句柄等，与 JVM 内存布局相关，可以直接定位到目标在内存中的位置

主要有以下一些类型：

| 引用类型        | 解析内容                                             | 示例                                          |
|-------------|--------------------------------------------------|---------------------------------------------|
| 类或接口        | 将 CONSTANT_Class_info 解析为方法区中对应的 Klass* 指针       | new ArrayList<>() → 解析 java/util/ArrayList  |
| 字段          | 将 CONSTANT_Fieldref_info 解析为字段在对象中的偏移量           | obj.name → 找到 name 在 obj 实例中的内存位置           |
| 类方法（静态方法）   | 将 CONSTANT_Methodref_info（指向 static 方法）解析为方法入口地址 | System.currentTimeMillis()                  |
| 接口方法        | 将 CONSTANT_InterfaceMethodref_info 解析为接口方法表中的条目  | List.size()                                 |
| 方法类型 & 方法句柄 | JDK 7+ 支持 invokedynamic，用于 Lambda、反射优化等          | Lambda 表达式底层实现                              |

## 初始化

执行类构造器中的 `<clinit>()` 方法，真正执行 Java 代码。

`<clinit>()` 由编译器自动生成，包括：

* 所有 `静态变量的显式赋值语句`

* 所有 `静态代码块（static {}）` 中的语句

初始化顺序：

* 父类先于子类初始化；

* 静态变量和静态代码块按源码顺序执行。

可能抛出 `ExceptionInInitializerError`