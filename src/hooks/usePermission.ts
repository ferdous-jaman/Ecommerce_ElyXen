import { useAuth } from "@/contexts/AuthContext";
import {
  hasPermission,
  hasAnyPermission,
  type Permission,
} from "@/types/auth";
import type { UserRole } from "@/types/database";

export function usePermission() {
  const { profile } = useAuth();
  const role = profile?.role as UserRole | undefined;

  function can(permission: Permission): boolean {
    if (!role) return false;
    return hasPermission(role, permission);
  }

  function canAny(permissions: Permission[]): boolean {
    if (!role) return false;
    return hasAnyPermission(role, permissions);
  }

  function isRole(targetRole: UserRole): boolean {
    return role === targetRole;
  }

  const isAdmin = role === "admin";
  const isStaff = role === "staff" || role === "admin";
  const isCustomer = role === "customer";

  return { can, canAny, isRole, isAdmin, isStaff, isCustomer, role };
}
