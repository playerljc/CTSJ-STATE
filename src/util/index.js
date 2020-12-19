/**
 * isEmpty - 对象是否为空
 * @param value
 */
export function isEmpty(value) {
  if (value === null || value === '' || value === undefined) return true;

  return false;
}

/**
 * isArray - 判断数组
 * @param obj
 * @return {boolean}
 */
export function isArray(obj) {
  return Array.isArray(obj);
}

/**
 * isNumber - 判断是否是number
 * @param val
 * @return {boolean}
 */
export function isNumber(val) {
  return !isObject(val) && !isArray(val) && !isFunction(val) && typeof val === 'number';
}

/**
 * isBoolean - 判断是否是boolean
 * @param val
 * @return {boolean}
 */
export function isBoolean(val) {
  return (typeof val).toLowerCase() === 'boolean';
}

/**
 * isString - 判断是否是string
 * @param val
 * @return {boolean}
 */
export function isString(val) {
  return (typeof val).toLowerCase() === 'string';
}

/**
 * isFunction - 判断函数
 * @param obj
 * @return {boolean}
 */
export function isFunction(obj) {
  return obj instanceof Function;
}

/**
 * isObject - 是否是对象
 * @param obj
 * @return {boolean}
 */
export function isObject(obj) {
  return obj instanceof Object && !Array.isArray(obj) && !(obj instanceof Function);
}
