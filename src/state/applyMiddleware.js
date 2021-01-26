/**
 * applyMiddleware - 组合所有中间件
 * @param middleWares
 * @return {Array}
 */
export default (...middleWares) => middleWares.map((middleware) => middleware);
