---
title: 设计模式小结
titleTemplate: '%s - yuier'
date: 2025-12-06 19:53:41
updated: 2025-12-06 19:53:41
author: yuier
categories:
    - 设计模式
tags:
    - 设计模式
    - 八股文
cover: 
hide: index
---

# 创建型设计模式

## 工厂方法

提供在父类中创建对象的接口，但允许子类改变将要创建的对象类型。核心目标是解耦对象创建与使用逻辑

### 场景分析

不同运输环境需求不同交通工具：陆地需求卡车、水面需求船舶

```java
class LogisticsManager {
    public void transportCargo(String type) {
        if ("land".equals(type)) {
            Truck truck = new Truck();
            truck.deliver();
            ...
        } else if("sea".equals(type)) {
            Ship ship = new Ship();
            ship.deliver();
            ...
        }
    }
}
```

### 问题

* 直接依赖具体实现，客户端与具体运输工具耦合

* 违反开闭原则，每次新增运输工具，都需要新增分支、引入依赖、导致核心业务逻辑频繁变更

* 条件分支泛滥，条件分支扩散到多个位置：支付方式、日志记录。。。

* 代码重复

### 解决

![image.png](https://s2.loli.net/2025/12/04/8TcRQKZHMAhryWV.png)

* Truck / Ship 实现 Transport 接口，提供 deliver() 接口

* RoadLogistics / SeaLogistics 继承 Logistics 抽象类，提供 createTransport() 接口和 planDelivery() 接口

* Logistics 只需依赖 Transport 即可

优势

* 新增交通工具只需新增 Logistics 和 Transport 的子类/实现类即可

* planDelivery() 与 createTransport() 解耦

* 客户端通过 Logistics 基类操作所有物流类型，符合里氏替换原则：子类可以完全替换掉父类，并且软件的功能不受影响

上图总结：

![image.png](https://s2.loli.net/2025/12/04/NTCZIOQ3lpnYEHy.png)

## 抽象工厂

抽象工厂是一种创建型设计模式，可以生成相关对象系列，而无需指定他们的具体类

### 场景分析

装修需要家具，有 3 种家具：椅子、沙发、咖啡桌；它们又各自有三种风格的产品：艺术风、维多利亚风、现代风

如果直接实例化具体家具类会导致风格混杂

```java
class Client {
    public void createLivingRoom() {
        // 混合使用不同风格组件
        Chair modernChair = new ModernChair();
        Sofa victorianSofa = new VictorianSofa();
        CoffeeTable artDecoTable = new ArtDecoCoffeeTable();

        modernChair.sit();
        victorianSofa.lieDown();
        artDecoTable.placeMagazine();
    }
}
```

### 问题

* 风格一致性失控：同一客厅内存在不同风格家具

* 对象创建硬编码：每新增风格时，强制修改所有客户端代码

    ```java
    if("ArtDeco".equals(style)) {  //破坏开放封闭原则
        chair= new ArtDecoChair();  //需要新增多个类引用
        sofa = new ArtDecoSofa();
    }
    ```
* 产品族管理失效：将现代餐桌与维多利亚椅子组合，类型系统无法阻止

### 解决

![image.png](https://s2.loli.net/2025/12/04/m5e7NYq1Tz3Fdui.png)

* 产品接口
    Chair 接口定义了椅子的通用行为: ahsLegs(), sitOn(). 可以推测也存在 CoffeeTable 和 Sofa 接口

* 具体产品
    VictorianCoffeeTable 和 ModernChair 是 Chair 接口的具体实现

* 抽象工厂接口
    定义了一系列相关产品的接口
    ```java
    createChair(): Chair
    createCoffeeTable(): CoffeeTable
    createSofa(): Sofa
    ```
    核心：不关系具体的实现，只提供统一的创建接口

* 具体工厂
    VictorianFurnitureFactory 负责创建维多利亚风格的所有家具
    ModernFurnitureFactory 负责创建现代风格的所有家具
    每个具体工厂都实现了抽象工厂接口 FurnitureFactory ，并返回对应风格的具体产品

使用方式：

```java
FurnitureFactory factory = new VictorianFurnitureFactory();
Chair chair = factory.createChair(); // 返回 VictorianChair
CoffeeTable table = factory.createCoffeeTable(); // 返回 VictorianCoffeeTable
```

如果想更换风格，只需更换具体工厂，其余代码不变

上述内容总结

![image.png](https://s2.loli.net/2025/12/04/swD7h9gQxkVqtFE.png)

## 建造者

Builder 是一种创建型设计模式，可以逐步构建复杂对象。

* 将一个复杂对象的构造过程分解为多个步骤

* 每个步骤可以灵活配置

* 最终组合成一个完整对象

* 客户端不直接实例化对象，而是通过建造者逐步构造

以流式建造者举例：

```java
House house = new House.Builder()
    .withFoundation("Concrete")  // 设置地基
    .withWalls("Brick")  // 设置墙壁
    .withRoof("Tile")  // 设置屋顶
    .build();
```

优点

* 封装性好

* 灵活性高

* 可读性强

* 易于扩展

与工厂模式的区别：工厂模式着重解决“创建什么”的问题，建造者模式着重解决“怎么创建”的问题

## 原型

允许复制现有对象，而不使代码依赖于它们的类

* 定义一个原型接口，声明一个克隆自身的操作

* 所有具体原型类实现该接口

* 客户端通过克隆已有对象来获得新对象，无需知道其具体类型

优点

* 性能高：避免重复初始化和资源加载；

* 隐藏创建细节：客户端无需知道对象如何构建；

* 支持动态配置：运行时选择原型并克隆；

* 简化对象创建：尤其适合组合结构（如树、图）。

## 单例

确保一个类只有一个实例，同时为该实例提供全局访问点

实现要点

* 将默认构造函数设为私有，以防止其他对象使用 new 带有 Singleton 类的运算符。

* 创建一个充当构造函数的静态创建方法。在底层，此方法调用私有构造函数来创建一个对象并将其保存在静态字段中。
  
  对此方法的所有后续调用都会返回缓存的对象。

适用场景

* 系统只需要一个共享资源管理器（如日志记录器、配置管理器、线程池）；

* 需要协调系统行为的中心控制点（如数据库连接池、缓存）；

* 对象创建成本高，且只需一个实例。

注意：Spring 的“单例”是 容器级单例，不是 JVM 级单例。

* 同一个 Spring 容器中，Bean 默认是单例；

* 但不同容器（如多个 ApplicationContext）会有多个实例；

* 而设计模式中的单例是整个 JVM 中唯一。

# 结构型设计模式

## 适配器模式

使接口不兼容的类实现协同工作

通过引入中间层将客户端接口转换为服务器端接口标准

* 实现一个与现有对象之一兼容的接口

* 使用这个接口，现有的对象可以安全地调用适配器的方法

* 接收到调用后，适配器将请求传递给第二个对象，但采用第二个对象期望的格式和顺序

没什么好说的

## 桥接器模式

将一个大类或一系列紧密相关的类拆分为抽象和实现两个独立的层次结构，从而能在开发时分别使用

通过“组合代替继承”的方式，把原本可能通过多层继承实现的功能，拆分成两个独立的类体系，并在运行时动态组合，从而避免“类爆炸”问题。

### 问题场景

物体有形状和颜色两种属性。如果单纯使用继承，那么对于 m 个形状和 n 个颜色，需要 m*n 个具体类

### 解决

让 `形状` 持有一个 `颜色` 的接口，运行时动态注入颜色

```java
// 创建颜色对象
Color red = new Red();
Color blue = new Blue();

// 创建形状并指定颜色
Shape circleWithRed = new Circle(red);
Shape squareWithBlue = new Square(blue);

// 使用
circleWithRed.draw();   // 输出: Drawing Circle Color: Red
squareWithBlue.draw();  // 输出: Drawing Square Color: Blue
```

像一座桥一样，连接了两个独立变化的部分

## 组合模式

将对象组合成树形结构，以表示“部分-整体”的层次关系，并让客户端对单个对象和组合对象的使用具有一致性。

* component 组件：抽象基类，声明所有对象共有的操作 operation

* leaf 叶子：没有子节点

* composite 容器：可以包含子 component ，实现 add, remove, getChild 等方法

### 举例

```java
// 员工是 leaf
// 创建员工
Employee dev1 = new Developer("Alice", "Frontend");
Employee dev2 = new Developer("Bob", "Backend");

// manager 是 composite
// 创建小组长（也是经理）
Manager teamLead = new Manager("Charlie", "Web Team");
teamLead.add(dev1);
teamLead.add(dev2);

// 创建部门总监
Manager director = new Manager("Diana", "Engineering");
director.add(teamLead); // 经理也可以作为下属！

// 统一调用！
// 对于员工，showDetails 只展示自己的信息；对于 manager ，不但展示自己的信息，还递归展示自己下级容器信息
director.showDetails();
```

## 装饰器模式

将对象放入包含行为的特殊封装对象中来为原对象绑定新的行为

```java
// 基础咖啡
Beverage coffee = new Espresso();
System.out.println(coffee.getDescription() + " $" + coffee.cost());
// 输出: Espresso $1.99

// 加牛奶
coffee = new Milk(coffee);
System.out.println(coffee.getDescription() + " $" + coffee.cost());
// 输出: Espresso, Milk $2.49

// 再加糖
coffee = new Sugar(coffee);
System.out.println(coffee.getDescription() + " $" + coffee.cost());
// 输出: Espresso, Milk, Sugar $2.69
```

与代理的区别：装饰者强调增强，代理强调控制

## 外观模式

为一个复杂的子系统提供一个统一、简化的接口，隐藏其内部复杂性

* Facade（外观）：提供一个简单的接口，负责调用内部子系统的协作。

* SubSystem Classes（子系统类）	：实现具体功能的类，彼此可能相互依赖，但对客户端透明。

* Client（客户端）：只与 Facade 交互，不直接访问子系统。

外观模式 不封装子系统，只是简化访问方式。子系统仍可被直接使用（如果需要）

```java
class Computer {
    // 对外提供的简单接口
    public void start() {
        System.out.println("Computer: Starting up...");
        
        // 内部协调子系统（客户端不需要知道这些细节！）
        cpu.freeze();
        memory.load(BOOT_ADDRESS, hardDrive.read(BOOT_SECTOR, SECTOR_SIZE));
        cpu.jump(BOOT_ADDRESS);
        cpu.execute();
        
        System.out.println("Computer: Ready to use!");
    }
}

// 客户端只需调用一个方法
Computer computer = new Computer();
computer.start();
```

## 享元模式

通过共享技术，有效地支持大量细粒度的对象，从而节省内存。

| 状态类型                  | 说明                            | 是否可共享         |
|-----------------------|-------------------------------|---------------|
| 内部状态（Intrinsic State） | 对象固有的、不变的、可共享的信息（如字体名称、颜色、图标） | ✅ 可共享         |
| 外部状态（Extrinsic State） | 依赖环境、不可共享的信息（如单元格位置、内容）       | ❌ 不可共享，由客户端传入 |

享元对象 = 内部状态（共享） + 外部状态（运行时传入）

* Flyweight 享元接口：声明接受外部状态的方法

* ConcreteFlyweight 具体享元：实现 Flyweight 接口，内部保存内部状态。

* FlyweightFactory 享元工厂：创建并管理享元对象，确保相同内部状态的对象只创建一次

* 客户端：计算外部状态，并调用享元对象的方法

```java
// 【享元工厂】确保相同内部状态只创建一次
class FlyweightFactory {
    private static final ConcurrentHashMap<String, Flyweight> pool = new ConcurrentHashMap<>();

    public static Flyweight get(String key) {
        return pool.computeIfAbsent(key, ConcreteFlyweight::new);
    }
}

// 【客户端】使用：内部状态用于获取共享对象，外部状态动态传入
Flyweight fw1 = FlyweightFactory.get("样式A");
Flyweight fw2 = FlyweightFactory.get("样式A"); // ← 同一个对象！

System.out.println(fw1 == fw2); // true

fw1.operation("位置(10,20)"); // 外部状态
fw2.operation("位置(30,40)"); // 外部状态
```

## 代理模式

用一个对象代表另一个对象，代理 = 控制访问 + 增强行为

* 真实对象：专注核心逻辑

* 代理对象：持有真实对象引用，在调用前后插入额外逻辑

与装饰器模式的区别：装饰器侧重增强，代理侧重控制访问

# 行为型设计模式

## 责任链模式

将请求沿着处理者链进行发送。收到请求后，每个处理者均可对请求进行处理，或将其传递给链上的下个处理者

![image.png](https://s2.loli.net/2025/12/06/t8eAnilP7NcFJak.png)

## 命令模式

将 “请求” 封装为一个对象

解耦请求的发起者和执行者，让请求编程可存储、可传递、可控制的对象

// 理解不了这种东西也能称为设计模式

## 迭代器模式

提供一种方法，顺序访问一个聚合对象中的各个元素，而又不暴露其内部表示。

```java
Iterator<Integer> it = nums.createIterator();
while (it.hasNext()) {
    System.out.println(it.next());
}
```

## 中介者模式

限制对象之间的直接交互，迫使它们通过一个中介者对象进行合作，使对象之间不再直接引用彼此，降低耦合度

## 备忘录模式

允许在不暴露对象实现细节的情况下保存和恢复对象之前的状态

## 观察者模式

定义一种订阅机制，可以在对象事件发生时，通知多个“观察”该对象的其他对象

## 状态模式

在对象的内部状态变化时改变其行为，看起来就像是改变了其类（状态机？）

```python
# 状态基类（可省略，这里只为清晰）
class State:
    def insert_coin(self): pass

class HasGoods(State):
    def insert_coin(self):
        print("出货！")

class NoGoods(State):
    def insert_coin(self):
        print("售罄！")

class VendingMachine:
    def __init__(self):
        self.state = HasGoods()  # 初始状态

    def insert_coin(self):
        self.state.insert_coin()

    def set_state(self, state):
        self.state = state

# 客户端调用
vm = VendingMachine()
vm.insert_coin()          # → 出货！
vm.set_state(NoGoods())
vm.insert_coin()          # → 售罄！
```

## 策略模式

将不同算法封装到不同类中，选择权交给用户

| 对比项   | 策略模式         | 状态模式            |
|-------|--------------|-----------------|
| 目的    | 封装可互换的算法     | 封装对象的状态行为       |
| 谁控制切换 | 客户端主动换策略     | 状态自身或上下文自动切换状态  |
| 状态间关系 | 策略彼此独立、平等    | 状态之间有明确转移规则     |
| 典型场景  | 排序、支付方式、压缩算法 | 订单状态、游戏角色状态     |

## 模板方法

在超类中定义了一个算法框架，允许子类在不修改结构的情况下重写算法的特定步骤

```python
# 抽象基类：定义模板方法
class CaffeineBeverage:
    def prepare(self):          # 模板方法（final，不希望被重写）
        self.boil_water()
        self.brew()
        self.pour_in_cup()
        if self.customer_wants_condiments():
            self.add_condiments()

    def boil_water(self):       print("烧水")
    def pour_in_cup(self):      print("倒入杯中")

    # 钩子方法（可选）
    def customer_wants_condiments(self): return True

    # 抽象方法（子类必须实现）
    def brew(self): raise NotImplementedError
    def add_condiments(self): raise NotImplementedError

# 具体子类：咖啡
class Coffee(CaffeineBeverage):
    def brew(self):              print("冲泡咖啡粉")
    def add_condiments(self):    print("加糖和牛奶")

# 具体子类：茶
class Tea(CaffeineBeverage):
    def brew(self):              print("浸泡茶叶")
    def add_condiments(self):    print("加柠檬")
    def customer_wants_condiments(self): return False  # 覆盖钩子
```

## 访问者

将算法与其所作用的对象隔离开

当你有一组结构稳定的对象，却需要频繁给它们添加新操作时，把“操作”从对象中抽出来，封装到独立的“访问者”中。


```python
# 资产
assets = [House(), Car()]

# 访问者类
class AnnualTaxVisitor(TaxVisitor):
    def visit_house(self, house):
        print("房产税：¥5000")

    def visit_car(self, car):
        print("车船税：¥800")

# 使用
tax_calc = AnnualTaxVisitor()
for asset in assets:
    asset.accept(tax_calc)  # 每个资产“接待”访问者
```

## 解释器 

定义一种语言语法，以及一个可以解析和执行表达式的解释器

（这玩意真的能算设计模式吗）