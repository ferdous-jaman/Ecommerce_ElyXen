import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowLeft, ShoppingBag, Truck, CreditCard, CheckCircle2, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useCartStore } from "@/store/useCartStore";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { formatCurrency } from "@/lib/utils";
import { toast } from "sonner";

const checkoutSchema = z.object({
  full_name: z.string().min(2, "Full name required"),
  phone: z.string().min(10, "Valid phone number required"),
  address_line1: z.string().min(5, "Address required"),
  city: z.string().min(2, "City required"),
  district: z.string().min(2, "District required"),
  notes: z.string().optional(),
});
type CheckoutForm = z.infer<typeof checkoutSchema>;

export function CheckoutPage() {
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const { items, totalPrice, totalItems, clearCart } = useCartStore();
  const [placing, setPlacing] = useState(false);
  const [done, setDone] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);

  const subtotal = totalPrice();
  const shipping = subtotal >= 999 ? 0 : 60;
  const total = subtotal + shipping;

  const { register, handleSubmit, formState: { errors } } = useForm<CheckoutForm>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: { full_name: profile?.full_name ?? "", phone: "", address_line1: "", city: "", district: "", notes: "" },
  });

  async function onSubmit(data: CheckoutForm) {
    if (!user || items.length === 0) return;
    setPlacing(true);
    try {
      const orderRef = `ORD-${Date.now().toString(36).toUpperCase()}`;
      const { data: order, error } = await supabase.from("orders").insert({
        order_number: orderRef,
        customer_id: user.id,
        status: "pending",
        payment_status: "pending",
        subtotal,
        shipping_cost: shipping,
        total_amount: total,
        shipping_address: {
          full_name: data.full_name,
          phone: data.phone,
          address_line1: data.address_line1,
          city: data.city,
          district: data.district,
        },
        notes: data.notes ?? null,
      }).select().single();

      if (error || !order) throw new Error(error?.message ?? "Order failed");

      // Insert order items
      const orderItems = items.map((item) => ({
        order_id: order.id,
        product_id: item.product.id,
        product_name: item.product.name,
        product_sku: item.product.sku,
        quantity: item.quantity,
        unit_price: item.product.price,
        total_price: item.product.price * item.quantity,
      }));
      await supabase.from("order_items").insert(orderItems);

      clearCart();
      setOrderId(orderRef);
      setDone(true);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Please try again.";
      toast.error("Order failed", { description: message });
    }
    setPlacing(false);
  }

  if (items.length === 0 && !done) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-24 text-center animate-fade-in">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted mx-auto mb-4">
          <ShoppingBag className="h-8 w-8 text-muted-foreground" />
        </div>
        <h2 className="text-xl font-bold">Your cart is empty</h2>
        <p className="text-sm text-muted-foreground mt-2">Add some products before checking out.</p>
        <Button className="mt-6 gap-2" onClick={() => navigate("/shop")}>
          <ShoppingBag className="h-4 w-4" /> Browse Products
        </Button>
      </div>
    );
  }

  if (done) {
    return (
      <div className="mx-auto max-w-md px-4 py-24 text-center animate-fade-in">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30 mx-auto mb-6">
          <CheckCircle2 className="h-10 w-10 text-emerald-500" />
        </div>
        <h2 className="text-2xl font-black text-foreground">Order Placed!</h2>
        <p className="text-muted-foreground mt-2">Thank you for your order. We'll confirm it shortly.</p>
        <div className="mt-4 rounded-xl border border-border bg-muted/30 p-4 text-sm">
          <p className="text-muted-foreground">Order ID</p>
          <p className="font-mono font-bold text-foreground text-lg">{orderId}</p>
        </div>
        <div className="flex gap-3 mt-8 justify-center">
          <Button variant="outline" onClick={() => navigate("/account/orders")}>My Orders</Button>
          <Button onClick={() => navigate("/shop")}>Continue Shopping</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-10 animate-fade-in">
      <Button variant="ghost" size="sm" className="mb-6 gap-2 -ml-2" onClick={() => navigate(-1)}>
        <ArrowLeft className="h-4 w-4" /> Back
      </Button>
      <h1 className="text-2xl font-black tracking-tight text-foreground mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="lg:col-span-3 space-y-6">
          {/* Shipping */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-base flex items-center gap-2">
                <Truck className="h-4 w-4 text-primary" /> Delivery Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label>Full Name *</Label>
                  <Input placeholder="Your full name" {...register("full_name")} />
                  {errors.full_name && <p className="text-xs text-destructive">{errors.full_name.message}</p>}
                </div>
                <div className="space-y-1.5">
                  <Label>Phone Number *</Label>
                  <Input placeholder="01XXXXXXXXX" {...register("phone")} />
                  {errors.phone && <p className="text-xs text-destructive">{errors.phone.message}</p>}
                </div>
              </div>
              <div className="space-y-1.5">
                <Label>Address *</Label>
                <Input placeholder="House/Road/Area" {...register("address_line1")} />
                {errors.address_line1 && <p className="text-xs text-destructive">{errors.address_line1.message}</p>}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label>City *</Label>
                  <Input placeholder="Dhaka" {...register("city")} />
                  {errors.city && <p className="text-xs text-destructive">{errors.city.message}</p>}
                </div>
                <div className="space-y-1.5">
                  <Label>District *</Label>
                  <Input placeholder="Dhaka" {...register("district")} />
                  {errors.district && <p className="text-xs text-destructive">{errors.district.message}</p>}
                </div>
              </div>
              <div className="space-y-1.5">
                <Label>Order Notes <span className="text-muted-foreground text-xs">(optional)</span></Label>
                <Input placeholder="Special instructions for delivery..." {...register("notes")} />
              </div>
            </CardContent>
          </Card>

          {/* Payment */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-base flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-primary" /> Payment Method
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3 rounded-xl border-2 border-primary bg-primary/5 p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <CreditCard className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-sm text-foreground">Cash on Delivery</p>
                  <p className="text-xs text-muted-foreground">Pay when your order arrives</p>
                </div>
                <Badge className="ml-auto">Available</Badge>
              </div>
            </CardContent>
          </Card>

          <Button type="submit" size="lg" className="w-full gap-2 font-bold" disabled={placing}>
            {placing ? "Placing Order..." : `Place Order — ${formatCurrency(total)}`}
          </Button>
        </form>

        {/* Order Summary */}
        <div className="lg:col-span-2">
          <Card className="sticky top-24">
            <CardHeader className="pb-4">
              <CardTitle className="text-base flex items-center gap-2">
                <ShoppingBag className="h-4 w-4" /> Order Summary
                <Badge variant="secondary" className="ml-auto">{totalItems()} items</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {items.map(({ product, quantity }) => (
                  <div key={product.id} className="flex items-center gap-3">
                    <div className="h-12 w-12 shrink-0 rounded-lg bg-muted overflow-hidden border border-border">
                      {product.images?.[0]
                        ? <img src={product.images[0]} alt={product.name} className="h-full w-full object-cover" />
                        : <div className="flex h-full w-full items-center justify-center"><Package className="h-5 w-5 text-muted-foreground/30" /></div>
                      }
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-foreground line-clamp-1">{product.name}</p>
                      <p className="text-xs text-muted-foreground">Qty: {quantity}</p>
                    </div>
                    <p className="text-xs font-bold text-foreground shrink-0">{formatCurrency(product.price * quantity)}</p>
                  </div>
                ))}
              </div>

              <Separator />

              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal</span><span>{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Shipping</span>
                  <span className={shipping === 0 ? "text-emerald-500 font-medium" : ""}>
                    {shipping === 0 ? "Free" : formatCurrency(shipping)}
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between font-black text-foreground text-base">
                  <span>Total</span><span>{formatCurrency(total)}</span>
                </div>
              </div>

              {subtotal < 999 && (
                <p className="text-xs text-center text-muted-foreground bg-muted/50 rounded-lg p-2">
                  Add {formatCurrency(999 - subtotal)} more for free shipping!
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
