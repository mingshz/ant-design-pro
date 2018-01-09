import { stringify } from 'qs';
import request from '../utils/request';

export async function listUsers(params) {
  // stringify 似乎蛮不错的嘛
  return request(`/users?${stringify(params)}`);
}

export async function postExample(params) {
  return request('/api/post', {
    method: 'POST',
    body: params,
  });
}

