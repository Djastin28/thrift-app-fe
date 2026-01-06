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

  // Categories - menggunakan endpoint public untuk list, admin untuk CUD
  getCategories: () => api.get("/categories"), // Public endpoint
  createCategory: (data) => api.post("/admin/categories", data),
  updateCategory: (id, data) => api.put(`/admin/categories/${id}`, data),
  deleteCategory: (id) => api.delete(`/admin/categories/${id}`),

  // Orders - menggunakan endpoint customer dengan admin token
  getOrders: (params) => api.get("/orders", { params }), // Customer endpoint, admin bisa lihat semua
  getOrderById: (id) => api.get(`/orders/${id}`),
  updateOrderStatus: (id, status) =>
    api.put(`/admin/orders/${id}/status`, { status }),
  updatePaymentStatus: (id, payment_status) =>
    api.put(`/admin/orders/${id}/payment`, { payment_status }),
};
