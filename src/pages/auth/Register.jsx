import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Eye, EyeOff, UserPlus, Package } from "lucide-react";
import { useAuthStore } from "../../store/authStore";
import { ButtonLoading } from "../../components/shared/LoadingSpinner";

const registerSchema = z
  .object({
    name: z.string().min(2, "Nama minimal 2 karakter"),
    email: z.string().email("Email tidak valid"),
    password: z.string().min(6, "Password minimal 6 karakter"),
    password_confirmation: z.string().min(1, "Konfirmasi password wajib diisi"),
    phone: z.string().min(10, "Nomor telepon minimal 10 digit"),
    address: z.string().min(10, "Alamat minimal 10 karakter"),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "Konfirmasi password tidak cocok",
    path: ["password_confirmation"],
  });

export default function Register() {
  const navigate = useNavigate();
  const { register: registerUser, isLoading } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    setError: setFormError,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      password_confirmation: "",
      phone: "",
      address: "",
    },
  });

  const onSubmit = async (data) => {
    setError("");
    try {
      const result = await registerUser(data);
      if (result.success) {
        navigate("/");
      }
    } catch (err) {
      if (err.response?.status === 422) {
        // Validation errors from API
        const apiErrors = err.response.data.errors;
        Object.keys(apiErrors).forEach((key) => {
          setFormError(key, { message: apiErrors[key][0] });
        });
      } else {
        setError(err.response?.data?.message || "Terjadi kesalahan. Silakan coba lagi.");
      }
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-md space-y-8">
        {/* Logo */}
        <div className="text-center">
          <Link to="/" className="inline-flex items-center space-x-2">
            <Package className="h-10 w-10 text-primary" />
            <span className="text-2xl font-bold">Kondang Thrift</span>
          </Link>
          <h2 className="mt-6 text-2xl font-bold">Buat akun baru</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Sudah punya akun?{" "}
            <Link to="/login" className="font-medium text-primary hover:underline">
              Masuk
            </Link>
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {error && (
            <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
              {error}
            </div>
          )}

          <div className="space-y-4">
            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium">
                Nama Lengkap
              </label>
              <input
                {...register("name")}
                type="text"
                id="name"
                autoComplete="name"
                className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                placeholder="John Doe"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-destructive">{errors.name.message}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium">
                Email
              </label>
              <input
                {...register("email")}
                type="email"
                id="email"
                autoComplete="email"
                className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                placeholder="nama@email.com"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-destructive">{errors.email.message}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium">
                Password
              </label>
              <div className="relative mt-1">
                <input
                  {...register("password")}
                  type={showPassword ? "text" : "password"}
                  id="password"
                  autoComplete="new-password"
                  className="block w-full rounded-md border border-input bg-background px-3 py-2 pr-10 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  placeholder="Minimal 6 karakter"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground hover:text-foreground"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-destructive">{errors.password.message}</p>
              )}
            </div>

            {/* Password Confirmation */}
            <div>
              <label htmlFor="password_confirmation" className="block text-sm font-medium">
                Konfirmasi Password
              </label>
              <input
                {...register("password_confirmation")}
                type={showPassword ? "text" : "password"}
                id="password_confirmation"
                autoComplete="new-password"
                className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                placeholder="Ulangi password"
              />
              {errors.password_confirmation && (
                <p className="mt-1 text-sm text-destructive">
                  {errors.password_confirmation.message}
                </p>
              )}
            </div>

            {/* Phone */}
            <div>
              <label htmlFor="phone" className="block text-sm font-medium">
                Nomor Telepon
              </label>
              <input
                {...register("phone")}
                type="tel"
                id="phone"
                autoComplete="tel"
                className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                placeholder="081234567890"
              />
              {errors.phone && (
                <p className="mt-1 text-sm text-destructive">{errors.phone.message}</p>
              )}
            </div>

            {/* Address */}
            <div>
              <label htmlFor="address" className="block text-sm font-medium">
                Alamat
              </label>
              <textarea
                {...register("address")}
                id="address"
                rows={3}
                autoComplete="street-address"
                className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                placeholder="Jl. Contoh No. 123, Kota, Provinsi"
              />
              {errors.address && (
                <p className="mt-1 text-sm text-destructive">{errors.address.message}</p>
              )}
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className="flex w-full items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
          >
            {isLoading ? (
              <ButtonLoading />
            ) : (
              <>
                <UserPlus className="h-4 w-4" />
                Daftar
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
