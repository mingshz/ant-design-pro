import { stringify } from 'qs';
import { getProjects, addProjects } from '../services/projects';

export default {
  namespace: 'projects',
  state: {
    list: [],
    loading: true,
  },
  effects: {
    *add({ payload, callback }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(addProjects, payload);
      yield put({
        type: 'changeLoading',
        payload: false,
      });
      if (response.ok && callback) {
        callback();
      }
    },
    *fetch(_, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const list = yield call(getProjects);
      if (Array.isArray(list)) {
        // 成功了 反之的话……
        yield put({
          type: 'save',
          payload: list.map((input) => {
            return {
              ...input,
              avatar: input.avatar || `http://via.placeholder.com/400?text=${stringify(input.id)}`,
            };
          }),
        });
      }
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
        list: action.payload,
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

