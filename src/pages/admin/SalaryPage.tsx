import { useState } from "react";
import {
  DollarSign, Download, Search, CheckCircle2, Clock,
  TrendingUp, Users, Calendar, CreditCard,
  FileText, Plus,
} from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn, getInitials } from "@/lib/utils";

type PayStatus = "paid" | "pending" | "processing";

type PayRecord = {
  id: string;
  name: string;
  role: string;
  department: string;
  baseSalary: number;
  bonus: number;
  deduction: number;
  month: string;
  status: PayStatus;
};

const PAYROLL: PayRecord[] = [
  { id: "s1", name: "Arif Hossain",   role: "Supervisor",    department: "Operations",    baseSalary: 35000, bonus: 5000, deduction: 500,  month: "May 2025", status: "paid" },
  { id: "s2", name: "Tasnim Akter",   role: "Senior Staff",  department: "Customer Care", baseSalary: 28000, bonus: 3000, deduction: 0,    month: "May 2025", status: "paid" },
  { id: "s3", name: "Mehedi Rahman",  role: "Staff",         department: "Warehouse",     baseSalary: 22000, bonus: 1500, deduction: 200,  month: "May 2025", status: "processing" },
  { id: "s4", name: "Sumaiya Khanam", role: "Staff",         department: "Customer Care", baseSalary: 22000, bonus: 0,    deduction: 4400, month: "May 2025", status: "pending" },
  { id: "s5", name: "Rifat Mahmud",   role: "Staff",         department: "Delivery",      baseSalary: 20000, bonus: 0,    deduction: 2000, month: "May 2025", status: "pending" },
  { id: "s6", name: "Nadia Islam",    role: "Senior Staff",  department: "Marketing",     baseSalary: 30000, bonus: 4000, deduction: 0,    month: "May 2025", status: "paid" },
  { id: "s7", name: "Tariq Anwar",    role: "Staff",         department: "Warehouse",     baseSalary: 22000, bonus: 1000, deduction: 0,    month: "May 2025", status: "processing" },
];

const SALARY_STRUCTURE = [
  { grade: "G1 — Staff",         range: "৳18,000 – ৳24,000", benefits: "Medical, PF",                  headcount: 4 },
  { grade: "G2 — Senior Staff",  range: "৳24,000 – ৳32,000", benefits: "Medical, PF, Transport",       headcount: 2 },
  { grade: "G3 — Supervisor",    range: "৳32,000 – ৳45,000", benefits: "Medical, PF, Transport, Bonus", headcount: 1 },
];

const STATUS_CFG: Record<PayStatus, { label: string; color: string }> = {
  paid:       { label: "Paid",       color: "text-emerald-600 bg-emerald-50 border-emerald-200" },
  pending:    { label: "Pending",    color: "text-amber-600 bg-amber-50 border-amber-200" },
  processing: { label: "Processing", color: "text-blue-600 bg-blue-50 border-blue-200" },
};

const MONTHLY_HISTORY = [
  { month: "Jan 2025", total: 175400, paid: 7, pending: 0 },
  { month: "Feb 2025", total: 178600, paid: 7, pending: 0 },
  { month: "Mar 2025", total: 182100, paid: 7, pending: 0 },
  { month: "Apr 2025", total: 181900, paid: 7, pending: 0 },
  { month: "May 2025", total: 194300, paid: 3, pending: 4 },
];

export function SalaryPage() {
  const [search, setSearch] = useState("");
  const [payroll, setPayroll] = useState<PayRecord[]>(PAYROLL);

  const filtered = payroll.filter(
    (r) => r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.department.toLowerCase().includes(search.toLowerCase())
  );

  const totalBase = payroll.reduce((s, r) => s + r.baseSalary, 0);
  const totalBonus = payroll.reduce((s, r) => s + r.bonus, 0);
  const totalDeductions = payroll.reduce((s, r) => s + r.deduction, 0);
  const totalNet = totalBase + totalBonus - totalDeductions;
  const paidCount = payroll.filter((r) => r.status === "paid").length;
  const pendingCount = payroll.filter((r) => r.status !== "paid").length;

  function markPaid(id: string) {
    setPayroll((prev) => prev.map((r) => r.id === id ? { ...r, status: "paid" } : r));
    toast.success("Salary marked as paid");
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Payroll & Salary"
        description="Manage staff salaries, bonuses, deductions and payment history."
        actions={
          <div className="flex gap-2">
            <Button size="sm" variant="outline" className="gap-1.5" onClick={() => toast.info("Payslip export coming soon")}>
              <Download className="h-3.5 w-3.5" /> Export
            </Button>
            <Button size="sm" className="gap-1.5" onClick={() => toast.info("Process payroll initiated")}>
              <CreditCard className="h-3.5 w-3.5" /> Process Payroll
            </Button>
          </div>
        }
      />

      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: "Total Payroll",   value: `৳${totalNet.toLocaleString()}`, sub: "May 2025",         icon: DollarSign, color: "text-primary",      bg: "bg-primary/10" },
          { label: "Base Salaries",   value: `৳${totalBase.toLocaleString()}`, sub: "7 staff",         icon: Users,      color: "text-emerald-600",  bg: "bg-emerald-500/10" },
          { label: "Bonuses",         value: `৳${totalBonus.toLocaleString()}`, sub: "Performance",    icon: TrendingUp, color: "text-amber-600",    bg: "bg-amber-500/10" },
          { label: "Pending Payment", value: String(pendingCount),             sub: `${paidCount} paid`, icon: Clock,    color: "text-blue-600",     bg: "bg-blue-500/10" },
        ].map(({ label, value, sub, icon: Icon, color, bg }) => (
          <Card key={label}>
            <CardContent className="p-4 flex items-center gap-3">
              <div className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-xl", bg)}>
                <Icon className={cn("h-5 w-5", color)} />
              </div>
              <div>
                <p className="text-xl font-black text-foreground leading-none">{value}</p>
                <p className="text-xs font-medium text-muted-foreground mt-0.5">{label}</p>
                <p className="text-[11px] text-muted-foreground">{sub}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="payroll" className="space-y-4">
        <TabsList className="h-9 gap-0.5">
          <TabsTrigger value="payroll" className="text-xs gap-1.5">
            <CreditCard className="h-3.5 w-3.5" /> Current Month
          </TabsTrigger>
          <TabsTrigger value="structure" className="text-xs gap-1.5">
            <FileText className="h-3.5 w-3.5" /> Salary Structure
          </TabsTrigger>
          <TabsTrigger value="history" className="text-xs gap-1.5">
            <Calendar className="h-3.5 w-3.5" /> Payment History
          </TabsTrigger>
        </TabsList>

        {/* Current Month Payroll */}
        <TabsContent value="payroll" className="space-y-3 mt-0">
          <div className="relative max-w-sm">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input placeholder="Search staff..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-8 h-9 text-sm" />
          </div>

          <Card>
            <div className="divide-y divide-border">
              {filtered.map((rec) => {
                const net = rec.baseSalary + rec.bonus - rec.deduction;
                const st = STATUS_CFG[rec.status];
                return (
                  <div key={rec.id} className="flex items-center gap-4 px-5 py-4">
                    <Avatar className="h-9 w-9 shrink-0">
                      <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                        {getInitials(rec.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-sm font-semibold text-foreground">{rec.name}</p>
                        <span className="text-xs text-muted-foreground">·</span>
                        <p className="text-xs text-muted-foreground">{rec.role}</p>
                        <Badge variant="outline" className={cn("text-[10px]", st.color)}>{st.label}</Badge>
                      </div>
                      <div className="flex items-center gap-4 mt-1 text-[11px] text-muted-foreground flex-wrap">
                        <span>Base: <strong className="text-foreground">৳{rec.baseSalary.toLocaleString()}</strong></span>
                        {rec.bonus > 0 && <span className="text-emerald-600">+Bonus ৳{rec.bonus.toLocaleString()}</span>}
                        {rec.deduction > 0 && <span className="text-red-500">−Deduction ৳{rec.deduction.toLocaleString()}</span>}
                        <span className="font-semibold text-foreground">Net: ৳{net.toLocaleString()}</span>
                      </div>
                    </div>
                    <div className="shrink-0 flex gap-2 items-center">
                      {rec.status !== "paid" && (
                        <Button size="sm" variant="outline" className="h-7 text-xs gap-1 text-emerald-600 border-emerald-200"
                          onClick={() => markPaid(rec.id)}>
                          <CheckCircle2 className="h-3.5 w-3.5" /> Mark Paid
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="border-t px-5 py-3 bg-muted/30 flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Total Net Payroll — May 2025</span>
              <span className="text-sm font-black text-foreground">৳{totalNet.toLocaleString()}</span>
            </div>
          </Card>
        </TabsContent>

        {/* Salary Structure */}
        <TabsContent value="structure" className="space-y-4 mt-0">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <FileText className="h-4 w-4 text-primary" /> Grade Structure
              </CardTitle>
              <CardDescription>Official salary bands and benefits per grade.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {SALARY_STRUCTURE.map((s) => (
                <div key={s.grade} className="flex items-center justify-between rounded-xl border border-border bg-muted/20 px-4 py-3 gap-4 flex-wrap">
                  <div>
                    <p className="text-sm font-semibold text-foreground">{s.grade}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">Benefits: {s.benefits}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-center">
                      <p className="text-sm font-black text-foreground">{s.range}</p>
                      <p className="text-[10px] text-muted-foreground">Salary Range</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-black text-foreground">{s.headcount}</p>
                      <p className="text-[10px] text-muted-foreground">Headcount</p>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Plus className="h-4 w-4 text-primary" /> Bonus & Deduction Rules
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              {[
                { rule: "Performance Bonus", detail: "Awarded monthly based on KPI score ≥ 85%" },
                { rule: "Festival Bonus",    detail: "2 festival bonuses/year equal to 1 month salary" },
                { rule: "Late Deduction",    detail: "৳200 per late instance after 3 warnings/month" },
                { rule: "Absent Deduction",  detail: "1/30 of monthly salary per absent day" },
                { rule: "Provident Fund",    detail: "5% of base salary deducted monthly (employer match)" },
              ].map(({ rule, detail }) => (
                <div key={rule} className="flex items-start gap-3 rounded-lg bg-muted/20 px-3 py-2.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs font-semibold text-foreground">{rule}</p>
                    <p className="text-[11px] text-muted-foreground">{detail}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Payment History */}
        <TabsContent value="history" className="mt-0">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Monthly Payment History</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {MONTHLY_HISTORY.map((m) => (
                <div key={m.month} className="flex items-center justify-between rounded-xl border border-border bg-muted/20 px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10">
                      <Calendar className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">{m.month}</p>
                      <p className="text-[11px] text-muted-foreground">{m.paid} paid · {m.pending} pending</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <p className="text-sm font-black text-foreground">৳{m.total.toLocaleString()}</p>
                    {m.pending === 0
                      ? <Badge variant="outline" className="text-[10px] text-emerald-600 bg-emerald-50 border-emerald-200">Completed</Badge>
                      : <Badge variant="outline" className="text-[10px] text-amber-600 bg-amber-50 border-amber-200">In Progress</Badge>
                    }
                    <Button size="sm" variant="ghost" className="h-7 text-xs" onClick={() => toast.info("Payslip download coming soon")}>
                      <Download className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
