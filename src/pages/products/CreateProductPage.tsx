import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ProductForm, type ProductFormData } from "@/components/products/ProductForm";
import { productService } from "@/services/productService";
import { uploadProductImage, deleteProductImage } from "@/lib/uploadImage";
import { useProducts } from "@/hooks/useProducts";
import { useAuth } from "@/contexts/AuthContext";

export function CreateProductPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { categories, upsertProduct } = useProducts();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [tempProductId] = useState(() => crypto.randomUUID());

  async function handleImageAdd(file: File): Promise<string | null> {
    setIsUploadingImage(true);
    const { url, error } = await uploadProductImage(file, tempProductId);
    setIsUploadingImage(false);
    if (error) {
      toast.error("Image upload failed", { description: error });
      return null;
    }
    return url;
  }

  async function handleImageRemove(url: string) {
    await deleteProductImage(url);
  }

  async function handleSubmit(data: ProductFormData, images: string[], tags: string[]) {
    if (!user) return;
    setIsSubmitting(true);

    const slug = data.name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_]+/g, "-")
      .concat(`-${Date.now()}`);

    const result = await productService.create({
      ...data,
      id: tempProductId,
      slug,
      images,
      tags,
      description: data.description ?? null,
      compare_price: data.compare_price ?? null,
      cost_price: data.cost_price ?? null,
      weight: data.weight ?? null,
      category_id: data.category_id ?? null,
      created_by: user.id,
    });

    setIsSubmitting(false);

    if (result.error) {
      toast.error("Failed to create product", { description: result.error });
      return;
    }

    upsertProduct(result.data!);
    toast.success("Product created", { description: `"${data.name}" has been added.` });
    navigate(`/products/${result.data!.id}`);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => navigate("/products")}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-lg font-semibold tracking-tight">Add Product</h1>
          <p className="text-sm text-muted-foreground">Create a new product in your catalog</p>
        </div>
      </div>

      <ProductForm
        categories={categories}
        isSubmitting={isSubmitting}
        submitLabel="Create Product"
        onSubmit={handleSubmit}
        onCancel={() => navigate("/products")}
        onImageAdd={handleImageAdd}
        onImageRemove={handleImageRemove}
        isUploadingImage={isUploadingImage}
      />
    </div>
  );
}
