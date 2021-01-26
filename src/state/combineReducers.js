/**
 * combineReducers - 使用对象的方式处理dispatch
 *   key: reducer
 * }
 * @return {Function}
 * @param reducers
 */
export default (reducers) =>
  /** Reducer
   *  @return {Function}
   * @param state
   * @param action
   */
  (state, action) => {
    let data = state;
    // eslint-disable-next-line no-restricted-syntax
    for (const p in reducers) {
      if (!Object.hasOwnProperty(p)) {
        data = reducers[p](data, action);
      }
    }

    return data;
  };
