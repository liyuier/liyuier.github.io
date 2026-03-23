---
title: 基于 DDSP 实现 AI 可可萝翻唱全流程笔记
titleTemplate: '%s - yuier'
date: 2026-03-21 23:23:40
updated: 2026-03-21 23:23:40
author: yuier
categories:
    - AI翻唱
tags:
    - AI 翻唱
    - MSST
    - DDSP
    - 公主连结
cover: 
hide: 
---

![](https://files.seeusercontent.com/2026/03/22/k9mC/84103522_p0.png)

<!-- more -->

## 开始之前

AI 翻唱的制作主要包含以下内容

* 准备推理源，即想要翻唱的歌曲的干净人声

    拿到一首歌，需要进行人声和伴奏的分离，这一部分使用 MSST 实现

* 准备数据集，即想要用来进行翻唱的角色的声音素材

    可可萝的游戏内语音素材可以直接在公主连结的 BWiKi 上扒下来。
    我实践了两套方案，一个是直接拿原始素材炼，缺点在于日语数据集训练的模型翻唱汉语歌语调很奇怪；
    另一个是先拿跨语言 TTS 模型炼出一组汉语素材，再拿汉语素材来训练翻唱，缺点是经过两层炼丹，语音未免失真。

* 使用数据集训练、推理

    这部分使用 DDSP 实现

* 制作成品

得益于伟大的互联网开源精神，上述每个步骤都可以在网络上找到教程、工具。尤其是涉及 AI 训练/推理的部分，有各种各样的一键式整合包，不必自己到处搜罗各种项目想方设法跑起来。

## 准备推理源

~~众所周知~~ B站上的中文 AI 翻唱类型下有个几乎是 hello world 级别的源曲，即 九三版《反方向的钟》

> 【《反方向的钟》你 为什么不爱我】 https://www.bilibili.com/video/BV1B64y1q7Cw/

这首歌在 23 年初被一众二次元角色 AI 翻唱带火，后续众多 AI 翻唱作品对该歌曲进行了翻唱。

我们今天的目标也是它。

### 下载这个视频

这个 Chrome 插件 [b站视频下载助手 - 下载bilibili视频](https://chromewebstore.google.com/detail/b%E7%AB%99%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD%E5%8A%A9%E6%89%8B-%E4%B8%8B%E8%BD%BDbilibili%E8%A7%86%E9%A2%91/pamdgobbggbpfpnadidipelihgkafiid?hl=zh-CN&utm_source=ext_sidebar) 可以用来下载 B 站视频

下载下来之后使用 ffmpeg 分离音频，并导出为 wav 格式

```bash
ffmpeg -i 待处理视频.mp4 -vn -acodec pcm_s16le 导出结果音频.wav
```

### 人声分离

这里使用 MSST-WebUI 整合包

仓库地址: https://github.com/SUC-DriverOld/MSST-WebUI

中文文档: https://my.feishu.cn/wiki/JSp3wk7zuinvIXkIqSUcCXY1nKc

#### 下载、启动整合包

* 下载整合包

    我可以科学上网，硬盘也够用，就直接到 huggingface 上 `hf download` 了

    https://huggingface.co/Sucial/MSST-WebUI/tree/main

* 解压整合包本体

    在 huggingface 上，整合包本体作为一个 .7z 的压缩包被放在根目录下一个以版本号命名的目录下

    ![pasted-image-1774152712474.webp](https://files.seeusercontent.com/2026/03/22/Uy2l/pasted-image-1774152712474.webp)

    ![pasted-image-1774152739610.webp](https://files.seeusercontent.com/2026/03/22/K9se/pasted-image-1774152739610.webp)

    找个地方把它解压出来

    ![pasted-image-1774152783500.webp](https://files.seeusercontent.com/2026/03/22/e9Ah/pasted-image-1774152783500.webp)

* 放置权重

    在 huggingface 仓库的 ALL_Models 目录下，有 4 个子目录

    ![pasted-image-1774153043988.webp](https://files.seeusercontent.com/2026/03/22/Mvi3/pasted-image-1774153043988.webp)

    其中 3 个的作用如下：

    ![pasted-image-1774153082625.webp](https://files.seeusercontent.com/2026/03/22/r7Hh/pasted-image-1774153082625.webp)

    剩下那个 `VR_Models` 目录下的是 UVR 分离的模型，我们使用 MSST ，不关心它

    把三个目录下的权重文件分别放到整合包的 `pretrain` 文件夹下的对应子文件夹下

    ![pasted-image-1774154013602.webp](https://files.seeusercontent.com/2026/03/22/h2Hd/pasted-image-1774154013602.webp)

* 启动 WebUI

    双击 `webui.exe` 即可

    ![pasted-image-1774154224654.webp](https://files.seeusercontent.com/2026/03/22/k8Fz/pasted-image-1774154224654.webp)

    然后访问 http://127.0.0.1:7860/ 即可

    ![pasted-image-1774154334143.webp](https://files.seeusercontent.com/2026/03/22/yA4e/pasted-image-1774154334143.webp)

#### 分离训练

![pasted-image-1774184163543.webp](https://files.seeusercontent.com/2026/03/22/h1wT/pasted-image-1774184163543.webp)

流程参考官方文档即可

#### 关于模型选择

选择分离模型是个学问，不同的音源有不同的伴奏/和声/混响特质。还好这首歌是自弹自唱，人声很干净，没有和声，混响几乎没有；伴奏也简单，只有一个吉他，没有其他复杂的乐器交响（也许这就是它被众多 AI 翻唱 UP 选中的原因）

不过就这样，分离工作依然很难做。根据我的体验，整合包中提供的模型存在的问题：

* 9628 / 9755: 分离出的人声中夹杂吉他扣弦的声音

* big_beta5e: 分离的人声交代不清楚，会有哑音

* BS-Roformer_LargeV1.ckpt: 同 9628 / 9755

* mel_band_roformer_vocals_becruily.: 同 big_beta5e ，但貌似症状轻一点？

一开始我决定使用 big_beta5e 同仓库下的最新模型 big_beta7 进行人声分离，然后用 `dereverb_mel_band_roformer_anvuew_sdr_19.1729.ckpt` 去一下混响

伴奏方面，不管换什么模型，总是有电流沙沙声，后来看到文档里第三方模型推荐里有个 `Logic BS Roformer` 模型，去试了一下，吉他效果惊为天人，完美无比

> [【Sucial丶的动态】​Logic BS RoFormer模型](https://www.bilibili.com/opus/1074580240298147848)

然后我搞完伴奏之后又去听了一下 `Logic BS Roformer` 分离出的人声，果然质量也非常高，于是我决定就用它分离出的人声去一下混响作为干净推理源

> 九三反方向的钟 伴奏及人声 蓝奏云 https://wwbxk.lanzouv.com/iFo2B3l9h8yd

## 准备数据集

### 获取原始数据

在公主连结 BWiKi 的角色图鉴界面可以直接 f12 拿到角色的游戏内语音素材

![pasted-image-1774188980698.webp](https://files.seeusercontent.com/2026/03/22/2Tqa/pasted-image-1774188980698.webp)

目前 wiki 上更新了六个妈，扒下来的素材，去掉混响严重的几个 UB 爆发，去掉无太大意义的受击音效，加起来也有半个多小时，差不多够用了

![pasted-image-1774189092571.webp](https://files.seeusercontent.com/2026/03/22/5cbN/pasted-image-1774189092571.webp)

我顺手用 ffmpeg 将这些零散的语音按照角色拼接成了完整的长语音，方便在整合包中使用（命名有些混乱，英文拼音混用，反正能明白就行）

![pasted-image-1774189642546.webp](https://files.seeusercontent.com/2026/03/22/Z8rn/pasted-image-1774189642546.webp)

> 可可萝 bwiki 语音集合 https://huggingface.co/datasets/yuier0721/pcr-kokkoro-cn-raw-audios

::: tip 致谢

感谢叔叔

:::

### 使用 GPT-SoVITS 生成中文语音素材

> [GPT-SoVITS 指南](https://www.yuque.com/baicaigongchang1145haoyuangong/ib3g1e)

![pasted-image-1774193913180.webp](https://files.seeusercontent.com/2026/03/22/z5bW/pasted-image-1774193913180.webp)

指南写得很详细，这里不多赘述

> 本次训练得到的中文语音模型 https://huggingface.co/yuier0721/Gpt-SoVITS_pcr-kokkoro_1.0
>
> 使用上述模型推理得到的《琵琶行》全文诵读（不含序）音频文件 https://huggingface.co/datasets/yuier0721/pcr-kokkoro-Chinese-audios/blob/main/%E5%8F%AF%E5%8F%AF%E8%90%9D-%E7%90%B5%E7%90%B6%E8%A1%8C_vocals.wav

## 开始训练与推理

### 安装 DDSP-SVC

使用 DDSP-SVC 模型实现 AI 翻唱。原项目 https://github.com/yxlllc/DDSP-SVC 运行起来比较麻烦，这里选择 `SVC Fusion` 整合包，使用其内嵌的 DDSP-SVC 模型。

到 [SVC Fusion 官网首页](https://www.svcfusion.com/) 下载 setup 要等十来秒，还有赞助弹窗，这里直接给出夸克网盘链接

https://pan.quark.cn/s/f5476dfbde71#/list/share

其余部分官方文档里写得很好，我这里就简单记点关键的

[正式使用 SVC Fusion](https://www.svcfusion.com/start/launch.html)

### 预处理

前文使用 ffmpeg 拼接了全语音，这里需要使用预处理工具将其切分为适合训练的小片段

![pasted-image-1774197347129.webp](https://files.seeusercontent.com/2026/03/22/Pti9/pasted-image-1774197347129.webp)

安装文档来就行

### 训练

也是按照文档来

epoch 根据显存大小计算，不要爆掉显存就行。

![pasted-image-1774205512628.webp](https://files.seeusercontent.com/2026/03/22/L4in/pasted-image-1774205512628.webp)

![pasted-image-1774205589312.webp](https://files.seeusercontent.com/2026/03/22/Rgy7/pasted-image-1774205589312.webp)

![pasted-image-1774205673956.webp](https://files.seeusercontent.com/2026/03/22/jO3g/pasted-image-1774205673956.webp)

### 推理

同样根据文档来

使用原始日语素材直接训练, epoch=60, step=600 模型推理效果如下 👇

<audio controls>
  <source src="https://yui-bucket-1309363843.cos.ap-nanjing.myqcloud.com/AI-interface/ddsp-svc/6.3/kokkoro1.0/model600_fcpe_euler.wav" type="audio/wav">
  您的浏览器不支持音频播放。
</audio>

使用 GPT-SoVITS 生成的中文音频作为训练集训练，epoch=30, step=500 模型推理效果如下 👇

<audio controls>
  <source src="https://yui-bucket-1309363843.cos.ap-nanjing.myqcloud.com/AI-interface/ddsp-svc/6.3/kokkoro1.0/GPTSovit_model500_1.wav" type="audio/wav">
  您的浏览器不支持音频播放。
</audio>

个人感觉前者音质较好，后者语调较准

### 打包模型

如果对效果满意的话，到小工具——模型相关——模型管理页面，顺着点就行

![pasted-image-1774205965007.webp](https://files.seeusercontent.com/2026/03/22/2eZn/pasted-image-1774205965007.webp)

最终会将模型保存到根目录下的 models 文件夹

![pasted-image-1774206027461.webp](https://files.seeusercontent.com/2026/03/22/7Cky/pasted-image-1774206027461.webp)

> 使用原始日语音频直接训练的模型 https://huggingface.co/yuier0721/DDSP-SVC_6.3_pcr-kokkoro_1.0
> 
> 使用 GPT-SoVITS 生成的中文音频作为训练集训练得到的模型 https://huggingface.co/yuier0721/DDSP-SVC_6.3_pcr-kokkoro_2.0

## 制作最终成品

把分离出的伴奏和推理得到的可可萝人声一起丢到 AU 里拼一。伴奏不用作处理，人声我加了一些效果如图

![pasted-image-1774290869926.webp](https://files.seeusercontent.com/2026/03/23/3Vra/pasted-image-1774290869926.webp)

室内混响自己调了一下

![pasted-image-1774290911033.webp](https://files.seeusercontent.com/2026/03/23/hm5M/pasted-image-1774290911033.webp)

最后到 B 站投了个稿

https://www.bilibili.com/video/BV1DwQfB2EyH/

<iframe src="//player.bilibili.com/player.html?isOutside=true&aid=116279545433252&bvid=BV1DwQfB2EyH&cid=36921281536&p=1" scrolling="no" border="0" frameborder="no" framespacing="0" allowfullscreen="true"></iframe>