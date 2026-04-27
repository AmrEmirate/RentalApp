# Setup & Development Guide

Panduan lengkap untuk setup project locally dan development workflow.

## 📋 Prerequisites

Sebelum mulai, pastikan sudah install:

- **Node.js** 18.17+ ([Download](https://nodejs.org))
- **pnpm** ([Install Guide](https://pnpm.io/installation))
  ```bash
  npm install -g pnpm
  ```
- **Git** ([Download](https://git-scm.com))
- **VS Code** (Optional, tapi recommended)

Verifikasi instalasi:
```bash
node --version    # v18.17.0+
pnpm --version    # 9.0.0+
git --version     # git version 2.30+
```

## 🚀 Quick Start

### 1. Clone Repository
```bash
git clone <repository-url>
cd aplikasi-peminjaman-warga
```

### 2. Install Dependencies
```bash
pnpm install
```

### 3. Setup Environment Variables
Buat file `.env.local` di root folder:

```bash
# Backend API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3001
```

Opsi lainnya (opsional):
```bash
# Analytics & Monitoring
NEXT_PUBLIC_ANALYTICS_ID=your-analytics-id

# Feature Flags
NEXT_PUBLIC_ENABLE_DEMO=true
```

### 4. Run Development Server
```bash
pnpm dev
```

Server akan berjalan di `http://localhost:3000`

### 5. Login dengan Dummy Account
Saat development, gunakan:
- **NIK**: `3512345678901234`
- **Password**: `password123`

Credentials ini menggunakan mock implementation di `/api/auth/login`.

## 📁 Project Structure

Lihat [FOLDER_STRUCTURE.md](./FOLDER_STRUCTURE.md) untuk penjelasan detail.

## 🔧 Development Workflow

### VS Code Extensions (Recommended)

Install extensions untuk better development experience:

1. **ES7+ React/Redux/React-Native snippets**
   - ID: dsznajder.es7-react-js-snippets

2. **Tailwind CSS IntelliSense**
   - ID: bradlc.vscode-tailwindcss

3. **TypeScript Vue Plugin**
   - ID: Vue.volar

4. **ESLint**
   - ID: dbaeumer.vscode-eslint

5. **Prettier**
   - ID: esbenp.prettier-vscode

### Useful VS Code Settings

Tambahkan ke `.vscode/settings.json`:
```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  }
}
```

## 🛠️ Common Development Tasks

### Add New Page/Route

1. Buat folder dengan nama route:
   ```
   app/dashboard/my-page/
   ```

2. Buat `page.tsx`:
   ```typescript
   'use client'
   
   export default function MyPage() {
     return <div>My Page</div>
   }
   ```

3. Sidebar akan auto-include jika ada di (dashboard) group

### Add New Component

1. Buat file di `components/`:
   ```typescript
   export interface MyComponentProps {
     title: string
   }
   
   export default function MyComponent({ title }: MyComponentProps) {
     return <div>{title}</div>
   }
   ```

2. Import & gunakan:
   ```typescript
   import MyComponent from '@/components/MyComponent'
   ```

### Add New Hook

1. Buat file di `hooks/`:
   ```typescript
   'use client'
   
   import { useState } from 'react'
   
   export function useMyHook() {
     const [data, setData] = useState(null)
     return { data, setData }
   }
   ```

2. Gunakan di component:
   ```typescript
   const { data } = useMyHook()
   ```

### Styling Components

Gunakan Tailwind CSS classes:

```typescript
export default function Button() {
  return (
    <button className="px-4 py-2 bg-emerald-primary text-white rounded-xl hover:bg-opacity-90 transition-all">
      Click me
    </button>
  )
}
```

Atau gunakan utility classes dari `globals.css`:
```typescript
<button className="btn-primary">Click me</button>
```

### Format Code

Auto-format seluruh project:
```bash
pnpm format
```

Check formatting tanpa auto-fix:
```bash
pnpm lint
```

## 🔗 Integrasi Backend

### Update API URL

Edit `.env.local`:
```bash
NEXT_PUBLIC_API_URL=http://localhost:3001  # Ganti dengan BE Anda
```

### Test API Integration

Gunakan curl atau Postman untuk test endpoint:

```bash
curl -X POST http://localhost:3001/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "nik": "3512345678901234",
    "password": "password123"
  }'
```

Lihat [INTEGRATION.md](./INTEGRATION.md) untuk detail lengkap.

## 🧪 Testing (TODO)

Saat ini belum ada setup testing. Untuk menambahkan:

```bash
# Install dependencies
pnpm add -D vitest @testing-library/react @testing-library/jest-dom

# Run tests
pnpm test
```

## 🐛 Debugging

### Console Logging

```typescript
// Debug component render
console.log('[MyComponent] Rendering with props:', props)

// Debug API calls
console.log('[API] Calling endpoint:', endpoint)

// Debug state
console.log('[State] Updated to:', newState)
```

### React DevTools

Install Chrome extension: [React DevTools](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi)

### VS Code Debugger

Konfigurasi `.vscode/launch.json`:
```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Next.js",
      "type": "node",
      "request": "launch",
      "skipFiles": ["<node_internals>/**"],
      "program": "${workspaceFolder}/node_modules/.bin/next",
      "args": ["dev"],
      "console": "integratedTerminal"
    }
  ]
}
```

## 📦 Build & Deploy

### Production Build

```bash
pnpm build
```

Ini akan:
1. Optimize images
2. Minify code
3. Create static exports (jika applicable)

### Preview Production Build Locally

```bash
pnpm build
pnpm start
```

Buka `http://localhost:3000`

### Deploy ke Vercel

1. Push ke GitHub
2. Buka [vercel.com](https://vercel.com)
3. Import project
4. Set environment variables di Vercel dashboard
5. Deploy

## 🔍 Troubleshooting

### Problem: Port 3000 sudah digunakan
```bash
# Gunakan port lain
pnpm dev -- -p 3001
```

### Problem: Module not found
```bash
# Clear cache & reinstall
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

### Problem: TypeScript errors
```bash
# Check TypeScript
pnpm tsc --noEmit
```

### Problem: Styles tidak appear
1. Pastikan Tailwind CSS config benar
2. Check if CSS file imported di layout.tsx
3. Clear `.next/` folder dan rebuild

## 📚 Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [TypeScript](https://www.typescriptlang.org/docs)
- [shadcn/ui](https://ui.shadcn.com)

## ✅ Checklist sebelum Production

- [ ] Environment variables set dengan benar
- [ ] API endpoints terintegrasi dengan backend
- [ ] Form validation berjalan
- [ ] Error handling implemented
- [ ] Loading states ditampilkan
- [ ] Mobile responsiveness tested
- [ ] Browser compatibility checked
- [ ] Security headers configured
- [ ] Performance optimized
- [ ] Monitoring/Analytics setup

## 📞 Getting Help

Jika ada pertanyaan atau issue:

1. Check dokumentasi di `/docs`
2. Review kode di komponen/page yang similar
3. Check [Next.js docs](https://nextjs.org/docs)
4. Buat GitHub issue dengan detail:
   - Error message
   - Steps to reproduce
   - Expected behavior
   - Actual behavior

---

**Happy Coding! 🚀**
