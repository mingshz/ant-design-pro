import request from '../utils/request';

export async function getProjects() {
  return request('/projects');
}

export async function addProjects(params) {
  return request('/projects', {
    method: 'POST',
    body: params,
  });
}

