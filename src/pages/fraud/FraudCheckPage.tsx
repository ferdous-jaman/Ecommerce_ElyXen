import { useState } from "react";
import {
  AlertTriangle, CheckCircle2, Copy, RefreshCw, Search,
  ShieldAlert, ShieldCheck, ShieldX, User, Phone, MapPin,
  Package, Clock, TrendingUp, XCircle, Eye,
} from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { recentOrders, mockCustomers } from "@/lib/mockData";
import { formatCurrency, formatDate } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/hooks/useTranslation";

type RiskLevel = "low" | "medium" | "high" | "critical";

const RISK_COLOR: Record<RiskLevel, string> = {
  low:      "text-emerald-600 bg-emerald-50 border-emerald-200",
  medium:   "text-amber-600 bg-amber-50 border-amber-200",
  high:     "text-orange-600 bg-orange-50 border-orange-200",
  critical: "text-red-600 bg-red-50 border-red-200",
};

const RISK_BAR: Record<RiskLevel, string> = {
  low:      "bg-emerald-500",
  medium:   "bg-amber-500",
  high:     "bg-orange-500",
  critical: "bg-red-500",
};

const RISK_SCORE: Record<RiskLevel, number> = {
  low: 12, medium: 42, high: 71, critical: 91,
};

type FlagType = {
  id: string;
  type: "duplicate" | "address" | "velocity" | "device" | "payment" | "behavior";
  level: RiskLevel;
  title: string;
  detail: string;
  orderId?: string;
  timestamp: string;
};

const MOCK_FLAGS: FlagType[] = [
  {
    id: "f1",
    type: "duplicate",
    level: "critical",
    title: "Duplicate Order Detected",
    detail: "Order #ORD-2024-002 and #ORD-2024-006 have identical items, amount and shipping address placed within 12 minutes.",
    orderId: "ORD-2024-002",
    timestamp: "2025-05-19T10:22:00Z",
  },
  {
    id: "f2",
    type: "velocity",
    level: "high",
    title: "High Order Velocity",
    detail: "Customer 'Nusrat Jahan' placed 4 orders in under 30 minutes from the same device.",
    orderId: "ORD-2024-003",
    timestamp: "2025-05-19T09:58:00Z",
  },
  {
    id: "f3",
    type: "address",
    level: "medium",
    title: "Suspicious Address Pattern",
    detail: "Shipping address changed 3 times on the same order before confirmation.",
    orderId: "ORD-2024-005",
    timestamp: "2025-05-18T15:40:00Z",
  },
  {
    id: "f4",
    type: "payment",
    level: "high",
    title: "Multiple Failed COD Attempts",
    detail: "Customer refused delivery twice for high-value orders (৳12,000+) in the past 7 days.",
    orderId: "ORD-2024-008",
    timestamp: "2025-05-17T11:20:00Z",
  },
  {
    id: "f5",
    type: "behavior",
    level: "medium",
    title: "Unusual Browsing Pattern",
    detail: "Guest session added 15 items to cart but only proceeded to checkout after 2 hours of inactivity.",
    timestamp: "2025-05-16T20:05:00Z",
  },
  {
    id: "f6",
    type: "duplicate",
    level: "high",
    title: "Duplicate Customer Profile",
    detail: "Email 'rafiqul.islam@gmail.com' and 'rafiqul_islam@gmail.com' share the same phone number and delivery address.",
    timestamp: "2025-05-15T08:33:00Z",
  },
];

const TYPE_ICON: Record<FlagType["type"], React.ElementType> = {
  duplicate: Copy,
  address:   MapPin,
  velocity:  TrendingUp,
  device:    Eye,
  payment:   XCircle,
  behavior:  AlertTriangle,
};

const STATS = [
  { label: "Total Flags",       value: "6",   sub: "+2 today",   icon: ShieldAlert,  color: "text-rose-500",   bg: "bg-rose-500/10" },
  { label: "Duplicate Orders",  value: "2",   sub: "Last 7 days", icon: Copy,         color: "text-orange-500", bg: "bg-orange-500/10" },
  { label: "High Risk",         value: "3",   sub: "Needs review",icon: ShieldX,      color: "text-amber-500",  bg: "bg-amber-500/10" },
  { label: "Resolved Today",    value: "4",   sub: "Cleared",     icon: ShieldCheck,  color: "text-emerald-500",bg: "bg-emerald-500/10" },
];

function getRiskLevel(score: number): RiskLevel {
  if (score >= 80) return "critical";
  if (score >= 55) return "high";
  if (score >= 30) return "medium";
  return "low";
}

export function FraudCheckPage() {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("flags");
  const [dismissedFlags, setDismissedFlags] = useState<Set<string>>(new Set());
  const [checkInput, setCheckInput] = useState("");
  const [checkedOrder, setCheckedOrder] = useState<typeof recentOrders[0] | null>(null);
  const [isChecking, setIsChecking] = useState(false);

  const activeFlags = MOCK_FLAGS.filter(
    (f) => !dismissedFlags.has(f.id) &&
      (searchTerm === "" ||
        f.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        f.detail.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (f.orderId ?? "").toLowerCase().includes(searchTerm.toLowerCase()))
  );

  function handleDismiss(id: string) {
    setDismissedFlags((prev) => new Set([...prev, id]));
    toast.success("Flag dismissed", { description: "Marked as reviewed." });
  }

  function handleCheckOrder() {
    if (!checkInput.trim()) return;
    setIsChecking(true);
    setTimeout(() => {
      const found = recentOrders.find(
        (o) =>
          o.orderNumber.toLowerCase().includes(checkInput.toLowerCase()) ||
          o.customer.name.toLowerCase().includes(checkInput.toLowerCase())
      );
      setCheckedOrder(found ?? null);
      setIsChecking(false);
      if (!found) toast.error("No match found", { description: "Try an order number or customer name from mock data." });
    }, 800);
  }

  // Build duplicate order pairs from mock data
  const duplicatePairs: Array<{ a: typeof recentOrders[0]; b: typeof recentOrders[0]; reason: string }> = [];
  for (let i = 0; i < recentOrders.length; i++) {
    for (let j = i + 1; j < recentOrders.length; j++) {
      const a = recentOrders[i];
      const b = recentOrders[j];
      if (a.customer.email === b.customer.email && a.total === b.total) {
        duplicatePairs.push({ a, b, reason: "Same customer email + identical total amount" });
      } else if (a.customer.name === b.customer.name && a.items === b.items) {
        duplicatePairs.push({ a, b, reason: "Same customer + same item count" });
      }
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={t("fraud.title")}
        description="Detect duplicate orders, suspicious patterns, and high-risk transactions."
        actions={
          <Button size="sm" variant="outline" className="gap-1.5"
            onClick={() => { setDismissedFlags(new Set()); toast.success("Flags refreshed"); }}>
            <RefreshCw className="h-3.5 w-3.5" /> {t("common.refresh")}
          </Button>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {STATS.map(({ label, value, sub, icon: Icon, color, bg }) => (
          <Card key={label}>
            <CardContent className="p-4 flex items-center gap-3">
              <div className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-xl", bg)}>
                <Icon className={cn("h-5 w-5", color)} />
              </div>
              <div>
                <p className="text-2xl font-black text-foreground leading-none">{value}</p>
                <p className="text-xs font-semibold text-foreground mt-0.5">{label}</p>
                <p className="text-[11px] text-muted-foreground">{sub}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="h-9 gap-0.5">
          <TabsTrigger value="flags" className="gap-1.5 text-xs">
            <ShieldAlert className="h-3.5 w-3.5" /> {t("fraud.flagged")}
            {activeFlags.length > 0 && (
              <span className="ml-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive text-[9px] font-bold text-white px-1">
                {activeFlags.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="duplicates" className="gap-1.5 text-xs">
            <Copy className="h-3.5 w-3.5" /> {t("fraud.duplicateOrders")}
          </TabsTrigger>
          <TabsTrigger value="check" className="gap-1.5 text-xs">
            <Search className="h-3.5 w-3.5" /> {t("fraud.manualCheck")}
          </TabsTrigger>
          <TabsTrigger value="customers" className="gap-1.5 text-xs">
            <User className="h-3.5 w-3.5" /> {t("fraud.customerRisk")}
          </TabsTrigger>
        </TabsList>

        {/* ── Fraud Flags Tab ── */}
        <TabsContent value="flags" className="space-y-3 mt-0">
          <div className="flex items-center gap-3">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                placeholder="Search flags..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 h-9 text-sm"
              />
            </div>
          </div>

          {activeFlags.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-14 gap-3">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50">
                  <ShieldCheck className="h-7 w-7 text-emerald-500" />
                </div>
                <p className="text-sm font-semibold">All clear!</p>
                <p className="text-xs text-muted-foreground">No active fraud flags detected.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {activeFlags.map((flag) => {
                const Icon = TYPE_ICON[flag.type];
                return (
                  <Card key={flag.id} className={cn("border-l-4", {
                    "border-l-red-500":    flag.level === "critical",
                    "border-l-orange-500": flag.level === "high",
                    "border-l-amber-500":  flag.level === "medium",
                    "border-l-emerald-500":flag.level === "low",
                  })}>
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border", RISK_COLOR[flag.level])}>
                          <Icon className="h-4 w-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className="text-sm font-semibold text-foreground">{flag.title}</p>
                            <Badge variant="outline" className={cn("text-[10px] capitalize", RISK_COLOR[flag.level])}>
                              {flag.level}
                            </Badge>
                            <Badge variant="outline" className="text-[10px] capitalize">
                              {flag.type}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{flag.detail}</p>
                          <div className="flex items-center gap-4 mt-2">
                            {flag.orderId && (
                              <span className="text-[11px] font-mono text-primary">{flag.orderId}</span>
                            )}
                            <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
                              <Clock className="h-3 w-3" />{formatDate(flag.timestamp)}
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-2 shrink-0">
                          <Button size="sm" variant="outline" className="h-7 text-xs gap-1"
                            onClick={() => handleDismiss(flag.id)}>
                            <CheckCircle2 className="h-3.5 w-3.5" /> Dismiss
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>

        {/* ── Duplicate Orders Tab ── */}
        <TabsContent value="duplicates" className="space-y-3 mt-0">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Copy className="h-4 w-4 text-primary" /> Auto-Detected Duplicate Pairs
              </CardTitle>
              <CardDescription>Orders sharing the same customer email, amount, or item count.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {duplicatePairs.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 gap-2">
                  <ShieldCheck className="h-8 w-8 text-emerald-500" />
                  <p className="text-sm text-muted-foreground">No duplicate order pairs found in current data.</p>
                </div>
              ) : (
                duplicatePairs.map(({ a, b, reason }, i) => (
                  <div key={i} className="rounded-xl border border-orange-200 bg-orange-50/50 dark:bg-orange-900/10 p-4 space-y-3">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-orange-500 shrink-0" />
                      <p className="text-xs font-semibold text-orange-700 dark:text-orange-400">{reason}</p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {[a, b].map((order) => (
                        <div key={order.id} className="rounded-lg border border-border bg-background p-3 space-y-1.5">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-mono font-semibold text-primary">{order.orderNumber}</span>
                            <Badge variant="outline" className="text-[10px] capitalize">{order.status}</Badge>
                          </div>
                          <p className="text-xs font-medium text-foreground">{order.customer.name}</p>
                          <p className="text-[11px] text-muted-foreground">{order.customer.email}</p>
                          <p className="text-xs font-semibold text-foreground">{formatCurrency(order.total)}</p>
                          <p className="text-[11px] text-muted-foreground">{formatDate(order.createdAt)}</p>
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="destructive" className="h-7 text-xs gap-1"
                        onClick={() => toast.success("Order cancelled", { description: `${b.orderNumber} marked as duplicate.` })}>
                        <XCircle className="h-3.5 w-3.5" /> Cancel Duplicate
                      </Button>
                      <Button size="sm" variant="outline" className="h-7 text-xs"
                        onClick={() => toast.info("Flagged for review")}>
                        Flag for Review
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          {/* All orders list for manual comparison */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">All Orders — Quick Scan</CardTitle>
              <CardDescription>Scan for unusual patterns across recent orders.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {recentOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between rounded-lg border border-border bg-muted/20 px-4 py-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                        {order.customer.name.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-foreground truncate">{order.customer.name}</p>
                        <p className="text-[11px] text-muted-foreground font-mono">{order.orderNumber}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <span className="text-xs font-semibold text-foreground">{formatCurrency(order.total)}</span>
                      <Badge variant="outline" className="text-[10px] capitalize">{order.status}</Badge>
                      <Button size="sm" variant="ghost" className="h-7 text-xs"
                        onClick={() => toast.info(`Checking ${order.orderNumber}...`)}>
                        <Search className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── Manual Check Tab ── */}
        <TabsContent value="check" className="space-y-4 mt-0">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Search className="h-4 w-4 text-primary" /> Manual Order / Customer Check
              </CardTitle>
              <CardDescription>Enter an order number or customer name to run a fraud risk analysis.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="e.g. ORD-2024-003 or Nusrat Jahan"
                  value={checkInput}
                  onChange={(e) => setCheckInput(e.target.value)}
                  className="h-9 text-sm"
                  onKeyDown={(e) => { if (e.key === "Enter") handleCheckOrder(); }}
                />
                <Button size="sm" className="h-9 gap-1.5" onClick={handleCheckOrder} disabled={isChecking}>
                  {isChecking ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : <Search className="h-3.5 w-3.5" />}
                  Check
                </Button>
              </div>

              {checkedOrder && (() => {
                // Compute a pseudo risk score
                const score =
                  (checkedOrder.status === "cancelled" ? 30 : 0) +
                  (checkedOrder.total > 5000 ? 20 : 0) +
                  (checkedOrder.items > 5 ? 15 : 0) +
                  Math.floor(Math.random() * 20);
                const risk = getRiskLevel(score);
                return (
                  <div className="rounded-xl border border-border bg-muted/20 p-4 space-y-4 animate-fade-in">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-bold text-foreground">{checkedOrder.customer.name}</p>
                        <p className="text-xs text-muted-foreground font-mono">{checkedOrder.orderNumber}</p>
                      </div>
                      <Badge variant="outline" className={cn("text-xs capitalize", RISK_COLOR[risk])}>
                        {risk} risk
                      </Badge>
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <p className="text-xs font-semibold text-foreground">Risk Score</p>
                        <p className="text-xs font-bold" style={{ color: risk === "low" ? "#10b981" : risk === "medium" ? "#f59e0b" : risk === "high" ? "#f97316" : "#ef4444" }}>
                          {score}/100
                        </p>
                      </div>
                      <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                        <div className={cn("h-full rounded-full transition-all", RISK_BAR[risk])} style={{ width: `${score}%` }} />
                      </div>
                    </div>
                    <Separator />
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      {[
                        { label: "Order Total",   value: formatCurrency(checkedOrder.total),         icon: Package },
                        { label: "Items",         value: `${checkedOrder.items} item(s)`,            icon: Package },
                        { label: "Status",        value: checkedOrder.status,                        icon: CheckCircle2 },
                        { label: "Date",          value: formatDate(checkedOrder.createdAt),         icon: Clock },
                      ].map(({ label, value, icon: Icon }) => (
                        <div key={label} className="flex items-start gap-2">
                          <Icon className="h-3.5 w-3.5 text-muted-foreground mt-0.5 shrink-0" />
                          <div>
                            <p className="text-muted-foreground">{label}</p>
                            <p className="font-semibold text-foreground capitalize">{value}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="h-7 text-xs gap-1"
                        onClick={() => toast.success("Flagged!", { description: `${checkedOrder.orderNumber} flagged for review.` })}>
                        <ShieldAlert className="h-3.5 w-3.5" /> Flag
                      </Button>
                      <Button size="sm" variant="outline" className="h-7 text-xs gap-1 text-emerald-600"
                        onClick={() => toast.success("Cleared!", { description: `${checkedOrder.orderNumber} marked as safe.` })}>
                        <ShieldCheck className="h-3.5 w-3.5" /> Mark Safe
                      </Button>
                    </div>
                  </div>
                );
              })()}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── Customer Risk Tab ── */}
        <TabsContent value="customers" className="space-y-3 mt-0">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <User className="h-4 w-4 text-primary" /> Customer Risk Profiles
              </CardTitle>
              <CardDescription>Auto-generated risk scores based on order behaviour.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {mockCustomers.slice(0, 8).map((customer, i) => {
                const score = RISK_SCORE[["low","medium","high","low","medium","low","critical","high"][i % 8] as RiskLevel];
                const risk = getRiskLevel(score);
                return (
                  <div key={customer.id} className="flex items-center gap-4 rounded-xl border border-border bg-muted/10 px-4 py-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                      {customer.name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold text-foreground">{customer.name}</p>
                        <Badge variant="outline" className={cn("text-[10px] capitalize", RISK_COLOR[risk])}>
                          {risk}
                        </Badge>
                      </div>
                      <p className="text-[11px] text-muted-foreground">{customer.email}</p>
                      <div className="mt-1.5 flex items-center gap-2">
                        <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
                          <div className={cn("h-full rounded-full", RISK_BAR[risk])} style={{ width: `${score}%` }} />
                        </div>
                        <span className="text-[11px] font-mono font-semibold text-muted-foreground w-8 text-right">{score}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <Button size="sm" variant="ghost" className="h-7 text-xs"
                        onClick={() => toast.info(`Viewing ${customer.name}'s profile`)}>
                        <Eye className="h-3.5 w-3.5" />
                      </Button>
                      {risk !== "low" && (
                        <Button size="sm" variant="outline" className="h-7 text-xs gap-1 text-destructive"
                          onClick={() => toast.success("Customer flagged", { description: `${customer.name} added to watch list.` })}>
                          <ShieldAlert className="h-3 w-3" /> Flag
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          {/* Phone/Address duplicate check */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Phone className="h-4 w-4 text-primary" /> Shared Contact Details
              </CardTitle>
              <CardDescription>Customers sharing the same phone number or delivery address.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {[
                { detail: "+880 1712-345678", type: "Phone", customers: ["Rafiqul Islam", "R. Islam (Guest)"], risk: "high" as RiskLevel },
                { detail: "Mirpur-10, Dhaka", type: "Address", customers: ["Fatema Begum", "Fatema B."], risk: "medium" as RiskLevel },
                { detail: "+880 1898-765432", type: "Phone", customers: ["Tanvir Ahmed", "T. Ahmed (New)"], risk: "medium" as RiskLevel },
              ].map(({ detail, type, customers, risk }) => (
                <div key={detail} className={cn("flex items-center gap-3 rounded-xl border px-4 py-3", RISK_COLOR[risk])}>
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    {type === "Phone" ? <Phone className="h-4 w-4 shrink-0" /> : <MapPin className="h-4 w-4 shrink-0" />}
                    <div className="min-w-0">
                      <p className="text-xs font-semibold">{detail}</p>
                      <p className="text-[11px] opacity-80">{customers.join(" · ")} — same {type.toLowerCase()}</p>
                    </div>
                  </div>
                  <Badge variant="outline" className={cn("text-[10px] capitalize shrink-0", RISK_COLOR[risk])}>
                    {risk}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
