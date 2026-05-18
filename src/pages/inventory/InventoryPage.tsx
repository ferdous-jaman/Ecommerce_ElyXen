import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Search, AlertTriangle, Package, X, ArrowUpDown } from "lucide-react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import { TableRowSkeleton } from "@/components/shared/Skeleton";
import { inventoryService, type InventoryWithProduct } from "@/services/inventoryService";

const stockSchema = z.object({
  quantity: z.coerce.number().int().min(0, "Must be 0 or more"),
  low_stock_threshold: z.coerce.number().int().min(0),
  location: z.string().optional(),
});
type StockFormData = z.infer<typeof stockSchema>;

export function InventoryPage() {
  const navigate = useNavigate();
  const [inventory, setInventory] = useState<InventoryWithProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showLowStock, setShowLowStock] = useState(false);
  const [updateTarget, setUpdateTarget] = useState<InventoryWithProduct | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<StockFormData>({
    resolver: zodResolver(stockSchema),
  });

  const fetchInventory = useCallback(async () => {
    setIsLoading(true);
    const result = await inventoryService.getAll();
    if (result.data) setInventory(result.data);
    setIsLoading(false);
  }, []);

  useEffect(() => { fetchInventory(); }, [fetchInventory]);

  function openUpdate(item: InventoryWithProduct) {
    setUpdateTarget(item);
    reset({ quantity: item.quantity, low_stock_threshold: item.low_stock_threshold, location: item.location ?? "" });
  }

  async function onSubmit(data: StockFormData) {
    if (!updateTarget) return;
    setIsSubmitting(true);
    const result = await inventoryService.update(updateTarget.id, {
      quantity: data.quantity,
      low_stock_threshold: data.low_stock_threshold,
      location: data.location || null,
    });
    setIsSubmitting(false);
    if (result.error) {
      toast.error("Update failed", { description: result.error });
    } else {
      setInventory((prev) => prev.map((i) => i.id === updateTarget.id
        ? { ...i, ...result.data! } : i));
      toast.success("Stock updated");
      setUpdateTarget(null);
    }
  }

  const filtered = inventory.filter((item) => {
    const matchSearch = !search ||
      item.products.name.toLowerCase().includes(search.toLowerCase()) ||
      item.products.sku.toLowerCase().includes(search.toLowerCase());
    const matchLowStock = !showLowStock || item.quantity <= item.low_stock_threshold;
    return matchSearch && matchLowStock;
  });

  const lowStockCount = inventory.filter((i) => i.quantity <= i.low_stock_threshold).length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Inventory"
        description="Monitor and manage your stock levels"
      />

      {lowStockCount > 0 && (
        <div className="flex items-center gap-3 rounded-lg border border-amber-300 bg-amber-50 dark:bg-amber-900/20 dark:border-amber-800 px-4 py-3">
          <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0" />
          <p className="text-sm text-amber-800 dark:text-amber-400">
            <span className="font-semibold">{lowStockCount} product{lowStockCount !== 1 ? "s" : ""}</span> running low on stock.
          </p>
          <Button variant="link" size="sm" className="h-auto p-0 text-amber-700 ml-auto"
            onClick={() => setShowLowStock(!showLowStock)}>
            {showLowStock ? "Show all" : "View low stock"}
          </Button>
        </div>
      )}

      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search products..." className="pl-8 h-9 text-sm pr-8" value={search}
            onChange={(e) => setSearch(e.target.value)} />
          {search && (
            <button type="button" onClick={() => setSearch("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
        {showLowStock && (
          <Badge variant="outline" className="gap-1 border-amber-300 text-amber-700 bg-amber-50">
            <AlertTriangle className="h-3 w-3" />Low Stock Only
            <button onClick={() => setShowLowStock(false)}><X className="h-3 w-3 ml-1" /></button>
          </Badge>
        )}
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead>Product</TableHead>
              <TableHead className="text-right">In Stock</TableHead>
              <TableHead className="text-right">Reserved</TableHead>
              <TableHead className="text-right">Available</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Location</TableHead>
              <TableHead className="w-24 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 8 }).map((_, i) => <TableRowSkeleton key={i} cols={7} />)
            ) : filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7}>
                  <div className="flex flex-col items-center justify-center py-12 gap-3">
                    <Package className="h-7 w-7 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      {search || showLowStock ? "No items match your filters" : "No inventory records found"}
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((item) => {
                const isLow = item.quantity <= item.low_stock_threshold;
                const isOut = item.quantity === 0;
                const available = item.quantity - item.reserved_quantity;
                return (
                  <TableRow key={item.id} className={isLow ? "bg-amber-50/50 dark:bg-amber-900/10" : ""}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-lg bg-muted flex items-center justify-center shrink-0 overflow-hidden border">
                          {item.products.images[0] ? (
                            <img src={item.products.images[0]} alt="" className="h-full w-full object-cover" />
                          ) : (
                            <Package className="h-4 w-4 text-muted-foreground" />
                          )}
                        </div>
                        <div>
                          <button className="text-sm font-medium hover:underline text-left"
                            onClick={() => navigate(`/products/${item.product_id}`)}>
                            {item.products.name}
                          </button>
                          <p className="font-mono text-[11px] text-muted-foreground">{item.products.sku}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <span className={`text-sm font-semibold ${isLow ? "text-amber-600" : ""}`}>{item.quantity}</span>
                    </TableCell>
                    <TableCell className="text-right text-sm text-muted-foreground">{item.reserved_quantity}</TableCell>
                    <TableCell className="text-right text-sm font-medium">{available}</TableCell>
                    <TableCell>
                      {isOut ? (
                        <Badge variant="outline" className="text-[11px] bg-red-50 text-red-700 border-red-200">Out of Stock</Badge>
                      ) : isLow ? (
                        <Badge variant="outline" className="text-[11px] bg-amber-50 text-amber-700 border-amber-200 gap-1">
                          <AlertTriangle className="h-3 w-3" />Low Stock
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-[11px] bg-emerald-50 text-emerald-700 border-emerald-200">In Stock</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{item.location ?? "—"}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm" className="h-7 text-xs gap-1" onClick={() => openUpdate(item)}>
                        <ArrowUpDown className="h-3 w-3" />Update
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </Card>

      <Dialog open={!!updateTarget} onOpenChange={(open) => !open && setUpdateTarget(null)}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Update Stock</DialogTitle>
            {updateTarget && (
              <p className="text-sm text-muted-foreground">{updateTarget.products.name}</p>
            )}
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <Label>Quantity <span className="text-destructive">*</span></Label>
              <Input type="number" min="0" {...register("quantity")} />
              {errors.quantity && <p className="text-xs text-destructive">{errors.quantity.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label>Low Stock Threshold</Label>
              <Input type="number" min="0" {...register("low_stock_threshold")} />
            </div>
            <div className="space-y-1.5">
              <Label>Location</Label>
              <Input placeholder="e.g. Shelf A2, Warehouse B" {...register("location")} />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setUpdateTarget(null)}>Cancel</Button>
              <Button type="submit" disabled={isSubmitting}>{isSubmitting ? "Saving..." : "Update Stock"}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
