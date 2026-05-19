import { useState } from "react";
import { toast } from "sonner";
import {
  User, Bell, Shield, Palette, Globe, Camera, Eye, EyeOff, Check,
  Clock, Briefcase, CheckCircle2, ShoppingCart, Package, Users,
  ClipboardList, TrendingUp, CalendarDays,
} from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { useAuth } from "@/contexts/AuthContext";
import { getInitials } from "@/lib/utils";
import { cn } from "@/lib/utils";

type NotifKey = "order_created" | "order_shipped" | "low_stock" | "new_customer" | "payment_failed" | "weekly_report";

const defaultNotifs: Record<NotifKey, boolean> = {
  order_created: true,
  order_shipped: true,
  low_stock: true,
  new_customer: false,
  payment_failed: true,
  weekly_report: false,
};

export function SettingsPage() {
  const { user, profile } = useAuth();
  const displayName = profile?.full_name ?? user?.email?.split("@")[0] ?? "User";
  const [showOldPw, setShowOldPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);
  const [notifs, setNotifs] = useState<Record<NotifKey, boolean>>(defaultNotifs);
  const [saved, setSaved] = useState(false);

  function handleSave() {
    toast.success("Changes saved successfully");
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  function toggleNotif(key: NotifKey) {
    setNotifs((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  const notifItems: { key: NotifKey; label: string; description: string }[] = [
    { key: "order_created", label: "New order", description: "When a customer places a new order" },
    { key: "order_shipped", label: "Order shipped", description: "When an order is dispatched" },
    { key: "low_stock", label: "Low stock alert", description: "When product stock falls below threshold" },
    { key: "new_customer", label: "New customer", description: "When a new customer registers" },
    { key: "payment_failed", label: "Payment failed", description: "When a payment attempt fails" },
    { key: "weekly_report", label: "Weekly report", description: "Summary of weekly store performance" },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Settings"
        description="Manage your account and application preferences."
      />

      <Tabs defaultValue="staff" className="space-y-6">
        <TabsList className="h-9 w-full sm:w-auto gap-0.5 flex-wrap">
          <TabsTrigger value="staff" className="gap-1.5 text-xs">
            <Briefcase className="h-3.5 w-3.5" />Staff
          </TabsTrigger>
          <TabsTrigger value="profile" className="gap-1.5 text-xs">
            <User className="h-3.5 w-3.5" />Profile
          </TabsTrigger>
          <TabsTrigger value="appearance" className="gap-1.5 text-xs">
            <Palette className="h-3.5 w-3.5" />Appearance
          </TabsTrigger>
          <TabsTrigger value="notifications" className="gap-1.5 text-xs">
            <Bell className="h-3.5 w-3.5" />Notifications
          </TabsTrigger>
          <TabsTrigger value="security" className="gap-1.5 text-xs">
            <Shield className="h-3.5 w-3.5" />Security
          </TabsTrigger>
        </TabsList>

        {/* Staff Tab */}
        <TabsContent value="staff" className="space-y-4 mt-0">

          {/* Performance overview */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: "Orders Processed", value: "142", icon: ShoppingCart,  color: "text-indigo-500",  bg: "bg-indigo-500/10" },
              { label: "Items Packed",     value: "389", icon: Package,       color: "text-emerald-500", bg: "bg-emerald-500/10" },
              { label: "Customers Helped", value: "67",  icon: Users,         color: "text-violet-500",  bg: "bg-violet-500/10" },
              { label: "Tasks Completed",  value: "94%", icon: CheckCircle2,  color: "text-amber-500",   bg: "bg-amber-500/10" },
            ].map(({ label, value, icon: Icon, color, bg }) => (
              <Card key={label}>
                <CardContent className="p-4 flex items-center gap-3">
                  <div className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-xl", bg)}>
                    <Icon className={cn("h-4 w-4", color)} />
                  </div>
                  <div>
                    <p className="text-lg font-black tracking-tight text-foreground">{value}</p>
                    <p className="text-[10px] text-muted-foreground leading-tight">{label}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Shift Schedule */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-base flex items-center gap-2">
                <CalendarDays className="h-4 w-4 text-primary" /> This Week's Shift Schedule
              </CardTitle>
              <CardDescription>Your assigned work hours for the current week</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="divide-y divide-border">
                {[
                  { day: "Monday",    date: "May 19", shift: "09:00 – 17:00", status: "completed",  hours: 8 },
                  { day: "Tuesday",   date: "May 20", shift: "09:00 – 17:00", status: "active",     hours: 8 },
                  { day: "Wednesday", date: "May 21", shift: "10:00 – 18:00", status: "upcoming",   hours: 8 },
                  { day: "Thursday",  date: "May 22", shift: "09:00 – 17:00", status: "upcoming",   hours: 8 },
                  { day: "Friday",    date: "May 23", shift: "09:00 – 15:00", status: "upcoming",   hours: 6 },
                  { day: "Saturday",  date: "May 24", shift: "—",             status: "off",        hours: 0 },
                  { day: "Sunday",    date: "May 25", shift: "—",             status: "off",        hours: 0 },
                ].map(({ day, date, shift, status, hours }) => (
                  <div key={day} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
                    <div className="flex items-center gap-3">
                      <div className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-[10px] font-bold",
                        status === "active"    ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30" :
                        status === "completed" ? "bg-muted text-muted-foreground" :
                        status === "off"       ? "bg-muted/50 text-muted-foreground/50" :
                        "bg-primary/10 text-primary"
                      )}>
                        {day.slice(0, 2)}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">{day} <span className="text-muted-foreground font-normal text-xs">({date})</span></p>
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock className="h-3 w-3" />{shift}
                          {hours > 0 && <span className="ml-1">· {hours}h</span>}
                        </p>
                      </div>
                    </div>
                    <Badge variant="outline" className={cn("text-[10px] shrink-0",
                      status === "active"    ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20" :
                      status === "completed" ? "bg-muted text-muted-foreground" :
                      status === "off"       ? "bg-muted/30 text-muted-foreground/60" :
                      "bg-primary/5 text-primary border-primary/20"
                    )}>
                      {status === "active" ? "On Shift" : status === "completed" ? "Done" : status === "off" ? "Day Off" : "Upcoming"}
                    </Badge>
                  </div>
                ))}
              </div>
              <Separator className="my-3" />
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Total this week</span>
                <span className="font-bold text-foreground">38 hours</span>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-base flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-primary" /> Quick Actions
              </CardTitle>
              <CardDescription>Common staff tasks — one click access</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {[
                  { label: "Process Orders",    icon: ShoppingCart,  color: "text-indigo-500",  bg: "bg-indigo-500/10",  action: "/dashboard/orders" },
                  { label: "Update Inventory",  icon: Package,       color: "text-amber-500",   bg: "bg-amber-500/10",   action: "/dashboard/inventory" },
                  { label: "View Customers",    icon: Users,         color: "text-violet-500",  bg: "bg-violet-500/10",  action: "/dashboard/customers" },
                  { label: "Check Analytics",   icon: TrendingUp,    color: "text-emerald-500", bg: "bg-emerald-500/10", action: "/dashboard/analytics" },
                  { label: "Manage Products",   icon: ClipboardList, color: "text-rose-500",    bg: "bg-rose-500/10",    action: "/dashboard/products" },
                  { label: "Today's Schedule",  icon: CalendarDays,  color: "text-sky-500",     bg: "bg-sky-500/10",     action: "#" },
                ].map(({ label, icon: Icon, color, bg, action }) => (
                  <button
                    key={label}
                    onClick={() => { if (action !== "#") window.location.href = action; else toast.info("Schedule view coming soon"); }}
                    className="flex flex-col items-center gap-2.5 rounded-xl border border-border bg-muted/30 hover:bg-muted hover:border-primary/30 transition-all p-4 text-center group"
                  >
                    <div className={cn("flex h-10 w-10 items-center justify-center rounded-xl transition-transform group-hover:scale-110", bg)}>
                      <Icon className={cn("h-5 w-5", color)} />
                    </div>
                    <span className="text-xs font-semibold text-foreground leading-tight">{label}</span>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Role & Permissions */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-base flex items-center gap-2">
                <Shield className="h-4 w-4 text-primary" /> Role & Permissions
              </CardTitle>
              <CardDescription>Your current role and access levels</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3 rounded-xl border border-border bg-muted/30 p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                  <Briefcase className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-foreground text-sm capitalize">{profile?.role ?? "staff"}</p>
                  <p className="text-xs text-muted-foreground">Active account</p>
                </div>
                <Badge variant="outline" className="text-[10px] bg-emerald-50 text-emerald-700 border-emerald-200 shrink-0">
                  Active
                </Badge>
              </div>
              <div className="space-y-3">
                {[
                  { module: "Orders",       can: ["View", "Process", "Update Status"],            cannot: ["Delete"] },
                  { module: "Products",     can: ["View", "Edit Stock"],                           cannot: ["Create", "Delete"] },
                  { module: "Customers",    can: ["View", "View Details"],                         cannot: ["Edit", "Delete"] },
                  { module: "Inventory",    can: ["View", "Update Quantity"],                      cannot: ["Bulk Delete"] },
                  { module: "Analytics",    can: ["View Reports"],                                 cannot: ["Export", "Admin Reports"] },
                  { module: "Settings",     can: ["Personal Profile", "Notifications"],            cannot: ["Store Settings", "User Management"] },
                ].map(({ module, can, cannot }) => (
                  <div key={module} className="rounded-lg border border-border p-3">
                    <p className="text-xs font-bold text-foreground mb-2">{module}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {can.map((p) => (
                        <span key={p} className="inline-flex items-center gap-0.5 text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-900/20">
                          <CheckCircle2 className="h-2.5 w-2.5" />{p}
                        </span>
                      ))}
                      {cannot.map((p) => (
                        <span key={p} className="inline-flex items-center gap-0.5 text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground/60 line-through">
                          {p}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Monthly performance */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-base flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-primary" /> Monthly Performance
              </CardTitle>
              <CardDescription>Your KPIs for May 2025</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { label: "Orders Processed",  current: 142, target: 160, unit: "" },
                { label: "Customer Satisfaction", current: 94, target: 100, unit: "%" },
                { label: "On-time Packing",   current: 87, target: 95, unit: "%" },
                { label: "Avg. Processing Time", current: 12, target: 15, unit: "min", invert: true },
              ].map(({ label, current, target, unit, invert }) => {
                const pct = Math.min((current / target) * 100, 100);
                const good = invert ? current <= target : current >= target * 0.9;
                return (
                  <div key={label} className="space-y-1.5">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium text-foreground">{label}</span>
                      <span className={cn("text-xs font-bold", good ? "text-emerald-500" : "text-amber-500")}>
                        {current}{unit} / {target}{unit}
                      </span>
                    </div>
                    <Progress value={pct} className="h-2" />
                  </div>
                );
              })}
            </CardContent>
          </Card>

        </TabsContent>

        {/* Profile Tab */}
        <TabsContent value="profile" className="space-y-4 mt-0">
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-base">Profile Information</CardTitle>
              <CardDescription>Update your personal details and public profile.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={profile?.avatar_url ?? ""} />
                    <AvatarFallback className="bg-primary/10 text-primary text-lg font-semibold">
                      {getInitials(displayName)}
                    </AvatarFallback>
                  </Avatar>
                  <button className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full border-2 border-background bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
                    <Camera className="h-3 w-3" />
                  </button>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">{displayName}</p>
                  <p className="text-xs text-muted-foreground">{user?.email}</p>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className={cn("text-[10px]",
                      profile?.role === "admin" ? "border-primary/30 text-primary bg-primary/5" : "")}>
                      {profile?.role ?? "user"}
                    </Badge>
                    {profile?.is_active && (
                      <Badge variant="outline" className="text-[10px] border-emerald-300 text-emerald-700 bg-emerald-50 dark:bg-emerald-900/20">
                        Active
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
              <Separator />
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label className="text-xs">Full Name</Label>
                  <Input defaultValue={profile?.full_name ?? ""} placeholder="Your full name" className="h-9 text-sm" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Email</Label>
                  <Input defaultValue={user?.email ?? ""} disabled className="h-9 text-sm" />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Bio</Label>
                <textarea
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm resize-none focus:outline-none focus:ring-1 focus:ring-ring"
                  rows={3}
                  placeholder="A short bio about yourself…"
                />
              </div>
              <div className="flex justify-end gap-2 pt-1">
                <Button variant="outline" size="sm">Cancel</Button>
                <Button size="sm" onClick={handleSave} className="gap-1.5 min-w-[110px]">
                  {saved ? <><Check className="h-3.5 w-3.5" />Saved!</> : "Save Changes"}
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-destructive/30">
            <CardHeader className="pb-4">
              <CardTitle className="text-base text-destructive">Danger Zone</CardTitle>
              <CardDescription>Irreversible and destructive actions.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between rounded-lg border border-destructive/20 bg-destructive/5 p-4">
                <div>
                  <p className="text-sm font-medium">Delete Account</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Permanently delete your account and all associated data. This cannot be undone.
                  </p>
                </div>
                <Button variant="destructive" size="sm" className="shrink-0 ml-4">Delete</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Appearance Tab */}
        <TabsContent value="appearance" className="space-y-4 mt-0">
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-base">Theme</CardTitle>
              <CardDescription>Choose how ElyXen looks on your device.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Color theme</p>
                  <p className="text-xs text-muted-foreground">Light, dark, or follow system preference.</p>
                </div>
                <ThemeToggle />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Compact mode</p>
                  <p className="text-xs text-muted-foreground">Reduce spacing and padding across the UI.</p>
                </div>
                <Switch />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Animations</p>
                  <p className="text-xs text-muted-foreground">Enable smooth transitions and micro-interactions.</p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-base">Localization</CardTitle>
              <CardDescription>Language, timezone, and date/currency format.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label className="text-xs flex items-center gap-1.5"><Globe className="h-3.5 w-3.5" />Language</Label>
                  <Input defaultValue="English (US)" className="h-9 text-sm" readOnly />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Timezone</Label>
                  <Input defaultValue="UTC+06:00 Dhaka" className="h-9 text-sm" readOnly />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Currency</Label>
                  <Input defaultValue="USD ($)" className="h-9 text-sm" readOnly />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Date Format</Label>
                  <Input defaultValue="MMM DD, YYYY" className="h-9 text-sm" readOnly />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="space-y-4 mt-0">
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-base">Email Notifications</CardTitle>
              <CardDescription>Choose which events trigger email alerts.</CardDescription>
            </CardHeader>
            <CardContent className="divide-y divide-border">
              {notifItems.map((item) => (
                <div key={item.key} className="flex items-center justify-between py-3.5 first:pt-0 last:pb-0">
                  <div>
                    <p className="text-sm font-medium">{item.label}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{item.description}</p>
                  </div>
                  <Switch
                    checked={notifs[item.key]}
                    onCheckedChange={() => toggleNotif(item.key)}
                    className="ml-4 shrink-0"
                  />
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-base">Push Notifications</CardTitle>
              <CardDescription>Browser and in-app notification preferences.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Enable push notifications</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Receive real-time alerts in your browser.</p>
                </div>
                <Switch className="ml-4 shrink-0" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security" className="space-y-4 mt-0">
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-base">Change Password</CardTitle>
              <CardDescription>Use a strong, unique password to protect your account.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <Label className="text-xs">Current Password</Label>
                <div className="relative">
                  <Input type={showOldPw ? "text" : "password"} placeholder="Current password" className="h-9 text-sm pr-9" />
                  <button
                    type="button"
                    onClick={() => setShowOldPw((v) => !v)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showOldPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">New Password</Label>
                <div className="relative">
                  <Input type={showNewPw ? "text" : "password"} placeholder="New password (min 8 chars)" className="h-9 text-sm pr-9" />
                  <button
                    type="button"
                    onClick={() => setShowNewPw((v) => !v)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showNewPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Confirm New Password</Label>
                <Input type="password" placeholder="Confirm new password" className="h-9 text-sm" />
              </div>
              <div className="flex justify-end pt-1">
                <Button size="sm" onClick={() => toast.success("Password updated")}>Update Password</Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-base">Two-Factor Authentication</CardTitle>
              <CardDescription>Add an extra layer of security to your account.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between rounded-lg border bg-muted/30 p-4">
                <div>
                  <p className="text-sm font-medium">Authenticator App</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Use Google Authenticator or similar.</p>
                </div>
                <Badge variant="outline" className="text-[10px] border-amber-300 text-amber-700 bg-amber-50 dark:bg-amber-900/20">
                  Not enabled
                </Badge>
              </div>
              <Button variant="outline" size="sm" onClick={() => toast.info("2FA setup coming soon")}>
                Enable 2FA
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-base">Active Sessions</CardTitle>
              <CardDescription>Devices currently logged into your account.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { device: "Windows · Chrome", location: "Dhaka, BD", time: "Now (current)", current: true },
                { device: "iPhone · Safari", location: "Dhaka, BD", time: "2 hours ago", current: false },
              ].map((session) => (
                <div key={session.device} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">{session.device}</p>
                    <p className="text-xs text-muted-foreground">{session.location} · {session.time}</p>
                  </div>
                  {session.current ? (
                    <Badge variant="outline" className="text-[10px] border-emerald-300 text-emerald-700 bg-emerald-50 dark:bg-emerald-900/20">
                      Current
                    </Badge>
                  ) : (
                    <Button variant="ghost" size="sm" className="h-7 text-xs text-destructive hover:text-destructive"
                      onClick={() => toast.success("Session revoked")}>
                      Revoke
                    </Button>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
