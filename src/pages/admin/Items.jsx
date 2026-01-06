import { useState, useEffect, useMemo, useCallback } from 'react';
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { Alert } from '../../components/ui/Alert';
import { DataTable } from '../../components/ui/DataTable';
import { adminApi } from '../../api/admin';
import { formatPrice } from '../../lib/utils';
import { 
  Package,
  Eye,
  EyeOff,
  User,
  Tag,
  Image as ImageIcon,
  ShoppingBag,
  Sparkles
} from 'lucide-react';

export default function Items() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [toggling, setToggling] = useState(null);

  useEffect(() => {
    fetchItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter]);

  const fetchItems = async () => {
    setLoading(true);
    setError('');
    try {
      const params = {
        limit: 100, // Get more items for client-side pagination
        ...(statusFilter !== 'all' && { is_active: statusFilter === 'active' }),
      };
      const { data } = await adminApi.getItems(params);
      setItems(data.data || data.items || []);
    } catch (err) {
      setError('Gagal memuat data produk');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleActive = useCallback(async (itemId) => {
    setToggling(itemId);
    try {
      await adminApi.toggleItemActive(itemId);
      await fetchItems();
    } catch (err) {
      setError('Gagal mengubah status produk');
      console.error(err);
    } finally {
      setToggling(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getConditionBadge = (condition) => {
    const variants = {
      new: 'bg-emerald-100 text-emerald-700 border-emerald-200',
      like_new: 'bg-blue-100 text-blue-700 border-blue-200',
      good: 'bg-amber-100 text-amber-700 border-amber-200',
      fair: 'bg-orange-100 text-orange-700 border-orange-200',
    };
    return variants[condition] || variants.good;
  };

  const getConditionLabel = (condition) => {
    const labels = {
      new: 'Baru',
      like_new: 'Seperti Baru',
      good: 'Baik',
      fair: 'Cukup',
    };
    return labels[condition] || condition;
  };

  // Define columns for TanStack Table
  const columns = useMemo(
    () => [
      {
        accessorKey: 'image_url',
        header: 'Gambar',
        cell: ({ row }) => (
          <div className="flex items-center justify-center w-16 h-16 rounded-lg overflow-hidden border border-slate-200">
            {row.original.image_url ? (
              <img
                src={row.original.image_url}
                alt={row.original.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
            ) : null}
            <div 
              className="w-full h-full flex items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-50"
              style={{ display: row.original.image_url ? 'none' : 'flex' }}
            >
              <ShoppingBag className="h-6 w-6 text-indigo-400" />
            </div>
          </div>
        ),
        enableSorting: false,
      },
      {
        accessorKey: 'name',
        header: 'Nama Produk',
        cell: ({ row }) => (
          <div className="min-w-[200px]">
            <p className="font-semibold text-slate-900">{row.original.name}</p>
            <p className="text-xs text-slate-500 mt-0.5">ID: {row.original.id}</p>
          </div>
        ),
      },
      {
        accessorKey: 'price',
        header: 'Harga',
        cell: ({ row }) => (
          <span className="font-semibold text-indigo-600">
            {formatPrice(row.original.price)}
          </span>
        ),
      },
      {
        accessorKey: 'condition',
        header: 'Kondisi',
        cell: ({ row }) => {
          const conditionIcons = {
            new: Sparkles,
            like_new: Sparkles,
            good: Package,
            fair: Package,
          };
          const Icon = conditionIcons[row.original.condition] || Package;
          
          return (
            <Badge className={getConditionBadge(row.original.condition)}>
              <Icon className="h-3 w-3 mr-1.5" />
              {getConditionLabel(row.original.condition)}
            </Badge>
          );
        },
      },
      {
        accessorKey: 'category_name',
        header: 'Kategori',
        cell: ({ row }) => (
          <div className="flex items-center gap-1.5 text-sm text-slate-600">
            <Tag className="h-3.5 w-3.5" />
            <span>{row.original.category_name || 'Tanpa Kategori'}</span>
          </div>
        ),
      },
      {
        accessorKey: 'seller_name',
        header: 'Penjual',
        cell: ({ row }) => (
          <div className="flex items-center gap-1.5 text-sm text-slate-600">
            <User className="h-3.5 w-3.5" />
            <span>{row.original.seller_name || 'Unknown'}</span>
          </div>
        ),
      },
      {
        accessorKey: 'is_active',
        header: 'Status',
        cell: ({ row }) => (
          <Badge
            className={
              row.original.is_active
                ? 'bg-emerald-100 text-emerald-700 border-emerald-200'
                : 'bg-slate-100 text-slate-700 border-slate-200'
            }
          >
            {row.original.is_active ? 'Aktif' : 'Nonaktif'}
          </Badge>
        ),
      },
      {
        id: 'actions',
        header: 'Aksi',
        cell: ({ row }) => (
          <Button
            variant={row.original.is_active ? 'outline' : 'default'}
            size="sm"
            onClick={() => handleToggleActive(row.original.id)}
            disabled={toggling === row.original.id}
            className="whitespace-nowrap"
          >
            {toggling === row.original.id ? (
              <LoadingSpinner className="h-4 w-4" />
            ) : row.original.is_active ? (
              <>
                <EyeOff className="h-4 w-4 mr-1" />
                Nonaktifkan
              </>
            ) : (
              <>
                <Eye className="h-4 w-4 mr-1" />
                Aktifkan
              </>
            )}
          </Button>
        ),
        enableSorting: false,
      },
    ],
    [toggling, handleToggleActive]
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header & Filters */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Produk</h2>
          <p className="text-sm text-slate-500 mt-1">Kelola produk yang dijual</p>
        </div>

        {/* Status Filter */}
        <div className="flex gap-2">
          <Button
            variant={statusFilter === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setStatusFilter('all')}
          >
            Semua
          </Button>
          <Button
            variant={statusFilter === 'active' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setStatusFilter('active')}
          >
            Aktif
          </Button>
          <Button
            variant={statusFilter === 'inactive' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setStatusFilter('inactive')}
          >
            Nonaktif
          </Button>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert variant="error">
          <div className="flex items-center justify-between">
            <span>{error}</span>
            <Button variant="outline" size="sm" onClick={fetchItems}>
              Coba Lagi
            </Button>
          </div>
        </Alert>
      )}

      {/* Data Table */}
      <Card>
        <CardContent className="p-0">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 mb-4">
                <Package className="h-8 w-8 text-indigo-600" />
              </div>
              <p className="text-base font-medium text-slate-900 mb-1">Tidak ada produk ditemukan</p>
              <p className="text-sm text-slate-500">Coba ubah filter atau kata kunci pencarian</p>
            </div>
          ) : (
            <div className="p-4">
              <DataTable
                columns={columns}
                data={items}
                searchKey="name"
                searchPlaceholder="Cari nama produk..."
                pageSize={10}
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
