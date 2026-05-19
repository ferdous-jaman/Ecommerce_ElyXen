import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, GripVertical, Eye, EyeOff, ImageIcon, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";

type Banner = {
  id: string;
  title: string;
  subtitle: string | null;
  image_url: string;
  link_url: string | null;
  button_text: string | null;
  order_index: number;
  is_active: boolean;
  created_at: string;
};

type BannerFormData = Omit<Banner, "id" | "created_at">;

const EMPTY_FORM: BannerFormData = {
  title: "",
  subtitle: "",
  image_url: "",
  link_url: "/shop",
  button_text: "Shop Now",
  order_index: 0,
  is_active: true,
};

export function BannerManagerPage() {
  const { user } = useAuth();
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<BannerFormData>(EMPTY_FORM);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  async function fetchBanners() {
    setLoading(true);
    const { data, error } = await supabase
      .from("banners")
      .select("*")
      .order("order_index");
    if (error) toast.error("Failed to load banners");
    else setBanners(data ?? []);
    setLoading(false);
  }

  useEffect(() => { fetchBanners(); }, []);

  function openCreate() {
    setEditingId(null);
    setForm({ ...EMPTY_FORM, order_index: banners.length + 1 });
    setShowForm(true);
  }

  function openEdit(banner: Banner) {
    setEditingId(banner.id);
    setForm({
      title: banner.title,
      subtitle: banner.subtitle ?? "",
      image_url: banner.image_url,
      link_url: banner.link_url ?? "/shop",
      button_text: banner.button_text ?? "Shop Now",
      order_index: banner.order_index,
      is_active: banner.is_active,
    });
    setShowForm(true);
  }

  function cancelForm() {
    setShowForm(false);
    setEditingId(null);
    setForm(EMPTY_FORM);
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { toast.error("Image must be under 5MB"); return; }

    setUploading(true);
    const ext = file.name.split(".").pop();
    const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const { error } = await supabase.storage.from("banners").upload(path, file);
    if (error) { toast.error("Upload failed: " + error.message); setUploading(false); return; }

    const { data } = supabase.storage.from("banners").getPublicUrl(path);
    setForm((f) => ({ ...f, image_url: data.publicUrl }));
    toast.success("Image uploaded!");
    setUploading(false);
  }

  async function handleSave() {
    if (!form.title.trim()) { toast.error("Title is required"); return; }
    if (!form.image_url.trim()) { toast.error("Image is required"); return; }

    setSaving(true);
    if (editingId) {
      const { error } = await supabase
        .from("banners")
        .update({ ...form, updated_at: new Date().toISOString() })
        .eq("id", editingId);
      if (error) { toast.error("Failed to update banner"); setSaving(false); return; }
      toast.success("Banner updated!");
    } else {
      const { error } = await supabase
        .from("banners")
        .insert({ ...form, created_by: user?.id });
      if (error) { toast.error("Failed to create banner"); setSaving(false); return; }
      toast.success("Banner created!");
    }
    setSaving(false);
    cancelForm();
    fetchBanners();
  }

  async function handleDelete() {
    if (!deleteId) return;
    const { error } = await supabase.from("banners").delete().eq("id", deleteId);
    if (error) toast.error("Failed to delete banner");
    else { toast.success("Banner deleted"); fetchBanners(); }
    setDeleteId(null);
  }

  async function toggleActive(banner: Banner) {
    const { error } = await supabase
      .from("banners")
      .update({ is_active: !banner.is_active })
      .eq("id", banner.id);
    if (error) toast.error("Failed to update");
    else fetchBanners();
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Banner Manager"
        description="Manage homepage carousel slides. Active banners appear on the public storefront."
        actions={
          !showForm && (
            <Button onClick={openCreate} className="gap-2">
              <Plus className="h-4 w-4" />
              Add Banner
            </Button>
          )
        }
      />

      {/* Form */}
      {showForm && (
        <Card className="border-primary/30">
          <CardContent className="pt-6 space-y-4">
            <h3 className="font-semibold text-foreground">
              {editingId ? "Edit Banner" : "New Banner"}
            </h3>
            <Separator />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Title */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-foreground">Title *</label>
                <Input
                  placeholder="e.g. Mega Sale — Up to 70% Off"
                  value={form.title}
                  onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                />
              </div>

              {/* Subtitle */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-foreground">Subtitle</label>
                <Input
                  placeholder="Short description shown below title"
                  value={form.subtitle ?? ""}
                  onChange={(e) => setForm((f) => ({ ...f, subtitle: e.target.value }))}
                />
              </div>

              {/* Link URL */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-foreground">Link URL</label>
                <Input
                  placeholder="/shop or /shop?category=electronics"
                  value={form.link_url ?? ""}
                  onChange={(e) => setForm((f) => ({ ...f, link_url: e.target.value }))}
                />
              </div>

              {/* Button Text */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-foreground">Button Text</label>
                <Input
                  placeholder="Shop Now"
                  value={form.button_text ?? ""}
                  onChange={(e) => setForm((f) => ({ ...f, button_text: e.target.value }))}
                />
              </div>

              {/* Order */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-foreground">Display Order</label>
                <Input
                  type="number"
                  min={1}
                  value={form.order_index}
                  onChange={(e) => setForm((f) => ({ ...f, order_index: parseInt(e.target.value) || 1 }))}
                />
              </div>

              {/* Active toggle */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-foreground">Status</label>
                <div className="flex items-center gap-3 h-10">
                  <button
                    type="button"
                    onClick={() => setForm((f) => ({ ...f, is_active: !f.is_active }))}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${form.is_active ? "bg-primary" : "bg-muted-foreground/30"}`}
                  >
                    <span className={`inline-block h-4 w-4 rounded-full bg-white shadow transform transition-transform ${form.is_active ? "translate-x-6" : "translate-x-1"}`} />
                  </button>
                  <span className="text-sm text-muted-foreground">{form.is_active ? "Active (visible on site)" : "Hidden"}</span>
                </div>
              </div>
            </div>

            {/* Image Upload */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-foreground">Banner Image *</label>
              <div className="flex flex-col sm:flex-row gap-3">
                <Input
                  placeholder="https://... (paste URL or upload below)"
                  value={form.image_url}
                  onChange={(e) => setForm((f) => ({ ...f, image_url: e.target.value }))}
                  className="flex-1"
                />
                <label className="cursor-pointer">
                  <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                  <div className="flex h-10 items-center gap-2 rounded-md border border-border bg-muted px-3 text-sm font-medium text-foreground hover:bg-accent transition-colors whitespace-nowrap">
                    <ImageIcon className="h-4 w-4" />
                    {uploading ? "Uploading..." : "Upload Image"}
                  </div>
                </label>
              </div>
              <p className="text-xs text-muted-foreground">Recommended: 1400×560px, max 5MB. JPG or PNG.</p>
            </div>

            {/* Preview */}
            {form.image_url && (
              <div className="rounded-xl overflow-hidden border border-border bg-muted" style={{ height: 160 }}>
                <img src={form.image_url} alt="Preview" className="h-full w-full object-cover" />
              </div>
            )}

            <div className="flex items-center gap-2 pt-2">
              <Button onClick={handleSave} disabled={saving} className="gap-2">
                {saving ? "Saving..." : editingId ? "Update Banner" : "Create Banner"}
              </Button>
              <Button variant="outline" onClick={cancelForm}>Cancel</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Banner List */}
      {loading ? (
        <div className="grid gap-3">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="pt-4 pb-4">
                <div className="flex gap-4">
                  <div className="h-20 w-32 rounded-lg bg-muted" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-48 rounded bg-muted" />
                    <div className="h-3 w-64 rounded bg-muted" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : banners.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 gap-3">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-muted">
              <ImageIcon className="h-7 w-7 text-muted-foreground" />
            </div>
            <p className="font-semibold text-foreground">No banners yet</p>
            <p className="text-sm text-muted-foreground">Create your first carousel banner to display on the homepage.</p>
            <Button onClick={openCreate} className="gap-2 mt-2">
              <Plus className="h-4 w-4" />
              Add First Banner
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {banners.map((banner) => (
            <Card key={banner.id} className={`transition-opacity ${banner.is_active ? "" : "opacity-60"}`}>
              <CardContent className="pt-4 pb-4">
                <div className="flex items-center gap-4">
                  <GripVertical className="h-4 w-4 text-muted-foreground/40 shrink-0 cursor-grab" />

                  {/* Thumbnail */}
                  <div className="h-20 w-32 shrink-0 overflow-hidden rounded-lg bg-muted border border-border">
                    <img src={banner.image_url} alt={banner.title} className="h-full w-full object-cover" />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-semibold text-foreground text-sm truncate">{banner.title}</p>
                      <Badge variant={banner.is_active ? "default" : "secondary"} className="text-xs">
                        {banner.is_active ? "Active" : "Hidden"}
                      </Badge>
                      <Badge variant="outline" className="text-xs">#{banner.order_index}</Badge>
                    </div>
                    {banner.subtitle && (
                      <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{banner.subtitle}</p>
                    )}
                    <div className="flex items-center gap-3 mt-1.5 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <ExternalLink className="h-3 w-3" />
                        {banner.link_url ?? "/shop"}
                      </span>
                      <span>Button: "{banner.button_text ?? "Shop Now"}"</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      title={banner.is_active ? "Hide banner" : "Show banner"}
                      onClick={() => toggleActive(banner)}
                    >
                      {banner.is_active
                        ? <Eye className="h-4 w-4 text-primary" />
                        : <EyeOff className="h-4 w-4 text-muted-foreground" />}
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(banner)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                      onClick={() => setDeleteId(banner.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(open) => { if (!open) setDeleteId(null); }}
        title="Delete Banner"
        description="This banner will be permanently removed from the carousel. This action cannot be undone."
        confirmLabel="Delete"
        variant="destructive"
        onConfirm={handleDelete}
      />
    </div>
  );
}
