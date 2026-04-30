import { http } from './http';

export const getFeedbackListApi = (params: { page?: number; pageSize?: number }) =>
  http.get('/feedback', { params });
