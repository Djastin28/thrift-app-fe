import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { Alert } from '../../components/ui/Alert';
import { adminApi } from '../../api/admin';
import { 
  Plus,
  Edit2,
  Trash2,
  FolderTree,
  X,
  Layers,
  Grid3x3
} from 'lucide-react';

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create'); // 'create' or 'edit'
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [formData, setFormData] = useState({ name: '' });
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await adminApi.getCategories();
      setCategories(data.data || data.categories || []);
    } catch (err) {
      setError('Gagal memuat data kategori');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const openCreateModal = () => {
    setModalMode('create');
    setFormData({ name: '' });
    setSelectedCategory(null);
    setModalOpen(true);
  };

  const openEditModal = (category) => {
    setModalMode('edit');
    setFormData({ name: category.name });
    setSelectedCategory(category);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setFormData({ name: '' });
    setSelectedCategory(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    setSubmitting(true);
    try {
      if (modalMode === 'create') {
        await adminApi.createCategory(formData);
      } else {
        await adminApi.updateCategory(selectedCategory.id, formData);
      }
      await fetchCategories();
      closeModal();
    } catch (err) {
      setError(`Gagal ${modalMode === 'create' ? 'membuat' : 'mengubah'} kategori`);
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Apakah Anda yakin ingin menghapus kategori ini?')) return;

    setDeleting(id);
    try {
      await adminApi.deleteCategory(id);
      await fetchCategories();
    } catch (err) {
      setError('Gagal menghapus kategori');
      console.error(err);
    } finally {
      setDeleting(null);
    }
  };

  return (
    <>
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Kategori</h2>
            <p className="text-sm text-slate-500 mt-1">Kelola kategori produk</p>
          </div>
          <Button onClick={openCreateModal} className="gap-2">
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Tambah Kategori</span>
            <span className="sm:hidden">Tambah</span>
          </Button>
        </div>

        {/* Error Alert */}
        {error && (
          <Alert variant="error">
            <div className="flex items-center justify-between">
              <span>{error}</span>
              <Button variant="outline" size="sm" onClick={fetchCategories}>
                Coba Lagi
              </Button>
            </div>
          </Alert>
        )}

        {/* Categories List */}
        <Card>
          <CardContent className="p-0">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <LoadingSpinner />
              </div>
            ) : categories.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 mb-4">
                  <Layers className="h-8 w-8 text-indigo-600" />
                </div>
                <p className="text-base font-medium text-slate-900 mb-1">Belum ada kategori</p>
                <p className="text-sm text-slate-500 mb-4">Buat kategori pertama untuk mengorganisir produk</p>
                <Button variant="default" size="sm" onClick={openCreateModal} className="gap-2">
                  <Plus className="h-4 w-4" />
                  Tambah Kategori Pertama
                </Button>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {categories.map((category) => (
                  <div
                    key={category.id}
                    className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors group"
                  >
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-100 flex-shrink-0 group-hover:from-indigo-100 group-hover:to-purple-100 transition-colors">
                        <Grid3x3 className="h-6 w-6 text-indigo-600" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-slate-900 truncate">
                          {category.name}
                        </p>
                        <p className="text-xs text-slate-500 mt-0.5">
                          ID: {category.id}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEditModal(category)}
                        className="h-8 w-8 p-0"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(category.id)}
                        disabled={deleting === category.id}
                        className="h-8 w-8 p-0 text-red-600 hover:bg-red-50 hover:border-red-200"
                      >
                        {deleting === category.id ? (
                          <LoadingSpinner className="h-3.5 w-3.5" />
                        ) : (
                          <Trash2 className="h-3.5 w-3.5" />
                        )}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={closeModal}
          />
          <Card className="relative w-full max-w-md animate-fadeIn">
            <CardHeader className="border-b border-slate-100">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">
                  {modalMode === 'create' ? 'Tambah Kategori' : 'Edit Kategori'}
                </CardTitle>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={closeModal}
                  className="h-8 w-8"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Nama Kategori
                  </label>
                  <Input
                    type="text"
                    placeholder="Contoh: Elektronik"
                    value={formData.name}
                    onChange={(e) => setFormData({ name: e.target.value })}
                    required
                    autoFocus
                  />
                </div>
                <div className="flex gap-3 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={closeModal}
                    className="flex-1"
                    disabled={submitting}
                  >
                    Batal
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1"
                    disabled={submitting || !formData.name.trim()}
                  >
                    {submitting ? (
                      <>
                        <LoadingSpinner className="h-4 w-4 mr-2" />
                        Menyimpan...
                      </>
                    ) : (
                      modalMode === 'create' ? 'Tambah' : 'Simpan'
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
}
