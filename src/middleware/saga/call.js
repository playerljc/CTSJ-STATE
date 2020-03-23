/**
 * call - 异步调用
 * @param {Function | Array<Context,Function>} - func
 * @param {Array} - args
 */
export default (func, ...args) => {
  let context = window;
  let fn;
  if (func instanceof Array) {
    [context, fn] = func;
  } else {
    fn = func;
  }

  return fn.apply(context, args);
};
