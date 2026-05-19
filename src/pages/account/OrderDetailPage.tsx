import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Package, Truck, CreditCard, MapPin } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/shared/Skeleton";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { formatCurrency, formatDate } from "@/lib/utils";

type OrderItem = {
  id: string;
  product_name: string;
  product_sku: string;
  quantity: number;
  unit_price: number;
  total_price: number;
};

type Order = {
  id: string;
  order_number: string;
  status: string;
  payment_status: string;
  subtotal: number;
  shipping_cost: number;
  total_amount: number;
  created_at: string;
  notes: string | null;
  shipping_address: {
    full_name: string;
    phone: string;
    address_line1: string;
    city: string;
    district: string;
  };
  order_items: OrderItem[];
};

const STATUS_COLORS: Record<string, string> = {
  pending:    "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  confirmed:  "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  processing: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  shipped:    "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400",
  delivered:  "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  cancelled:  "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};

export function CustomerOrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id || !user) return;
    supabase
      .from("orders")
      .select("*,order_items(*)")
      .eq("id", id)
      .eq("customer_id", user.id)
      .single()
      .then(({ data }) => {
        setOrder(data as Order);
        setLoading(false);
      });
  }, [id, user]);

  if (loading) return (
    <div className="mx-auto max-w-3xl px-4 py-10 space-y-4">
      <Skeleton className="h-8 w-32" />
      <Skeleton className="h-40 w-full rounded-xl" />
      <Skeleton className="h-60 w-full rounded-xl" />
    </div>
  );

  if (!order) return (
    <div className="mx-auto max-w-3xl px-4 py-24 text-center">
      <Package className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
      <p className="font-semibold">Order not found</p>
      <Button variant="outline" className="mt-4" onClick={() => navigate("/account/orders")}>Back to Orders</Button>
    </div>
  );

  const statusClass = STATUS_COLORS[order.status] ?? "bg-muted text-muted-foreground";

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-10 animate-fade-in space-y-6">
      <Button variant="ghost" size="sm" className="-ml-2 gap-2" onClick={() => navigate("/account/orders")}>
        <ArrowLeft className="h-4 w-4" /> My Orders
      </Button>

      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-xl font-black text-foreground font-mono">{order.order_number}</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Placed on {formatDate(order.created_at)}</p>
        </div>
        <span className={`text-sm font-bold px-3 py-1 rounded-full capitalize ${statusClass}`}>
          {order.status}
        </span>
      </div>

      {/* Items */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <Package className="h-4 w-4" /> Items Ordered
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {order.order_items.map((item) => (
            <div key={item.id} className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted">
                <Package className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground line-clamp-1">{item.product_name}</p>
                <p className="text-xs text-muted-foreground">SKU: {item.product_sku} · Qty: {item.quantity}</p>
              </div>
              <p className="text-sm font-bold text-foreground shrink-0">{formatCurrency(item.total_price)}</p>
            </div>
          ))}
          <Separator />
          <div className="space-y-1.5 text-sm">
            <div className="flex justify-between text-muted-foreground">
              <span>Subtotal</span><span>{formatCurrency(order.subtotal)}</span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>Shipping</span>
              <span className={order.shipping_cost === 0 ? "text-emerald-500" : ""}>
                {order.shipping_cost === 0 ? "Free" : formatCurrency(order.shipping_cost)}
              </span>
            </div>
            <Separator />
            <div className="flex justify-between font-black text-foreground text-base">
              <span>Total</span><span>{formatCurrency(order.total_amount)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Shipping */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <MapPin className="h-4 w-4" /> Delivery Address
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground space-y-1">
          <p className="font-semibold text-foreground">{order.shipping_address.full_name}</p>
          <p>{order.shipping_address.phone}</p>
          <p>{order.shipping_address.address_line1}</p>
          <p>{order.shipping_address.city}, {order.shipping_address.district}</p>
        </CardContent>
      </Card>

      {/* Payment + notes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <CreditCard className="h-4 w-4" /> Payment
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm">
            <p className="text-foreground font-medium">Cash on Delivery</p>
            <Badge className={`mt-2 capitalize text-xs ${order.payment_status === "paid" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>
              {order.payment_status}
            </Badge>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Truck className="h-4 w-4" /> Shipping Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <span className={`text-sm font-bold px-3 py-1 rounded-full capitalize ${statusClass}`}>
              {order.status}
            </span>
          </CardContent>
        </Card>
      </div>

      {order.notes && (
        <Card>
          <CardContent className="pt-4">
            <p className="text-xs text-muted-foreground font-semibold uppercase mb-1">Order Notes</p>
            <p className="text-sm text-foreground">{order.notes}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
