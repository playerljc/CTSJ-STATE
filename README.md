# CTSJ-STATE

* **一个简单的状态集管理(同时实现了dva数据流和logger中间件)*

## 简介

* **把redux、react-redux、redux-logger和dva数据流结合起来的一个简版状态集**
* **本数据集的特点是增加了同步的回调功能和根据Servive自动生成model和mapStateToProps、mapDispatchToProps和Model功能*

## 安装

`
<pre>
	npm install @ctsj/state
</pre>
`

## 目录

* [状态集本身](#state)
  - [createStore](#createstore)
  - [combineReducers](#combinereducers)
  - [Store](#store)
* [React中使用](#reactuse)
  - [Provider](#provider)
  - [connect](#connect)
* [中间件](#middleware)
  - [logger中间件](#logger)
  - [saga中间件](#saga)
* [用Service自动生成mapStateToProps、mapDispatchToProps和Model](#servicegenerator)
* [ToDoList的demo](#todolist)

## 状态集本身

***createStore** 说明：
  - createStore(reducer,preloadedState)
    + reducer-和redux的reducer一致
    + preloadedState-Store的初始化值 例子：

```

import { createStore } from '@ctsj/state/lib/state';

function reducer(state,action) {
  const {data = []} = state;
  const { type } = action;
  switch (type) {
    case 'add':
      data.push({id:1});
      break;
    default:
      break;
  }
  return state;
}

const store = createStore(reducer, {a:1,b:2});
```
***combineReducers** 说明：
  - reducers- Object 例子：

```

reducer.jsx

import uuid from 'uuid/v1';

/**
 * addTodo
 * @param {Object} - state
 * @param {Object} - action
 * @return {Array}
 */
export function addTodo(state, action) {
  const { type, value } = action;
  const { data = [] } = state;

  switch (type) {
    case 'add':
      data.push({
        id: uuid(),
        value,
        type: 'run', // completed
      });
      break;
    default:
      break;
  }
  return state;
}

/**
 * updateTodo
 * @param {Object} - state
 * @param {Object} - action
 * @return {Object|Array}
 */
export function updateTodo(state, action) {
  const { data = [] } = state;
  const { id, value, type } = action;
  switch (type) {
    case 'update':
      const index = data.findIndex(t => t.id === id);
      if (index !== -1) {
        data[index].value = value;
      }
      break;
    default:
      break;
  }
  return state;
}

/**
 * completeTodo
 * @param {Object} - state
 * @param {Object} - action
 * @return {Array}
 */
export function completeTodo(state, action) {
  const { data = [] } = state;
  const { id, type } = action;
  switch (type) {
    case 'complete':
      const index = data.findIndex(t => t.id === id);
      if (index !== -1) {
        data[index].type = 'complete';
      }
      break;
    default:
      break;
  }
  return state;
}

/**
 * deleteTodo
 * @param {Object} - state
 * @param {Object} - action
 * @return {Object|Array}
 */
export function deleteTodo(state, action) {
  const { data = [] } = state;
  const { id } = action;
  switch (action.type) {
    case 'delete':
      const index = data.findIndex(t => t.id === id);
      if (index !== -1) {
        data.splice(index, 1);
      }
      break;
    default:
      break;
  }
  return state;
}

index.jsx

import { createStore, combineReducers } from '@ctsj/state/lib/state';
import {addTodo, updateTodo, completeTodo, deleteTodo} from './reducer';

const reducer = combineReducers({
  addTodo, updateTodo, completeTodo, deleteTodo,
});

const store = createStore(reducer, {
  data: [],
});
```

## Store

* 方法：
  - getStatus - 返回state
  - subscribe - 监听state的数据变化,返回值是注销监听句柄
  - dispatch - action 发送数据改变

## React中使用

***Provider** props：
  - store - Store 例子：

```

import { Provider } from '@ctsj/state/lib/react';
ReactDOM.render(
  (
    <Provider store={store}>
      <App />
    </Provider>
  ),
  document.getElementById('app')
);
```
***connect** 说明：
  - mapStateToProps - 处理state到props的合并
  - mapDispatchToProps - 用dispatch处理数据改变
  - React组件
  - Callback - 渲染完成会后的回调函数 例子：

```

import React from 'react';
import { connect } from '@ctsj/state/lib/react';
import Immutable from '@ctsj/state/lib/util/immutable';

import './header.less';

const selectorPrefix = 'ctsj-state-todolist';

/**
 * Header
 * @param onAdd
 * @return {*}
 * @constructor
 */
function Header({ onAdd }) {
  return (
    <div className="header">
      <div className="title">ToDoList</div>
      <div className="input">
        <input
            placeholder="&#x6DFB;&#x52A0;ToDo"
            type="text"
            onKeyUp={(e) => {
              const { which, target: { value } } = e;
              if (which === 13) {
                onAdd(value);
              }
            }}
        />
      </div>
    </div>
  );
}

const mapStateToProps = (state) => {
  return Immutable.cloneDeep(state);
};

const mapDispatchToProps = (dispatch) => {
  return {
    onAdd: (value) => {
      dispatch({
        type: 'add',
        value,
      });
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Header);

```

## 中间件

* **logger中间件** `
			<pre>
import {
  createStore,
  applyMiddleware,
} from '@ctsj/state/lib/state';
import { createLoggerMiddleware } from '@ctsj/state/lib/middleware';

const store = createStore(
  null,
  {},
  applyMiddleware(createLoggerMiddleware())
);
			</pre>
		`
* **saga中间件**和dva用法一致
  - 引入 `
					<pre>
import {
  createStore,
  applyMiddleware,
} from '@ctsj/state/lib/state';
import { createSagaMiddleware } from '@ctsj/state/lib/middleware';

const store = createStore(
  null,
  {},
  applyMiddleware(createSagaMiddleware())
);
					</pre>
				`
  - Model `
					<pre>
export default {
	namespace: 'todolist',
	state:{
		data: [],
	},
	effects: {
		*fetchList(params.{call,all,put,select}){
			...
		}
	},
	reducers: {
		receive(state, { payload }) {
			return {
				...state,
				...payload,
			};
		},
	},
}
					</pre>
				`

## 用Service自动生成mapStateToProps、mapDispatchToProps和Model

* [具体请参开此链接](https://github.com/playerljc/CTSJ-DvaGenerator)

## ToDoList

进入demo目录

1. npm install
2. npm run startapp
3. 浏览器输入localhost:8000
