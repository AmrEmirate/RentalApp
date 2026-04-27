# Quick Reference Guide

Panduan cepat untuk menggunakan dan mengembangkan aplikasi.

## 🚀 Quick Start

```bash
# Clone & Setup
git clone <repo>
cd aplikasi-peminjaman-warga

# Install & Run
pnpm install
pnpm dev

# Open browser
http://localhost:3000
```

## 🔐 Test Login

```
NIK: 3512345678901234
Password: password123
```

## 📁 Key Files & Locations

| File | Lokasi | Fungsi |
|------|--------|--------|
| Login Page | `app/(auth)/login/page.tsx` | Halaman login |
| Dashboard | `app/(dashboard)/dashboard/page.tsx` | Dashboard utama |
| Sidebar | `components/layout/Sidebar.tsx` | Navigasi |
| Katalog | `app/(dashboard)/dashboard/katalog/page.tsx` | List fasilitas |
| Form Pinjam | `app/(dashboard)/dashboard/pinjam/[id]/page.tsx` | Form peminjaman |
| API Login | `app/api/auth/login/route.ts` | Login endpoint stub |
| Tailwind Config | `tailwind.config.ts` | Design tokens |
| Globals CSS | `app/globals.css` | Global styles |

## 🎨 Color Palette

| Nama | Hex | Usage |
|------|-----|-------|
| Primary | #059669 | Buttons, highlights |
| Secondary | #D1FAE5 | Backgrounds, badges |
| Surface | #F9FAFB | Content backgrounds |
| Text | #1E293B | Body text |
| White | #FFFFFF | Clean backgrounds |
| Red Soft | #EF4444 | Destructive actions |

## 🧩 Component Structure

```typescript
// Simple component template
'use client'  // if using hooks/state

import { Icon } from 'lucide-react'

interface ComponentProps {
  title: string
}

export default function MyComponent({ title }: ComponentProps) {
  return (
    <div className="card p-6">
      <h2 className="text-lg font-bold text-text-slate">
        {title}
      </h2>
    </div>
  )
}
```

## 🪝 Common Hooks Usage

### useAuth
```typescript
import { useAuth } from '@/hooks/useAuth'

const { user, token, isAuthenticated, login, logout } = useAuth()

if (!isAuthenticated) router.push('/login')
```

### useFacilities
```typescript
import { useFacilities } from '@/hooks/useFacilities'

const { facilities, loading, error } = useFacilities({
  search: 'sound',
  status: 'tersedia'
})
```

## 📡 API Usage

### Fetch with Auth
```typescript
import { apiGet, apiPost } from '@/lib/api-client'

// GET
const data = await apiGet('/facilities')

// POST
const result = await apiPost('/borrowings', {
  facilityId: '1',
  startDate: '2024-04-15'
})
```

## 🎯 Tailwind Classes Reference

```typescript
// Layout
className="flex items-center justify-between gap-4"
className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"

// Colors
className="bg-emerald-primary text-white"
className="bg-mint-secondary text-text-slate"
className="bg-surface"

// Spacing
className="p-6"           // padding all
className="px-4 py-2"     // padding horizontal & vertical
className="mb-4 mt-2"     // margin bottom & top

// Responsive
className="md:flex lg:grid"
className="text-sm md:text-base lg:text-lg"

// Buttons (use utilities from globals.css)
className="btn-primary"    // Emerald button
className="btn-secondary"  // Mint button

// Cards
className="card p-6"       // Card with padding
className="card p-6 hover:shadow-md"  // With hover effect
```

## 🔍 Format Utilities

```typescript
import { formatDate, formatCurrency, calculateDays } from '@/lib/format'

formatDate('2024-04-15')          // '15 April 2024'
formatCurrency(100000)            // 'Rp 100.000'
calculateDays('2024-04-15', '2024-04-17')  // 2
```

## 📝 Form Pattern

```typescript
import { useState } from 'react'

export default function MyForm() {
  const [formData, setFormData] = useState({ name: '' })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const validate = () => {
    const newErrors: Record<string, string> = {}
    if (!formData.name) newErrors.name = 'Name required'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    const response = await apiPost('/endpoint', formData)
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        name="name"
        value={formData.name}
        onChange={handleChange}
        className={`input-field ${errors.name ? 'border-red-500' : ''}`}
      />
      {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
    </form>
  )
}
```

## 🔄 Data Flow Diagram

```
User Action (click button)
    ↓
Component Handler (onClick, onChange)
    ↓
State Update (useState, hooks)
    ↓
API Call (apiPost, apiGet)
    ↓
Backend Processing
    ↓
Response Handling
    ↓
UI Re-render
```

## ⚡ Performance Tips

```typescript
// ✅ Good - memoize expensive components
import { memo } from 'react'

const MyComponent = memo(function MyComponent(props) {
  return <div>{props.content}</div>
})

// ✅ Good - useCallback untuk stable function references
const handleClick = useCallback(() => {
  // ...
}, [dependencies])

// ❌ Avoid - inline functions
<button onClick={() => doSomething()}>  // Creates new function every render
```

## 🐛 Debugging

```typescript
// Log component renders
console.log('[MyComponent] Rendering with props:', props)

// Log API calls
console.log('[API] Request:', endpoint, body)
console.log('[API] Response:', data)

// Log state changes
console.log('[State] Before:', oldState)
console.log('[State] After:', newState)
```

## 🔗 Important URLs

| Page | URL |
|------|-----|
| Login | `/login` |
| Dashboard | `/dashboard` |
| Katalog | `/dashboard/katalog` |
| Pinjaman | `/dashboard/pinjaman` |
| Riwayat | `/dashboard/riwayat` |
| Profil | `/dashboard/profil` |

## 📋 Environment Variables

```bash
# .env.local (create locally)
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_ENABLE_DEMO=true
```

## 📚 Documentation Files

| File | Isi |
|------|-----|
| README.md | Project overview |
| INTEGRATION.md | Backend API guide |
| SETUP.md | Development setup |
| FOLDER_STRUCTURE.md | Project organization |
| TODO.md | Integration checklist |
| CHANGELOG.md | Version history |

## 🚀 Deploy Commands

```bash
# Build production
pnpm build

# Test production build locally
pnpm build
pnpm start

# Deploy to Vercel (automatic from GitHub)
git push origin main
```

## 🆘 Common Errors

### "Module not found"
```bash
rm -rf node_modules
pnpm install
```

### "Port 3000 already in use"
```bash
pnpm dev -- -p 3001
```

### "Styles not working"
1. Check if `app/globals.css` imported di `layout.tsx`
2. Check Tailwind config
3. Clear `.next/` folder dan rebuild

### "API calls failing"
1. Check `NEXT_PUBLIC_API_URL` di `.env.local`
2. Pastikan backend running
3. Check network tab di DevTools
4. Check CORS configuration di backend

## 💡 Tips & Tricks

1. **Use path aliases**: `@/components` instead of `../../../components`
2. **Component naming**: PascalCase untuk components (MyComponent.tsx)
3. **File naming**: kebab-case untuk utils (my-utils.ts)
4. **Import organization**: 
   ```
   1. React/Next imports
   2. Third-party imports
   3. Local imports
   ```
5. **Use TypeScript**: Type everything untuk better IDE support

## 📞 Quick Links

- [Next.js Docs](https://nextjs.org/docs)
- [React Docs](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [shadcn/ui](https://ui.shadcn.com)
- [TypeScript](https://www.typescriptlang.org/docs)

## 🎯 Workflow

1. **Create feature branch**: `git checkout -b feature/my-feature`
2. **Make changes**: Edit files, add components, etc
3. **Test locally**: `pnpm dev` dan test di browser
4. **Commit changes**: `git commit -m "Add my feature"`
5. **Push & create PR**: `git push` dan create pull request
6. **Review & merge**: Code review dan merge ke main
7. **Deploy**: Automatic via Vercel or manual deployment

---

**Last Updated**: April 10, 2024
**Version**: 0.1.0
