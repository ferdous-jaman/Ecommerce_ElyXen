import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Plus, Search, Package, MoreHorizontal, Pencil, Trash2,
  ChevronLeft, ChevronRight, X,
} from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { ProductStatusBadge } from "@/components/shared/StatusBadge";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { TableRowSkeleton } from "@/components/shared/Skeleton";
import { useProducts } from "@/hooks/useProducts";
import { productService } from "@/services/productService";
import { formatCurrency } from "@/lib/utils";
import type { Product } from "@/types/database";

export function ProductsPage() {
  const navigate = useNavigate();
  const { products, categories, total, page, pageSize, filters, isLoading, setPage, setFilters, removeProduct } = useProducts();
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [searchInput, setSearchInput] = useState(filters.search ?? "");

  const totalPages = Math.ceil(total / pageSize);

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFilters({ search: searchInput });
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setIsDeleting(true);
    const result = await productService.delete(deleteTarget.id);
    setIsDeleting(false);
    if (result.error) {
      toast.error("Failed to delete product", { description: result.error });
    } else {
      toast.success("Product deleted");
      removeProduct(deleteTarget.id);
      setDeleteTarget(null);
    }
  }

  const hasActiveFilters =
    (filters.status && filters.status !== "all") ||
    (filters.category_id && filters.category_id !== "all") ||
    !!filters.search;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Products"
        description={`${total} product${total !== 1 ? "s" : ""} in your catalog`}
        actions={
          <Button size="sm" className="gap-1.5" asChild>
            <Link to="/dashboard/products/new">
              <Plus className="h-3.5 w-3.5" />
              Add Product
            </Link>
          </Button>
        }
      />

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground pointer-events-none" />
          <Input
            placeholder="Search products..."
            className="pl-8 h-9 text-sm pr-8"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
          {searchInput && (
            <button type="button" onClick={() => { setSearchInput(""); setFilters({ search: "" }); }}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </form>

        <div className="flex items-center gap-2 flex-wrap">
          <Select
            value={filters.status ?? "all"}
            onValueChange={(v) => setFilters({ status: v as typeof filters.status })}
          >
            <SelectTrigger className="h-9 w-32 text-sm">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="archived">Archived</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={filters.category_id ?? "all"}
            onValueChange={(v) => setFilters({ category_id: v })}
          >
            <SelectTrigger className="h-9 w-36 text-sm">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((c) => (
                <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          {hasActiveFilters && (
            <Button variant="ghost" size="sm" className="h-9 gap-1.5 text-muted-foreground"
              onClick={() => { setFilters({ status: "all", category_id: "all", search: "" }); setSearchInput(""); }}>
              <X className="h-3.5 w-3.5" />
              Clear
            </Button>
          )}
        </div>
      </div>

      <Card>
        <div className="rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="w-[300px]">Product</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Price</TableHead>
                <TableHead className="w-10" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 8 }).map((_, i) => <TableRowSkeleton key={i} cols={6} />)
              ) : products.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6}>
                    <div className="flex flex-col items-center justify-center py-16 gap-3">
                      <div className="rounded-xl bg-muted p-4">
                        <Package className="h-7 w-7 text-muted-foreground" />
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-medium">No products found</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {hasActiveFilters ? "Try adjusting your filters" : "Add your first product to get started"}
                        </p>
                      </div>
                      {!hasActiveFilters && (
                        <Button size="sm" className="gap-1.5 mt-1" asChild>
                          <Link to="/dashboard/products/new"><Plus className="h-3.5 w-3.5" />Add Product</Link>
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                products.map((product) => {
                  const category = categories.find((c) => c.id === product.category_id);
                  return (
                    <TableRow key={product.id} className="cursor-pointer hover:bg-muted/40"
                      onClick={() => navigate(`/dashboard/products/${product.id}`)}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center shrink-0 overflow-hidden border">
                            {product.images[0] ? (
                              <img src={product.images[0]} alt={product.name} className="h-full w-full object-cover" />
                            ) : (
                              <Package className="h-4 w-4 text-muted-foreground" />
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-medium truncate">{product.name}</p>
                            {product.tags.length > 0 && (
                              <div className="flex gap-1 mt-0.5 flex-wrap">
                                {product.tags.slice(0, 2).map((tag) => (
                                  <Badge key={tag} variant="secondary" className="text-[10px] px-1.5 py-0 h-4">{tag}</Badge>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="font-mono text-xs text-muted-foreground">{product.sku}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{category?.name ?? "—"}</TableCell>
                      <TableCell><ProductStatusBadge status={product.status} /></TableCell>
                      <TableCell className="text-right">
                        <div>
                          <p className="text-sm font-semibold">{formatCurrency(product.price)}</p>
                          {product.compare_price && product.compare_price > product.price && (
                            <p className="text-[11px] text-muted-foreground line-through">{formatCurrency(product.compare_price)}</p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell onClick={(e) => e.stopPropagation()}>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-7 w-7">
                              <MoreHorizontal className="h-3.5 w-3.5" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-40">
                            <DropdownMenuItem onClick={() => navigate(`/dashboard/products/${product.id}`)}>
                              View details
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => navigate(`/dashboard/products/${product.id}/edit`)}>
                              <Pencil className="h-3.5 w-3.5 mr-2" />Edit
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-destructive focus:text-destructive"
                              onClick={() => setDeleteTarget(product)}
                            >
                              <Trash2 className="h-3.5 w-3.5 mr-2" />Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t">
            <p className="text-xs text-muted-foreground">
              Showing {(page - 1) * pageSize + 1}–{Math.min(page * pageSize, total)} of {total}
            </p>
            <div className="flex items-center gap-1">
              <Button variant="outline" size="icon" className="h-7 w-7"
                disabled={page <= 1} onClick={() => setPage(page - 1)}>
                <ChevronLeft className="h-3.5 w-3.5" />
              </Button>
              <span className="text-xs px-2">{page} / {totalPages}</span>
              <Button variant="outline" size="icon" className="h-7 w-7"
                disabled={page >= totalPages} onClick={() => setPage(page + 1)}>
                <ChevronRight className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        )}
      </Card>

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Delete Product"
        description={`Are you sure you want to delete "${deleteTarget?.name}"? This action cannot be undone.`}
        confirmLabel="Delete"
        isLoading={isDeleting}
        onConfirm={handleDelete}
      />
    </div>
  );
}
