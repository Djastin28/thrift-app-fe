import api from "./axios";

export const itemsApi = {
  getAll: (params) => api.get("/items", { params }),
  getById: (id) => api.get(`/items/${id}`),
  create: (data) => api.post("/items", data),
  update: (id, data) => api.put(`/items/${id}`, data),
  delete: (id) => api.delete(`/items/${id}`),
};

export const categoriesApi = {
  getAll: () => api.get("/categories"),
};
