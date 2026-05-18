import { Plus, Search, Filter } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { recentOrders } from "@/lib/mockData";
import { formatCurrency, formatDate, getInitials } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

type MockOrderStatus = "pending" | "processing" | "shipped" | "delivered" | "cancelled" | "refunded";

const statusConfig: Record<MockOrderStatus, { label: string; variant: "success" | "warning" | "info" | "destructive" | "secondary" | "outline" }> = {
  pending: { label: "Pending", variant: "warning" },
  processing: { label: "Processing", variant: "info" },
  shipped: { label: "Shipped", variant: "secondary" },
  delivered: { label: "Delivered", variant: "success" },
  cancelled: { label: "Cancelled", variant: "destructive" },
  refunded: { label: "Refunded", variant: "outline" },
};

export function OrdersPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Orders"
        description="Track and manage customer orders."
        actions={
          <Button size="sm" className="gap-1.5">
            <Plus className="h-3.5 w-3.5" />
            New Order
          </Button>
        }
      />
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search orders..." className="pl-8 h-8 text-sm" />
        </div>
        <Button variant="outline" size="sm" className="gap-1.5 h-8">
          <Filter className="h-3.5 w-3.5" />
          Filter
        </Button>
      </div>
      <Card>
        <div className="divide-y divide-border">
          {recentOrders.map((order) => {
            const status = statusConfig[order.status];
            return (
              <div
                key={order.id}
                className="flex items-center gap-4 px-6 py-4 hover:bg-muted/40 transition-colors cursor-pointer"
              >
                <Avatar className="h-9 w-9 shrink-0">
                  <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                    {getInitials(order.customer.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{order.customer.name}</span>
                    <span className="text-xs text-muted-foreground">{order.orderNumber}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {order.items} item{order.items !== 1 ? "s" : ""} · {formatDate(order.createdAt)}
                  </p>
                </div>
                <div className="flex items-center gap-4 shrink-0">
                  <Badge variant={status.variant} className="text-[10px]">
                    {status.label}
                  </Badge>
                  <span className="text-sm font-semibold w-20 text-right">
                    {formatCurrency(order.total)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
