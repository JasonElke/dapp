import { request } from './request';

interface LoginParams {
  username: string;
  password: string;
}
interface LoginResult {
  full_name: string;
}

export const loginApi = async (data: LoginParams) => {
  const result = await request<LoginResult>('post', '/user/login', data);

  if (result.status) {
    localStorage.setItem('auth', JSON.stringify(result.data));
  } else localStorage.clear();

  return result;
};
