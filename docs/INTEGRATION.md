# Panduan Integrasi dengan Backend

Dokumen ini berisi panduan lengkap untuk mengintegrasikan Frontend dengan Backend API Anda.

## 🔗 API Base URL

Update `app/api/` routes atau buat `.env.local`:

```bash
NEXT_PUBLIC_API_URL=http://localhost:3001  # Sesuaikan dengan BE Anda
```

Kemudian gunakan di client:
```typescript
const API_URL = process.env.NEXT_PUBLIC_API_URL
```

## 📍 Endpoints yang Perlu Diimplementasikan

### 1. Authentication

#### POST `/auth/login`
**Request:**
```json
{
  "nik": "3512345678901234",
  "password": "password123"
}
```

**Response (200 OK):**
```json
{
  "token": "eyJhbGc...",
  "user": {
    "id": "user-123",
    "nik": "3512345678901234",
    "name": "Budi Santoso",
    "email": "budi@example.com",
    "phone": "08123456789",
    "address": "Jl. Merdeka No. 123",
    "rt": "05",
    "rw": "02"
  }
}
```

**Error (401):**
```json
{
  "error": "NIK atau password salah"
}
```

---

### 2. Facilities (Fasilitas)

#### GET `/facilities`
Dapatkan daftar semua fasilitas

**Query Parameters:**
```
?search=keyword    # Filter nama fasilitas
?status=tersedia   # Filter status (tersedia, dipinjam, perbaikan)
?page=1            # Paginasi (opsional)
```

**Response (200 OK):**
```json
{
  "facilities": [
    {
      "id": "fac-001",
      "name": "Sound System",
      "description": "Sistem audio profesional dengan microphone",
      "image_url": "https://...",
      "status": "tersedia",
      "quantity": 2,
      "availability": ["2024-04-15", "2024-04-16"],
      "specifications": {
        "power": "1000W",
        "features": "Microphone, Speaker, Mixer"
      }
    }
  ],
  "total": 10,
  "page": 1
}
```

#### GET `/facilities/:id`
Dapatkan detail satu fasilitas

**Response (200 OK):**
```json
{
  "id": "fac-001",
  "name": "Sound System",
  "description": "Sistem audio profesional",
  "image_url": "https://...",
  "status": "tersedia",
  "quantity": 2,
  "availability": ["2024-04-15", "2024-04-16"],
  "specifications": {
    "power": "1000W",
    "features": "Microphone, Speaker, Mixer"
  },
  "borrowing_history_count": 25
}
```

---

### 3. Borrowings (Peminjaman)

#### POST `/borrowings`
Buat peminjaman baru

**Request (multipart/form-data):**
```
facilityId: "fac-001"
startDate: "2024-04-15"
endDate: "2024-04-16"
purpose: "Acara musik komunitas"
quantity: 1
notes: "Mohon siapkan juga kabel mic tambahan"
ktpFile: [File object]  // Optional
```

**Response (201 Created):**
```json
{
  "id": "brw-001",
  "facilityId": "fac-001",
  "userId": "user-123",
  "startDate": "2024-04-15",
  "endDate": "2024-04-16",
  "purpose": "Acara musik komunitas",
  "quantity": 1,
  "status": "pending",
  "requestedAt": "2024-04-10T10:30:00Z",
  "notes": "Mohon siapkan juga kabel mic tambahan"
}
```

#### GET `/borrowings`
Dapatkan daftar peminjaman user saat ini

**Query Parameters:**
```
?status=all        # all, pending, approved, rejected
?userId=user-123   # Auto-filled dari token
```

**Response (200 OK):**
```json
{
  "borrowings": [
    {
      "id": "brw-001",
      "facility": {
        "id": "fac-001",
        "name": "Sound System"
      },
      "startDate": "2024-04-15",
      "endDate": "2024-04-16",
      "status": "approved",
      "approvalDate": "2024-04-11T14:00:00Z",
      "purpose": "Acara musik komunitas",
      "quantity": 1
    }
  ]
}
```

#### GET `/borrowings/history`
Dapatkan riwayat peminjaman yang sudah selesai

**Response (200 OK):**
```json
{
  "history": [
    {
      "id": "brw-001",
      "facility": {
        "id": "fac-001",
        "name": "Sound System"
      },
      "borrowDate": "2024-03-20",
      "returnDate": "2024-03-21",
      "status": "selesai",
      "purpose": "Acara musik komunitas",
      "pickupLocation": "Gudang RT Blok A",
      "notes": "Kondisi baik saat dikembalikan"
    }
  ]
}
```

#### GET `/borrowings/:id/receipt`
Generate & download bukti peminjaman (PDF)

**Response (200 OK):**
```
[Binary PDF content]
```

---

### 4. User Profile

#### GET `/user/profile`
Dapatkan profil pengguna

**Headers:**
```
Authorization: Bearer {token}
```

**Response (200 OK):**
```json
{
  "id": "user-123",
  "nik": "3512345678901234",
  "name": "Budi Santoso",
  "email": "budi@example.com",
  "phone": "08123456789",
  "address": "Jl. Merdeka No. 123",
  "rt": "05",
  "rw": "02",
  "stats": {
    "totalBorrows": 12,
    "activeBorrows": 1,
    "completedBorrows": 11
  }
}
```

#### PATCH `/user/profile`
Update profil pengguna

**Request:**
```json
{
  "name": "Budi Santoso",
  "email": "budi@example.com",
  "phone": "08123456789",
  "address": "Jl. Merdeka No. 123"
}
```

**Response (200 OK):**
```json
{
  "message": "Profil berhasil diupdate",
  "user": { ... }
}
```

---

## 🔐 Authentication Flow

### Token Management

1. **Login** - Dapatkan token dari `/auth/login`
2. **Store** - Simpan token di localStorage (atau secure cookie)
3. **Send** - Kirim di header setiap request:
   ```
   Authorization: Bearer {token}
   ```

### Interceptor Setup (Optional)

File baru: `lib/api-client.ts`
```typescript
const API_URL = process.env.NEXT_PUBLIC_API_URL

export async function apiCall(
  endpoint: string,
  options: RequestInit = {}
) {
  const token = localStorage.getItem('token')
  
  const headers = {
    ...options.headers,
    'Content-Type': 'application/json',
  } as Record<string, string>

  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  })

  if (response.status === 401) {
    // Token expired - redirect to login
    localStorage.removeItem('token')
    window.location.href = '/login'
  }

  return response
}
```

Gunakan di komponen:
```typescript
import { apiCall } from '@/lib/api-client'

const response = await apiCall('/borrowings', {
  method: 'POST',
  body: JSON.stringify(data),
})
```

---

## 📝 Update Routes untuk Production

Ganti endpoint di file-file berikut:

### 1. `app/(auth)/login/page.tsx`
```typescript
// Line ~27
const response = await fetch('/api/auth/login', { // ← Ganti dengan API_URL
```

### 2. `app/(dashboard)/dashboard/page.tsx`
```typescript
// Tambahkan fetch untuk GET /facilities dan GET /borrowings
```

### 3. `app/(dashboard)/dashboard/katalog/page.tsx`
```typescript
// Tambahkan fetch untuk GET /facilities dengan filter
```

### 4. `app/(dashboard)/dashboard/pinjam/[id]/page.tsx`
```typescript
// Line ~67
const response = await fetch('/api/borrowings', { // ← Ganti dengan API_URL
```

---

## 🧪 Testing API

### Curl Examples

#### Login
```bash
curl -X POST http://localhost:3001/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "nik": "3512345678901234",
    "password": "password123"
  }'
```

#### Get Facilities
```bash
curl -X GET "http://localhost:3001/facilities?status=tersedia" \
  -H "Authorization: Bearer {token}"
```

#### Create Borrowing
```bash
curl -X POST http://localhost:3001/borrowings \
  -H "Authorization: Bearer {token}" \
  -F "facilityId=fac-001" \
  -F "startDate=2024-04-15" \
  -F "endDate=2024-04-16" \
  -F "purpose=Acara musik" \
  -F "quantity=1" \
  -F "ktpFile=@ktp.jpg"
```

---

## ⚠️ Error Handling

Semua error response harus mengikuti format:

```json
{
  "error": "Error message",
  "code": "ERROR_CODE",
  "status": 400
}
```

**Common Status Codes:**
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Server Error

---

## 🔒 Security Checklist

- [ ] Gunakan HTTPS untuk production
- [ ] Implement CSRF protection
- [ ] Validate & sanitize input
- [ ] Use HTTP-only cookies untuk token
- [ ] Implement rate limiting
- [ ] Add request/response logging
- [ ] Implement refresh token strategy
- [ ] Add API versioning (/v1/auth/login)

---

## 📚 Additional Resources

- [Next.js API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)
- [REST API Best Practices](https://restfulapi.net/)
- [HTTP Status Codes](https://httpwg.org/specs/rfc9110.html#status.codes)

---

Untuk pertanyaan lebih lanjut, silakan hubungi tim development.
