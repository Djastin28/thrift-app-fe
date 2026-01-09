import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';
import { SkeletonCard } from '../../components/ui/Skeleton';
import { Alert } from '../../components/ui/Alert';
import { Announcement } from '../../components/ui/Announcement';
import { EmptyState } from '../../components/ui/EmptyState';
import { ImageUpload } from '../../components/ui/ImageUpload';
import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogContent,
  DialogFooter
} from '../../components/ui/Dialog';
import { itemsApi, categoriesApi } from '../../api/items';
import { useAuthStore } from '../../store/authStore';
import { formatPrice } from '../../lib/utils';
import {
  Package,
  Plus,
  Edit,
  Trash2,
  Eye,
  Sparkles,
  ShoppingBag,
  Loader2,
  AlertCircle,
  ImageIcon
} from 'lucide-react';

export default function MyItems() {
  const { user } = useAuthStore();
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  
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
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [itemsRes, categoriesRes] = await Promise.all([
        itemsApi.getAll({ user_id: user?.id }),
        categoriesApi.getAll()
      ]);
      
      const userItems = itemsRes.data.data.filter(item => item.user_id === user?.id);
      setItems(userItems);
      setCategories(categoriesRes.data.data || []);
    } catch (err) {
      setError('Gagal memuat data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

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
      category_id: item.category_id || '',
      size: item.size || '',
      condition: item.condition,
      price: item.price,
      stock: item.stock.toString(),
      image_url: item.image_url || ''
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
    
    if (!formData.name.trim()) {
      errors.name = 'Nama produk harus diisi';
    }
    
    if (!formData.price || parseFloat(formData.price) <= 0) {
      errors.price = 'Harga harus lebih dari 0';
    }
    
    if (!formData.stock || parseInt(formData.stock) < 0) {
      errors.stock = 'Stok tidak valid';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

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
        await itemsApi.create(payload);
        setSuccessMessage('Produk berhasil ditambahkan');
      } else {
        await itemsApi.update(editingItem.id, payload);
        setSuccessMessage('Produk berhasil diupdate');
      }

      handleCloseModal();
      fetchData();
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
      await itemsApi.delete(itemToDelete.id);
      setSuccessMessage('Produk berhasil dihapus');
      fetchData();
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal menghapus produk');
    } finally {
      setDeleting(null);
      setShowDeleteConfirm(false);
      setItemToDelete(null);
    }
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

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              <Package className="h-6 w-6" />
              Produk Saya
            </h1>
            <p className="text-slate-500 mt-1">
              Kelola produk yang Anda jual
            </p>
          </div>
          <Button onClick={handleOpenCreate} className="gap-2">
            <Plus className="h-4 w-4" />
            Tambah Produk
          </Button>
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

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200">
            <EmptyState
              icon={ShoppingBag}
              title="Belum Ada Produk"
              description="Mulai jual barang preloved Anda sekarang"
              action={
                <Button onClick={handleOpenCreate} className="gap-2">
                  <Plus className="h-4 w-4" />
                  Tambah Produk Pertama
                </Button>
              }
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="group bg-white rounded-xl border border-slate-200 overflow-hidden hover:border-slate-300 hover:shadow-lg transition-all"
              >
                <div className="relative aspect-square bg-slate-100 overflow-hidden">
                  {item.image_full_url ? (
                    <img
                      src={item.image_full_url}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ImageIcon className="h-12 w-12 text-slate-300" />
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
                  {!item.is_active && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                      <Badge className="bg-red-600 text-white border-red-600">
                        Tidak Aktif
                      </Badge>
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-medium text-slate-900 line-clamp-2 text-sm min-h-[2.5rem]">
                    {item.name}
                  </h3>
                  <p className="text-lg font-bold text-slate-900 mt-2">
                    {formatPrice(item.price)}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    Stok: {item.stock}
                  </p>
                  
                  <div className="flex gap-2 mt-4">
                    <Link to={`/items/${item.id}`} className="flex-1">
                      <Button variant="outline" size="sm" className="w-full gap-1">
                        <Eye className="h-3 w-3" />
                        Lihat
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleOpenEdit(item)}
                      className="px-3"
                    >
                      <Edit className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteClick(item)}
                      className="px-3 text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

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
                  placeholder="Deskripsikan produk Anda..."
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
    </div>
  );
}
