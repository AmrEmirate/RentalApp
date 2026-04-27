# 🏘️ RentalApp

Frontend aplikasi sistem peminjaman fasilitas warga RT, dibangun dengan **Next.js 16**, **TypeScript**, dan **Tailwind CSS**.

---

## 📋 Deskripsi

RentalApp adalah antarmuka web untuk sistem manajemen peminjaman barang/fasilitas RT. Aplikasi ini menyediakan tampilan berbeda sesuai peran pengguna:

- **RT** — Dashboard admin lengkap: kelola warga, barang, persetujuan peminjaman, dan laporan
- **WARGA** — Portal mandiri: lihat katalog fasilitas, ajukan peminjaman, dan pantau riwayat

---

## 🛠️ Tech Stack

| Layer | Teknologi |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| Bahasa | TypeScript 5.7 |
| Styling | Tailwind CSS v4 |
| UI Components | shadcn/ui + Radix UI |
| State & Forms | React Hook Form + Zod |
| Charts | Recharts |
| Icons | Lucide React |
| HTTP Client | Fetch API (native) |
| Notifikasi | Sonner |
| Package Manager | pnpm |

---

## 📁 Struktur Proyek

```
RentalApp/
├── public/                 # Aset statis (favicon, gambar)
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   └── login/      # Halaman login
│   │   └── (dashboard)/
│   │       └── dashboard/
│   │           ├── page.tsx         # Dashboard utama (Warga)
│   │           ├── katalog/         # Katalog barang
│   │           ├── pinjam/[id]/     # Form pengajuan pinjam
│   │           ├── pinjaman/        # Daftar peminjaman aktif
│   │           ├── riwayat/         # Riwayat peminjaman
│   │           ├── profil/          # Profil pengguna
│   │           └── rt/              # Modul khusus RT
│   │               ├── page.tsx         # Dashboard RT
│   │               ├── facilities/      # Kelola fasilitas/barang
│   │               ├── warga/           # Kelola data warga
│   │               ├── reports/         # Laporan & statistik
│   │               └── settings/        # Pengaturan
│   ├── components/
│   │   ├── dashboard/      # Komponen dashboard (StatCard, FacilityGrid)
│   │   ├── layout/         # Sidebar & Header
│   │   └── ui/             # Komponen UI dasar (shadcn)
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # Utilitas & API client
│   └── middleware.ts        # Auth middleware (route protection)
├── docs/                   # Dokumentasi tambahan
└── styles/                 # Global CSS
```

---

## 🚀 Cara Menjalankan

### 1. Clone & Install

```bash
git clone https://github.com/AmrEmirate/RentalApp.git
cd RentalApp
pnpm install
```

### 2. Setup Environment

Buat file `.env.local` di root project:

```env
# URL Backend API
NEXT_PUBLIC_API_URL=http://localhost:5000

# NextAuth / JWT (opsional jika menggunakan next-auth)
NEXTAUTH_SECRET="your_secret_key"
NEXTAUTH_URL="http://localhost:3000"
```

### 3. Jalankan Development Server

```bash
pnpm dev
```

Buka [http://localhost:3000](http://localhost:3000) di browser.

---

## 🔑 Default Login (Setelah Backend di-seed)

| Role | Username | Password |
|------|----------|----------|
| RT | `rt@rentalapp.com` | `password123` |
| Warga | `08123456789` | `password123` |

---

## 📱 Halaman & Fitur

### Warga
| Halaman | Route | Deskripsi |
|---------|-------|-----------|
| Dashboard | `/dashboard` | Ringkasan info & notifikasi |
| Katalog | `/dashboard/katalog` | Daftar fasilitas tersedia |
| Form Pinjam | `/dashboard/pinjam/[id]` | Ajukan peminjaman |
| Peminjaman Aktif | `/dashboard/pinjaman` | Status pinjaman berjalan |
| Riwayat | `/dashboard/riwayat` | Histori semua peminjaman |
| Profil | `/dashboard/profil` | Edit data diri |

### RT (Admin)
| Halaman | Route | Deskripsi |
|---------|-------|-----------|
| Dashboard RT | `/dashboard/rt` | Statistik & peminjaman pending |
| Kelola Fasilitas | `/dashboard/rt/facilities` | CRUD barang/fasilitas |
| Kelola Warga | `/dashboard/rt/warga` | Manajemen data warga |
| Laporan | `/dashboard/rt/reports` | Laporan peminjaman |
| Pengaturan | `/dashboard/rt/settings` | Konfigurasi sistem |

---

## 🔐 Proteksi Route

Middleware `src/middleware.ts` secara otomatis:
- Redirect ke `/login` jika belum autentikasi
- Redirect ke halaman sesuai role setelah login
- Blokir akses halaman RT untuk role WARGA

---

## 📦 Build Production

```bash
pnpm build
pnpm start
```

---

## 📄 Scripts

| Command | Deskripsi |
|---------|-----------|
| `pnpm dev` | Jalankan development server |
| `pnpm build` | Build untuk production |
| `pnpm start` | Jalankan production server |
| `pnpm lint` | Cek kualitas kode |

---

## 🔗 Backend

Backend API tersedia di: [RentalApp-API](https://github.com/AmrEmirate/RentalApp-API)

Pastikan backend sudah berjalan sebelum menjalankan frontend.

---

## 👤 Author

**Amar** — [GitHub](https://github.com/AmrEmirate)
