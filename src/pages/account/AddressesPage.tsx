import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { MapPin, Plus, Trash2, Check, Edit2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

const addrSchema = z.object({
  label: z.string().min(1, "Label required"),
  full_name: z.string().min(2, "Name required"),
  phone: z.string().min(10, "Phone required"),
  address_line1: z.string().min(5, "Address required"),
  city: z.string().min(2, "City required"),
  district: z.string().min(2, "District required"),
});
type AddrForm = z.infer<typeof addrSchema>;

type Address = AddrForm & { id: string; is_default: boolean };

export function AddressesPage() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<AddrForm>({
    resolver: zodResolver(addrSchema),
    defaultValues: { label: "Home", full_name: "", phone: "", address_line1: "", city: "", district: "" },
  });

  function onSubmit(data: AddrForm) {
    if (editId) {
      setAddresses((prev) => prev.map((a) => a.id === editId ? { ...a, ...data } : a));
      toast.success("Address updated!");
      setEditId(null);
    } else {
      const newAddr: Address = { ...data, id: crypto.randomUUID(), is_default: addresses.length === 0 };
      setAddresses((prev) => [...prev, newAddr]);
      toast.success("Address added!");
    }
    reset();
    setShowForm(false);
  }

  function handleEdit(addr: Address) {
    setEditId(addr.id);
    setValue("label", addr.label);
    setValue("full_name", addr.full_name);
    setValue("phone", addr.phone);
    setValue("address_line1", addr.address_line1);
    setValue("city", addr.city);
    setValue("district", addr.district);
    setShowForm(true);
  }

  function handleDelete(id: string) {
    setAddresses((prev) => prev.filter((a) => a.id !== id));
    toast.success("Address removed");
  }

  function setDefault(id: string) {
    setAddresses((prev) => prev.map((a) => ({ ...a, is_default: a.id === id })));
    toast.success("Default address updated!");
  }

  return (
    <div className="mx-auto max-w-2xl px-4 sm:px-6 py-10 animate-fade-in space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-foreground">Saved Addresses</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage your delivery addresses</p>
        </div>
        {!showForm && (
          <Button size="sm" className="gap-2" onClick={() => { setEditId(null); reset(); setShowForm(true); }}>
            <Plus className="h-4 w-4" /> Add Address
          </Button>
        )}
      </div>

      {/* Form */}
      {showForm && (
        <Card>
          <CardContent className="pt-6">
            <p className="font-bold text-foreground mb-4">{editId ? "Edit Address" : "New Address"}</p>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label>Label (Home / Work etc.)</Label>
                  <Input placeholder="Home" {...register("label")} />
                  {errors.label && <p className="text-xs text-destructive">{errors.label.message}</p>}
                </div>
                <div className="space-y-1.5">
                  <Label>Full Name *</Label>
                  <Input placeholder="Recipient name" {...register("full_name")} />
                  {errors.full_name && <p className="text-xs text-destructive">{errors.full_name.message}</p>}
                </div>
              </div>
              <div className="space-y-1.5">
                <Label>Phone *</Label>
                <Input placeholder="01XXXXXXXXX" {...register("phone")} />
                {errors.phone && <p className="text-xs text-destructive">{errors.phone.message}</p>}
              </div>
              <div className="space-y-1.5">
                <Label>Address *</Label>
                <Input placeholder="House/Road/Area" {...register("address_line1")} />
                {errors.address_line1 && <p className="text-xs text-destructive">{errors.address_line1.message}</p>}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label>City *</Label>
                  <Input placeholder="Dhaka" {...register("city")} />
                  {errors.city && <p className="text-xs text-destructive">{errors.city.message}</p>}
                </div>
                <div className="space-y-1.5">
                  <Label>District *</Label>
                  <Input placeholder="Dhaka" {...register("district")} />
                  {errors.district && <p className="text-xs text-destructive">{errors.district.message}</p>}
                </div>
              </div>
              <div className="flex gap-3">
                <Button type="submit" className="gap-2">{editId ? "Update" : "Save Address"}</Button>
                <Button type="button" variant="outline" onClick={() => { setShowForm(false); setEditId(null); reset(); }}>Cancel</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Address List */}
      {addresses.length === 0 && !showForm ? (
        <div className="flex flex-col items-center justify-center py-16 gap-4 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-muted">
            <MapPin className="h-7 w-7 text-muted-foreground" />
          </div>
          <p className="font-semibold text-foreground">No saved addresses</p>
          <p className="text-sm text-muted-foreground">Add an address to speed up checkout.</p>
          <Button size="sm" className="gap-2 mt-1" onClick={() => setShowForm(true)}>
            <Plus className="h-4 w-4" /> Add Address
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {addresses.map((addr) => (
            <Card key={addr.id} className={`transition-colors ${addr.is_default ? "border-primary/50 bg-primary/[0.02]" : ""}`}>
              <CardContent className="pt-4 pb-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 min-w-0">
                    <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${addr.is_default ? "bg-primary/10" : "bg-muted"}`}>
                      <MapPin className={`h-4 w-4 ${addr.is_default ? "text-primary" : "text-muted-foreground"}`} />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-semibold text-foreground text-sm">{addr.label}</p>
                        {addr.is_default && <Badge variant="secondary" className="text-xs gap-1"><Check className="h-3 w-3" />Default</Badge>}
                      </div>
                      <p className="text-sm text-muted-foreground mt-0.5">{addr.full_name} · {addr.phone}</p>
                      <p className="text-sm text-muted-foreground">{addr.address_line1}, {addr.city}, {addr.district}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    {!addr.is_default && (
                      <button onClick={() => setDefault(addr.id)}
                        className="text-xs text-primary hover:underline px-2 py-1">
                        Set Default
                      </button>
                    )}
                    <button onClick={() => handleEdit(addr)}
                      className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground">
                      <Edit2 className="h-3.5 w-3.5" />
                    </button>
                    <button onClick={() => handleDelete(addr.id)}
                      className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-destructive/10 transition-colors text-muted-foreground hover:text-destructive">
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
