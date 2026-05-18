import { lazy, Suspense } from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
import { DashboardLayout } from "@/layouts/DashboardLayout";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { PublicRoute } from "@/components/auth/PublicRoute";
import { LoadingScreen } from "@/components/shared/LoadingScreen";
import { ErrorBoundary } from "@/components/shared/ErrorBoundary";

const DashboardPage     = lazy(() => import("@/pages/DashboardPage").then((m) => ({ default: m.DashboardPage })));
const AnalyticsPage     = lazy(() => import("@/pages/AnalyticsPage").then((m) => ({ default: m.AnalyticsPage })));
const SettingsPage      = lazy(() => import("@/pages/SettingsPage").then((m) => ({ default: m.SettingsPage })));
const LoginPage         = lazy(() => import("@/pages/LoginPage").then((m) => ({ default: m.LoginPage })));
const SignupPage        = lazy(() => import("@/pages/SignupPage").then((m) => ({ default: m.SignupPage })));
const NotFoundPage      = lazy(() => import("@/pages/NotFoundPage").then((m) => ({ default: m.NotFoundPage })));
const UnauthorizedPage  = lazy(() => import("@/pages/UnauthorizedPage").then((m) => ({ default: m.UnauthorizedPage })));
const ProductsPage      = lazy(() => import("@/pages/products/ProductsPage").then((m) => ({ default: m.ProductsPage })));
const CreateProductPage = lazy(() => import("@/pages/products/CreateProductPage").then((m) => ({ default: m.CreateProductPage })));
const EditProductPage   = lazy(() => import("@/pages/products/EditProductPage").then((m) => ({ default: m.EditProductPage })));
const ProductDetailPage = lazy(() => import("@/pages/products/ProductDetailPage").then((m) => ({ default: m.ProductDetailPage })));
const CategoriesPage    = lazy(() => import("@/pages/categories/CategoriesPage").then((m) => ({ default: m.CategoriesPage })));
const OrdersPage        = lazy(() => import("@/pages/orders/OrdersPage").then((m) => ({ default: m.OrdersPage })));
const OrderDetailPage   = lazy(() => import("@/pages/orders/OrderDetailPage").then((m) => ({ default: m.OrderDetailPage })));
const CustomersPage     = lazy(() => import("@/pages/customers/CustomersPage").then((m) => ({ default: m.CustomersPage })));
const CustomerDetailPage = lazy(() => import("@/pages/customers/CustomerDetailPage").then((m) => ({ default: m.CustomerDetailPage })));
const InventoryPage     = lazy(() => import("@/pages/inventory/InventoryPage").then((m) => ({ default: m.InventoryPage })));

function SuspenseRoute({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary>
      <Suspense fallback={<LoadingScreen />}>{children}</Suspense>
    </ErrorBoundary>
  );
}

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <SuspenseRoute><PublicRoute><LoginPage /></PublicRoute></SuspenseRoute>,
  },
  {
    path: "/signup",
    element: <SuspenseRoute><PublicRoute><SignupPage /></PublicRoute></SuspenseRoute>,
  },
  {
    path: "/unauthorized",
    element: <SuspenseRoute><UnauthorizedPage /></SuspenseRoute>,
  },
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <SuspenseRoute><DashboardPage /></SuspenseRoute>,
      },
      {
        path: "products",
        element: <SuspenseRoute><ProtectedRoute requiredPermission="products:read"><ProductsPage /></ProtectedRoute></SuspenseRoute>,
      },
      {
        path: "products/new",
        element: <SuspenseRoute><ProtectedRoute requiredPermission="products:write"><CreateProductPage /></ProtectedRoute></SuspenseRoute>,
      },
      {
        path: "products/:id",
        element: <SuspenseRoute><ProtectedRoute requiredPermission="products:read"><ProductDetailPage /></ProtectedRoute></SuspenseRoute>,
      },
      {
        path: "products/:id/edit",
        element: <SuspenseRoute><ProtectedRoute requiredPermission="products:write"><EditProductPage /></ProtectedRoute></SuspenseRoute>,
      },
      {
        path: "categories",
        element: <SuspenseRoute><ProtectedRoute requiredPermission="products:read"><CategoriesPage /></ProtectedRoute></SuspenseRoute>,
      },
      {
        path: "orders",
        element: <SuspenseRoute><ProtectedRoute requiredPermission="orders:read"><OrdersPage /></ProtectedRoute></SuspenseRoute>,
      },
      {
        path: "orders/:id",
        element: <SuspenseRoute><ProtectedRoute requiredPermission="orders:read"><OrderDetailPage /></ProtectedRoute></SuspenseRoute>,
      },
      {
        path: "customers",
        element: <SuspenseRoute><ProtectedRoute requiredPermission="customers:read"><CustomersPage /></ProtectedRoute></SuspenseRoute>,
      },
      {
        path: "customers/:id",
        element: <SuspenseRoute><ProtectedRoute requiredPermission="customers:read"><CustomerDetailPage /></ProtectedRoute></SuspenseRoute>,
      },
      {
        path: "inventory",
        element: <SuspenseRoute><ProtectedRoute requiredPermission="inventory:read"><InventoryPage /></ProtectedRoute></SuspenseRoute>,
      },
      {
        path: "analytics",
        element: <SuspenseRoute><ProtectedRoute requiredPermission="analytics:read"><AnalyticsPage /></ProtectedRoute></SuspenseRoute>,
      },
      {
        path: "settings",
        element: <SuspenseRoute><ProtectedRoute requiredPermission="settings:read"><SettingsPage /></ProtectedRoute></SuspenseRoute>,
      },
    ],
  },
  { path: "/404", element: <SuspenseRoute><NotFoundPage /></SuspenseRoute> },
  { path: "*", element: <Navigate to="/404" replace /> },
]);
