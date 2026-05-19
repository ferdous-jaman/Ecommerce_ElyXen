import { useNavigate } from "react-router-dom";
import { Heart, ShoppingCart, Zap, Package, Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useWishlistStore } from "@/store/useWishlistStore";
import { useCartStore } from "@/store/useCartStore";
import { useAuth } from "@/contexts/AuthContext";
import { formatCurrency } from "@/lib/utils";
import { toast } from "sonner";

export function WishlistPage() {
  const navigate = useNavigate();
  const { items, removeItem } = useWishlistStore();
  const { addItem, openCart } = useCartStore();
  const { isAuthenticated } = useAuth();

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 py-10 animate-fade-in">
      <div className="mb-8">
        <h1 className="text-2xl font-black tracking-tight text-foreground flex items-center gap-2">
          <Heart className="h-6 w-6 text-rose-500 fill-rose-500" /> Wishlist
        </h1>
        <p className="text-sm text-muted-foreground mt-1">{items.length} saved item{items.length !== 1 ? "s" : ""}</p>
      </div>

      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted">
            <Heart className="h-8 w-8 text-muted-foreground" />
          </div>
          <p className="font-semibold text-foreground">Your wishlist is empty</p>
          <p className="text-sm text-muted-foreground">Save products you love and come back to buy them later.</p>
          <Button className="mt-2 gap-2" onClick={() => navigate("/shop")}>
            <Package className="h-4 w-4" /> Browse Products
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {items.map((product) => {
            const discount = product.compare_price && product.compare_price > product.price
              ? Math.round(((product.compare_price - product.price) / product.compare_price) * 100) : null;
            return (
              <Card key={product.id} className="group cursor-pointer overflow-hidden hover:shadow-lg transition-all"
                onClick={() => navigate(`/shop/product/${product.id}`)}>
                <div className="relative aspect-square bg-muted overflow-hidden">
                  {product.images?.[0]
                    ? <img src={product.images[0]} alt={product.name} className="h-full w-full object-cover group-hover:scale-105 transition-transform" loading="lazy" />
                    : <div className="flex h-full w-full items-center justify-center"><Package className="h-10 w-10 text-muted-foreground/30" /></div>
                  }
                  {discount && <Badge className="absolute top-2 left-2 bg-destructive text-destructive-foreground text-xs">-{discount}%</Badge>}
                  <button
                    onClick={(e) => { e.stopPropagation(); removeItem(product.id); toast.success("Removed from wishlist"); }}
                    className="absolute top-2 right-2 flex h-7 w-7 items-center justify-center rounded-full bg-background/90 text-rose-500 hover:bg-rose-50 transition-colors shadow"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
                <CardContent className="p-3 space-y-2">
                  <h3 className="text-sm font-semibold text-foreground line-clamp-2 leading-tight">{product.name}</h3>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-foreground">{formatCurrency(product.price)}</span>
                    {product.compare_price && product.compare_price > product.price && (
                      <span className="text-xs text-muted-foreground line-through">{formatCurrency(product.compare_price)}</span>
                    )}
                  </div>
                  <div className="flex gap-1.5">
                    <Button size="sm" variant="outline" className="flex-1 gap-1 text-xs h-8"
                      onClick={(e) => { e.stopPropagation(); addItem(product); openCart(); toast.success("Added to cart!"); }}>
                      <ShoppingCart className="h-3.5 w-3.5" /> Cart
                    </Button>
                    <Button size="sm" className="flex-1 gap-1 text-xs h-8"
                      onClick={(e) => {
                        e.stopPropagation(); addItem(product);
                        if (!isAuthenticated) { navigate("/login?returnTo=/checkout"); return; }
                        navigate("/checkout");
                      }}>
                      <Zap className="h-3.5 w-3.5" /> Buy
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
