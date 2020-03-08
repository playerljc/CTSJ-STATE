/**
 * Store
 * @class Store
 * @classdesc Store
 */
declare class Store {
    reducer: any;
    state: any;
    listeners: ((action: any) => {})[];
    /**
     * constrcutor
     * @param {Function} - reducer
     * @param {Object | Array} - preloadedState
     */
    constructor(reducer: any, preloadedState?: any);
    /**
     * getState
     * @return {Object}
     */
    getState(): any;
    /**
     * dispatch
     * @param {Object | Function} - action
     */
    dispatch(action: any): void;
    /**
     * subscribe
     * @param {Function} - listener
     * @return {Function}
     */
    subscribe(listener: (action: any) => {}): () => void;
}
/**
 * createStore
 * @param {Function} - reducer
 * @param {Object | Array} preloadedState
 * @return {Store}
 */
export default function (reducer: any, preloadedState: any): Store;
export {};
