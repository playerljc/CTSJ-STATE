/**
 * trigger
 * @access private
 */
function trigger(action) {
  const { listeners } = this;
  listeners.forEach((ins) => {
    ins(action);
  });
}

/**
 * Store - 数据的仓库
 * @class Store
 * @classdesc 数据的仓库
 */
class Store {
  /**
   * constrcutor - Store的构造方法
   * @param {Object} - reducer - Reducer实例
   * @param {Object | Array} - preloadedState - Store的默认值
   * @param {Array} - middlewares - 中间件
   */
  constructor(reducer, preloadedState = {}, middlewares = []) {
    // reducer处理
    this.reducer = reducer || ((state) => state);

    // 用缺省值初始化store的数据
    this.state = Object.assign({}, preloadedState);

    // 所有的中间件
    this.middlewares = middlewares || [];

    // 给每一个middleware赋值store
    this.middlewares.forEach((m) => {
      m.setStore(this);
    });

    // 对store更新进行订阅(subscribe)的句柄
    this.listeners = [];
  }

  /**
   * getState - 获取store的数据
   * @return {Object}
   */
  getState() {
    return this.state;
  }

  /**
   * runBeforeMiddleWares - 执行所有中间件的before
   * @param action - dispatch的action
   * @return {Promise<state>}
   */
  runBeforeMiddleWares(action) {
    return new Promise((resolveParent, rejectParent) => {
      // 从后往前执行middleWares
      let index = this.middlewares.length - 1;

      /**
       * 执行一次middleWare的runBefore
       * @return {Promise}
       */
      const next = () =>
        new Promise((resolve, reject) => {
          // 所有的middleWare都执行完了
          if (index < 0) {
            resolve();
          } else {
            // 取出一个middle
            const middleware = this.middlewares[index--];
            // 执行middleWare的before
            middleware
              .before({
                // 传入的是整个数据
                state: this.state,
                action,
              })
              .then((/* state */) => {
                // cloneState = state;
                // 继续向前执行middleWare
                next().then(() => {
                  resolve();
                });
              })
              .catch((error) => {
                reject(error);
              });
          }
        });

      // 执行一次middleWare的runBefore
      next()
        .then(() => {
          resolveParent();
        })
        .catch((error) => {
          rejectParent(error);
        });
    });
  }

  /**
   * runAfterMiddleWares - 运行所有中间件的after
   * @param action - dispatch的action
   * @return {Promise<state>}
   */
  runAfterMiddleWares(action) {
    return new Promise((resolveParent, rejectParent) => {
      let index = 0;
      const next = () =>
        new Promise((resolve, reject) => {
          if (index >= this.middlewares.length) {
            resolve();
          } else {
            const middleware = this.middlewares[index++];
            middleware
              .after({
                // 传入的是整个数据
                state: this.state,
                action,
              })
              .then(() => {
                next().then(() => {
                  resolve();
                });
              })
              .catch((error) => {
                reject(error);
              });
          }
        });

      next()
        .then(() => {
          resolveParent();
        })
        .catch((error) => {
          rejectParent(error);
        });
    });
  }

  /**
   * dispatch - 进行数据的修改
   * @param {Object | Function} - action
   */
  dispatch(action) {
    if (action instanceof Function) {
      action(this.dispatch.bind(this));
    }
    // 如果存在中间件
    else if (this.middlewares.length) {
      // 如果有middleWares
      // before 执行所有的middleWare的before
      this.runBeforeMiddleWares(action).then(() => {
        // before的时候去掉action中的success
        const { success, ...filterAction } = action;
        trigger.call(this, filterAction);

        // detail 执行所有的Reducer
        this.state = this.reducer(this.state, action);

        // after 执行所有的middleWare的after
        this.runAfterMiddleWares(action).then(() => {
          trigger.call(this, action);
        });
      });
    } else {
      // 如果没有middleWares
      // 执行所有的Reducer
      this.state = this.reducer(this.state, action);
      trigger.call(this, action);
    }
  }

  /**
   * subscribe - 对store数据更改的监听
   * @param {Function} - listener
   * @return {Function} - 删除该句柄的方法
   */
  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      const index = this.listeners.indexOf(listener);
      if (index !== -1) {
        this.listeners.splice(index, 1);
      }
    };
  }
}

/**
 * createStore - 创建一个Store
 * @param {Object} - reducer - Reducer实例
 * @param {Object | Array} - preloadedState - store的默认值
 * @param {Array} - middlewares - 中间件
 * @return {Store}
 */
export default (reducer, preloadedState, middlewares) =>
  new Store(reducer, preloadedState, middlewares);
