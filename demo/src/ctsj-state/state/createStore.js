/**
 * trigger
 * @access private
 */
function trigger() {
  const { listeners } = this;
  listeners.forEach((ins) => {
    ins();
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
   */
  constructor(reducer, preloadedState = {}) {
    this.reducer = reducer;
    this.state = Object.assign({}, preloadedState);
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
      const state = this.reducer(this.state, action);
      this.state = state;
      trigger.call(this);
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
