// use localStorage to store the authority info, which might be sent from server in actual project.
// import { queryLoginStatus } from '../services/user';
import RenderAuthorized from '../components/Authorized';

// const defaultRole = localStorage.getItem('antd-pro-authority') || 'guest';
// let current = defaultRole;

// function updateCurrent() {
//   try {
//     queryLoginStatus().then(() => {
//       current = 'user';
//     }, () => {
//       current = 'guest';
//     }).catch(() => {
//       current = 'guest';
//     });
//   } catch (e) {
//     current = 'guest';
//   }
//   setAuthority(current);
// }

// updateCurrent();
// window.setInterval(queryLoginStatus, 10000);
let currentAuthority = 'guest';

export function getAuthority() {
  // return localStorage.getItem('antd-pro-authority') || 'guest';
  return currentAuthority;
}

export function setAuthority(authority) {
  RenderAuthorized(authority);
  // if (!authority) {
  //   return;
  // }

  // return localStorage.setItem('antd-pro-authority', authority);
  currentAuthority = authority;
  return authority;
}
