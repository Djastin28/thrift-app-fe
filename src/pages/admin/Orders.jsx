import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { Alert } from '../../components/ui/Alert';
import { adminApi } from '../../api/admin';
import { formatPrice } from '../../lib/utils';
import { 
  ChevronLeft,
  ChevronRight,
  ShoppingCart,
  Eye,
  X,
  Package,
  User,
  MapPin,
  CreditCard,
  Calendar,
  Clock,
  Truck,
  CheckCircle2,
  XCircle
} from 'lucide-react';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [updating, setUpdating] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);

  useEffect(() => {
    fetchOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, statusFilter]);

  const fetchOrders = async () => {
    setLoading(true);
    setError('');
    try {
      const params = {
        page,
        limit: 10,
        ...(statusFilter !== 'all' && { status: statusFilter }),
      };
      const { data } = await adminApi.getOrders(params);
      setOrders(data.data || data.orders || []);
      setTotalPages(data.pagination?.total_pages || 1);
    } catch (err) {
      setError('Gagal memuat data pesanan');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchOrderDetail = async (orderId) => {
    setDetailLoading(true);
    try {
      const { data } = await adminApi.getOrderById(orderId);
      setSelectedOrder(data.data || data);
    } catch (err) {
      setError('Gagal memuat detail pesanan');
      console.error(err);
    } finally {
      setDetailLoading(false);
    }
  };

  const handleUpdateStatus = async (orderId, newStatus) => {
    setUpdating(orderId);
    try {
      await adminApi.updateOrderStatus(orderId, newStatus);
      await fetchOrders();
      if (selectedOrder?.id === orderId) {
        await fetchOrderDetail(orderId);
      }
    } catch (err) {
      setError('Gagal mengubah status pesanan');
      console.error(err);
    } finally {
      setUpdating(null);
    }
  };

  const handleUpdatePaymentStatus = async (orderId, newStatus) => {
    setUpdating(orderId);
    try {
      await adminApi.updatePaymentStatus(orderId, newStatus);
      await fetchOrders();
      if (selectedOrder?.id === orderId) {
        await fetchOrderDetail(orderId);
      }
    } catch (err) {
      setError('Gagal mengubah status pembayaran');
      console.error(err);
    } finally {
      setUpdating(null);
    }
  };

  const getStatusBadge = (status) => {
    const variants = {
      pending: 'bg-amber-100 text-amber-700 border-amber-200',
      processing: 'bg-blue-100 text-blue-700 border-blue-200',
      shipped: 'bg-indigo-100 text-indigo-700 border-indigo-200',
      delivered: 'bg-emerald-100 text-emerald-700 border-emerald-200',
      cancelled: 'bg-slate-100 text-slate-700 border-slate-200',
    };
    return variants[status] || variants.pending;
  };

  const getStatusIcon = (status) => {
    const icons = {
      pending: Clock,
      processing: Package,
      shipped: Truck,
      delivered: CheckCircle2,
      cancelled: XCircle,
    };
    return icons[status] || Clock;
  };

  const getPaymentBadge = (status) => {
    const variants = {
      pending: 'bg-amber-100 text-amber-700 border-amber-200',
      paid: 'bg-emerald-100 text-emerald-700 border-emerald-200',
      failed: 'bg-red-100 text-red-700 border-red-200',
    };
    return variants[status] || variants.pending;
  };

  const getStatusLabel = (status) => {
    const labels = {
      pending: 'Pending',
      processing: 'Diproses',
      shipped: 'Dikirim',
      delivered: 'Selesai',
      cancelled: 'Dibatalkan',
    };
    return labels[status] || status;
  };

  const getPaymentLabel = (status) => {
    const labels = {
      pending: 'Belum Bayar',
      paid: 'Lunas',
      failed: 'Gagal',
    };
    return labels[status] || status;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <>
      <div className="space-y-4">
        {/* Status Filter */}
        <Card>
          <CardContent className="p-4">
            <div className="flex gap-2 overflow-x-auto">
              {['all', 'pending', 'processing', 'shipped', 'delivered', 'cancelled'].map((status) => (
                <Button
                  key={status}
                  variant={statusFilter === status ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => {
                    setStatusFilter(status);
                    setPage(1);
                  }}
                  className="whitespace-nowrap"
                >
                  {status === 'all' ? 'Semua' : getStatusLabel(status)}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Error Alert */}
        {error && (
          <Alert variant="error">
            <div className="flex items-center justify-between">
              <span>{error}</span>
              <Button variant="outline" size="sm" onClick={fetchOrders}>
                Coba Lagi
              </Button>
            </div>
          </Alert>
        )}

        {/* Orders List */}
        <Card>
          <CardHeader className="border-b border-slate-100">
            <CardTitle className="text-base">Daftar Pesanan</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <LoadingSpinner />
              </div>
            ) : orders.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-amber-100 to-orange-100 mb-4">
                  <ShoppingCart className="h-8 w-8 text-amber-600" />
                </div>
                <p className="text-base font-medium text-slate-900 mb-1">Tidak ada pesanan ditemukan</p>
                <p className="text-sm text-slate-500">Coba ubah filter status pesanan</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {orders.map((order) => (
                  <div key={order.id} className="p-4 hover:bg-slate-50 transition-colors">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                          <p className="text-sm font-semibold text-slate-900">
                            Order #{order.id}
                          </p>
                          <Badge className={getStatusBadge(order.status)}>
                            {(() => {
                              const StatusIcon = getStatusIcon(order.status);
                              return <StatusIcon className="h-3 w-3 mr-1.5" />;
                            })()}
                            {getStatusLabel(order.status)}
                          </Badge>
                          <Badge className={getPaymentBadge(order.payment_status)}>
                            <CreditCard className="h-3 w-3 mr-1.5" />
                            {getPaymentLabel(order.payment_status)}
                          </Badge>
                        </div>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-xs text-slate-500">
                          <div className="flex items-center gap-1">
                            <User className="h-3.5 w-3.5" />
                            <span className="truncate">{order.customer_name}</span>
                          </div>
                          <span className="hidden sm:inline">•</span>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3.5 w-3.5" />
                            <span>{formatDate(order.created_at)}</span>
                          </div>
                          <span className="hidden sm:inline">•</span>
                          <span className="font-semibold text-indigo-600">
                            {formatPrice(order.total_amount)}
                          </span>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => fetchOrderDetail(order.id)}
                        className="w-full sm:w-auto"
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        Detail
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Pagination */}
        {!loading && orders.length > 0 && (
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-slate-600">
                  Halaman {page} dari {totalPages}
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    <span className="hidden sm:inline ml-1">Sebelumnya</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                  >
                    <span className="hidden sm:inline mr-1">Selanjutnya</span>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setSelectedOrder(null)}
          />
          <Card className="relative w-full max-w-2xl my-8 animate-fadeIn">
            <CardHeader className="border-b border-slate-100">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Detail Pesanan #{selectedOrder.id}</CardTitle>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSelectedOrder(null)}
                  className="h-8 w-8"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              {detailLoading ? (
                <div className="flex items-center justify-center py-8">
                  <LoadingSpinner />
                </div>
              ) : (
                <>
                  {/* Status */}
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900 mb-3">Status Pesanan</h3>
                    <div className="flex flex-wrap gap-2">
                      {['pending', 'processing', 'shipped', 'delivered', 'cancelled'].map((status) => (
                        <Button
                          key={status}
                          variant={selectedOrder.status === status ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => handleUpdateStatus(selectedOrder.id, status)}
                          disabled={updating === selectedOrder.id}
                        >
                          {getStatusLabel(status)}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Payment Status */}
                  <div className="border-t border-slate-100 pt-4">
                    <h3 className="text-sm font-semibold text-slate-900 mb-3">Status Pembayaran</h3>
                    <div className="flex flex-wrap gap-2">
                      {['pending', 'paid', 'failed'].map((status) => (
                        <Button
                          key={status}
                          variant={selectedOrder.payment_status === status ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => handleUpdatePaymentStatus(selectedOrder.id, status)}
                          disabled={updating === selectedOrder.id}
                        >
                          {getPaymentLabel(status)}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Customer Info */}
                  <div className="border-t border-slate-100 pt-4">
                    <h3 className="text-sm font-semibold text-slate-900 mb-3">Informasi Pelanggan</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-slate-400" />
                        <span className="text-slate-600">Nama:</span>
                        <span className="font-medium">{selectedOrder.customer_name}</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <MapPin className="h-4 w-4 text-slate-400 mt-0.5" />
                        <div>
                          <span className="text-slate-600">Alamat:</span>
                          <p className="font-medium">{selectedOrder.shipping_address}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <CreditCard className="h-4 w-4 text-slate-400" />
                        <span className="text-slate-600">Metode Pembayaran:</span>
                        <span className="font-medium">{selectedOrder.payment_method || 'Transfer Bank'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Items */}
                  <div className="border-t border-slate-100 pt-4">
                    <h3 className="text-sm font-semibold text-slate-900 mb-3">Produk</h3>
                    <div className="space-y-3">
                      {selectedOrder.items?.map((item, index) => (
                        <div key={index} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                          <div className="h-12 w-12 rounded bg-slate-200 flex items-center justify-center flex-shrink-0">
                            <Package className="h-6 w-6 text-slate-400" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-slate-900 truncate">{item.item_name}</p>
                            <p className="text-xs text-slate-500">
                              {item.quantity}x {formatPrice(item.price)}
                            </p>
                          </div>
                          <p className="text-sm font-semibold text-slate-900">
                            {formatPrice(item.quantity * item.price)}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Total */}
                  <div className="border-t border-slate-100 pt-4">
                    <div className="flex items-center justify-between">
                      <span className="text-base font-semibold text-slate-900">Total</span>
                      <span className="text-xl font-bold text-indigo-600">
                        {formatPrice(selectedOrder.total_amount)}
                      </span>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
}
