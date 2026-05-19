import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Users, ChevronLeft, ChevronRight, X } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { TableRowSkeleton } from "@/components/shared/Skeleton";
import { customerService } from "@/services/customerService";
import { mockCustomers, type MockCustomer } from "@/lib/mockData";
import { formatCurrency, getInitials } from "@/lib/utils";
import type { Customer } from "@/types/database";

export function CustomersPage() {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const pageSize = 20;

  const fetchCustomers = useCallback(async () => {
    setIsLoading(true);
    const result = await customerService.getAll({ page, pageSize, search: search || undefined });
    if (result.data) { setCustomers(result.data); setTotal(result.count); }
    setIsLoading(false);
  }, [page, search]);

  useEffect(() => { fetchCustomers(); }, [fetchCustomers]);

  // If DB has no customers, show demo mock data
  const usingMock = !isLoading && customers.length === 0;
  const filteredMock: MockCustomer[] = search
    ? mockCustomers.filter((c) =>
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.email.toLowerCase().includes(search.toLowerCase())
      )
    : mockCustomers;
  const displayCount = usingMock ? filteredMock.length : total;
  const totalPages = usingMock ? 1 : Math.ceil(total / pageSize);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Customers"
        description={`${displayCount} customer${displayCount !== 1 ? "s" : ""}`}
      />

      <div className="flex items-center gap-3">
        <form onSubmit={(e) => { e.preventDefault(); setSearch(searchInput); setPage(1); }} className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground pointer-events-none" />
          <Input placeholder="Search customers..." className="pl-8 h-9 text-sm pr-8" value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)} />
          {searchInput && (
            <button type="button" onClick={() => { setSearchInput(""); setSearch(""); setPage(1); }}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </form>
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead>Customer</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>City</TableHead>
              <TableHead className="text-right">Orders</TableHead>
              <TableHead className="text-right">Total Spent</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 8 }).map((_, i) => <TableRowSkeleton key={i} cols={6} />)
            ) : usingMock ? (
              filteredMock.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6}>
                    <div className="flex flex-col items-center justify-center py-16 gap-3">
                      <div className="rounded-xl bg-muted p-4"><Users className="h-7 w-7 text-muted-foreground" /></div>
                      <p className="text-sm text-muted-foreground">No customers match your search</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredMock.map((c) => (
                  <TableRow key={c.id} className="cursor-pointer hover:bg-muted/40">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8 shrink-0">
                          <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">{getInitials(c.name)}</AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                          <p className="text-sm font-medium">{c.name}</p>
                          <p className="text-[11px] text-muted-foreground truncate">{c.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{c.phone}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{c.city}</TableCell>
                    <TableCell className="text-right text-sm font-medium">{c.totalOrders}</TableCell>
                    <TableCell className="text-right text-sm font-semibold">{formatCurrency(c.totalSpent)}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={c.status === "active"
                        ? "text-[10px] bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20"
                        : "text-[10px] bg-muted text-muted-foreground"}>
                        {c.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))
              )
            ) : (
              customers.map((customer) => {
                const fullName = `${customer.first_name} ${customer.last_name}`;
                return (
                  <TableRow key={customer.id} className="cursor-pointer hover:bg-muted/40"
                    onClick={() => navigate(`/dashboard/customers/${customer.id}`)}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8 shrink-0">
                          <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                            {getInitials(fullName)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                          <p className="text-sm font-medium">{fullName}</p>
                          <p className="text-[11px] text-muted-foreground truncate">{customer.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{customer.phone ?? "—"}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">—</TableCell>
                    <TableCell className="text-right text-sm font-medium">{customer.total_orders}</TableCell>
                    <TableCell className="text-right text-sm font-semibold">{formatCurrency(customer.total_spent)}</TableCell>
                    <TableCell><Badge variant="outline" className="text-[10px] bg-emerald-50 text-emerald-700 border-emerald-200">active</Badge></TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>

        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t">
            <p className="text-xs text-muted-foreground">
              Showing {(page - 1) * pageSize + 1}–{Math.min(page * pageSize, total)} of {total}
            </p>
            <div className="flex items-center gap-1">
              <Button variant="outline" size="icon" className="h-7 w-7" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
                <ChevronLeft className="h-3.5 w-3.5" />
              </Button>
              <span className="text-xs px-2">{page} / {totalPages}</span>
              <Button variant="outline" size="icon" className="h-7 w-7" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>
                <ChevronRight className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
