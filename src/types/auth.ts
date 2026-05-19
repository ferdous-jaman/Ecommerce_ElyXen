import type { User, Session } from "@supabase/supabase-js";
import type { Profile, UserRole } from "@/types/database";

export type { User, Session };

export type AuthUser = User & {
  profile: Profile | null;
};

export type AuthState = {
  user: User | null;
  profile: Profile | null;
  session: Session | null;
  isLoading: boolean;
  isInitialized: boolean;
  error: string | null;
};

export type LoginCredentials = {
  email: string;
  password: string;
};

export type SignupCredentials = {
  email: string;
  password: string;
  fullName: string;
};

export type AuthResult<T = void> =
  | { success: true; data: T }
  | { success: false; error: string };

export type Permission =
  | "products:read"
  | "products:write"
  | "products:delete"
  | "orders:read"
  | "orders:write"
  | "orders:delete"
  | "customers:read"
  | "customers:write"
  | "inventory:read"
  | "inventory:write"
  | "analytics:read"
  | "settings:read"
  | "settings:write"
  | "users:read"
  | "users:write";

export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  admin: [
    "products:read",
    "products:write",
    "products:delete",
    "orders:read",
    "orders:write",
    "orders:delete",
    "customers:read",
    "customers:write",
    "inventory:read",
    "inventory:write",
    "analytics:read",
    "settings:read",
    "settings:write",
    "users:read",
    "users:write",
  ],
  staff: [
    "products:read",
    "products:write",
    "orders:read",
    "orders:write",
    "customers:read",
    "inventory:read",
    "inventory:write",
    "analytics:read",
    "settings:read",
  ],
  customer: ["orders:read"],
};

export function hasPermission(role: UserRole, permission: Permission): boolean {
  return ROLE_PERMISSIONS[role].includes(permission);
}

export function hasAnyPermission(
  role: UserRole,
  permissions: Permission[]
): boolean {
  return permissions.some((p) => hasPermission(role, p));
}
