import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { setGlobalState } from '@/stores/global.store';
import store from '@/stores';
import { history } from '@/routes/history';
import { IAuthentication } from '@/interface/user';

type Method = 'get' | 'post' | 'delete' | 'put';

const axiosInstance = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}`,
  timeout: 60000,
});

const handleRefreshToken = async (req: AxiosRequestConfig, auth: IAuthentication) => {
  const currentTimeSecond = new Date().getTime() / 1000;

  if (auth.expiredTime < currentTimeSecond) {
    localStorage.clear();

    return history.replace('/login');
  }

  return req;
};

const handleFulfilledRequest = (req: AxiosRequestConfig) => {
  store.dispatch(setGlobalState({ loading: true }));

  const authKey = localStorage.getItem('auth');

  if (authKey) {
    const auth: IAuthentication = JSON.parse(authKey);

    req.headers = {
      Authorization: `${auth.tokenType} ${auth.accessToken}`,
    };

    return handleRefreshToken(req, auth);
  }

  return req;
};

axiosInstance.interceptors.request.use(handleFulfilledRequest, error => {
  store.dispatch(setGlobalState({ loading: false }));
  console.log(error);
  Promise.reject(error);
});

const handleFulfilledRespone = (res: AxiosResponse) => {
  store.dispatch(setGlobalState({ loading: false }));

  return {
    status: true,
    data: res?.data,
  };
};

const handleResponseError = (responseError: any) => {
  store.dispatch(setGlobalState({ loading: false }));

  let errorCode = 'INTERNAL_SERVER_ERROR';

  if (responseError?.message?.includes('Network Error')) {
    errorCode = 'NETWORK_ERROR';
  }

  if (responseError?.response?.data?.error) {
    errorCode = responseError?.response?.data?.error.code;
  }

  if (responseError?.response?.status === 403) {
    errorCode = 'FORBIDDEN_ERROR';
  }

  if (responseError?.response?.status === 401) {
    errorCode = 'UNAUTHORIZED_ERROR';
  }

  store.dispatch(setGlobalState({ errorCode }));

  setTimeout(() => {
    store.dispatch(setGlobalState({ errorCode: '' }));
  }, 1);

  return {
    status: false,
  };
};

axiosInstance.interceptors.response.use(handleFulfilledRespone, handleResponseError);

export type Response<T = any> = {
  status: boolean;
  data: T;
};

export type IResponseApi<T = any> = Promise<Response<T>>;

/**
 *
 * @param method - Request methods
 * @param url - Request url
 * @param data - Request data or params
 * @param config - Config of axios request
 */
export const request = <T = any>(
  method: Method,
  url: string,
  data?: any,
  config?: AxiosRequestConfig,
): IResponseApi<T> => {
  let params = {};

  if (data) {
    Object.keys(data).forEach(key => {
      let value = data[key];

      if (typeof value === 'string') {
        value = value.trim();
      }

      data[key] = value;

      if ([null, '', undefined].includes(value)) {
        delete data[key];
      }
    });
  }

  if (method === 'get') {
    params = data;
  }

  return axiosInstance({ method, url, data, params, ...config }) as any;
};
