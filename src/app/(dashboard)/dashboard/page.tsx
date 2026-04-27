'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import StatCard from '@/components/dashboard/StatCard'
import FacilityGrid from '@/components/dashboard/FacilityGrid'
import { TrendingUp, Package, CheckCircle } from 'lucide-react'

interface Facility {
  id: string
  name: string
  description: string
  image: string
  status: 'tersedia' | 'dipinjam' | 'perbaikan'
  quantity: number
}

// Mock removed. We use useFacilities hook and real API now.

export default function DashboardPage() {
  const [stats, setStats] = useState({
    availableFacilities: 0,
    activeBorrows: 0,
    completedBorrows: 0,
  })
  const [facilities, setFacilities] = useState<Facility[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { apiGet } = await import('@/lib/api-client')
        
        // Fetch stats
        try {
          const statsRes = await apiGet<any>('/dashboard/stats')
          if (statsRes.data) {
            setStats({
              availableFacilities: 0,
              activeBorrows: statsRes.data.activeBorrowings || 0,
              completedBorrows: statsRes.data.completedBorrowings || 0,
            })
          }
        } catch (e) {
          console.warn("Failed to fetch dashboard stats", e)
        }

        // Fetch recent facilities
        const response = await apiGet<any>('/barang')
        const data = response.data || []
        const mappedFacilities: Facility[] = data.map((b: any) => ({
          id: b.id.toString(),
          name: b.nama,
          description: b.deskripsi,
          image: b.fotoUrl || '📦',
          status: b.status === 'TERSEDIA' ? 'tersedia' : b.status === 'DIPINJAM' ? 'dipinjam' : 'perbaikan',
          quantity: b.stok
        }))
        
        setFacilities(mappedFacilities)
        
        // Count available facilities correctly
        const available = mappedFacilities.filter(f => f.status === 'tersedia').length
        setStats(prev => ({ ...prev, availableFacilities: available }))
        
      } catch (error) {
        console.error("Error fetching dashboard data:", error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-emerald-100 border-t-emerald-600 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500">Memuat data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Statistics Cards */}
      <section>
        <h2 className="text-lg font-bold text-slate-800 mb-4">Ringkasan</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard
            icon={Package}
            label="Fasilitas Tersedia"
            value={stats.availableFacilities}
            color="emerald"
          />
          <StatCard
            icon={TrendingUp}
            label="Pinjaman Aktif"
            value={stats.activeBorrows}
            color="blue"
          />
          <StatCard
            icon={CheckCircle}
            label="Pinjaman Selesai"
            value={stats.completedBorrows}
            color="green"
          />
        </div>
      </section>

      {/* Quick Access */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-slate-800">Fasilitas Terbaru</h2>
          <Link
            href="/dashboard/katalog"
            className="text-emerald-600 font-medium hover:underline"
          >
            Lihat Semua →
          </Link>
        </div>
        <FacilityGrid facilities={facilities.slice(0, 3)} />
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-emerald-600 to-emerald-500 text-white rounded-xl p-8 text-center">
        <h3 className="text-2xl font-bold mb-2">Ingin Meminjam Fasilitas?</h3>
        <p className="mb-6 opacity-90">
          Jelajahi katalog lengkap kami dan buat pemesanan dalam beberapa klik
        </p>
        <Link
          href="/dashboard/katalog"
          className="inline-block bg-white text-emerald-600 font-bold px-6 py-3 rounded-xl hover:shadow-lg transition-all"
        >
          Jelajahi Katalog
        </Link>
      </section>
    </div>
  )
}
