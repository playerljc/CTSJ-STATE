"use strict";var _interopRequireDefault=require("@babel/runtime/helpers/interopRequireDefault");require("core-js/modules/es.array.concat"),require("core-js/modules/es.array.for-each"),require("core-js/modules/es.function.bind"),require("core-js/modules/es.object.assign"),require("core-js/modules/web.dom-collections.for-each"),Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=void 0;var _toConsumableArray2=_interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray")),_objectWithoutProperties2=_interopRequireDefault(require("@babel/runtime/helpers/objectWithoutProperties")),_defineProperty2=_interopRequireDefault(require("@babel/runtime/helpers/defineProperty")),_immutable=_interopRequireDefault(require("../util/immutable")),_createStore=_interopRequireDefault(require("../state/createStore")),_applyMiddleware=_interopRequireDefault(require("../state/applyMiddleware")),_middleware=require("../middleware");function ownKeys(r,e){var t,a=Object.keys(r);return Object.getOwnPropertySymbols&&(t=Object.getOwnPropertySymbols(r),e&&(t=t.filter(function(e){return Object.getOwnPropertyDescriptor(r,e).enumerable})),a.push.apply(a,t)),a}function _objectSpread(r){for(var e=1;e<arguments.length;e++){var t=null!=arguments[e]?arguments[e]:{};e%2?ownKeys(Object(t),!0).forEach(function(e){(0,_defineProperty2.default)(r,e,t[e])}):Object.getOwnPropertyDescriptors?Object.defineProperties(r,Object.getOwnPropertyDescriptors(t)):ownKeys(Object(t)).forEach(function(e){Object.defineProperty(r,e,Object.getOwnPropertyDescriptor(t,e))})}return r}function registerModels(e){var r=e.saga;e.models.forEach(function(e){r.model(e)})}var _default=function(e){var r=e.initialState,t=e.models,a=void 0===t?[]:t,o=e.mapState,i=e.mapDispatch,u=e.ref,s=e.middleWares,t=e.reducer;function n(){var e={};i&&(e=i(c.dispatch.bind(c)));var r={};return o&&(r=o(c.getState())),{dispatch:e,props:r}}var e=(0,_middleware.createSagaMiddleware)(),c=(0,_createStore.default)(t,r,_applyMiddleware.default.apply(void 0,(0,_toConsumableArray2.default)(s).concat([e]))),l=c.subscribe(function(t){var e=(r=n()).props,r=r.dispatch;u.setState(_objectSpread(_objectSpread({},e),r),function(){var e=t.success,r=(0,_objectWithoutProperties2.default)(t,["success"]);e&&e.call(u,_immutable.default.cloneDeep(r))})});registerModels({models:a,saga:e}),u.state||(u.state={});a=n(),e=a.props,a=a.dispatch;return Object.assign(u.state,e,a,{dispatch:c.dispatch.bind(c)}),function(){l()}};exports.default=_default;
//# sourceMappingURL=createState.js.map