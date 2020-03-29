import Call from './call';
import All from './all';
import Race from './race';
import Select from './select';
import Put from './put';
import Immutable from '../../util/immutable';

/**
 * Saga
 * @class Saga
 * @classdesc Saga
 */
class Saga {
  constructor() {
    this.models = new Map();
  }

  /**
   * model - 添加一个model
   * @param model
   * @return {boolean}
   */
  model(model) {
    if (!model) return false;
    this.models.set(model.namespace, model);
    return true;
  }

  /**
   * unmodel - 注销一个model
   * @param namespace
   */
  unmodel(namespace) {
    this.models.delete(namespace);
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
    this.models(model);
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
   * init - 初始化所有model的state数据到store中
   */
  init() {
    const state = {};
    const entries = this.models.entries();
    for (const [namespace, model] of entries) {
      state[namespace] = model.state;
    }
    return state;
  }

  /**
   * before
   * @param state - store的数据
   * @param action
   * @return Promise
   */
  before(state, action) {
    return new Promise(resolve => resolve(state));
  }

  /**
   * after
   * @param state
   * @param action
   * @return Promise
   */
  after(state, action) {
    return new Promise(resolve => {
      const { type, ins, success, ...params } = action;

      if (type === Symbol.for('init')) {
        // 初始化的返回
        resolve(this.init());
      } else {
        // 其他情况
        const [namespace, effect] = type.split('/');

        // 根据命名空间获取model
        const model = this.models.get(namespace);
        if (model) {
          // 获取effects的g
          const g = model.effects[effect];

          // 迭代model的effects
          this.run({ g, state, params, model }).then(() => {
            // model的返回
            const result = Object.assign(state, { [namespace]: model.state });
            resolve(result);
          });
        } else {
          // 没有model的返回
          resolve(state);
        }
      }
    });
  }
}

export default () => new Saga();
