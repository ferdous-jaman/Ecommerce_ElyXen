import { supabase } from "@/lib/supabase";

const BUCKET = "product-images";

export type UploadResult = {
  url: string | null;
  error: string | null;
};

export async function uploadProductImage(file: File, productId: string): Promise<UploadResult> {
  const ext = file.name.split(".").pop();
  const fileName = `${productId}/${Date.now()}.${ext}`;

  const { error } = await supabase.storage.from(BUCKET).upload(fileName, file, {
    cacheControl: "3600",
    upsert: false,
  });

  if (error) return { url: null, error: error.message };

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(fileName);
  return { url: data.publicUrl, error: null };
}

export async function deleteProductImage(url: string): Promise<void> {
  const path = url.split(`/${BUCKET}/`)[1];
  if (!path) return;
  await supabase.storage.from(BUCKET).remove([path]);
}

export function validateImageFile(file: File): string | null {
  const validTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
  if (!validTypes.includes(file.type)) {
    return "Only JPEG, PNG, WebP, or GIF images are allowed.";
  }
  if (file.size > 5 * 1024 * 1024) {
    return "Image must be smaller than 5MB.";
  }
  return null;
}
