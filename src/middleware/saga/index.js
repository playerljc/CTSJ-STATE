import Call from './call';
import All from './all';
import Race from './race';
import Select from './select';
import Put from './put';
import History from './history';

import { isFunction, isObject } from '../../util';
import { parse } from '../../util/qs';

/**
 * Saga
 * @class Saga
 * @classdesc Saga 提供模型和对模型处理的中间件
 */
class Saga {
  constructor() {
    /**
     * 存放所有模型
      一个模型的结构如下
      {
        namespace
        {
          namespace: String
          effects: Object
          state: Object
          reducers: Object
        }
      }
     * @type {Map<any, any>}
     */
    this.models = new Map();

    this.history = History;
  }

  /**
   * setStore - 设置store
   * @param store
   */
  setStore(store) {
    this.store = store;
    if (!this.store.state.loading) {
      // 初始化store的loading
      this.store.state.loading = {
        // 全局的loading默认为false
        global: false,
      };
    }
  }

  /**
   * setRouter - 设置React
   * @param router
   */
  setRouter(router) {
    const self = this;

    this.router = router;

    const srcListen = self.router.history.listen.bind(self.router.history);
    // 对history的listener进行重写
    this.router.history.listen = (it) => {
      // 上来就调用一次listener的回调
      it({
        ...{
          pathname: window.location.pathname,
          search: window.location.search,
          query: parse(),
        },
        state: { ...self.store.state },
      });

      srcListen((params) => {
        it({ ...(params || {}), state: { ...self.store.state } });
      });
    };

    // 设置所有model的subscriptions的setup
    self.router.history = Array.from(self.models.values()).forEach((model) => {
      if ('subscriptions' in model && isObject(model.subscriptions)) {
        if ('setup' in model.subscriptions && isFunction(model.subscriptions.setup)) {
          model.subscriptions.setup({
            history: self.router.history,
            dispatch: self.store.dispatch.bind(self.store),
          });
        }
      }
    });
  }

  /**
   * model - 添加一个model
   * @param model
   * @return {boolean}
   */
  model(model) {
    if (!model) return false;

    this.clearUnSubscriptions(model);

    this.models.set(model.namespace, model);

    this.init(model);

    return true;
  }

  /**
   * unModel - 注销一个model
   * @param namespace
   */
  unModel(namespace) {
    const model = this.models.get(namespace);

    if (model) {
      this.clearUnSubscriptions(model);

      this.models.delete(namespace);

      delete this.store.state[namespace];
    }
  }

  /**
   * hasModel - 是否有指定model
   * @param namespace
   * @return {boolean}
   */
  hasModel(namespace) {
    return !!this.models.get(namespace);
  }

  /**
   * replacemodal - 替换一个model
   * @param model
   */
  replaceModel(model) {
    return this.model(model);
  }

  /**
   * getModel - 获取Model
   * @param namespace
   * @return Model
   */
  getModel(namespace) {
    return this.models.get(namespace);
  }

  /**
   * run - 运行generator(迭代model的effects)
   * @param g - 生成器函数类
   // * @param state - store的state (dispatch调用则是全局，如果在effects中使用put调用则是model中的state)
   * @param params - action的参数
   * @param model - 模型
   */
  run({ g, /* state, */ params, model }) {
    return new Promise((resolve, reject) => {
      // 生成器函数
      const generator = g(params, {
        call: Call,
        all: All,
        race: Race,
        // 这块应该传入所有model的state数据，而不是store的state数据
        select: Select(this /* state */),
        put: Put.call(this, {
          // state: state[model.namespace],
          // 全局的store
          store: this.store,
          params,
          model,
          // model,
          run: this.run.bind(this),
        }),
        // tack: null,
      });

      /**
       * task
       * @param data
       */
      function next(data) {
        return new Promise((s, e) => {
          /**
           * sucess
           * @param beginParams
           */
          function nextBegin(beginParams) {
            next(beginParams)
              .then((result) => {
                s(result);
              })
              .catch((err) => {
                generator.throw(err);
                e(err);
              });
          }

          /**
           * 拿一个(迭代)
           * call
           * put
           * select
           */
          const { value, done } = generator.next(data);

          // 没结束
          if (!done) {
            if (value instanceof Promise) {
              value
                .then((res) => {
                  nextBegin(res);
                })
                .catch((err) => {
                  generator.throw(err);
                  e(err);
                });
            } else {
              nextBegin(value);
            }
          }
          // 结束了
          else {
            s(value);
          }
        });
      }

      next()
        .then((result) => {
          // 所有任务都完成
          resolve(result);
        })
        .catch(() => {
          reject();
        });
    });
  }

  // /**
  //  * initSubscriptions
  //  * @param model
  //  */
  // initSubscriptions(model) {
  //   const { subscriptions = {} } = model;
  //   if (subscriptions) {
  //     const values = Object.values(subscriptions);
  //     values.forEach((v) => {
  //       v({
  //         dispatch: this.store.dispatch,
  //         history: this.history,
  //       });
  //     });
  //   }
  // }

  /**
   * clearUnSubscriptions
   * @param model
   */
  clearUnSubscriptions(model) {
    const { unsubscriptions = {} } = model;
    if (unsubscriptions) {
      const values = Object.values(unsubscriptions);
      values.forEach((v) => {
        v();
      });
    }
  }

  /**
   * init - 初始化所有model的state数据到store中
   * @param model - 一个model
   */
  init(model) {
    const { namespace, state } = model;

    // model中所有effect的loading值
    const modelEffectsLoading = {};

    const effectsKeys = Object.keys(model.effects);

    // 迭代一个model中的所有effect
    effectsKeys.forEach((k) => {
      // key -> namespace/effect的名字
      modelEffectsLoading[`${namespace}/${k}`] = false;
    });

    // /namespace/effects1 = false
    // /namespace/effects2 = false
    // /namespace/effects3 = false

    Object.assign(this.store.state.loading, modelEffectsLoading);
    // this.store.state.loading = modelEffectsLoading;
    // 在全局store中初始化model的数据
    this.store.state[namespace] =
      [namespace] in this.store.state ? this.store.state[namespace] : state;
    // Object.assign(this.store.state, {
    //   loading: Object.assign(this.store.state.loading || { global: false }, modelEffectsLoading),
    //   [namespace]: [namespace] in this.store.state ? this.store.state[namespace] : state,
    // });

    // this.initSubscriptions(model);
  }

  /**
   * isGlobalLoading
   * @return {boolean}
   */
  isGlobalLoading(/* model */) {
    const { loading } = this.store.state;

    return Array.from(this.models).some(([namespace, model]) => {
      // const { namespace } = model;
      return Array.from(Object.keys(model.effects)).some((key) => {
        const curType = `${namespace}/${key}`;
        return loading[curType] === true;
      });
    });

    // console.log('flag', flag);

    // return flag;

    // let globalLoading = false;
    // const { loading } = this.store.state;
    // for (const key of effectsKeys) {
    //   const curType = `${namespace}/${key}`;
    //   if (curType !== type) {
    //     if (loading[curType]) {
    //       globalLoading = true;
    //     }
    //   }
    // }
    // return globalLoading;
  }

  /**
   * before - saga中间件的before方法
   * @param state - store的数据
   * @param action - 事务
   * @return Promise
   */
  before({ state, action }) {
    return new Promise((resolve) => {
      // 获取action中的type
      const { type } = action;

      // 根据type获取namespace和effect
      const [namespace, effect] = type.split('/');

      // 根据命名空间获取model
      const model = this.models.get(namespace);

      // 如果存在model
      if (model) {
        // 获取effects的g g是一个生成器函数或者是一个reducer
        const g = model.effects[effect];

        // 如果是effect
        if (g) {
          // saga的before中修改了state的loading
          // eslint-disable-next-line no-param-reassign
          state.loading[type] = true;
          // eslint-disable-next-line no-param-reassign
          state.loading.global = true;

          // console.log('before', type, state.loading[type]);
          // console.log('before', 'global', state.loading.global);
        }

        resolve(state);
      } else {
        resolve(state);
      }

      // resolve(
      //   Object.assign(state, {
      //     loading: Object.assign(state.loading, {
      //       global: true,
      //       [type]: true,
      //     }),
      //   })
      // );
      // resolve(state);
    });
  }

  /**
   * after
   * @param state - store的数据
   * @param action
   * @return Promise
   */
  after({ state, action }) {
    return new Promise((resolve) => {
      // 类型，实例，和回调
      const { type, ins, success, ...params } = action;

      // 根据type获取namespace和effect
      const [namespace, effect] = type.split('/');

      // 根据命名空间获取model
      const model = this.models.get(namespace);

      if (model) {
        // 获取effects的g g是一个生成器函数
        const g = model.effects[effect];

        // 如果是effect
        if (g) {
          // 迭代model的effects,这里的state是全局的state
          this.run({ g, state, params, model }).then((result) => {
            // model的返回
            // TODO: 将在模型中改变的state同步到全局store的state中
            // loading变成false
            // eslint-disable-next-line no-param-reassign
            state.loading[type] = false;

            // 将在模型中改变的state同步到全局store的state中
            // eslint-disable-next-line no-param-reassign
            state[namespace] = model.state;
            // eslint-disable-next-line no-param-reassign
            state.loading.global = this.isGlobalLoading(/* model */);
            // console.log('after', 'effect', type, state.loading[type]);
            // console.log('after', 'effect', 'global', state.loading.global);

            // const result = Object.assign(state, {
            //   [namespace]: model.state,
            //   loading: Object.assign(this.store.state.loading, {
            //     global: this.isGlobalLoading(model, type),
            //     [type]: false,
            //   }),
            // });
            resolve(result);
          });
        }
        // 如果是reducer
        else if (model.reducers[effect]) {
          // 是reducers
          model.state = model.reducers[effect](state[namespace], { payload: params });

          // TODO: 将在模型中改变的state同步到全局store的state中
          // eslint-disable-next-line no-param-reassign
          state[namespace] = model.state;

          // state.loading[type] = false;
          // state.loading.global = this.isGlobalLoading(model);

          // console.log('after', 'reducers', type, state.loading[type]);
          // console.log('after', 'reducers', 'global', state.loading.global);

          resolve(state);
        }
      } else {
        // 没有model的返回
        resolve(state);
      }
    });
  }
}

export default () => new Saga();
