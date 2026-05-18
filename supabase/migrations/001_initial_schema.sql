-- ============================================================
-- ElyXen Ecommerce Management System - Initial Schema
-- Migration: 001_initial_schema.sql
-- ============================================================

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- ============================================================
-- ENUMS
-- ============================================================

CREATE TYPE user_role AS ENUM ('admin', 'staff', 'customer');
CREATE TYPE product_status AS ENUM ('active', 'draft', 'archived');
CREATE TYPE order_status AS ENUM ('pending', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded');
CREATE TYPE payment_status AS ENUM ('pending', 'paid', 'failed', 'refunded');

-- ============================================================
-- PROFILES TABLE
-- Extends Supabase auth.users with app-specific data
-- ============================================================

CREATE TABLE public.profiles (
  id           UUID        PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email        TEXT        NOT NULL UNIQUE,
  full_name    TEXT,
  avatar_url   TEXT,
  role         user_role   NOT NULL DEFAULT 'staff',
  is_active    BOOLEAN     NOT NULL DEFAULT TRUE,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_profiles_email ON public.profiles(email);
CREATE INDEX idx_profiles_role  ON public.profiles(role);

-- ============================================================
-- CATEGORIES TABLE
-- ============================================================

CREATE TABLE public.categories (
  id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  name         TEXT        NOT NULL,
  slug         TEXT        NOT NULL UNIQUE,
  description  TEXT,
  parent_id    UUID        REFERENCES public.categories(id) ON DELETE SET NULL,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_categories_slug ON public.categories(slug);
CREATE INDEX idx_categories_parent ON public.categories(parent_id);

-- ============================================================
-- PRODUCTS TABLE
-- ============================================================

CREATE TABLE public.products (
  id             UUID           PRIMARY KEY DEFAULT gen_random_uuid(),
  name           TEXT           NOT NULL,
  slug           TEXT           NOT NULL UNIQUE,
  description    TEXT,
  sku            TEXT           NOT NULL UNIQUE,
  price          NUMERIC(10,2)  NOT NULL CHECK (price >= 0),
  compare_price  NUMERIC(10,2)  CHECK (compare_price >= 0),
  cost_price     NUMERIC(10,2)  CHECK (cost_price >= 0),
  category_id    UUID           REFERENCES public.categories(id) ON DELETE SET NULL,
  status         product_status NOT NULL DEFAULT 'draft',
  images         TEXT[]         NOT NULL DEFAULT '{}',
  tags           TEXT[]         NOT NULL DEFAULT '{}',
  weight         NUMERIC(8,3),
  created_by     UUID           NOT NULL REFERENCES public.profiles(id),
  created_at     TIMESTAMPTZ    NOT NULL DEFAULT NOW(),
  updated_at     TIMESTAMPTZ    NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_products_slug       ON public.products(slug);
CREATE INDEX idx_products_sku        ON public.products(sku);
CREATE INDEX idx_products_status     ON public.products(status);
CREATE INDEX idx_products_category   ON public.products(category_id);
CREATE INDEX idx_products_created_by ON public.products(created_by);
CREATE INDEX idx_products_name_trgm  ON public.products USING GIN (name gin_trgm_ops);

-- ============================================================
-- INVENTORY TABLE
-- One-to-one with products
-- ============================================================

CREATE TABLE public.inventory (
  id                  UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id          UUID        NOT NULL UNIQUE REFERENCES public.products(id) ON DELETE CASCADE,
  quantity            INT         NOT NULL DEFAULT 0 CHECK (quantity >= 0),
  reserved_quantity   INT         NOT NULL DEFAULT 0 CHECK (reserved_quantity >= 0),
  low_stock_threshold INT         NOT NULL DEFAULT 10,
  location            TEXT,
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_inventory_product    ON public.inventory(product_id);
CREATE INDEX idx_inventory_qty        ON public.inventory(quantity);

-- ============================================================
-- CUSTOMERS TABLE
-- Separate from auth users — covers guest customers too
-- ============================================================

CREATE TABLE public.customers (
  id            UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id    UUID          REFERENCES public.profiles(id) ON DELETE SET NULL,
  first_name    TEXT          NOT NULL,
  last_name     TEXT          NOT NULL,
  email         TEXT          NOT NULL UNIQUE,
  phone         TEXT,
  address       JSONB,
  notes         TEXT,
  total_orders  INT           NOT NULL DEFAULT 0,
  total_spent   NUMERIC(12,2) NOT NULL DEFAULT 0,
  created_at    TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_customers_email      ON public.customers(email);
CREATE INDEX idx_customers_profile    ON public.customers(profile_id);
CREATE INDEX idx_customers_name_trgm  ON public.customers USING GIN (
  (first_name || ' ' || last_name) gin_trgm_ops
);

-- ============================================================
-- ORDERS TABLE
-- ============================================================

CREATE TABLE public.orders (
  id               UUID           PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number     TEXT           NOT NULL UNIQUE DEFAULT 'ORD-' || EXTRACT(EPOCH FROM NOW())::BIGINT::TEXT,
  customer_id      UUID           NOT NULL REFERENCES public.customers(id),
  status           order_status   NOT NULL DEFAULT 'pending',
  payment_status   payment_status NOT NULL DEFAULT 'pending',
  subtotal         NUMERIC(12,2)  NOT NULL CHECK (subtotal >= 0),
  discount_amount  NUMERIC(12,2)  NOT NULL DEFAULT 0 CHECK (discount_amount >= 0),
  tax_amount       NUMERIC(12,2)  NOT NULL DEFAULT 0 CHECK (tax_amount >= 0),
  shipping_amount  NUMERIC(12,2)  NOT NULL DEFAULT 0 CHECK (shipping_amount >= 0),
  total            NUMERIC(12,2)  NOT NULL CHECK (total >= 0),
  shipping_address JSONB          NOT NULL DEFAULT '{}',
  notes            TEXT,
  created_by       UUID           NOT NULL REFERENCES public.profiles(id),
  created_at       TIMESTAMPTZ    NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ    NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_orders_customer     ON public.orders(customer_id);
CREATE INDEX idx_orders_status       ON public.orders(status);
CREATE INDEX idx_orders_payment      ON public.orders(payment_status);
CREATE INDEX idx_orders_created_by   ON public.orders(created_by);
CREATE INDEX idx_orders_number       ON public.orders(order_number);
CREATE INDEX idx_orders_created_at   ON public.orders(created_at DESC);

-- ============================================================
-- ORDER ITEMS TABLE
-- ============================================================

CREATE TABLE public.order_items (
  id               UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id         UUID          NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id       UUID          NOT NULL REFERENCES public.products(id),
  quantity         INT           NOT NULL CHECK (quantity > 0),
  unit_price       NUMERIC(10,2) NOT NULL CHECK (unit_price >= 0),
  total_price      NUMERIC(12,2) NOT NULL CHECK (total_price >= 0),
  product_snapshot JSONB         NOT NULL DEFAULT '{}',
  created_at       TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_order_items_order   ON public.order_items(order_id);
CREATE INDEX idx_order_items_product ON public.order_items(product_id);

-- ============================================================
-- ACTIVITY LOGS TABLE
-- Append-only audit trail
-- ============================================================

CREATE TABLE public.activity_logs (
  id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID        NOT NULL REFERENCES public.profiles(id),
  action       TEXT        NOT NULL,
  entity_type  TEXT        NOT NULL,
  entity_id    UUID,
  metadata     JSONB,
  ip_address   INET,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_activity_user       ON public.activity_logs(user_id);
CREATE INDEX idx_activity_entity     ON public.activity_logs(entity_type, entity_id);
CREATE INDEX idx_activity_created_at ON public.activity_logs(created_at DESC);

-- ============================================================
-- FUNCTIONS & TRIGGERS
-- ============================================================

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_categories_updated_at
  BEFORE UPDATE ON public.categories
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_products_updated_at
  BEFORE UPDATE ON public.products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_customers_updated_at
  BEFORE UPDATE ON public.customers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_orders_updated_at
  BEFORE UPDATE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Auto-create profile on user signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    'customer'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trg_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Auto-create inventory record on product creation
CREATE OR REPLACE FUNCTION handle_new_product()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.inventory (product_id, quantity, low_stock_threshold)
  VALUES (NEW.id, 0, 10);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_product_created
  AFTER INSERT ON public.products
  FOR EACH ROW EXECUTE FUNCTION handle_new_product();

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================

ALTER TABLE public.profiles       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs   ENABLE ROW LEVEL SECURITY;

-- Helper function: get current user role
CREATE OR REPLACE FUNCTION get_user_role()
RETURNS user_role AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid();
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

-- ---- PROFILES ----
CREATE POLICY "profiles_select_own"
  ON public.profiles FOR SELECT
  USING (id = auth.uid() OR get_user_role() IN ('admin', 'staff'));

CREATE POLICY "profiles_update_own"
  ON public.profiles FOR UPDATE
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

CREATE POLICY "profiles_admin_all"
  ON public.profiles FOR ALL
  USING (get_user_role() = 'admin');

-- ---- CATEGORIES ----
CREATE POLICY "categories_read_authenticated"
  ON public.categories FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "categories_write_admin_staff"
  ON public.categories FOR INSERT
  WITH CHECK (get_user_role() IN ('admin', 'staff'));

CREATE POLICY "categories_update_admin_staff"
  ON public.categories FOR UPDATE
  USING (get_user_role() IN ('admin', 'staff'));

CREATE POLICY "categories_delete_admin"
  ON public.categories FOR DELETE
  USING (get_user_role() = 'admin');

-- ---- PRODUCTS ----
CREATE POLICY "products_read_public"
  ON public.products FOR SELECT
  USING (status = 'active' OR auth.role() = 'authenticated');

CREATE POLICY "products_write_admin_staff"
  ON public.products FOR INSERT
  WITH CHECK (get_user_role() IN ('admin', 'staff'));

CREATE POLICY "products_update_admin_staff"
  ON public.products FOR UPDATE
  USING (get_user_role() IN ('admin', 'staff'));

CREATE POLICY "products_delete_admin"
  ON public.products FOR DELETE
  USING (get_user_role() = 'admin');

-- ---- INVENTORY ----
CREATE POLICY "inventory_read_admin_staff"
  ON public.inventory FOR SELECT
  USING (get_user_role() IN ('admin', 'staff'));

CREATE POLICY "inventory_write_admin_staff"
  ON public.inventory FOR INSERT
  WITH CHECK (get_user_role() IN ('admin', 'staff'));

CREATE POLICY "inventory_update_admin_staff"
  ON public.inventory FOR UPDATE
  USING (get_user_role() IN ('admin', 'staff'));

-- ---- CUSTOMERS ----
CREATE POLICY "customers_read_admin_staff"
  ON public.customers FOR SELECT
  USING (get_user_role() IN ('admin', 'staff'));

CREATE POLICY "customers_write_admin_staff"
  ON public.customers FOR INSERT
  WITH CHECK (get_user_role() IN ('admin', 'staff'));

CREATE POLICY "customers_update_admin_staff"
  ON public.customers FOR UPDATE
  USING (get_user_role() IN ('admin', 'staff'));

CREATE POLICY "customers_delete_admin"
  ON public.customers FOR DELETE
  USING (get_user_role() = 'admin');

-- ---- ORDERS ----
CREATE POLICY "orders_read_admin_staff"
  ON public.orders FOR SELECT
  USING (get_user_role() IN ('admin', 'staff'));

CREATE POLICY "orders_write_admin_staff"
  ON public.orders FOR INSERT
  WITH CHECK (get_user_role() IN ('admin', 'staff'));

CREATE POLICY "orders_update_admin_staff"
  ON public.orders FOR UPDATE
  USING (get_user_role() IN ('admin', 'staff'));

CREATE POLICY "orders_delete_admin"
  ON public.orders FOR DELETE
  USING (get_user_role() = 'admin');

-- ---- ORDER ITEMS ----
CREATE POLICY "order_items_read_admin_staff"
  ON public.order_items FOR SELECT
  USING (get_user_role() IN ('admin', 'staff'));

CREATE POLICY "order_items_write_admin_staff"
  ON public.order_items FOR INSERT
  WITH CHECK (get_user_role() IN ('admin', 'staff'));

-- ---- ACTIVITY LOGS ----
CREATE POLICY "activity_logs_read_admin_staff"
  ON public.activity_logs FOR SELECT
  USING (get_user_role() IN ('admin', 'staff'));

CREATE POLICY "activity_logs_insert_authenticated"
  ON public.activity_logs FOR INSERT
  WITH CHECK (auth.role() = 'authenticated' AND user_id = auth.uid());

-- No UPDATE or DELETE allowed on activity_logs (append-only)

-- ============================================================
-- GRANT PERMISSIONS
-- ============================================================

GRANT USAGE ON SCHEMA public TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticated;
