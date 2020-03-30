import { fetchList, fetchSave, fetchDelete, fetchComplete, fetchUpdate } from '../service/service';

export default {
  namespace: 'todolist',
  state: {
    data: [],
  },
  subscriptions: {
    setup({ history, dispatch }) {
      console.log('todolist', 'setup');
      // return history.listen(({ pathname }) => {
      //   console.log(pathname);
      // });
    },
  },
  effects: {
    *fetchList(params, { call, put }) {
      const res = yield call(fetchList);
      if (res.code === 200) {
        yield put({ type: 'receive', payload: { data: res.list } });
      }
    },
    *fetchSave(params, { call, put, select }) {
      const data = yield select(state => {
        return state.todolist.data;
      });
      const res = yield call(fetchSave, data, params);
      if (res.code === 200) {
        yield put({ type: 'fetchList' });
      }
    },
    *fetchDelete(params, { call, put, select }) {
      const data = yield select(state => {
        return state.todolist.data;
      });
      const res = yield call(fetchDelete, data, params.id);
      if (res.code === 200) {
        yield put({ type: 'fetchList' });
      }
    },
    *fetchComplete(params, { call, put, select }) {
      const data = yield select(state => {
        return state.todolist.data;
      });
      const res = yield call(fetchComplete, data, params.id);
      if (res.code === 200) {
        yield put({ type: 'fetchList' });
      }
    },
    *fetchUpdate(params, { call, put, select }) {
      const data = yield select(state => {
        return state.todolist.data;
      });
      const res = yield call(fetchUpdate, data, params.id, params.value);
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
