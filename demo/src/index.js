import React from 'react';
import ReactDOM from 'react-dom';
import {
  createStore,
  /* combineReducers, */ applyMiddleware,
} from '@ctsj/state/lib/state';
import { Provider } from '@ctsj/state/lib/react';
import { createLoggerMiddleware } from '@ctsj/state/lib/middleware';

import ServiceRegister from '@ctsj/state/lib/middleware/saga/serviceregister';
import * as Service from './service/service';

import sage from './util/saga';
import model from './model/model';
import App from './components/App/app';

ServiceRegister.initConfig({
  todolist: Service,
});

// import * as reducers from './reducers';
const storeData = localStorage.getItem('ctsj-state-todolist') || '[]';

const store = createStore(
  // combineReducers(reducers),
  null,
  {
    todolist: {
      data: JSON.parse(storeData),
    },
  },
  applyMiddleware(createLoggerMiddleware(), sage)
);

sage.model(model);

store.subscribe(() => {
  const {
    todolist: { data = []},
  } = store.getState();
  localStorage.setItem('ctsj-state-todolist', JSON.stringify(data));
});

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('app')
);
