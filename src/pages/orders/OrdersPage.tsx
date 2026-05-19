import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search, ShoppingCart, ChevronLeft, ChevronRight, X,
} from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { OrderStatusBadge, PaymentStatusBadge } from "@/components/shared/StatusBadge";
import { TableRowSkeleton } from "@/components/shared/Skeleton";
import { useOrders } from "@/hooks/useOrders";
import { formatCurrency, formatDate, getInitials } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

type OrderWithCustomer = {
  id: string;
  order_number: string;
  status: import("@/types/database").OrderStatus;
  payment_status: import("@/types/database").PaymentStatus;
  total: number;
  created_at: string;
  customers?: { first_name: string; last_name: string; email: string } | null;
};

export function OrdersPage() {
  const navigate = useNavigate();
  const { orders, total, page, pageSize, filters, isLoading, setPage, setFilters } = useOrders();
  const [searchInput, setSearchInput] = useState(filters.search ?? "");
  const totalPages = Math.ceil(total / pageSize);

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFilters({ search: searchInput });
  }

  const hasActiveFilters =
    (filters.status && filters.status !== "all") ||
    (filters.payment_status && filters.payment_status !== "all") ||
    !!filters.search;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Orders"
        description={`${total} order${total !== 1 ? "s" : ""}`}
      />

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground pointer-events-none" />
          <Input
            placeholder="Search by order number..."
            className="pl-8 h-9 text-sm pr-8"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
          {searchInput && (
            <button type="button" onClick={() => { setSearchInput(""); setFilters({ search: "" }); }}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </form>

        <div className="flex items-center gap-2 flex-wrap">
          <Select value={filters.status ?? "all"} onValueChange={(v) => setFilters({ status: v as typeof filters.status })}>
            <SelectTrigger className="h-9 w-36 text-sm"><SelectValue placeholder="Status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="processing">Processing</SelectItem>
              <SelectItem value="shipped">Shipped</SelectItem>
              <SelectItem value="delivered">Delivered</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
              <SelectItem value="refunded">Refunded</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filters.payment_status ?? "all"} onValueChange={(v) => setFilters({ payment_status: v as typeof filters.payment_status })}>
            <SelectTrigger className="h-9 w-36 text-sm"><SelectValue placeholder="Payment" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Payments</SelectItem>
              <SelectItem value="pending">Unpaid</SelectItem>
              <SelectItem value="paid">Paid</SelectItem>
              <SelectItem value="failed">Failed</SelectItem>
              <SelectItem value="refunded">Refunded</SelectItem>
            </SelectContent>
          </Select>

          {hasActiveFilters && (
            <Button variant="ghost" size="sm" className="h-9 gap-1.5 text-muted-foreground"
              onClick={() => { setFilters({ status: "all", payment_status: "all", search: "" }); setSearchInput(""); }}>
              <X className="h-3.5 w-3.5" /> Clear
            </Button>
          )}
        </div>
      </div>

      <Card>
        <div className="rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead>Order</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 8 }).map((_, i) => <TableRowSkeleton key={i} cols={6} />)
              ) : orders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6}>
                    <div className="flex flex-col items-center justify-center py-16 gap-3">
                      <div className="rounded-xl bg-muted p-4"><ShoppingCart className="h-7 w-7 text-muted-foreground" /></div>
                      <div className="text-center">
                        <p className="text-sm font-medium">No orders found</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {hasActiveFilters ? "Try adjusting your filters" : "Orders will appear here once placed"}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                (orders as OrderWithCustomer[]).map((order) => {
                  const customer = order.customers;
                  const fullName = customer ? `${customer.first_name} ${customer.last_name}` : "Unknown";
                  return (
                    <TableRow key={order.id} className="cursor-pointer hover:bg-muted/40"
                      onClick={() => navigate(`/dashboard/orders/${order.id}`)}>
                      <TableCell>
                        <span className="font-mono text-sm font-medium text-primary">{order.order_number}</span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-7 w-7 shrink-0">
                            <AvatarFallback className="bg-primary/10 text-primary text-[10px] font-semibold">
                              {getInitials(fullName)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="min-w-0">
                            <p className="text-sm font-medium truncate">{fullName}</p>
                            {customer && <p className="text-[11px] text-muted-foreground truncate">{customer.email}</p>}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell><OrderStatusBadge status={order.status} /></TableCell>
                      <TableCell><PaymentStatusBadge status={order.payment_status} /></TableCell>
                      <TableCell className="text-sm text-muted-foreground">{formatDate(order.created_at)}</TableCell>
                      <TableCell className="text-right font-semibold">{formatCurrency(order.total)}</TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t">
            <p className="text-xs text-muted-foreground">
              Showing {(page - 1) * pageSize + 1}–{Math.min(page * pageSize, total)} of {total}
            </p>
            <div className="flex items-center gap-1">
              <Button variant="outline" size="icon" className="h-7 w-7" disabled={page <= 1} onClick={() => setPage(page - 1)}>
                <ChevronLeft className="h-3.5 w-3.5" />
              </Button>
              <span className="text-xs px-2">{page} / {totalPages}</span>
              <Button variant="outline" size="icon" className="h-7 w-7" disabled={page >= totalPages} onClick={() => setPage(page + 1)}>
                <ChevronRight className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
