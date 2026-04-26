import { http } from './http';

export const loginApi = (data: { userName: string; password: string }) =>
  http.post('/admin/login', data);

export const getPvUvApi = (params: { start?: string; end?: string }) =>
  http.get('/analytics/pv-uv', { params });

export const getApiStatsApi = (params: { start?: string; end?: string }) =>
  http.get('/analytics/api-stats', { params });

export const getJsErrorsApi = (params: { page?: number; limit?: number }) =>
  http.get('/analytics/js-errors', { params });

export const getServerErrorsApi = (params: { page?: number; limit?: number }) =>
  http.get('/analytics/server-errors', { params });

export const getSlowApisApi = (params: { threshold?: number; limit?: number }) =>
  http.get('/analytics/slow-apis', { params });

export const getLogByIdApi = (logId: string) =>
  http.get('/analytics/log', { params: { logId } });
