import { stringify } from 'qs';
import request from '../utils/request';

export async function listUsers(params) {
  // stringify 似乎蛮不错的嘛
  return request(`/users?${stringify(params)}`);
}

export async function removeUser(id) {
  return request(`/users/${id}`, {
    method: 'DELETE',
  });
}

export async function addUser(params) {
  return request('/users', {
    method: 'POST',
    body: params,
  });
}

