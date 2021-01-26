export default {
  /**
   * cloneDeep
   * @param obj
   * @return {Object | Array}
   */
  cloneDeep(obj) {
    return JSON.parse(JSON.stringify(obj));
  },
};
