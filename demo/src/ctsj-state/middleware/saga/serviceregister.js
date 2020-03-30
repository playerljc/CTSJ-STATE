let Config;

/**
 * ServiceRegister
 * @class ServiceRegister
 * @classdesc 服务的注册
 */
export default {
  /**
   * initConfig - 服务注册初始化
   * @param config
   * namespace: service的实例
   */
  initConfig(config) {
    Config = config;
  },
  /**
   * mapDispatchToProps - 自动生成mapDispatchToProps
   * @param {string} - namespaces
   * @param {Function} - dispatch
   */
  mapDispatchToProps({ namespaces, dispatch }) {
    // service的实例
    const mapDispatchToProps = {};

    let keys = [];
    if (!namespaces) {
      keys = Object.keys(Config);
    } else {
      keys = namespaces;
    }

    keys.forEach(namespace => {
      const Service = Config[namespace];

      Object.keys(Service).forEach(key => {
        mapDispatchToProps[key] = function (params) {
          dispatch(Object.assign({ type: `${namespace}/${key}` }, params));
        };
      });
    });

    return mapDispatchToProps;
  },
  /**
   * model
   * @param {string} - namespace
   */
  model(namespace) {
    // service的实例
    const Service = Config[namespace];
    const model = {
      namespace,
      effects: {},
      reducers: {
        receive(state, { payload }) {
          return {
            ...state,
            ...payload,
          };
        },
      },
    };

    Object.keys(Service).forEach(key => {
      model.effects[key] = function*({ payload }, { call, put }) {
        const response = yield call(Service[key], payload);
        if (response.code === 200) {
          yield put({ type: 'receive', payload: { data: []} });
          yield put({ type: 'receive', payload: { data: response.list } });
        }
      };
    });

    return model;
  },
};
