"use strict";var _interopRequireDefault=require("@babel/runtime/helpers/interopRequireDefault");require("core-js/modules/es.array.concat"),require("core-js/modules/es.array.for-each"),require("core-js/modules/es.function.bind"),require("core-js/modules/web.dom-collections.for-each"),Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=void 0;var _slicedToArray2=_interopRequireDefault(require("@babel/runtime/helpers/slicedToArray")),_defineProperty2=_interopRequireDefault(require("@babel/runtime/helpers/defineProperty")),_toConsumableArray2=_interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray")),_classCallCheck2=_interopRequireDefault(require("@babel/runtime/helpers/classCallCheck")),_createClass2=_interopRequireDefault(require("@babel/runtime/helpers/createClass")),_react=require("react"),_createStore=_interopRequireDefault(require("../state/createStore")),_applyMiddleware=_interopRequireDefault(require("../state/applyMiddleware")),_middleware=require("../middleware");function ownKeys(r,e){var t,a=Object.keys(r);return Object.getOwnPropertySymbols&&(t=Object.getOwnPropertySymbols(r),e&&(t=t.filter(function(e){return Object.getOwnPropertyDescriptor(r,e).enumerable})),a.push.apply(a,t)),a}function _objectSpread(r){for(var e=1;e<arguments.length;e++){var t=null!=arguments[e]?arguments[e]:{};e%2?ownKeys(Object(t),!0).forEach(function(e){(0,_defineProperty2.default)(r,e,t[e])}):Object.getOwnPropertyDescriptors?Object.defineProperties(r,Object.getOwnPropertyDescriptors(t)):ownKeys(Object(t)).forEach(function(e){Object.defineProperty(r,e,Object.getOwnPropertyDescriptor(t,e))})}return r}var SagaState=function(){function s(e){(0,_classCallCheck2.default)(this,s);var r=e.initialState,t=e.models,a=void 0===t?[]:t,i=e.middleWares,t=e.reducer;this.params=e,this.saga=(0,_middleware.createSagaMiddleware)(),this.store=(0,_createStore.default)(t,r,_applyMiddleware.default.apply(void 0,(0,_toConsumableArray2.default)(i).concat([this.saga]))),this.registerModels({models:a,saga:this.saga})}return(0,_createClass2.default)(s,[{key:"registerModels",value:function(e){var r=e.saga;e.models.forEach(function(e){r.model(e)})}},{key:"mapTo",value:function(){var e=this.params,r=e.mapState,t=e.mapDispatch,e={};t&&(e=t(this.store.dispatch.bind(this.store)));t={};return r&&(t=r(this.getState())),{dispatch:e,props:t}}},{key:"getReducer",value:function(){return function(e,r){var t=r.type,a=r.params,r=a.props,a=a.dispatch;return"setState"===t?_objectSpread(_objectSpread(_objectSpread({},e),r),a):e}}},{key:"getInitial",value:function(){var e=this.mapTo(),r=e.props,e=e.dispatch;return _objectSpread(_objectSpread({},r),e)}},{key:"subscribe",value:function(e){return this.onSubscribe=this.onSubscribe.bind(this,e),this.store.subscribe(this.onSubscribe)}},{key:"getState",value:function(){return this.store.getState()}},{key:"onSubscribe",value:function(e){var r=this.mapTo();e({type:"setState",params:{props:r.props,dispatch:r.dispatch}})}}]),s}(),_default=function(e){var r=(0,_react.useRef)(new SagaState(e));(0,_react.useEffect)(function(){var e=r.current.subscribe(a);return function(){e()}});var t=(0,_react.useReducer)(r.current.getReducer(),r.current.getInitial()),e=(0,_slicedToArray2.default)(t,2),t=e[0],a=e[1];return t};exports.default=_default;
//# sourceMappingURL=useSagaState.js.map