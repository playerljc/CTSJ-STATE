import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, combineReducers } from '@ctsj/state/lib/state';
import { Provider } from '@ctsj/state/lib/react';
import { addTodo, updateTodo, completeTodo, deleteTodo } from './reducers';
import App from './app';

const reducer = combineReducers({
  addTodo, updateTodo, completeTodo, deleteTodo,
});

const data = localStorage.getItem('ctsj-state-todolist');
const store = createStore(reducer, {
  data: data ? JSON.parse(data) : [],
});

store.subscribe(() => {
  const { data = []} = store.getState();
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

