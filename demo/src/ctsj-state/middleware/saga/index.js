import Call from './call';
import All from './all';
import Race from './race';
import Select from './select';
import Put from './put';
import History from './history';
import Immutable from '../../util/immutable';

/**
 * Saga
 * @class Saga
 * @classdesc Saga
 */
class Saga {
  constructor() {
    this.models = new Map();
    this.history = History;
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
   * unmodel - 注销一个model
   * @param namespace
   */
  unmodel(namespace) {
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
   * run - 运行generator
   * @param g - 生成器函数类
   * @param state - store的state
   * @param params - action的参数
   * @param model - 模型
   */
  run({ g, state, params, model }) {
    return new Promise((resolve, reject) => {
      // 获取指针
      const generator = g(params, {
        call: Call,
        all: All,
        race: Race,
        select: Select(Immutable.cloneDeep(state)),
        put: Put({
          state: state[model.namespace],
          params,
          model,
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
           * @param neginParams
           */
          function nextBegin(neginParams) {
            next(neginParams)
              .then(() => {
                s();
              })
              .catch(err => {
                generator.throw(err);
                e(err);
              });
          }

          /**
           * 拿一个
           * call
           * put
           * select
           */
          const { value, done } = generator.next(data);
          if (!done) {
            if (value instanceof Promise) {
              value
                .then(res => {
                  nextBegin(res);
                })
                .catch(err => {
                  generator.throw(err);
                  e(err);
                });
            } else {
              nextBegin(value);
            }
          } else {
            s();
          }
        });
      }

      next()
        .then(() => {
          // 所有任务都完成
          resolve();
        })
        .catch(() => {
          reject();
        });
    });
  }

  /**
   * initSubscriptions
   * @param model
   */
  initSubscriptions(model) {
    const { subscriptions = {} } = model;
    if (subscriptions) {
      const values = Object.values(subscriptions);
      values.forEach(v => {
        v({
          dispatch: this.store.dispatch,
          history: this.history,
        });
      });
    }
  }

  /**
   * clearUnSubscriptions
   * @param model
   */
  clearUnSubscriptions(model) {
    const { unsubscriptions = {} } = model;
    if (unsubscriptions) {
      const values = Object.values(unsubscriptions);
      values.forEach(v => {
        v();
      });
    }
  }

  /**
   * init - 初始化所有model的state数据到store中
   * @param model
   */
  init(model) {
    const { namespace, state } = model;

    const modelEffectsLoading = {};
    const effectsKeys = Object.keys(model.effects);
    effectsKeys.forEach(k => {
      modelEffectsLoading[`${namespace}/${k}`] = false;
    });
    Object.assign(this.store.state, {
      loading: Object.assign(
        this.store.state.loading || { global: false },
        modelEffectsLoading
      ),
      [namespace]: [namespace] in this.store.state ? this.store.state[namespace] : state,
    });

    this.initSubscriptions(model);
  }

  isGlobalLoading(model, type) {
    const { namespace } = model;

    const effectsKeys = Object.keys(model.effects);

    let globalLoading = false;
    const { loading } = this.store.state;
    for (const key of effectsKeys) {
      const curType = `${namespace}/${key}`;
      if (curType !== type) {
        if (loading[curType]) {
          globalLoading = true;
        }
      }
    }
    return globalLoading;
  }

  /**
   * before
   * @param state - store的数据
   * @param action
   * @return Promise
   */
  before({ state, action }) {
    return new Promise(resolve => {
      const { type } = action;

      resolve(
        Object.assign(state, {
          loading: Object.assign(state.loading, {
            global: true,
            [type]: true,
          }),
        })
      );
    });
  }

  /**
   * after
   * @param state
   * @param action
   * @return Promise
   */
  after({ state, action }) {
    return new Promise(resolve => {
      const { type, ins, success, ...params } = action;

      const [namespace, effect] = type.split('/');

      // 根据命名空间获取model
      const model = this.models.get(namespace);
      if (model) {
        // 获取effects的g
        const g = model.effects[effect];

        // 迭代model的effects
        this.run({ g, state, params, model }).then(() => {
          // model的返回
          const result = Object.assign(state, {
            [namespace]: model.state,
            loading: Object.assign(this.store.state.loading, {
              global: this.isGlobalLoading(model, type),
              [type]: false,
            }),
          });
          resolve(result);
        });
      } else {
        // 没有model的返回
        resolve(state);
      }
    });
  }
}

export default () => new Saga();
