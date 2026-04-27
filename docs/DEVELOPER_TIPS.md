# Developer Tips & Best Practices

Kumpulan tips dan best practices untuk development project ini.

## 🎯 Code Organization

### Do's ✅

```typescript
// ✅ Group related imports
import { useState, useCallback } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/useAuth'
import { formatDate } from '@/lib/format'

// ✅ Use meaningful variable names
const isUserAuthenticated = token !== null
const availableFacilities = facilities.filter(f => f.status === 'tersedia')

// ✅ Extract complex logic ke functions
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  
  if (!validateForm()) return
  
  await submitForm()
}

// ✅ Use comments untuk complex logic
// Check jika user sudah pernah meminjam fasilitas ini sebelumnya
const hasPreviousBorrowing = userHistory.some(h => h.facilityId === facilityId)
```

### Don'ts ❌

```typescript
// ❌ Mixed imports
import { useState } from 'react'
import MyComponent from '@/components/MyComponent'
import { formatDate } from '@/lib/format'
import Link from 'next/link'

// ❌ Unclear variable names
const x = true
const temp = data.filter(item => item.status === 'tersedia')

// ❌ Large components dengan banyak logic
export default function BigComponent() {
  // 500 lines of code...
}

// ❌ Magic numbers
const itemsPerPage = data.slice(0, 10)  // What's 10?
```

## 📋 Component Patterns

### Functional Component with Hooks

```typescript
'use client'

import { useState, useCallback } from 'react'

interface MyComponentProps {
  title: string
  onSubmit?: (data: string) => void
}

export default function MyComponent({ title, onSubmit }: MyComponentProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleClick = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      // Do something
      onSubmit?.('data')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setIsLoading(false)
    }
  }, [onSubmit])

  return (
    <div>
      <h1>{title}</h1>
      <button 
        onClick={handleClick}
        disabled={isLoading}
      >
        {isLoading ? 'Loading...' : 'Click me'}
      </button>
      {error && <div className="text-red-500">{error}</div>}
    </div>
  )
}
```

### Server Component (for data fetching)

```typescript
// app/dashboard/page.tsx
import DashboardContent from '@/components/dashboard/DashboardContent'

async function getDashboardData() {
  // Fetch data di server side
  const response = await fetch('...')
  return response.json()
}

export default async function DashboardPage() {
  const data = await getDashboardData()

  return <DashboardContent initialData={data} />
}
```

## 🔄 Data Fetching Patterns

### With Loading State

```typescript
'use client'

import { useEffect, useState } from 'react'
import { apiGet } from '@/lib/api-client'

export default function MyComponent() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await apiGet('/endpoint')
        setData(result)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>

  return <div>{/* Render data */}</div>
}
```

### With useSWR (Recommended for future)

```typescript
// Dependency: pnpm add swr

import useSWR from 'swr'
import { apiGet } from '@/lib/api-client'

export default function MyComponent() {
  const { data, isLoading, error } = useSWR(
    '/facilities',
    url => apiGet(url),
    { revalidateOnFocus: false }
  )

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error loading data</div>

  return <div>{/* Render data */}</div>
}
```

## 🎨 Styling Best Practices

### Use Utility Classes

```typescript
// ✅ Good - Combine Tailwind utilities
<button className="px-4 py-2 bg-emerald-primary text-white rounded-xl hover:opacity-90 transition-all disabled:opacity-50">
  Click me
</button>

// ✅ Better - Use utility from globals.css
<button className="btn-primary">Click me</button>

// ✅ Best - Create component for reusability
<PrimaryButton>Click me</PrimaryButton>
```

### Responsive Design

```typescript
// ✅ Mobile-first approach
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {/* Items */}
</div>

// ✅ Hide/show based on screen
<div className="hidden md:block">Desktop only</div>
<div className="md:hidden">Mobile only</div>

// ✅ Responsive text sizes
<h1 className="text-2xl md:text-3xl lg:text-4xl">Title</h1>
```

## ⚡ Performance Optimization

### Memoization

```typescript
import { memo } from 'react'

// ✅ Memoize component jika expensive
const MyListItem = memo(function MyListItem({ id, name }: Props) {
  return <div>{name}</div>
})

// ✅ Memoize callbacks
const handleClick = useCallback(() => {
  doSomething()
}, [dependency])
```

### Code Splitting

```typescript
// ✅ Next.js auto code-splits per route
// ✅ Use dynamic imports untuk heavy components

import dynamic from 'next/dynamic'

const HeavyComponent = dynamic(
  () => import('@/components/HeavyComponent'),
  { loading: () => <div>Loading...</div> }
)
```

## 🧪 Testing Patterns

### Component Testing

```typescript
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import MyComponent from '@/components/MyComponent'

describe('MyComponent', () => {
  it('should render title', () => {
    render(<MyComponent title="Hello" />)
    expect(screen.getByText('Hello')).toBeInTheDocument()
  })

  it('should call onSubmit when button clicked', async () => {
    const onSubmit = vi.fn()
    render(<MyComponent onSubmit={onSubmit} />)
    
    await userEvent.click(screen.getByRole('button'))
    expect(onSubmit).toHaveBeenCalled()
  })
})
```

## 🔐 Security Best Practices

### Never expose secrets

```typescript
// ❌ DON'T
const API_KEY = 'sk-1234567890'

// ✅ DO
const API_KEY = process.env.NEXT_PUBLIC_API_KEY  // Only for public keys
const SECRET = process.env.API_SECRET  // Server-side only
```

### Sanitize user input

```typescript
// ❌ DON'T - XSS vulnerability
<div dangerouslySetInnerHTML={{ __html: userInput }} />

// ✅ DO - Safe rendering
<div>{userInput}</div>
```

### Use HTTPS only

```typescript
// ✅ Always use HTTPS for API calls
const API_URL = 'https://api.example.com'  // Not HTTP
```

## 🐛 Debugging Techniques

### Console Logging

```typescript
// ✅ Use structured logging
console.log('[Component Name]', {
  message: 'What happened',
  data: relevantData,
  timestamp: new Date().toISOString()
})

// ✅ Use different log levels
console.log('Info message')
console.warn('Warning message')
console.error('Error message')

// ✅ Remove console logs di production
if (process.env.NODE_ENV === 'development') {
  console.log('Debug info')
}
```

### React DevTools

```typescript
// Add component name untuk easier debugging
function MyComponent() { /* ... */ }
MyComponent.displayName = 'MyComponent'
```

### Network Tab Inspection

1. Open DevTools (F12)
2. Go to Network tab
3. Filter by API calls
4. Inspect request/response headers & body

## 📝 Naming Conventions

### Variables

```typescript
// ✅ Boolean variables
const isLoading = true
const hasError = false
const canSubmit = true

// ✅ Array variables (plural)
const users = [...]
const facilities = [...]

// ✅ Callback functions
const handleClick = () => {}
const onSubmit = () => {}
const fetchData = async () => {}
```

### Components & Files

```typescript
// ✅ Components: PascalCase
// File: MyComponent.tsx
export default function MyComponent() { }

// ✅ Utilities: camelCase
// File: formatDate.ts
export function formatDate() { }

// ✅ Constants: UPPER_SNAKE_CASE
const MAX_ITEMS_PER_PAGE = 10
const API_BASE_URL = 'https://api.example.com'
```

## 🚀 Optimization Checklist

Before deploying:

- [ ] Remove console.log statements
- [ ] Check bundle size dengan `next/bundle-analyzer`
- [ ] Optimize images (use next/image)
- [ ] Minify CSS & JS (automatic)
- [ ] Test on slow network (DevTools throttling)
- [ ] Check Lighthouse score
- [ ] Remove unused dependencies
- [ ] Compress assets

## 📚 Common Patterns by Use Case

### Search with Debounce

```typescript
import { useEffect, useState, useCallback } from 'react'

function SearchComponent() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (!query) {
        setResults([])
        return
      }

      const data = await apiGet(`/search?q=${query}`)
      setResults(data)
    }, 300)  // Debounce 300ms

    return () => clearTimeout(timer)
  }, [query])

  return (
    <input
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      placeholder="Search..."
    />
  )
}
```

### Pagination

```typescript
function PaginatedList() {
  const [page, setPage] = useState(1)
  const { data } = useSWR(`/items?page=${page}`, apiGet)

  return (
    <>
      {data?.items.map(item => <div key={item.id}>{item.name}</div>)}
      
      <button onClick={() => setPage(p => p - 1)} disabled={page === 1}>
        Previous
      </button>
      <span>Page {page}</span>
      <button onClick={() => setPage(p => p + 1)} disabled={!data?.hasNext}>
        Next
      </button>
    </>
  )
}
```

### Modal Dialog

```typescript
function MyModal({ isOpen, onClose, onSubmit }) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
      <div className="bg-white rounded-xl p-6 max-w-md">
        <h2 className="text-xl font-bold mb-4">Modal Title</h2>
        <p className="mb-6">Modal content goes here</p>
        
        <div className="flex gap-2">
          <button onClick={onClose} className="btn-secondary flex-1">
            Cancel
          </button>
          <button onClick={onSubmit} className="btn-primary flex-1">
            Submit
          </button>
        </div>
      </div>
    </div>
  )
}
```

## 🔄 Git Workflow

### Commit Messages

```bash
# Feature
git commit -m "feat: Add user authentication"

# Bug fix
git commit -m "fix: Resolve sidebar toggle issue on mobile"

# Documentation
git commit -m "docs: Update README with setup instructions"

# Refactor
git commit -m "refactor: Simplify form validation logic"
```

### Branch Naming

```bash
feature/user-authentication
fix/sidebar-mobile-issue
docs/update-readme
refactor/form-validation
```

## ✅ Pre-Commit Checklist

- [ ] Code follows project conventions
- [ ] No console.log statements
- [ ] Tests pass (if applicable)
- [ ] No hardcoded values/secrets
- [ ] Commit message is clear
- [ ] Changes are focused & minimal

## 📞 Getting Help

If stuck:

1. Check existing similar code in the project
2. Read the documentation in `/docs`
3. Check [Next.js docs](https://nextjs.org)
4. Check [React docs](https://react.dev)
5. Search online for the specific error
6. Ask in team chat with context

## 🎓 Recommended Learning

- TypeScript handbook
- React hooks documentation
- Next.js official tutorial
- Tailwind CSS docs
- REST API best practices

---

**Last Updated**: April 10, 2024
**Version**: 1.0
