---
title: 基于 OkHttp 的 WebSocket 客户端封装
titleTemplate: '%s - yuier'
date: 2026-01-01 00:13:20
updated: 2026-01-01 00:13:20
author: yuier
categories:
    - WebSocket
tags:
    - WebSocket
    - OkHttp
    - Java
cover: 
hide: 
---

## 背景

OneBot 协议中定义了 OneBot 客户端与 bot 应用之间两种通信方式，分别为 HTTP 通信与 WebSocket 通信，具体到我当前正在开发的 [Yuni3](https://github.com/liyuier/Yuni3) 项目中，为两种方法都作了适配。

目前为了 OneBot 客户端稳定性的需求，采用了云端 docker 部署 NapCat 的方式；又为了方便开发，采用本地运行 Yuni3 项目的方式，所以这种情况下不太方便由 bot 应用接收 OneBot 客户端的 HTTP POST 请求。于是封装了一下 OkHttp ，做了一个特化于我的项目的 WebSocket 客户端。

## 思路

我的 Yuni3 是基于 SpringBoot 的，本来想之间用 SpringBoot 集成的解决方案，但是感觉太重，也不够自由，于是就采用了 OkHttp 方案。

看一下使用 OkHttp 启动 WebSocket 连接的最简示例

```java
OkHttpClient client = new OkHttpClient();
Request request = new Request.Builder()
    .url(url)
    .build();
WebSocket webSocket = client.newWebSocket(request, new WebSocketListener() {
    // 连接建立成功的回调函数
    @Override
    public void onOpen(WebSocket webSocket, okhttp3.Response response) {
        System.out.println("连接已建立");
        webSocket.send("Hello Server!");
    }

    // 连接收到对端文本消息的回调函数
    @Override
    public void onMessage(WebSocket webSocket, String text) {
        System.out.println("收到消息: " + text);
    }

    // 连接上发生错误的回调函数
    @Override
    public void onFailure(WebSocket webSocket, Throwable t, okhttp3.Response response) {
        System.err.println("连接失败: " + t.getMessage());
    }
});
```

## 代码

### 包装监听器，使用代理处理回调

先包装一下监听器，使用一个代理监听器用于处理回调函数，方便动态传入处理方式

```java
public class YuniWebSocketListener extends WebSocketListener {

    // 监听器代理
    private YuniBusinessProxyListener proxyListener;

    /**
     * 从服务器接收到文本消息
     * @param webSocket  当前的 WebSocket 连接对象
     * @param text  接收到的文本消息内容
     */
    @Override
    public void onMessage(@NotNull WebSocket webSocket, @NotNull String text) {
        log.debug("[YuniWebSocketListener.onMessage]收到文本消息: {}", text);
        // 使用代理处理回调函数
        proxyListener.onMessage(webSocket, text);
    }

    /**
     * WebSocket 连接成功
     * @param webSocket  已经建立的 WebSocket 连接对象，可以通过该对象发送消息或关闭连接
     * @param response  服务器返回的 HTTP 响应，通常包含握手成功的信息
     */
    @Override
    public void onOpen(@NotNull WebSocket webSocket, @NotNull Response response) {
        log.debug("[YuniWebSocketListener.onOpen]连接成功，服务器响应: {}", response);
        // 使用代理处理回调函数
        proxyListener.onOpen(webSocket, response);
    }

    //// 其它回调函数同理，略
}
```

### 包装连接器，管理单条连接

然后再包装一个 connector ，用于管理单条连接

```java
public class YuniWebSocketConnector {

    // 持有启动连接所需的对象
    private OkHttpClient client;
    private Request request;
    private YuniWebSocketListener listener;

    // 连接对象
    private WebSocket webSocket;

    public YuniWebSocketConnector(Request request, YuniBusinessProxyListener proxyListener) {
        this.client = new OkHttpClient();
        this.request = request;
        this.listener = new YuniWebSocketListener(proxyListener);
    }

    public WebSocket startConnection() {
        // 启动并设置 WebSocket
        webSocket = client.newWebSocket(request, listener);
        return webSocket;
    }

    public WebSocket restartConnection() {
        // 重新启动 WebSocket
        webSocket.close(1000, "重新连接");
        webSocket = client.newWebSocket(request, listener);
        return webSocket;
    }

    public void send(String message) {
        // 发送消息
        webSocket.send(message);
    }
}
```

### 连接容器管理所有连接

最后，再包装一个连接容器，用于管理所有连接

```java
public class YuniWebSocketManager {

    // 连接容器
    private Map<String, YuniWebSocketConnector> webSocketConnectorMap = new ConcurrentHashMap<>();

    /**
     * 启动新的连接
     * @param connectionId  业务定义的连接 ID
     * @param connector  连接管理器
     */
    public void startNewConnection(String connectionId, YuniWebSocketConnector connector) {
        WebSocket webSocket = connector.startConnection();
        webSocketConnectorMap.put(connectionId, connector);
    }

    /**
     * 重启连接
     * @param connectionId  连接 ID
     */
    public void restartConnection(String connectionId) {
        YuniWebSocketConnector connector = webSocketConnectorMap.get(connectionId);
        if (connector != null) {
            WebSocket webSocket = connector.restartConnection();
            webSocketConnectorMap.put(connectionId, connector);
        }
    }

    /**
     * 根据 ID 获取连接管理器
     * @param connectionId  连接 ID
     * @return  连接管理器
     */
    public YuniWebSocketConnector getWebSocket(String connectionId) {
        return webSocketConnectorMap.get(connectionId);
    }
}
```

### 使用

使用时需要先实现代理监听器，然后准备好握手请求 Request ；将这俩传入 conenctor 的构造函数中创建连接器，最后再用连接容器的 `startNewConnection` 即可建立新连接

```java
// 监听器代理定义
// 我也定义了代理的接口 YuniBusinessProxyListener 用于约束代理回调函数
// 接口内的方法定义与 okhttp3.WebSocketListener 中定义的一样
public class OneBotApiWsProxyListener implements YuniBusinessProxyListener {
    // 实现
    @Override
    public void onMessage(@NotNull WebSocket webSocket, @NotNull String text) {
        // 具体实现略
    }

    //// 具体实现略
}

OkHttpClient apiClient = new OkHttpClient();
OkHttpClient client = new OkHttpClient();
Request request = new Request.Builder()
    .url(url)
    .build();
WebSocket webSocket = client.newWebSocket(request, new OneBotApiWsProxyListener())
// manager 就是连接容器的实例，我直接依赖注入了
manager.startNewConnection("onebot_api", apiConnector);
```

## 请求 - 响应模型实现

HTTP 通信下有 `请求-响应` 模型，但 WebSocket 通信下没有这玩意，得自己模拟一个。我的思路如下

* 发送消息时，为该条消息创建一个 Future 对象，并与发送出去的消息标识一起保存起来
* 对端保证响应的消息携带的标识与收到的消息携带的标识一致
* 接收到消息时，解析收到消息标识，取出 Future 对象，完成 Future 对象，返回值就是收到的消息

### 代码

```java
/* 发送端 */
public String sendAndReceive(String message, String echoFlag) {
    // 发送消息，并创建回调 future
    CompletableFuture<String> future = new CompletableFuture<>();
    // 将发送出去的消息加入等待队列
    requestFutures.put(echoFlag, future);
    webSocket.send(message);

    // 设置超时时间
    setTimeOut(future, echoFlag);

    // 等待 future 完成
    try {
        return future.join();
    } catch (CompletionException e) {
        log.info("[YuniWebSocketConnector.sendAndReceive]请求失败，失败消息: {}", e.getCause().getMessage());
        e.printStackTrace();
        return "";
    }
}
private void setTimeOut(CompletableFuture<String> future, String echoFlag) {
    new Thread(() -> {  // 启动一个新线程等待到配置的超时时间结束
        try {
            Thread.sleep(timeOutInterval); // 等待直到超时结束
            if (future.isDone()){  // 这玩意会在 listener 里处理
                return;
            }
            // 如果到超时时间发现 future 没有完成，则认为请求超时，抛出异常，移除该 future
            future.completeExceptionally(new RuntimeException("一条请求超时，消息标识为: " + echoFlag));
            requestFutures.remove(echoFlag);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
    }).start();
}

/* 接收端 */
// 这是代理监听器的 onMessage 回调函数代理
@Override
public void onMessage(@NotNull WebSocket webSocket, @NotNull String text) {
    // 依据 OneBot 协议，在 /api 端点上，只会收到响应类消息，因此无需考虑非响应消息
    try {
        WsResponse response = deserializer.deserialize(text, WsResponse.class);
        // 根据 echo 取出 future
        CompletableFuture<String> future = connector.getRequestFutures().remove(response.getEcho());
        if (future != null) {
            // 检查状态码
            if (response.getRetcode() == 0) {
                // 状态码正常，future 返回响应数据
                future.complete(serialization.serialize(response.getData()));
            } else {
                // 状态码异常，future 返回异常
                future.completeExceptionally(new RuntimeException("请求失败，状态码 " + response.getRetcode()));
            }
        } else {
            log.warn("[OneBotApiWsProxyListener.onMessage]接收到非请求消息: {}", text);
        }
    } catch (Exception e) {
        log.warn("[OneBotApiWsProxyListener.onMessage]接收到非请求消息: {}", text);
    }

}
```

### 作为服务端

上一小节讲的是作为客户端如何模拟 `请求-响应` 模型，在业务中也会有作为服务器进行请求-响应的，这个就很简单，在 onMessage 回调里处理完事情之后去连接容器里拿一下对应的连接，将响应结果直接 `webSocket.send()` 发送过去就行了，这里不赘述。