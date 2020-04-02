/**
 * combineReducers
 * @param {Object} - reducers
 * @return {Function}
 */
export default reducers =>
  /** Reducer
   *  @param {Object} - state
   *  @param {Object} - action
   *  @return {Function}
   */
  (state, action) => {
    let data = state;
    for (const p in reducers) {
      if (!Object.hasOwnProperty(p)) {
        data = reducers[p](data, action);
      }
    }

    return data;
  };
