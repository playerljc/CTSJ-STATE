import {
  list,
  save,
  del,
  complete,
  update,
} from '../service/service';

export default {
  namespace: 'todolist',
  state: {
    data: [],
  },
  effects: {
    *fetchList(params, { call, put }) {
      const res = yield call(list);
      if (res.code === 200) {
        yield put({ type: 'receive', payload: { data: res.list } });
      }
    },
    *fetchSave(params, { call, put, select }) {
      const data = yield select((state) => {
        return state.todolist.data;
      });
      const res = yield call(save, data, params);
      if (res.code === 200) {
        yield put({ type: 'fetchList' });
      }
    },
    *fetchDelete(params, { call, put, select }) {
      const data = yield select((state) => {
        return state.todolist.data;
      });
      const res = yield call(del, data, params.id);
      if (res.code === 200) {
        yield put({ type: 'fetchList' });
      }
    },
    *fetchComplete(params, { call, put, select }) {
      const data = yield select((state) => {
        return state.todolist.data;
      });
      const res = yield call(complete, data, params.id);
      if (res.code === 200) {
        yield put({ type: 'fetchList' });
      }
    },
    *fetchUpdate(params, { call, put, select }) {
      const data = yield select((state) => {
        return state.todolist.data;
      });
      const res = yield call(update, data, params.id, params.value);
      if (res.code === 200) {
        yield put({ type: 'fetchList' });
      }
    },
  },
  reducers: {
    receive(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
  },
};
