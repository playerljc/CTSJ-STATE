export default (...middlewares) => {
  return middlewares.map(Middleware => new Middleware());
};
