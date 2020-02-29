/**
 * combineReducers
 * @param {Object} - reducers
 * @return {Function}
 */
export default (reducers: any) => {
  /** Reducer
     *  @param {Object} - state
     *  @param {Object} - action
     *  @return {Function}
     */
  return (state: any, action: any) => {
    let data = state;
    for (const p: string in reducers) {
      if (!Object.hasOwnProperty(p)) {
        data = reducers[p](data, action);
      }
    }

    return data;
  };
};
