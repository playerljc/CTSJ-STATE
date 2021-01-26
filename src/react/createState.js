import Immutable from '../util/immutable';
import createStore from '../state/createStore';
import applyMiddleware from '../state/applyMiddleware';
import { createSagaMiddleware } from '../middleware';

/**
 * registerModels
 * @param models
 * @param saga
 */
function registerModels({ saga, models }) {
  models.forEach((model) => {
    saga.model(model);
  });
}

/**
 * createState
 * @param initialState - state初始化数据
 * @param models - 所有的模型
 * @param mapState - mapState
 * @param mapDispatch - mapDispatch
 * @param ref - React组件的this
 * @param middleWares - 中间件
 * @param reducer - reducer
 */
export default ({
  initialState,
  models = [],
  mapState,
  mapDispatch,
  ref,
  middleWares,
  reducer,
}) => {
  /**
   * mapTo
   * @return {{dispatch: {}, props: {}}}
   */
  function mapTo() {
    let dispatch = {};

    // mapDispatchToProps
    if (mapDispatch) {
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      dispatch = mapDispatch(store.dispatch.bind(store));
    }

    let props = {};

    // mapStateToProps
    if (mapState) {
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      props = mapState(store.getState());
    }

    return {
      dispatch,
      props,
    };
  }

  /**
   * onSubscribe
   * @param action
   */
  function onSubscribe(action) {
    const { props, dispatch } = mapTo();

    ref.setState(
      {
        ...props,
        ...dispatch,
      },
      () => {
        // 如果是当前实力进行的数据更改才会调用success
        const { success, ...other } = action;
        // console.log('redux进行了数据改变的通知');
        // console.log(action);
        // console.log(this.ins);
        // console.log(this.ins === ins);
        if (success) {
          success.call(ref, Immutable.cloneDeep(other));
        }
      },
    );
  }

  // saga对象
  const saga = createSagaMiddleware();

  // store对象
  const store = createStore(reducer, initialState, applyMiddleware(...middleWares, saga));

  // store注册subscribe
  const unsubscribe = store.subscribe(onSubscribe);

  // 注册models
  registerModels({ models, saga });

  // 初始化ref的state
  if (!ref.state) {
    // eslint-disable-next-line no-param-reassign
    ref.state = {};
  }

  const { props, dispatch } = mapTo();

  Object.assign(ref.state, props, dispatch, {
    dispatch: store.dispatch.bind(store),
  });

  return () => {
    unsubscribe();
  };
};
