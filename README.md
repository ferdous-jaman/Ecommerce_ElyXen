<div align="center">

# ElyXen

### Professional SaaS Ecommerce Management System

A production-grade, full-stack ecommerce admin dashboard built with React, TypeScript, Tailwind CSS, ShadCN UI, and Supabase.

[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue?logo=typescript)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.3-61DAFB?logo=react)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-5.4-646CFF?logo=vite)](https://vitejs.dev/)
[![Supabase](https://img.shields.io/badge/Supabase-2.0-3ECF8E?logo=supabase)](https://supabase.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?logo=tailwindcss)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)

</div>

---

## Overview

ElyXen is a **SaaS-grade ecommerce management platform** designed for modern online businesses. It provides a complete operational layer for managing products, inventory, orders, and customers — with a premium analytics dashboard and professional admin experience comparable to Shopify Admin and Stripe Dashboard.

> Built as a showcase of enterprise frontend engineering: scalable architecture, strict TypeScript, real-time Supabase integration, and production-ready UX.

---

## Features

### Core Modules
| Module | Capabilities |
|---|---|
| **Products** | Create, edit, publish, archive. Image upload, SKU, tags, pricing, profit margin |
| **Categories** | Nested categories, slug generation, full CRUD |
| **Inventory** | Stock tracking, low-stock alerts, location management |
| **Orders** | Full order lifecycle, status flow, order items, customer linking |
| **Customers** | Profile management, order history, address management |
| **Analytics** | Revenue charts, order breakdown, customer growth, top products |

### Premium UX
- ⚡ **Command Palette** — `Cmd+K` / `Ctrl+K` global navigation
- 🌙 **Dark Mode** — System-aware or manual toggle
- 📊 **Rich Charts** — Area, bar, pie, and progress charts via Recharts
- 🔔 **Toast Notifications** — Sonner with rich colors
- 💀 **Skeleton Loaders** — Every async view has skeleton fallback
- 📱 **Fully Responsive** — Mobile sidebar, responsive tables, adaptive layouts

### Technical
- 🔐 **Role-based auth** — Admin / Staff / Customer with permission guards
- 🔀 **Route code splitting** — Every page lazy-loaded with `React.lazy()`
- 🛡️ **Error Boundaries** — Per-route error isolation with retry
- 📦 **Manual chunk splitting** — Vendor bundles separated for optimal caching
- 🏗️ **Modular service layer** — Typed Supabase queries in dedicated service files
- 🗃️ **Zustand stores** — Lightweight state for auth, products, orders, UI

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 18 + Vite 5 + TypeScript 5.6 |
| Styling | Tailwind CSS v3 + ShadCN UI |
| State Management | Zustand v5 |
| Backend / Database | Supabase (Auth + PostgreSQL + Storage + RLS) |
| Forms + Validation | React Hook Form v7 + Zod v3 |
| Charts | Recharts v2 |
| Routing | React Router v6 |
| Notifications | Sonner |
| Icons | Lucide React |

---

## Screenshots

> _Screenshots coming soon — run locally to preview the full experience._

| Dashboard | Orders | Products |
|---|---|---|
| Analytics + KPI | Order flow | Product CRUD |

---

## Getting Started

### Prerequisites

- Node.js 18+
- A free [Supabase](https://supabase.com) account

### 1. Clone the repository

```bash
git clone https://github.com/ferdous-jaman/Ecommerce_ElyXen.git
cd Ecommerce_ElyXen
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to **Project Settings → API**
3. Copy your **Project URL** and **anon/public key**

### 4. Configure environment variables

```bash
cp .env.example .env
```

Edit `.env`:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
VITE_APP_NAME=ElyXen
VITE_APP_VERSION=2.0.0
```

### 5. Run the database migration

In your Supabase dashboard → **SQL Editor**, run:

```
supabase/migrations/001_initial_schema.sql
```

This creates all tables, enums, indexes, Row Level Security policies, and database triggers.

### 6. Start the development server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

---

## Project Structure

```
src/
├── components/
│   ├── auth/            # ProtectedRoute, PublicRoute
│   ├── layout/          # Sidebar, Navbar, MobileSidebar
│   ├── products/        # ProductForm
│   ├── shared/          # CommandPalette, ErrorBoundary, LoadingScreen,
│   │                    # PageHeader, Skeleton, StatusBadge, ConfirmDialog,
│   │                    # ImageUpload, ThemeToggle
│   └── ui/              # ShadCN UI components (button, card, dialog, table…)
├── contexts/
│   └── AuthContext.tsx  # Auth provider + useAuth hook
├── hooks/               # useTheme, useOrders, useProducts, usePermission
├── layouts/
│   └── DashboardLayout.tsx
├── lib/
│   ├── supabase.ts      # Supabase client
│   ├── env.ts           # Type-safe env config
│   ├── utils.ts         # formatCurrency, formatDate, cn, getInitials…
│   ├── mockData.ts      # Analytics demo data
│   └── uploadImage.ts   # Supabase Storage upload helpers
├── pages/
│   ├── DashboardPage.tsx
│   ├── AnalyticsPage.tsx
│   ├── SettingsPage.tsx
│   ├── LoginPage.tsx / SignupPage.tsx
│   ├── products/        # ProductsPage, CreateProductPage, EditProductPage, ProductDetailPage
│   ├── categories/      # CategoriesPage
│   ├── orders/          # OrdersPage, OrderDetailPage
│   ├── customers/       # CustomersPage, CustomerDetailPage
│   └── inventory/       # InventoryPage
├── routes/
│   └── index.tsx        # React Router config — lazy loading + permission guards
├── services/            # Supabase service layer
│   ├── productService.ts
│   ├── categoryService.ts
│   ├── orderService.ts
│   ├── inventoryService.ts
│   ├── customerService.ts
│   ├── activityService.ts
│   └── authService.ts
├── store/               # Zustand stores
│   ├── useAuthStore.ts
│   ├── useProductStore.ts
│   ├── useOrderStore.ts
│   ├── useCommandStore.ts
│   ├── useSidebarStore.ts
│   └── useThemeStore.ts
└── types/
    ├── database.ts      # Full Supabase schema types
    ├── auth.ts          # AuthState, permissions, roles
    ├── api.ts           # ApiResponse, PaginatedResponse helpers
    └── index.ts         # Re-exports + MockOrder
```

---

## Authentication & Roles

| Route Type | Behavior |
|---|---|
| Public (`/login`, `/signup`) | Redirects authenticated users to `/` |
| Protected | Redirects unauthenticated users to `/login` with `from` state |
| Permission-guarded | Redirects unauthorized roles to `/unauthorized` |

| Role | Access Level |
|---|---|
| `admin` | Full access to all modules |
| `staff` | Products, orders, customers, inventory, analytics |
| `customer` | Read-only order history |

---

## Database Schema

| Table | Purpose |
|---|---|
| `profiles` | Extended user data, role, avatar |
| `categories` | Product categories with nesting |
| `products` | Full product catalog with status |
| `inventory` | Stock levels per product |
| `customers` | Customer profiles separate from auth |
| `orders` | Order records with status flow |
| `order_items` | Line items per order with snapshots |
| `activity_logs` | Audit trail for all entity changes |

All tables include: UUID primary keys, `created_at`/`updated_at` (auto-managed via triggers), RLS enabled, role-based policies.

---

## Available Scripts

```bash
npm run dev        # Start development server
npm run build      # TypeScript check + Vite production build
npm run preview    # Preview production build locally
npm run lint       # ESLint check
```

---

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import the repo in [vercel.com](https://vercel.com)
3. Set environment variables in the Vercel dashboard
4. Deploy — `vercel.json` handles SPA routing and security headers automatically

### Manual Build

```bash
npm run build
# Serve the dist/ folder with any static host
```

The build outputs into `dist/` with vendor chunks for optimal browser caching:
- `vendor-react` — React + React DOM + React Router
- `vendor-ui` — Radix UI components
- `vendor-charts` — Recharts
- `vendor-forms` — React Hook Form + Zod
- `vendor-supabase` — Supabase JS client
- `vendor-misc` — Zustand, Sonner, Lucide, cmdk

---

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `VITE_SUPABASE_URL` | ✅ | Your Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | ✅ | Supabase anonymous/public key |
| `VITE_APP_NAME` | Optional | App display name (default: ElyXen) |
| `VITE_APP_VERSION` | Optional | App version string |

> ⚠️ Never commit `.env` to version control. Use `.env.example` as the template.

---

## Architecture Notes

- **Supabase client is untyped at the client level** (`createClient()` without the `<Database>` generic). All services are individually typed via explicit return types (`InsertDto<T>`, `UpdateDto<T>`) to avoid Supabase JS v2 inference bugs with `Record<string, never>` views/functions.
- **Route code splitting**: Every page is loaded with `React.lazy()` wrapped in `SuspenseRoute` (ErrorBoundary + Suspense). The dashboard shell loads instantly; page chunks load on demand.
- **Command Palette**: Mounted in `DashboardLayout` (inside Router context) — triggered via `useCommandStore` Zustand state from `Navbar` or `Ctrl+K`.

---

## License

MIT — free for personal and commercial use.

---

<div align="center">
Built with ❤️ by <a href="https://github.com/ferdous-jaman">Ferdous Jaman</a>
</div>
