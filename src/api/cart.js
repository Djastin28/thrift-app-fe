import api from "./axios";

export const cartApi = {
  getAll: () => api.get("/carts"),
  add: (data) => api.post("/carts", data),
  update: (id, data) => api.put(`/carts/${id}`, data),
  remove: (id) => api.delete(`/carts/${id}`),
};
