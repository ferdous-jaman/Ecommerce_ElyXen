import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Pencil, Trash2, Package, Tag, BarChart3, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ProductStatusBadge } from "@/components/shared/StatusBadge";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { LoadingScreen } from "@/components/shared/LoadingScreen";
import { productService } from "@/services/productService";
import { inventoryService } from "@/services/inventoryService";
import { formatCurrency, formatDate } from "@/lib/utils";
import { useProducts } from "@/hooks/useProducts";
import type { Product, Inventory } from "@/types/database";

export function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { categories, removeProduct } = useProducts();
  const [product, setProduct] = useState<Product | null>(null);
  const [inventory, setInventory] = useState<Inventory | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showDelete, setShowDelete] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    if (!id) return;
    Promise.all([
      productService.getById(id),
      inventoryService.getByProductId(id),
    ]).then(([prodRes, invRes]) => {
      if (prodRes.data) setProduct(prodRes.data);
      if (invRes.data) setInventory(invRes.data);
      setIsLoading(false);
    });
  }, [id]);

  async function handleDelete() {
    if (!id) return;
    setIsDeleting(true);
    const result = await productService.delete(id);
    setIsDeleting(false);
    if (result.error) {
      toast.error("Delete failed", { description: result.error });
    } else {
      removeProduct(id);
      toast.success("Product deleted");
      navigate("/products");
    }
  }

  if (isLoading) return <LoadingScreen />;
  if (!product) return (
    <div className="flex flex-col items-center justify-center py-24 gap-4">
      <Package className="h-10 w-10 text-muted-foreground" />
      <p className="text-muted-foreground">Product not found</p>
      <Button variant="outline" onClick={() => navigate("/products")}>Back to Products</Button>
    </div>
  );

  const category = categories.find((c) => c.id === product.category_id);
  const isLowStock = inventory && inventory.quantity <= inventory.low_stock_threshold;
  const profit = product.cost_price ? product.price - product.cost_price : null;
  const margin = profit && product.cost_price ? (profit / product.price) * 100 : null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0" onClick={() => navigate("/products")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="min-w-0">
            <h1 className="text-lg font-semibold truncate">{product.name}</h1>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="font-mono text-xs text-muted-foreground">{product.sku}</span>
              <ProductStatusBadge status={product.status} />
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Button variant="outline" size="sm" className="gap-1.5" onClick={() => navigate(`/products/${id}/edit`)}>
            <Pencil className="h-3.5 w-3.5" /> Edit
          </Button>
          <Button variant="outline" size="sm" className="gap-1.5 text-destructive hover:text-destructive" onClick={() => setShowDelete(true)}>
            <Trash2 className="h-3.5 w-3.5" /> Delete
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardContent className="p-0">
              {product.images.length > 0 ? (
                <div className="space-y-2 p-4">
                  <div className="aspect-video rounded-lg bg-muted overflow-hidden">
                    <img src={product.images[selectedImage]} alt={product.name} className="w-full h-full object-contain" />
                  </div>
                  {product.images.length > 1 && (
                    <div className="flex gap-2">
                      {product.images.map((url, i) => (
                        <button key={url} type="button" onClick={() => setSelectedImage(i)}
                          className={`h-14 w-14 rounded-lg overflow-hidden border-2 transition-colors ${i === selectedImage ? "border-primary" : "border-transparent"}`}>
                          <img src={url} alt="" className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="aspect-video flex items-center justify-center bg-muted rounded-t-lg">
                  <Package className="h-16 w-16 text-muted-foreground/30" />
                </div>
              )}
            </CardContent>
          </Card>

          {product.description && (
            <Card>
              <CardHeader className="pb-3"><CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Description</CardTitle></CardHeader>
              <CardContent>
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{product.description}</p>
              </CardContent>
            </Card>
          )}

          {product.tags.length > 0 && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                  <Tag className="h-3.5 w-3.5" /> Tags
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-1.5">
                  {product.tags.map((tag) => (
                    <Badge key={tag} variant="secondary">{tag}</Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-3"><CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-1.5"><BarChart3 className="h-3.5 w-3.5" />Pricing</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Sale Price</span>
                <span className="text-lg font-bold">{formatCurrency(product.price)}</span>
              </div>
              {product.compare_price && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Compare At</span>
                  <span className="text-sm line-through text-muted-foreground">{formatCurrency(product.compare_price)}</span>
                </div>
              )}
              {product.cost_price && (
                <>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Cost</span>
                    <span className="text-sm">{formatCurrency(product.cost_price)}</span>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Profit</span>
                    <span className="text-sm font-medium text-emerald-600">{formatCurrency(profit!)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Margin</span>
                    <span className="text-sm font-medium text-emerald-600">{margin!.toFixed(1)}%</span>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {inventory && (
            <Card className={isLowStock ? "border-amber-300 dark:border-amber-800" : ""}>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                  {isLowStock && <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />}
                  Inventory
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">In Stock</span>
                  <span className={`text-lg font-bold ${isLowStock ? "text-amber-600" : ""}`}>{inventory.quantity}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Reserved</span>
                  <span className="text-sm">{inventory.reserved_quantity}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Available</span>
                  <span className="text-sm font-medium">{inventory.quantity - inventory.reserved_quantity}</span>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Low stock at</span>
                  <span className="text-sm">{inventory.low_stock_threshold} units</span>
                </div>
                {isLowStock && (
                  <div className="flex items-center gap-1.5 text-amber-600 bg-amber-50 dark:bg-amber-900/20 rounded-md px-3 py-2">
                    <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
                    <span className="text-xs font-medium">Low stock alert</span>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader className="pb-3"><CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Details</CardTitle></CardHeader>
            <CardContent className="space-y-2.5 text-sm">
              {category && (
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Category</span>
                  <span className="font-medium">{category.name}</span>
                </div>
              )}
              {product.weight && (
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Weight</span>
                  <span>{product.weight} kg</span>
                </div>
              )}
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Created</span>
                <span>{formatDate(product.created_at)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Updated</span>
                <span>{formatDate(product.updated_at)}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <ConfirmDialog
        open={showDelete}
        onOpenChange={setShowDelete}
        title="Delete Product"
        description={`Delete "${product.name}"? This action cannot be undone.`}
        confirmLabel="Delete"
        isLoading={isDeleting}
        onConfirm={handleDelete}
      />
    </div>
  );
}
