# ElyXen — Professional Ecommerce Management System

A SaaS-grade ecommerce management dashboard built with React, Vite, TypeScript, Tailwind CSS, ShadCN UI, and Supabase.

---

## Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + Vite + TypeScript |
| Styling | Tailwind CSS + ShadCN UI |
| State | Zustand (auth, sidebar, theme) |
| Auth + DB | Supabase |
| Forms | React Hook Form + Zod |
| Charts | Recharts |
| Routing | React Router v6 |
| Notifications | Sonner |

---

## Getting Started

### 1. Clone and install

```bash
npm install
```

### 2. Set up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to **Project Settings → API**
3. Copy your **Project URL** and **anon/public key**

### 3. Configure environment

```bash
cp .env.example .env
```

Edit `.env` and fill in your values:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### 4. Run the database migration

In the Supabase dashboard go to **SQL Editor** and run the contents of:

```
supabase/migrations/001_initial_schema.sql
```

This creates all tables, enums, indexes, RLS policies, and triggers (including auto-profile creation on signup).

### 5. Start the dev server

```bash
npm run dev
```

App runs at `http://localhost:5173`

---

## Project Structure

```
src/
├── components/
│   ├── auth/          # ProtectedRoute, PublicRoute
│   ├── layout/        # Sidebar, Navbar, MobileSidebar
│   ├── shared/        # LoadingScreen, ErrorBoundary, Skeleton, PageHeader, ThemeToggle
│   └── ui/            # ShadCN UI components
├── contexts/
│   └── AuthContext.tsx  # Auth provider + useAuth hook
├── hooks/             # useTheme, useMediaQuery, usePermission
├── layouts/           # DashboardLayout
├── lib/
│   ├── supabase.ts    # Supabase client
│   ├── env.ts         # Type-safe env vars
│   ├── utils.ts       # Formatting utilities
│   └── mockData.ts    # UI mock data
├── pages/             # All route pages
├── routes/            # React Router config with guards
├── services/          # API service layer (auth, products, orders, inventory, customers, activity)
├── store/             # Zustand stores (auth, theme, sidebar)
└── types/             # TypeScript types (database, auth, api)
```

---

## Authentication Flow

- `/login` and `/signup` are **public routes** — authenticated users are redirected to `/`
- All dashboard routes are **protected** — unauthenticated users redirect to `/login`
- Each route also checks **role permissions** — unauthorized users go to `/unauthorized`
- On signup, Supabase automatically creates a `profiles` row via database trigger
- Sessions are persisted in `localStorage` under the key `elyxen-auth`

---

## Role System

| Role | Access |
|---|---|
| `admin` | Full access to all features |
| `staff` | Products, orders, customers, inventory, analytics |
| `customer` | Read-only order access |

---

## Database Schema

Tables: `profiles`, `categories`, `products`, `inventory`, `customers`, `orders`, `order_items`, `activity_logs`

All tables have:
- UUID primary keys
- `created_at` / `updated_at` timestamps (auto-managed via triggers)
- Row Level Security (RLS) enabled
- Role-based access policies

---

## Development Notes

- All lint errors shown in the IDE before `npm install` are pre-install artifacts — they resolve after dependencies are installed
- The `recharts` module warning in the IDE is a cache issue; the package is installed and Vite resolves it at runtime
- Never commit `.env` — it is gitignored; use `.env.example` as the template
