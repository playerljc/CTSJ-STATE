const logger = console;

/**
 * Logger
 * @class Logger
 * @classdesc store的state日志的记录
 */
class Logger {
  /**
   * before
   * @param state
   * @param action
   */
  before(state, action) {
    logger.group(
      '%caction %c%s @ %c%s',
      'color:gray',
      'color:#000',
      action.type,
      'color:gray',
      new Date()
    );
    logger.log('%cprev state', 'color:gray', state);
    logger.groupEnd();
  }

  /**
   * after
   * @param state
   * @param action
   */
  after(state, action) {
    logger.group(
      '%caction %c%s @ %c%s',
      'color:gray',
      'color:#000',
      action.type,
      'color:gray',
      new Date()
    );
    logger.log('%cnext state', 'color:green', state);
    logger.groupEnd();
  }
}

export default Logger;
