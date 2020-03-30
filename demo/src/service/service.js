import uuid from 'uuid/v1';

export const fetchList = () => {
  return new Promise(resolve => {
    const storeData = localStorage.getItem('ctsj-state-todolist') || '[]';
    setTimeout(() => {
      resolve({
        code: 200,
        list: JSON.parse(storeData),
      });
    },1000);
  });
};

export const fetchSave = (data, params) => {
  return new Promise(resolve => {
    data.push({
      id: uuid(),
      value: params.value,
      type: 'run', // completed
    });
    localStorage.setItem('ctsj-state-todolist', JSON.stringify(data));
    resolve({
      code: 200,
    });
  });
};

export const fetchUpdate = (data, id, value) => {
  return new Promise(resolve => {
    const index = data.findIndex(t => t.id === id);
    if (index !== -1) {
      data[index].value = value;
      localStorage.setItem('ctsj-state-todolist', JSON.stringify(data));
      resolve({
        code: 200,
      });
    }
  });
};

export const fetchDelete = (data, id) => {
  return new Promise(resolve => {
    const index = data.findIndex(t => t.id === id);
    if (index !== -1) {
      data.splice(index, 1);
      localStorage.setItem('ctsj-state-todolist', JSON.stringify(data));
      resolve({
        code: 200,
      });
    }
  });
};

export const fetchComplete = (data, id) => {
  return new Promise(resolve => {
    const index = data.findIndex(t => t.id === id);
    if (index !== -1) {
      data[index].type = 'complete';
      localStorage.setItem('ctsj-state-todolist', JSON.stringify(data));
      resolve({
        code: 200,
      });
    }
  });
};
