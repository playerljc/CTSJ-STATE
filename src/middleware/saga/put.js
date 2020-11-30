// /**
//  * put - 使用put可以调用任意model中的effect和reducer
//  * @param store
//  // * @param params
//  // * @param model
//  * @param run
//  * @return {Function}
//  */
// export default ({ store, /* params, model, */ run }) => ({ type, ...other }) => {
//   // effects和reducers都已调用
//   // const { effects, reducers } = model;
//
//   // type是namespace/xxxx
//
//
//   // 如果是effect
//   if (effects[type]) {
//     // 如果调用的是effect，这里的state是model中的state
//     return run({ g: effects[type], state: store.state[model.namespace], params, model });
//     // 如果调用的是reducer
//   }
//   // 如果是reduce
//   if (reducers[type]) {
//     model.state = reducers[type](store.state[model.namespace], other);
//     return model.state;
//   }
// };

/**
 * put - 使用put可以调用任意model中的effect和reducer
 * @param store - 全局的数据
 * @param params - action的参数
 * @param run - 执行effect的函数
 * @param model - 数据的模型
 * @return {Function}
 */
export default function ({ store, params, run, model }) {
  const saga = this;

  // eslint-disable-next-line consistent-return
  return function ({ type, ...other }) {
    let curModel;
    let curType;

    // 如果没有/说明调用的是当前model中的effect或reducer
    if (type.split('/').length === 1) {
      curModel = model;
      curType = type;
    }
    // 调用的是其他namespace中的effect和reducer
    else {
      // 这里的type是namespace/[effect|reducer]
      const [namespace, name] = type.split('/');

      // 获取model
      curModel = saga.getModel(namespace);
      curType = name;
    }

    // 获取model中的effects和reducers
    const { effects, reducers } = curModel;

    // 如果是effect
    if (effects[curType]) {
      // 如果调用的是effect，这里的state是model中的state
      return run({ g: effects[curType], params, model: curModel });
      // 如果调用的是reducer
    }
    // 如果是reduce
    if (reducers[curType]) {
      curModel.state = reducers[curType](store.state[curModel.namespace], other);
      return curModel.state;
    }
  };
}
