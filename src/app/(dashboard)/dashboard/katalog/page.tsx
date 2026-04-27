'use client'

import { useState, useEffect } from 'react'
import { Search, Filter } from 'lucide-react'
import FacilityGrid from '@/components/dashboard/FacilityGrid'

import { useFacilities } from '@/hooks/useFacilities'

// Mock data removed.

export default function KatalogPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'tersedia' | 'dipinjam' | 'perbaikan'>('all')

  const { facilities, loading, error } = useFacilities({
    search: searchQuery,
    status: statusFilter
  })

  // filtering is already handled by useFacilities hook!

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-emerald-100 border-t-emerald-600 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500">Memuat katalog...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-slate-800 mb-2">
          Katalog Fasilitas
        </h1>
        <p className="text-gray-500">
          Temukan dan pinjam fasilitas yang Anda butuhkan
        </p>
      </div>

      {/* Search & Filter */}
      <div className="space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Cari fasilitas..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full input-field pl-12"
          />
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-4 py-2 rounded-xl font-medium transition-all ${
              statusFilter === 'all'
                ? 'bg-emerald-600 text-white'
                : 'bg-gray-50 text-slate-700 hover:bg-gray-200'
            }`}
          >
            <Filter size={16} className="inline mr-2" />
            Semua
          </button>
          <button
            onClick={() => setStatusFilter('tersedia')}
            className={`px-4 py-2 rounded-xl font-medium transition-all ${
              statusFilter === 'tersedia'
                ? 'bg-emerald-600 text-white'
                : 'bg-gray-100 text-slate-800 hover:bg-gray-200'
            }`}
          >
            Tersedia
          </button>
          <button
            onClick={() => setStatusFilter('dipinjam')}
            className={`px-4 py-2 rounded-xl font-medium transition-all ${
              statusFilter === 'dipinjam'
                ? 'bg-emerald-600 text-white'
                : 'bg-gray-100 text-slate-800 hover:bg-gray-200'
            }`}
          >
            Sedang Dipinjam
          </button>
          <button
            onClick={() => setStatusFilter('perbaikan')}
            className={`px-4 py-2 rounded-xl font-medium transition-all ${
              statusFilter === 'perbaikan'
                ? 'bg-emerald-600 text-white'
                : 'bg-gray-100 text-slate-800 hover:bg-gray-200'
            }`}
          >
            Dalam Perbaikan
          </button>
        </div>
      </div>

      {/* Results Info */}
      <p className="text-sm text-gray-500">
        Ditemukan {facilities.length} fasilitas
      </p>

      {/* Facilities Grid */}
      {facilities.length > 0 ? (
        <FacilityGrid facilities={facilities} />
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-2">Tidak ada fasilitas yang ditemukan</p>
          <button
            onClick={() => {
              setSearchQuery('')
              setStatusFilter('all')
            }}
            className="text-emerald-600 font-medium hover:underline"
          >
            Reset filter
          </button>
        </div>
      )}
    </div>
  )
}
