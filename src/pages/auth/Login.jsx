import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Eye, EyeOff, LogIn, Package } from "lucide-react";
import { useAuthStore } from "../../store/authStore";
import { ButtonLoading } from "../../components/shared/LoadingSpinner";

const loginSchema = z.object({
  email: z.string().email("Email tidak valid"),
  password: z.string().min(1, "Password wajib diisi"),
});

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isLoading } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const from = location.state?.from?.pathname || "/";

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data) => {
    setError("");
    try {
      const result = await login(data);
      if (result.success) {
        // Redirect based on role
        if (result.user.role === "admin") {
          navigate("/admin");
        } else {
          navigate(from);
        }
      }
    } catch (err) {
      if (err.response?.status === 401) {
        setError("Email atau password salah");
      } else if (err.response?.status === 403) {
        setError("Akun Anda dinonaktifkan. Hubungi admin.");
      } else {
        setError(err.response?.data?.message || "Terjadi kesalahan. Silakan coba lagi.");
      }
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Left Side - Branding */}
      <div className="hidden w-1/2 bg-primary lg:flex lg:flex-col lg:justify-between p-12">
        <Link to="/" className="flex items-center space-x-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
            <Package className="h-6 w-6 text-white" />
          </div>
          <span className="text-2xl font-bold text-white">Kondang Thrift</span>
        </Link>
        <div>
          <h1 className="text-4xl font-bold text-white mb-4">
            Selamat Datang Kembali!
          </h1>
          <p className="text-lg text-white/80">
            Temukan ribuan barang preloved berkualitas dengan harga terjangkau.
          </p>
        </div>
        <p className="text-sm text-white/60">
          © 2025 Kondang Thrift. All rights reserved.
        </p>
      </div>

      {/* Right Side - Form */}
      <div className="flex w-full items-center justify-center bg-background px-4 lg:w-1/2">
        <div className="w-full max-w-md space-y-8">
          {/* Logo - Mobile Only */}
          <div className="text-center lg:hidden">
            <Link to="/" className="inline-flex items-center space-x-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
                <Package className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-primary">Kondang Thrift</span>
            </Link>
          </div>

          <div className="text-center lg:text-left">
            <h2 className="text-2xl font-bold text-foreground">Masuk ke akun Anda</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Belum punya akun?{" "}
              <Link to="/register" className="font-semibold text-primary hover:underline">
                Daftar gratis
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
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-foreground">
                Email
              </label>
              <input
                {...register("email")}
                type="email"
                id="email"
                autoComplete="email"
                className="mt-1.5 block w-full rounded-xl border border-input bg-white px-4 py-3 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                placeholder="nama@email.com"
              />
              {errors.email && (
                <p className="mt-1.5 text-sm text-destructive">{errors.email.message}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-foreground">
                Password
              </label>
              <div className="relative mt-1.5">
                <input
                  {...register("password")}
                  type={showPassword ? "text" : "password"}
                  id="password"
                  autoComplete="current-password"
                  className="block w-full rounded-xl border border-input bg-white px-4 py-3 pr-12 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 flex items-center pr-4 text-muted-foreground hover:text-foreground transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1.5 text-sm text-destructive">{errors.password.message}</p>
              )}
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3.5 text-sm font-semibold text-white shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 hover:bg-primary/90 disabled:opacity-50 transition-all"
          >
            {isLoading ? (
              <ButtonLoading />
            ) : (
              <>
                <LogIn className="h-5 w-5" />
                Masuk
              </>
            )}
          </button>
        </form>
        </div>
      </div>
    </div>
  );
}
