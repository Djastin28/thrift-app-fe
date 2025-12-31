import { create } from "zustand";
import { persist } from "zustand/middleware";
import { authApi } from "../api/auth";

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isLoading: false,

      // Computed
      isAuthenticated: () => !!get().token,
      isAdmin: () => get().user?.role === "admin",

      // Actions
      setAuth: (user, token) => {
        localStorage.setItem("token", token);
        set({ user, token });
      },

      login: async (credentials) => {
        set({ isLoading: true });
        try {
          const response = await authApi.login(credentials);
          const { user, token } = response.data;
          localStorage.setItem("token", token);
          set({ user, token, isLoading: false });
          return { success: true, user };
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      register: async (data) => {
        set({ isLoading: true });
        try {
          const response = await authApi.register(data);
          const { user, token } = response.data;
          localStorage.setItem("token", token);
          set({ user, token, isLoading: false });
          return { success: true, user };
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      logout: async () => {
        try {
          await authApi.logout();
        } catch (error) {
          // Ignore logout errors
        } finally {
          localStorage.removeItem("token");
          set({ user: null, token: null });
        }
      },

      fetchProfile: async () => {
        try {
          const response = await authApi.getProfile();
          set({ user: response.data.data });
          return response.data.data;
        } catch (error) {
          // If fetch fails, clear auth
          localStorage.removeItem("token");
          set({ user: null, token: null });
          throw error;
        }
      },

      updateProfile: async (data) => {
        set({ isLoading: true });
        try {
          const response = await authApi.updateProfile(data);
          set({ user: response.data.data, isLoading: false });
          return { success: true, user: response.data.data };
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      changePassword: async (data) => {
        set({ isLoading: true });
        try {
          await authApi.changePassword(data);
          set({ isLoading: false });
          return { success: true };
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({ user: state.user, token: state.token }),
    }
  )
);
