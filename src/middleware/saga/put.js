/**
 * put
 * @param state - model的state
 * @param params
 * @param model
 * @param run
 * @return {Function}
 */
export default ({ store, params, model, run }) => ({ type, ...other }) => {
  // effects和reducers都已调用
  const { effects, reducers } = model;

  if (effects[type]) {
    // 如果调用的是effect
    return run({ g: effects[type], state: store.state[model.namespace], params, model });
    // 如果调用的是reducer
  } else if (reducers[type]) {
    model.state = reducers[type](store.state[model.namespace], other);
    return model.state;
  }
};
