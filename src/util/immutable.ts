export default {
  /**
     * cloneDeep
     * @param {Object | Array} - obj
     * @return {Object | Array}
     */
  cloneDeep(obj: any): any {
    return JSON.parse(JSON.stringify(obj));
  },
};
