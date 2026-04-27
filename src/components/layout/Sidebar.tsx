'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Menu, X, LogOut, Home, Box, Clock, History, User } from 'lucide-react'

const menuItems = [
  { href: '/dashboard', label: 'Dashboard', icon: Home },
  { href: '/dashboard/katalog', label: 'Katalog Fasilitas', icon: Box },
  { href: '/dashboard/pinjaman', label: 'Pinjaman Saya', icon: Clock },
  { href: '/dashboard/riwayat', label: 'Riwayat', icon: History },
  { href: '/dashboard/profil', label: 'Profil', icon: User },
]

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = () => {
    // Clear localStorage
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    // Clear cookies so Next.js middleware resets properly
    document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
    document.cookie = 'user=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
    router.push('/login')
  }

  return (
    <>
      {/* Mobile Menu Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed top-4 left-4 z-40 md:hidden bg-emerald-600 text-white p-2 rounded-lg shadow-sm"
        >
          <Menu size={24} />
        </button>
      )}

      {/* Overlay for Mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed md:sticky top-0 left-0 h-screen w-64 bg-white border-r border-gray-100 z-50 transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="h-full flex flex-col">
          {/* Logo */}
          <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <Link href="/dashboard" className="flex items-center gap-3">
              <div className="inline-flex items-center justify-center w-10 h-10 bg-emerald-50 rounded-lg">
                <span className="text-xl font-bold text-emerald-600">🏢</span>
              </div>
              <div>
                <h2 className="font-bold text-slate-800">Peminjaman</h2>
                <p className="text-xs text-gray-500">Fasilitas Warga</p>
              </div>
            </Link>
            <button 
              className="md:hidden p-2 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors" 
              onClick={() => setIsOpen(false)}
            >
              <X size={20} />
            </button>
          </div>

          {/* Menu Items */}
          <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
            {menuItems.map(item => {
              const Icon = item.icon
              const isActive = item.href === '/dashboard' 
                ? pathname === '/dashboard' 
                : pathname?.startsWith(item.href)
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                    isActive
                      ? 'bg-mint-secondary text-emerald-700 font-medium'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Icon size={20} />
                  <span>{item.label}</span>
                </Link>
              )
            })}
          </nav>

          {/* Logout Button */}
          <div className="p-4 border-t border-gray-100">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 text-red-soft rounded-xl hover:bg-red-50 transition-all font-medium"
            >
              <LogOut size={20} />
              <span>Keluar</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  )
}
