import axios from 'axios';
import { ElMessage } from 'element-plus';
import type { ApiResult } from '@/types';

export const useMock = import.meta.env.VITE_USE_MOCK !== 'false';

const request = axios.create({
  baseURL: '/api',
  timeout: 10000
});

request.interceptors.request.use((config) => {
  const raw = localStorage.getItem('campus-mart-auth');
  if (raw) {
    const token = JSON.parse(raw).token;
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

request.interceptors.response.use(
  (response) => {
    const result = response.data as ApiResult<unknown>;
    if (typeof result?.code === 'number' && result.code !== 0) {
      ElMessage.error(result.message || '请求失败');
      return Promise.reject(new Error(result.message || '请求失败'));
    }
    return result?.data ?? response.data;
  },
  (error) => {
    ElMessage.error(error?.response?.data?.message || error.message || '网络异常');
    return Promise.reject(error);
  }
);

export default request;
