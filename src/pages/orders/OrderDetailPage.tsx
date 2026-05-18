import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Package, User, MapPin, CreditCard, Clock } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { OrderStatusBadge, PaymentStatusBadge } from "@/components/shared/StatusBadge";
import { LoadingScreen } from "@/components/shared/LoadingScreen";
import { orderService } from "@/services/orderService";
import { formatCurrency, formatDate } from "@/lib/utils";
import { useOrders } from "@/hooks/useOrders";
import type { Order, OrderStatus, Json } from "@/types/database";

type OrderWithRelations = Omit<Order, "order_items"> & {
  customers?: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    phone: string | null;
  } | null;
  order_items: Array<{
    id: string;
    order_id: string;
    product_id: string;
    quantity: number;
    unit_price: number;
    total_price: number;
    product_snapshot: Json;
    created_at: string;
    products?: { name: string; sku: string; images: string[] } | null;
  }>;
};

const ORDER_FLOW: OrderStatus[] = ["pending", "processing", "shipped", "delivered"];

function getAddressString(address: Json): string {
  if (!address || typeof address !== "object" || Array.isArray(address)) return "—";
  const a = address as Record<string, unknown>;
  return [a.address_line1, a.city, a.state, a.postal_code, a.country].filter(Boolean).join(", ");
}

export function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { updateOrderStatus } = useOrders();
  const [order, setOrder] = useState<OrderWithRelations | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (!id) return;
    orderService.getById(id).then((res) => {
      if (res.data) setOrder(res.data as unknown as OrderWithRelations);
      setIsLoading(false);
    });
  }, [id]);

  async function handleStatusChange(newStatus: OrderStatus) {
    if (!order || !id) return;
    setIsUpdating(true);
    const result = await orderService.updateStatus(id, newStatus);
    setIsUpdating(false);
    if (result.error) {
      toast.error("Update failed", { description: result.error });
    } else {
      setOrder((prev) => prev ? { ...prev, status: newStatus } : prev);
      updateOrderStatus(id, newStatus);
      toast.success("Order status updated");
    }
  }

  if (isLoading) return <LoadingScreen />;
  if (!order) return (
    <div className="flex flex-col items-center justify-center py-24 gap-4">
      <Package className="h-10 w-10 text-muted-foreground" />
      <p className="text-muted-foreground">Order not found</p>
      <Button variant="outline" onClick={() => navigate("/orders")}>Back to Orders</Button>
    </div>
  );

  const customer = order.customers;
  const currentFlowIndex = ORDER_FLOW.indexOf(order.status);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0" onClick={() => navigate("/orders")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-lg font-semibold font-mono">{order.order_number}</h1>
            <div className="flex items-center gap-2 mt-0.5">
              <OrderStatusBadge status={order.status} />
              <PaymentStatusBadge status={order.payment_status} />
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Select value={order.status} onValueChange={(v) => handleStatusChange(v as OrderStatus)} disabled={isUpdating}>
            <SelectTrigger className="h-9 w-40 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="processing">Processing</SelectItem>
              <SelectItem value="shipped">Shipped</SelectItem>
              <SelectItem value="delivered">Delivered</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
              <SelectItem value="refunded">Refunded</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {currentFlowIndex >= 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between gap-2">
              {ORDER_FLOW.map((step, i) => (
                <div key={step} className="flex-1 flex flex-col items-center gap-1">
                  <div className={`h-2 w-full rounded-full transition-colors ${i <= currentFlowIndex ? "bg-primary" : "bg-muted"}`} />
                  <span className={`text-[11px] capitalize font-medium ${i <= currentFlowIndex ? "text-primary" : "text-muted-foreground"}`}>
                    {step}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                <Package className="h-3.5 w-3.5" />Order Items
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-border">
                {order.order_items.map((item) => (
                  <div key={item.id} className="flex items-center gap-4 px-6 py-4">
                    <div className="h-12 w-12 rounded-lg bg-muted border overflow-hidden shrink-0">
                      {item.products?.images[0] ? (
                        <img src={item.products.images[0]} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Package className="h-5 w-5 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{item.products?.name ?? "Unknown Product"}</p>
                      <p className="font-mono text-[11px] text-muted-foreground">{item.products?.sku}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-sm font-semibold">{formatCurrency(item.total_price)}</p>
                      <p className="text-[11px] text-muted-foreground">{formatCurrency(item.unit_price)} × {item.quantity}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="px-6 py-4 bg-muted/30 space-y-2">
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Subtotal</span>
                  <span>{formatCurrency(order.subtotal)}</span>
                </div>
                {order.discount_amount > 0 && (
                  <div className="flex justify-between text-sm text-emerald-600">
                    <span>Discount</span>
                    <span>-{formatCurrency(order.discount_amount)}</span>
                  </div>
                )}
                {order.tax_amount > 0 && (
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Tax</span>
                    <span>{formatCurrency(order.tax_amount)}</span>
                  </div>
                )}
                {order.shipping_amount > 0 && (
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Shipping</span>
                    <span>{formatCurrency(order.shipping_amount)}</span>
                  </div>
                )}
                <Separator />
                <div className="flex justify-between text-base font-bold">
                  <span>Total</span>
                  <span>{formatCurrency(order.total)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {order.notes && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">{order.notes}</p>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-4">
          {customer && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                  <User className="h-3.5 w-3.5" />Customer
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <button className="font-medium hover:underline text-left"
                  onClick={() => navigate(`/customers/${customer.id}`)}>
                  {customer.first_name} {customer.last_name}
                </button>
                <p className="text-muted-foreground">{customer.email}</p>
                {customer.phone && <p className="text-muted-foreground">{customer.phone}</p>}
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5" />Shipping Address
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{getAddressString(order.shipping_address)}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                <CreditCard className="h-3.5 w-3.5" />Payment
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Status</span>
                <PaymentStatusBadge status={order.payment_status} />
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Total</span>
                <span className="font-semibold">{formatCurrency(order.total)}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5" />Timeline
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Placed</span>
                <span>{formatDate(order.created_at)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Updated</span>
                <span>{formatDate(order.updated_at)}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
