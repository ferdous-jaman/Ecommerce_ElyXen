import { createBrowserRouter, Navigate } from "react-router-dom";
import { DashboardLayout } from "@/layouts/DashboardLayout";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { PublicRoute } from "@/components/auth/PublicRoute";
import { DashboardPage } from "@/pages/DashboardPage";
import { AnalyticsPage } from "@/pages/AnalyticsPage";
import { SettingsPage } from "@/pages/SettingsPage";
import { LoginPage } from "@/pages/LoginPage";
import { SignupPage } from "@/pages/SignupPage";
import { NotFoundPage } from "@/pages/NotFoundPage";
import { UnauthorizedPage } from "@/pages/UnauthorizedPage";
import { ProductsPage } from "@/pages/products/ProductsPage";
import { CreateProductPage } from "@/pages/products/CreateProductPage";
import { EditProductPage } from "@/pages/products/EditProductPage";
import { ProductDetailPage } from "@/pages/products/ProductDetailPage";
import { CategoriesPage } from "@/pages/categories/CategoriesPage";
import { OrdersPage } from "@/pages/orders/OrdersPage";
import { OrderDetailPage } from "@/pages/orders/OrderDetailPage";
import { CustomersPage } from "@/pages/customers/CustomersPage";
import { CustomerDetailPage } from "@/pages/customers/CustomerDetailPage";
import { InventoryPage } from "@/pages/inventory/InventoryPage";

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <PublicRoute><LoginPage /></PublicRoute>,
  },
  {
    path: "/signup",
    element: <PublicRoute><SignupPage /></PublicRoute>,
  },
  {
    path: "/unauthorized",
    element: <UnauthorizedPage />,
  },
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <DashboardPage /> },
      {
        path: "products",
        element: <ProtectedRoute requiredPermission="products:read"><ProductsPage /></ProtectedRoute>,
      },
      {
        path: "products/new",
        element: <ProtectedRoute requiredPermission="products:write"><CreateProductPage /></ProtectedRoute>,
      },
      {
        path: "products/:id",
        element: <ProtectedRoute requiredPermission="products:read"><ProductDetailPage /></ProtectedRoute>,
      },
      {
        path: "products/:id/edit",
        element: <ProtectedRoute requiredPermission="products:write"><EditProductPage /></ProtectedRoute>,
      },
      {
        path: "categories",
        element: <ProtectedRoute requiredPermission="products:read"><CategoriesPage /></ProtectedRoute>,
      },
      {
        path: "orders",
        element: <ProtectedRoute requiredPermission="orders:read"><OrdersPage /></ProtectedRoute>,
      },
      {
        path: "orders/:id",
        element: <ProtectedRoute requiredPermission="orders:read"><OrderDetailPage /></ProtectedRoute>,
      },
      {
        path: "customers",
        element: <ProtectedRoute requiredPermission="customers:read"><CustomersPage /></ProtectedRoute>,
      },
      {
        path: "customers/:id",
        element: <ProtectedRoute requiredPermission="customers:read"><CustomerDetailPage /></ProtectedRoute>,
      },
      {
        path: "inventory",
        element: <ProtectedRoute requiredPermission="inventory:read"><InventoryPage /></ProtectedRoute>,
      },
      {
        path: "analytics",
        element: <ProtectedRoute requiredPermission="analytics:read"><AnalyticsPage /></ProtectedRoute>,
      },
      {
        path: "settings",
        element: <ProtectedRoute requiredPermission="settings:read"><SettingsPage /></ProtectedRoute>,
      },
    ],
  },
  { path: "/404", element: <NotFoundPage /> },
  { path: "*", element: <Navigate to="/404" replace /> },
]);
