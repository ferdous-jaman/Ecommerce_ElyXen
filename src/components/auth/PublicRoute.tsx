import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { LoadingScreen } from "@/components/shared/LoadingScreen";

type PublicRouteProps = {
  children: React.ReactNode;
  redirectTo?: string;
};

export function PublicRoute({
  children,
  redirectTo,
}: PublicRouteProps) {
  const { isAuthenticated, isInitialized, isLoading, profile } = useAuth();

  if (!isInitialized || isLoading) {
    return <LoadingScreen />;
  }

  if (isAuthenticated) {
    const destination = redirectTo ?? (profile?.role === "customer" ? "/shop" : "/dashboard");
    return <Navigate to={destination} replace />;
  }

  return <>{children}</>;
}
