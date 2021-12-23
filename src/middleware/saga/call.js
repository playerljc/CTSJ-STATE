/**
 * call - 异步调用
 * @param func
 * @param args
 */
export default (func, ...args) => {
  let context = typeof window !== 'undefined' ? window : this;
  let fn;
  if (func instanceof Array) {
    [context, fn] = func;
  } else {
    fn = func;
  }

  return fn.apply(context, args);
};
