import { useState, useEffect, useMemo, useCallback } from 'react';
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { Alert } from '../../components/ui/Alert';
import { Announcement } from '../../components/ui/Announcement';
import { DataTable } from '../../components/ui/DataTable';
import { ImageUpload } from '../../components/ui/ImageUpload';
import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogContent,
  DialogFooter
} from '../../components/ui/Dialog';
import { adminApi } from '../../api/admin';
import { formatPrice } from '../../lib/utils';
import { 
  Package,
  Plus,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  User,
  Tag,
  ShoppingBag,
  Sparkles,
  Loader2
} from 'lucide-react';

export default function Items() {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [toggling, setToggling] = useState(null);

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('create');
  const [editingItem, setEditingItem] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(null);

  // Delete confirmation
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category_id: '',
    size: '',
    condition: 'used',
    price: '',
    stock: '1',
    image_url: ''
  });
  const [formErrors, setFormErrors] = useState({});


  useEffect(() => {
    fetchItems();
    fetchCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter]);

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  const fetchItems = async () => {
    setLoading(true);
    setError('');
    try {
      const params = {
        limit: 100,
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

  const fetchCategories = async () => {
    try {
      const { data } = await adminApi.getCategories();
      setCategories(data.data || []);
    } catch (err) {
      console.error('Failed to fetch categories:', err);
    }
  };

  const handleToggleActive = useCallback(async (itemId) => {
    setToggling(itemId);
    try {
      await adminApi.toggleItemActive(itemId);
      // Update state langsung tanpa fetch ulang
      setItems(prev => prev.map(item => 
        item.id === itemId ? { ...item, is_active: !item.is_active } : item
      ));
    } catch (err) {
      setError('Gagal mengubah status produk');
      console.error(err);
    } finally {
      setToggling(null);
    }
  }, []);

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      category_id: '',
      size: '',
      condition: 'used',
      price: '',
      stock: '1',
      image_url: ''
    });
    setFormErrors({});
  };

  const handleOpenCreate = () => {
    resetForm();
    setModalMode('create');
    setEditingItem(null);
    setShowModal(true);
  };

  const handleOpenEdit = (item) => {
    setFormData({
      name: item.name,
      description: item.description || '',
      category_id: item.category_id?.toString() || '',
      size: item.size || '',
      condition: item.condition || 'used',
      price: item.price?.toString() || '',
      stock: item.stock?.toString() || '1',
      image_url: item.image_full_url || item.image_url || ''
    });
    setModalMode('edit');
    setEditingItem(item);
    setFormErrors({});
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingItem(null);
    resetForm();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = 'Nama produk harus diisi';
    if (!formData.price || parseFloat(formData.price) <= 0) errors.price = 'Harga harus lebih dari 0';
    if (!formData.stock || parseInt(formData.stock) < 0) errors.stock = 'Stok tidak valid';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSubmitting(true);
    setError('');

    try {
      const payload = {
        ...formData,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        category_id: formData.category_id ? parseInt(formData.category_id) : undefined
      };

      if (modalMode === 'create') {
        const { data } = await adminApi.createItem(payload);
        const newItem = data.data || data;
        // Tambahkan category_name dari categories
        const category = categories.find((c) => c.id === newItem.category_id);
        newItem.category_name = category?.name || '';
        // Jika API tidak return image_full_url, gunakan image_url dari form
        if (!newItem.image_full_url && formData.image_url) {
          newItem.image_full_url = formData.image_url;
        }
        // Tambah ke state tanpa fetch ulang
        setItems((prev) => [newItem, ...prev]);
        setSuccessMessage('Produk berhasil ditambahkan');
      } else {
        const { data } = await adminApi.updateItem(editingItem.id, payload);
        const updatedItem = data.data || data;
        // Tambahkan category_name dari categories
        const category = categories.find((c) => c.id === updatedItem.category_id);
        updatedItem.category_name = category?.name || '';
        // Jika API tidak return image_full_url, gunakan image_url dari form
        if (!updatedItem.image_full_url && formData.image_url) {
          updatedItem.image_full_url = formData.image_url;
        }
        // Update state langsung tanpa fetch ulang
        setItems((prev) =>
          prev.map((item) =>
            item.id === editingItem.id ? { ...item, ...updatedItem } : item
          )
        );
        setSuccessMessage('Produk berhasil diupdate');
      }

      handleCloseModal();
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal menyimpan produk');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteClick = (item) => {
    setItemToDelete(item);
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;

    setDeleting(itemToDelete.id);
    setError('');

    try {
      await adminApi.deleteItem(itemToDelete.id);
      // Hapus dari state langsung tanpa fetch ulang
      setItems(prev => prev.filter(item => item.id !== itemToDelete.id));
      setSuccessMessage('Produk berhasil dihapus');
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal menghapus produk');
    } finally {
      setDeleting(null);
      setShowDeleteConfirm(false);
      setItemToDelete(null);
    }
  };

  const getConditionBadge = (condition) => {
    const variants = {
      new: 'bg-emerald-100 text-emerald-700 border-emerald-200',
      like_new: 'bg-blue-100 text-blue-700 border-blue-200',
      good: 'bg-amber-100 text-amber-700 border-amber-200',
      used: 'bg-slate-100 text-slate-700 border-slate-200',
    };
    return variants[condition] || variants.used;
  };

  const getConditionLabel = (condition) => {
    const labels = {
      new: 'Baru',
      like_new: 'Seperti Baru',
      good: 'Baik',
      used: 'Bekas',
    };
    return labels[condition] || condition;
  };


  // Define columns for TanStack Table
  const columns = useMemo(
    () => [
      {
        accessorKey: 'image_full_url',
        header: 'Gambar',
        cell: ({ row }) => (
          <div className="flex items-center justify-center w-16 h-16 rounded-lg overflow-hidden border border-slate-200">
            {row.original.image_full_url ? (
              <img
                src={row.original.image_full_url}
                alt={row.original.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-slate-50">
                <ShoppingBag className="h-6 w-6 text-slate-400" />
              </div>
            )}
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
        cell: ({ row }) => (
          <Badge className={getConditionBadge(row.original.condition)}>
            {row.original.condition === 'new' && <Sparkles className="h-3 w-3 mr-1" />}
            {getConditionLabel(row.original.condition)}
          </Badge>
        ),
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
            <span>{row.original.seller_name || 'Admin'}</span>
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
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleOpenEdit(row.original)}
              className="px-2"
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant={row.original.is_active ? 'outline' : 'default'}
              size="sm"
              onClick={() => handleToggleActive(row.original.id)}
              disabled={toggling === row.original.id}
              className="px-2"
            >
              {toggling === row.original.id ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : row.original.is_active ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleDeleteClick(row.original)}
              className="px-2 text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
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

        <div className="flex gap-2">
          <Button onClick={handleOpenCreate} className="gap-2">
            <Plus className="h-4 w-4" />
            Tambah Produk
          </Button>
        </div>
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

      {/* Success Message */}
      {successMessage && (
        <Announcement variant="success">{successMessage}</Announcement>
      )}

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
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 mb-4">
                <Package className="h-8 w-8 text-slate-400" />
              </div>
              <p className="text-base font-medium text-slate-900 mb-1">Tidak ada produk ditemukan</p>
              <p className="text-sm text-slate-500 mb-4">Coba ubah filter atau tambah produk baru</p>
              <Button onClick={handleOpenCreate} className="gap-2">
                <Plus className="h-4 w-4" />
                Tambah Produk
              </Button>
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


      {/* Create/Edit Modal */}
      <Dialog open={showModal} onClose={handleCloseModal} className="max-w-2xl">
        <DialogHeader onClose={handleCloseModal}>
          <DialogTitle>
            {modalMode === 'create' ? 'Tambah Produk' : 'Edit Produk'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <DialogContent className="max-h-[60vh] overflow-y-auto space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Nama Produk <span className="text-red-500">*</span>
              </label>
              <Input
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Contoh: Kaos Polos Hitam"
              />
              {formErrors.name && (
                <p className="text-sm text-red-600 mt-1">{formErrors.name}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Deskripsi
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Deskripsikan produk..."
                className="w-full border border-slate-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all resize-none"
                rows="3"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Kategori
                </label>
                <select
                  name="category_id"
                  value={formData.category_id}
                  onChange={handleChange}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                >
                  <option value="">Pilih Kategori</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Ukuran
                </label>
                <Input
                  name="size"
                  value={formData.size}
                  onChange={handleChange}
                  placeholder="S, M, L, XL, 42, dll"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Kondisi <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-3">
                {[
                  { value: 'new', label: 'Baru' },
                  { value: 'like_new', label: 'Seperti Baru' },
                  { value: 'used', label: 'Bekas' },
                ].map((opt) => (
                  <label
                    key={opt.value}
                    className={`flex-1 flex items-center justify-center gap-2 p-3 border-2 rounded-lg cursor-pointer transition-all ${
                      formData.condition === opt.value
                        ? 'border-indigo-500 bg-indigo-50'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="condition"
                      value={opt.value}
                      checked={formData.condition === opt.value}
                      onChange={handleChange}
                      className="sr-only"
                    />
                    <span className="text-sm font-medium">{opt.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Harga (Rp) <span className="text-red-500">*</span>
                </label>
                <Input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="50000"
                  min="0"
                />
                {formErrors.price && (
                  <p className="text-sm text-red-600 mt-1">{formErrors.price}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Stok <span className="text-red-500">*</span>
                </label>
                <Input
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={handleChange}
                  placeholder="1"
                  min="0"
                />
                {formErrors.stock && (
                  <p className="text-sm text-red-600 mt-1">{formErrors.stock}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Gambar Produk
              </label>
              <ImageUpload
                value={formData.image_url}
                onChange={(url) => setFormData(prev => ({ ...prev, image_url: url }))}
              />
            </div>
          </DialogContent>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleCloseModal}
              disabled={submitting}
            >
              Batal
            </Button>
            <Button type="submit" disabled={submitting} className="gap-2">
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Menyimpan...
                </>
              ) : (
                modalMode === 'create' ? 'Tambah Produk' : 'Simpan Perubahan'
              )}
            </Button>
          </DialogFooter>
        </form>
      </Dialog>


      {/* Delete Confirmation Dialog */}
      <Dialog
        open={showDeleteConfirm}
        onClose={() => {
          setShowDeleteConfirm(false);
          setItemToDelete(null);
        }}
        className="max-w-md"
      >
        <DialogHeader>
          <DialogTitle>Hapus Produk</DialogTitle>
        </DialogHeader>
        <DialogContent>
          <p className="text-slate-600">
            Apakah Anda yakin ingin menghapus produk <strong>"{itemToDelete?.name}"</strong>?
            Tindakan ini tidak dapat dibatalkan.
          </p>
        </DialogContent>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => {
              setShowDeleteConfirm(false);
              setItemToDelete(null);
            }}
            disabled={deleting}
          >
            Batal
          </Button>
          <Button
            onClick={handleConfirmDelete}
            disabled={deleting}
            className="bg-red-600 hover:bg-red-700 gap-2"
          >
            {deleting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Menghapus...
              </>
            ) : (
              <>
                <Trash2 className="h-4 w-4" />
                Hapus
              </>
            )}
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
}
