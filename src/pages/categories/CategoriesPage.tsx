import { useState, useEffect, useCallback } from "react";
import { Plus, Pencil, Trash2, FolderOpen, MoreHorizontal } from "lucide-react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { TableRowSkeleton } from "@/components/shared/Skeleton";
import { categoryService } from "@/services/categoryService";
import { formatDate } from "@/lib/utils";
import type { Category } from "@/types/database";

const categorySchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  description: z.string().optional(),
  parent_id: z.string().optional().nullable(),
});
type CategoryFormData = z.infer<typeof categorySchema>;

export function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Category | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
  });

  const fetchCategories = useCallback(async () => {
    setIsLoading(true);
    const result = await categoryService.getAll();
    if (result.data) setCategories(result.data);
    setIsLoading(false);
  }, []);

  useEffect(() => { fetchCategories(); }, [fetchCategories]);

  function openCreate() {
    setEditTarget(null);
    reset({ name: "", description: "", parent_id: null });
    setDialogOpen(true);
  }

  function openEdit(cat: Category) {
    setEditTarget(cat);
    reset({ name: cat.name, description: cat.description ?? "", parent_id: cat.parent_id });
    setDialogOpen(true);
  }

  async function onSubmit(data: CategoryFormData) {
    setIsSubmitting(true);
    const slug = categoryService.generateSlug(data.name);

    if (editTarget) {
      const result = await categoryService.update(editTarget.id, {
        name: data.name,
        slug,
        description: data.description || null,
        parent_id: data.parent_id || null,
      });
      if (result.error) toast.error("Update failed", { description: result.error });
      else {
        setCategories((prev) => prev.map((c) => c.id === editTarget.id ? result.data! : c));
        toast.success("Category updated");
        setDialogOpen(false);
      }
    } else {
      const result = await categoryService.create({
        name: data.name,
        slug,
        description: data.description || null,
        parent_id: data.parent_id || null,
      });
      if (result.error) toast.error("Create failed", { description: result.error });
      else {
        setCategories((prev) => [...prev, result.data!]);
        toast.success("Category created");
        setDialogOpen(false);
      }
    }
    setIsSubmitting(false);
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setIsDeleting(true);
    const result = await categoryService.delete(deleteTarget.id);
    setIsDeleting(false);
    if (result.error) toast.error("Delete failed", { description: result.error });
    else {
      setCategories((prev) => prev.filter((c) => c.id !== deleteTarget.id));
      toast.success("Category deleted");
      setDeleteTarget(null);
    }
  }

  const rootCategories = categories.filter((c) => !c.parent_id);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Categories"
        description={`${categories.length} categor${categories.length !== 1 ? "ies" : "y"}`}
        actions={
          <Button size="sm" className="gap-1.5" onClick={openCreate}>
            <Plus className="h-3.5 w-3.5" /> Add Category
          </Button>
        }
      />

      <Card>
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead>Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Parent</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="w-10" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => <TableRowSkeleton key={i} cols={5} />)
            ) : categories.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5}>
                  <div className="flex flex-col items-center justify-center py-12 gap-3">
                    <div className="rounded-xl bg-muted p-4"><FolderOpen className="h-7 w-7 text-muted-foreground" /></div>
                    <div className="text-center">
                      <p className="text-sm font-medium">No categories yet</p>
                      <p className="text-xs text-muted-foreground mt-1">Create your first category to organize products</p>
                    </div>
                    <Button size="sm" className="gap-1.5 mt-1" onClick={openCreate}>
                      <Plus className="h-3.5 w-3.5" /> Add Category
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              categories.map((cat) => {
                const parent = categories.find((c) => c.id === cat.parent_id);
                return (
                  <TableRow key={cat.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {cat.parent_id && <span className="ml-3 text-muted-foreground">↳</span>}
                        <span className="text-sm font-medium">{cat.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{cat.description || "—"}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{parent?.name ?? "—"}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{formatDate(cat.created_at)}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-7 w-7">
                            <MoreHorizontal className="h-3.5 w-3.5" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => openEdit(cat)}>
                            <Pencil className="h-3.5 w-3.5 mr-2" />Edit
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => setDeleteTarget(cat)}>
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
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editTarget ? "Edit Category" : "New Category"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <Label htmlFor="cat-name">Name <span className="text-destructive">*</span></Label>
              <Input id="cat-name" placeholder="e.g. Electronics" {...register("name")} />
              {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="cat-desc">Description</Label>
              <Textarea id="cat-desc" placeholder="Optional description..." className="min-h-[80px]" {...register("description")} />
            </div>
            {rootCategories.length > 0 && (
              <div className="space-y-1.5">
                <Label htmlFor="cat-parent">Parent Category</Label>
                <select id="cat-parent" {...register("parent_id")}
                  className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                  <option value="">None (root category)</option>
                  {rootCategories.filter((c) => c.id !== editTarget?.id).map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
            )}
            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : editTarget ? "Save Changes" : "Create"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Delete Category"
        description={`Delete "${deleteTarget?.name}"? Products in this category will be uncategorized.`}
        confirmLabel="Delete"
        isLoading={isDeleting}
        onConfirm={handleDelete}
      />
    </div>
  );
}
