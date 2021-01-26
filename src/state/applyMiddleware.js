/**
 * applyMiddleware - 组合所有中间件
 * @return {Array}
 * @param middlewares
 */
export default (...middlewares) => middlewares.map((middleware) => middleware);
