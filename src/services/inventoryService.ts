import { supabase } from "@/lib/supabase";
import type { Inventory, UpdateDto } from "@/types/database";
import type { ApiResponse } from "@/types/api";
import { createApiResponse } from "@/types/api";

export type InventoryWithProduct = Inventory & {
  products: { name: string; sku: string; images: string[] };
};

export const inventoryService = {
  async getAll(): Promise<ApiResponse<InventoryWithProduct[]>> {
    const { data, error } = await supabase
      .from("inventory")
      .select("*, products(name, sku, images)")
      .order("updated_at", { ascending: false });

    if (error) return createApiResponse<InventoryWithProduct[]>(null, error.message);
    return createApiResponse<InventoryWithProduct[]>(data as InventoryWithProduct[]);
  },

  async getLowStock(): Promise<ApiResponse<InventoryWithProduct[]>> {
    const { data, error } = await supabase
      .from("inventory")
      .select("*, products(name, sku, images)")
      .filter("quantity", "lte", supabase.rpc as unknown as number);

    if (error) return createApiResponse<InventoryWithProduct[]>(null, error.message);
    return createApiResponse<InventoryWithProduct[]>(data as InventoryWithProduct[]);
  },

  async getLowStockItems(): Promise<ApiResponse<InventoryWithProduct[]>> {
    const { data, error } = await supabase
      .from("inventory")
      .select("*, products(name, sku, images)")
      .order("quantity", { ascending: true });

    if (error) return createApiResponse<InventoryWithProduct[]>(null, error.message);

    const lowStock = (data as InventoryWithProduct[]).filter(
      (item) => item.quantity <= item.low_stock_threshold
    );

    return createApiResponse<InventoryWithProduct[]>(lowStock);
  },

  async getByProductId(productId: string): Promise<ApiResponse<Inventory>> {
    const { data, error } = await supabase
      .from("inventory")
      .select("*")
      .eq("product_id", productId)
      .single();

    if (error) return createApiResponse<Inventory>(null, error.message);
    return createApiResponse<Inventory>(data);
  },

  async update(
    id: string,
    updates: UpdateDto<"inventory">
  ): Promise<ApiResponse<Inventory>> {
    const { data, error } = await supabase
      .from("inventory")
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();

    if (error) return createApiResponse<Inventory>(null, error.message);
    return createApiResponse<Inventory>(data);
  },

  async adjustQuantity(
    productId: string,
    delta: number
  ): Promise<ApiResponse<Inventory>> {
    const current = await this.getByProductId(productId);
    if (!current.data) {
      return createApiResponse<Inventory>(null, "Inventory record not found.");
    }

    const newQty = Math.max(0, current.data.quantity + delta);

    return this.update(current.data.id, { quantity: newQty });
  },
};
