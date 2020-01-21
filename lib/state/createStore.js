"use strict";var _interopRequireDefault=require("@babel/runtime/helpers/interopRequireDefault");Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=_default;var _classCallCheck2=_interopRequireDefault(require("@babel/runtime/helpers/classCallCheck")),_createClass2=_interopRequireDefault(require("@babel/runtime/helpers/createClass")),_immutable=_interopRequireDefault(require("../util/immutable"));function trigger(t){this.listeners.forEach(function(e){e(t)})}var Store=function(){function i(e){var t=1<arguments.length&&void 0!==arguments[1]?arguments[1]:{};(0,_classCallCheck2.default)(this,i),this.reducer=e,this.state=Object.assign({},t),this.listeners=[]}return(0,_createClass2.default)(i,[{key:"getState",value:function(){return _immutable.default.cloneDeep(this.state)}},{key:"dispatch",value:function(e){if(e instanceof Function)e(this.dispatch.bind(this));else{var t=this.reducer(_immutable.default.cloneDeep(this.state),e);this.state=_immutable.default.cloneDeep(t),trigger.call(this,e)}}},{key:"subscribe",value:function(t){var i=this;return this.listeners.push(t),function(){var e=i.listeners.indexOf(t);-1!==e&&i.listeners.splice(e,1)}}}]),i}();function _default(e,t){return new Store(e,t)}
//# sourceMappingURL=createStore.js.map