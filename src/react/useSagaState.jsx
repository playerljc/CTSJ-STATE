import { useRef, useReducer, useEffect } from 'react';

import createStore from '../state/createStore';
import applyMiddleware from '../state/applyMiddleware';
import { createSagaMiddleware } from '../middleware';

/**
 * SagaState
 */
class SagaState {
  /**
   * constructor
   * @param params
   * {
   *  initialState - state初始化数据
   *  models - 所有的模型
   *  mapState - mapState
   *  mapDispatch - mapDispatch
   *  ref - React组件的this
   *  middleWares - 中间件
   *  reducer - reducer
   * }
   */
  constructor(params) {
    const { initialState, models = [], middleWares, reducer } = params;

    this.params = params;

    // saga对象
    this.saga = createSagaMiddleware();

    // store对象
    this.store = createStore(reducer, initialState, applyMiddleware(...middleWares, this.saga));

    // 注册models
    this.registerModels({ models, saga: this.saga });
  }

  /**
   * registerModels
   * @param models
   * @param saga
   */
  registerModels({ saga, models }) {
    models.forEach((model) => {
      saga.model(model);
    });
  }

  /**
   * mapTo
   * @return {{dispatch: {}, props: {}}}
   */
  mapTo() {
    const { mapState, mapDispatch } = this.params;

    let dispatch = {};

    // mapDispatchToProps
    if (mapDispatch) {
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      dispatch = mapDispatch(this.store.dispatch.bind(this.store));
    }

    let props = {};

    // mapStateToProps
    if (mapState) {
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      props = mapState(this.getState());
    }

    return {
      dispatch,
      props,
    };
  }

  /**
   * getReducer
   * @return {function(...[*]=)}
   */
  // eslint-disable-next-line class-methods-use-this
  getReducer() {
    return (state, action) => {
      const {
        type,
        params: { props, dispatch },
      } = action;

      if (type === 'setState') {
        return {
          ...state,
          ...props,
          ...dispatch,
        };
      }

      return state;
    };
  }

  /**
   * getInitial
   * @return {{}}
   */
  getInitial() {
    const { props, dispatch } = this.mapTo();

    return {
      ...props,
      ...dispatch,
    };
  }

  /**
   * subscribe
   * @param dispatch
   * @return {function(...[*]=)}
   */
  subscribe(dispatch) {
    this.onSubscribe = this.onSubscribe.bind(this, dispatch);

    return this.store.subscribe(this.onSubscribe);
  }

  /**
   * getState
   * @return {{}}
   */
  getState() {
    return this.store.getState();
  }

  /**
   * onSubscribe
   * @param reducerDispatch
   * @param action
   */
  onSubscribe(reducerDispatch, action) {
    const { props, dispatch } = this.mapTo();

    reducerDispatch({ type: 'setState', params: { props, dispatch } });
  }
}

export default (params) => {
  const ref = useRef(new SagaState(params));

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    const unsubscribe = ref.current.subscribe(dispatch);

    return () => {
      unsubscribe();
    };
  });

  const [state, dispatch] = useReducer(ref.current.getReducer(), ref.current.getInitial());

  return state;
};
