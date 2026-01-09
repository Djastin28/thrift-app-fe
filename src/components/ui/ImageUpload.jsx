import { useState, useRef } from 'react';
import { Upload, X, Image, Link, Loader2 } from 'lucide-react';
import { Button } from './Button';
import { Input } from './Input';
import { cn } from '../../lib/utils';

// Free image hosting via ImgBB (get free API key at https://api.imgbb.com/)
const IMGBB_API_KEY = import.meta.env.VITE_IMGBB_API_KEY || '';

export function ImageUpload({ value, onChange, className }) {
  const [mode, setMode] = useState('url'); // 'url' or 'upload'
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [preview, setPreview] = useState(value || '');
  const fileInputRef = useRef(null);

  const handleUrlChange = (e) => {
    const url = e.target.value;
    setPreview(url);
    onChange(url);
    setError('');
  };

  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('File harus berupa gambar');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Ukuran file maksimal 5MB');
      return;
    }

    setError('');

    // Show local preview immediately
    const localPreview = URL.createObjectURL(file);
    setPreview(localPreview);

    // If ImgBB API key is configured, upload to ImgBB
    if (IMGBB_API_KEY) {
      await uploadToImgBB(file);
    } else {
      // Convert to base64 as fallback (not recommended for production)
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64 = e.target?.result;
        onChange(base64);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadToImgBB = async (file) => {
    setUploading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        const imageUrl = data.data.url;
        setPreview(imageUrl);
        onChange(imageUrl);
      } else {
        setError('Gagal upload gambar');
      }
    } catch (err) {
      setError('Gagal upload gambar');
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = () => {
    setPreview('');
    onChange('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className={cn('space-y-3', className)}>
      {/* Mode Toggle */}
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setMode('url')}
          className={cn(
            'flex items-center gap-2 px-3 py-1.5 text-sm rounded-lg transition-colors',
            mode === 'url'
              ? 'bg-slate-900 text-white'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          )}
        >
          <Link className="h-4 w-4" />
          URL
        </button>
        <button
          type="button"
          onClick={() => setMode('upload')}
          className={cn(
            'flex items-center gap-2 px-3 py-1.5 text-sm rounded-lg transition-colors',
            mode === 'upload'
              ? 'bg-slate-900 text-white'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          )}
        >
          <Upload className="h-4 w-4" />
          Upload
        </button>
      </div>

      {/* URL Input */}
      {mode === 'url' && (
        <Input
          type="url"
          value={value || ''}
          onChange={handleUrlChange}
          placeholder="https://example.com/image.jpg"
        />
      )}

      {/* File Upload */}
      {mode === 'upload' && (
        <div
          onClick={() => fileInputRef.current?.click()}
          className={cn(
            'border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors',
            'hover:border-indigo-400 hover:bg-indigo-50/50',
            uploading ? 'border-indigo-400 bg-indigo-50/50' : 'border-slate-200'
          )}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />
          {uploading ? (
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="h-8 w-8 text-indigo-500 animate-spin" />
              <p className="text-sm text-slate-600">Mengupload...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <Upload className="h-8 w-8 text-slate-400" />
              <p className="text-sm text-slate-600">
                Klik untuk pilih gambar
              </p>
              <p className="text-xs text-slate-400">
                PNG, JPG, WEBP (max 5MB)
              </p>
            </div>
          )}
        </div>
      )}

      {/* Error */}
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}

      {/* Preview */}
      {preview && (
        <div className="relative">
          <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
            <img
              src={preview}
              alt="Preview"
              className="w-full h-full object-contain"
              onError={() => setError('Gambar tidak dapat dimuat')}
            />
          </div>
          <button
            type="button"
            onClick={handleRemove}
            className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Help text */}
      {!IMGBB_API_KEY && mode === 'upload' && (
        <p className="text-xs text-amber-600">
          Tip: Untuk upload gambar, tambahkan VITE_IMGBB_API_KEY di file .env
        </p>
      )}
    </div>
  );
}
