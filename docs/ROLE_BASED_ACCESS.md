# Role-Based Access Control (RBAC) System

Sistem aplikasi peminjaman fasilitas menggunakan role-based access control dengan dua peran utama: **Ketua RT (RT)** dan **Warga**.

## Gambaran Umum

### Peran yang Tersedia

#### 1. **Ketua RT (rt)**
Ketua RT memiliki akses penuh untuk mengelola fasilitas dan persetujuan peminjaman.

**Fitur Utama:**
- 📊 Dashboard dengan statistik peminjaman
- ✅ Persetujuan/Penolakan permintaan peminjaman
- 🏢 Kelola fasilitas (tambah, edit, hapus)
- 👥 Kelola data warga
- 📈 Lihat laporan dan statistik penggunaan
- ⚙️ Pengaturan akun

**Rute Akses:**
```
/dashboard/rt                    # Dashboard Ketua RT
/dashboard/rt/facilities         # Kelola Fasilitas
/dashboard/rt/warga             # Kelola Data Warga
/dashboard/rt/reports           # Laporan & Statistik
/dashboard/rt/settings          # Pengaturan Akun
```

#### 2. **Warga (warga)**
Warga dapat mengajukan permintaan peminjaman dan melihat riwayat peminjaman mereka.

**Fitur Utama:**
- 🏠 Dashboard dengan ringkasan peminjaman
- 📋 Lihat katalog fasilitas
- 📝 Ajukan permintaan peminjaman
- ⏳ Lihat status permintaan peminjaman
- 📜 Lihat riwayat peminjaman
- 👤 Kelola profil pribadi

**Rute Akses:**
```
/dashboard                      # Dashboard Warga
/dashboard/katalog             # Katalog Fasilitas
/dashboard/pinjam/[id]         # Form Peminjaman
/dashboard/pinjaman            # Status Peminjaman
/dashboard/riwayat             # Riwayat Peminjaman
/dashboard/profil              # Profil Warga
```

## Implementasi Teknis

### 1. User Interface & Type

File: `hooks/useAuth.ts`

```typescript
export type UserRole = 'rt' | 'warga'

export interface User {
  id: string
  nik: string
  name: string
  email: string
  phone?: string
  address?: string
  rt?: string
  rw?: string
  role: UserRole  // Role pengguna
}
```

### 2. Login Flow dengan Role Selection

**File:** `app/(auth)/login/page.tsx`

Proses login dibagi menjadi dua tahap:

1. **Tahap 1: Pilih Peran**
   - Tampilkan kartu untuk memilih antara "Ketua RT" atau "Warga"
   - User memilih peran terlebih dahulu sebelum memasukkan NIK dan password

2. **Tahap 2: Masukkan Kredensial**
   - Tampilkan form login dengan NIK dan password
   - Kirim role yang dipilih ke backend

```typescript
await login(nik, password, selectedRole)
```

### 3. Authentication Hook

**File:** `hooks/useAuth.ts`

Fungsi login diupdate untuk menerima parameter `role`:

```typescript
const login = useCallback(
  async (nik: string, password: string, role: UserRole) => {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nik, password, role }),
    })
    
    // Navigasi berdasarkan role
    const dashboard = newUser.role === 'rt' ? '/dashboard/rt' : '/dashboard'
    router.push(dashboard)
  },
  [router]
)
```

### 4. API Endpoint

**File:** `app/api/auth/login/route.ts`

API login menerima dan memvalidasi role:

```typescript
export async function POST(request: NextRequest) {
  const { nik, password, role } = await request.json()
  
  // Validasi role
  if (role !== 'rt' && role !== 'warga') {
    return NextResponse.json(
      { error: 'Role tidak valid' },
      { status: 400 }
    )
  }
  
  // TODO: Implementasi dengan backend Anda
  const userData = {
    // ... user data
    role: role as 'rt' | 'warga',
  }
  
  return NextResponse.json({ token, user: userData })
}
```

### 5. Middleware untuk Route Protection

**File:** `middleware.ts`

Middleware melindungi rute berdasarkan role:

```typescript
export function middleware(request: NextRequest) {
  const userCookie = request.cookies.get('user')?.value
  const userData = JSON.parse(userCookie)
  const userRole = userData.role
  
  // Lindungi rute RT
  if (pathname.startsWith('/dashboard/rt')) {
    if (userRole !== 'rt') {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
  }
  
  // Lindungi rute Warga
  if (pathname === '/dashboard' || pathname.startsWith('/dashboard/katalog')) {
    if (userRole !== 'warga') {
      return NextResponse.redirect(new URL('/dashboard/rt', request.url))
    }
  }
}
```

### 6. Layout Terpisah

Setiap role memiliki layout yang disesuaikan:

- **RT Layout:** `app/(dashboard)/dashboard/rt/layout.tsx`
  - Sidebar khusus RT dengan menu manajemen
  - Top bar menampilkan info RT/RW
  - User info dan logout button

- **Warga Layout:** `app/(dashboard)/layout.tsx`
  - Sidebar khusus Warga dengan menu peminjaman
  - Berbeda dari RT layout

## Demo Credentials

Untuk testing, gunakan kredensial berikut:

```
NIK: 3512345678901234
Password: password123
```

Keduanya akan bekerja untuk kedua role. Pilih role saat login.

## User Flow

### Flow Login - Ketua RT

```
1. User masuk ke /login
2. Pilih peran "Ketua RT"
3. Masukkan NIK dan password
4. System mengirim request dengan role='rt'
5. Backend validasi dan return user dengan role='rt'
6. Redirect ke /dashboard/rt
7. Akses protected ke halaman RT lainnya
```

### Flow Login - Warga

```
1. User masuk ke /login
2. Pilih peran "Warga"
3. Masukkan NIK dan password
4. System mengirim request dengan role='warga'
5. Backend validasi dan return user dengan role='warga'
6. Redirect ke /dashboard
7. Akses protected ke halaman Warga lainnya
```

### Flow Perlindungan Rute

```
1. User mencoba akses /dashboard/rt (sebagai Warga)
2. Middleware membaca user cookie
3. Cek role dalam user data
4. Role !== 'rt' → Redirect ke /dashboard
5. User tidak bisa akses rute RT
```

## Struktur Data User

Saat login, user object yang disimpan memiliki struktur:

```typescript
{
  id: string              // ID unik dari backend
  nik: string            // Nomor Induk Kependudukan
  name: string           // Nama lengkap
  email: string          // Email
  phone?: string         // Nomor telepon (optional)
  address?: string       // Alamat (optional)
  rt?: string           // Nomor RT (optional)
  rw?: string           // Nomor RW (optional)
  role: 'rt' | 'warga'  // Role pengguna (PENTING)
}
```

## Backend Integration

### Perubahan yang Dibutuhkan di Backend

1. **Update Login Endpoint**
   ```
   POST /login
   Body: { nik, password, role }
   Response: { token, user: { ..., role } }
   ```

2. **Validasi Role**
   - Backend harus validasi role saat login
   - Role harus sesuai dengan data master di database
   - Contoh: Cek di tabel `rt_members` atau `residents`

3. **Database Fields**
   - Tabel `users` atau `residents` harus punya field `role` atau `type`
   - Values: `'rt'` atau `'warga'`

4. **Return Role dalam Response**
   - User object yang dikembalikan harus include field `role`
   - Field ini digunakan untuk:
     - Navigasi redirect setelah login
     - Middleware route protection
     - Conditional UI rendering

## Testing

### Test RT Access

```bash
1. Login dengan role='rt'
2. Verifikasi redirect ke /dashboard/rt
3. Akses /dashboard/rt/facilities → Harus bisa
4. Akses /dashboard/katalog → Harus redirect ke /dashboard/rt
```

### Test Warga Access

```bash
1. Login dengan role='warga'
2. Verifikasi redirect ke /dashboard
3. Akses /dashboard/katalog → Harus bisa
4. Akses /dashboard/rt → Harus redirect ke /dashboard
```

### Test Token Expiry

```bash
1. Login dengan role tertentu
2. Tunggu token expire
3. Akses rute protected → Harus redirect ke /login
```

## Security Considerations

1. **Token Storage**
   - Token disimpan di localStorage (untuk development)
   - Production: gunakan HTTP-only cookies
   - Middleware setup: `middleware.ts` sudah siap

2. **Role Validation**
   - Backend harus validasi role, bukan client
   - Frontend hanya untuk UX improvement
   - Jangan percaya role dari client saja

3. **CSRF Protection**
   - API endpoints perlu CSRF token
   - Middleware implementasi Next.js v16+ compatible

4. **XSS Prevention**
   - Semua input sanitized
   - React default JSX escaping
   - User data tidak di-render raw

## FAQ

**Q: Bagaimana jika user memiliki kedua role?**
A: Saat login, user harus memilih salah satu role. Multiple role tidak didukung di flow ini. Bisa diubah di backend sesuai kebutuhan.

**Q: Bisakah warga login sebagai RT?**
A: Tidak, backend harus validasi bahwa NIK tersebut memiliki role RT. Frontend hanya UI.

**Q: Apa jika token expired?**
A: User akan diarahkan ke login. Implementasi refresh token bisa ditambah sesuai kebutuhan.

**Q: Bisakah role di-ubah setelah login?**
A: Saat ini tidak. User harus logout dan login kembali dengan role berbeda. Bisa diimplementasikan sebagai fitur di masa depan.
