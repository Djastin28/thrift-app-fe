import { Link } from "react-router-dom";
import { Package, ArrowRight, Leaf, Shield, Truck, Sparkles } from "lucide-react";

export default function Home() {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary via-primary/90 to-teal-600 py-16 md:py-24">
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='30' height='30' viewBox='0 0 30 30' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='1.5' cy='1.5' r='1.5' fill='white'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat'
        }}></div>
        <div className="container relative mx-auto px-4">
          <div className="max-w-2xl">
            <span className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-1.5 text-sm font-medium text-white backdrop-blur-sm">
              <Sparkles className="h-4 w-4" />
              Marketplace Preloved #1 di Indonesia
            </span>
            <h1 className="mb-6 text-4xl font-bold leading-tight text-white md:text-5xl lg:text-6xl">
              Temukan Barang
              <span className="block text-accent">Preloved Berkualitas</span>
            </h1>
            <p className="mb-8 text-lg text-white/80 md:text-xl">
              Jual beli barang bekas dengan mudah dan aman di ThriftShop. 
              Berbagai kategori tersedia mulai dari pakaian, sepatu, tas, dan masih banyak lagi.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/my-items"
                className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3.5 font-semibold text-primary shadow-lg hover:shadow-xl hover:bg-gray-50 transition-all"
              >
                Mulai Jual
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                to="/register"
                className="inline-flex items-center gap-2 rounded-xl border-2 border-white/30 bg-white/10 px-6 py-3.5 font-semibold text-white backdrop-blur-sm hover:bg-white/20 transition-all"
              >
                Daftar Sekarang
              </Link>
            </div>
          </div>
        </div>
        {/* Decorative elements */}
        <div className="absolute -bottom-10 -right-10 h-64 w-64 rounded-full bg-accent/20 blur-3xl"></div>
        <div className="absolute -top-10 right-1/4 h-48 w-48 rounded-full bg-white/10 blur-3xl"></div>
      </section>

      {/* Features */}
      <section className="border-b bg-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 md:grid-cols-3">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Leaf className="h-6 w-6" />
              </div>
              <div>
                <h3 className="mb-1 font-semibold text-foreground">Ramah Lingkungan</h3>
                <p className="text-sm text-muted-foreground">
                  Kurangi limbah fashion dengan membeli barang preloved berkualitas
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-accent/10 text-accent">
                <Shield className="h-6 w-6" />
              </div>
              <div>
                <h3 className="mb-1 font-semibold text-foreground">Transaksi Aman</h3>
                <p className="text-sm text-muted-foreground">
                  Pembayaran dilindungi dan garansi uang kembali
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-info/10 text-info">
                <Truck className="h-6 w-6" />
              </div>
              <div>
                <h3 className="mb-1 font-semibold text-foreground">Pengiriman Cepat</h3>
                <p className="text-sm text-muted-foreground">
                  Tersedia berbagai pilihan kurir dengan harga terjangkau
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="container mx-auto px-4 py-12">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Produk Terbaru</h2>
            <p className="text-muted-foreground">Temukan barang preloved terbaik untukmu</p>
          </div>
          <Link 
            to="/" 
            className="hidden items-center gap-1 text-sm font-medium text-primary hover:underline md:flex"
          >
            Lihat Semua
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-primary/20 bg-primary/5 py-16">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
            <Package className="h-8 w-8 text-primary" />
          </div>
          <p className="text-lg font-semibold text-foreground">Fitur Browse Items</p>
          <p className="text-sm text-muted-foreground">
            Akan diimplementasikan di Phase 4 (Member C)
          </p>
        </div>
      </section>
    </div>
  );
}
