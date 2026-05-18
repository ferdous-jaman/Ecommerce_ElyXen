import { Warehouse, Search, AlertTriangle } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const inventoryStats = [
  { label: "Total SKUs", value: "1,284", color: "text-foreground" },
  { label: "In Stock", value: "1,102", color: "text-emerald-600 dark:text-emerald-400" },
  { label: "Low Stock", value: "87", color: "text-amber-600 dark:text-amber-400" },
  { label: "Out of Stock", value: "95", color: "text-rose-600 dark:text-rose-400" },
];

const lowStockItems = [
  { name: "iPhone 15 Pro 256GB", sku: "APP-IP15-256", stock: 3, threshold: 10 },
  { name: "Sony WH-1000XM5", sku: "SNY-WH1000XM5", stock: 5, threshold: 15 },
  { name: "MacBook Air M3", sku: "APP-MBA-M3", stock: 2, threshold: 8 },
  { name: "Samsung Galaxy S24", sku: "SAM-GS24", stock: 7, threshold: 20 },
  { name: "AirPods Pro 2", sku: "APP-APP2", stock: 4, threshold: 12 },
];

export function InventoryPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Inventory"
        description="Monitor stock levels and manage inventory."
      />

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {inventoryStats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-5">
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                {stat.label}
              </p>
              <p className={`mt-2 text-2xl font-bold ${stat.color}`}>{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="relative max-w-xs">
        <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="Search inventory..." className="pl-8 h-8 text-sm" />
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-amber-500" />
            <CardTitle className="text-base">Low Stock Alerts</CardTitle>
          </div>
        </CardHeader>
        <div className="divide-y divide-border">
          {lowStockItems.map((item) => (
            <div
              key={item.sku}
              className="flex items-center justify-between px-6 py-3.5 hover:bg-muted/40 transition-colors"
            >
              <div>
                <p className="text-sm font-medium">{item.name}</p>
                <p className="text-xs text-muted-foreground">{item.sku}</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">Stock</p>
                  <p className="text-sm font-semibold text-amber-600 dark:text-amber-400">
                    {item.stock} units
                  </p>
                </div>
                <Badge variant="warning" className="text-[10px]">
                  Low Stock
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <CardContent className="flex flex-col items-center justify-center py-16 gap-4">
          <div className="rounded-xl bg-muted p-4">
            <Warehouse className="h-8 w-8 text-muted-foreground" />
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-foreground">Full inventory coming soon</p>
            <p className="text-xs text-muted-foreground mt-1">
              Complete inventory management in the next phase.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
