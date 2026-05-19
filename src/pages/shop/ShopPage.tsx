import { useState, useEffect, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Search, ShoppingCart, Zap, Package, X, ChevronRight, Heart } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/shared/Skeleton";
import { supabase } from "@/lib/supabase";
import { formatCurrency } from "@/lib/utils";
import { useCartStore } from "@/store/useCartStore";
import { useWishlistStore } from "@/store/useWishlistStore";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import type { Product } from "@/types/database";

type SortOption = "newest" | "price_asc" | "price_desc" | "name_asc";
type Category = { id: string; name: string; slug: string };

function ProductCard({ product }: { product: Product }) {
  const navigate = useNavigate();
  const { addItem, openCart } = useCartStore();
  const { toggleItem, hasItem } = useWishlistStore();
  const { isAuthenticated } = useAuth();
  const discount = product.compare_price && product.compare_price > product.price
    ? Math.round(((product.compare_price - product.price) / product.compare_price) * 100) : null;
  const wished = hasItem(product.id);

  function handleAddToCart(e: React.MouseEvent) {
    e.stopPropagation();
    addItem(product);
    openCart();
    toast.success("Added to cart!", { description: product.name });
  }

  function handleBuyNow(e: React.MouseEvent) {
    e.stopPropagation();
    addItem(product);
    if (!isAuthenticated) { navigate("/login?returnTo=/checkout"); return; }
    navigate("/checkout");
  }

  return (
    <Card
      className="group cursor-pointer border-border bg-card hover:shadow-lg transition-all duration-200 overflow-hidden"
      onClick={() => navigate(`/shop/product/${product.id}`)}
    >
      <div className="relative aspect-square bg-muted overflow-hidden">
        {product.images?.[0] ? (
          <img src={product.images[0]} alt={product.name}
            className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy" />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <Package className="h-12 w-12 text-muted-foreground/30" />
          </div>
        )}
        {discount && (
          <Badge className="absolute top-2 left-2 bg-destructive text-destructive-foreground text-xs font-bold">
            -{discount}%
          </Badge>
        )}
        <button
          onClick={(e) => { e.stopPropagation(); toggleItem(product); toast.success(wished ? "Removed from wishlist" : "Added to wishlist!"); }}
          className={`absolute top-2 right-2 flex h-7 w-7 items-center justify-center rounded-full shadow transition-colors ${
            wished ? "bg-rose-500 text-white" : "bg-background/90 text-muted-foreground hover:text-rose-500"
          }`}
        >
          <Heart className={`h-3.5 w-3.5 ${wished ? "fill-current" : ""}`} />
        </button>
      </div>
      <CardContent className="p-3 space-y-2">
        <h3 className="font-semibold text-foreground text-sm leading-tight line-clamp-2 group-hover:text-primary transition-colors">
          {product.name}
        </h3>
        <div className="flex items-center gap-2">
          <span className="font-bold text-foreground">{formatCurrency(product.price)}</span>
          {product.compare_price && product.compare_price > product.price && (
            <span className="text-xs text-muted-foreground line-through">{formatCurrency(product.compare_price)}</span>
          )}
        </div>
        <div className="flex gap-1.5 pt-1">
          <Button size="sm" variant="outline" className="flex-1 gap-1 text-xs h-8" onClick={handleAddToCart}>
            <ShoppingCart className="h-3.5 w-3.5" /> Cart
          </Button>
          <Button size="sm" className="flex-1 gap-1 text-xs h-8" onClick={handleBuyNow}>
            <Zap className="h-3.5 w-3.5" /> Buy Now
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function ProductCardSkeleton() {
  return (
    <Card className="overflow-hidden border-border">
      <Skeleton className="aspect-square w-full" />
      <CardContent className="p-3 space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-5 w-20" />
        <div className="flex gap-1.5 pt-1">
          <Skeleton className="h-8 flex-1" />
          <Skeleton className="h-8 flex-1" />
        </div>
      </CardContent>
    </Card>
  );
}

export function ShopPage() {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [searchParams, setSearchParams] = useSearchParams();

  const search = searchParams.get("q") ?? "";
  const sort = (searchParams.get("sort") ?? "newest") as SortOption;
  const categorySlug = searchParams.get("category") ?? "";
  const [localSearch, setLocalSearch] = useState(search);

  // Load categories for sidebar
  useEffect(() => {
    supabase.from("categories").select("id,name,slug").order("name")
      .then(({ data }) => { if (data) setCategories(data); });
  }, []);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    let query = supabase.from("products").select("*", { count: "exact" }).eq("status", "active");

    if (search) query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`);

    if (categorySlug) {
      // Join category by slug
      const { data: cat } = await supabase.from("categories").select("id").eq("slug", categorySlug).single();
      if (cat) query = query.eq("category_id", cat.id);
    }

    switch (sort) {
      case "price_asc": query = query.order("price", { ascending: true }); break;
      case "price_desc": query = query.order("price", { ascending: false }); break;
      case "name_asc": query = query.order("name", { ascending: true }); break;
      default: query = query.order("created_at", { ascending: false });
    }

    const { data, count, error } = await query;
    if (!error) { setProducts(data ?? []); setTotal(count ?? 0); }
    setLoading(false);
  }, [search, sort, categorySlug]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setSearchParams((prev) => {
      const p = new URLSearchParams(prev);
      if (localSearch) p.set("q", localSearch); else p.delete("q");
      return p;
    });
  }

  function setCategory(slug: string) {
    setSearchParams((prev) => {
      const p = new URLSearchParams(prev);
      if (slug) p.set("category", slug); else p.delete("category");
      p.delete("q");
      return p;
    });
    setLocalSearch("");
  }

  const activeCategory = categories.find((c) => c.slug === categorySlug);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <div className="flex gap-8">
        {/* Sidebar */}
        <aside className="hidden lg:block w-52 shrink-0">
          <div className="sticky top-24 space-y-1">
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-3 px-2">Categories</p>
            <button
              onClick={() => setCategory("")}
              className={`flex items-center justify-between w-full px-3 py-2 rounded-lg text-sm font-medium transition-colors ${!categorySlug ? "bg-primary text-primary-foreground" : "hover:bg-muted text-foreground"}`}
            >
              All Products
              <ChevronRight className="h-3.5 w-3.5 opacity-50" />
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setCategory(cat.slug)}
                className={`flex items-center justify-between w-full px-3 py-2 rounded-lg text-sm font-medium transition-colors ${categorySlug === cat.slug ? "bg-primary text-primary-foreground" : "hover:bg-muted text-foreground"}`}
              >
                {cat.name}
                <ChevronRight className="h-3.5 w-3.5 opacity-50" />
              </button>
            ))}
          </div>
        </aside>

        {/* Main */}
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
            <div>
              <h1 className="text-2xl font-black tracking-tight text-foreground">
                {activeCategory ? activeCategory.name : "All Products"}
              </h1>
              <p className="text-sm text-muted-foreground mt-0.5">
                {loading ? "Loading..." : `${total} product${total !== 1 ? "s" : ""} found`}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Select value={sort} onValueChange={(v) => setSearchParams((p) => { const n = new URLSearchParams(p); n.set("sort", v); return n; })}>
                <SelectTrigger className="w-44 h-9 text-sm">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="price_asc">Price: Low → High</SelectItem>
                  <SelectItem value="price_desc">Price: High → Low</SelectItem>
                  <SelectItem value="name_asc">Name: A–Z</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Search */}
          <form onSubmit={handleSearch} className="relative mb-6">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search products..." value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)} className="pl-9 pr-8" />
            {localSearch && (
              <button type="button" onClick={() => { setLocalSearch(""); setSearchParams((p) => { const n = new URLSearchParams(p); n.delete("q"); return n; }); }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </form>

          {/* Active filters */}
          {(categorySlug || search) && (
            <div className="flex items-center gap-2 mb-5 flex-wrap">
              {categorySlug && (
                <Badge variant="secondary" className="gap-1 text-xs">
                  {activeCategory?.name ?? categorySlug}
                  <button onClick={() => setCategory("")}><X className="h-3 w-3" /></button>
                </Badge>
              )}
              {search && (
                <Badge variant="secondary" className="gap-1 text-xs">
                  "{search}"
                  <button onClick={() => { setLocalSearch(""); setSearchParams((p) => { const n = new URLSearchParams(p); n.delete("q"); return n; }); }}>
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}
              <button onClick={() => { navigate("/shop"); setLocalSearch(""); }}
                className="text-xs text-muted-foreground hover:text-foreground underline">Clear all</button>
            </div>
          )}

          {/* Mobile category chips */}
          <div className="flex lg:hidden gap-2 mb-5 overflow-x-auto pb-1 -mx-1 px-1">
            <button onClick={() => setCategory("")}
              className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${!categorySlug ? "bg-primary text-primary-foreground border-primary" : "border-border text-foreground hover:bg-muted"}`}>
              All
            </button>
            {categories.map((cat) => (
              <button key={cat.id} onClick={() => setCategory(cat.slug)}
                className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${categorySlug === cat.slug ? "bg-primary text-primary-foreground border-primary" : "border-border text-foreground hover:bg-muted"}`}>
                {cat.name}
              </button>
            ))}
          </div>

          {/* Grid */}
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4">
              {Array.from({ length: 8 }).map((_, i) => <ProductCardSkeleton key={i} />)}
            </div>
          ) : products.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted">
                <Package className="h-8 w-8 text-muted-foreground" />
              </div>
              <p className="font-semibold text-foreground">No products found</p>
              <p className="text-sm text-muted-foreground max-w-xs">
                {search ? `No results for "${search}".` : categorySlug ? `No products in this category yet.` : "No products available right now."}
              </p>
              <Button variant="outline" size="sm" onClick={() => { navigate("/shop"); setLocalSearch(""); }}>
                Browse all products
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4">
              {products.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
