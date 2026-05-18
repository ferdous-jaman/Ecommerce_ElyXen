import { useRef, useState } from "react";
import { Upload, X, ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { validateImageFile } from "@/lib/uploadImage";

type ImageUploadProps = {
  images: string[];
  onAdd: (file: File) => Promise<void>;
  onRemove: (url: string) => void;
  isUploading?: boolean;
  maxImages?: number;
  className?: string;
};

export function ImageUpload({
  images,
  onAdd,
  onRemove,
  isUploading = false,
  maxImages = 5,
  className,
}: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFile(file: File) {
    setError(null);
    const validationError = validateImageFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }
    await onAdd(file);
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    e.target.value = "";
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  }

  const canAdd = images.length < maxImages && !isUploading;

  return (
    <div className={cn("space-y-3", className)}>
      {images.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
          {images.map((url, i) => (
            <div key={url} className="relative group aspect-square rounded-lg border bg-muted overflow-hidden">
              <img src={url} alt={`Product image ${i + 1}`} className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => onRemove(url)}
                className="absolute top-1 right-1 rounded-full bg-black/60 p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="h-3 w-3 text-white" />
              </button>
              {i === 0 && (
                <span className="absolute bottom-1 left-1 text-[9px] bg-primary text-primary-foreground px-1.5 py-0.5 rounded font-medium">
                  Main
                </span>
              )}
            </div>
          ))}
        </div>
      )}

      {canAdd && (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className={cn(
            "flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed p-6 cursor-pointer transition-colors",
            dragOver
              ? "border-primary bg-primary/5"
              : "border-muted-foreground/25 hover:border-muted-foreground/50 hover:bg-muted/50"
          )}
        >
          {isUploading ? (
            <div className="flex flex-col items-center gap-2">
              <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
              <p className="text-xs text-muted-foreground">Uploading...</p>
            </div>
          ) : (
            <>
              <div className="rounded-full bg-muted p-2.5">
                {images.length === 0 ? (
                  <ImageIcon className="h-5 w-5 text-muted-foreground" />
                ) : (
                  <Upload className="h-5 w-5 text-muted-foreground" />
                )}
              </div>
              <div className="text-center">
                <p className="text-xs font-medium text-foreground">
                  {images.length === 0 ? "Upload product images" : "Add more images"}
                </p>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  Drag & drop or click — PNG, JPG, WebP up to 5MB
                </p>
              </div>
            </>
          )}
        </div>
      )}

      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleChange} />

      {error && <p className="text-xs text-destructive">{error}</p>}

      {images.length > 0 && (
        <p className="text-[11px] text-muted-foreground">
          {images.length}/{maxImages} images · First image is the main product image
        </p>
      )}
    </div>
  );
}
