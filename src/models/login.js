import { routerRedux } from 'dva/router';
import { accountLogin, accountLogout } from '../services/api';
import { queryLoginStatus } from '../services/user';
import { setAuthority } from '../utils/authority';

export default {
  namespace: 'login',

  state: {
    status: undefined,
    authority: 'guest',
  },

  effects: {
    *refreshStatus(_, { put, call }) {
      yield put({
        type: 'refreshSubmitting',
      });
      // 这里开始运行了
      const json = yield call(queryLoginStatus);
      // 更新登录状态
      if (Number.isInteger(json)) {
        // 失败的登录
        yield put({
          type: 'changeLoginStatus',
          payload: {
            currentAuthority: 'guest',
          },
        });
      } else {
        yield put({
          type: 'changeLoginStatus',
          payload: json,
        });
      }
    },
    *login({ payload }, { call, put }) {
      yield put({
        type: 'changeSubmitting',
        payload: true,
      });
      const response = yield call(accountLogin, payload);
      yield put({
        type: 'changeLoginStatus',
        payload: response,
      });
      // Login successfully
      // if (response.status === 'ok') {
      //   // 非常粗暴的跳转,登陆成功之后权限会变成user或admin,会自动重定向到主页
      //   // Login success after permission changes to admin or user
      //   // The refresh will automatically redirect to the home page
      //   // yield put(routerRedux.push('/'));
      //   location.reload();
      // }
    },
    *logout(_, { put, call }) {
      yield call(accountLogout);
      yield put({
        type: 'changeLoginStatus',
        payload: {
          status: false,
          currentAuthority: 'guest',
        },
      });
      yield put(routerRedux.push('/user/login'));
      // Login out after permission changes to admin or user
      // The refresh will automatically redirect to the login page
      // location.reload();
    },
  },

  reducers: {
    changeLoginStatus(state, { payload }) {
      setAuthority(payload.currentAuthority);
      return {
        ...state,
        authority: payload.currentAuthority,
        status: payload.status,
        type: payload.type,
        submitting: false,
      };
    },
    changeSubmitting(state, { payload }) {
      return {
        ...state,
        submitting: payload,
      };
    },
  },
};
