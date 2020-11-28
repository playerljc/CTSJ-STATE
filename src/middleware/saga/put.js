/**
 * put
 * @param store
 * @param params
 * @param model
 * @param run
 * @return {Function}
 */
export default ({ store, params, model, run }) => ({ type, ...other }) => {
  // effects和reducers都已调用
  const { effects, reducers } = model;

  // 如果是effect
  if (effects[type]) {
    // 如果调用的是effect，这里的state是model中的state
    return run({ g: effects[type], state: store.state[model.namespace], params, model });
    // 如果调用的是reducer
  }
  // 如果是reduce
  else if (reducers[type]) {
    model.state = reducers[type](store.state[model.namespace], other);
    return model.state;
  }
};
