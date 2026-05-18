import { createClient } from "@supabase/supabase-js";
import { env } from "@/lib/env";

export const supabase = createClient(
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
