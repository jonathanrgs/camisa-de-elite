import { api } from './api';

export const alertService = {
  createBackInStock: (data) => api.post('/alerts/back-in-stock', data)
};
