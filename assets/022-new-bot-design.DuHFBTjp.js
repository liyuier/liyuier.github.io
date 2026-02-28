import{_ as d}from"./ValaxyMain.vue_vue_type_style_index_0_lang.CF3jKIAV.js";import{_ as c}from"./ValaxyMermaid.vue_vue_type_script_setup_true_lang.CwKS2sag.js";import{d as b,a as W,u as B}from"./chunks/vue-router.0fijYp3S.js";import{a2 as v,a3 as s,a4 as g,a5 as n,a6 as l,P as p,a8 as o,B as Z,a1 as Q,D as j}from"./framework.CL_twgqk.js";import"./app.DJJRq6_7.js";import"./chunks/dayjs.BFInjCTz.js";import"./chunks/vue-i18n.CRimy4L_.js";import"./chunks/pinia.KHo6empO.js";/* empty css                    */import"./chunks/@vueuse/motion.DON3upiQ.js";import"./chunks/nprogress.DUFFUuWH.js";import"./YunComment.vue_vue_type_style_index_0_lang.lpZGJo7w.js";import"./index.C5okkQwF.js";import"./YunPageHeader.vue_vue_type_script_setup_true_lang.7-8ddEp8.js";import"./post.D4SLBNdn.js";const S=b("/posts/022-new-bot-design",async I=>JSON.parse('{"title":"QQ 机器人架构梳理","titleTemplate":"%s - yuier","description":"","frontmatter":{"title":"QQ 机器人架构梳理","titleTemplate":"%s - yuier","date":"2025-12-19 00:33:19","updated":"2025-12-19 00:33:19","author":"yuier","categories":["qq机器人"],"tags":["qq机器人","大饼"],"cover":null,"hide":true},"headers":[],"relativePath":"pages/posts/022-new-bot-design.md","lastUpdated":1772277401000}'),{lazy:(I,t)=>I.name===t.name}),T={__name:"022-new-bot-design",setup(I,{expose:t}){const{data:u}=S(),m=B(),r=W(),C=Object.assign(r.meta.frontmatter||{},u.value?.frontmatter||{});return m.currentRoute.value.data=u.value,j("valaxy:frontmatter",C),globalThis.$frontmatter=C,t({frontmatter:{title:"QQ 机器人架构梳理",titleTemplate:"%s - yuier",date:"2025-12-19 00:33:19",updated:"2025-12-19 00:33:19",author:"yuier",categories:["qq机器人"],tags:["qq机器人","大饼"],cover:null,hide:!0}}),(e,a)=>{const i=c,A=d;return Q(),v(A,{frontmatter:Z(C)},{"main-content-md":s(()=>[a[0]||(a[0]=n("h2",{id:"前言",tabindex:"-1"},[l("前言 "),n("a",{class:"header-anchor",href:"#前言","aria-label":'Permalink to "前言"'},"​")],-1)),a[1]||(a[1]=n("p",null,"我的 QQ 机器人已经写了两版了，但是感觉都总是不得劲。思来想去，应该是每次开写的时候都没有梳理好整体思路，打开 IDEA 就是干，不免写着写着就出现各种意料之外的情况。",-1)),a[2]||(a[2]=n("p",null,[l("于是今天晚上我找"),n("a",{href:"https://www.qianwen.com/",target:"_blank",rel:"noreferrer"},"千问"),l("聊了一下这个话题，我们俩一起畅想了一番 QQ 机器人的设计")],-1)),a[3]||(a[3]=n("h2",{id:"整体架构",tabindex:"-1"},[l("整体架构 "),n("a",{class:"header-anchor",href:"#整体架构","aria-label":'Permalink to "整体架构"'},"​")],-1)),a[4]||(a[4]=n("p",null,"在我给出的多次英明指导下，千问勤勤恳恳地为我输出了一套让我比较满意的架构。",-1)),a[5]||(a[5]=n("p",null,"在这个架构中提供了简单的权限模块、插件模块。这将会是我下一个机器人的蓝图（虽然最终发现这跟我上一个烂尾的机器人没啥区别就是了）",-1)),p(i,o({code:"Z3JhcGggVEIKICAgIHN1YmdyYXBoICLovpPlhaXlsYIiCiAgICAgICAgQVvlpb3lj4tB5Zyo576kMTIzNDU25Y-R6YCBOiAv5oql5pe2XQogICAgICAgIEJbUVHljY_orq7pgILphY3lmahdCiAgICBlbmQKCiAgICBzdWJncmFwaCAi5qC45b-D5aSE55CG5bGCIgogICAgICAgIENb5Li75py65Zmo5Lq6OiBoYW5kbGVNZXNzYWdlXQogICAgICAgIERb5Lya6K-d566h55CG5ZmoOiB1cGRhdGVTZXNzaW9uXQogICAgICAgIEVb5o-S5Lu2566h55CG5ZmoOiBmaW5kTWF0Y2hdCiAgICAgICAgRlvmnYPpmZDpqozor4Hlmag6IGNoZWNrXQogICAgZW5kCgogICAgc3ViZ3JhcGggIuS4muWKoemAu-i-keWxgiIKICAgICAgICBHW-aKpeaXtuaPkuS7tjogZXhlY3V0ZV0KICAgICAgICBIW-mAmueUqOWbnuWkjeWkhOeQhuWZqDogcHJvY2Vzc10KICAgIGVuZAoKICAgIHN1YmdyYXBoICLovpPlh7rlsYIiCiAgICAgICAgSVvmtojmga_ovpPlh7rlmag6IHNlbmRdCiAgICAgICAgSltRUeWNj-iurui-k-WHul0KICAgIGVuZAoKICAgIHN1YmdyYXBoICLmlbDmja7lrZjlgqgiCiAgICAgICAgS1tSZWRpc-e8k-WtmF0KICAgICAgICBMW01vbmdvRELmlbDmja7lupNdCiAgICBlbmQKCiAgICAlJSDmtojmga_lpITnkIbmtYHnqIsKICAgIEEgLS0-IEIKICAgIEIgLS0-IEMKCiAgICAlJSDkvJror53mm7TmlrAKICAgIEMgLS0-IEQKICAgIEQgLS0-IEsKCiAgICAlJSDmj5Lku7bljLnphY0KICAgIEMgLS0-IEUKICAgIEUgLS0-fOWMuemFjeWIsOaKpeaXtuaPkuS7tnwgRgogICAgRSAtLT585pyq5Yy56YWN5o-S5Lu2fCBICgogICAgJSUg5p2D6ZmQ6aqM6K-BCiAgICBGIC0tPiBMCiAgICBMIC0tPiBGCiAgICBGIC0tPnzmnYPpmZDpgJrov4d8IEcKICAgIEYgLS0-fOadg-mZkOaLkue7nXwgSQoKICAgICUlIOS4muWKoeaJp-ihjAogICAgRyAtLT4gSQogICAgSCAtLT4gSQoKICAgICUlIOa2iOaBr-i-k-WHugogICAgSSAtLT4gSgogICAgSiAtLT4gTVvnvqQxMjM0NTbmmL7npLo6IOW9k-WJjeaXtumXtOaYryAyMDI05bm0MDHmnIgxNeaXpSAxNDozMDoyNV0KCiAgICBzdHlsZSBBIGZpbGw6I2UxZjVmZQogICAgc3R5bGUgTSBmaWxsOiNlOGY1ZTgKICAgIHN0eWxlIEcgZmlsbDojZmZmM2UwCiAgICBzdHlsZSBDIGZpbGw6I2YzZTVmNQogICAgc3R5bGUgRiBmaWxsOiNmZmViZWU"},{}),null,16),a[6]||(a[6]=n("h2",{id:"插件系统",tabindex:"-1"},[l("插件系统 "),n("a",{class:"header-anchor",href:"#插件系统","aria-label":'Permalink to "插件系统"'},"​")],-1)),a[7]||(a[7]=n("p",null,"插件系统是一个开放的框架必须支持的，尤其对于 qq bot 这样尤其需要活跃社区的产品。",-1)),a[8]||(a[8]=n("p",null,"千问建议我基于 Spring 提供的 @EventListener 机制扩展我的插件系统，这一机制天然适合 qq bot 这样事件驱动的系统。",-1)),p(i,o({code:"Z3JhcGggVEIKICAgIHN1YmdyYXBoICJTcHJpbmflrrnlmagiCiAgICAgICAgQVtUaW1lUmVwb3J0UGx1Z2lu5a6e5L6LXQogICAgICAgIEJbV2VhdGhlclBsdWdpbuWunuS-i10KICAgICAgICBDW011c2ljUGx1Z2lu5a6e5L6LXQogICAgICAgIERbRXZlbnQgTXVsdGljYXN0ZXJdCiAgICBlbmQKCiAgICBzdWJncmFwaCAi5LqL5Lu25aSE55CGIgogICAgICAgIEVbQXBwbGljYXRpb25FdmVudFB1Ymxpc2hlci5wdWJsaXNoRXZlbnRdCiAgICAgICAgRlvpgY3ljobmiYDmnInnm5HlkKzlmahdCiAgICAgICAgRzF7VGltZVJlcG9ydFBsdWdpbjxicj4uc2hvdWxkSGFuZGxlP30KICAgICAgICBHMntXZWF0aGVyUGx1Z2luPGJyPi5zaG91bGRIYW5kbGU_fQogICAgICAgIEcze011c2ljUGx1Z2luPGJyPi5zaG91bGRIYW5kbGU_fQogICAgICAgIEgxW1RpbWVSZXBvcnRQbHVnaW4ucHJvY2Vzc0V2ZW50XQogICAgICAgIEgyW1dlYXRoZXJQbHVnaW4ucHJvY2Vzc0V2ZW50XQogICAgICAgIEgzW011c2ljUGx1Z2luLnByb2Nlc3NFdmVudF0KICAgIGVuZAoKICAgIEUgLS0-IEQKICAgIEQgLS0-IEYKICAgIEYgLS0-IEcxCiAgICBGIC0tPiBHMgogICAgRiAtLT4gRzMKICAgIEcxIC0tPnx0cnVlfCBIMQogICAgRzEgLS0-fGZhbHNlfCBJW-i3s-i_h10KICAgIEcyIC0tPnx0cnVlfCBIMgogICAgRzIgLS0-fGZhbHNlfCBJCiAgICBHMyAtLT58dHJ1ZXwgSDMKICAgIEczIC0tPnxmYWxzZXwgSQoKICAgIHN0eWxlIEEgZmlsbDojZTFmNWZlCiAgICBzdHlsZSBCIGZpbGw6I2U4ZjVlOAogICAgc3R5bGUgQyBmaWxsOiNmZmYzZTAKICAgIHN0eWxlIEgxIGZpbGw6I2ZmY2RkMgogICAgc3R5bGUgSDIgZmlsbDojYzhlNmM5CiAgICBzdHlsZSBIMyBmaWxsOiNiYmRlZmI"},{}),null,16),a[9]||(a[9]=n("h2",{id:"项目结构",tabindex:"-1"},[l("项目结构 "),n("a",{class:"header-anchor",href:"#项目结构","aria-label":'Permalink to "项目结构"'},"​")],-1)),a[10]||(a[10]=n("div",{class:"language- max-h-900px"},[n("button",{title:"Copy code",class:"copy"}),n("span",{class:"lang"}),n("pre",{class:"shiki shiki-themes github-light github-dark vp-code"},[n("code",{"v-pre":""},[n("span",{class:"line"},[n("span",null,"qq-bot/                              # 父项目（根目录）")]),l(`
`),n("span",{class:"line"},[n("span",null,"├── pom.xml                         # 父POM，管理所有子模块")]),l(`
`),n("span",{class:"line"},[n("span",null,"├── README.md")]),l(`
`),n("span",{class:"line"},[n("span",null,"├── docs/")]),l(`
`),n("span",{class:"line"},[n("span",null,"│   ├── architecture.md")]),l(`
`),n("span",{class:"line"},[n("span",null,"│   └── plugin-development-guide.md")]),l(`
`),n("span",{class:"line"},[n("span",null,"├── qq-bot-core/                    # 核心模块（接口定义、基础模型）")]),l(`
`),n("span",{class:"line"},[n("span",null,"│   ├── pom.xml")]),l(`
`),n("span",{class:"line"},[n("span",null,"│   └── src/main/java/com/example/qbot/core/")]),l(`
`),n("span",{class:"line"},[n("span",null,"│       ├── api/")]),l(`
`),n("span",{class:"line"},[n("span",null,"│       │   ├── Plugin.java                    # 插件基础接口")]),l(`
`),n("span",{class:"line"},[n("span",null,"│       │   ├── CommandPlugin.java             # 命令插件接口")]),l(`
`),n("span",{class:"line"},[n("span",null,"│       │   ├── EventPlugin.java               # 事件插件接口")]),l(`
`),n("span",{class:"line"},[n("span",null,"│       │   └── MessageHandlerPlugin.java      # 消息处理器插件接口")]),l(`
`),n("span",{class:"line"},[n("span",null,"│       ├── model/")]),l(`
`),n("span",{class:"line"},[n("span",null,"│       │   ├── MessageEvent.java              # 消息事件基础模型")]),l(`
`),n("span",{class:"line"},[n("span",null,"│       │   ├── GroupMessageEvent.java         # 群消息事件")]),l(`
`),n("span",{class:"line"},[n("span",null,"│       │   ├── PrivateMessageEvent.java       # 私聊消息事件")]),l(`
`),n("span",{class:"line"},[n("span",null,"│       │   └── PluginContext.java             # 插件上下文")]),l(`
`),n("span",{class:"line"},[n("span",null,"│       ├── session/")]),l(`
`),n("span",{class:"line"},[n("span",null,"│       │   └── MessageSession.java            # 消息会话对象")]),l(`
`),n("span",{class:"line"},[n("span",null,"│       ├── cqcode/")]),l(`
`),n("span",{class:"line"},[n("span",null,"│       │   └── CqCodeParser.java              # CQ码解析器")]),l(`
`),n("span",{class:"line"},[n("span",null,"│       └── annotation/")]),l(`
`),n("span",{class:"line"},[n("span",null,"│           └── PluginInfo.java                # 插件信息注解")]),l(`
`),n("span",{class:"line"},[n("span",null,"├── qq-bot-domain/                  # 领域模型模块")]),l(`
`),n("span",{class:"line"},[n("span",null,"│   ├── pom.xml")]),l(`
`),n("span",{class:"line"},[n("span",null,"│   └── src/main/java/com/example/qbot/domain/")]),l(`
`),n("span",{class:"line"},[n("span",null,"│       ├── entity/")]),l(`
`),n("span",{class:"line"},[n("span",null,"│       │   └── PluginMetadata.java            # 插件元数据")]),l(`
`),n("span",{class:"line"},[n("span",null,"│       ├── repository/")]),l(`
`),n("span",{class:"line"},[n("span",null,"│       │   └── PluginRepository.java          # 插件仓库接口")]),l(`
`),n("span",{class:"line"},[n("span",null,"│       └── service/")]),l(`
`),n("span",{class:"line"},[n("span",null,"│           └── PluginService.java             # 插件服务接口")]),l(`
`),n("span",{class:"line"},[n("span",null,"├── qq-bot-plugin-system/           # 插件系统核心模块")]),l(`
`),n("span",{class:"line"},[n("span",null,"│   ├── pom.xml")]),l(`
`),n("span",{class:"line"},[n("span",null,"│   └── src/main/java/com/example/qbot/plugin/")]),l(`
`),n("span",{class:"line"},[n("span",null,"│       ├── PluginManager.java                 # 插件管理器")]),l(`
`),n("span",{class:"line"},[n("span",null,"│       ├── PluginRegistry.java                # 插件注册器")]),l(`
`),n("span",{class:"line"},[n("span",null,"│       ├── PluginClassLoader.java             # 插件类加载器")]),l(`
`),n("span",{class:"line"},[n("span",null,"│       └── PluginLifecycleManager.java        # 插件生命周期管理")]),l(`
`),n("span",{class:"line"},[n("span",null,"├── qq-bot-command-system/          # 指令系统模块")]),l(`
`),n("span",{class:"line"},[n("span",null,"│   ├── pom.xml")]),l(`
`),n("span",{class:"line"},[n("span",null,"│   └── src/main/java/com/example/qbot/command/")]),l(`
`),n("span",{class:"line"},[n("span",null,"│       ├── CommandRegistry.java               # 命令注册器")]),l(`
`),n("span",{class:"line"},[n("span",null,"│       ├── CommandMatcher.java                # 命令匹配器")]),l(`
`),n("span",{class:"line"},[n("span",null,"│       ├── CommandProcessor.java              # 命令处理器")]),l(`
`),n("span",{class:"line"},[n("span",null,"│       └── handler/")]),l(`
`),n("span",{class:"line"},[n("span",null,"│           └── CommandHandler.java            # 命令处理器接口")]),l(`
`),n("span",{class:"line"},[n("span",null,"├── qq-bot-adapter/                 # 适配器模块（协议通信）")]),l(`
`),n("span",{class:"line"},[n("span",null,"│   ├── pom.xml")]),l(`
`),n("span",{class:"line"},[n("span",null,"│   └── src/main/java/com/example/qbot/adapter/")]),l(`
`),n("span",{class:"line"},[n("span",null,"│       ├── qq/")]),l(`
`),n("span",{class:"line"},[n("span",null,"│       │   ├── QqProtocolAdapter.java        # QQ协议适配器（Go-CQHTTP/Mirai）")]),l(`
`),n("span",{class:"line"},[n("span",null,"│       │   ├── QqMessageConverter.java       # QQ消息格式转换器")]),l(`
`),n("span",{class:"line"},[n("span",null,"│       │   └── QqConnectionManager.java      # QQ连接管理器")]),l(`
`),n("span",{class:"line"},[n("span",null,"│       └── websocket/")]),l(`
`),n("span",{class:"line"},[n("span",null,"│           └── QqWebSocketHandler.java       # QQ WebSocket消息处理器")]),l(`
`),n("span",{class:"line"},[n("span",null,"├── qq-bot-bot-engine/              # 机器人引擎模块")]),l(`
`),n("span",{class:"line"},[n("span",null,"│   ├── pom.xml")]),l(`
`),n("span",{class:"line"},[n("span",null,"│   └── src/main/java/com/example/qbot/engine/")]),l(`
`),n("span",{class:"line"},[n("span",null,"│       ├── BotManager.java                    # 机器人管理器")]),l(`
`),n("span",{class:"line"},[n("span",null,"│       ├── MessageProcessor.java              # 消息处理器")]),l(`
`),n("span",{class:"line"},[n("span",null,"│       ├── RobotMessenger.java                # 机器人消息发送器")]),l(`
`),n("span",{class:"line"},[n("span",null,"│       └── event/")]),l(`
`),n("span",{class:"line"},[n("span",null,"│           └── EventPublisher.java            # 事件发布器")]),l(`
`),n("span",{class:"line"},[n("span",null,"├── qq-bot-web-api/                 # Web API模块")]),l(`
`),n("span",{class:"line"},[n("span",null,"│   ├── pom.xml")]),l(`
`),n("span",{class:"line"},[n("span",null,"│   └── src/main/java/com/example/qbot/web/")]),l(`
`),n("span",{class:"line"},[n("span",null,"│       ├── QqBotWebApplication.java          # Web应用启动类")]),l(`
`),n("span",{class:"line"},[n("span",null,"│       ├── controller/")]),l(`
`),n("span",{class:"line"},[n("span",null,"│       │   ├── PluginController.java         # 插件管理控制器")]),l(`
`),n("span",{class:"line"},[n("span",null,"│       │   ├── CommandController.java        # 命令管理控制器")]),l(`
`),n("span",{class:"line"},[n("span",null,"│       │   └── BotController.java            # 机器人管理控制器")]),l(`
`),n("span",{class:"line"},[n("span",null,"│       └── config/")]),l(`
`),n("span",{class:"line"},[n("span",null,"│           └── WebSocketConfig.java          # WebSocket配置")]),l(`
`),n("span",{class:"line"},[n("span",null,"├── qq-bot-application/             # 主应用模块（可执行JAR）")]),l(`
`),n("span",{class:"line"},[n("span",null,"│   ├── pom.xml")]),l(`
`),n("span",{class:"line"},[n("span",null,"│   ├── src/main/java/com/example/qbot/app/")]),l(`
`),n("span",{class:"line"},[n("span",null,"│   │   └── QqBotApplication.java             # 主应用启动类")]),l(`
`),n("span",{class:"line"},[n("span",null,"│   └── src/main/resources/")]),l(`
`),n("span",{class:"line"},[n("span",null,"│       ├── application.yml                   # 应用配置")]),l(`
`),n("span",{class:"line"},[n("span",null,"│       ├── banner.txt                        # 启动横幅")]),l(`
`),n("span",{class:"line"},[n("span",null,"│       └── plugins/                          # 插件存放目录")]),l(`
`),n("span",{class:"line"},[n("span",null,"└── plugins/                        # 插件开发目录（独立项目）")]),l(`
`),n("span",{class:"line"},[n("span",null,"    ├── time-plugin/")]),l(`
`),n("span",{class:"line"},[n("span",null,"    │   ├── pom.xml")]),l(`
`),n("span",{class:"line"},[n("span",null,"    │   └── src/main/java/com/example/plugins/time/")]),l(`
`),n("span",{class:"line"},[n("span",null,"    │       ├── TimePlugin.java               # 时间插件主类")]),l(`
`),n("span",{class:"line"},[n("span",null,"    │       └── handlers/")]),l(`
`),n("span",{class:"line"},[n("span",null,"    │           ├── TimeCommandHandler.java   # 时间命令处理器")]),l(`
`),n("span",{class:"line"},[n("span",null,"    │           └── DateCommandHandler.java   # 日期命令处理器")]),l(`
`),n("span",{class:"line"},[n("span",null,"    └── weather-plugin/")]),l(`
`),n("span",{class:"line"},[n("span",null,"        ├── pom.xml")]),l(`
`),n("span",{class:"line"},[n("span",null,"        └── src/main/java/com/example/plugins/weather/")]),l(`
`),n("span",{class:"line"},[n("span",null,"            ├── WeatherPlugin.java            # 天气插件主类")]),l(`
`),n("span",{class:"line"},[n("span",null,"            └── handlers/")]),l(`
`),n("span",{class:"line"},[n("span",null,"                └── WeatherCommandHandler.java # 天气命令处理器")])])]),n("button",{class:"code-block-unfold-btn"})],-1)),a[11]||(a[11]=n("h3",{id:"core-模块",tabindex:"-1"},[l("core 模块 "),n("a",{class:"header-anchor",href:"#core-模块","aria-label":'Permalink to "core 模块"'},"​")],-1)),a[12]||(a[12]=n("p",null,"提供基础的注解、异常、工具类和数据模型",-1)),a[13]||(a[13]=n("p",null,"被其他所有模块依赖",-1)),a[14]||(a[14]=n("h3",{id:"domain-模块",tabindex:"-1"},[l("domain 模块 "),n("a",{class:"header-anchor",href:"#domain-模块","aria-label":'Permalink to "domain 模块"'},"​")],-1)),a[15]||(a[15]=n("p",null,"数据库实体类、仓库接口、领域服务",-1)),a[16]||(a[16]=n("h3",{id:"插件系统模块",tabindex:"-1"},[l("插件系统模块 "),n("a",{class:"header-anchor",href:"#插件系统模块","aria-label":'Permalink to "插件系统模块"'},"​")],-1)),a[17]||(a[17]=n("p",null,"插件加载、管理、生命周期控制",-1)),a[18]||(a[18]=n("h3",{id:"指令系统",tabindex:"-1"},[l("指令系统 "),n("a",{class:"header-anchor",href:"#指令系统","aria-label":'Permalink to "指令系统"'},"​")],-1)),a[19]||(a[19]=n("p",null,"指令解析、匹配、执行",-1)),a[20]||(a[20]=n("h3",{id:"适配器模块",tabindex:"-1"},[l("适配器模块 "),n("a",{class:"header-anchor",href:"#适配器模块","aria-label":'Permalink to "适配器模块"'},"​")],-1)),a[21]||(a[21]=n("p",null,"外部系统集成",-1)),a[22]||(a[22]=n("h3",{id:"engine-模块",tabindex:"-1"},[l("engine 模块 "),n("a",{class:"header-anchor",href:"#engine-模块","aria-label":'Permalink to "engine 模块"'},"​")],-1)),a[23]||(a[23]=n("p",null,"机器人核心逻辑，消息处理，事件分发",-1)),a[24]||(a[24]=n("h3",{id:"web-模块",tabindex:"-1"},[l("web 模块 "),n("a",{class:"header-anchor",href:"#web-模块","aria-label":'Permalink to "web 模块"'},"​")],-1)),a[25]||(a[25]=n("p",null,"提供 web 接口",-1)),a[26]||(a[26]=n("h3",{id:"application-模块",tabindex:"-1"},[l("application 模块 "),n("a",{class:"header-anchor",href:"#application-模块","aria-label":'Permalink to "application 模块"'},"​")],-1)),a[27]||(a[27]=n("p",null,"整合其他模块",-1)),a[28]||(a[28]=n("h2",{id:"图表",tabindex:"-1"},[l("图表 "),n("a",{class:"header-anchor",href:"#图表","aria-label":'Permalink to "图表"'},"​")],-1)),p(i,o({code:"Z3JhcGggVEIKICAgIHN1YmdyYXBoICLkuLvnqIvluo_lsYIiCiAgICAgICAgQVtPbmVCb3QgQWRhcHRlcl0gLS0-IEJbRXZlbnQgRGlzcGF0Y2hlcl0KICAgICAgICBCIC0tPiBDW1Blcm1pc3Npb24gTWFuYWdlcl0KICAgICAgICBDIC0tPiBEW1BsdWdpbiBNYW5hZ2VyXQogICAgICAgIEQgLS0-IEVbUGx1Z2luIFJlZ2lzdHJ5XQogICAgZW5kCgogICAgc3ViZ3JhcGggIuaPkuS7tuWxgiIKICAgICAgICBGW1BsdWdpbiBJbnN0YW5jZSAxXSAtLT4gR1tNYXRjaGVyIDFdCiAgICAgICAgRiAtLT4gSFtNYXRjaGVyIDJdCiAgICAgICAgSVtQbHVnaW4gSW5zdGFuY2UgMl0gLS0-IEpbTWF0Y2hlciAzXQogICAgICAgIEkgLS0-IEtbTWF0Y2hlciA0XQogICAgICAgIExbUGx1Z2luIEluc3RhbmNlIE5dIC0tPiBNW01hdGNoZXIgNV0KICAgICAgICBMIC0tPiBOW01hdGNoZXIgNl0KICAgIGVuZAoKICAgIHN1YmdyYXBoICLmnYPpmZDlsYIiCiAgICAgICAgT1tHcm91cCBDb25maWcgMV0gLS0-IFBbVXNlciBQZXJtaXNzaW9uc10KICAgICAgICBRW0dyb3VwIENvbmZpZyAyXSAtLT4gUltVc2VyIFBlcm1pc3Npb25zXQogICAgICAgIFNbR2xvYmFsIENvbmZpZ10gLS0-IFRbRGVmYXVsdCBSdWxlc10KICAgIGVuZAoKICAgIHN1YmdyYXBoICLng63ph43ovb3lsYIiCiAgICAgICAgVVtGaWxlIFdhdGNoZXJdIC0tPiBWW0hvdCBSZWxvYWQgTW9uaXRvcl0KICAgICAgICBWIC0tPiBXW0NsYXNzIExvYWRlciBNYW5hZ2VyXQogICAgICAgIFcgLS0-IFhbUGx1Z2luIFJlbG9hZGVyXQogICAgZW5kCgogICAgQSAtLT4gVQogICAgRCAtLT4gVgogICAgRSAtLT4gVwogICAgQyAtLT4gTwogICAgQyAtLT4gUQogICAgQyAtLT4gUw"},{}),null,16),p(i,o({code:"Z3JhcGggTFIKICAgIEFb55So5oi3QV0gLS0-IEJb576kMV0KICAgIEEgLS0-IENb576kMl0KICAgIERb55So5oi3Ql0gLS0-IEIKICAgIEQgLS0-IEMKCiAgICBCIC0tPiBFW-aPkuS7tlg6IOWQr-eUqF0KICAgIEIgLS0-IEZb5o-S5Lu2WTog56aB55SoXQogICAgQyAtLT4gR1vmj5Lku7ZYOiDnpoHnlKhdCiAgICBDIC0tPiBIW-aPkuS7tlk6IOWQr-eUqF0KCiAgICBFIC0tPiBJW-eUqOaIt0HlnKjnvqQx5a-55o-S5Lu2WDogQURNSU7mnYPpmZBdCiAgICBGIC0tPiBKW-eUqOaIt0HlnKjnvqQx5a-55o-S5Lu2WTog5peg5p2D6ZmQXQogICAgRyAtLT4gS1vnlKjmiLdB5Zyo576kMuWvueaPkuS7tlg6IE1FTUJFUuadg-mZkF0KICAgIEggLS0-IExb55So5oi3QeWcqOe-pDLlr7nmj5Lku7ZZOiBBRE1JTuadg-mZkF0"},{}),null,16),p(i,o({code:"c2VxdWVuY2VEaWFncmFtCiAgICBwYXJ0aWNpcGFudCBCb3QgYXMgT25lQm90IEFkYXB0ZXIKICAgIHBhcnRpY2lwYW50IEVEIGFzIEV2ZW50IERpc3BhdGNoZXIKICAgIHBhcnRpY2lwYW50IFBNIGFzIFBlcm1pc3Npb24gTWFuYWdlcgogICAgcGFydGljaXBhbnQgTU0gYXMgUGx1Z2luIE1hbmFnZXIKICAgIHBhcnRpY2lwYW50IFBsdWdpbiBhcyBQbHVnaW4KCiAgICBCb3QtPj5FRDogUmVjZWl2ZSBFdmVudAogICAgRUQtPj5NTTogRGlzcGF0Y2ggRXZlbnQKICAgIE1NLT4-UE06IENoZWNrIFBlcm1pc3Npb24KICAgIFBNLS0-Pk1NOiBQZXJtaXNzaW9uIFJlc3VsdAogICAgYWx0IEhhcyBQZXJtaXNzaW9uCiAgICAgICAgTU0tPj5NTTogTWF0Y2ggRXZlbnQgd2l0aCBQbHVnaW4gTWF0Y2hlcnMKICAgICAgICBhbHQgRXZlbnQgTWF0Y2hlcwogICAgICAgICAgICBNTS0-PlBsdWdpbjogQ2FsbCBvbkV2ZW50KCkKICAgICAgICAgICAgUGx1Z2luLS0-Pk1NOiBQcm9jZXNzIEV2ZW50CiAgICAgICAgICAgIE1NLS0-PkVEOiBFdmVudCBIYW5kbGVkCiAgICAgICAgZW5kCiAgICBlbmQKICAgIEVELS0-PkJvdDogUmVzcG9uc2U"},{}),null,16),a[29]||(a[29]=n("div",{class:"language- max-h-900px"},[n("button",{title:"Copy code",class:"copy"}),n("span",{class:"lang"}),n("pre",{class:"shiki shiki-themes github-light github-dark vp-code"},[n("code",{"v-pre":""},[n("span",{class:"line"},[n("span",null,"yuni-bot/")]),l(`
`),n("span",{class:"line"},[n("span",null,"├── application.jar                 # 主程序")]),l(`
`),n("span",{class:"line"},[n("span",null,"├── plugins/                       # 插件目录")]),l(`
`),n("span",{class:"line"},[n("span",null,"│   ├── plugin1.jar")]),l(`
`),n("span",{class:"line"},[n("span",null,"│   ├── plugin2.jar")]),l(`
`),n("span",{class:"line"},[n("span",null,"│   └── development/")]),l(`
`),n("span",{class:"line"},[n("span",null,"│       └── dev-plugin.class")]),l(`
`),n("span",{class:"line"},[n("span",null,"├── config/")]),l(`
`),n("span",{class:"line"},[n("span",null,"│   └── group-permissions.json     # 权限配置")]),l(`
`),n("span",{class:"line"},[n("span",null,"└── logs/")])])]),n("button",{class:"code-block-unfold-btn"})],-1)),a[30]||(a[30]=n("p",null,"public class PassivePluginInstance implements PluginInstance {",-1)),a[31]||(a[31]=n("pre",null,[n("code",null,`...
private YuniEventDetector<?> detector;
...
`)],-1)),a[32]||(a[32]=n("p",null,"}",-1))]),"main-header":s(()=>[g(e.$slots,"main-header")]),"main-header-after":s(()=>[g(e.$slots,"main-header-after")]),"main-nav":s(()=>[g(e.$slots,"main-nav")]),"main-content-before":s(()=>[g(e.$slots,"main-content-before")]),"main-content":s(()=>[g(e.$slots,"main-content")]),"main-content-after":s(()=>[g(e.$slots,"main-content-after")]),"main-nav-before":s(()=>[g(e.$slots,"main-nav-before")]),"main-nav-after":s(()=>[g(e.$slots,"main-nav-after")]),comment:s(()=>[g(e.$slots,"comment")]),footer:s(()=>[g(e.$slots,"footer")]),aside:s(()=>[g(e.$slots,"aside")]),"aside-custom":s(()=>[g(e.$slots,"aside-custom")]),default:s(()=>[g(e.$slots,"default")]),_:3},8,["frontmatter"])}}};export{T as default,S as usePageData};
