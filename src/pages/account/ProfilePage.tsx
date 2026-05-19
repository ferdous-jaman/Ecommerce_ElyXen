import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { User, Mail, Phone, MapPin, Save, KeyRound } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { getInitials } from "@/lib/utils";

const profileSchema = z.object({
  full_name: z.string().min(2, "Name is required"),
  phone: z.string().optional(),
  address: z.string().optional(),
});
type ProfileForm = z.infer<typeof profileSchema>;

const passwordSchema = z.object({
  newPassword: z.string().min(8, "Minimum 8 characters"),
  confirmPassword: z.string(),
}).refine((d) => d.newPassword === d.confirmPassword, { message: "Passwords don't match", path: ["confirmPassword"] });
type PasswordForm = z.infer<typeof passwordSchema>;

export function ProfilePage() {
  const { user, profile, refreshProfile } = useAuth();
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  const displayName = profile?.full_name ?? profile?.email?.split("@")[0] ?? "User";

  const { register, handleSubmit, formState: { errors } } = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      full_name: profile?.full_name ?? "",
      phone: (profile as Record<string, unknown>)?.phone as string ?? "",
      address: (profile as Record<string, unknown>)?.address as string ?? "",
    },
  });

  const { register: regPw, handleSubmit: handlePw, formState: { errors: pwErrors }, reset: resetPw } =
    useForm<PasswordForm>({ resolver: zodResolver(passwordSchema) });

  async function onSaveProfile(data: ProfileForm) {
    if (!user) return;
    setSavingProfile(true);
    const { error } = await supabase
      .from("profiles")
      .update({ full_name: data.full_name })
      .eq("id", user.id);
    if (error) toast.error("Failed to update profile");
    else { toast.success("Profile updated!"); refreshProfile(); }
    setSavingProfile(false);
  }

  async function onChangePassword(data: PasswordForm) {
    setSavingPassword(true);
    const { error } = await supabase.auth.updateUser({ password: data.newPassword });
    if (error) toast.error("Failed to update password", { description: error.message });
    else { toast.success("Password changed!"); resetPw(); }
    setSavingPassword(false);
  }

  return (
    <div className="mx-auto max-w-2xl px-4 sm:px-6 py-10 animate-fade-in space-y-8">
      <div>
        <h1 className="text-2xl font-black tracking-tight text-foreground">My Profile</h1>
        <p className="text-sm text-muted-foreground mt-1">Manage your account information</p>
      </div>

      {/* Avatar block */}
      <Card>
        <CardContent className="pt-6 flex items-center gap-5">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground font-black text-xl shrink-0">
            {getInitials(displayName)}
          </div>
          <div>
            <p className="font-bold text-foreground text-lg">{displayName}</p>
            <p className="text-sm text-muted-foreground">{profile?.email}</p>
            <span className="inline-block mt-1.5 text-xs font-semibold px-2 py-0.5 rounded-full bg-primary/10 text-primary capitalize">
              {profile?.role ?? "customer"}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Profile info */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-base flex items-center gap-2">
            <User className="h-4 w-4 text-primary" /> Personal Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSaveProfile)} className="space-y-4">
            <div className="space-y-1.5">
              <Label className="flex items-center gap-1.5"><User className="h-3.5 w-3.5" /> Full Name</Label>
              <Input placeholder="Your full name" {...register("full_name")} />
              {errors.full_name && <p className="text-xs text-destructive">{errors.full_name.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label className="flex items-center gap-1.5"><Mail className="h-3.5 w-3.5" /> Email</Label>
              <Input value={profile?.email ?? ""} disabled className="bg-muted" />
              <p className="text-xs text-muted-foreground">Email cannot be changed</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="flex items-center gap-1.5"><Phone className="h-3.5 w-3.5" /> Phone</Label>
                <Input placeholder="01XXXXXXXXX" {...register("phone")} />
              </div>
              <div className="space-y-1.5">
                <Label className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" /> Address</Label>
                <Input placeholder="Your address" {...register("address")} />
              </div>
            </div>
            <Button type="submit" className="gap-2" disabled={savingProfile}>
              <Save className="h-4 w-4" /> {savingProfile ? "Saving..." : "Save Changes"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Change password */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-base flex items-center gap-2">
            <KeyRound className="h-4 w-4 text-primary" /> Change Password
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlePw(onChangePassword)} className="space-y-4">
            <div className="space-y-1.5">
              <Label>New Password</Label>
              <Input type="password" placeholder="Minimum 8 characters" {...regPw("newPassword")} />
              {pwErrors.newPassword && <p className="text-xs text-destructive">{pwErrors.newPassword.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label>Confirm Password</Label>
              <Input type="password" placeholder="Repeat new password" {...regPw("confirmPassword")} />
              {pwErrors.confirmPassword && <p className="text-xs text-destructive">{pwErrors.confirmPassword.message}</p>}
            </div>
            <Separator />
            <Button type="submit" variant="outline" className="gap-2" disabled={savingPassword}>
              <KeyRound className="h-4 w-4" /> {savingPassword ? "Updating..." : "Update Password"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
