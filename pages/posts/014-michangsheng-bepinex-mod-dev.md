---
title: 觅长生 BepInEx MOD 开发记录
titleTemplate: '%s - yuier'
date: 2025-11-24 15:41:02
updated: 2025-11-24 15:41:02
author: yuier
categories:
    - C#
tags:
    - C#
    - 游戏 MOD
    - BepInEx
    - 觅长生
cover: 
hide: 
---

感谢宵夜的 B 站专栏 [Unity游戏Mod/插件制作教程](https://www.bilibili.com/read/readlist/rl355806)

<!-- more -->

## 前言

在下载的 BepInEx MOD 本地文件 config 目录下，找到了一个 MOD 开发交流群的 txt 文件，先加一手，宵夜、奶油等大佬都在里边，还有官方开发者也在: [769074914](https://qm.qq.com/q/iVZhGzFCx4)

## 问题

游戏内，玩家在宗门商店内必须使用各个宗门内部货币购买物品，而这个内部货币要到【宗门广场】里找人兑换，于是在【藏经阁】【神兵阁】【炼丹房】内，经常遇到货币不够，出门换货币，再回来换商品；货币还要算着换，以免换多了没用。。。这是个小但很烦人的痛点，之前貌似居然一直没人写相关的优化 MOD ，于是找了一圈无果后的我决定亲自上阵写一个 MOD

![image.png](https://s2.loli.net/2025/11/25/VLYUwIMg4O2kcDm.png)

### 效果

添加 MOD 后，在宗门商店内，将优先使用宗门货币购买商品；而如果宗门货币不足，将提示使用灵石支付，这样我们就可以在场景内直接完成购买，不必经历一次次繁琐的兑换操作和烦人的黑屏场景切换了。

![image.png](https://s2.loli.net/2025/11/25/Nu4irEWa956LoJA.png)

灵石和内部货币的汇率将会按照官方汇率，一个宗门货币价值 150 灵石，不会影响游戏性。

![image.png](https://s2.loli.net/2025/11/25/tKpkZMRsC5OeQfn.png)

## BepInEx

文章开头提到了 BepInEx 框架，其是觅长生当前事实的 MOD 标准框架，本次开发也基于该框架进行。

### Next

Next 框架是奶油佬基于 BepInEx 实现的低/无代码 MOD 开发框架，主要通过配置文件开发，非常适合制作大型剧情类 MOD ，但对于本次需求的对游戏本身的功能进行改动之类有些不太适合。

不过在本次项目中依然有用，比如可以使用导出功能方便快捷地查看游戏内数据。

详见 [【觅长生】Mod制作教程#1.2认识Next框架](https://www.bilibili.com/video/BV18a411T7Mh)

### 准备

游戏内将 BepInex 做成了一个 MOD，可以直接订阅。订阅后，BepInEx 的文件目录就不在游戏根目录下，而是在 MOD 目录下，即 `\steamapps\workshop\content\1189490\2824349934` 目录下

![image.png](https://s2.loli.net/2025/11/24/giGYylKU8ceThDd.png)

然后入门就是按照文章开头贴的宵夜的教程入门的，不作赘述。

## 分析与开始

思路就是找到宗门商店购买物品的事件，将所在函数 patch 了，重写逻辑，实现自己的需求。

具体怎么找这个事件，奶油在群里很热心地给出了帮助

![QQ_1764074084903.png](https://s2.loli.net/2025/11/25/7ODsBbSrPkYGg1c.png)

然而很不幸，我由于对觅长生开发 MOD 一窍不通，在游戏文件、Next 导出数据、反编译代码、乃至 MOD 文件里找了半天，不管是文本字符串，还是文件名，都没找到什么 “看起来有用” 的 exchange ，于是又回去继续问，这次是埋久给了~~一串神秘字符串~~回答 `jiaohuanshopgoods`

![image.png](https://s2.loli.net/2025/11/25/bTn1L5KrMcs3axu.png)

分别在 Next 导出数据和反编译代码中搜索，可以找到一个 json 文件和一个类。

![image.png](https://s2.loli.net/2025/11/25/oFYRftHwExi4jb5.png)

![image.png](https://s2.loli.net/2025/11/25/yeqdYt6CNSlpPRO.png)

再分析这个类的使用，找到一个很可疑的类: `UIMenPaiShop`

![image.png](https://s2.loli.net/2025/11/25/1dJ8MkwNpK3e2jB.png)

回群里发一下，又一位热心群友给了最终确认

![image.png](https://s2.loli.net/2025/11/25/kJyDipWs9wtVe5b.png)

OK ，既然找到了入口，那就开干吧。

> P.S. 多说一句，rider 的反编译比 dnSpy 好用多了，JB ，你就是我的神！

### 梳理代码逻辑

这一步是最简单的一步，因为我直接把代码丢给了通义，代码模式下它给出了极快极准确的注释，给了我极大帮助。如果没有 AI ，光靠我自己看、自己查资料，对于我这样一个 Unity 和 C# 双料门外汉，不知道会有多困难。

这里直接把我润色后的注释完整贴上来，展示 AI 神力 ~~也展示原本的代码是多么屎山~~

```cs
// 在打开宗门商店面板时执行此函数
// 主要内容为拉取数据、循环填充 UI 、绑定事件
public void RefreshUI()
{
    // 获取当前场景 ID
    string sceneName = SceneEx.NowSceneName;
    // 依据场景 ID 拉取游戏内商店数据
    List<NomelShopJsonData> all = NomelShopJsonData.DataList.FindAll((Predicate<NomelShopJsonData>) (d => $"S{d.threeScene}" == sceneName));
    if (all.Count == 0)
    {
        Debug.LogError((object) "UIMenPaiShop刷新UI异常，此场景没有商品信息");
    }
    else
    {
        // 依据场景 ID 设置商店面板标题
        this.ShopTitle.text = all[0].Title;
        int num1 = 0;
        int levelType = PlayerEx.Player.getLevelType();
        // 拉取游戏内物品数据库
        ItemDatebase component1 = jsonData.instance.GetComponent<ItemDatebase>();
        // 商店面板分为左中右 3 个区域，使用循环进行处理
        for (int index = 0; index < 3; ++index)
        {
            // 当前区域的数据
            NomelShopJsonData nomelShopJsonData = all[index];
            // 获取当前区域的子标题
            this.ShopName[index].text = nomelShopJsonData.ChildTitle;
            // 拉取当前区域下商品数据，即上文提到的 jiaohuanshopgoods
            List<jiaoHuanShopGoods> shopGoods = UIDuiHuanShop.GetShopGoods(nomelShopJsonData.ExShopID);
            shopGoods.Sort();
            // 清空 UI
            this.ShopRT[index].DestoryAllChild();
            // 遍历拉取到的当前区域下的商品数据进行处理
            foreach (jiaoHuanShopGoods jiaoHuanShopGoods in shopGoods)
            {
                jiaoHuanShopGoods good = jiaoHuanShopGoods;
                // 用当前区域内第一个商品需求的货币 ID 作为场景下所有商品需求的货币 ID，这个东西会在函数结尾用到
                // 这个处理逻辑就问你神不神
                if (num1 == 0)
                    num1 = good.EXGoodsID;
                // 依据商品 ID 查找物品元数据
                _ItemJsonData item = _ItemJsonData.DataDict[good.GoodsID];
                // 这个很长的 if 条件对应了游戏内的设定，宗门藏经阁依据玩家的境界分阶段开放
                if (nomelShopJsonData.SType != 1 || levelType >= item.quality || item.type != 3 && item.type != 4)
                {
                    // 生成单个商品 UI 组件
                    UIMenPaiShopItem component2 = UnityEngine.Object.Instantiate<GameObject>(this.UIMenPaiShopItemPrefab, (Transform) this.ShopRT[index]).GetComponent<UIMenPaiShopItem>();
                    // 计算商品价格，这也涉及游戏机制
                    int price = item.price / good.percent;
                    // 向上取整
                    if (item.price % good.percent > 0)
                        price++;
                    // 组件相关信息填充
                    component2.PriceText.text = price.ToString();
                    component2.PriceIcon.sprite = component1.items[good.EXGoodsID].itemIconSprite;
                    component2.IconShow.SetItem(good.GoodsID);
                    component2.IconShow.Count = 1;
                    // 为单个商品 UI 组件绑定事件
                    component2.IconShow.OnClick += (UnityAction<PointerEventData>) (p =>
                    {
                        // 计算玩家拥有的货币最多可兑换多少商品，也涉及游戏机制，有些商品只能一个一个地买
                        int maxNum = Mathf.Min(PlayerEx.Player.getItemNum(good.EXGoodsID) / price, item.maxNum);
                        switch (maxNum)
                        {
                            case 0:
                                // 买不起商品
                                UIPopTip.Inst.Pop(_ItemJsonData.DataDict[good.EXGoodsID].name + "不足");
                                break;
                            case 1:
                                // 只能买一个商品，弹出单独购买的 UI
                                USelectBox.Show($"是否兑换{item.name} x1", (UnityAction) (() =>
                                {
                                    // 又加了一层判断玩家能不能买得起商品的逻辑，属实是自己不信任自己 10 行前的代码了
                                    if (PlayerEx.Player.getItemNum(good.EXGoodsID) >= price)
                                    {
                                        // 购买物品的数据处理、提示弹窗等
                                        // 至此函数圈复杂度爆表
                                        PlayerEx.Player.removeItem(good.EXGoodsID, price);
                                        PlayerEx.Player.addItem(good.GoodsID, 1, Tools.CreateItemSeid(good.GoodsID));
                                        // 这里，买一个东西刷新了整个 UI。如果商店商品有限供应，那么可以理解
                                        // 但游戏内宗门商店商品无限供应，还来这么一下，实在令人费解
                                        this.RefreshUI();
                                        UIPopTip.Inst.Pop($"兑换了{_ItemJsonData.DataDict[good.GoodsID].name}x1", PopTipIconType.包裹);
                                    }
                                    else
                                        UIPopTip.Inst.Pop(_ItemJsonData.DataDict[good.EXGoodsID].name + "不足");
                                }));
                                break;
                            default:
                                // 可以买多个商品，弹出批量购买的 UI
                                USelectNum.Show("兑换数量 x{num}", 1, maxNum, (UnityAction<int>) (num =>
                                {
                                    // 以下逻辑同上
                                    if (PlayerEx.Player.getItemNum(good.EXGoodsID) >= num * price)
                                    {
                                        PlayerEx.Player.removeItem(good.EXGoodsID, num * price);
                                        PlayerEx.Player.addItem(good.GoodsID, num, Tools.CreateItemSeid(good.GoodsID));
                                        this.RefreshUI();
                                        UIPopTip.Inst.Pop($"兑换了{_ItemJsonData.DataDict[good.GoodsID].name}x{num}", PopTipIconType.包裹);
                                    }
                                    else
                                        UIPopTip.Inst.Pop(_ItemJsonData.DataDict[good.EXGoodsID].name + "不足");
                                }));
                                break;
                        }
                    });
                }
            }
        }
        // 商店面板右下角会展示玩家持有的宗门货币数量
        this.MoneyIcon.sprite = component1.items[num1].itemIconSprite;
        this.MoneyText.text = PlayerEx.Player.getItemNum(num1).ToString();
    }
}
```

## 编码

我这里参考了一个社区内其他同体量 MOD 的写法，以及一个 B 站视频，这里一并感谢

参考 MOD : [商店二楼和客栈加载优化](https://steamcommunity.com/sharedfiles/filedetails/?id=3049187211)

B 站视频: [教你使用C#制作觅长生Mod——第一期](https://www.bilibili.com/video/BV1Tb411f7Ua)

### 改动内容

根据上文代码分析，我们需要 patch 的函数主要逻辑是：

* 获取当前场景信息

* 循环处理交易面板的左中右三块区域

    * 拉取当前区域中的商品数据
    
    * 为每个商品创建 UI 组件

    * 为每个商品的 UI 组件绑定点击事件

显然，我们只需要修改最后绑定的点击事件的逻辑即可，其余部分依然保持原样。当然，实际上我还是出于代码整洁的考虑在我的 MOD 中对原函数进行了函数拆分等静态优化。

这是原本绑定的事件

```cs
component2.IconShow.OnClick += (UnityAction<PointerEventData>) (p =>
{
    // 计算玩家拥有的货币最多可兑换多少商品，也涉及游戏机制，有些商品只能一个一个地买
    int maxNum = Mathf.Min(PlayerEx.Player.getItemNum(good.EXGoodsID) / price, item.maxNum);
    switch (maxNum)
    {
        case 0:
            // 买不起商品，提示玩家持有货币不足
            UIPopTip.Inst.Pop(_ItemJsonData.DataDict[good.EXGoodsID].name + "不足");
            break;
        case 1:
            // 只能买一个商品，弹出单独购买的 UI
            USelectBox.Show($"是否兑换{item.name} x1", (UnityAction) (() =>
            {
                // 又加了一层判断玩家能不能买得起商品的逻辑，属实是自己不信任自己 5 行前的代码了
                if (PlayerEx.Player.getItemNum(good.EXGoodsID) >= price)
                {
                    // 数据处理、购买成功弹窗提示方面的代码，此处略
                    ...
                }
                else
                    // 提示玩家货币数量不足
                    UIPopTip.Inst.Pop(_ItemJsonData.DataDict[good.EXGoodsID].name + "不足");
            }));
            break;
        default:
            // 可以买多个商品，弹出批量购买的 UI
            USelectNum.Show("兑换数量 x{num}", 1, maxNum, (UnityAction<int>) (num =>
            {
                // 以下逻辑同上
                ...
            }));
            break;
    }
});
```

当用户买不起一件商品，即 `maxNum == 0` 时，会直接弹出货币不足的告警，然后事件结束。而我准备在此修改，当先判断了门派货币不足时，进入一个 `尝试使用灵石购买商品` 的函数。当玩家灵石充足时，便可以获得物品。

```cs
// 修改后的代码 be like:
switch (maxNum)
{
    case 0:
        // 弹窗提示门派货币不足，询问玩家是否转以灵石购买，并给出以灵石购买时的单价
        USelectBox.Show($"{_ItemJsonData.DataDict[jiaoHuanShopGoods.EXGoodsID].name}不足，是否使用灵石兑换{_ItemJsonData.DataDict[goodsMetaData.id].name}？" + 
            $"\n 单价：{goodsPrice.lingshiPrice} 灵石", () => {
            // 尝试以灵石购买的函数
            MenpaiShopingByLingshi(goodsPrice.lingshiPrice, goodsMetaData, __instance);
        });
        break;
    case 1:
        ...
    ...
}
...
...
// 新增的尝试以灵石购买的函数
public static void MenpaiShopingByLingshi(int lingshiPrice, _ItemJsonData goodsMetaData, UIMenPaiShop __instance)
{
    Avatar player = PlayerEx.Player;
    // 计算玩家的灵石够买多少商品
    var maxAffordable = GetAffordableGoodsNum((int)player.money, lingshiPrice, goodsMetaData.maxNum);
    if (maxAffordable == 0)
    {
        // 如果灵石还是不够买一个，那最终还是弹窗提示
        UIPopTip.Inst.Pop("灵石不足");
    }
    else if (maxAffordable == 1)
    {
        // 由于之前货币不足时已经弹窗供玩家确认过一次，因此这里不再弹窗，直接进行购买的数据操作和成功提示
        // ... 略
    }
    else
    {
        // 如果灵石够买多个商品，且商品允许批量购买，那还是要弹一个批量购买的窗口的
        USelectNum.Show("兑换数量 x{num}", 1, maxAffordable, (UnityAction<int>) (num =>
        {
            // ... 略
        }));
    }
}
```

## 插曲

### 为什么要刷新整个 UI ？

![image.png](https://s2.loli.net/2025/11/26/wm9B7svnfjUio4J.png)

上文代码中购买商品的数据操作和弹窗提示被我省略了，实际上原始代码中执行的是这样四行：

```cs
// 以购买单个物品为例
// 在玩家背包中扣除货币
PlayerEx.Player.removeItem(good.EXGoodsID, price);
// 在玩家背包中增加物品
PlayerEx.Player.addItem(good.GoodsID, 1, Tools.CreateItemSeid(good.GoodsID));
// 重点来了，调用自己，从头开始刷新整块商店面板
this.RefreshUI();
// 弹窗提示购买成功
UIPopTip.Inst.Pop($"兑换了{_ItemJsonData.DataDict[good.GoodsID].name}x1", PopTipIconType.包裹);
```

其中第三行就很令人费解。也许制作组曾经打算将宗门商店里的商品做成有限购买的，但是实际上目前游戏内，宗门商店就是无限供应的，因此这行纯属多此一举。

其唯一作用就是，在商店面板的右下角会展示用户持有的宗门货币的数量，这行代码会刷新这个数量，此外不会有更多作用。

![image.png](https://s2.loli.net/2025/11/25/qbut7698hcBLPyS.png)

那么，就让我来结束这一切。

![--.png](https://s2.loli.net/2025/11/26/MvobLOQPI5h314f.png)

我将这行代码修改为只刷新右下角货币数量的代码，极大 ~~（其实并不）~~ 降低了性能开销，优化了游戏画面表现（大嘘

```cs
public static void RefreshMenpaiHuobiShow(UIMenPaiShop __instance)
{
    // 设置货币图标
    Traverse.Create(__instance).Field("MoneyIcon").GetValue<Image>().sprite = jsonData.instance
        .GetComponent<ItemDatebase>().items[MENPAI_HUOBI_ID].itemIconSprite;
    // 刷新货币数量
    Traverse.Create(__instance).Field("MoneyText").GetValue<Text>().text = PlayerEx.Player.getItemNum(MENPAI_HUOBI_ID).ToString();
}
```

### 财富并非身外之物

此处依然涉及被省略的货币与商品的数量操作，但其实在 `// 计算玩家的灵石够买多少商品` 注释对应的代码处即初见端倪。

对比前文 `// 计算玩家拥有的货币最多可兑换多少商品` 处代码，我们发现，`获取玩家灵石数量` 与 `获取玩家宗门货币数量` 的代码是不一样的

```cs
// 获取玩家宗门货币数量
PlayerEx.Player.getItemNum(good.EXGoodsID)

// 获取玩家灵石数量
(int)player.money
```

没错，在游戏代码中，`宗门货币` 是玩家背包中的 `物品` ，而 `灵石` 是玩家自身存在的名为 `money` 的 `属性` ！

灵石并非身外之物，修仙四要，法财侣地，诚不我欺（

-----

最后，贴一下 MOD 地址

[在宗门商店内可直接使用灵石](https://steamcommunity.com/sharedfiles/filedetails/?id=3612097088)

仓库地址

https://github.com/liyuier/UseLingshiInsideZongmen