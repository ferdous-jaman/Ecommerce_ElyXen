import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, ShoppingCart, Mail, Phone, MapPin, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { OrderStatusBadge } from "@/components/shared/StatusBadge";
import { LoadingScreen } from "@/components/shared/LoadingScreen";
import { customerService } from "@/services/customerService";
import { formatCurrency, formatDate, getInitials } from "@/lib/utils";
import type { Customer, Json, OrderStatus } from "@/types/database";

type CustomerWithOrders = Customer & {
  orders?: Array<{
    id: string;
    order_number: string;
    total: number;
    status: OrderStatus;
    created_at: string;
  }>;
};

function getAddressString(address: Json): string {
  if (!address || typeof address !== "object" || Array.isArray(address)) return "No address on file";
  const a = address as Record<string, unknown>;
  const parts = [a.address_line1, a.address_line2, a.city, a.state, a.postal_code, a.country];
  return parts.filter(Boolean).join(", ") || "No address on file";
}

export function CustomerDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState<CustomerWithOrders | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    customerService.getById(id).then((res) => {
      if (res.data) setCustomer(res.data as CustomerWithOrders);
      setIsLoading(false);
    });
  }, [id]);

  if (isLoading) return <LoadingScreen />;
  if (!customer) return (
    <div className="flex flex-col items-center justify-center py-24 gap-4">
      <Users className="h-10 w-10 text-muted-foreground" />
      <p className="text-muted-foreground">Customer not found</p>
      <Button variant="outline" onClick={() => navigate("/customers")}>Back to Customers</Button>
    </div>
  );

  const fullName = `${customer.first_name} ${customer.last_name}`;
  const orders = customer.orders ?? [];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0" onClick={() => navigate("/customers")}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-lg font-semibold">{fullName}</h1>
          <p className="text-sm text-muted-foreground">{customer.email}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                <ShoppingCart className="h-3.5 w-3.5" />Order History
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {orders.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 gap-3">
                  <ShoppingCart className="h-7 w-7 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">No orders yet</p>
                </div>
              ) : (
                <div className="divide-y divide-border">
                  {orders.map((order) => (
                    <div key={order.id}
                      className="flex items-center justify-between px-6 py-4 hover:bg-muted/40 cursor-pointer transition-colors"
                      onClick={() => navigate(`/orders/${order.id}`)}>
                      <div>
                        <p className="text-sm font-mono font-medium text-primary">{order.order_number}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{formatDate(order.created_at)}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <OrderStatusBadge status={order.status} />
                        <span className="text-sm font-semibold w-20 text-right">{formatCurrency(order.total)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {customer.notes && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">{customer.notes}</p>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center gap-3 pb-4 border-b">
                <Avatar className="h-16 w-16">
                  <AvatarFallback className="bg-primary/10 text-primary text-lg font-bold">
                    {getInitials(fullName)}
                  </AvatarFallback>
                </Avatar>
                <div className="text-center">
                  <p className="font-semibold">{fullName}</p>
                  <p className="text-xs text-muted-foreground">Customer since {formatDate(customer.created_at)}</p>
                </div>
              </div>
              <div className="pt-4 space-y-3 text-sm">
                <div className="flex items-start gap-2.5">
                  <Mail className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                  <span className="break-all">{customer.email}</span>
                </div>
                {customer.phone && (
                  <div className="flex items-center gap-2.5">
                    <Phone className="h-4 w-4 text-muted-foreground shrink-0" />
                    <span>{customer.phone}</span>
                  </div>
                )}
                <div className="flex items-start gap-2.5">
                  <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                  <span className="text-muted-foreground">{getAddressString(customer.address)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-2 gap-3">
            <Card>
              <CardContent className="pt-4 pb-4 text-center">
                <p className="text-2xl font-bold">{customer.total_orders}</p>
                <p className="text-xs text-muted-foreground mt-0.5">Total Orders</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4 pb-4 text-center">
                <p className="text-lg font-bold">{formatCurrency(customer.total_spent)}</p>
                <p className="text-xs text-muted-foreground mt-0.5">Total Spent</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
