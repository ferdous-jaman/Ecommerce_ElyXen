import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Product } from "@/types/database";

type WishlistStore = {
  items: Product[];
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  toggleItem: (product: Product) => void;
  hasItem: (productId: string) => boolean;
  clearWishlist: () => void;
  totalItems: () => number;
};

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (product) => {
        if (!get().hasItem(product.id)) {
          set((s) => ({ items: [...s.items, product] }));
        }
      },
      removeItem: (productId) =>
        set((s) => ({ items: s.items.filter((p) => p.id !== productId) })),
      toggleItem: (product) => {
        if (get().hasItem(product.id)) get().removeItem(product.id);
        else get().addItem(product);
      },
      hasItem: (productId) => get().items.some((p) => p.id === productId),
      clearWishlist: () => set({ items: [] }),
      totalItems: () => get().items.length,
    }),
    { name: "elyxen-wishlist", partialize: (s) => ({ items: s.items }) }
  )
);
