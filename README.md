# CTSJ-STATE

- 一个简单的状态集管理(同时实现了 dva 数据流和 logger 中间件)

## 简介

- **把 redux、react-redux、redux-logger 和 dva 数据流结合起来的一个简版状态集**
- 本数据集的特点是增加了同步的回调功能和根据 Servive 自动生成 model 和 mapStateToProps、mapDispatchToProps 和 Model 功能

## 安装

```js
npm install @ctsj/state
```

## 目录

- [状态集本身](#状态集本身)
  - [createStore](#createStore)
  - [combineReducers](#combineReducers)
  - [Store](#Store)
- [React 中使用](#React中使用)
  - [Provider](#Provider)
  - [connect](#connect)
- [中间件](#中间件)
  - [logger 中间件](#logger中间件)
  - [saga 中间件](#saga中间件)
- [用 Service 自动生成 mapStateToProps、mapDispatchToProps 和 Model](#用Service自动生成mapStateToProps、mapDispatchToProps和Model)
- [使用 state 作为数据源](#使用state作为数据源)
  - [使用 class 的方式](#使用class的方式)
  - [使用 hooks 的方式](#使用hooks的方式)
- [ToDoList 的 demo](#ToDoList的demo)

## 状态集本身

**createStore** 说明：

- createStore(reducer,preloadedState) + reducer-和 redux 的 reducer 一致 + preloadedState-Store 的初始化值 例子：

```js
import { createStore } from '@ctsj/state/lib/state';

function reducer(state, action) {
  const { data = [] } = state;
  const { type } = action;
  switch (type) {
    case 'add':
      data.push({ id: 1 });
      break;
    default:
      break;
  }
  return state;
}

const store = createStore(reducer, { a: 1, b: 2 });
```

**combineReducers** 说明：

- reducers- Object
- 例子：

```js
reducer.jsx;

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
      const index = data.findIndex((t) => t.id === id);
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
      const index = data.findIndex((t) => t.id === id);
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
      const index = data.findIndex((t) => t.id === id);
      if (index !== -1) {
        data.splice(index, 1);
      }
      break;
    default:
      break;
  }
  return state;
}

index.jsx;

import { createStore, combineReducers } from '@ctsj/state/lib/state';
import { addTodo, updateTodo, completeTodo, deleteTodo } from './reducer';

const reducer = combineReducers({
  addTodo,
  updateTodo,
  completeTodo,
  deleteTodo,
});

const store = createStore(reducer, {
  data: [],
});
```

## Store

- 方法：
  - getStatus - 返回 state
  - subscribe - 监听 state 的数据变化,返回值是注销监听句柄
  - dispatch - action 发送数据改变

## React 中使用

**Provider** props：

- store - Store 例子：

```js
import { Provider } from '@ctsj/state/lib/react';
ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('app'),
);
```

**connect** 说明：

- mapStateToProps - 处理 state 到 props 的合并
- mapDispatchToProps - 用 dispatch 处理数据改变
- React 组件
- Callback - 渲染完成会后的回调函数 例子：

```js
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
            const {
              which,
              target: { value },
            } = e;
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

- **logger 中间件**

```js
import { createStore, applyMiddleware } from '@ctsj/state/lib/state';
import { createLoggerMiddleware } from '@ctsj/state/lib/middleware';

const store = createStore(null, {}, applyMiddleware(createLoggerMiddleware()));
```

- **saga 中间件**和 dva 用法一致
  - 引入

```js
import { createStore, applyMiddleware } from '@ctsj/state/lib/state';
import { createSagaMiddleware } from '@ctsj/state/lib/middleware';

const store = createStore(null, {}, applyMiddleware(createSagaMiddleware()));
```

- Model

```js
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
```

## 用 Service 自动生成 mapStateToProps、mapDispatchToProps 和 Model

- [具体请参开此链接](https://github.com/playerljc/CTSJ-DvaGenerator)

## 使用 state 作为数据源

有的时候使用者其实想使用 model 的整体处理数据的能力，但组件间又没有共享数据的交换，这个是后就可以把数据源设置成 state，现在就可以实现使用 state 作为数据源，同时也能使用 model 处理数据的能力。

- **使用 class 的方式** 使用 createState 方法对 state 进行包装即可

```javascript
import ServiceRegister from '@ctsj/state/lib/middleware/saga/serviceregister';
import createState from '@ctsj/state/lib/react/createState';

class UserList extends React.Component {
  constructor(props) {
    super(props);

    // 初始化的state数据
    this.state = {

    }

    const models = [];
    const requireComponent = require.context('../../../../model', false, /.*\.(js)$/);
    requireComponent.keys().forEach((fileName) => {
      const model = requireComponent(fileName);
      models.push(model.default());
    });

    // 使用createState对state进行包装
    this.unsubscribe = createState({
      initialState: Object.assign({}, this.state),
      models,
      mapState: (state) =>
        Object.assign(
          ServiceRegister.mapStateToProps({
            namespaces: [serviceName],
            state,
          }),
          {
            loading: state.loading,
          },
        ),
      mapDispatch: (dispatch) =>
        ServiceRegister.mapDispatchToProps({
          namespaces: [serviceName],
          dispatch,
        }),
      ref: this,
      middleWares: [],
      reducer: null,
    });
  }

  componentWillUnmount() {
    // 销毁的时候注销
    this.unsubscribe();
  }

  ......

}
```

- **使用 hooks 的方式**

```javascript
import { useSagaState } from '@ctsj/state/lib/react';
import ServiceRegister from '@ctsj/state/lib/middleware/saga/serviceregister';

export default () => {
  useEffect(() => {
    // 加载数据
  }, []);

  const models = [];
  const requireComponent = require.context('../../../../model', false, /.*\.(js)$/);
  requireComponent.keys().forEach((fileName) => {
    const model = requireComponent(fileName);
    models.push(model.default());
  });

  // 使用useSagaState对state进行包装
  const state = useSagaState({
    initialState: {},
    models,
    mapState: (state) =>
      Object.assign(
        ServiceRegister.mapStateToProps({
          namespaces: [serviceName],
          state,
        }),
        {
          loading: state.loading,
        },
      ),
    mapDispatch: (dispatch) =>
      ServiceRegister.mapDispatchToProps({
        namespaces: [serviceName],
        dispatch,
      }),
    middleWares: [],
    reducer: null,
  });
  
  ......

};
```

## ToDoList

进入 demo 目录

1. npm install
2. npm run startapp
3. 浏览器输入 localhost:8000
