import { supabase } from "@/lib/supabase";
import type { Category, InsertDto, UpdateDto } from "@/types/database";
import type { ApiResponse } from "@/types/api";
import { createApiResponse } from "@/types/api";

export const categoryService = {
  async getAll(): Promise<ApiResponse<Category[]>> {
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .order("name", { ascending: true });

    if (error) return createApiResponse<Category[]>(null, error.message);
    return createApiResponse<Category[]>(data ?? []);
  },

  async getById(id: string): Promise<ApiResponse<Category>> {
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .eq("id", id)
      .single();

    if (error) return createApiResponse<Category>(null, error.message);
    return createApiResponse<Category>(data);
  },

  async create(category: InsertDto<"categories">): Promise<ApiResponse<Category>> {
    const { data, error } = await supabase
      .from("categories")
      .insert(category)
      .select()
      .single();

    if (error) return createApiResponse<Category>(null, error.message);
    return createApiResponse<Category>(data);
  },

  async update(id: string, updates: UpdateDto<"categories">): Promise<ApiResponse<Category>> {
    const { data, error } = await supabase
      .from("categories")
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();

    if (error) return createApiResponse<Category>(null, error.message);
    return createApiResponse<Category>(data);
  },

  async delete(id: string): Promise<ApiResponse<void>> {
    const { error } = await supabase.from("categories").delete().eq("id", id);
    if (error) return createApiResponse<void>(null, error.message);
    return createApiResponse<void>(undefined);
  },

  generateSlug(name: string): string {
    return name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");
  },
};
