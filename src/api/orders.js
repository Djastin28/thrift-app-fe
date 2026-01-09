import api from "./axios";

export const ordersApi = {
  getAll: (params) => api.get("/orders", { params }),
  getById: (id) => api.get(`/orders/${id}`),
  create: (data) => api.post("/orders", data),
  checkout: (data) => api.post("/orders", data),
  cancel: (id) => api.post(`/orders/${id}/cancel`),
};
