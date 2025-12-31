import api from "./axios";

export const authApi = {
  register: (data) => api.post("/register", data),
  login: (data) => api.post("/login", data),
  logout: () => api.post("/logout"),
  getProfile: () => api.get("/me"),
  updateProfile: (data) => api.put("/profile", data),
  changePassword: (data) => api.put("/change-password", data),
};
