import { lazy, Suspense } from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
import { DashboardLayout } from "@/layouts/DashboardLayout";
import { ShopLayout } from "@/layouts/ShopLayout";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { PublicRoute } from "@/components/auth/PublicRoute";
import { LoadingScreen } from "@/components/shared/LoadingScreen";
import { ErrorBoundary } from "@/components/shared/ErrorBoundary";

// Public shop pages
const LandingPage               = lazy(() => import("@/pages/shop/LandingPage").then((m) => ({ default: m.LandingPage })));
const ShopPage                  = lazy(() => import("@/pages/shop/ShopPage").then((m) => ({ default: m.ShopPage })));
const ShopProductDetailPage     = lazy(() => import("@/pages/shop/ShopProductDetailPage").then((m) => ({ default: m.ShopProductDetailPage })));
const CheckoutPage              = lazy(() => import("@/pages/shop/CheckoutPage").then((m) => ({ default: m.CheckoutPage })));
const MyOrdersPage              = lazy(() => import("@/pages/account/MyOrdersPage").then((m) => ({ default: m.MyOrdersPage })));
const CustomerOrderDetailPage   = lazy(() => import("@/pages/account/OrderDetailPage").then((m) => ({ default: m.CustomerOrderDetailPage })));
const ProfilePage               = lazy(() => import("@/pages/account/ProfilePage").then((m) => ({ default: m.ProfilePage })));
const WishlistPage              = lazy(() => import("@/pages/account/WishlistPage").then((m) => ({ default: m.WishlistPage })));
const AddressesPage             = lazy(() => import("@/pages/account/AddressesPage").then((m) => ({ default: m.AddressesPage })));
const PaymentMethodsPage        = lazy(() => import("@/pages/account/PaymentMethodsPage").then((m) => ({ default: m.PaymentMethodsPage })));

// Dashboard pages
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
const BannerManagerPage  = lazy(() => import("@/pages/banners/BannerManagerPage").then((m) => ({ default: m.BannerManagerPage })));
const FraudCheckPage        = lazy(() => import("@/pages/fraud/FraudCheckPage").then((m) => ({ default: m.FraudCheckPage })));
const StaffManagementPage   = lazy(() => import("@/pages/admin/StaffManagementPage").then((m) => ({ default: m.StaffManagementPage })));
const SalaryPage            = lazy(() => import("@/pages/admin/SalaryPage").then((m) => ({ default: m.SalaryPage })));

function SuspenseRoute({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary>
      <Suspense fallback={<LoadingScreen />}>{children}</Suspense>
    </ErrorBoundary>
  );
}

export const router = createBrowserRouter([
  // ── Public shop routes (no auth required) ──────────────────
  {
    path: "/",
    element: <ShopLayout />,
    children: [
      { index: true, element: <SuspenseRoute><LandingPage /></SuspenseRoute> },
      { path: "shop", element: <SuspenseRoute><ShopPage /></SuspenseRoute> },
      { path: "shop/product/:id", element: <SuspenseRoute><ShopProductDetailPage /></SuspenseRoute> },
      { path: "checkout", element: <SuspenseRoute><ProtectedRoute><CheckoutPage /></ProtectedRoute></SuspenseRoute> },
      { path: "account/orders", element: <SuspenseRoute><ProtectedRoute><MyOrdersPage /></ProtectedRoute></SuspenseRoute> },
      { path: "account/orders/:id", element: <SuspenseRoute><ProtectedRoute><CustomerOrderDetailPage /></ProtectedRoute></SuspenseRoute> },
      { path: "account/profile", element: <SuspenseRoute><ProtectedRoute><ProfilePage /></ProtectedRoute></SuspenseRoute> },
      { path: "account/wishlist", element: <SuspenseRoute><WishlistPage /></SuspenseRoute> },
      { path: "account/addresses", element: <SuspenseRoute><ProtectedRoute><AddressesPage /></ProtectedRoute></SuspenseRoute> },
      { path: "account/payment-methods", element: <SuspenseRoute><ProtectedRoute><PaymentMethodsPage /></ProtectedRoute></SuspenseRoute> },
    ],
  },

  // ── Auth routes ─────────────────────────────────────────────
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

  // ── Protected dashboard routes ───────────────────────────────
  {
    path: "/dashboard",
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
        path: "banners",
        element: <SuspenseRoute><ProtectedRoute requiredPermission="products:write"><BannerManagerPage /></ProtectedRoute></SuspenseRoute>,
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
        path: "fraud-check",
        element: <SuspenseRoute><ProtectedRoute requiredPermission="orders:read"><FraudCheckPage /></ProtectedRoute></SuspenseRoute>,
      },
      {
        path: "staff",
        element: <SuspenseRoute><ProtectedRoute requiredRole="admin"><StaffManagementPage /></ProtectedRoute></SuspenseRoute>,
      },
      {
        path: "salary",
        element: <SuspenseRoute><ProtectedRoute requiredRole="admin"><SalaryPage /></ProtectedRoute></SuspenseRoute>,
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
