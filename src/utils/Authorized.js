import RenderAuthorized from '../components/Authorized';
import { getAuthority } from './authority';

// 具备自动刷新能力

const Authorized = RenderAuthorized(getAuthority());
export default Authorized;
