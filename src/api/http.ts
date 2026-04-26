import axios from 'axios';

const BASE_URL = 'http://8.136.29.99:3000';

const client = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

client.interceptors.request.use((config) => {
  const token = localStorage.getItem('admin_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  config.headers['x-device-id'] = 'web-admin';
  return config;
});

client.interceptors.response.use(
  (response) => {
    const data = response.data;
    if (typeof data?.code === 'number' && data.code !== 200 && data.code !== 201) {
      return Promise.reject(new Error(data.message || '请求失败'));
    }
    return data;
  },
  (error) => {
    const msg = error?.response?.data?.message || error.message || '网络错误';
    return Promise.reject(new Error(msg));
  },
);

export const http = client;
