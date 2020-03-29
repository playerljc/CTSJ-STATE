import uuid from '_uuid@3.4.0@uuid/v1';

export const list = () => {
  return new Promise(resolve => {
    const storeData = localStorage.getItem('ctsj-state-todolist') || '[]';
    console.log(storeData);
    resolve({
      code: 200,
      list: JSON.parse(storeData),
    });
  });
};

export const save = (data, params) => {
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

export const update = (data, id, value) => {
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

export const del = (data, id) => {
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

export const complete = (data, id) => {
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
