import { useState } from "react";
import { CreditCard, Smartphone, Building2, Trash2, Check, Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

type PaymentMethod = {
  id: string;
  type: "cod" | "bkash" | "nagad" | "rocket" | "card";
  label: string;
  detail: string;
  is_default: boolean;
};

const METHOD_ICONS: Record<string, React.ReactNode> = {
  cod:    <CreditCard className="h-5 w-5 text-emerald-500" />,
  bkash:  <Smartphone className="h-5 w-5 text-pink-500" />,
  nagad:  <Smartphone className="h-5 w-5 text-orange-500" />,
  rocket: <Smartphone className="h-5 w-5 text-purple-500" />,
  card:   <Building2 className="h-5 w-5 text-blue-500" />,
};

const METHOD_COLORS: Record<string, string> = {
  cod:    "bg-emerald-50 dark:bg-emerald-900/20",
  bkash:  "bg-pink-50 dark:bg-pink-900/20",
  nagad:  "bg-orange-50 dark:bg-orange-900/20",
  rocket: "bg-purple-50 dark:bg-purple-900/20",
  card:   "bg-blue-50 dark:bg-blue-900/20",
};

const AVAILABLE_METHODS = [
  { type: "cod" as const,    label: "Cash on Delivery", detail: "Pay when your order arrives" },
  { type: "bkash" as const,  label: "bKash",            detail: "Mobile financial service" },
  { type: "nagad" as const,  label: "Nagad",            detail: "Bangladesh Post Office MFS" },
  { type: "rocket" as const, label: "Rocket",           detail: "Dutch-Bangla Bank MFS" },
];

export function PaymentMethodsPage() {
  const [methods, setMethods] = useState<PaymentMethod[]>([
    { id: "default-cod", type: "cod", label: "Cash on Delivery", detail: "Pay when your order arrives", is_default: true },
  ]);
  const [addingType, setAddingType] = useState<string | null>(null);
  const [phoneInput, setPhoneInput] = useState("");

  function handleAddMethod(type: "cod" | "bkash" | "nagad" | "rocket" | "card", label: string, _detail: string) {
    if (methods.some((m) => m.type === type)) {
      toast.error(`${label} is already added`);
      return;
    }
    if (type !== "cod") { setAddingType(type); return; }
    const newMethod: PaymentMethod = { id: crypto.randomUUID(), type, label, detail: _detail, is_default: methods.length === 0 };
    setMethods((prev) => [...prev, newMethod]);
    toast.success(`${label} added!`);
  }

  function confirmAddMobileMethod(type: string, label: string, _detail: string) {
    if (!phoneInput.match(/^01[3-9]\d{8}$/)) { toast.error("Enter a valid Bangladesh phone number"); return; }
    const newMethod: PaymentMethod = {
      id: crypto.randomUUID(), type: type as PaymentMethod["type"],
      label, detail: `${phoneInput}`, is_default: methods.length === 0,
    };
    setMethods((prev) => [...prev, newMethod]);
    setAddingType(null);
    setPhoneInput("");
    toast.success(`${label} added!`);
  }

  function handleRemove(id: string) {
    setMethods((prev) => prev.filter((m) => m.id !== id));
    toast.success("Payment method removed");
  }

  function setDefault(id: string) {
    setMethods((prev) => prev.map((m) => ({ ...m, is_default: m.id === id })));
    toast.success("Default payment method updated!");
  }

  const activeTypes = new Set(methods.map((m) => m.type));

  return (
    <div className="mx-auto max-w-2xl px-4 sm:px-6 py-10 animate-fade-in space-y-6">
      <div>
        <h1 className="text-2xl font-black tracking-tight text-foreground">Payment Methods</h1>
        <p className="text-sm text-muted-foreground mt-1">Manage your saved payment options</p>
      </div>

      {/* Saved methods */}
      <div className="space-y-3">
        {methods.map((method) => (
          <Card key={method.id} className={`transition-colors ${method.is_default ? "border-primary/50" : ""}`}>
            <CardContent className="pt-4 pb-4">
              <div className="flex items-center gap-3">
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${METHOD_COLORS[method.type]}`}>
                  {METHOD_ICONS[method.type]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-semibold text-foreground text-sm">{method.label}</p>
                    {method.is_default && (
                      <Badge variant="secondary" className="text-xs gap-1"><Star className="h-3 w-3 fill-current text-amber-500" />Default</Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">{method.detail}</p>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  {!method.is_default && (
                    <button onClick={() => setDefault(method.id)}
                      className="flex h-8 items-center justify-center rounded-lg px-2 text-xs text-primary hover:bg-primary/10 transition-colors gap-1">
                      <Check className="h-3 w-3" /> Set Default
                    </button>
                  )}
                  {method.type !== "cod" && (
                    <button onClick={() => handleRemove(method.id)}
                      className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-destructive/10 transition-colors text-muted-foreground hover:text-destructive">
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Mobile number input for MFS */}
      {addingType && (
        <Card>
          <CardContent className="pt-6 space-y-4">
            <p className="font-semibold text-foreground">Enter {addingType.charAt(0).toUpperCase() + addingType.slice(1)} Number</p>
            <div className="space-y-1.5">
              <input
                value={phoneInput}
                onChange={(e) => setPhoneInput(e.target.value)}
                placeholder="01XXXXXXXXX"
                className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div className="flex gap-3">
              <Button size="sm" onClick={() => {
                const method = AVAILABLE_METHODS.find((m) => m.type === addingType);
                if (method) confirmAddMobileMethod(method.type, method.label, method.detail);
              }}>
                Add Account
              </Button>
              <Button size="sm" variant="outline" onClick={() => { setAddingType(null); setPhoneInput(""); }}>Cancel</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Add new methods */}
      <div>
        <p className="text-sm font-bold text-foreground mb-3">Add Payment Method</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {AVAILABLE_METHODS.map(({ type, label, detail }) => (
            <button
              key={type}
              disabled={activeTypes.has(type)}
              onClick={() => handleAddMethod(type, label, detail)}
              className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all text-center ${
                activeTypes.has(type)
                  ? "border-border bg-muted/50 opacity-50 cursor-not-allowed"
                  : "border-border hover:border-primary/50 hover:bg-primary/5 cursor-pointer"
              }`}
            >
              <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${METHOD_COLORS[type]}`}>
                {METHOD_ICONS[type]}
              </div>
              <div>
                <p className="text-xs font-bold text-foreground">{label}</p>
                {activeTypes.has(type) && <p className="text-[10px] text-emerald-500 font-medium">Added ✓</p>}
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-xl bg-muted/50 border border-border p-4 text-xs text-muted-foreground">
        <p className="font-semibold text-foreground mb-1">Security Notice</p>
        We never store full card details. All payment information is handled securely. bKash/Nagad/Rocket payments are verified via OTP during checkout.
      </div>
    </div>
  );
}
