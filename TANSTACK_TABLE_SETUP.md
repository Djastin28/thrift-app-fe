# TanStack Table Setup

## Installation

Jalankan command berikut untuk menginstall TanStack Table:

```bash
npm install @tanstack/react-table
```

## Features yang Sudah Diimplementasi

### DataTable Component (`src/components/ui/DataTable.jsx`)
- ✅ Client-side pagination
- ✅ Client-side sorting (klik header untuk sort)
- ✅ Client-side filtering/search
- ✅ Responsive design
- ✅ Customizable columns
- ✅ Page navigation (First, Previous, Next, Last)

### Halaman yang Menggunakan TanStack Table

#### 1. Items Management (`src/pages/admin/Items.jsx`)
**Columns:**
- Gambar produk
- Nama produk (sortable, searchable)
- Harga (sortable)
- Kondisi
- Kategori
- Penjual
- Status (Aktif/Nonaktif)
- Aksi (Toggle Active)

**Features:**
- Search by nama produk
- Filter by status (All/Active/Inactive)
- Sort by any column
- 10 items per page

#### 2. Users Management (`src/pages/admin/Users.jsx`)
**Columns:**
- Avatar & Nama pengguna (sortable, searchable)
- Role (Admin/Customer)
- Status (Aktif/Nonaktif)
- Tanggal bergabung
- Aksi (Change Role, Toggle Active)

**Features:**
- Search by nama atau email
- Filter by role (All/Customer/Admin)
- Sort by any column
- 10 users per page

## Cara Menggunakan DataTable

```jsx
import { DataTable } from '../../components/ui/DataTable';

// Define columns
const columns = [
  {
    accessorKey: 'name',
    header: 'Name',
    cell: ({ row }) => <span>{row.original.name}</span>,
  },
  // ... more columns
];

// Use in component
<DataTable
  columns={columns}
  data={data}
  searchKey="name"
  searchPlaceholder="Search..."
  pageSize={10}
/>
```

## Benefits

1. **Performance**: Client-side operations sangat cepat untuk dataset kecil-menengah
2. **User Experience**: Instant search, sort, dan pagination tanpa API calls
3. **Flexibility**: Mudah customize columns dan cell rendering
4. **Responsive**: Table responsive dengan horizontal scroll
5. **Type-safe**: Full TypeScript support (jika menggunakan TS)

## Notes

- Untuk dataset besar (>1000 rows), pertimbangkan server-side pagination
- TanStack Table v8 adalah library headless, jadi styling sepenuhnya customizable
- Semua state management (sorting, filtering, pagination) handled by library
