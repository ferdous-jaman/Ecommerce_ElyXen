import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ImageUpload } from "@/components/shared/ImageUpload";
import type { Category } from "@/types/database";
import { X } from "lucide-react";

const productSchema = z.object({
  name: z.string().min(1, "Product name is required").max(200),
  sku: z.string().min(1, "SKU is required").max(100),
  description: z.string().optional(),
  price: z.coerce.number().min(0, "Price must be 0 or more"),
  compare_price: z.coerce.number().min(0).optional().nullable(),
  cost_price: z.coerce.number().min(0).optional().nullable(),
  category_id: z.string().optional().nullable(),
  status: z.enum(["active", "draft", "archived"]),
  weight: z.coerce.number().min(0).optional().nullable(),
});

export type ProductFormData = z.infer<typeof productSchema>;

type ProductFormProps = {
  defaultValues?: Partial<ProductFormData & { images: string[]; tags: string[] }>;
  categories: Category[];
  isSubmitting: boolean;
  submitLabel: string;
  onSubmit: (data: ProductFormData, images: string[], tags: string[]) => Promise<void>;
  onCancel: () => void;
  onImageAdd: (file: File) => Promise<string | null>;
  onImageRemove: (url: string) => void;
  isUploadingImage?: boolean;
};

export function ProductForm({
  defaultValues,
  categories,
  isSubmitting,
  submitLabel,
  onSubmit,
  onCancel,
  onImageAdd,
  onImageRemove,
  isUploadingImage = false,
}: ProductFormProps) {
  const [images, setImages] = useState<string[]>(defaultValues?.images ?? []);
  const [tags, setTags] = useState<string[]>(defaultValues?.tags ?? []);
  const [tagInput, setTagInput] = useState("");

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: defaultValues?.name ?? "",
      sku: defaultValues?.sku ?? "",
      description: defaultValues?.description ?? "",
      price: defaultValues?.price ?? 0,
      compare_price: defaultValues?.compare_price ?? null,
      cost_price: defaultValues?.cost_price ?? null,
      category_id: defaultValues?.category_id ?? null,
      status: defaultValues?.status ?? "draft",
      weight: defaultValues?.weight ?? null,
    },
  });

  const nameValue = watch("name");
  useEffect(() => {
    if (!defaultValues?.sku && nameValue) {
      const sku = nameValue
        .toUpperCase()
        .replace(/[^A-Z0-9]/g, "-")
        .replace(/-+/g, "-")
        .slice(0, 20);
      setValue("sku", sku);
    }
  }, [nameValue, defaultValues?.sku, setValue]);

  async function handleImageAdd(file: File) {
    const url = await onImageAdd(file);
    if (url) setImages((prev) => [...prev, url]);
  }

  function handleImageRemove(url: string) {
    onImageRemove(url);
    setImages((prev) => prev.filter((u) => u !== url));
  }

  function addTag(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const tag = tagInput.trim().toLowerCase();
      if (tag && !tags.includes(tag) && tags.length < 10) {
        setTags((prev) => [...prev, tag]);
        setTagInput("");
      }
    }
  }

  return (
    <form onSubmit={handleSubmit((data) => onSubmit(data, images, tags))} className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-base">Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="name">Product Name <span className="text-destructive">*</span></Label>
                <Input id="name" placeholder="e.g. Premium Wireless Headphones" {...register("name")} />
                {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe your product..."
                  className="min-h-[120px] resize-y"
                  {...register("description")}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-base">Pricing</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="price">Price <span className="text-destructive">*</span></Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">$</span>
                    <Input id="price" type="number" step="0.01" min="0" className="pl-6" placeholder="0.00" {...register("price")} />
                  </div>
                  {errors.price && <p className="text-xs text-destructive">{errors.price.message}</p>}
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="compare_price">Compare Price</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">$</span>
                    <Input id="compare_price" type="number" step="0.01" min="0" className="pl-6" placeholder="0.00" {...register("compare_price")} />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="cost_price">Cost Price</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">$</span>
                    <Input id="cost_price" type="number" step="0.01" min="0" className="pl-6" placeholder="0.00" {...register("cost_price")} />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-base">Product Images</CardTitle>
            </CardHeader>
            <CardContent>
              <ImageUpload
                images={images}
                onAdd={handleImageAdd}
                onRemove={handleImageRemove}
                isUploading={isUploadingImage}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-base">Organization</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <Label>Tags</Label>
                <div className="space-y-2">
                  {tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="gap-1 pl-2 pr-1 py-0.5">
                          {tag}
                          <button type="button" onClick={() => setTags((p) => p.filter((t) => t !== tag))}>
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  )}
                  <Input
                    placeholder="Type a tag and press Enter..."
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={addTag}
                    className="h-9 text-sm"
                  />
                  <p className="text-[11px] text-muted-foreground">Press Enter or comma to add a tag. Max 10 tags.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-base">Status & Visibility</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <Label>Status</Label>
                <Controller
                  control={control}
                  name="status"
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="h-9 text-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="archived">Archived</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-base">Product Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="sku">SKU <span className="text-destructive">*</span></Label>
                <Input id="sku" placeholder="e.g. PROD-001" {...register("sku")} />
                {errors.sku && <p className="text-xs text-destructive">{errors.sku.message}</p>}
              </div>

              <div className="space-y-1.5">
                <Label>Category</Label>
                <Controller
                  control={control}
                  name="category_id"
                  render={({ field }) => (
                    <Select value={field.value ?? "none"} onValueChange={(v) => field.onChange(v === "none" ? null : v)}>
                      <SelectTrigger className="h-9 text-sm">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">No category</SelectItem>
                        {categories.map((c) => (
                          <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="weight">Weight (kg)</Label>
                <Input id="weight" type="number" step="0.001" min="0" placeholder="0.000" {...register("weight")} />
              </div>
            </CardContent>
          </Card>

          <div className="flex flex-col gap-2">
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {submitLabel}
            </Button>
            <Button type="button" variant="outline" className="w-full" onClick={onCancel} disabled={isSubmitting}>
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
}
