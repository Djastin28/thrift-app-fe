import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { SkeletonCartItem } from '../../components/ui/Skeleton';
import { Alert } from '../../components/ui/Alert';
import { EmptyState } from '../../components/ui/EmptyState';
import { useCartStore } from '../../store/cartStore';
import { formatPrice } from '../../lib/utils';
import {
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  Package,
  ArrowRight,
  ShoppingBag,
  Loader2,
  AlertCircle
} from 'lucide-react';

export default function Cart() {
  const navigate = useNavigate();
  const { items, isLoading, fetchCart, updateQuantity, removeFromCart, totalItems, totalPrice } = useCartStore();
  const [error, setError] = useState('');
  const [updatingItems, setUpdatingItems] = useState({});
  const [removingItems, setRemovingItems] = useState({});
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    const loadCart = async () => {
      try {
        await fetchCart();
      } catch (err) {
        setError('Gagal memuat keranjang');
        console.error(err);
      } finally {
        setInitialLoading(false);
      }
    };
    loadCart();
  }, [fetchCart]);

  const handleUpdateQuantity = async (cartId, newQuantity, maxStock) => {
    if (newQuantity < 1 || newQuantity > maxStock) return;
    
    setUpdatingItems(prev => ({ ...prev, [cartId]: true }));
    setError('');
    
    try {
      await updateQuantity(cartId, newQuantity);
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal mengupdate jumlah');
    } finally {
      setUpdatingItems(prev => ({ ...prev, [cartId]: false }));
    }
  };

  const handleRemove = async (cartId) => {
    setRemovingItems(prev => ({ ...prev, [cartId]: true }));
    setError('');
    try {
      await removeFromCart(cartId);
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal menghapus item');
      setRemovingItems(prev => ({ ...prev, [cartId]: false }));
    }
  };

  const handleCheckout = () => {
    navigate('/checkout');
  };

  if (initialLoading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="container mx-auto px-4 py-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              <ShoppingCart className="h-6 w-6" />
              Keranjang Belanja
            </h1>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <SkeletonCartItem key={i} />
              ))}
            </div>
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
                <div className="h-6 bg-slate-200 rounded w-1/2 animate-pulse" />
                <div className="space-y-3">
                  <div className="h-4 bg-slate-200 rounded animate-pulse" />
                  <div className="h-4 bg-slate-200 rounded animate-pulse" />
                  <div className="h-6 bg-slate-200 rounded animate-pulse" />
                </div>
                <div className="h-12 bg-slate-200 rounded-lg animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <ShoppingCart className="h-6 w-6" />
            Keranjang Belanja
          </h1>
          <p className="text-slate-500 mt-1">
            {items.length > 0 ? `${totalItems()} item dalam keranjang` : 'Keranjang kosong'}
          </p>
        </div>

        {error && (
          <Alert variant="error" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            {error}
          </Alert>
        )}

        {items.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200">
            <EmptyState
              icon={ShoppingBag}
              title="Keranjang Anda Kosong"
              description="Mulai belanja dan tambahkan produk ke keranjang Anda"
              action={
                <Button onClick={() => navigate('/')} className="gap-2">
                  <ShoppingBag className="h-4 w-4" />
                  Mulai Belanja
                </Button>
              }
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((cartItem) => (
                <div
                  key={cartItem.id}
                  className={`bg-white rounded-xl border border-slate-200 p-4 transition-opacity ${
                    removingItems[cartItem.id] ? 'opacity-50' : ''
                  }`}
                >
                  <div className="flex gap-4">
                    {/* Image */}
                    <Link
                      to={`/items/${cartItem.item.id}`}
                      className="flex-shrink-0"
                    >
                      <div className="w-24 h-24 rounded-lg overflow-hidden bg-slate-100">
                        {cartItem.item.image_full_url ? (
                          <img
                            src={cartItem.item.image_full_url}
                            alt={cartItem.item.name}
                            className="w-full h-full object-cover hover:scale-105 transition-transform"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Package className="h-8 w-8 text-slate-300" />
                          </div>
                        )}
                      </div>
                    </Link>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <Link
                        to={`/items/${cartItem.item.id}`}
                        className="font-medium text-slate-900 hover:text-indigo-600 line-clamp-2 transition-colors"
                      >
                        {cartItem.item.name}
                      </Link>
                      <p className="text-lg font-bold text-slate-900 mt-1">
                        {formatPrice(cartItem.item.price)}
                      </p>
                      {cartItem.notes && (
                        <p className="text-sm text-slate-500 mt-1 line-clamp-1">
                          Catatan: {cartItem.notes}
                        </p>
                      )}
                      <p className="text-xs text-slate-400 mt-1">
                        Stok tersedia: {cartItem.item.stock}
                      </p>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-4 mt-3">
                        <div className="flex items-center border border-slate-200 rounded-lg">
                          <button
                            onClick={() => handleUpdateQuantity(
                              cartItem.id,
                              cartItem.quantity - 1,
                              cartItem.item.stock
                            )}
                            disabled={cartItem.quantity <= 1 || updatingItems[cartItem.id]}
                            className="p-2 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                          <span className="w-12 text-center font-medium text-sm">
                            {updatingItems[cartItem.id] ? (
                              <Loader2 className="h-4 w-4 animate-spin mx-auto" />
                            ) : (
                              cartItem.quantity
                            )}
                          </span>
                          <button
                            onClick={() => handleUpdateQuantity(
                              cartItem.id,
                              cartItem.quantity + 1,
                              cartItem.item.stock
                            )}
                            disabled={cartItem.quantity >= cartItem.item.stock || updatingItems[cartItem.id]}
                            className="p-2 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>

                        <button
                          onClick={() => handleRemove(cartItem.id)}
                          disabled={removingItems[cartItem.id]}
                          className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                        >
                          {removingItems[cartItem.id] ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Subtotal */}
                    <div className="text-right hidden sm:block">
                      <p className="text-xs text-slate-500">Subtotal</p>
                      <p className="text-lg font-bold text-slate-900">
                        {formatPrice(parseFloat(cartItem.item.price) * cartItem.quantity)}
                      </p>
                    </div>
                  </div>
                  
                  {/* Mobile Subtotal */}
                  <div className="sm:hidden mt-4 pt-4 border-t border-slate-100 flex justify-between items-center">
                    <span className="text-sm text-slate-500">Subtotal</span>
                    <span className="font-bold text-slate-900">
                      {formatPrice(parseFloat(cartItem.item.price) * cartItem.quantity)}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div className="lg:col-span-1">
              <div className="sticky top-6 bg-white rounded-xl border border-slate-200 p-6">
                <h2 className="text-lg font-semibold text-slate-900 mb-4">
                  Ringkasan Belanja
                </h2>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-slate-600">
                    <span>Total Item</span>
                    <span className="font-medium text-slate-900">{totalItems()}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Subtotal</span>
                    <span className="font-medium text-slate-900">{formatPrice(totalPrice())}</span>
                  </div>
                  <div className="border-t border-slate-100 pt-3">
                    <div className="flex justify-between text-lg font-bold text-slate-900">
                      <span>Total</span>
                      <span>{formatPrice(totalPrice())}</span>
                    </div>
                  </div>
                </div>

                <Button
                  onClick={handleCheckout}
                  className="w-full h-12 text-base gap-2"
                  disabled={isLoading}
                >
                  Lanjut ke Checkout
                  <ArrowRight className="h-4 w-4" />
                </Button>

                <Button
                  variant="ghost"
                  onClick={() => navigate('/')}
                  className="w-full mt-3"
                >
                  Lanjut Belanja
                </Button>

                <div className="mt-6 p-4 bg-slate-50 rounded-lg border border-slate-100">
                  <p className="text-xs text-slate-600">
                    <strong>Catatan:</strong> Biaya pengiriman akan dihitung di halaman checkout
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
