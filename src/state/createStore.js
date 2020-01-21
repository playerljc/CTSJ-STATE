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
    return Immutable.cloneDeep(this.state);
  }

  /**
   * dispatch
   * @param {Object | Function} - action
   */
  dispatch(action) {
    if (action instanceof Function) {
      action(this.dispatch.bind(this));
    } else {
      const state = this.reducer(Immutable.cloneDeep(this.state), action);
      this.state = Immutable.cloneDeep(state);
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