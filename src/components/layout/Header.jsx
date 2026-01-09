import { Link, useNavigate } from "react-router-dom";
import {
  ShoppingCart,
  User,
  LogOut,
  Package,
  LayoutDashboard,
  Menu,
  X,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useAuthStore } from "../../store/authStore";
import { useCartStore } from "../../store/cartStore";
import { cn } from "../../lib/utils";

export function Header() {
  const navigate = useNavigate();
  const { user, token, logout } = useAuthStore();
  const { totalItems, fetchCart } = useCartStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isAuthenticated = !!token;
  const isAdmin = user?.role === "admin";
  
  // Safe cart count
  const cartCount = typeof totalItems === 'function' ? totalItems() : 0;

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

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur-md shadow-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-white transition-transform group-hover:scale-105">
            <Package className="h-5 w-5" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            ThriftShop
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center space-x-6 md:flex">
          <Link
            to="/"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Beranda
          </Link>
          {isAuthenticated && !isAdmin && (
            <>
              <Link
                to="/orders"
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                Pesanan
              </Link>
            </>
          )}
          {isAdmin && (
            <Link
              to="/admin"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              <LayoutDashboard className="mr-1 inline h-4 w-4" />
              Admin
            </Link>
          )}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center space-x-4">
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
                className="flex items-center space-x-2 rounded-full p-2 text-muted-foreground hover:bg-accent hover:text-foreground"
              >
                <User className="h-5 w-5" />
                <span className="text-sm">{user?.name}</span>
              </Link>
              <button
                onClick={handleLogout}
                className="rounded-full p-2 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          ) : (
            <div className="hidden space-x-3 md:flex">
              <Link
                to="/login"
                className="rounded-lg px-4 py-2 text-sm font-medium text-foreground hover:bg-secondary transition-colors"
              >
                Masuk
              </Link>
              <Link
                to="/register"
                className="rounded-lg bg-primary px-5 py-2 text-sm font-semibold text-white shadow-md hover:shadow-lg hover:bg-primary/90 transition-all"
              >
                Daftar
              </Link>
            </div>
          )}

          {/* Mobile Menu Button */}
          <button
            className="rounded-md p-2 md:hidden"
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
        <div className="border-t md:hidden">
          <nav className="flex flex-col space-y-2 p-4">
            <Link
              to="/"
              className="rounded-md px-3 py-2 text-sm font-medium hover:bg-accent"
              onClick={() => setMobileMenuOpen(false)}
            >
              Beranda
            </Link>
            {isAuthenticated && !isAdmin && (
              <Link
                to="/orders"
                className="rounded-md px-3 py-2 text-sm font-medium hover:bg-accent"
                onClick={() => setMobileMenuOpen(false)}
              >
                Pesanan
              </Link>
            )}
            {isAdmin && (
              <Link
                to="/admin"
                className="rounded-md px-3 py-2 text-sm font-medium hover:bg-accent"
                onClick={() => setMobileMenuOpen(false)}
              >
                Admin Panel
              </Link>
            )}
            {isAuthenticated ? (
              <>
                <Link
                  to="/profile"
                  className="rounded-md px-3 py-2 text-sm font-medium hover:bg-accent"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Profil ({user?.name})
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="rounded-md px-3 py-2 text-left text-sm font-medium text-destructive hover:bg-accent"
                >
                  Keluar
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="rounded-md px-3 py-2 text-sm font-medium hover:bg-accent"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Masuk
                </Link>
                <Link
                  to="/register"
                  className="rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Daftar
                </Link>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
