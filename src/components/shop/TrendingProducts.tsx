import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShoppingCart, Zap, Package, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/shared/Skeleton";
import { supabase } from "@/lib/supabase";
import { formatCurrency } from "@/lib/utils";
import { useCartStore } from "@/store/useCartStore";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import type { Product } from "@/types/database";

function ProductCard({ product }: { product: Product }) {
  const navigate = useNavigate();
  const { addItem, openCart } = useCartStore();
  const { isAuthenticated } = useAuth();

  const discount =
    product.compare_price && product.compare_price > product.price
      ? Math.round(((product.compare_price - product.price) / product.compare_price) * 100)
      : null;

  function handleAddToCart(e: React.MouseEvent) {
    e.stopPropagation();
    if (!isAuthenticated) {
      navigate(`/login?returnTo=/shop/product/${product.id}`);
      return;
    }
    addItem(product);
    openCart();
    toast.success(`${product.name} added to cart!`);
  }

  function handleBuyNow(e: React.MouseEvent) {
    e.stopPropagation();
    if (!isAuthenticated) {
      navigate(`/login?returnTo=/shop/product/${product.id}`);
      return;
    }
    addItem(product);
    navigate("/checkout");
  }

  return (
    <Card
      className="group cursor-pointer border-border bg-card hover:shadow-lg transition-all duration-200 overflow-hidden"
      onClick={() => navigate(`/shop/product/${product.id}`)}
    >
      {/* Image */}
      <div className="relative overflow-hidden bg-muted" style={{ aspectRatio: "1/1" }}>
        {product.images?.[0] ? (
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
        {discount && (
          <Badge className="absolute top-2 left-2 bg-destructive text-destructive-foreground text-xs font-bold">
            -{discount}%
          </Badge>
        )}
      </div>

      <CardContent className="p-3 space-y-2">
        <h3 className="font-semibold text-foreground text-sm leading-snug line-clamp-2 group-hover:text-primary transition-colors">
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

        {/* Action buttons — always visible on mobile, hover on desktop */}
        <div className="flex gap-1.5 pt-1">
          <Button
            size="sm"
            variant="outline"
            className="flex-1 gap-1.5 text-xs h-8"
            onClick={handleAddToCart}
          >
            <ShoppingCart className="h-3.5 w-3.5" />
            Cart
          </Button>
          <Button
            size="sm"
            className="flex-1 gap-1.5 text-xs h-8"
            onClick={handleBuyNow}
          >
            <Zap className="h-3.5 w-3.5" />
            Buy Now
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function ProductSkeleton() {
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

export function TrendingProducts() {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("products")
      .select("*")
      .eq("status", "active")
      .order("created_at", { ascending: false })
      .limit(8)
      .then(({ data }) => {
        if (data) setProducts(data);
        setLoading(false);
      });
  }, []);

  if (!loading && products.length === 0) return null;

  return (
    <section className="py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-foreground">Trending Products</h2>
            <p className="text-sm text-muted-foreground">Most popular picks this week</p>
          </div>
          <Button variant="ghost" size="sm" className="gap-1 text-sm" onClick={() => navigate("/shop")}>
            View All <ArrowRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-4">
          {loading
            ? Array.from({ length: 8 }).map((_, i) => <ProductSkeleton key={i} />)
            : products.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      </div>
    </section>
  );
}
