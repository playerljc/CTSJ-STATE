import Immutable from '../util/immutable';

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
 * Store
 * @class Store
 * @classdesc Store
 */
class Store {
  /**
   * constrcutor
   * @param {Function} - reducer
   * @param {Object | Array} - preloadedState
   * @param {Array} - middlewares
   */
  constructor(reducer, preloadedState = {}, middlewares = []) {
    this.reducer = reducer || (state => state);
    this.state = Object.assign({}, preloadedState);
    this.middlewares = middlewares || [];
    // 给每一个middleware赋值store
    this.middlewares.forEach(m => {
      m.store = this;
    });
    this.listeners = [];
  }

  /**
   * getState
   * @return {Object}
   */
  getState() {
    return this.state;
  }

  /**
   * runBeforeMiddlewares
   * @param action
   * @return {Promise<state>}
   */
  runBeforeMiddlewares(action) {
    return new Promise((resolveParent, rejectParent) => {
      let index = this.middlewares.length - 1;
      // 整个store的state
      let cloneState = Immutable.cloneDeep(this.state);

      const next = () =>
        new Promise((resolve, reject) => {
          if (index < 0) {
            resolve();
          } else {
            const middleware = this.middlewares[index--];
            middleware
              .before({
                state: cloneState,
                action,
              })
              .then(state => {
                cloneState = state;
                next().then(() => {
                  resolve();
                });
              })
              .catch(error => {
                reject(error);
              });
          }
        });

      next()
        .then(() => {
          resolveParent(cloneState);
        })
        .catch(error => {
          rejectParent(error);
        });
    });
  }

  /**
   * runAfterMiddlewares
   * @param action
   * @return {Promise<state>}
   */
  runAfterMiddlewares(action) {
    return new Promise((resolveParent, rejectParent) => {
      let index = 0;
      let cloneState = Immutable.cloneDeep(this.state);

      const next = () =>
        new Promise((resolve, reject) => {
          if (index >= this.middlewares.length) {
            resolve();
          } else {
            const middleware = this.middlewares[index++];
            middleware
              .after({
                state: cloneState,
                action,
              })
              .then(state => {
                cloneState = state;
                next().then(() => {
                  resolve();
                });
              })
              .catch(error => {
                reject(error);
              });
          }
        });

      next()
        .then(() => {
          resolveParent(cloneState);
        })
        .catch(error => {
          rejectParent(error);
        });
    });
  }

  /**
   * dispatch
   * @param {Object | Function} - action
   */
  dispatch(action) {
    if (action instanceof Function) {
      action(this.dispatch.bind(this));
    } else if (this.middlewares.length) {
      // 如果有middlewares
      // before
      this.runBeforeMiddlewares(action).then(beforeCloneState => {
        this.state = beforeCloneState;
        // before的时候去掉action中的success
        const { success, ...filterAction } = action;
        trigger.call(this, filterAction);

        // detail
        this.state = this.reducer(Immutable.cloneDeep(this.state), action);

        // after
        this.runAfterMiddlewares(action).then(afterCloneState => {
          this.state = afterCloneState;
          trigger.call(this, action);
        });
      });
    } else {
      // 如果没有middlewares
      this.state = this.reducer(Immutable.cloneDeep(this.state), action);
      trigger.call(this, action);
    }
  }

  /**
   * subscribe
   * @param {Function} - listener
   * @return {Function}
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
 * createStore
 * @param {Function} - reducer
 * @param {Object | Array} - preloadedState
 * @param {Array} - middlewares
 * @return {Store}
 */
export default (reducer, preloadedState, middlewares) =>
  new Store(reducer, preloadedState, middlewares);
