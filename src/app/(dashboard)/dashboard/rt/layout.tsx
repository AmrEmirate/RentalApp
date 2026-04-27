'use client'

import { useAuth } from '@/hooks/useAuth'
import { useRouter, usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { LogOut, Menu, X, Home, Users, FileText, Settings } from 'lucide-react'

export default function RTLayout({ children }: { children: React.ReactNode }) {
  const { user, logout, isLoading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    if (!isLoading && (!user || user.role !== 'RT')) {
      router.push('/login')
    }
  }, [user, isLoading, router])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-12 h-12 border-4 border-emerald-100 border-t-emerald-600 rounded-full animate-spin" />
      </div>
    )
  }

  if (!user || user.role !== 'RT') {
    return null
  }

  const handleLogout = () => {
    logout()
  }

  const menuItems = [
    { href: '/dashboard/rt', label: 'Dashboard', icon: Home },
    { href: '/dashboard/rt/facilities', label: 'Fasilitas', icon: Users },
    { href: '/dashboard/rt/warga', label: 'Data Warga', icon: Users },
    { href: '/dashboard/rt/reports', label: 'Laporan', icon: FileText },
    { href: '/dashboard/rt/settings', label: 'Pengaturan', icon: Settings },
  ]

  const isActive = (href: string) => {
    return href === '/dashboard/rt' 
      ? pathname === '/dashboard/rt' 
      : pathname?.startsWith(href)
  }

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Mobile Menu Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed top-4 left-4 z-40 md:hidden bg-emerald-600 text-white p-2 rounded-lg shadow-sm"
        >
          <Menu size={24} />
        </button>
      )}

      {/* Sidebar */}
      <div
        className={`fixed md:relative w-64 h-screen bg-white border-r border-gray-100 z-50 transform transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Logo */}
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <Link href="/dashboard/rt" className="flex items-center gap-3">
            <div className="inline-flex items-center justify-center w-10 h-10 bg-emerald-50 rounded-lg">
              <span className="text-xl font-bold text-emerald-600">🏢</span>
            </div>
            <div>
              <h2 className="font-bold text-slate-800">Peminjaman RT</h2>
              <p className="text-xs text-slate-500">Ketua RT</p>
            </div>
          </Link>
          <button 
            className="md:hidden p-2 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors" 
            onClick={() => setIsOpen(false)}
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map(item => {
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  isActive(item.href)
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

        {/* User Info & Logout */}
        <div className="p-4 border-t border-gray-100 space-y-3">
          <div className="px-4 py-3">
            <p className="text-sm font-medium text-slate-800">{user?.name}</p>
            <p className="text-xs text-slate-500">{user?.noTelepon}</p>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-red-soft rounded-xl hover:bg-red-50 transition-all font-medium"
          >
            <LogOut size={20} />
            <span>Keluar</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <div className="bg-white border-b border-gray-100 px-4 md:px-6 py-4 pl-16 md:pl-6">
          <div className="flex items-center justify-between">
            <div className="hidden md:block">
              <h1 className="text-xl font-bold text-slate-800">
                Selamat datang, {user?.name?.split(' ')[0]}
              </h1>
              <p className="text-sm text-slate-500">Dashboard Ketua RT</p>
            </div>
            <div className="md:hidden">
              <span className="font-bold text-slate-800">Ketua RT</span>
            </div>
            <div className="text-sm text-slate-600">
              RT 01 / RW 01
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-auto">
          <div className="p-4 md:p-6 max-w-7xl mx-auto">
            {children}
          </div>
        </div>
      </div>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  )
}
