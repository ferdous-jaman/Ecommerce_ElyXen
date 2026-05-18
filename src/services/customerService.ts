import { supabase } from "@/lib/supabase";
import type { Customer, InsertDto, UpdateDto } from "@/types/database";
import type { ApiResponse, PaginatedResponse, QueryParams } from "@/types/api";
import { createApiResponse, createPaginatedResponse } from "@/types/api";

export const customerService = {
  async getAll(params: QueryParams = {}): Promise<PaginatedResponse<Customer>> {
    const {
      page = 1,
      pageSize = 20,
      sort = { column: "created_at", ascending: false },
      search,
    } = params;

    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    let query = supabase
      .from("customers")
      .select("*", { count: "exact" })
      .range(from, to)
      .order(sort.column, { ascending: sort.ascending ?? false });

    if (search) {
      query = query.or(
        `first_name.ilike.%${search}%,last_name.ilike.%${search}%,email.ilike.%${search}%`
      );
    }

    const { data, error, count } = await query;

    if (error) {
      return createPaginatedResponse<Customer>([], 0, page, pageSize, error.message);
    }

    return createPaginatedResponse<Customer>(
      data ?? [],
      count ?? 0,
      page,
      pageSize
    );
  },

  async getById(id: string): Promise<ApiResponse<Customer>> {
    const { data, error } = await supabase
      .from("customers")
      .select("*, orders(id, order_number, total, status, created_at)")
      .eq("id", id)
      .single();

    if (error) return createApiResponse<Customer>(null, error.message);
    return createApiResponse<Customer>(data);
  },

  async create(customer: InsertDto<"customers">): Promise<ApiResponse<Customer>> {
    const { data, error } = await supabase
      .from("customers")
      .insert(customer)
      .select()
      .single();

    if (error) return createApiResponse<Customer>(null, error.message);
    return createApiResponse<Customer>(data);
  },

  async update(
    id: string,
    updates: UpdateDto<"customers">
  ): Promise<ApiResponse<Customer>> {
    const { data, error } = await supabase
      .from("customers")
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();

    if (error) return createApiResponse<Customer>(null, error.message);
    return createApiResponse<Customer>(data);
  },

  async delete(id: string): Promise<ApiResponse<void>> {
    const { error } = await supabase.from("customers").delete().eq("id", id);
    if (error) return createApiResponse<void>(null, error.message);
    return createApiResponse<void>(undefined);
  },
};
