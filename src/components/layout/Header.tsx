'use client'

import { useEffect, useState } from 'react'
import { Bell, User as UserIcon } from 'lucide-react'

interface User {
  id: string
  name: string
  email: string
  nik: string
}

export default function Header() {
  const [user, setUser] = useState<User | null>(null)
  const [notificationCount] = useState(0)

  useEffect(() => {
    const userStr = localStorage.getItem('user')
    if (userStr) {
      setUser(JSON.parse(userStr))
    }
  }, [])

  return (
    <header className="bg-white border-b border-gray-100 px-4 md:px-6 py-4 flex items-center justify-between sticky top-0 z-20">
      <div className="hidden md:block">
        <h1 className="text-xl font-bold text-slate-800">
          Selamat datang, {user?.name || 'Pengguna'}
        </h1>
        <p className="text-sm text-gray-500">Kelola peminjaman fasilitas Anda</p>
      </div>

      {/* Mobile Greeting */}
      <div className="md:hidden pl-14">
        <p className="text-sm font-medium text-slate-800">
          Hai, {user?.name?.split(' ')[0] || 'Pengguna'}
        </p>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-4">
        {/* Notification Bell */}
        <div className="relative cursor-pointer">
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-all relative">
            <Bell size={24} className="text-slate-700" />
            {notificationCount > 0 && (
              <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {notificationCount}
              </span>
            )}
          </button>
        </div>

        {/* User Avatar */}
        <button className="p-2 hover:bg-gray-100 rounded-lg transition-all">
          <div className="w-8 h-8 bg-emerald-600 text-white rounded-lg flex items-center justify-center">
            <UserIcon size={18} />
          </div>
        </button>
      </div>
    </header>
  )
}
