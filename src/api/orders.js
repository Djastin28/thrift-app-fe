import api from "./axios";

export const ordersApi = {
  getAll: (params) => api.get("/orders", { params }),
  getById: (id) => api.get(`/orders/${id}`),
  checkout: (data) => api.post("/orders", data),
  cancel: (id) => api.post(`/orders/${id}/cancel`),
};
