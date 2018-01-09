import { listUsers, addUser, removeUser } from '../services/users';

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
    *remove({ payload: { id }, callback }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      // 逐个删除 成功就从list中移除
      for (const myId of id) {
        const response = yield call(removeUser, myId);
        if (response.ok) {
          yield put({
            type: 'removeOne',
            payload: myId,
          });
        }
      }
      yield put({
        type: 'changeLoading',
        payload: false,
      });
      if (callback) {
        callback();
      }
    },
    *add({ payload, callback }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(addUser, payload);
      yield put({
        type: 'changeLoading',
        payload: false,
      });
      if (response.ok && callback) {
        callback();
      }
    },
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
    removeOne(state, action) {
      const newState = { ...state };
      newState.data.list = newState.data.list.filter(record => record.id !== action.payload);
      return newState;
    },
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

