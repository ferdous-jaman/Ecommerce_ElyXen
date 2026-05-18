import { Package, Plus, Search, Filter } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

export function ProductsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Products"
        description="Manage your product catalog."
        actions={
          <Button size="sm" className="gap-1.5">
            <Plus className="h-3.5 w-3.5" />
            Add Product
          </Button>
        }
      />
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search products..." className="pl-8 h-8 text-sm" />
        </div>
        <Button variant="outline" size="sm" className="gap-1.5 h-8">
          <Filter className="h-3.5 w-3.5" />
          Filter
        </Button>
      </div>
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-20 gap-4">
          <div className="rounded-xl bg-muted p-4">
            <Package className="h-8 w-8 text-muted-foreground" />
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-foreground">No products yet</p>
            <p className="text-xs text-muted-foreground mt-1">
              Add your first product to get started.
            </p>
          </div>
          <Button size="sm" className="gap-1.5">
            <Plus className="h-3.5 w-3.5" />
            Add Product
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
