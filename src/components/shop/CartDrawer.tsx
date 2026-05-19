import { useNavigate } from "react-router-dom";
import { X, Minus, Plus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useCartStore } from "@/store/useCartStore";
import { useAuth } from "@/contexts/AuthContext";
import { formatCurrency } from "@/lib/utils";

export function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, clearCart, totalItems, totalPrice } =
    useCartStore();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  function handleCheckout() {
    closeCart();
    if (!isAuthenticated) {
      navigate("/login?returnTo=/checkout");
    } else {
      navigate("/checkout");
    }
  }

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm animate-fade-in"
        onClick={closeCart}
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col bg-background shadow-2xl animate-slide-in-right">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <div className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5 text-primary" />
            <h2 className="text-base font-bold text-foreground">Your Cart</h2>
            {totalItems() > 0 && (
              <Badge className="h-5 min-w-5 text-xs">{totalItems()}</Badge>
            )}
          </div>
          <div className="flex items-center gap-2">
            {items.length > 0 && (
              <Button variant="ghost" size="sm" className="text-xs text-muted-foreground h-7" onClick={clearCart}>
                Clear all
              </Button>
            )}
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={closeCart}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-center py-16">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted">
                <ShoppingBag className="h-8 w-8 text-muted-foreground" />
              </div>
              <p className="font-semibold text-foreground">Your cart is empty</p>
              <p className="text-sm text-muted-foreground max-w-xs">
                Browse our products and add items to your cart.
              </p>
              <Button size="sm" onClick={() => { closeCart(); navigate("/shop"); }} className="gap-2 mt-2">
                <ShoppingBag className="h-4 w-4" />
                Browse Products
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map(({ product, quantity }) => (
                <div key={product.id} className="flex gap-3">
                  {/* Image — fixed 64×64, never grows */}
                  <div className="shrink-0 overflow-hidden rounded-xl bg-muted border border-border" style={{ width: 64, height: 64, minWidth: 64, minHeight: 64 }}>
                    {product.images?.[0] ? (
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="object-cover"
                        style={{ width: 64, height: 64, display: "block" }}
                      />
                    ) : (
                      <div className="flex items-center justify-center" style={{ width: 64, height: 64 }}>
                        <ShoppingBag className="h-6 w-6 text-muted-foreground/30" />
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex flex-1 flex-col gap-1 min-w-0">
                    <p className="text-sm font-semibold text-foreground line-clamp-2 leading-tight">
                      {product.name}
                    </p>
                    <p className="text-sm font-bold text-primary">
                      {formatCurrency(product.price)}
                    </p>
                    {product.compare_price && product.compare_price > product.price && (
                      <p className="text-xs text-muted-foreground line-through">
                        {formatCurrency(product.compare_price)}
                      </p>
                    )}

                    {/* Quantity + Delete */}
                    <div className="flex items-center justify-between mt-1">
                      <div className="flex items-center gap-1 rounded-lg border border-border bg-muted/50">
                        <button
                          className="flex h-7 w-7 items-center justify-center rounded-l-lg hover:bg-muted transition-colors"
                          onClick={() => updateQuantity(product.id, quantity - 1)}
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="w-8 text-center text-sm font-semibold">{quantity}</span>
                        <button
                          className="flex h-7 w-7 items-center justify-center rounded-r-lg hover:bg-muted transition-colors"
                          onClick={() => updateQuantity(product.id, quantity + 1)}
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                      <button
                        onClick={() => removeItem(product.id)}
                        className="text-muted-foreground hover:text-destructive transition-colors p-1"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-border px-5 py-4 space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>Subtotal ({totalItems()} items)</span>
                <span>{formatCurrency(totalPrice())}</span>
              </div>
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>Shipping</span>
                <span className="text-emerald-500">
                  {totalPrice() >= 999 ? "Free" : formatCurrency(60)}
                </span>
              </div>
              <Separator />
              <div className="flex items-center justify-between font-bold text-foreground">
                <span>Total</span>
                <span className="text-lg">
                  {formatCurrency(totalPrice() >= 999 ? totalPrice() : totalPrice() + 60)}
                </span>
              </div>
            </div>

            <Button className="w-full gap-2" size="lg" onClick={handleCheckout}>
              {isAuthenticated ? "Proceed to Checkout" : "Sign in to Checkout"}
              <ArrowRight className="h-4 w-4" />
            </Button>

            <Button variant="outline" className="w-full" size="sm" onClick={() => { closeCart(); navigate("/shop"); }}>
              Continue Shopping
            </Button>

            {totalPrice() < 999 && (
              <p className="text-xs text-center text-muted-foreground">
                Add {formatCurrency(999 - totalPrice())} more for free shipping
              </p>
            )}
          </div>
        )}
      </div>
    </>
  );
}
