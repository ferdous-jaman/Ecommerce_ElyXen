import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft, Package, Tag, ShoppingCart, Zap, CheckCircle2, AlertTriangle, Heart,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/shared/Skeleton";
import { supabase } from "@/lib/supabase";
import { formatCurrency } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { useCartStore } from "@/store/useCartStore";
import { useWishlistStore } from "@/store/useWishlistStore";
import { toast } from "sonner";
import type { Product } from "@/types/database";

type ProductWithInventory = Product & {
  categories?: { name: string; slug: string } | null;
  inventory?: { quantity: number; low_stock_threshold: number }[] | null;
};

export function ShopProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { addItem, openCart } = useCartStore();
  const { toggleItem, hasItem } = useWishlistStore();
  const [product, setProduct] = useState<ProductWithInventory | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    if (!id) return;
    async function fetchProduct() {
      setLoading(true);
      const { data, error } = await supabase
        .from("products")
        .select("*, categories(*), inventory(*)")
        .eq("id", id)
        .eq("status", "active")
        .single();

      if (error || !data) {
        setNotFound(true);
      } else {
        setProduct(data as ProductWithInventory);
      }
      setLoading(false);
    }
    fetchProduct();
  }, [id]);

  if (loading) return <ProductDetailSkeleton />;

  if (notFound || !product) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-24 text-center animate-fade-in">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted mx-auto mb-4">
          <Package className="h-8 w-8 text-muted-foreground" />
        </div>
        <h2 className="text-xl font-bold text-foreground">Product not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">This product may have been removed or is no longer available.</p>
        <Button variant="outline" className="mt-6 gap-2" onClick={() => navigate("/shop")}>
          <ArrowLeft className="h-4 w-4" />
          Back to Shop
        </Button>
      </div>
    );
  }

  const invRow = product.inventory?.[0];
  const hasInventory = invRow !== undefined && invRow !== null;
  const stock = invRow?.quantity ?? null;
  const lowThreshold = invRow?.low_stock_threshold ?? 10;
  const isOutOfStock = hasInventory && stock !== null && stock === 0;
  const isLowStock = hasInventory && stock !== null && stock > 0 && stock <= lowThreshold;
  const discount = product.compare_price && product.compare_price > product.price
    ? Math.round(((product.compare_price - product.price) / product.compare_price) * 100)
    : null;

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 animate-fade-in">
      {/* Back */}
      <Button variant="ghost" size="sm" className="mb-6 gap-2 -ml-2" onClick={() => navigate("/shop")}>
        <ArrowLeft className="h-4 w-4" />
        Back to Shop
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Images */}
        <div className="space-y-3">
          <div className="aspect-square rounded-2xl bg-muted overflow-hidden border border-border">
            {product.images && product.images.length > 0 ? (
              <img
                src={product.images[activeImage]}
                alt={product.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                <Package className="h-20 w-20 text-muted-foreground/30" />
              </div>
            )}
          </div>
          {product.images && product.images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-1">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className={`h-16 w-16 shrink-0 rounded-lg overflow-hidden border-2 transition-colors ${
                    activeImage === i ? "border-primary" : "border-border"
                  }`}
                >
                  <img src={img} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="space-y-6">
          {/* Category */}
          {product.categories && (
            <Badge variant="secondary" className="gap-1 text-xs">
              <Tag className="h-3 w-3" />
              {product.categories.name}
            </Badge>
          )}

          <div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground leading-tight">
              {product.name}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground font-mono">SKU: {product.sku}</p>
          </div>

          {/* Price */}
          <div className="flex items-end gap-3">
            <span className="text-3xl font-black text-foreground">{formatCurrency(product.price)}</span>
            {product.compare_price && product.compare_price > product.price && (
              <>
                <span className="text-lg text-muted-foreground line-through mb-0.5">
                  {formatCurrency(product.compare_price)}
                </span>
                <Badge className="bg-destructive text-destructive-foreground mb-0.5">
                  -{discount}%
                </Badge>
              </>
            )}
          </div>

          {/* Stock status */}
          <div className="flex items-center gap-2">
            {isOutOfStock ? (
              <><AlertTriangle className="h-4 w-4 text-destructive" /><span className="text-sm font-medium text-destructive">Out of Stock</span></>
            ) : isLowStock ? (
              <><AlertTriangle className="h-4 w-4 text-amber-500" /><span className="text-sm font-medium text-amber-500">Only {stock} left in stock</span></>
            ) : (
              <><CheckCircle2 className="h-4 w-4 text-emerald-500" /><span className="text-sm font-medium text-emerald-500">In Stock</span></>
            )}
          </div>

          <Separator />

          {/* Description */}
          {product.description && (
            <div>
              <h3 className="text-sm font-semibold text-foreground mb-2">Description</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{product.description}</p>
            </div>
          )}

          {/* Tags */}
          {product.tags && product.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {product.tags.map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>
              ))}
            </div>
          )}

          <Separator />

          {/* CTA */}
          <div className="space-y-3">
            <div className="flex gap-3 items-center">
              <button
                onClick={() => { toggleItem(product as Product); toast.success(hasItem(product.id) ? "Removed from wishlist" : "Added to wishlist!"); }}
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border-2 transition-colors ${
                  hasItem(product.id)
                    ? "border-rose-500 bg-rose-50 text-rose-500 dark:bg-rose-900/20"
                    : "border-border hover:border-rose-400 hover:text-rose-500"
                }`}
                aria-label="Toggle wishlist"
              >
                <Heart className={`h-5 w-5 ${hasItem(product.id) ? "fill-current" : ""}`} />
              </button>
              <Button
                variant="outline"
                className="flex-1 gap-2"
                size="lg"
                disabled={isOutOfStock}
                onClick={() => {
                  if (!product) return;
                  addItem(product as Product);
                  openCart();
                  toast.success("Added to cart!", { description: product.name });
                }}
              >
                <ShoppingCart className="h-5 w-5" />
                {isOutOfStock ? "Out of Stock" : "Add to Cart"}
              </Button>
              <Button
                className="flex-1 gap-2"
                size="lg"
                disabled={isOutOfStock}
                onClick={() => {
                  if (!product) return;
                  addItem(product as Product);
                  if (!isAuthenticated) {
                    navigate("/login?returnTo=/checkout");
                    return;
                  }
                  navigate("/checkout");
                }}
              >
                <Zap className="h-5 w-5" />
                Buy Now
              </Button>
            </div>
            <p className="text-xs text-center text-muted-foreground">
              Free shipping on orders over ৳999
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProductDetailSkeleton() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      <Skeleton className="h-8 w-28 mb-6" />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <Skeleton className="aspect-square rounded-2xl w-full" />
        <div className="space-y-4">
          <Skeleton className="h-5 w-20" />
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-px w-full" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      </div>
    </div>
  );
}
