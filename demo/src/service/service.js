import uuid from 'uuid/v1';

function getStoreData() {
  const storeData = localStorage.getItem('ctsj-state-todolist') || '[]';
  return JSON.parse(storeData);
}

/**
 * fetchList
 * @return {Promise<any>}
 */
export const fetchList = () => {
  return new Promise(resolve => {
    const storeData = localStorage.getItem('ctsj-state-todolist') || '[]';
    setTimeout(() => {
      resolve({
        code: 200,
        data: JSON.parse(storeData),
      });
    }, 1000);
  });
};

/**
 * fetchSave
 * @param params
 * @return {Promise<any>}
 */
export const fetchSave = params => {
  return new Promise(resolve => {
    const data = getStoreData();
    data.push({
      id: uuid(),
      value: params.value,
      type: 'run', // completed
    });
    localStorage.setItem('ctsj-state-todolist', JSON.stringify(data));
    resolve({
      code: 200,
      data: true,
    });
  });
};

/**
 * fetchUpdate
 * @param id
 * @param value
 * @return {Promise<any>}
 */
export const fetchUpdate = ({ id, value }) => {
  return new Promise(resolve => {
    const data = getStoreData();
    const index = data.findIndex(t => t.id === id);
    if (index !== -1) {
      data[index].value = value;
      localStorage.setItem('ctsj-state-todolist', JSON.stringify(data));
      resolve({
        code: 200,
        data: true,
      });
    }
  });
};

/**
 * fetchDelete
 * @param id
 * @return {Promise<any>}
 */
export const fetchDelete = ({ id }) => {
  return new Promise(resolve => {
    const data = getStoreData();
    const index = data.findIndex(t => t.id === id);
    if (index !== -1) {
      data.splice(index, 1);
      localStorage.setItem('ctsj-state-todolist', JSON.stringify(data));
      resolve({
        code: 200,
        data: true,
      });
    }
  });
};

/**
 * fetchComplete
 * @param id
 * @return {Promise<any>}
 */
export const fetchComplete = ({ id }) => {
  return new Promise(resolve => {
    const data = getStoreData();
    const index = data.findIndex(t => t.id === id);
    if (index !== -1) {
      data[index].type = 'complete';
      localStorage.setItem('ctsj-state-todolist', JSON.stringify(data));
      resolve({
        code: 200,
        data: true,
      });
    }
  });
};

export default {
  codeKey: 'code',
  codeSuccessKey: 200,
  dataKey: 'data',
  messageKey: 'message',
};
