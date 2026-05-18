import { create } from "zustand";
import { devtools } from "zustand/middleware";
import type { Product, Category, ProductStatus } from "@/types/database";

type ProductFilters = {
  status?: ProductStatus | "all";
  category_id?: string | "all";
  search?: string;
};

type ProductState = {
  products: Product[];
  categories: Category[];
  total: number;
  page: number;
  pageSize: number;
  filters: ProductFilters;
  isLoading: boolean;
  error: string | null;
};

type ProductActions = {
  setProducts: (products: Product[], total: number) => void;
  setCategories: (categories: Category[]) => void;
  setPage: (page: number) => void;
  setFilters: (filters: Partial<ProductFilters>) => void;
  resetFilters: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  removeProduct: (id: string) => void;
  upsertProduct: (product: Product) => void;
};

const defaultFilters: ProductFilters = {
  status: "all",
  category_id: "all",
  search: "",
};

export const useProductStore = create<ProductState & ProductActions>()(
  devtools(
    (set) => ({
      products: [],
      categories: [],
      total: 0,
      page: 1,
      pageSize: 20,
      filters: defaultFilters,
      isLoading: false,
      error: null,

      setProducts: (products, total) => set({ products, total }, false, "products/setProducts"),
      setCategories: (categories) => set({ categories }, false, "products/setCategories"),
      setPage: (page) => set({ page }, false, "products/setPage"),
      setFilters: (filters) =>
        set((s) => ({ filters: { ...s.filters, ...filters }, page: 1 }), false, "products/setFilters"),
      resetFilters: () => set({ filters: defaultFilters, page: 1 }, false, "products/resetFilters"),
      setLoading: (isLoading) => set({ isLoading }, false, "products/setLoading"),
      setError: (error) => set({ error }, false, "products/setError"),
      removeProduct: (id) =>
        set((s) => ({ products: s.products.filter((p) => p.id !== id) }), false, "products/remove"),
      upsertProduct: (product) =>
        set((s) => {
          const exists = s.products.findIndex((p) => p.id === product.id);
          if (exists >= 0) {
            const updated = [...s.products];
            updated[exists] = product;
            return { products: updated };
          }
          return { products: [product, ...s.products] };
        }, false, "products/upsert"),
    }),
    { name: "ProductStore" }
  )
);
