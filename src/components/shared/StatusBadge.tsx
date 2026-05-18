import { Badge } from "@/components/ui/badge";
import type { OrderStatus, PaymentStatus, ProductStatus } from "@/types/database";
import { cn } from "@/lib/utils";

const orderStatusMap: Record<OrderStatus, { label: string; className: string }> = {
  pending:    { label: "Pending",    className: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200 dark:border-amber-800" },
  processing: { label: "Processing", className: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800" },
  shipped:    { label: "Shipped",    className: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400 border-purple-200 dark:border-purple-800" },
  delivered:  { label: "Delivered",  className: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800" },
  cancelled:  { label: "Cancelled",  className: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800" },
  refunded:   { label: "Refunded",   className: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400 border-slate-200 dark:border-slate-700" },
};

const paymentStatusMap: Record<PaymentStatus, { label: string; className: string }> = {
  pending:  { label: "Unpaid",   className: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200" },
  paid:     { label: "Paid",     className: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200" },
  failed:   { label: "Failed",   className: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border-red-200" },
  refunded: { label: "Refunded", className: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400 border-slate-200" },
};

const productStatusMap: Record<ProductStatus, { label: string; className: string }> = {
  active:   { label: "Active",   className: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200" },
  draft:    { label: "Draft",    className: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200" },
  archived: { label: "Archived", className: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400 border-slate-200" },
};

type OrderStatusBadgeProps = { status: OrderStatus; className?: string };
type PaymentStatusBadgeProps = { status: PaymentStatus; className?: string };
type ProductStatusBadgeProps = { status: ProductStatus; className?: string };

export function OrderStatusBadge({ status, className }: OrderStatusBadgeProps) {
  const config = orderStatusMap[status];
  return (
    <Badge variant="outline" className={cn("text-[11px] font-medium px-2 py-0.5 border", config.className, className)}>
      {config.label}
    </Badge>
  );
}

export function PaymentStatusBadge({ status, className }: PaymentStatusBadgeProps) {
  const config = paymentStatusMap[status];
  return (
    <Badge variant="outline" className={cn("text-[11px] font-medium px-2 py-0.5 border", config.className, className)}>
      {config.label}
    </Badge>
  );
}

export function ProductStatusBadge({ status, className }: ProductStatusBadgeProps) {
  const config = productStatusMap[status];
  return (
    <Badge variant="outline" className={cn("text-[11px] font-medium px-2 py-0.5 border", config.className, className)}>
      {config.label}
    </Badge>
  );
}
