import { useEffect, useCallback } from "react";
import { useProductStore } from "@/store/useProductStore";
import { productService } from "@/services/productService";
import { categoryService } from "@/services/categoryService";

export function useProducts() {
  const {
    products, categories, total, page, pageSize, filters,
    isLoading, error,
    setProducts, setCategories, setPage, setFilters, resetFilters,
    setLoading, setError, removeProduct, upsertProduct,
  } = useProductStore();

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    const result = await productService.getAll({
      page,
      pageSize,
      search: filters.search || undefined,
      filters: {
        ...(filters.status && filters.status !== "all" ? { status: filters.status } : {}),
        ...(filters.category_id && filters.category_id !== "all" ? { category_id: filters.category_id } : {}),
      },
    });
    if (result.error) setError(result.error);
    else setProducts(result.data ?? [], result.count ?? 0);
    setLoading(false);
  }, [page, pageSize, filters, setProducts, setLoading, setError]);

  const fetchCategories = useCallback(async () => {
    const result = await categoryService.getAll();
    if (result.data) setCategories(result.data);
  }, [setCategories]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    if (categories.length === 0) fetchCategories();
  }, [fetchCategories, categories.length]);

  return {
    products, categories, total, page, pageSize, filters,
    isLoading, error,
    setPage, setFilters, resetFilters,
    refetch: fetchProducts,
    removeProduct, upsertProduct,
  };
}
