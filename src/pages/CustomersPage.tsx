import { Users, Plus, Search } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

export function CustomersPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Customers"
        description="View and manage your customer base."
        actions={
          <Button size="sm" className="gap-1.5">
            <Plus className="h-3.5 w-3.5" />
            Add Customer
          </Button>
        }
      />
      <div className="relative max-w-xs">
        <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="Search customers..." className="pl-8 h-8 text-sm" />
      </div>
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-20 gap-4">
          <div className="rounded-xl bg-muted p-4">
            <Users className="h-8 w-8 text-muted-foreground" />
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-foreground">No customers yet</p>
            <p className="text-xs text-muted-foreground mt-1">
              Your customer list will appear here.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
