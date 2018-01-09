import { listUsers } from '../services/users';

// import { xxx } from '../services/xxx';
export default {
  namespace: 'users',
  state: {
    data: {
      list: [],
      pagination: {},
    },
    loading: true,
  },
  effects: {
    *fetch({ payload }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(listUsers, payload);
      // 需要确保response正确么？
      yield put({
        type: 'save',
        payload: response,
      });
      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },
  },
  reducers: {
    save(state, action) {
      return {
        ...state,
        data: action.payload,
      };
    },
    changeLoading(state, action) {
      return {
        ...state,
        loading: action.payload,
      };
    },
  },
};

