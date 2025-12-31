# ThriftShop - E-Commerce Marketplace

![React](https://img.shields.io/badge/React-19.x-61DAFB?logo=react)
![Vite](https://img.shields.io/badge/Vite-7.x-646CFF?logo=vite)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.x-06B6D4?logo=tailwindcss)

Aplikasi frontend e-commerce marketplace untuk jual beli barang bekas berkualitas. Dibangun dengan React + Vite + Tailwind CSS.

## 📸 Screenshots

| Home Page | Admin Dashboard |
|-----------|-----------------|
| Hero section dengan kategori produk | Dashboard dengan statistik dan sidebar |

## ✨ Features

### Customer
- 🛒 Browse dan cari produk
- 🛍️ Keranjang belanja
- 📦 Checkout dan order management
- 👤 Profile management
- 📝 Jual barang sendiri

### Admin
- 📊 Dashboard dengan statistik
- 👥 User management
- 📁 Category management
- 📦 Item moderation
- 🛒 Order management

## 🛠️ Tech Stack

- **Framework:** React 19
- **Build Tool:** Vite 7
- **Styling:** Tailwind CSS 4
- **State Management:** Zustand
- **Routing:** React Router v6
- **HTTP Client:** Axios
- **Form Handling:** React Hook Form + Zod
- **Icons:** Lucide React

## 📋 Prerequisites

Sebelum menjalankan project ini, pastikan sudah terinstall:

- [Node.js](https://nodejs.org/) v18 atau lebih baru
- [npm](https://www.npmjs.com/) v9 atau lebih baru
- Backend API Laravel (lihat bagian Backend Setup)

## 🚀 Getting Started

### 1. Clone Repository

```bash
git clone <repository-url>
cd thrift-app
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Setup

Buat file `.env` di root folder:

```env
VITE_API_URL=http://localhost:8000/api
```

> **Note:** Sesuaikan `VITE_API_URL` dengan URL backend API Anda.

### 4. Run Development Server

```bash
npm run dev
```

Aplikasi akan berjalan di `http://localhost:5173`

## 📜 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Menjalankan development server |
| `npm run build` | Build untuk production |
| `npm run preview` | Preview production build |
| `npm run lint` | Jalankan ESLint |

## 🔐 Default Login Credentials

Untuk testing, gunakan akun default dari seeder backend:

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@example.com | password |
| Customer | customer@example.com | password |

## 📁 Project Structure

```
src/
├── api/                    # API layer (axios instance & endpoints)
│   ├── axios.js           # Axios configuration
│   └── auth.js            # Auth API calls
├── components/
│   ├── layout/            # Layout components
│   │   ├── Header.jsx
│   │   ├── Footer.jsx
│   │   └── AdminLayout.jsx
│   ├── shared/            # Shared/reusable components
│   └── ui/                # UI components (Button, Input, etc.)
├── lib/
│   └── utils.js           # Utility functions
├── pages/
│   ├── admin/             # Admin pages
│   │   ├── Dashboard.jsx
│   │   ├── Users.jsx
│   │   ├── Categories.jsx
│   │   ├── Items.jsx
│   │   └── Orders.jsx
│   ├── auth/              # Auth pages
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   └── Profile.jsx
│   └── customer/          # Customer pages
│       ├── Home.jsx
│       ├── Cart.jsx
│       ├── Orders.jsx
│       └── MyItems.jsx
├── store/
│   └── authStore.js       # Zustand auth store
├── App.jsx                # Main app with routing
├── main.jsx               # Entry point
└── index.css              # Global styles & CSS variables
```

## 🔗 Backend Setup

Project ini membutuhkan backend Laravel API. Pastikan:

1. Backend Laravel sudah running di `http://localhost:8000`
2. CORS sudah dikonfigurasi untuk menerima request dari frontend
3. Database sudah di-migrate dan di-seed

Dokumentasi API tersedia di folder `docs/`:
- `API_DOCUMENTATION.md` - Dokumentasi endpoint API
- `BACKEND_DOCUMENTATION.md` - Dokumentasi backend
- `FRONTEND_INTEGRATION_GUIDE.md` - Panduan integrasi

## 🎨 Color Scheme

Aplikasi menggunakan color scheme emerald/teal:

| Variable | Value | Usage |
|----------|-------|-------|
| `--primary` | Emerald 500 | Primary buttons, links |
| `--accent` | Orange 500 | Highlights, badges |
| `--sidebar` | Dark teal | Admin sidebar |

## 🤝 Contributing

1. Fork repository
2. Buat feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push ke branch (`git push origin feature/AmazingFeature`)
5. Buat Pull Request

## 📝 License

Distributed under the MIT License.

## 📞 Support

Jika ada pertanyaan atau masalah, silakan buat issue di repository ini.
