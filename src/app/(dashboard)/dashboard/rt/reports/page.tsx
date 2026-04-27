'use client'

import { useState, useEffect } from 'react'
import { BarChart3, TrendingUp, AlertTriangle, Clock } from 'lucide-react'

export default function ReportsPage() {
  const [stats, setStats] = useState<any[]>([])
  const [topFacilities, setTopFacilities] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { apiGet } = await import('@/lib/api-client')
        const response = await apiGet<any>('/dashboard/stats')
        const data = response.data || {}
        
        setStats([
          {
            label: 'Peminjaman Aktif',
            value: data.activeBorrowings?.toString() || '0',
            change: 'Bulan ini',
            icon: Clock,
            color: 'text-blue-600',
            bgColor: 'bg-blue-100',
          },
          {
            label: 'Barang Rusak',
            value: data.totalKerusakan?.toString() || '0',
            change: 'Total',
            icon: AlertTriangle,
            color: 'text-red-600',
            bgColor: 'bg-red-100',
          },
          {
            label: 'Fasilitas Dipinjam',
            value: data.popularFacilities?.reduce((acc: number, f: any) => acc + f.jumlahPinjam, 0).toString() || '0',
            change: 'Total',
            icon: TrendingUp,
            color: 'text-green-600',
            bgColor: 'bg-green-100',
          },
          {
            label: 'Tingkat Aktivitas',
            value: 'Tinggi',
            change: 'Stabil',
            icon: BarChart3,
            color: 'text-purple-600',
            bgColor: 'bg-purple-100',
          },
        ])

        setTopFacilities(data.popularFacilities || [])
      } catch (error) {
        console.error("Failed to fetch dashboard stats", error)
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-800 mb-2">Laporan & Statistik</h1>
        <p className="text-slate-600">Lihat laporan aktivitas peminjaman fasilitas</p>
      </div>

      {loading ? (
        <div className="flex justify-center p-12">
          <div className="w-10 h-10 border-4 border-emerald-100 border-t-emerald-600 rounded-full animate-spin" />
        </div>
      ) : (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat, idx) => {
              const Icon = stat.icon
              return (
                <div key={idx} className="card p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`${stat.bgColor} p-3 rounded-lg`}>
                      <Icon size={24} className={stat.color} />
                    </div>
                    <span className="text-xs font-semibold text-slate-500">{stat.change}</span>
                  </div>
                  <p className="text-sm text-slate-600 mb-1">{stat.label}</p>
                  <p className="text-2xl font-bold text-slate-800">{stat.value}</p>
                </div>
              )
            })}
          </div>

          {/* Top Facilities */}
          <div className="card p-6">
            <h2 className="text-lg font-bold text-slate-800 mb-6">Fasilitas Paling Sering Dipinjam</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-slate-800">Nama Fasilitas</th>
                    <th className="px-4 py-3 text-center text-sm font-semibold text-slate-800">Jumlah Peminjaman</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {topFacilities.length > 0 ? (
                    topFacilities.map((facility, idx) => (
                      <tr key={idx} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3 font-semibold text-slate-800">{facility.namaFasilitas}</td>
                        <td className="px-4 py-3 text-center">
                          <span className="inline-flex items-center justify-center bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-sm font-semibold">
                            {facility.jumlahPinjam}x
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={2} className="px-4 py-8 text-center text-gray-500">
                        Belum ada data peminjaman
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Export Button (Hidden for now until BE supports it) */}
          {/* <div className="flex gap-3">
            <button className="btn-primary">Ekspor Laporan (PDF)</button>
            <button className="btn-secondary">Ekspor Laporan (Excel)</button>
          </div> */}
        </>
      )}
    </div>
  )
}

