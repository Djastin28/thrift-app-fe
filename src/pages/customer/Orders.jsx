import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { SkeletonOrderCard } from '../../components/ui/Skeleton';
import { Alert } from '../../components/ui/Alert';
import { Announcement } from '../../components/ui/Announcement';
import { EmptyState } from '../../components/ui/EmptyState';
import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogContent,
  DialogFooter
} from '../../components/ui/Dialog';
import { ordersApi } from '../../api/orders';
import { formatPrice } from '../../lib/utils';
import {
  Package,
  Clock,
  CheckCircle2,
  XCircle,
  Truck,
  PackageCheck,
  Eye,
  Ban,
  Loader2,
  ShoppingBag,
  MapPin,
  CreditCard,
  Calendar,
  AlertCircle
} from 'lucide-react';

export default function Orders() {
  const location = useLocation();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState(location.state?.message || '');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [cancelling, setCancelling] = useState(null);
  const [loadingDetail, setLoadingDetail] = useState(false);

  useEffect(() => {
    fetchOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter]);

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(''), 5000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  const fetchOrders = async () => {
    setLoading(true);
    setError('');
    try {
      const params = statusFilter ? { status: statusFilter } : {};
      const { data } = await ordersApi.getAll(params);
      setOrders(data.data || []);
    } catch (err) {
      setError('Gagal memuat pesanan');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetail = async (orderId) => {
    setLoadingDetail(true);
    setShowDetailModal(true);
    try {
      const { data } = await ordersApi.getById(orderId);
      setSelectedOrder(data.data);
    } catch (err) {
      setError('Gagal memuat detail pesanan');
      setShowDetailModal(false);
      console.error(err);
    } finally {
      setLoadingDetail(false);
    }
  };

  const handleCancelOrder = async (orderId) => {
    setCancelling(orderId);
    setError('');
    
    try {
      await ordersApi.cancel(orderId);
      setSuccessMessage('Pesanan berhasil dibatalkan');
      fetchOrders();
      if (selectedOrder?.id === orderId) {
        setShowDetailModal(false);
        setSelectedOrder(null);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal membatalkan pesanan');
    } finally {
      setCancelling(null);
    }
  };

  const getStatusConfig = (status) => {
    const configs = {
      pending: {
        badge: 'bg-amber-50 text-amber-700 border-amber-200',
        icon: Clock,
        label: 'Menunggu Konfirmasi'
      },
      confirmed: {
        badge: 'bg-blue-50 text-blue-700 border-blue-200',
        icon: CheckCircle2,
        label: 'Dikonfirmasi'
      },
      processing: {
        badge: 'bg-indigo-50 text-indigo-700 border-indigo-200',
        icon: Package,
        label: 'Diproses'
      },
      shipped: {
        badge: 'bg-purple-50 text-purple-700 border-purple-200',
        icon: Truck,
        label: 'Dikirim'
      },
      delivered: {
        badge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        icon: PackageCheck,
        label: 'Selesai'
      },
      cancelled: {
        badge: 'bg-red-50 text-red-700 border-red-200',
        icon: XCircle,
        label: 'Dibatalkan'
      },
    };
    return configs[status] || configs.pending;
  };

  const getPaymentStatusConfig = (status) => {
    const configs = {
      unpaid: { badge: 'bg-red-50 text-red-700 border-red-200', label: 'Belum Dibayar' },
      paid: { badge: 'bg-emerald-50 text-emerald-700 border-emerald-200', label: 'Sudah Dibayar' },
      refunded: { badge: 'bg-slate-100 text-slate-700 border-slate-200', label: 'Dikembalikan' },
    };
    return configs[status] || configs.unpaid;
  };

  const canCancelOrder = (order) => order.status === 'pending';

  const statusFilters = [
    { value: '', label: 'Semua', icon: null },
    { value: 'pending', label: 'Pending', icon: Clock },
    { value: 'confirmed', label: 'Dikonfirmasi', icon: CheckCircle2 },
    { value: 'processing', label: 'Diproses', icon: Package },
    { value: 'shipped', label: 'Dikirim', icon: Truck },
    { value: 'delivered', label: 'Selesai', icon: PackageCheck },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Package className="h-6 w-6" />
            Pesanan Saya
          </h1>
          <p className="text-slate-500 mt-1">
            Kelola dan lacak pesanan Anda
          </p>
        </div>

        {successMessage && (
          <Announcement variant="success" className="mb-6">
            {successMessage}
          </Announcement>
        )}

        {error && (
          <Alert variant="error" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            {error}
          </Alert>
        )}

        {/* Status Filter */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 mb-6">
          <div className="flex flex-wrap gap-2">
            {statusFilters.map((filter) => {
              const Icon = filter.icon;
              const isActive = statusFilter === filter.value;
              
              return (
                <button
                  key={filter.value}
                  onClick={() => setStatusFilter(filter.value)}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {Icon && <Icon className="h-4 w-4" />}
                  {filter.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Orders List */}
        {loading ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <SkeletonOrderCard key={i} />
            ))}
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200">
            <EmptyState
              icon={ShoppingBag}
              title="Belum ada pesanan"
              description={statusFilter ? 'Tidak ada pesanan dengan status ini' : 'Mulai belanja sekarang'}
              action={
                !statusFilter && (
                  <Link to="/">
                    <Button className="gap-2">
                      <ShoppingBag className="h-4 w-4" />
                      Mulai Belanja
                    </Button>
                  </Link>
                )
              }
            />
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => {
              const statusConfig = getStatusConfig(order.status);
              const paymentConfig = getPaymentStatusConfig(order.payment_status);
              const StatusIcon = statusConfig.icon;

              return (
                <div
                  key={order.id}
                  className="bg-white rounded-xl border border-slate-200 overflow-hidden"
                >
                  {/* Order Header */}
                  <div className="flex flex-wrap items-center justify-between gap-4 p-4 border-b border-slate-100 bg-slate-50/50">
                    <div className="flex items-center gap-4">
                      <div>
                        <p className="font-semibold text-slate-900">
                          {order.order_number}
                        </p>
                        <p className="text-sm text-slate-500 flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(order.created_at).toLocaleDateString('id-ID', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Badge className={statusConfig.badge}>
                        <StatusIcon className="h-3 w-3 mr-1" />
                        {statusConfig.label}
                      </Badge>
                      <Badge className={paymentConfig.badge}>
                        {paymentConfig.label}
                      </Badge>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="p-4">
                    <div className="space-y-3">
                      {order.order_items?.slice(0, 2).map((item) => (
                        <div key={item.id} className="flex gap-3">
                          <div className="w-14 h-14 rounded-lg bg-slate-100 flex-shrink-0 flex items-center justify-center">
                            <Package className="h-5 w-5 text-slate-400" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-slate-900 line-clamp-1">
                              {item.item_name}
                            </p>
                            <p className="text-sm text-slate-500">
                              {item.quantity} x {formatPrice(item.item_price)}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium text-slate-900">
                              {formatPrice(item.subtotal)}
                            </p>
                          </div>
                        </div>
                      ))}
                      {order.order_items?.length > 2 && (
                        <p className="text-sm text-slate-500">
                          +{order.order_items.length - 2} produk lainnya
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Order Footer */}
                  <div className="flex flex-wrap justify-between items-center gap-4 p-4 border-t border-slate-100 bg-slate-50/50">
                    <div>
                      <p className="text-sm text-slate-500">Total Pesanan</p>
                      <p className="text-xl font-bold text-slate-900">
                        {formatPrice(order.total)}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewDetail(order.id)}
                        className="gap-1"
                      >
                        <Eye className="h-4 w-4" />
                        Detail
                      </Button>
                      {canCancelOrder(order) && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleCancelOrder(order.id)}
                          disabled={cancelling === order.id}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200 gap-1"
                        >
                          {cancelling === order.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <>
                              <Ban className="h-4 w-4" />
                              Batalkan
                            </>
                          )}
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Detail Modal */}
        <Dialog
          open={showDetailModal}
          onClose={() => {
            setShowDetailModal(false);
            setSelectedOrder(null);
          }}
          className="max-w-2xl"
        >
          <DialogHeader onClose={() => {
            setShowDetailModal(false);
            setSelectedOrder(null);
          }}>
            <DialogTitle>Detail Pesanan</DialogTitle>
          </DialogHeader>
          
          <DialogContent className="max-h-[70vh] overflow-y-auto">
            {loadingDetail ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
              </div>
            ) : selectedOrder && (
              <div className="space-y-6">
                {/* Order Info */}
                <div>
                  <p className="font-semibold text-slate-900 text-lg">
                    {selectedOrder.order_number}
                  </p>
                  <p className="text-sm text-slate-500">
                    {new Date(selectedOrder.created_at).toLocaleString('id-ID')}
                  </p>
                  <div className="flex gap-2 mt-2">
                    <Badge className={getStatusConfig(selectedOrder.status).badge}>
                      {getStatusConfig(selectedOrder.status).label}
                    </Badge>
                    <Badge className={getPaymentStatusConfig(selectedOrder.payment_status).badge}>
                      {getPaymentStatusConfig(selectedOrder.payment_status).label}
                    </Badge>
                  </div>
                </div>

                {/* Shipping Info */}
                <div className="p-4 bg-slate-50 rounded-xl">
                  <h3 className="font-medium text-slate-900 mb-3 flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Alamat Pengiriman
                  </h3>
                  <p className="text-sm text-slate-700 font-medium">{selectedOrder.shipping_name}</p>
                  <p className="text-sm text-slate-600">{selectedOrder.shipping_phone}</p>
                  <p className="text-sm text-slate-600 mt-1">{selectedOrder.shipping_address}</p>
                </div>

                {/* Items */}
                <div>
                  <h3 className="font-medium text-slate-900 mb-3">Produk</h3>
                  <div className="space-y-3">
                    {selectedOrder.order_items?.map((item) => (
                      <div key={item.id} className="flex justify-between items-center py-2 border-b border-slate-100 last:border-0">
                        <div>
                          <p className="font-medium text-slate-900">{item.item_name}</p>
                          <p className="text-sm text-slate-500">
                            {item.quantity} x {formatPrice(item.item_price)}
                          </p>
                        </div>
                        <p className="font-medium text-slate-900">
                          {formatPrice(item.subtotal)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Payment Summary */}
                <div className="p-4 bg-slate-50 rounded-xl">
                  <h3 className="font-medium text-slate-900 mb-3 flex items-center gap-2">
                    <CreditCard className="h-4 w-4" />
                    Ringkasan Pembayaran
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between text-slate-600">
                      <span>Subtotal</span>
                      <span>{formatPrice(selectedOrder.subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>Pengiriman</span>
                      <span>{formatPrice(selectedOrder.shipping_cost)}</span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>Metode Pembayaran</span>
                      <span className="capitalize">{selectedOrder.payment_method}</span>
                    </div>
                    <div className="flex justify-between font-bold text-slate-900 pt-2 border-t border-slate-200">
                      <span>Total</span>
                      <span>{formatPrice(selectedOrder.total)}</span>
                    </div>
                  </div>
                </div>

                {selectedOrder.notes && (
                  <div className="p-4 bg-amber-50 rounded-xl border border-amber-100">
                    <p className="text-sm font-medium text-amber-900">Catatan:</p>
                    <p className="text-sm text-amber-700">{selectedOrder.notes}</p>
                  </div>
                )}
              </div>
            )}
          </DialogContent>

          {selectedOrder && canCancelOrder(selectedOrder) && (
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => handleCancelOrder(selectedOrder.id)}
                disabled={cancelling === selectedOrder.id}
                className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200 gap-2"
              >
                {cancelling === selectedOrder.id ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Membatalkan...
                  </>
                ) : (
                  <>
                    <Ban className="h-4 w-4" />
                    Batalkan Pesanan
                  </>
                )}
              </Button>
            </DialogFooter>
          )}
        </Dialog>
      </div>
    </div>
  );
}
