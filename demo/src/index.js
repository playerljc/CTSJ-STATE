import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, /* combineReducers, */ applyMiddleware } from '@ctsj/state/lib/state';
import { Provider } from '@ctsj/state/lib/react';
import { createLoggerMiddleware } from '@ctsj/state/lib/middleware';

import sage from './util/saga';
import model from './model/model';
import App from './components/App/app';

// import * as reducers from './reducers';
// const storeData = localStorage.getItem('ctsj-state-todolist') || '[]';

sage.model(model);

const store = createStore(
  // combineReducers(reducers),
  null,
  {},
  applyMiddleware(
    createLoggerMiddleware(),
    sage,
  )
);

store.subscribe(() => {
  const { todolist: { data = []} } = store.getState();
  localStorage.setItem('ctsj-state-todolist', JSON.stringify(data));
});

ReactDOM.render(
  (
    <Provider store={store}>
      <App />
    </Provider>
  ),
  document.getElementById('app')
);

