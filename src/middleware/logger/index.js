const logger = console;

/**
 * Logger
 * @class Logger
 * @classdesc store的state日志的记录
 */
class Logger {
  setStore(store) {
    this.store = store;
  }

  /**
   * before
   * @param state
   * @param action
   * @return Promise
   */
  // eslint-disable-next-line class-methods-use-this
  before({ state, action }) {
    return new Promise((resolve) => {
      logger.group(
        '%caction %c%s @ %c%s',
        'color:gray',
        'color:#000',
        action.type,
        'color:gray',
        new Date(),
      );
      logger.log('%cprev state', 'color:gray', state);
      logger.groupEnd();
      resolve(state);
    });
  }

  /**
   * after
   * @param state
   * @param action
   * @return Promise
   */
  // eslint-disable-next-line class-methods-use-this
  after({ state, action }) {
    return new Promise((resolve) => {
      logger.group(
        '%caction %c%s @ %c%s',
        'color:gray',
        'color:#000',
        action.type,
        'color:gray',
        new Date(),
      );
      logger.log('%cnext state', 'color:green', state);
      logger.groupEnd();
      resolve(state);
    });
  }
}

export default () => {
  return new Logger();
};
