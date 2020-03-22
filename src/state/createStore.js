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
    this.reducer = reducer;
    this.state = Object.assign({}, preloadedState);
    this.middlewares = middlewares || [];
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
   * dispatch
   * @param {Object | Function} - action
   */
  dispatch(action) {
    if (action instanceof Function) {
      action(this.dispatch.bind(this));
    } else {
      if (this.middlewares) {
        for (let i = this.middlewares.length - 1; i >= 0; i--) {
          const { before } = this.middlewares[i];
          before(this.state, action);
        }
      }

      const state = this.reducer(this.state, action);
      this.state = state;

      if (this.middlewares) {
        for (let i = 0; i < this.middlewares.length; i++) {
          const { after } = this.middlewares[i];
          after(this.state, action);
        }
      }

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
 * @param {Object | Array} preloadedState
 * @return {Store}
 */
export default function (reducer, preloadedState) {
  return new Store(reducer, preloadedState);
}
