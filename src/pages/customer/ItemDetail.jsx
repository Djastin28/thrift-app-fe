import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { SkeletonProductDetail } from '../../components/ui/Skeleton';
import { Alert } from '../../components/ui/Alert';
import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogContent,
  DialogFooter
} from '../../components/ui/Dialog';
import { itemsApi } from '../../api/items';
import { useCartStore } from '../../store/cartStore';
import { useAuthStore } from '../../store/authStore';
import { formatPrice } from '../../lib/utils';
import {
  ShoppingCart,
  Package,
  Sparkles,
  Phone,
  Tag,
  Ruler,
  ArrowLeft,
  CheckCircle2,
  XCircle,
  Minus,
  Plus,
  Loader2,
  Store,
  Info,
  ShoppingBag
} from 'lucide-react';

export default function ItemDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, token } = useAuthStore();
  const { addToCart, isLoading: cartLoading } = useCartStore();
  
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState('');
  const [addingToCart, setAddingToCart] = useState(false);
  
  // Dialog states
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const [showErrorDialog, setShowErrorDialog] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    fetchItem();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchItem = async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await itemsApi.getById(id);
      setItem(data.data);
    } catch (err) {
      setError('Gagal memuat detail produk');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!token) {
      setShowLoginDialog(true);
      return;
    }

    setAddingToCart(true);
    setError('');
    
    try {
      await addToCart(item.id, quantity, notes);
      setShowSuccessDialog(true);
      setQuantity(1);
      setNotes('');
    } catch (err) {
      setErrorMessage(err.response?.data?.message || 'Gagal menambahkan ke keranjang');
      setShowErrorDialog(true);
    } finally {
      setAddingToCart(false);
    }
  };

  const handleGoToCart = () => {
    setShowSuccessDialog(false);
    navigate('/cart');
  };

  const handleContinueShopping = () => {
    setShowSuccessDialog(false);
  };

  const handleGoToLogin = () => {
    setShowLoginDialog(false);
    navigate('/login', { state: { from: `/items/${id}` } });
  };

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

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="container mx-auto px-4 py-6">
          <div className="mb-6">
            <Button variant="ghost" disabled className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Kembali
            </Button>
          </div>
          <SkeletonProductDetail />
        </div>
      </div>
    );
  }

  if (error && !item) {
    return (
      <div className="min-h-screen bg-slate-50 p-4">
        <div className="container mx-auto max-w-4xl">
          <Alert variant="error" className="mb-4">
            {error}
          </Alert>
          <Button variant="outline" onClick={() => navigate('/')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Kembali ke Beranda
          </Button>
        </div>
      </div>
    );
  }

  if (!item) return null;

  const isOutOfStock = item.stock === 0;
  const isOwnItem = user?.id === item.user_id;

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="container mx-auto px-4 py-6">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-6 gap-2 text-slate-600 hover:text-slate-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Kembali
        </Button>

        {/* Error Message */}
        {error && (
          <Alert variant="error" className="mb-6">
            {error}
          </Alert>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image Section */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
            <div className="relative aspect-square bg-slate-100">
              {item.image_full_url ? (
                <img
                  src={item.image_full_url}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Package className="h-24 w-24 text-slate-300" />
                </div>
              )}
            </div>
          </div>

          {/* Details Section */}
          <div className="space-y-6">
            {/* Main Info Card */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6">
              {/* Title & Condition */}
              <div className="flex items-start justify-between gap-4 mb-4">
                <h1 className="text-2xl font-bold text-slate-900">
                  {item.name}
                </h1>
                <Badge className={getConditionBadge(item.condition)}>
                  {item.condition === 'new' && (
                    <Sparkles className="h-3 w-3 mr-1" />
                  )}
                  {getConditionLabel(item.condition)}
                </Badge>
              </div>

              {/* Price */}
              <div className="mb-6">
                <p className="text-3xl font-bold text-slate-900">
                  {formatPrice(item.price)}
                </p>
              </div>

              {/* Category & Size */}
              <div className="flex flex-wrap gap-4 mb-6">
                {item.category_relation && (
                  <div className="flex items-center gap-2 text-slate-600 bg-slate-50 px-3 py-2 rounded-lg">
                    <Tag className="h-4 w-4" />
                    <span className="text-sm">{item.category_relation.name}</span>
                  </div>
                )}
                {item.size && (
                  <div className="flex items-center gap-2 text-slate-600 bg-slate-50 px-3 py-2 rounded-lg">
                    <Ruler className="h-4 w-4" />
                    <span className="text-sm">Ukuran: {item.size}</span>
                  </div>
                )}
              </div>

              {/* Stock Status */}
              <div className="mb-6 p-4 rounded-xl bg-slate-50 border border-slate-100">
                {isOutOfStock ? (
                  <div className="flex items-center gap-2 text-red-600">
                    <XCircle className="h-5 w-5" />
                    <span className="font-medium">Stok Habis</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-emerald-600">
                    <CheckCircle2 className="h-5 w-5" />
                    <span className="font-medium">Stok Tersedia: {item.stock}</span>
                  </div>
                )}
              </div>

              {/* Add to Cart Section */}
              {!isOwnItem && !isOutOfStock && (
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-medium text-slate-700">Jumlah:</span>
                    <div className="flex items-center border border-slate-200 rounded-lg">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        disabled={quantity <= 1}
                        className="p-2 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <input
                        type="number"
                        min="1"
                        max={item.stock}
                        value={quantity}
                        onChange={(e) => setQuantity(Math.max(1, Math.min(item.stock, parseInt(e.target.value) || 1)))}
                        className="w-16 text-center border-x border-slate-200 py-2 focus:outline-none"
                      />
                      <button
                        onClick={() => setQuantity(Math.min(item.stock, quantity + 1))}
                        disabled={quantity >= item.stock}
                        className="p-2 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Catatan untuk penjual (opsional)
                    </label>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Contoh: Warna hitam, ukuran L"
                      className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all resize-none"
                      rows="2"
                    />
                  </div>

                  <Button
                    onClick={handleAddToCart}
                    disabled={addingToCart || cartLoading}
                    className="w-full h-12 text-base gap-2"
                  >
                    {addingToCart ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        Menambahkan...
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="h-5 w-5" />
                        Tambah ke Keranjang
                      </>
                    )}
                  </Button>
                </div>
              )}

              {isOwnItem && (
                <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                  <div className="flex items-center gap-2 text-blue-700">
                    <Info className="h-5 w-5" />
                    <span className="font-medium">Ini adalah produk Anda sendiri</span>
                  </div>
                </div>
              )}

              {isOutOfStock && !isOwnItem && (
                <div className="p-4 bg-amber-50 rounded-xl border border-amber-100">
                  <div className="flex items-center gap-2 text-amber-700">
                    <Info className="h-5 w-5" />
                    <span className="font-medium">Produk ini sedang tidak tersedia</span>
                  </div>
                </div>
              )}
            </div>

            {/* Description */}
            {item.description && (
              <div className="bg-white rounded-2xl border border-slate-200 p-6">
                <h2 className="text-lg font-semibold text-slate-900 mb-3">
                  Deskripsi Produk
                </h2>
                <p className="text-slate-600 whitespace-pre-line leading-relaxed">
                  {item.description}
                </p>
              </div>
            )}

            {/* Seller Info */}
            {item.user && (
              <div className="bg-white rounded-2xl border border-slate-200 p-6">
                <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                  <Store className="h-5 w-5" />
                  Informasi Penjual
                </h2>
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100 text-indigo-600 font-semibold text-lg">
                    {item.user.name.substring(0, 2).toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-slate-900">{item.user.name}</p>
                    <p className="text-sm text-slate-500">{item.user.email}</p>
                  </div>
                </div>
                {item.user.phone && (
                  <div className="flex items-center gap-2 text-slate-600 mt-4 pt-4 border-t border-slate-100">
                    <Phone className="h-4 w-4" />
                    <span className="text-sm">{item.user.phone}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Success Dialog */}
      <Dialog open={showSuccessDialog} onClose={() => setShowSuccessDialog(false)}>
        <DialogContent className="text-center py-8">
          <div className="flex justify-center mb-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
              <CheckCircle2 className="h-8 w-8 text-emerald-600" />
            </div>
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">
            Berhasil Ditambahkan!
          </h2>
          <p className="text-slate-600 mb-6">
            Produk telah ditambahkan ke keranjang belanja Anda
          </p>
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={handleContinueShopping}
              className="flex-1"
            >
              Lanjut Belanja
            </Button>
            <Button
              onClick={handleGoToCart}
              className="flex-1 gap-2"
            >
              <ShoppingBag className="h-4 w-4" />
              Lihat Keranjang
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Login Required Dialog */}
      <Dialog open={showLoginDialog} onClose={() => setShowLoginDialog(false)}>
        <DialogHeader onClose={() => setShowLoginDialog(false)}>
          <DialogTitle>Login Diperlukan</DialogTitle>
        </DialogHeader>
        <DialogContent>
          <p className="text-slate-600">
            Anda harus login terlebih dahulu untuk menambahkan produk ke keranjang.
          </p>
        </DialogContent>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setShowLoginDialog(false)}
          >
            Batal
          </Button>
          <Button onClick={handleGoToLogin} className="gap-2">
            Login Sekarang
          </Button>
        </DialogFooter>
      </Dialog>

      {/* Error Dialog */}
      <Dialog open={showErrorDialog} onClose={() => setShowErrorDialog(false)}>
        <DialogContent className="text-center py-8">
          <div className="flex justify-center mb-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
              <XCircle className="h-8 w-8 text-red-600" />
            </div>
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">
            Gagal Menambahkan
          </h2>
          <p className="text-slate-600 mb-6">
            {errorMessage}
          </p>
          <Button onClick={() => setShowErrorDialog(false)} className="w-full">
            Tutup
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
