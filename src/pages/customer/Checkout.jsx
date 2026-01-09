import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Skeleton } from '../../components/ui/Skeleton';
import { Alert } from '../../components/ui/Alert';
import { Announcement } from '../../components/ui/Announcement';
import { useCartStore } from '../../store/cartStore';
import { useAuthStore } from '../../store/authStore';
import { ordersApi } from '../../api/orders';
import { formatPrice } from '../../lib/utils';
import {
  Package,
  CreditCard,
  MapPin,
  User,
  Phone,
  Wallet,
  Banknote,
  CheckCircle2,
  Loader2,
  ArrowLeft,
  Truck,
  ShieldCheck
} from 'lucide-react';

export default function Checkout() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { items, fetchCart, totalPrice, clearCart } = useCartStore();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Form state
  const [formData, setFormData] = useState({
    shipping_name: user?.name || '',
    shipping_phone: user?.phone || '',
    shipping_address: user?.address || '',
    payment_method: 'transfer',
    notes: ''
  });

  const [errors, setErrors] = useState({});

  const SHIPPING_COST = 10000;

  useEffect(() => {
    const initCart = async () => {
      try {
        await fetchCart();
      } catch (err) {
        setError('Gagal memuat keranjang');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    initCart();
  }, [fetchCart]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.shipping_name.trim()) {
      newErrors.shipping_name = 'Nama penerima harus diisi';
    }

    if (!formData.shipping_phone.trim()) {
      newErrors.shipping_phone = 'Nomor telepon harus diisi';
    } else if (!/^[0-9]{10,15}$/.test(formData.shipping_phone.replace(/[\s-]/g, ''))) {
      newErrors.shipping_phone = 'Nomor telepon tidak valid';
    }

    if (!formData.shipping_address.trim()) {
      newErrors.shipping_address = 'Alamat pengiriman harus diisi';
    } else if (formData.shipping_address.trim().length < 20) {
      newErrors.shipping_address = 'Alamat terlalu pendek (minimal 20 karakter)';
    }

    if (!formData.payment_method) {
      newErrors.payment_method = 'Pilih metode pembayaran';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      setError('Mohon lengkapi semua field yang wajib diisi');
      return;
    }

    if (items.length === 0) {
      setError('Keranjang kosong');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      await ordersApi.create(formData);
      clearCart();
      navigate(`/orders`, {
        state: { message: 'Pesanan berhasil dibuat!' }
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal membuat pesanan');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="container mx-auto px-4 py-6">
          <Skeleton className="h-8 w-48 mb-6" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-xl border border-slate-200 p-6">
                <Skeleton className="h-6 w-48 mb-4" />
                <div className="space-y-4">
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-24 w-full" />
                </div>
              </div>
            </div>
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl border border-slate-200 p-6">
                <Skeleton className="h-6 w-40 mb-4" />
                <div className="space-y-3">
                  <Skeleton className="h-16 w-full" />
                  <Skeleton className="h-16 w-full" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 p-4">
        <div className="container mx-auto max-w-4xl">
          <Alert variant="warning" className="mb-4">
            Keranjang Anda kosong. Silakan tambahkan produk terlebih dahulu.
          </Alert>
          <Button onClick={() => navigate('/')} variant="outline" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Kembali ke Beranda
          </Button>
        </div>
      </div>
    );
  }

  const subtotal = totalPrice();
  const total = subtotal + SHIPPING_COST;

  const paymentMethods = [
    {
      value: 'transfer',
      icon: Banknote,
      title: 'Transfer Bank',
      description: 'BCA, Mandiri, BNI, BRI'
    },
    {
      value: 'ewallet',
      icon: Wallet,
      title: 'E-Wallet',
      description: 'GoPay, OVO, Dana, ShopeePay'
    },
    {
      value: 'cod',
      icon: Package,
      title: 'Cash on Delivery',
      description: 'Bayar saat barang diterima'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="container mx-auto px-4 py-6">
        <Button
          variant="ghost"
          onClick={() => navigate('/cart')}
          className="mb-6 gap-2 text-slate-600 hover:text-slate-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Kembali ke Keranjang
        </Button>

        <h1 className="text-2xl font-bold text-slate-900 mb-6">Checkout</h1>

        {error && (
          <Alert variant="error" className="mb-6">
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Form Section */}
            <div className="lg:col-span-2 space-y-6">
              {/* Shipping Information */}
              <div className="bg-white rounded-xl border border-slate-200 p-6">
                <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-slate-400" />
                  Informasi Pengiriman
                </h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Nama Penerima <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <Input
                        name="shipping_name"
                        value={formData.shipping_name}
                        onChange={handleChange}
                        placeholder="Masukkan nama penerima"
                        className="pl-10"
                      />
                    </div>
                    {errors.shipping_name && (
                      <p className="text-sm text-red-600 mt-1">{errors.shipping_name}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Nomor Telepon <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <Input
                        name="shipping_phone"
                        value={formData.shipping_phone}
                        onChange={handleChange}
                        placeholder="08xxxxxxxxxx"
                        className="pl-10"
                      />
                    </div>
                    {errors.shipping_phone && (
                      <p className="text-sm text-red-600 mt-1">{errors.shipping_phone}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Alamat Lengkap <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="shipping_address"
                      value={formData.shipping_address}
                      onChange={handleChange}
                      placeholder="Jl. Nama Jalan No. XX, RT/RW, Kelurahan, Kecamatan, Kota, Provinsi, Kode Pos"
                      className="w-full border border-slate-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all resize-none"
                      rows="4"
                    />
                    {errors.shipping_address && (
                      <p className="text-sm text-red-600 mt-1">{errors.shipping_address}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Catatan (Opsional)
                    </label>
                    <textarea
                      name="notes"
                      value={formData.notes}
                      onChange={handleChange}
                      placeholder="Catatan untuk penjual (opsional)"
                      className="w-full border border-slate-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all resize-none"
                      rows="2"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-white rounded-xl border border-slate-200 p-6">
                <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-slate-400" />
                  Metode Pembayaran
                </h2>

                <div className="space-y-3">
                  {paymentMethods.map((method) => {
                    const Icon = method.icon;
                    const isSelected = formData.payment_method === method.value;

                    return (
                      <label
                        key={method.value}
                        className={`flex items-center gap-4 p-4 border-2 rounded-xl cursor-pointer transition-all ${isSelected
                            ? 'border-indigo-500 bg-indigo-50/50'
                            : 'border-slate-200 hover:border-slate-300'
                          }`}
                      >
                        <input
                          type="radio"
                          name="payment_method"
                          value={method.value}
                          checked={isSelected}
                          onChange={handleChange}
                          className="w-4 h-4 text-indigo-600 border-slate-300 focus:ring-indigo-500"
                        />
                        <div className={`p-2 rounded-lg ${isSelected ? 'bg-indigo-100' : 'bg-slate-100'}`}>
                          <Icon className={`h-5 w-5 ${isSelected ? 'text-indigo-600' : 'text-slate-500'}`} />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-slate-900">{method.title}</p>
                          <p className="text-sm text-slate-500">{method.description}</p>
                        </div>
                        {isSelected && (
                          <CheckCircle2 className="h-5 w-5 text-indigo-600" />
                        )}
                      </label>
                    );
                  })}
                </div>

                {errors.payment_method && (
                  <p className="text-sm text-red-600 mt-2">{errors.payment_method}</p>
                )}
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="sticky top-6 space-y-4">
                <div className="bg-white rounded-xl border border-slate-200 p-6">
                  <h2 className="text-lg font-semibold text-slate-900 mb-4">
                    Ringkasan Pesanan
                  </h2>

                  {/* Items */}
                  <div className="space-y-3 max-h-64 overflow-y-auto mb-4">
                    {items.map((cartItem) => (
                      <div key={cartItem.id} className="flex gap-3">
                        <div className="w-14 h-14 rounded-lg bg-slate-100 flex-shrink-0 overflow-hidden">
                          {cartItem.item.image_full_url ? (
                            <img
                              src={cartItem.item.image_full_url}
                              alt={cartItem.item.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Package className="h-5 w-5 text-slate-300" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-slate-900 line-clamp-1">
                            {cartItem.item.name}
                          </p>
                          <p className="text-xs text-slate-500">
                            {cartItem.quantity} x {formatPrice(cartItem.item.price)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-slate-100 pt-4 space-y-2">
                    <div className="flex justify-between text-sm text-slate-600">
                      <span>Subtotal ({items.length} item)</span>
                      <span className="font-medium text-slate-900">{formatPrice(subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-sm text-slate-600">
                      <span className="flex items-center gap-1">
                        <Truck className="h-4 w-4" />
                        Pengiriman
                      </span>
                      <span className="font-medium text-slate-900">{formatPrice(SHIPPING_COST)}</span>
                    </div>
                    <div className="border-t border-slate-100 pt-3 mt-3">
                      <div className="flex justify-between text-lg font-bold text-slate-900">
                        <span>Total</span>
                        <span>{formatPrice(total)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={submitting}
                  className="w-full h-12 text-base gap-2"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Memproses...
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="h-5 w-5" />
                      Buat Pesanan
                    </>
                  )}
                </Button>

                <p className="text-xs text-center text-slate-500">
                  Dengan melanjutkan, Anda menyetujui syarat dan ketentuan yang berlaku
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
