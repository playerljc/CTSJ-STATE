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
