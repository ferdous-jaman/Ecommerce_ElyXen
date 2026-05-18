import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";
import { env } from "@/lib/env";

export const supabase = createClient<Database>(
  env.supabase.url,
  env.supabase.anonKey,
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
      storageKey: "elyxen-auth",
    },
    global: {
      headers: {
        "x-app-name": "elyxen",
      },
    },
  }
);

export type SupabaseClient = typeof supabase;
