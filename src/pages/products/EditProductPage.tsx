import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ProductForm, type ProductFormData } from "@/components/products/ProductForm";
import { productService } from "@/services/productService";
import { uploadProductImage, deleteProductImage } from "@/lib/uploadImage";
import { useProducts } from "@/hooks/useProducts";
import { LoadingScreen } from "@/components/shared/LoadingScreen";
import type { Product } from "@/types/database";

export function EditProductPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { categories, upsertProduct } = useProducts();
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  useEffect(() => {
    if (!id) return;
    productService.getById(id).then((res) => {
      if (res.data) setProduct(res.data);
      else toast.error("Product not found");
      setIsLoading(false);
    });
  }, [id]);

  async function handleImageAdd(file: File): Promise<string | null> {
    if (!id) return null;
    setIsUploadingImage(true);
    const { url, error } = await uploadProductImage(file, id);
    setIsUploadingImage(false);
    if (error) { toast.error("Upload failed", { description: error }); return null; }
    return url;
  }

  async function handleImageRemove(url: string) {
    await deleteProductImage(url);
  }

  async function handleSubmit(data: ProductFormData, images: string[], tags: string[]) {
    if (!id) return;
    setIsSubmitting(true);

    const result = await productService.update(id, {
      ...data,
      images,
      tags,
      description: data.description ?? null,
      compare_price: data.compare_price ?? null,
      cost_price: data.cost_price ?? null,
      weight: data.weight ?? null,
      category_id: data.category_id ?? null,
    });

    setIsSubmitting(false);

    if (result.error) {
      toast.error("Update failed", { description: result.error });
      return;
    }

    upsertProduct(result.data!);
    toast.success("Product updated");
    navigate(`/dashboard/products/${id}`);
  }

  if (isLoading) return <LoadingScreen />;
  if (!product) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => navigate(`/dashboard/products/${id}`)}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-lg font-semibold tracking-tight">Edit Product</h1>
          <p className="text-sm text-muted-foreground truncate max-w-xs">{product.name}</p>
        </div>
      </div>

      <ProductForm
        defaultValues={{ ...product, description: product.description ?? undefined }}
        categories={categories}
        isSubmitting={isSubmitting}
        submitLabel="Save Changes"
        onSubmit={handleSubmit}
        onCancel={() => navigate(`/dashboard/products/${id}`)}
        onImageAdd={handleImageAdd}
        onImageRemove={handleImageRemove}
        isUploadingImage={isUploadingImage}
      />
    </div>
  );
}
