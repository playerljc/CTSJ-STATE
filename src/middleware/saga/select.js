// /**
//  * select
//  * @param state - 全局的state
//  * @return {function(*): *}
//  */
// export default (state) => (iterator) => iterator(state);
/**
 * Select - 创建一个获取model中state的函数
 * @param saga
 * @return {function(*): *}
 */
export default function (saga) {
  // eslint-disable-next-line func-names
  return function (iterator) {
    // 所有model的state数据
    const selectContext = {};

    [...saga.models.values()].forEach((m) => {
      // namespace为key state为值
      selectContext[m.namespace] = m.state;
    });

    return iterator(selectContext);
  };
}
