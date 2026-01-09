import { create } from "zustand";
import { cartApi } from "../api/cart";

export const useCartStore = create((set, get) => ({
  items: [],
  isLoading: false,

  // Computed - with safety checks
  totalItems: () => {
    const items = get().items;
    if (!items || !Array.isArray(items)) return 0;
    return items.reduce((sum, item) => sum + (item?.quantity || 0), 0);
  },
  totalPrice: () => {
    const items = get().items;
    if (!items || !Array.isArray(items)) return 0;
    return items.reduce(
      (sum, item) => sum + (parseFloat(item?.item?.price || 0) * (item?.quantity || 0)),
      0
    );
  },

  // Actions
  fetchCart: async () => {
    set({ isLoading: true });
    try {
      const response = await cartApi.getAll();
      // API returns array directly, not wrapped in { data: [...] }
      const cartData = Array.isArray(response.data) 
        ? response.data 
        : (response.data?.data || []);
      set({ items: cartData, isLoading: false });
    } catch (error) {
      set({ items: [], isLoading: false });
      throw error;
    }
  },

  addToCart: async (itemId, quantity = 1, notes = "") => {
    set({ isLoading: true });
    try {
      await cartApi.add({ item_id: itemId, quantity, notes });
      await get().fetchCart();
      return { success: true };
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  updateQuantity: async (cartId, quantity) => {
    set({ isLoading: true });
    try {
      await cartApi.update(cartId, { quantity });
      await get().fetchCart();
      return { success: true };
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  removeFromCart: async (cartId) => {
    set({ isLoading: true });
    try {
      await cartApi.remove(cartId);
      await get().fetchCart();
      return { success: true };
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  clearCart: () => {
    set({ items: [] });
  },
}));
