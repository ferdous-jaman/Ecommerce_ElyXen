import {
  ShoppingCart,
  Users,
  DollarSign,
  TrendingUp,
  Package,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  ShoppingBag,
  UserPlus,
  BarChart2,
  Plus,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { PageHeader } from "@/components/shared/PageHeader";
import { revenueData, recentOrders, activityFeed } from "@/lib/mockData";
import { formatCurrency, formatNumber, formatPercentage, getInitials, formatDate } from "@/lib/utils";
import type { ComponentType } from "react";
import { cn } from "@/lib/utils";

type MockOrderStatus = "pending" | "processing" | "shipped" | "delivered" | "cancelled" | "refunded";

const stats = [
  {
    title: "Total Revenue",
    value: formatCurrency(104200),
    change: 18.2,
    sub: "vs last month",
    icon: DollarSign,
    color: "text-indigo-500",
    bg: "bg-indigo-500/10",
  },
  {
    title: "Total Orders",
    value: formatNumber(810),
    change: 12.5,
    sub: "vs last month",
    icon: ShoppingCart,
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
  },
  {
    title: "Active Customers",
    value: formatNumber(3842),
    change: 8.1,
    sub: "vs last month",
    icon: Users,
    color: "text-violet-500",
    bg: "bg-violet-500/10",
  },
  {
    title: "Avg. Order Value",
    value: formatCurrency(128),
    change: -2.4,
    sub: "vs last month",
    icon: TrendingUp,
    color: "text-amber-500",
    bg: "bg-amber-500/10",
  },
];

const quickActions = [
  {
    label: "New Order",
    icon: ShoppingBag,
    color: "text-indigo-500",
    bg: "bg-indigo-500/10 hover:bg-indigo-500/20",
  },
  {
    label: "Add Product",
    icon: Package,
    color: "text-emerald-500",
    bg: "bg-emerald-500/10 hover:bg-emerald-500/20",
  },
  {
    label: "Add Customer",
    icon: UserPlus,
    color: "text-violet-500",
    bg: "bg-violet-500/10 hover:bg-violet-500/20",
  },
  {
    label: "View Reports",
    icon: BarChart2,
    color: "text-amber-500",
    bg: "bg-amber-500/10 hover:bg-amber-500/20",
  },
];

const orderStatusConfig: Record<
  MockOrderStatus,
  { label: string; variant: "success" | "warning" | "info" | "destructive" | "secondary" | "outline" }
> = {
  pending: { label: "Pending", variant: "warning" },
  processing: { label: "Processing", variant: "info" },
  shipped: { label: "Shipped", variant: "secondary" },
  delivered: { label: "Delivered", variant: "success" },
  cancelled: { label: "Cancelled", variant: "destructive" },
  refunded: { label: "Refunded", variant: "outline" },
};

const activityIconMap: Record<string, { icon: ComponentType<{ className?: string }>; color: string; bg: string }> = {
  order: { icon: ShoppingCart, color: "text-indigo-500", bg: "bg-indigo-500/10" },
  customer: { icon: Users, color: "text-violet-500", bg: "bg-violet-500/10" },
  payment: { icon: DollarSign, color: "text-emerald-500", bg: "bg-emerald-500/10" },
  product: { icon: Package, color: "text-amber-500", bg: "bg-amber-500/10" },
  system: { icon: Clock, color: "text-muted-foreground", bg: "bg-muted" },
};

type CustomTooltipProps = {
  active?: boolean;
  payload?: Array<{ value: number }>;
  label?: string;
};

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border bg-popover px-3 py-2 shadow-md text-sm">
        <p className="font-medium text-foreground">{label}</p>
        <p className="text-muted-foreground">
          Revenue:{" "}
          <span className="font-semibold text-foreground">
            {formatCurrency(payload[0].value)}
          </span>
        </p>
      </div>
    );
  }
  return null;
}

export function DashboardPage() {
  const now = new Date();
  const hour = now.getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <div className="space-y-6">
      <PageHeader
        title={`${greeting}, Alex`}
        description="Here's what's happening with your store today."
        actions={
          <Button size="sm" className="gap-1.5">
            <Plus className="h-3.5 w-3.5" />
            New Order
          </Button>
        }
      />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          const isPositive = stat.change >= 0;
          return (
            <Card key={stat.title} className="relative overflow-hidden">
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div className="space-y-2.5">
                    <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      {stat.title}
                    </p>
                    <p className="text-2xl font-bold tracking-tight text-foreground">
                      {stat.value}
                    </p>
                    <div className="flex items-center gap-1.5">
                      <span
                        className={cn(
                          "flex items-center gap-0.5 text-xs font-medium",
                          isPositive ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"
                        )}
                      >
                        {isPositive ? (
                          <ArrowUpRight className="h-3 w-3" />
                        ) : (
                          <ArrowDownRight className="h-3 w-3" />
                        )}
                        {formatPercentage(Math.abs(stat.change))}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {stat.sub}
                      </span>
                    </div>
                  </div>
                  <div className={cn("rounded-xl p-2.5", stat.bg)}>
                    <Icon className={cn("h-5 w-5", stat.color)} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Revenue Chart + Quick Actions */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-base">Revenue Overview</CardTitle>
                <CardDescription className="mt-0.5">
                  Monthly revenue for this year
                </CardDescription>
              </div>
              <Badge variant="success" className="text-xs">
                +18.2% YoY
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pb-4 pl-2">
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={revenueData} margin={{ top: 5, right: 20, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                  tickFormatter={(v: number) => `$${(v / 1000).toFixed(0)}k`}
                  width={45}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  fill="url(#revenueGradient)"
                  dot={false}
                  activeDot={{ r: 5, fill: "hsl(var(--primary))", stroke: "hsl(var(--background))", strokeWidth: 2 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Quick Actions</CardTitle>
            <CardDescription>Common tasks at a glance</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-3">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <button
                  key={action.label}
                  className={cn(
                    "flex flex-col items-center justify-center gap-2.5 rounded-xl p-4 text-center transition-colors cursor-pointer border border-transparent hover:border-border",
                    action.bg
                  )}
                >
                  <div className={cn("rounded-lg p-2", action.bg.split(" ")[0])}>
                    <Icon className={cn("h-5 w-5", action.color)} />
                  </div>
                  <span className="text-xs font-medium text-foreground">
                    {action.label}
                  </span>
                </button>
              );
            })}
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders + Activity Feed */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base">Recent Orders</CardTitle>
                <CardDescription>Latest 6 orders from your store</CardDescription>
              </div>
              <Button variant="ghost" size="sm" className="text-xs text-muted-foreground h-7">
                View all
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-border">
              {recentOrders.map((order) => {
                const status = orderStatusConfig[order.status];
                return (
                  <div
                    key={order.id}
                    className="flex items-center gap-3 px-6 py-3 hover:bg-muted/40 transition-colors"
                  >
                    <Avatar className="h-8 w-8 shrink-0">
                      <AvatarFallback className="bg-primary/10 text-primary text-[10px] font-semibold">
                        {getInitials(order.customer.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium truncate">
                          {order.customer.name}
                        </span>
                        <span className="text-xs text-muted-foreground shrink-0">
                          {order.orderNumber}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {order.items} item{order.items !== 1 ? "s" : ""} •{" "}
                        {formatDate(order.createdAt, { month: "short", day: "numeric" })}
                      </p>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <Badge variant={status.variant} className="text-[10px]">
                        {status.label}
                      </Badge>
                      <span className="text-sm font-semibold">
                        {formatCurrency(order.total)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Activity Feed</CardTitle>
            <CardDescription>Recent system events</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="px-6">
              {activityFeed.map((event, index) => {
                const config = activityIconMap[event.type] ?? activityIconMap.system;
                const Icon = config.icon;
                return (
                  <div key={event.id}>
                    <div className="flex gap-3 py-3">
                      <div className={cn("mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg", config.bg)}>
                        <Icon className={cn("h-3.5 w-3.5", config.color)} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium leading-tight">
                          {event.title}
                        </p>
                        <p className="mt-0.5 text-xs text-muted-foreground leading-snug truncate">
                          {event.description}
                        </p>
                        <p className="mt-1 text-[10px] text-muted-foreground/70 flex items-center gap-1">
                          <Clock className="h-2.5 w-2.5" />
                          {event.timestamp}
                        </p>
                      </div>
                    </div>
                    {index < activityFeed.length - 1 && (
                      <Separator className="bg-border/50" />
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
