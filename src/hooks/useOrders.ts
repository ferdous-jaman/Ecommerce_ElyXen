import { useEffect, useCallback } from "react";
import { useOrderStore } from "@/store/useOrderStore";
import { orderService } from "@/services/orderService";

export function useOrders() {
  const {
    orders, total, page, pageSize, filters, isLoading, error,
    setOrders, setPage, setFilters, resetFilters, setLoading, setError, updateOrderStatus,
  } = useOrderStore();

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setError(null);
    const result = await orderService.getAll({
      page,
      pageSize,
      search: filters.search || undefined,
      filters: {
        ...(filters.status && filters.status !== "all" ? { status: filters.status } : {}),
        ...(filters.payment_status && filters.payment_status !== "all" ? { payment_status: filters.payment_status } : {}),
      },
    });
    if (result.error) setError(result.error);
    else setOrders(result.data ?? [], result.count ?? 0);
    setLoading(false);
  }, [page, pageSize, filters, setOrders, setLoading, setError]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  return {
    orders, total, page, pageSize, filters, isLoading, error,
    setPage, setFilters, resetFilters, refetch: fetchOrders, updateOrderStatus,
  };
}
