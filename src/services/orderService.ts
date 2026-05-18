import { supabase } from "@/lib/supabase";
import type { Order, OrderItem, InsertDto, UpdateDto } from "@/types/database";
import type { ApiResponse, PaginatedResponse, QueryParams } from "@/types/api";
import { createApiResponse, createPaginatedResponse } from "@/types/api";

export type OrderWithItems = Order & { order_items: OrderItem[] };

export const orderService = {
  async getAll(params: QueryParams = {}): Promise<PaginatedResponse<Order>> {
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
      .from("orders")
      .select("*, customers(first_name, last_name, email)", { count: "exact" })
      .range(from, to)
      .order(sort.column, { ascending: sort.ascending ?? false });

    if (search) {
      query = query.ilike("order_number", `%${search}%`);
    }

    if (filters?.status) {
      query = query.eq("status", filters.status);
    }

    if (filters?.payment_status) {
      query = query.eq("payment_status", filters.payment_status);
    }

    const { data, error, count } = await query;

    if (error) {
      return createPaginatedResponse<Order>([], 0, page, pageSize, error.message);
    }

    return createPaginatedResponse<Order>(data ?? [], count ?? 0, page, pageSize);
  },

  async getById(id: string): Promise<ApiResponse<OrderWithItems>> {
    const { data, error } = await supabase
      .from("orders")
      .select("*, order_items(*, products(name, sku, images)), customers(*)")
      .eq("id", id)
      .single();

    if (error) return createApiResponse<OrderWithItems>(null, error.message);
    return createApiResponse<OrderWithItems>(data as OrderWithItems);
  },

  async create(
    order: InsertDto<"orders">,
    items: InsertDto<"order_items">[]
  ): Promise<ApiResponse<Order>> {
    const { data: orderData, error: orderError } = await supabase
      .from("orders")
      .insert(order)
      .select()
      .single();

    if (orderError) return createApiResponse<Order>(null, orderError.message);

    const itemsWithOrderId = items.map((item) => ({
      ...item,
      order_id: orderData.id,
    }));

    const { error: itemsError } = await supabase
      .from("order_items")
      .insert(itemsWithOrderId);

    if (itemsError) return createApiResponse<Order>(null, itemsError.message);

    return createApiResponse<Order>(orderData);
  },

  async updateStatus(
    id: string,
    status: UpdateDto<"orders">["status"]
  ): Promise<ApiResponse<Order>> {
    const { data, error } = await supabase
      .from("orders")
      .update({ status, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();

    if (error) return createApiResponse<Order>(null, error.message);
    return createApiResponse<Order>(data);
  },

  async getRecentOrders(limit = 10): Promise<ApiResponse<Order[]>> {
    const { data, error } = await supabase
      .from("orders")
      .select("*, customers(first_name, last_name, email)")
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) return createApiResponse<Order[]>(null, error.message);
    return createApiResponse<Order[]>(data ?? []);
  },
};
