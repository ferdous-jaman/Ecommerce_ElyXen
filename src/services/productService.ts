import { supabase } from "@/lib/supabase";
import type { Product, InsertDto, UpdateDto } from "@/types/database";
import type { ApiResponse, PaginatedResponse, QueryParams } from "@/types/api";
import { createApiResponse, createPaginatedResponse } from "@/types/api";

export const productService = {
  async getAll(params: QueryParams = {}): Promise<PaginatedResponse<Product>> {
    const {
      page = 1,
      pageSize = 20,
      sort = { column: "created_at", ascending: false },
      search,
      filters,
    } = params;

    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    let query = supabase
      .from("products")
      .select("*", { count: "exact" })
      .range(from, to)
      .order(sort.column, { ascending: sort.ascending ?? false });

    if (search) {
      query = query.or(`name.ilike.%${search}%,sku.ilike.%${search}%`);
    }

    if (filters?.status) {
      query = query.eq("status", filters.status);
    }

    if (filters?.category_id) {
      query = query.eq("category_id", filters.category_id);
    }

    const { data, error, count } = await query;

    if (error) {
      return createPaginatedResponse<Product>([], 0, page, pageSize, error.message);
    }

    return createPaginatedResponse<Product>(data ?? [], count ?? 0, page, pageSize);
  },

  async getById(id: string): Promise<ApiResponse<Product>> {
    const { data, error } = await supabase
      .from("products")
      .select("*, categories(*), inventory(*)")
      .eq("id", id)
      .single();

    if (error) return createApiResponse<Product>(null, error.message);
    return createApiResponse<Product>(data);
  },

  async create(
    product: InsertDto<"products">
  ): Promise<ApiResponse<Product>> {
    const { data, error } = await supabase
      .from("products")
      .insert(product)
      .select()
      .single();

    if (error) return createApiResponse<Product>(null, error.message);
    return createApiResponse<Product>(data);
  },

  async update(
    id: string,
    updates: UpdateDto<"products">
  ): Promise<ApiResponse<Product>> {
    const { data, error } = await supabase
      .from("products")
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();

    if (error) return createApiResponse<Product>(null, error.message);
    return createApiResponse<Product>(data);
  },

  async delete(id: string): Promise<ApiResponse<void>> {
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) return createApiResponse<void>(null, error.message);
    return createApiResponse<void>(undefined);
  },

  async getBySlug(slug: string): Promise<ApiResponse<Product>> {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("slug", slug)
      .single();

    if (error) return createApiResponse<Product>(null, error.message);
    return createApiResponse<Product>(data);
  },
};
