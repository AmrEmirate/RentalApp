# Struktur Folder Aplikasi

Dokumentasi lengkap struktur folder dan organisasi kode aplikasi.

## 📁 Top Level Structure

```
aplikasi-peminjaman-warga/
├── app/                    # Next.js App Router - semua pages dan routes
├── components/             # Reusable React components
├── docs/                   # Dokumentasi (Integration, Folder Structure, etc)
├── hooks/                  # Custom React hooks
├── lib/                    # Utility functions dan helpers
├── public/                 # Static assets
├── styles/                 # Global stylesheets
├── .env.local              # Environment variables (create locally)
├── .gitignore
├── tailwind.config.ts      # Tailwind CSS configuration
├── tsconfig.json           # TypeScript configuration
├── next.config.mjs         # Next.js configuration
├── package.json
├── pnpm-lock.yaml
└── README.md
```

## 📂 App Folder (`/app`)

Next.js 16 menggunakan file-based routing di folder `app/`.

```
app/
├── (auth)/                           # Auth route group
│   └── login/
│       └── page.tsx                  # Login page
│
├── (dashboard)/                      # Dashboard route group
│   ├── layout.tsx                    # Dashboard layout (dengan sidebar & header)
│   └── dashboard/                    # Dashboard pages
│       ├── page.tsx                  # Dashboard utama / home
│       ├── katalog/
│       │   ├── page.tsx              # Halaman katalog fasilitas
│       │   └── [id]/
│       │       └── page.tsx          # Detail fasilitas (TODO: akan dibuat)
│       ├── pinjam/
│       │   └── [id]/
│       │       └── page.tsx          # Form peminjaman untuk fasilitas tertentu
│       ├── pinjaman/
│       │   └── page.tsx              # Status pinjaman saya
│       ├── riwayat/
│       │   └── page.tsx              # Riwayat peminjaman
│       └── profil/
│           └── page.tsx              # Profil pengguna
│
├── api/                              # API Routes
│   ├── auth/
│   │   └── login/
│   │       └── route.ts              # POST /api/auth/login (stub)
│   └── borrowings/
│       └── route.ts                  # POST /api/borrowings (stub)
│
├── globals.css                       # Global styles & design tokens
├── layout.tsx                        # Root layout (meta, fonts, etc)
├── page.tsx                          # Root page (redirect ke /login)
└── not-found.tsx                     # 404 page
```

## 🧩 Components Folder (`/components`)

Komponen-komponen reusable diorganisir berdasarkan fungsi.

```
components/
├── layout/
│   ├── Sidebar.tsx                   # Navigasi sidebar utama
│   └── Header.tsx                    # Header dengan notifikasi & user menu
│
└── dashboard/
    ├── StatCard.tsx                  # Kartu statistik (KPI)
    └── FacilityGrid.tsx              # Grid display untuk fasilitas
```

### Component Naming Convention
- **File**: PascalCase (e.g., `Sidebar.tsx`, `StatCard.tsx`)
- **Folder**: kebab-case untuk grouping (e.g., `layout/`, `dashboard/`)
- **Exports**: Named exports atau default, tapi konsisten

## 🪝 Hooks Folder (`/hooks`)

Custom React hooks untuk logic yang reusable.

```
hooks/
├── useAuth.ts                        # Authentication state & methods
├── useFacilities.ts                  # Facilities data fetching & filtering
└── use-mobile.ts                     # (dari shadcn) Mobile detection
```

### Hook Naming Convention
- **File**: kebab-case dengan prefix `use-` (e.g., `use-auth.ts`)
- **Exports**: Named export dengan camelCase (e.g., `export function useAuth()`)

## 🛠️ Lib Folder (`/lib`)

Utility functions, helpers, dan konfigurasi yang tidak spesifik ke UI.

```
lib/
├── api-client.ts                     # HTTP client dengan token handling
├── format.ts                         # Formatting utilities (date, currency, etc)
└── utils.ts                          # General utilities (cn, dll)
```

## 📄 Docs Folder (`/docs`)

Dokumentasi lengkap project.

```
docs/
├── INTEGRATION.md                    # Panduan integrasi dengan backend
├── FOLDER_STRUCTURE.md               # File ini - penjelasan struktur
├── COMPONENT_GUIDE.md                # Panduan membuat komponen (TODO)
└── API_ENDPOINTS.md                  # Referensi endpoint (TODO)
```

## 🎨 Styles & Config

### Tailwind CSS (`tailwind.config.ts`)
Konfigurasi Tailwind dengan custom colors:
- `emerald-primary`: #059669
- `mint-secondary`: #D1FAE5
- `surface`: #F9FAFB
- `text-slate`: #1E293B

### Global Styles (`app/globals.css`)
- Utility classes (.btn-primary, .card, .input-field)
- Design tokens CSS variables
- Typography & layout defaults

## 📦 Public Folder (`/public`)

Static assets yang di-serve as-is.

```
public/
├── icon.svg                          # App icon
├── placeholder.svg                   # Placeholder untuk images
├── placeholder.jpg                   # Placeholder photo
├── apple-icon.png                    # Apple touch icon
└── [other assets]                    # Icons, images, dll
```

## 🔧 Configuration Files

### `tsconfig.json`
- Path aliases (e.g., `@/components`)
- TypeScript strict mode
- Module resolution

### `next.config.mjs`
- Image optimization
- Redirects & rewrites
- Environment setup

### `.env.local`
Buat file ini locally (tidak di-commit):
```
# Backend API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3001

# Optional: Analytics, Monitoring, dll
# NEXT_PUBLIC_ANALYTICS_ID=xxx
```

## 📋 Import Path Aliases

Gunakan aliases untuk import yang lebih clean:

```typescript
// ✅ Good
import Header from '@/components/layout/Header'
import { useAuth } from '@/hooks/useAuth'
import { formatDate } from '@/lib/format'

// ❌ Avoid
import Header from '../../../components/layout/Header'
import useAuth from '../../hooks/useAuth'
```

## 🎯 Best Practices

### 1. **Component Organization**
- 1 file = 1 component (kecuali helpers)
- Group komponen dalam folder berdasarkan fitur
- Pisahkan layout components dari content components

### 2. **File Naming**
- Components: PascalCase (MyComponent.tsx)
- Utils/Hooks: camelCase (useAuth.ts, formatDate.ts)
- Pages: lowercase (page.tsx, layout.tsx)

### 3. **Code Structure**
```typescript
// 1. Imports
import { useState } from 'react'
import Link from 'next/link'

// 2. Types/Interfaces
interface Props {
  id: string
  name: string
}

// 3. Main Component
export default function MyComponent({ id, name }: Props) {
  const [state, setState] = useState('')
  
  return (...)
}
```

### 4. **Route Organization**
```
app/
├── (auth)/         # Public routes
├── (dashboard)/    # Protected routes
├── api/            # API routes
└── ...
```

## 🔐 Protected vs Public Routes

### Public Routes (`/app/(auth)`)
- `/login` - Halaman login
- `/404` - Halaman not found

### Protected Routes (`/app/(dashboard)`)
- Memerlukan authentication
- Sidebar + Header layout
- Redirect ke login jika tidak authenticated

### API Routes (`/app/api`)
- Backend stubs yang bisa di-replace
- Authentication handling
- Request validation

## 📊 Data Flow

```
Pages (UI)
    ↓
Hooks (useAuth, useFacilities, etc)
    ↓
API Client (apiGet, apiPost, etc)
    ↓
Backend API / localStorage
```

## 🚀 Scaling the Project

Saat project berkembang:

```
components/
├── layout/
├── dashboard/
├── facilities/              # NEW
│   ├── FacilityCard.tsx
│   ├── FacilityFilter.tsx
│   └── FacilityDetail.tsx
├── borrowings/             # NEW
│   ├── BorrowingForm.tsx
│   ├── BorrowingStatus.tsx
│   └── BorrowingHistory.tsx
└── common/                 # NEW
    ├── Modal.tsx
    ├── Loading.tsx
    └── Error.tsx

pages/
├── dashboard/
│   ├── facilities/
│   ├── borrowings/
│   └── ...
└── admin/                  # NEW - Admin panel
    ├── layout.tsx
    ├── page.tsx
    └── ...
```

---

**Catatan**: Struktur ini dirancang untuk scalability dan maintainability. Ikuti conventions yang ada dan tanyakan sebelum membuat struktur baru.
