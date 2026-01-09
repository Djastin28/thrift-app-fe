import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { categoriesApi } from '../../api/items';
import { Skeleton } from '../../components/ui/Skeleton';
import { Alert } from '../../components/ui/Alert';
import {
  Shirt,
  ShoppingBag,
  Watch,
  Footprints,
  Gem,
  Package,
  ArrowRight,
  Sparkles
} from 'lucide-react';

// Icon mapping for categories
const categoryIcons = {
  'Pakaian': Shirt,
  'Atasan': Shirt,
  'Bawahan': ShoppingBag,
  'Celana': ShoppingBag,
  'Sepatu': Footprints,
  'Tas': ShoppingBag,
  'Aksesoris': Watch,
  'Jam': Watch,
  'Perhiasan': Gem,
  'default': Package
};

// Color mapping for categories
const categoryColors = [
  'from-rose-500 to-pink-500',
  'from-violet-500 to-purple-500',
  'from-blue-500 to-cyan-500',
  'from-emerald-500 to-teal-500',
  'from-amber-500 to-orange-500',
  'from-red-500 to-rose-500',
  'from-indigo-500 to-blue-500',
  'from-fuchsia-500 to-pink-500',
];

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const { data } = await categoriesApi.getAll();
      setCategories(data.data || []);
    } catch (err) {
      setError('Gagal memuat kategori');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getIcon = (categoryName) => {
    for (const [key, Icon] of Object.entries(categoryIcons)) {
      if (categoryName.toLowerCase().includes(key.toLowerCase())) {
        return Icon;
      }
    }
    return categoryIcons.default;
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-12 text-center">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Sparkles className="h-4 w-4" />
            Jelajahi Koleksi Kami
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            Kategori Produk
          </h1>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Temukan berbagai kategori barang preloved berkualitas. Dari pakaian, sepatu, 
            hingga aksesoris - semua tersedia dengan harga terjangkau.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {error && (
          <Alert variant="error" className="mb-6">
            {error}
          </Alert>
        )}

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 border">
                <Skeleton className="h-16 w-16 rounded-xl mb-4" />
                <Skeleton className="h-6 w-24 mb-2" />
                <Skeleton className="h-4 w-16" />
              </div>
            ))}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {categories.map((category, index) => {
                const Icon = getIcon(category.name);
                const colorClass = categoryColors[index % categoryColors.length];
                
                return (
                  <Link
                    key={category.id}
                    to={`/?category=${category.id}`}
                    className="group bg-white rounded-2xl p-6 border border-slate-200 hover:border-slate-300 hover:shadow-lg transition-all duration-300"
                  >
                    <div className={`inline-flex p-4 rounded-xl bg-gradient-to-br ${colorClass} text-white mb-4 group-hover:scale-110 transition-transform`}>
                      <Icon className="h-8 w-8" />
                    </div>
                    <h3 className="font-semibold text-slate-900 text-lg mb-1 group-hover:text-primary transition-colors">
                      {category.name}
                    </h3>
                    <p className="text-sm text-slate-500">
                      {category.items_count || 0} produk
                    </p>
                    <div className="mt-4 flex items-center text-sm text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                      Lihat Produk
                      <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </Link>
                );
              })}
            </div>

            {categories.length === 0 && (
              <div className="text-center py-12">
                <Package className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-slate-900 mb-2">
                  Belum Ada Kategori
                </h3>
                <p className="text-slate-500">
                  Kategori produk akan segera tersedia
                </p>
              </div>
            )}
          </>
        )}

        {/* CTA Section */}
        <div className="mt-12 bg-gradient-to-r from-primary to-accent rounded-2xl p-8 text-center text-white">
          <h2 className="text-2xl font-bold mb-2">Tidak Menemukan yang Dicari?</h2>
          <p className="text-white/80 mb-6">
            Coba gunakan fitur pencarian untuk menemukan produk spesifik
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 bg-white text-primary px-6 py-3 rounded-lg font-semibold hover:bg-white/90 transition-colors"
          >
            <ShoppingBag className="h-5 w-5" />
            Jelajahi Semua Produk
          </Link>
        </div>
      </div>
    </div>
  );
}
