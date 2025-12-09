---
title: 多线程基础
titleTemplate: '%s - yuier'
date: 2025-12-09 18:06:12
updated: 2025-12-09 18:06:12
author: yuier
categories:
    - 并发编程
tags:
    - 并发编程
    - 多线程
    - Java
    - 八股文
cover: 
hide: index
---

## 线程的概念

线程是操作系统能够进行运算调度的最小单位，被包含在进程中，是进程中的一个执行实体或控制流

* 一个进程可以包含多个线程，它们共享进程的资源

* 每个线程拥有独立的栈、程序计数器、寄存器

* 线程之间可以并发执行

| 对比维度    | 进程（Process）           | 线程（Thread）         |
|---------|-----------------------|--------------------|
| 资源拥有    | 拥有独立的地址空间和系统资源        | 共享所属进程的资源          |
| 调度单位    | 是资源分配单位               | 是 CPU 调度的基本单位      |
| 创建/切换开销 | 开销大                   | 开销小（只需创建栈和寄存器上下文）  |
| 通信方式    | 需要 IPC（管道、消息队列、共享内存等） | 可直接读写共享内存（需同步机制）   |
| 稳定性/安全性 | 相互隔离，更安全              | 一个线程崩溃可能导致整个进程崩溃   |
| 并发性     | 进程间并发                 | 线程间并发（更轻量、高效）      |

### 私有与共享的资源

私有资源：

* 线程栈：储存局部变量、函数参数、范围地址等，栈溢出只影响该线程

* 程序计数器：当前线程正在执行的指令地址

* 寄存器集合：通用寄存器、状态寄存器等。线程切换时需要保存/恢复这些寄存器状态

* 局部存储

* 线程 ID

共享资源

* 代码段：程序的可执行指令

* 数据段：全局变量、静态变量

* 堆：动态分配的内存

* 文件描述符、句柄

## 使用线程可能遇到的问题

### 上下文切换

当操作系统在多个线程之间切换执行权时，需要保存当前线程的 CPU 状态（寄存器、程序计数器、栈指针等），并恢复下一个线程的状态。

* 性能损耗：频繁切换会消耗 CPU 时间，尤其在线程数量远超 CPU 核心数时（如成百上千线程争抢少量核心）。

* 缓存失效（Cache Thrashing）：不同线程访问不同内存区域，导致 CPU 缓存频繁失效，降低内存访问效率。

* 调度延迟：高并发下调度器负担加重，可能影响实时性或响应时间。

如何减少上下文并发：

* 无锁并发

* CAS 算法

* 协程

### 线程创建与销毁的开销

* 创建线程的成本高

    * 需分配内核数据结构、初始化栈、设置寄存器状态等

    * 创建新线程涉及系统调用

    * 相比进程轻量，但仍比函数或协程重得多

* 频繁创建/销毁的问题

    * 内存碎片

    * 系统资源耗尽风险

    * 性能波动大

解决方法：使用线程池复用线程，避免重复创建/销毁

### 死锁

产生条件

* 互斥

* 占有并等待

* 不可抢占

* 循环等待

避免死锁

* 避免一个线程同时获取多个锁

* 避免一个线程在锁内同时占用多个资源

* 尝试使用定时锁

* 加锁和解锁必须在一个数据库连接里

### 资源限制

* 硬件资源限制

* 软件资源限制

引发问题

* 线程创建失败

* 性能下降

如何解决

* 线程池

* 减小线程栈大小

在资源受限情况下进行并发编程

* 使用异步 IO 或协程

* 固定大小线程池，与 CPU 核心数量相近

## 线程状态及切换

Java 中线程存在六种状态

![image.png](https://s2.loli.net/2025/12/07/7Dg3bTPmXuKlGvQ.png)

* NEW

    线程已创建，但未调用 start()

* RUNNABLE

    线程正在 JVM 中执行（可能在 CPU 上运行，也可能在等待 OS 调度）

* BLOCKED

    线程等待获取 monitor 锁（即 synchronized 锁）

* WAITING

    线程无限期等待其他线程显式唤醒

* TIMED_WAITING

    线程等待有超时时间的操作

* TERMINATED
    
    线程执行结束

### 一些函数的区别

* wait

    必须在 synchronized 方法块内调用
    
    使当前线程释放对象的 monitor 锁，进入等待队列

    等待其他线程调用同一对象的 notify 或 notifyall

* sleep

    使当前线程暂停指定毫秒数

    不释放任何锁

* hoin

    当前线程等待目标线程指定完毕

    底层通过 wait 实现

* yield

    当前线程愿意让出 CPU，给其他同优先级或更高优先级的线程运行

    不保证一定让出

    不阻塞线程，状态仍是 RUNNABLE

## 线程的启动、中断、终止

### 启动

使用 `start()` 方法

```java
Thread t = new Thread(() -> {
    System.out.println("线程正在运行");
});
t.start(); // ✅ 正确：启动新线程，JVM 调用 run()
```

* JVM 创建一个新的执行线程

* 该线程进入 RUNNABLE 状态（可能立即运行，也可能等待 CPU）

* 自动调用 run() 方法

注意

* 一个线程只能启动一次。再次调用 start() 会抛出 IllegalThreadStateException

* 线程启动后，其生命周期由 JVM 和操作系统共同管理

### 中断

Java 不支持强制终止线程，而是采用 `协作式中断机制` : 通过设置中断标志，由线程自行决定如何响应

| 方法                     | 作用                                      |
|------------------------|-----------------------------------------|
| thread.interrupt()     | 设置目标线程的中断标志位为 true                      |
| Thread.interrupted()   | 静态方法：检查当前线程是否被中断，并清除中断状态（返回后标志变 false）  |
| thread.isInterrupted() | 实例方法：检查该线程是否被中断，不清除状态                   |

### 终止

Java 没有提供安全的强制终止方法，而是提供了自然终止、协作中断等

* 自然终止：任务执行完毕自然终止

* 通过中断请求退出

    ```java
    public class Worker extends Thread {
        @Override
        public void run() {
            while (!Thread.currentThread().isInterrupted()) {
                try {
                    // 模拟工作
                    Thread.sleep(100);
                } catch (InterruptedException e) {
                    // 收到中断，退出
                    Thread.currentThread().interrupt(); // 恢复状态
                    break;
                }
            }
            // 清理资源
            cleanup();
        }
    }

    // 外部请求终止
    Worker w = new Worker();
    w.start();
    // ...
    w.interrupt(); // 请求中断
    ```

* 使用 volatile 标志位 适用于无阻塞循环

    ```java
    public class Task implements Runnable {
        private volatile boolean running = true;

        public void stop() {
            running = false;
        }

        @Override
        public void run() {
            while (running) {
                // 工作
            }
        }
    }
    ```

## 线程间的通信

多个线程通过共享内存实现信息交换，但需解决以下问题

* 可见性

    线程修改变量后其他线程能否立即感知

* 原子性

    操作是否不可分割，避免数据不一致

* 有序性

    代码执行顺序是否符合预期

### volatile 关键字

核心特性

* 可见性保证：所有线程直接访问共享内存中的变量值，而非本地缓存

    * 写操作：强制将修改后的值刷新到主内存

    * 读操作：强制从主内存读取最新值

* 禁止指令重排序

使用限制：

不保证原子性，仅适用于单次读/写操作，无法处理复合操作

典型场景

* 状态标志

* 配合 CAS 操作实现无锁并发

### synchronized 关键字

核心特性

* 原子性、排他性：同一时刻只允许一个线程进入同步代码

* 隐式锁机制：通过锁对象实现同步（锁粒度可以是实例对象、Class 对象或自定义对象）

* 可见性保证：线程退出同步代码时，修改的变量值强制刷新到主内存

------------

下述代码是实现线程安全的单例模式的经典写法，被称为 `双重检查锁定`

```java
public class Singleton {
    private static volatile Singleton instance; // ① volatile 关键字很重要！

    public static Singleton getInstance() {
        if (instance == null) { // ② 第一次检查：避免不必要的同步
            synchronized (Singleton.class) { // ③ 同步块，确保原子性
                if (instance == null) { // ④ 第二次检查：防止重复创建
                    instance = new Singleton(); // ⑤ 创建实例
                }
            }
        }
        return instance;
    }
}
```

### 等待/通知机制

通过 Object 类的 wait 、 notify 、 notiyall 方法实现的多线程协作模式

本质：基于共享对象的状态协调，一个线程通过释放锁进入等待状态，另一线程通过锁通知唤醒等待线程

| 方法            | 描述                                              | 使用条件                    |
|---------------|-------------------------------------------------|-------------------------|
| `wait()`      | 释放对象锁，当前线程进入等待队列（WAITING），直到其他线程通知或中断           | 必须在同步块（synchronized）内调用 |
| `notify()`    | 随机唤醒对象等待队列中的一个线程，将其移到锁的同步队列（BLOCKED），等待获取锁后恢复执行 | 同一对象锁的持有者调用             |
| `notifyAll()` | 唤醒对象等待队列中的所有线程，全部移到同步队列                         | 同一对象锁的持有者调用             |

```java
// 等待方（消费者）
synchronized (lock) {
    while (condition) {  // 循环防止虚假唤醒
        lock.wait();
    }
    // 执行操作
}

// 通知方（生产者）
synchronized (lock) {
    // 修改条件
    lock.notify();  // 或 notifyAll()
}
```

虚假唤醒：一个线程在没有被其他线程显式调用 notify() 或 notifyAll() 的情况下，从 wait() 方法中意外返回的现象

### thread.join

让当前线程等待另一个线程执行完毕后再继续执行

```java
thread.join(); // 阻塞当前线程，直到 thread 执行结束
```

* 永久等待，直到目标线程自然终止（或被中断）；

* 如果目标线程已经结束，则立即返回。

本质是通过对象的等待/通知机制和锁的同步控制实现的

核心逻辑：当前线程获取目标线程对象的锁，并在循环中调用 wait() ，直到目标线程终止

```java
public final synchronized void join() throws InterruptedException {
    // 目标线程存活时持续等待
    while (isAlive()) {
        wait(0);  // 调用当前 Thread 对象的 wait()
    }
}
```

关键步骤

* 加锁

    synchronized 修饰的 join 方法获取目标线程对象的锁

* 循环检查存活状态

    * 若目标线程尚未终止 (isAlive() 为 true) ，当前线程调用 wait(0) 释放锁，并进入等待状态

    * 若目标线程终止，wait(0) 退出循环，join() 方法返回

* 异步通知

    目标线程结束时，JVM 内部自动调用其线程对象的 notifyAll() ，唤醒所有等待在该线程对象上的线程

## Daemon 线程

## ThreadLocal

ThreadLocal 是 Java 中实现线程局部变量的工具类。

```java
// 存
threadLocalValue.set(`要保存的对象`)

// 取
`查看` = threadLocalValue.get();
```

底层实现

* 每个 Thread 对象持有一个 ThreadLocal.ThreadLocalMap

* 该 Map 的 key 是 ThreadLocal 的弱引用

* value 是强引用

风险：当 ThreadLocal 实例被回收（key → null），但线程长期存活（如线程池），value 无法被 GC，导致内存泄漏。

正确做法：用完务必调用 remove()


## daemon 线程

守护线程，为其他线程提供服务，依附于用户线程。不影响 JVM 退出。