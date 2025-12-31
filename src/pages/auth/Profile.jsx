import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { User, Lock, Save, Eye, EyeOff, CheckCircle } from "lucide-react";
import { useAuthStore } from "../../store/authStore";
import { ButtonLoading } from "../../components/shared/LoadingSpinner";

const profileSchema = z.object({
  name: z.string().min(2, "Nama minimal 2 karakter"),
  phone: z.string().min(10, "Nomor telepon minimal 10 digit"),
  address: z.string().min(10, "Alamat minimal 10 karakter"),
});

const passwordSchema = z
  .object({
    current_password: z.string().min(1, "Password saat ini wajib diisi"),
    password: z.string().min(6, "Password baru minimal 6 karakter"),
    password_confirmation: z.string().min(1, "Konfirmasi password wajib diisi"),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "Konfirmasi password tidak cocok",
    path: ["password_confirmation"],
  });

export default function Profile() {
  const { user, updateProfile, changePassword, isLoading } = useAuthStore();
  const [activeTab, setActiveTab] = useState("profile");
  const [showPasswords, setShowPasswords] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState("");
  const [profileError, setProfileError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [passwordError, setPasswordError] = useState("");

  // Profile Form
  const {
    register: registerProfile,
    handleSubmit: handleProfileSubmit,
    formState: { errors: profileErrors },
  } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || "",
      phone: user?.phone || "",
      address: user?.address || "",
    },
  });

  // Password Form
  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    reset: resetPassword,
    formState: { errors: passwordErrors },
  } = useForm({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      current_password: "",
      password: "",
      password_confirmation: "",
    },
  });

  const onProfileSubmit = async (data) => {
    setProfileSuccess("");
    setProfileError("");
    try {
      await updateProfile(data);
      setProfileSuccess("Profil berhasil diperbarui");
    } catch (err) {
      setProfileError(err.response?.data?.message || "Gagal memperbarui profil");
    }
  };

  const onPasswordSubmit = async (data) => {
    setPasswordSuccess("");
    setPasswordError("");
    try {
      await changePassword(data);
      setPasswordSuccess("Password berhasil diubah");
      resetPassword();
    } catch (err) {
      if (err.response?.status === 400) {
        setPasswordError("Password saat ini salah");
      } else {
        setPasswordError(err.response?.data?.message || "Gagal mengubah password");
      }
    }
  };

  return (
    <div className="container mx-auto max-w-2xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold">Profil Saya</h1>

      {/* Tabs */}
      <div className="mb-6 flex border-b">
        <button
          onClick={() => setActiveTab("profile")}
          className={`flex items-center gap-2 border-b-2 px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === "profile"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <User className="h-4 w-4" />
          Profil
        </button>
        <button
          onClick={() => setActiveTab("password")}
          className={`flex items-center gap-2 border-b-2 px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === "password"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <Lock className="h-4 w-4" />
          Ubah Password
        </button>
      </div>

      {/* Profile Tab */}
      {activeTab === "profile" && (
        <div className="rounded-lg border bg-card p-6">
          <h2 className="mb-4 text-lg font-semibold">Informasi Profil</h2>

          <form onSubmit={handleProfileSubmit(onProfileSubmit)} className="space-y-4">
            {profileSuccess && (
              <div className="flex items-center gap-2 rounded-md bg-green-500/10 p-3 text-sm text-green-600">
                <CheckCircle className="h-4 w-4" />
                {profileSuccess}
              </div>
            )}

            {profileError && (
              <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                {profileError}
              </div>
            )}

            {/* Email (readonly) */}
            <div>
              <label className="block text-sm font-medium">Email</label>
              <input
                type="email"
                value={user?.email || ""}
                disabled
                className="mt-1 block w-full rounded-md border border-input bg-muted px-3 py-2 text-sm text-muted-foreground"
              />
              <p className="mt-1 text-xs text-muted-foreground">Email tidak dapat diubah</p>
            </div>

            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium">
                Nama Lengkap
              </label>
              <input
                {...registerProfile("name")}
                type="text"
                id="name"
                className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
              {profileErrors.name && (
                <p className="mt-1 text-sm text-destructive">{profileErrors.name.message}</p>
              )}
            </div>

            {/* Phone */}
            <div>
              <label htmlFor="phone" className="block text-sm font-medium">
                Nomor Telepon
              </label>
              <input
                {...registerProfile("phone")}
                type="tel"
                id="phone"
                className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
              {profileErrors.phone && (
                <p className="mt-1 text-sm text-destructive">{profileErrors.phone.message}</p>
              )}
            </div>

            {/* Address */}
            <div>
              <label htmlFor="address" className="block text-sm font-medium">
                Alamat
              </label>
              <textarea
                {...registerProfile("address")}
                id="address"
                rows={3}
                className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
              {profileErrors.address && (
                <p className="mt-1 text-sm text-destructive">{profileErrors.address.message}</p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
            >
              {isLoading ? (
                <ButtonLoading />
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Simpan Perubahan
                </>
              )}
            </button>
          </form>
        </div>
      )}

      {/* Password Tab */}
      {activeTab === "password" && (
        <div className="rounded-lg border bg-card p-6">
          <h2 className="mb-4 text-lg font-semibold">Ubah Password</h2>

          <form onSubmit={handlePasswordSubmit(onPasswordSubmit)} className="space-y-4">
            {passwordSuccess && (
              <div className="flex items-center gap-2 rounded-md bg-green-500/10 p-3 text-sm text-green-600">
                <CheckCircle className="h-4 w-4" />
                {passwordSuccess}
              </div>
            )}

            {passwordError && (
              <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                {passwordError}
              </div>
            )}

            {/* Current Password */}
            <div>
              <label htmlFor="current_password" className="block text-sm font-medium">
                Password Saat Ini
              </label>
              <div className="relative mt-1">
                <input
                  {...registerPassword("current_password")}
                  type={showPasswords ? "text" : "password"}
                  id="current_password"
                  className="block w-full rounded-md border border-input bg-background px-3 py-2 pr-10 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground hover:text-foreground"
                  onClick={() => setShowPasswords(!showPasswords)}
                >
                  {showPasswords ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {passwordErrors.current_password && (
                <p className="mt-1 text-sm text-destructive">
                  {passwordErrors.current_password.message}
                </p>
              )}
            </div>

            {/* New Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium">
                Password Baru
              </label>
              <input
                {...registerPassword("password")}
                type={showPasswords ? "text" : "password"}
                id="password"
                className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
              {passwordErrors.password && (
                <p className="mt-1 text-sm text-destructive">{passwordErrors.password.message}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="password_confirmation" className="block text-sm font-medium">
                Konfirmasi Password Baru
              </label>
              <input
                {...registerPassword("password_confirmation")}
                type={showPasswords ? "text" : "password"}
                id="password_confirmation"
                className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
              {passwordErrors.password_confirmation && (
                <p className="mt-1 text-sm text-destructive">
                  {passwordErrors.password_confirmation.message}
                </p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
            >
              {isLoading ? (
                <ButtonLoading />
              ) : (
                <>
                  <Lock className="h-4 w-4" />
                  Ubah Password
                </>
              )}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
