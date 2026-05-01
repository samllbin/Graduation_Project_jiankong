import { http } from './http';

export const getAppVersionListApi = (params: { page?: number; pageSize?: number }) =>
  http.get('/admin/app-version', { params });

export const createAppVersionApi = (form: FormData) =>
  http.post('/admin/app-version', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
