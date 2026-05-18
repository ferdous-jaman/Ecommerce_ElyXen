import { useState, useEffect, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Search, SlidersHorizontal, ShoppingBag, Package, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/shared/Skeleton";
import { supabase } from "@/lib/supabase";
import { formatCurrency } from "@/lib/utils";
import type { Product } from "@/types/database";

type SortOption = "newest" | "price_asc" | "price_desc" | "name_asc";

function ProductCard({ product }: { product: Product }) {
  const navigate = useNavigate();

  return (
    <Card
      className="group cursor-pointer border-border bg-card hover:shadow-lg transition-all duration-200 overflow-hidden"
      onClick={() => navigate(`/shop/product/${product.id}`)}
    >
      {/* Image */}
      <div className="relative aspect-square bg-muted overflow-hidden">
        {product.images && product.images.length > 0 ? (
          <img
            src={product.images[0]}
            alt={product.name}
            className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <Package className="h-12 w-12 text-muted-foreground/30" />
          </div>
        )}
        {product.compare_price && product.compare_price > product.price && (
          <Badge className="absolute top-2 left-2 bg-destructive text-destructive-foreground text-xs">
            Sale
          </Badge>
        )}
      </div>

      <CardContent className="p-4 space-y-2">
        <p className="text-xs text-muted-foreground font-medium truncate">{product.sku}</p>
        <h3 className="font-semibold text-foreground text-sm leading-tight line-clamp-2 group-hover:text-primary transition-colors">
          {product.name}
        </h3>
        <div className="flex items-center gap-2">
          <span className="font-bold text-foreground">{formatCurrency(product.price)}</span>
          {product.compare_price && product.compare_price > product.price && (
            <span className="text-xs text-muted-foreground line-through">
              {formatCurrency(product.compare_price)}
            </span>
          )}
        </div>
        <Button
          size="sm"
          className="w-full gap-2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/shop/product/${product.id}`);
          }}
        >
          <ShoppingBag className="h-4 w-4" />
          View Product
        </Button>
      </CardContent>
    </Card>
  );
}

function ProductCardSkeleton() {
  return (
    <Card className="overflow-hidden border-border">
      <Skeleton className="aspect-square w-full" />
      <CardContent className="p-4 space-y-2">
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-5 w-20" />
      </CardContent>
    </Card>
  );
}

export function ShopPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [searchParams, setSearchParams] = useSearchParams();

  const search = searchParams.get("q") ?? "";
  const sort = (searchParams.get("sort") ?? "newest") as SortOption;
  const [localSearch, setLocalSearch] = useState(search);

  const fetchProducts = useCallback(async () => {
    setLoading(true);

    let query = supabase
      .from("products")
      .select("*", { count: "exact" })
      .eq("status", "active");

    if (search) {
      query = query.or(`name.ilike.%${search}%,sku.ilike.%${search}%,description.ilike.%${search}%`);
    }

    switch (sort) {
      case "price_asc":
        query = query.order("price", { ascending: true });
        break;
      case "price_desc":
        query = query.order("price", { ascending: false });
        break;
      case "name_asc":
        query = query.order("name", { ascending: true });
        break;
      default:
        query = query.order("created_at", { ascending: false });
    }

    const { data, count, error } = await query;

    if (!error) {
      setProducts(data ?? []);
      setTotal(count ?? 0);
    }
    setLoading(false);
  }, [search, sort]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setSearchParams((prev) => {
      const p = new URLSearchParams(prev);
      if (localSearch) p.set("q", localSearch);
      else p.delete("q");
      return p;
    });
  }

  function handleSort(value: string) {
    setSearchParams((prev) => {
      const p = new URLSearchParams(prev);
      p.set("sort", value);
      return p;
    });
  }

  function clearSearch() {
    setLocalSearch("");
    setSearchParams((prev) => {
      const p = new URLSearchParams(prev);
      p.delete("q");
      return p;
    });
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-black tracking-tight text-foreground">Shop</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {loading ? "Loading products..." : `${total} product${total !== 1 ? "s" : ""} available`}
        </p>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-8">
        <form onSubmit={handleSearch} className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search products..."
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            className="pl-9 pr-8"
          />
          {localSearch && (
            <button
              type="button"
              onClick={clearSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </form>
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4 text-muted-foreground shrink-0" />
          <Select value={sort} onValueChange={handleSort}>
            <SelectTrigger className="w-44">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="price_asc">Price: Low to High</SelectItem>
              <SelectItem value="price_desc">Price: High to Low</SelectItem>
              <SelectItem value="name_asc">Name: A–Z</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Active search badge */}
      {search && (
        <div className="mb-6 flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Results for:</span>
          <Badge variant="secondary" className="gap-1">
            {search}
            <button onClick={clearSearch} className="ml-1">
              <X className="h-3 w-3" />
            </button>
          </Badge>
        </div>
      )}

      {/* Products Grid */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {Array.from({ length: 8 }).map((_, i) => <ProductCardSkeleton key={i} />)}
        </div>
      ) : products.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted">
            <Package className="h-8 w-8 text-muted-foreground" />
          </div>
          <p className="font-semibold text-foreground">No products found</p>
          <p className="text-sm text-muted-foreground max-w-xs">
            {search ? `No results for "${search}". Try a different search term.` : "No products are available right now. Check back soon!"}
          </p>
          {search && (
            <Button variant="outline" size="sm" onClick={clearSearch}>
              Clear search
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
