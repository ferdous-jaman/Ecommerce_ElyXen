import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ShoppingCart, Users, DollarSign, TrendingUp, Package,
  ArrowUpRight, ArrowDownRight, Clock, AlertTriangle,
  Plus, ChevronRight,
} from "lucide-react";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { PageHeader } from "@/components/shared/PageHeader";
import { OrderStatusBadge } from "@/components/shared/StatusBadge";
import {
  revenueData, weeklyRevenue, orderStatusBreakdown,
  topProducts, customerGrowth, inventoryAlerts, recentOrders, activityFeed,
} from "@/lib/mockData";
import { formatCurrency, formatNumber, formatPercentage, getInitials, formatDate } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import type { ComponentType } from "react";
import { cn } from "@/lib/utils";

const activityIconMap: Record<string, { icon: ComponentType<{ className?: string }>; color: string; bg: string }> = {
  order:    { icon: ShoppingCart,  color: "text-indigo-500",         bg: "bg-indigo-500/10"  },
  customer: { icon: Users,         color: "text-violet-500",         bg: "bg-violet-500/10"  },
  payment:  { icon: DollarSign,    color: "text-emerald-500",        bg: "bg-emerald-500/10" },
  product:  { icon: Package,       color: "text-amber-500",          bg: "bg-amber-500/10"   },
  system:   { icon: Clock,         color: "text-muted-foreground",   bg: "bg-muted"          },
};

type RevenueTooltipProps = { active?: boolean; payload?: Array<{ value: number; name: string }>; label?: string };
function RevenueTooltip({ active, payload, label }: RevenueTooltipProps) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border bg-popover px-3 py-2 shadow-lg text-sm space-y-1">
      <p className="font-semibold text-foreground">{label}</p>
      {payload.map((p) => (
        <p key={p.name} className="text-muted-foreground">
          {p.name === "revenue" ? "Revenue" : "Orders"}:{" "}
          <span className="font-semibold text-foreground">
            {p.name === "revenue" ? formatCurrency(p.value) : formatNumber(p.value)}
          </span>
        </p>
      ))}
    </div>
  );
}

export function DashboardPage() {
  const navigate = useNavigate();
  const { profile, user } = useAuth();
  const [revenueTab, setRevenueTab] = useState<"monthly" | "weekly">("monthly");

  const now = new Date();
  const hour = now.getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  const displayName = profile?.full_name?.split(" ")[0] ?? user?.email?.split("@")[0] ?? "there";

  const stats = [
    {
      title: "Total Revenue",
      value: formatCurrency(104200),
      change: 18.2,
      sub: "vs last month",
      icon: DollarSign,
      color: "text-indigo-500",
      bg: "bg-indigo-500/10",
      href: "/analytics",
    },
    {
      title: "Total Orders",
      value: formatNumber(810),
      change: 12.5,
      sub: "vs last month",
      icon: ShoppingCart,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
      href: "/orders",
    },
    {
      title: "Active Customers",
      value: formatNumber(3842),
      change: 8.1,
      sub: "vs last month",
      icon: Users,
      color: "text-violet-500",
      bg: "bg-violet-500/10",
      href: "/customers",
    },
    {
      title: "Avg. Order Value",
      value: formatCurrency(128),
      change: -2.4,
      sub: "vs last month",
      icon: TrendingUp,
      color: "text-amber-500",
      bg: "bg-amber-500/10",
      href: "/analytics",
    },
  ];

  const chartData = revenueTab === "monthly" ? revenueData : weeklyRevenue;
  const xKey = revenueTab === "monthly" ? "month" : "day";
  const totalOrders = orderStatusBreakdown.reduce((s, i) => s + i.count, 0);

  return (
    <div className="space-y-6">
      <PageHeader
        title={`${greeting}, ${displayName} 👋`}
        description="Here's what's happening with your store today."
        actions={
          <Button size="sm" className="gap-1.5" onClick={() => navigate("/products/new")}>
            <Plus className="h-3.5 w-3.5" /> Add Product
          </Button>
        }
      />

      {/* KPI Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          const isPositive = stat.change >= 0;
          return (
            <Card
              key={stat.title}
              className="relative overflow-hidden cursor-pointer group hover:shadow-md transition-shadow"
              onClick={() => navigate(stat.href)}
            >
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div className="space-y-2.5">
                    <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{stat.title}</p>
                    <p className="text-2xl font-bold tracking-tight">{stat.value}</p>
                    <div className="flex items-center gap-1.5">
                      <span className={cn("flex items-center gap-0.5 text-xs font-semibold",
                        isPositive ? "text-emerald-600 dark:text-emerald-400" : "text-rose-500 dark:text-rose-400")}>
                        {isPositive ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                        {formatPercentage(Math.abs(stat.change))}
                      </span>
                      <span className="text-xs text-muted-foreground">{stat.sub}</span>
                    </div>
                  </div>
                  <div className={cn("rounded-xl p-2.5 transition-transform group-hover:scale-110", stat.bg)}>
                    <Icon className={cn("h-5 w-5", stat.color)} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Revenue Chart */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div>
                <CardTitle className="text-base">Revenue Overview</CardTitle>
                <CardDescription>Revenue and order volume trends</CardDescription>
              </div>
              <Tabs value={revenueTab} onValueChange={(v) => setRevenueTab(v as "monthly" | "weekly")}>
                <TabsList className="h-7">
                  <TabsTrigger value="monthly" className="text-xs h-6 px-2.5">Monthly</TabsTrigger>
                  <TabsTrigger value="weekly" className="text-xs h-6 px-2.5">Weekly</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </CardHeader>
          <CardContent className="pb-4 pl-1">
            <ResponsiveContainer width="100%" height={230}>
              <AreaChart data={chartData} margin={{ top: 5, right: 16, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.18} />
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis dataKey={xKey} axisLine={false} tickLine={false}
                  tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
                <YAxis axisLine={false} tickLine={false} width={46}
                  tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                  tickFormatter={(v: number) => `$${(v / 1000).toFixed(0)}k`} />
                <Tooltip content={<RevenueTooltip />} />
                <Area type="monotone" dataKey="revenue" name="revenue"
                  stroke="hsl(var(--primary))" strokeWidth={2} fill="url(#revGrad)" dot={false}
                  activeDot={{ r: 4, fill: "hsl(var(--primary))", stroke: "hsl(var(--background))", strokeWidth: 2 }} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Order Status Breakdown */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Order Status</CardTitle>
            <CardDescription>{formatNumber(totalOrders)} orders this month</CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex justify-center">
              <ResponsiveContainer width="100%" height={160}>
                <PieChart>
                  <Pie data={orderStatusBreakdown} cx="50%" cy="50%" innerRadius={45} outerRadius={70}
                    dataKey="count" paddingAngle={2}>
                    {orderStatusBreakdown.map((entry) => (
                      <Cell key={entry.status} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v: number) => [formatNumber(v), "Orders"]} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-2 space-y-2">
              {orderStatusBreakdown.map((item) => (
                <div key={item.status} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                    <span className="text-muted-foreground">{item.status}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{item.count}</span>
                    <span className="text-muted-foreground w-8 text-right">
                      {((item.count / totalOrders) * 100).toFixed(0)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Customer Growth + Top Products */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Customer Growth</CardTitle>
            <CardDescription>New vs returning — last 6 months</CardDescription>
          </CardHeader>
          <CardContent className="pb-2 pl-1">
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={customerGrowth} margin={{ top: 0, right: 8, left: 0, bottom: 0 }} barGap={2}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis dataKey="month" axisLine={false} tickLine={false}
                  tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
                <YAxis axisLine={false} tickLine={false} width={28}
                  tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
                <Tooltip />
                <Bar dataKey="new" name="New" fill="hsl(var(--primary))" radius={[3, 3, 0, 0]} maxBarSize={16} />
                <Bar dataKey="returning" name="Returning" fill="hsl(var(--primary)/0.25)" radius={[3, 3, 0, 0]} maxBarSize={16} />
                <Legend iconType="circle" iconSize={6} wrapperStyle={{ fontSize: 11 }} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base">Top Products</CardTitle>
                <CardDescription>Best performing by revenue</CardDescription>
              </div>
              <Button variant="ghost" size="sm" className="h-7 text-xs gap-1 text-muted-foreground"
                onClick={() => navigate("/products")}>
                View all <ChevronRight className="h-3.5 w-3.5" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {topProducts.map((p, i) => {
              const maxRev = topProducts[0].revenue;
              const pct = (p.revenue / maxRev) * 100;
              const isPositive = p.trend >= 0;
              return (
                <div key={p.sku}>
                  <div className="flex items-center gap-3 mb-1.5">
                    <span className="text-xs font-mono text-muted-foreground w-4 shrink-0">{i + 1}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-sm font-medium truncate">{p.name}</span>
                        <div className="flex items-center gap-2 shrink-0">
                          <span className={cn("text-xs font-medium flex items-center gap-0.5",
                            isPositive ? "text-emerald-600" : "text-rose-500")}>
                            {isPositive ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                            {Math.abs(p.trend)}%
                          </span>
                          <span className="text-sm font-semibold">{formatCurrency(p.revenue)}</span>
                        </div>
                      </div>
                      <Progress value={pct} className="h-1.5 mt-1" />
                    </div>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders + Low Stock + Activity */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base">Recent Orders</CardTitle>
                <CardDescription>Latest orders from your store</CardDescription>
              </div>
              <Button variant="ghost" size="sm" className="h-7 text-xs gap-1 text-muted-foreground"
                onClick={() => navigate("/orders")}>
                View all <ChevronRight className="h-3.5 w-3.5" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-border">
              {recentOrders.map((order) => (
                <div key={order.id}
                  className="flex items-center gap-3 px-6 py-3 hover:bg-muted/40 transition-colors cursor-pointer"
                  onClick={() => navigate("/orders")}>
                  <Avatar className="h-8 w-8 shrink-0">
                    <AvatarFallback className="bg-primary/10 text-primary text-[10px] font-semibold">
                      {getInitials(order.customer.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium truncate">{order.customer.name}</span>
                      <span className="text-xs font-mono text-muted-foreground shrink-0">{order.orderNumber}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {order.items} item{order.items !== 1 ? "s" : ""} · {formatDate(order.createdAt, { month: "short", day: "numeric" })}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <OrderStatusBadge status={order.status} />
                    <span className="text-sm font-semibold">{formatCurrency(order.total)}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          {/* Low Stock Alerts */}
          <Card className="border-amber-200 dark:border-amber-800">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-amber-500" />
                Low Stock Alerts
              </CardTitle>
              <CardDescription>{inventoryAlerts.length} products need restocking</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {inventoryAlerts.map((item) => (
                <div key={item.sku} className="flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-xs font-medium truncate">{item.name}</p>
                    <p className="text-[10px] text-muted-foreground font-mono">{item.sku}</p>
                  </div>
                  <Badge variant="outline" className="text-[10px] border-amber-300 text-amber-700 bg-amber-50 dark:bg-amber-900/20 shrink-0">
                    {item.stock} left
                  </Badge>
                </div>
              ))}
              <Button variant="outline" size="sm" className="w-full h-7 text-xs mt-1"
                onClick={() => navigate("/inventory")}>
                View Inventory
              </Button>
            </CardContent>
          </Card>

          {/* Activity Feed */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Activity</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="px-6">
                {activityFeed.slice(0, 4).map((event, index) => {
                  const config = activityIconMap[event.type] ?? activityIconMap.system;
                  const Icon = config.icon;
                  return (
                    <div key={event.id}>
                      <div className="flex gap-3 py-2.5">
                        <div className={cn("mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg", config.bg)}>
                          <Icon className={cn("h-3 w-3", config.color)} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium leading-tight">{event.title}</p>
                          <p className="mt-0.5 text-[11px] text-muted-foreground leading-snug truncate">{event.description}</p>
                          <p className="mt-0.5 text-[10px] text-muted-foreground/60">{event.timestamp}</p>
                        </div>
                      </div>
                      {index < 3 && <Separator className="bg-border/50" />}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
