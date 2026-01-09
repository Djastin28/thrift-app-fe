import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  ShoppingCart,
  User,
  LogOut,
  Package,
  LayoutDashboard,
  Menu,
  X,
  Grid3X3,
  Info,
  Phone,
  Sparkles,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useAuthStore } from "../../store/authStore";
import { useCartStore } from "../../store/cartStore";

export function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, token, logout } = useAuthStore();
  const { totalItems, fetchCart } = useCartStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isAuthenticated = !!token;
  const isAdmin = user?.role === "admin";

  // Safe cart count
  const cartCount = typeof totalItems === "function" ? totalItems() : 0;

  // Check if link is active
  const isActive = (path) => location.pathname === path;

  // Fetch cart when user is authenticated
  useEffect(() => {
    if (isAuthenticated && !isAdmin) {
      fetchCart().catch(console.error);
    }
  }, [isAuthenticated, isAdmin, fetchCart]);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  // Navigation links for guests and customers
  const publicLinks = [
    { to: "/", label: "Beranda", icon: null },
    { to: "/categories", label: "Kategori", icon: Grid3X3 },
    { to: "/about", label: "Tentang Kami", icon: Info },
    { to: "/contact", label: "Kontak", icon: Phone },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur-md shadow-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-white transition-transform group-hover:scale-105">
            <Package className="h-5 w-5" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Kondang Thrift
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center space-x-1 md:flex">
          {publicLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive(link.to)
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-slate-100"
              }`}
            >
              {link.label}
            </Link>
          ))}
          {isAuthenticated && !isAdmin && (
            <Link
              to="/orders"
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive("/orders")
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-slate-100"
              }`}
            >
              Pesanan Saya
            </Link>
          )}
          {isAdmin && (
            <Link
              to="/admin"
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1 ${
                location.pathname.startsWith("/admin")
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-slate-100"
              }`}
            >
              <LayoutDashboard className="h-4 w-4" />
              Admin
            </Link>
          )}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center space-x-3">
          {isAuthenticated && !isAdmin && (
            <Link
              to="/cart"
              className="relative rounded-full p-2.5 text-foreground hover:bg-primary/10 hover:text-primary transition-colors"
            >
              <ShoppingCart className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-accent text-xs font-bold text-white shadow-sm">
                  {cartCount}
                </span>
              )}
            </Link>
          )}

          {isAuthenticated ? (
            <div className="hidden items-center space-x-2 md:flex">
              <Link
                to="/profile"
                className="flex items-center space-x-2 rounded-full px-3 py-2 text-muted-foreground hover:bg-slate-100 hover:text-foreground transition-colors"
              >
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-semibold">
                  {user?.name?.substring(0, 2).toUpperCase()}
                </div>
                <span className="text-sm font-medium">{user?.name}</span>
              </Link>
              <button
                onClick={handleLogout}
                className="rounded-full p-2 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
                title="Keluar"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          ) : (
            <div className="hidden space-x-2 md:flex">
              <Link
                to="/login"
                className="rounded-lg px-4 py-2 text-sm font-medium text-foreground hover:bg-slate-100 transition-colors"
              >
                Masuk
              </Link>
              <Link
                to="/register"
                className="rounded-lg bg-primary px-5 py-2 text-sm font-semibold text-white shadow-md hover:shadow-lg hover:bg-primary/90 transition-all flex items-center gap-1"
              >
                <Sparkles className="h-4 w-4" />
                Daftar
              </Link>
            </div>
          )}

          {/* Mobile Menu Button */}
          <button
            className="rounded-md p-2 md:hidden hover:bg-slate-100 transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="border-t md:hidden bg-white">
          <nav className="flex flex-col p-4 space-y-1">
            {publicLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`rounded-lg px-3 py-2.5 text-sm font-medium flex items-center gap-2 ${
                    isActive(link.to)
                      ? "bg-primary/10 text-primary"
                      : "hover:bg-slate-100"
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {Icon && <Icon className="h-4 w-4" />}
                  {link.label}
                </Link>
              );
            })}

            {isAuthenticated && !isAdmin && (
              <Link
                to="/orders"
                className={`rounded-lg px-3 py-2.5 text-sm font-medium ${
                  isActive("/orders")
                    ? "bg-primary/10 text-primary"
                    : "hover:bg-slate-100"
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Pesanan Saya
              </Link>
            )}

            {isAdmin && (
              <Link
                to="/admin"
                className="rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-slate-100 flex items-center gap-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                <LayoutDashboard className="h-4 w-4" />
                Admin Panel
              </Link>
            )}

            <div className="border-t my-2 pt-2">
              {isAuthenticated ? (
                <>
                  <Link
                    to="/profile"
                    className="rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-slate-100 flex items-center gap-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-semibold">
                      {user?.name?.substring(0, 2).toUpperCase()}
                    </div>
                    Profil Saya
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full rounded-lg px-3 py-2.5 text-left text-sm font-medium text-destructive hover:bg-destructive/10 flex items-center gap-2"
                  >
                    <LogOut className="h-4 w-4" />
                    Keluar
                  </button>
                </>
              ) : (
                <div className="flex flex-col gap-2">
                  <Link
                    to="/login"
                    className="rounded-lg px-3 py-2.5 text-sm font-medium text-center hover:bg-slate-100 border border-slate-200"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Masuk
                  </Link>
                  <Link
                    to="/register"
                    className="rounded-lg bg-primary px-3 py-2.5 text-sm font-medium text-center text-white hover:bg-primary/90 flex items-center justify-center gap-1"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Sparkles className="h-4 w-4" />
                    Daftar Sekarang
                  </Link>
                </div>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
