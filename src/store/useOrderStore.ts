import { create } from "zustand";
import { devtools } from "zustand/middleware";
import type { Order, OrderStatus, PaymentStatus } from "@/types/database";

type OrderFilters = {
  status?: OrderStatus | "all";
  payment_status?: PaymentStatus | "all";
  search?: string;
};

type OrderState = {
  orders: Order[];
  total: number;
  page: number;
  pageSize: number;
  filters: OrderFilters;
  isLoading: boolean;
  error: string | null;
};

type OrderActions = {
  setOrders: (orders: Order[], total: number) => void;
  setPage: (page: number) => void;
  setFilters: (filters: Partial<OrderFilters>) => void;
  resetFilters: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  updateOrderStatus: (id: string, status: OrderStatus) => void;
};

const defaultFilters: OrderFilters = {
  status: "all",
  payment_status: "all",
  search: "",
};

export const useOrderStore = create<OrderState & OrderActions>()(
  devtools(
    (set) => ({
      orders: [],
      total: 0,
      page: 1,
      pageSize: 20,
      filters: defaultFilters,
      isLoading: false,
      error: null,

      setOrders: (orders, total) => set({ orders, total }, false, "orders/setOrders"),
      setPage: (page) => set({ page }, false, "orders/setPage"),
      setFilters: (filters) =>
        set((s) => ({ filters: { ...s.filters, ...filters }, page: 1 }), false, "orders/setFilters"),
      resetFilters: () => set({ filters: defaultFilters, page: 1 }, false, "orders/resetFilters"),
      setLoading: (isLoading) => set({ isLoading }, false, "orders/setLoading"),
      setError: (error) => set({ error }, false, "orders/setError"),
      updateOrderStatus: (id, status) =>
        set((s) => ({
          orders: s.orders.map((o) => (o.id === id ? { ...o, status } : o)),
        }), false, "orders/updateStatus"),
    }),
    { name: "OrderStore" }
  )
);
