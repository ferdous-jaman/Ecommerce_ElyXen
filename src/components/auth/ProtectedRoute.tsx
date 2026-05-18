import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { LoadingScreen } from "@/components/shared/LoadingScreen";
import type { UserRole } from "@/types/database";
import type { Permission } from "@/types/auth";
import { hasPermission } from "@/types/auth";

type ProtectedRouteProps = {
  children: React.ReactNode;
  requiredRole?: UserRole | UserRole[];
  requiredPermission?: Permission;
  fallback?: string;
};

export function ProtectedRoute({
  children,
  requiredRole,
  requiredPermission,
  fallback = "/login",
}: ProtectedRouteProps) {
  const { isAuthenticated, isInitialized, isLoading, profile } = useAuth();
  const location = useLocation();

  if (!isInitialized || isLoading) {
    return <LoadingScreen />;
  }

  if (!isAuthenticated) {
    return (
      <Navigate to={fallback} state={{ from: location.pathname }} replace />
    );
  }

  if (requiredRole && profile) {
    const allowedRoles = Array.isArray(requiredRole)
      ? requiredRole
      : [requiredRole];
    if (!allowedRoles.includes(profile.role)) {
      return <Navigate to="/unauthorized" replace />;
    }
  }

  if (requiredPermission && profile) {
    if (!hasPermission(profile.role, requiredPermission)) {
      return <Navigate to="/unauthorized" replace />;
    }
  }

  return <>{children}</>;
}
