import { supabase } from "@/lib/supabase";
import type { ActivityLog, InsertDto } from "@/types/database";
import type { ApiResponse } from "@/types/api";
import { createApiResponse } from "@/types/api";

export const activityService = {
  async log(
    entry: Omit<InsertDto<"activity_logs">, "id" | "created_at">
  ): Promise<ApiResponse<ActivityLog>> {
    const { data, error } = await supabase
      .from("activity_logs")
      .insert(entry)
      .select()
      .single();

    if (error) {
      console.error("[activityService] log error:", error.message);
      return createApiResponse<ActivityLog>(null, error.message);
    }

    return createApiResponse<ActivityLog>(data);
  },

  async getRecent(limit = 20): Promise<ApiResponse<ActivityLog[]>> {
    const { data, error } = await supabase
      .from("activity_logs")
      .select("*, profiles(full_name, avatar_url)")
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) return createApiResponse<ActivityLog[]>(null, error.message);
    return createApiResponse<ActivityLog[]>(data ?? []);
  },

  async getByUser(
    userId: string,
    limit = 50
  ): Promise<ApiResponse<ActivityLog[]>> {
    const { data, error } = await supabase
      .from("activity_logs")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) return createApiResponse<ActivityLog[]>(null, error.message);
    return createApiResponse<ActivityLog[]>(data ?? []);
  },

  async getByEntity(
    entityType: string,
    entityId: string
  ): Promise<ApiResponse<ActivityLog[]>> {
    const { data, error } = await supabase
      .from("activity_logs")
      .select("*, profiles(full_name)")
      .eq("entity_type", entityType)
      .eq("entity_id", entityId)
      .order("created_at", { ascending: false });

    if (error) return createApiResponse<ActivityLog[]>(null, error.message);
    return createApiResponse<ActivityLog[]>(data ?? []);
  },
};
