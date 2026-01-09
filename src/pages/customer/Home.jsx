import { useState, useEffect, Suspense } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';
import { Skeleton, SkeletonCard } from '../../components/ui/Skeleton';
import { Alert } from '../../components/ui/Alert';
import { AnnouncementBanner } from '../../components/ui/Announcement';
import { EmptyState } from '../../components/ui/EmptyState';
import { itemsApi, categoriesApi } from '../../api/items';
import { formatPrice } from '../../lib/utils';
import {
  Search,
  SlidersHorizontal,
  Package,
  ShoppingBag,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  X,
  Filter,
  ArrowUpDown
} from 'lucide-react';

export default function Home() {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Filters
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [condition, setCondition] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState('desc');
  
  // Pagination
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  // Filter panel
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchItems();
  }, [page, search, selectedCategory, condition, minPrice, maxPrice, sortBy, sortOrder]);

  const fetchCategories = async () => {
    try {
      const { data } = await categoriesApi.getAll();
      setCategories(data.data || []);
    } catch (err) {
      console.error('Failed to fetch categories:', err);
    }
  };

  const fetchItems = async () => {
    setLoading(true);
    setError('');
    try {
      const params = {
        page,
        per_page: 12,
        ...(search && { search }),
        ...(selectedCategory && { category_id: selectedCategory }),
        ...(condition && { condition }),
        ...(minPrice && { min_price: minPrice }),
        ...(maxPrice && { max_price: maxPrice }),
        sort_by: sortBy,
        sort_order: sortOrder,
      };
      
      const { data } = await itemsApi.getAll(params);
      setItems(data.data || []);
      setTotalPages(data.last_page || 1);
    } catch (err) {
      setError('Gagal memuat produk');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const clearFilters = () => {
    setSearch('');
    setSelectedCategory('');
    setCondition('');
    setMinPrice('');
    setMaxPrice('');
    setSortBy('created_at');
    setSortOrder('desc');
    setPage(1);
  };

  const hasActiveFilters = search || selectedCategory || condition || minPrice || maxPrice;
  const activeFilterCount = [search, selectedCategory, condition, minPrice, maxPrice].filter(Boolean).length;

  const getConditionBadge = (cond) => {
    const variants = {
      new: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      like_new: 'bg-blue-50 text-blue-700 border-blue-200',
      used: 'bg-slate-100 text-slate-700 border-slate-200',
    };
    return variants[cond] || variants.used;
  };

  const getConditionLabel = (cond) => {
    const labels = {
      new: 'Baru',
      like_new: 'Seperti Baru',
      used: 'Bekas',
    };
    return labels[cond] || cond;
  };

  // Filter Section Component
  const FilterSection = ({ mobile = false }) => (
    <div className="space-y-5">
      {/* Category Filter */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Kategori
        </label>
        <select
          value={selectedCategory}
          onChange={(e) => {
            setSelectedCategory(e.target.value);
            setPage(1);
          }}
          className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm bg-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
        >
          <option value="">Semua Kategori</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      {/* Condition Filter */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Kondisi
        </label>
        <div className="space-y-2">
          {[
            { value: '', label: 'Semua' },
            { value: 'new', label: 'Baru' },
            { value: 'like_new', label: 'Seperti Baru' },
            { value: 'used', label: 'Bekas' },
          ].map((opt) => (
            <label
              key={opt.value}
              className="flex items-center gap-2 cursor-pointer"
            >
              <input
                type="radio"
                name={mobile ? 'condition-mobile' : 'condition'}
                value={opt.value}
                checked={condition === opt.value}
                onChange={(e) => {
                  setCondition(e.target.value);
                  setPage(1);
                }}
                className="w-4 h-4 text-indigo-600 border-slate-300 focus:ring-indigo-500"
              />
              <span className="text-sm text-slate-600">{opt.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Rentang Harga
        </label>
        <div className="flex gap-2 items-center">
          <Input
            type="number"
            placeholder="Min"
            value={minPrice}
            onChange={(e) => {
              setMinPrice(e.target.value);
              setPage(1);
            }}
            className="text-sm"
          />
          <span className="text-slate-400">-</span>
          <Input
            type="number"
            placeholder="Max"
            value={maxPrice}
            onChange={(e) => {
              setMaxPrice(e.target.value);
              setPage(1);
            }}
            className="text-sm"
          />
        </div>
      </div>

      {/* Sort */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Urutkan
        </label>
        <select
          value={`${sortBy}-${sortOrder}`}
          onChange={(e) => {
            const [by, order] = e.target.value.split('-');
            setSortBy(by);
            setSortOrder(order);
            setPage(1);
          }}
          className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm bg-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
        >
          <option value="created_at-desc">Terbaru</option>
          <option value="created_at-asc">Terlama</option>
          <option value="price-asc">Harga Terendah</option>
          <option value="price-desc">Harga Tertinggi</option>
          <option value="name-asc">Nama A-Z</option>
          <option value="name-desc">Nama Z-A</option>
        </select>
      </div>

      {hasActiveFilters && (
        <Button
          variant="outline"
          onClick={clearFilters}
          className="w-full"
        >
          Reset Filter
        </Button>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Promo Banner */}
      <AnnouncementBanner variant="promo">
        🎉 Selamat datang di ThriftShop! Temukan barang preloved berkualitas dengan harga terbaik
      </AnnouncementBanner>

      {/* Hero Section */}
      <div className="bg-white border-b border-slate-200">
        <div className="container mx-auto px-4 py-8 sm:py-12">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">
            Temukan Barang Impianmu
          </h1>
          <p className="text-slate-600 mb-6">
            Ribuan produk preloved berkualitas menunggumu
          </p>
          
          {/* Search Bar */}
          <div className="max-w-2xl">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input
                type="text"
                placeholder="Cari produk..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="w-full pl-12 pr-4 h-12 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all text-slate-900 placeholder:text-slate-400"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar Filters - Desktop */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-6 bg-white rounded-xl border border-slate-200 p-5">
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  Filter
                </h3>
                {hasActiveFilters && (
                  <Badge className="bg-indigo-100 text-indigo-700 border-indigo-200">
                    {activeFilterCount}
                  </Badge>
                )}
              </div>
              <FilterSection />
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {/* Mobile Filter Button */}
            <div className="lg:hidden mb-4 flex gap-2">
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="flex-1 justify-center gap-2"
              >
                <SlidersHorizontal className="h-4 w-4" />
                Filter
                {hasActiveFilters && (
                  <Badge className="ml-1 bg-indigo-600 text-white border-indigo-600">
                    {activeFilterCount}
                  </Badge>
                )}
              </Button>
              <select
                value={`${sortBy}-${sortOrder}`}
                onChange={(e) => {
                  const [by, order] = e.target.value.split('-');
                  setSortBy(by);
                  setSortOrder(order);
                  setPage(1);
                }}
                className="flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm bg-white"
              >
                <option value="created_at-desc">Terbaru</option>
                <option value="price-asc">Termurah</option>
                <option value="price-desc">Termahal</option>
              </select>
            </div>

            {/* Mobile Filters Panel */}
            {showFilters && (
              <div className="lg:hidden mb-4 bg-white rounded-xl border border-slate-200 p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-slate-900">Filter</h3>
                  <button
                    onClick={() => setShowFilters(false)}
                    className="p-2 -mr-2 rounded-lg hover:bg-slate-100"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <FilterSection mobile />
              </div>
            )}

            {/* Error Alert */}
            {error && (
              <Alert variant="error" className="mb-4">
                {error}
              </Alert>
            )}

            {/* Results Count */}
            {!loading && items.length > 0 && (
              <p className="text-sm text-slate-500 mb-4">
                Menampilkan {items.length} produk
              </p>
            )}

            {/* Items Grid */}
            {loading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {Array.from({ length: 8 }).map((_, i) => (
                  <SkeletonCard key={i} />
                ))}
              </div>
            ) : items.length === 0 ? (
              <div className="bg-white rounded-xl border border-slate-200">
                <EmptyState
                  icon={Package}
                  title="Tidak ada produk ditemukan"
                  description="Coba ubah filter atau kata kunci pencarian Anda"
                  action={
                    hasActiveFilters && (
                      <Button variant="outline" onClick={clearFilters}>
                        Reset Filter
                      </Button>
                    )
                  }
                />
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {items.map((item) => (
                    <Link key={item.id} to={`/items/${item.id}`}>
                      <div className="group bg-white rounded-xl border border-slate-200 overflow-hidden hover:border-slate-300 hover:shadow-lg transition-all duration-200">
                        <div className="relative aspect-square bg-slate-100 overflow-hidden">
                          {item.image_full_url ? (
                            <img
                              src={item.image_full_url}
                              alt={item.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              loading="lazy"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-slate-100">
                              <ShoppingBag className="h-12 w-12 text-slate-300" />
                            </div>
                          )}
                          <div className="absolute top-2 right-2">
                            <Badge className={getConditionBadge(item.condition)}>
                              {item.condition === 'new' && (
                                <Sparkles className="h-3 w-3 mr-1" />
                              )}
                              {getConditionLabel(item.condition)}
                            </Badge>
                          </div>
                        </div>
                        <div className="p-3 sm:p-4">
                          <h3 className="font-medium text-slate-900 line-clamp-2 text-sm sm:text-base min-h-[2.5rem] group-hover:text-indigo-600 transition-colors">
                            {item.name}
                          </h3>
                          <p className="text-lg sm:text-xl font-bold text-slate-900 mt-2">
                            {formatPrice(item.price)}
                          </p>
                          {item.category_relation && (
                            <p className="text-xs text-slate-500 mt-1">
                              {item.category_relation.name}
                            </p>
                          )}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-8 flex items-center justify-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page === 1}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    
                    <div className="flex items-center gap-1">
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        let pageNum;
                        if (totalPages <= 5) {
                          pageNum = i + 1;
                        } else if (page <= 3) {
                          pageNum = i + 1;
                        } else if (page >= totalPages - 2) {
                          pageNum = totalPages - 4 + i;
                        } else {
                          pageNum = page - 2 + i;
                        }
                        return (
                          <Button
                            key={pageNum}
                            variant={page === pageNum ? 'default' : 'ghost'}
                            size="sm"
                            onClick={() => setPage(pageNum)}
                            className="w-9 h-9"
                          >
                            {pageNum}
                          </Button>
                        );
                      })}
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                      disabled={page === totalPages}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
