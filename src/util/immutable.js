export default {
  /**
   * cloneDeep
   * @param {Object | Array} - obj
   * @return {Object | Array}
   */
  cloneDeep(obj) {
    return JSON.parse(JSON.stringify(obj));
  },
};
