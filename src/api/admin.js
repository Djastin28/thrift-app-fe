import api from "./axios";

export const adminApi = {
  // Dashboard
  getDashboard: () => api.get("/admin/dashboard"),

  // Users
  getUsers: (params) => api.get("/admin/users", { params }),
  updateUser: (id, data) => api.put(`/admin/users/${id}`, data),

  // Items
  getItems: (params) => api.get("/admin/items", { params }),
  toggleItemActive: (id) => api.put(`/admin/items/${id}/toggle-active`),

  // Categories
  getCategories: () => api.get("/admin/categories"),
  createCategory: (data) => api.post("/admin/categories", data),
  updateCategory: (id, data) => api.put(`/admin/categories/${id}`, data),
  deleteCategory: (id) => api.delete(`/admin/categories/${id}`),

  // Orders
  getOrders: (params) => api.get("/admin/orders", { params }),
  getOrderById: (id) => api.get(`/admin/orders/${id}`),
  updateOrderStatus: (id, status) =>
    api.put(`/admin/orders/${id}/status`, { status }),
  updatePaymentStatus: (id, payment_status) =>
    api.put(`/admin/orders/${id}/payment`, { payment_status }),
};
