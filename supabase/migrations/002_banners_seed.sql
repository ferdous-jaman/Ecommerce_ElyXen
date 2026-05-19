-- ============================================================
-- Migration 002: Banners table + RLS fixes + Storage + Seed data
-- Run this in Supabase SQL Editor
-- ============================================================

-- ── 1. BANNERS TABLE ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.banners (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title        text NOT NULL,
  subtitle     text,
  image_url    text NOT NULL,
  link_url     text,
  button_text  text DEFAULT 'Shop Now',
  order_index  integer NOT NULL DEFAULT 0,
  is_active    boolean NOT NULL DEFAULT true,
  created_by   uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at   timestamptz NOT NULL DEFAULT now(),
  updated_at   timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.banners ENABLE ROW LEVEL SECURITY;

-- Public can read active banners
CREATE POLICY "banners_read_public"
  ON public.banners FOR SELECT
  USING (is_active = true OR auth.role() = 'authenticated');

-- Admin + Staff can manage banners
CREATE POLICY "banners_write_admin_staff"
  ON public.banners FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role IN ('admin','staff')
    )
  );

CREATE POLICY "banners_update_admin_staff"
  ON public.banners FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role IN ('admin','staff')
    )
  );

CREATE POLICY "banners_delete_admin_staff"
  ON public.banners FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role IN ('admin','staff')
    )
  );

-- updated_at trigger for banners
CREATE TRIGGER banners_updated_at
  BEFORE UPDATE ON public.banners
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ── 2. FIX RLS — products public read ────────────────────────
-- Drop old authenticated-only policy and replace with public read
DROP POLICY IF EXISTS "products_read_authenticated" ON public.products;

-- Make sure public read policy exists (idempotent)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'products' AND policyname = 'products_read_public'
  ) THEN
    EXECUTE $p$
      CREATE POLICY "products_read_public"
        ON public.products FOR SELECT
        USING (status = 'active' OR auth.role() = 'authenticated');
    $p$;
  END IF;
END $$;

-- ── 3. FIX RLS — categories public read ──────────────────────
DROP POLICY IF EXISTS "categories_read_authenticated" ON public.categories;

CREATE POLICY "categories_read_public"
  ON public.categories FOR SELECT
  USING (true);

-- ── 4. STORAGE BUCKETS ───────────────────────────────────────
INSERT INTO storage.buckets (id, name, public)
  VALUES ('banners', 'banners', true)
  ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public)
  VALUES ('product-images', 'product-images', true)
  ON CONFLICT (id) DO NOTHING;

-- Storage policies: public read
CREATE POLICY "banners_storage_public_read"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'banners');

CREATE POLICY "product_images_storage_public_read"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'product-images');

-- Storage policies: admin/staff upload
CREATE POLICY "banners_storage_admin_staff_upload"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'banners' AND
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role IN ('admin','staff')
    )
  );

CREATE POLICY "product_images_storage_admin_staff_upload"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'product-images' AND
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role IN ('admin','staff')
    )
  );

CREATE POLICY "banners_storage_admin_staff_delete"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'banners' AND
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role IN ('admin','staff')
    )
  );

CREATE POLICY "product_images_storage_admin_staff_delete"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'product-images' AND
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role IN ('admin','staff')
    )
  );

-- ── 5. SEED CATEGORIES ───────────────────────────────────────
INSERT INTO public.categories (id, name, slug, description) VALUES
  ('c1000000-0000-0000-0000-000000000001', 'Electronics',    'electronics',    'Phones, laptops, gadgets and accessories'),
  ('c1000000-0000-0000-0000-000000000002', 'Fashion',        'fashion',        'Clothing, shoes and accessories'),
  ('c1000000-0000-0000-0000-000000000003', 'Home & Living',  'home-living',    'Furniture, decor and appliances'),
  ('c1000000-0000-0000-0000-000000000004', 'Sports',         'sports',         'Fitness, outdoor and sports gear'),
  ('c1000000-0000-0000-0000-000000000005', 'Beauty',         'beauty',         'Skincare, makeup and personal care'),
  ('c1000000-0000-0000-0000-000000000006', 'Books',          'books',          'Textbooks, novels and educational materials'),
  ('c1000000-0000-0000-0000-000000000007', 'Groceries',      'groceries',      'Fresh food and daily essentials'),
  ('c1000000-0000-0000-0000-000000000008', 'Toys & Kids',    'toys-kids',      'Toys, games and kids products')
ON CONFLICT (id) DO NOTHING;

-- ── 6. SEED PRODUCTS ─────────────────────────────────────────
-- We need a created_by UUID — use a placeholder that will be
-- replaced once a real admin user exists. For now we use a fixed
-- UUID that matches the first admin profile if it exists,
-- otherwise we insert without it (will fail FK if profiles empty).
-- Run AFTER at least one admin user has signed up.

DO $$
DECLARE
  admin_id uuid;
BEGIN
  SELECT id INTO admin_id FROM public.profiles WHERE role = 'admin' LIMIT 1;
  IF admin_id IS NULL THEN
    RAISE NOTICE 'No admin user found — skipping product seed. Sign up first, then re-run this block.';
    RETURN;
  END IF;

  INSERT INTO public.products
    (id, name, slug, description, sku, price, compare_price, category_id, status, images, tags, created_by)
  VALUES
    -- Electronics
    (gen_random_uuid(), 'Wireless Noise-Cancelling Headphones', 'wireless-nc-headphones',
     'Premium over-ear headphones with active noise cancellation, 30-hour battery life, and Hi-Res audio support.',
     'ELX-HDPH-001', 2999, 4500,
     'c1000000-0000-0000-0000-000000000001', 'active',
     ARRAY['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600'],
     ARRAY['headphones','wireless','audio'], admin_id),

    (gen_random_uuid(), 'Smart Watch Pro 2025', 'smart-watch-pro-2025',
     'Feature-packed smartwatch with health monitoring, GPS, and 7-day battery life.',
     'ELX-WTCH-002', 8500, 12000,
     'c1000000-0000-0000-0000-000000000001', 'active',
     ARRAY['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600'],
     ARRAY['smartwatch','wearable','fitness'], admin_id),

    (gen_random_uuid(), 'Mechanical Gaming Keyboard', 'mechanical-gaming-keyboard',
     'RGB backlit mechanical keyboard with Cherry MX switches, anti-ghosting and detachable wrist rest.',
     'ELX-KBRD-003', 3200, 4200,
     'c1000000-0000-0000-0000-000000000001', 'active',
     ARRAY['https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600'],
     ARRAY['keyboard','gaming','rgb'], admin_id),

    (gen_random_uuid(), 'Portable Bluetooth Speaker', 'portable-bluetooth-speaker',
     'Waterproof 360° surround sound speaker with 20-hour playtime and built-in mic.',
     'ELX-SPKR-004', 1800, 2500,
     'c1000000-0000-0000-0000-000000000001', 'active',
     ARRAY['https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600'],
     ARRAY['speaker','bluetooth','portable'], admin_id),

    -- Fashion
    (gen_random_uuid(), 'Men''s Premium Slim Fit Shirt', 'mens-premium-slim-fit-shirt',
     'Premium cotton slim fit formal shirt, available in multiple colors.',
     'ELX-SHRT-005', 850, 1200,
     'c1000000-0000-0000-0000-000000000002', 'active',
     ARRAY['https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600'],
     ARRAY['shirt','men','formal'], admin_id),

    (gen_random_uuid(), 'Women''s Casual Sneakers', 'womens-casual-sneakers',
     'Lightweight and stylish casual sneakers for everyday comfort.',
     'ELX-SNKR-006', 1600, 2200,
     'c1000000-0000-0000-0000-000000000002', 'active',
     ARRAY['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600'],
     ARRAY['shoes','women','casual'], admin_id),

    -- Home & Living
    (gen_random_uuid(), 'Ceramic Coffee Mug Set (6 pcs)', 'ceramic-coffee-mug-set',
     'Elegant ceramic coffee mugs with minimalist design. Microwave and dishwasher safe.',
     'ELX-MUG-007', 650, 900,
     'c1000000-0000-0000-0000-000000000003', 'active',
     ARRAY['https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=600'],
     ARRAY['mug','kitchen','ceramic'], admin_id),

    (gen_random_uuid(), 'Aromatherapy Diffuser', 'aromatherapy-diffuser',
     'Ultrasonic essential oil diffuser with 7-color LED, auto shut-off, and 400ml capacity.',
     'ELX-DIFF-008', 1200, 1800,
     'c1000000-0000-0000-0000-000000000003', 'active',
     ARRAY['https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=600'],
     ARRAY['home','wellness','diffuser'], admin_id),

    -- Sports
    (gen_random_uuid(), 'Yoga Mat Pro', 'yoga-mat-pro',
     'Non-slip 6mm thick TPE yoga mat with alignment lines and carrying strap.',
     'ELX-YOGA-009', 980, 1400,
     'c1000000-0000-0000-0000-000000000004', 'active',
     ARRAY['https://images.unsplash.com/photo-1592432678016-e910b452f9a2?w=600'],
     ARRAY['yoga','fitness','mat'], admin_id),

    (gen_random_uuid(), 'Adjustable Dumbbell Set', 'adjustable-dumbbell-set',
     'Space-saving adjustable dumbbells from 5kg to 25kg per hand. Perfect for home gym.',
     'ELX-DUMB-010', 5500, 7500,
     'c1000000-0000-0000-0000-000000000004', 'active',
     ARRAY['https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600'],
     ARRAY['gym','weights','fitness'], admin_id),

    -- Beauty
    (gen_random_uuid(), 'Vitamin C Face Serum', 'vitamin-c-face-serum',
     '20% Vitamin C brightening serum with hyaluronic acid and niacinamide. Dermatologist tested.',
     'ELX-SRUM-011', 750, 1100,
     'c1000000-0000-0000-0000-000000000005', 'active',
     ARRAY['https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600'],
     ARRAY['skincare','serum','beauty'], admin_id),

    -- Books
    (gen_random_uuid(), 'Atomic Habits — James Clear', 'atomic-habits-james-clear',
     'The #1 New York Times bestseller. A proven framework for improving every day.',
     'ELX-BOOK-012', 480, 650,
     'c1000000-0000-0000-0000-000000000006', 'active',
     ARRAY['https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600'],
     ARRAY['book','self-help','bestseller'], admin_id)

  ON CONFLICT (slug) DO NOTHING;

  -- Insert inventory for all products
  INSERT INTO public.inventory (product_id, quantity, reserved_quantity, low_stock_threshold)
  SELECT id, floor(random() * 200 + 20)::int, 0, 10
  FROM public.products
  WHERE created_by = admin_id
  ON CONFLICT (product_id) DO NOTHING;

  RAISE NOTICE 'Seeded % products successfully.', (SELECT count(*) FROM public.products WHERE created_by = admin_id);
END $$;

-- ── 7. SEED BANNERS ──────────────────────────────────────────
DO $$
DECLARE
  admin_id uuid;
BEGIN
  SELECT id INTO admin_id FROM public.profiles WHERE role = 'admin' LIMIT 1;
  IF admin_id IS NULL THEN
    RAISE NOTICE 'No admin user found — skipping banner seed.';
    RETURN;
  END IF;

  INSERT INTO public.banners
    (title, subtitle, image_url, link_url, button_text, order_index, is_active, created_by)
  VALUES
    ('Mega Sale — Up to 70% Off',
     'Shop the biggest sale of the year on electronics, fashion and more.',
     'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1400',
     '/shop', 'Shop Now', 1, true, admin_id),

    ('New Arrivals This Week',
     'Fresh drops every week — be the first to grab the latest products.',
     'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1400',
     '/shop?sort=newest', 'Browse New', 2, true, admin_id),

    ('Free Shipping on Orders Over ৳999',
     'Order today and get free doorstep delivery anywhere in Bangladesh.',
     'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=1400',
     '/shop', 'Start Shopping', 3, true, admin_id)
  ON CONFLICT DO NOTHING;

  RAISE NOTICE 'Banners seeded.';
END $$;
