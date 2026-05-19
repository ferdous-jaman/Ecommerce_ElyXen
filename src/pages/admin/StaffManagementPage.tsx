import { useState } from "react";
import {
  Users, UserPlus, Search, MoreHorizontal, Shield, ShieldOff,
  Lock, Unlock, Mail, Phone, Briefcase, Clock, TrendingUp,
  CheckCircle2, XCircle, AlertTriangle, Edit, Eye,
} from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { cn, getInitials } from "@/lib/utils";
import { formatDate } from "@/lib/utils";
import { useTranslation } from "@/hooks/useTranslation";

type StaffStatus = "active" | "frozen" | "on_leave" | "terminated";

type StaffMember = {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: "staff" | "senior_staff" | "supervisor";
  department: string;
  status: StaffStatus;
  joinDate: string;
  lastActive: string;
  ordersHandled: number;
  performance: number;
  salary: number;
  shift: string;
};

const MOCK_STAFF: StaffMember[] = [
  { id: "s1", name: "Arif Hossain",     email: "arif.h@elyxen.com",    phone: "01711-112233", role: "supervisor",    department: "Operations",    status: "active",     joinDate: "2023-03-15T00:00:00Z", lastActive: "2025-05-19T09:15:00Z", ordersHandled: 1248, performance: 94, salary: 35000, shift: "Morning (8AM–4PM)" },
  { id: "s2", name: "Tasnim Akter",     email: "tasnim.a@elyxen.com",   phone: "01812-223344", role: "senior_staff",  department: "Customer Care", status: "active",     joinDate: "2023-06-01T00:00:00Z", lastActive: "2025-05-19T10:30:00Z", ordersHandled: 987,  performance: 88, salary: 28000, shift: "Morning (8AM–4PM)" },
  { id: "s3", name: "Mehedi Rahman",    email: "mehedi.r@elyxen.com",   phone: "01913-334455", role: "staff",         department: "Warehouse",     status: "active",     joinDate: "2024-01-10T00:00:00Z", lastActive: "2025-05-18T17:00:00Z", ordersHandled: 612,  performance: 81, salary: 22000, shift: "Evening (4PM–12AM)" },
  { id: "s4", name: "Sumaiya Khanam",   email: "sumaiya.k@elyxen.com",  phone: "01614-445566", role: "staff",         department: "Customer Care", status: "on_leave",   joinDate: "2024-02-20T00:00:00Z", lastActive: "2025-05-10T12:00:00Z", ordersHandled: 445,  performance: 77, salary: 22000, shift: "Morning (8AM–4PM)" },
  { id: "s5", name: "Rifat Mahmud",     email: "rifat.m@elyxen.com",    phone: "01715-556677", role: "staff",         department: "Delivery",      status: "frozen",     joinDate: "2023-11-05T00:00:00Z", lastActive: "2025-05-01T08:00:00Z", ordersHandled: 334,  performance: 55, salary: 20000, shift: "Morning (8AM–4PM)" },
  { id: "s6", name: "Nadia Islam",      email: "nadia.i@elyxen.com",    phone: "01816-667788", role: "senior_staff",  department: "Marketing",     status: "active",     joinDate: "2023-08-14T00:00:00Z", lastActive: "2025-05-19T11:00:00Z", ordersHandled: 756,  performance: 91, salary: 30000, shift: "Morning (8AM–4PM)" },
  { id: "s7", name: "Tariq Anwar",      email: "tariq.a@elyxen.com",    phone: "01917-778899", role: "staff",         department: "Warehouse",     status: "active",     joinDate: "2024-04-01T00:00:00Z", lastActive: "2025-05-19T08:45:00Z", ordersHandled: 398,  performance: 83, salary: 22000, shift: "Night (12AM–8AM)" },
];

const STATUS_CONFIG: Record<StaffStatus, { label: string; color: string; icon: React.ElementType }> = {
  active:     { label: "Active",      color: "text-emerald-600 bg-emerald-50 border-emerald-200",  icon: CheckCircle2 },
  frozen:     { label: "Frozen",      color: "text-blue-600 bg-blue-50 border-blue-200",           icon: Lock },
  on_leave:   { label: "On Leave",    color: "text-amber-600 bg-amber-50 border-amber-200",        icon: AlertTriangle },
  terminated: { label: "Terminated",  color: "text-red-600 bg-red-50 border-red-200",              icon: XCircle },
};

const ROLE_LABELS: Record<string, string> = {
  staff: "Staff", senior_staff: "Senior Staff", supervisor: "Supervisor",
};

export function StaffManagementPage() {
  const { t } = useTranslation();
  const [staffList, setStaffList] = useState<StaffMember[]>(MOCK_STAFF);
  const [search, setSearch] = useState("");
  const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [inviteOpen, setInviteOpen] = useState(false);

  const filtered = staffList.filter(
    (s) => s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.email.toLowerCase().includes(search.toLowerCase()) ||
      s.department.toLowerCase().includes(search.toLowerCase())
  );

  const stats = {
    total: staffList.length,
    active: staffList.filter((s) => s.status === "active").length,
    frozen: staffList.filter((s) => s.status === "frozen").length,
    onLeave: staffList.filter((s) => s.status === "on_leave").length,
  };

  function toggleFreeze(id: string) {
    setStaffList((prev) =>
      prev.map((s) =>
        s.id === id
          ? { ...s, status: s.status === "frozen" ? "active" : "frozen" }
          : s
      )
    );
    const staff = staffList.find((s) => s.id === id);
    if (staff) {
      toast.success(staff.status === "frozen" ? `${staff.name} account unfrozen` : `${staff.name} account frozen`);
    }
  }

  function openDetail(s: StaffMember) {
    setSelectedStaff(s);
    setDetailOpen(true);
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={t("staff.title")}
        description="Monitor, manage and control staff accounts and performance."
        actions={
          <Button size="sm" className="gap-1.5" onClick={() => setInviteOpen(true)}>
            <UserPlus className="h-3.5 w-3.5" /> {t("staff.inviteStaff")}
          </Button>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: "Total Staff",  value: stats.total,   color: "text-primary",         bg: "bg-primary/10",        icon: Users },
          { label: "Active",       value: stats.active,  color: "text-emerald-600",     bg: "bg-emerald-500/10",   icon: CheckCircle2 },
          { label: "Frozen",       value: stats.frozen,  color: "text-blue-600",        bg: "bg-blue-500/10",      icon: Lock },
          { label: "On Leave",     value: stats.onLeave, color: "text-amber-600",       bg: "bg-amber-500/10",     icon: AlertTriangle },
        ].map(({ label, value, color, bg, icon: Icon }) => (
          <Card key={label}>
            <CardContent className="p-4 flex items-center gap-3">
              <div className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-xl", bg)}>
                <Icon className={cn("h-5 w-5", color)} />
              </div>
              <div>
                <p className="text-2xl font-black text-foreground leading-none">{value}</p>
                <p className="text-xs font-medium text-muted-foreground mt-0.5">{label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
        <Input placeholder="Search staff..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-8 h-9 text-sm" />
      </div>

      {/* Staff list */}
      <div className="space-y-3">
        {filtered.map((staff) => {
          const statusCfg = STATUS_CONFIG[staff.status];
          const StatusIcon = statusCfg.icon;
          return (
            <Card key={staff.id} className={cn("transition-all", staff.status === "frozen" && "opacity-75")}>
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <Avatar className="h-10 w-10 shrink-0 ring-2 ring-primary/10">
                    <AvatarFallback className="bg-primary/10 text-primary font-semibold text-sm">
                      {getInitials(staff.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm font-semibold text-foreground">{staff.name}</p>
                      <Badge variant="outline" className="text-[10px]">{ROLE_LABELS[staff.role]}</Badge>
                      <Badge variant="outline" className={cn("text-[10px] gap-0.5", statusCfg.color)}>
                        <StatusIcon className="h-3 w-3" />{statusCfg.label}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 mt-1 flex-wrap">
                      <span className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Mail className="h-3 w-3" />{staff.email}
                      </span>
                      <span className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Briefcase className="h-3 w-3" />{staff.department}
                      </span>
                      <span className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />{staff.shift}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 mt-2">
                      <span className="text-xs text-muted-foreground">Orders: <strong className="text-foreground">{staff.ordersHandled.toLocaleString()}</strong></span>
                      <span className="text-xs text-muted-foreground">Performance:</span>
                      <div className="flex items-center gap-1.5">
                        <div className="w-20 h-1.5 rounded-full bg-muted overflow-hidden">
                          <div
                            className={cn("h-full rounded-full", staff.performance >= 85 ? "bg-emerald-500" : staff.performance >= 65 ? "bg-amber-500" : "bg-red-500")}
                            style={{ width: `${staff.performance}%` }}
                          />
                        </div>
                        <span className="text-xs font-semibold">{staff.performance}%</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Button size="sm" variant="ghost" className="h-8 w-8 p-0" onClick={() => openDetail(staff)}>
                      <Eye className="h-3.5 w-3.5" />
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-3.5 w-3.5" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem className="gap-2 cursor-pointer" onClick={() => openDetail(staff)}>
                          <Eye className="h-3.5 w-3.5" /> View Profile
                        </DropdownMenuItem>
                        <DropdownMenuItem className="gap-2 cursor-pointer" onClick={() => toast.info("Edit staff coming soon")}>
                          <Edit className="h-3.5 w-3.5" /> Edit Details
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="gap-2 cursor-pointer" onClick={() => toggleFreeze(staff.id)}>
                          {staff.status === "frozen"
                            ? <><Unlock className="h-3.5 w-3.5 text-emerald-600" /> <span className="text-emerald-600">Unfreeze Account</span></>
                            : <><Lock className="h-3.5 w-3.5 text-blue-600" /> <span className="text-blue-600">Freeze Account</span></>
                          }
                        </DropdownMenuItem>
                        <DropdownMenuItem className="gap-2 cursor-pointer" onClick={() => toast.info(`Reset email sent to ${staff.email}`)}>
                          <Shield className="h-3.5 w-3.5 text-amber-600" /> <span className="text-amber-600">Reset Password</span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="gap-2 cursor-pointer text-destructive focus:text-destructive" onClick={() => {
                          setStaffList((prev) => prev.map((s) => s.id === staff.id ? { ...s, status: "terminated" } : s));
                          toast.success(`${staff.name} has been terminated.`);
                        }}>
                          <ShieldOff className="h-3.5 w-3.5" /> Terminate
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Detail Dialog */}
      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="sm:max-w-lg">
          {selectedStaff && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-primary/10 text-primary text-sm font-semibold">
                      {getInitials(selectedStaff.name)}
                    </AvatarFallback>
                  </Avatar>
                  {selectedStaff.name}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-2">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  {[
                    { label: "Email",       value: selectedStaff.email,     icon: Mail },
                    { label: "Phone",       value: selectedStaff.phone,     icon: Phone },
                    { label: "Department",  value: selectedStaff.department, icon: Briefcase },
                    { label: "Shift",       value: selectedStaff.shift,     icon: Clock },
                    { label: "Joined",      value: formatDate(selectedStaff.joinDate), icon: CheckCircle2 },
                    { label: "Last Active", value: formatDate(selectedStaff.lastActive), icon: TrendingUp },
                  ].map(({ label, value, icon: Icon }) => (
                    <div key={label} className="flex items-start gap-2 rounded-lg bg-muted/40 p-2.5">
                      <Icon className="h-3.5 w-3.5 text-muted-foreground mt-0.5 shrink-0" />
                      <div>
                        <p className="text-[10px] text-muted-foreground">{label}</p>
                        <p className="text-xs font-semibold text-foreground">{value}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <Separator />
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="rounded-xl bg-muted/40 p-3">
                    <p className="text-xl font-black text-foreground">{selectedStaff.ordersHandled.toLocaleString()}</p>
                    <p className="text-[11px] text-muted-foreground">Orders Handled</p>
                  </div>
                  <div className="rounded-xl bg-muted/40 p-3">
                    <p className="text-xl font-black text-foreground">{selectedStaff.performance}%</p>
                    <p className="text-[11px] text-muted-foreground">Performance</p>
                  </div>
                  <div className="rounded-xl bg-muted/40 p-3">
                    <p className="text-xl font-black text-foreground">৳{selectedStaff.salary.toLocaleString()}</p>
                    <p className="text-[11px] text-muted-foreground">Monthly Salary</p>
                  </div>
                </div>
              </div>
              <DialogFooter className="gap-2">
                <Button variant="outline" size="sm" onClick={() => toggleFreeze(selectedStaff.id)}>
                  {selectedStaff.status === "frozen" ? <><Unlock className="h-3.5 w-3.5 mr-1.5" />Unfreeze</> : <><Lock className="h-3.5 w-3.5 mr-1.5" />Freeze</>}
                </Button>
                <Button size="sm" onClick={() => { setDetailOpen(false); toast.success("Profile edit coming soon"); }}>
                  <Edit className="h-3.5 w-3.5 mr-1.5" /> Edit Profile
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Invite Dialog */}
      <Dialog open={inviteOpen} onOpenChange={setInviteOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader><DialogTitle>Invite New Staff</DialogTitle></DialogHeader>
          <div className="space-y-3 py-2">
            <div className="space-y-1.5">
              <Label htmlFor="inv-name">Full Name</Label>
              <Input id="inv-name" placeholder="e.g. Karim Hossain" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="inv-email">Email Address</Label>
              <Input id="inv-email" type="email" placeholder="staff@elyxen.com" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="inv-dept">Department</Label>
              <select id="inv-dept" className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                <option>Operations</option>
                <option>Customer Care</option>
                <option>Warehouse</option>
                <option>Delivery</option>
                <option>Marketing</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="inv-role">Role</Label>
              <select id="inv-role" className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                <option value="staff">Staff</option>
                <option value="senior_staff">Senior Staff</option>
                <option value="supervisor">Supervisor</option>
              </select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" size="sm" onClick={() => setInviteOpen(false)}>Cancel</Button>
            <Button size="sm" onClick={() => { setInviteOpen(false); toast.success("Invitation sent!", { description: "Staff will receive an email to set up their account." }); }}>
              <Mail className="h-3.5 w-3.5 mr-1.5" /> Send Invitation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
