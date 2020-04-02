/**
 * race
 * @param promises
 */
export default (...promises) => {
  return Promise.race(promises);
};
