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
