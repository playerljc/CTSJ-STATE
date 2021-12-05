# 2.0.22

***

2021/12/05

* model.effects[key]加入try/catch解决500时候的错误

# 2.0.21

***

2021/04/01

* 修复判断是否是类组件和函数组件，现在修改为无论是什么形式编写的组件都会有ref

# 2.0.20(react16.x)

***

2021/03/24

* 修复ref.current为空的问题

# 2.0.19(react16.x)

***

2021/02/17

* useSagaState的修复

# 2.0.18(react16.x)

***

2021/02/02

* 根据Component是否是Class组件还是函数组件来动态赋值ref(修复2.0.17的bug)

# 2.0.17(react16.x)

***

2021/02/02

* 根据Component是否是Class组件还是函数组件来动态赋值ref

# 2.0.16(react16.x)

***

2021/01/26

* 加入了使用state作为数据源的createState方法和useSagaState的hooks

# 2.0.15(react16.x)

***

2021/01/25

* put方法调用reduce的时候初始化参数修改为model.state

# 2.0.14(react16.x)

***

2021/01/06

* saga的serviceregister的effects中加入return接口的返回值

# 2.0.12(react16.x)

***

2020/12/19

* dispatch加入返回promise
* model加入subscriptions

# 2.0.11(react16.x)

***

2020/11/30

* effects中的put可以调用其他namespace中的effect和reduce

# 2.0.10(react16.x)

***

2020/11/30

* 在effects中进行了多次put再次使用select获取的时候应该能获取到
* 在effects中使用put再次调用其他effect，effect中使用select获取的state的模型中的state，需要修改为全局的state

# 2.0.9(react16.x)

***

2020/07/12

* 修复若干bug

# 2.0.8(react16.x)

***

2020/06/10

* 解决同时调用dispatch的时候数据丢失的问题

# 2.0.7(react16.x)

***

2020/06/10

* state数据merge的问题

# 2.0.6(react16.x)

***

2020/06/05

* state数据不自动merge的bug

# 2.0.5(react16.x)

***

2020/05/13

* bug修改

# 2.0.4(react16.x)

***

2020/05/10

* bug修改

# 2.0.2(react16.x)

***

2020/04/02

* 加入Logger中间件
* 加入Saga中间件
* 加入ServiceGenerator

# 2.0.1(react15.x)

***

2020/04/01

* 加入Logger中间件
* 加入Saga中间件
* 加入ServiceGenerator

# 1.0.7

***

2020/01/29

* React16.x在回调函数中加入success参数

# 1.0.6

***

2020/01/29

* React15.x在回调函数中加入success参数

# 1.0.5

***

2020/01/10

* React16.x在回调函数中加入action和ins参数

# 1.0.4

***

2020/01/10

* React15.x在回调函数中加入action和ins参数

# 1.0.3

***

2020/01/09

* React16.x新的Context用法

# 1.0.2

***

2020/01/09

* react15.x以下的Context用法

# 1.0.1

***

2019/12/19

* 加入getInstance获取实例

# 1.0.0

***

2019-09-06

* 初始版本
