/**
 * applyMiddleware - 组合所有中间件
 * @param {Array} - middlewares
 * @return {Array}
 */
export default (...middlewares) => middlewares.map(middleware => middleware);
