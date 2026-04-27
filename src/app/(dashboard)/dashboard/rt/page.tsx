'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { CheckCircle, XCircle, Clock, BarChart3, Users, AlertCircle } from 'lucide-react'
import Link from 'next/link'

interface PendingRequest {
  id: string
  wargaName: string
  facilityName: string
  requestDate: string
  borrowDate: string
  returnDate: string
  status: 'pending' | 'approved' | 'rejected'
}

export default function RTDashboard() {
  const { user, isLoading } = useAuth()
  const [pendingRequests, setPendingRequests] = useState<PendingRequest[]>([])
  const [totalWarga, setTotalWarga] = useState(0)

  const fetchDashboardData = async () => {
    try {
      const { apiGet } = await import('@/lib/api-client')
      
      // Fetch peminjaman
      const peminjamanRes = await apiGet<any>('/peminjaman')
      const data = peminjamanRes.data || []
      
      const mapped: PendingRequest[] = data.map((p: any) => ({
        id: p.id.toString(),
        wargaName: p.warga?.user?.name || p.warga?.kepalaKeluarga || 'Warga',
        facilityName: p.barang?.nama || 'Fasilitas',
        requestDate: new Date(p.createdAt).toLocaleDateString('id-ID'),
        borrowDate: new Date(p.tanggalMulai).toLocaleDateString('id-ID'),
        returnDate: new Date(p.tanggalSelesai).toLocaleDateString('id-ID'),
        status: p.status === 'PENDING' ? 'pending' : p.status === 'DISETUJUI' || p.status === 'DIAMBIL' || p.status === 'SELESAI' ? 'approved' : 'rejected'
      }))
      setPendingRequests(mapped)

      // Fetch warga for stats
      const wargaRes = await apiGet<any>('/warga')
      setTotalWarga(wargaRes.data?.length || 0)
    } catch (error) {
      console.error("Failed to fetch RT dashboard data", error)
    }
  }

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const [activeTab, setActiveTab] = useState<'pending' | 'approved' | 'rejected'>('pending')

  const handleApprove = async (id: string) => {
    if (!window.confirm('Setujui permintaan peminjaman ini?')) return;
    try {
      const { apiPatch } = await import('@/lib/api-client')
      await apiPatch(`/peminjaman/${id}/status`, { status: 'DISETUJUI' })
      await fetchDashboardData()
    } catch (error: any) {
      alert(error.message || 'Gagal menyetujui peminjaman')
    }
  }

  const handleReject = async (id: string) => {
    const alasan = window.prompt('Masukkan alasan penolakan (opsional):')
    if (alasan === null) return; // User cancelled
    
    try {
      const { apiPatch } = await import('@/lib/api-client')
      await apiPatch(`/peminjaman/${id}/status`, { status: 'DITOLAK', alasanPenolakan: alasan })
      await fetchDashboardData()
    } catch (error: any) {
      alert(error.message || 'Gagal menolak peminjaman')
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-emerald-100 border-t-emerald-600 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-600">Memuat dashboard...</p>
        </div>
      </div>
    )
  }

  const stats = [
    {
      label: 'Permintaan Pending',
      value: pendingRequests.filter(r => r.status === 'pending').length,
      icon: Clock,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
    },
    {
      label: 'Persetujuan',
      value: pendingRequests.filter(r => r.status === 'approved').length,
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      label: 'Ditolak',
      value: pendingRequests.filter(r => r.status === 'rejected').length,
      icon: XCircle,
      color: 'text-red-600',
      bgColor: 'bg-red-100',
    },
    {
      label: 'Total Warga',
      value: totalWarga,
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
  ]

  const filteredRequests = pendingRequests.filter(r => r.status === activeTab)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-800 mb-2">
          Dashboard Ketua RT
        </h1>
        <p className="text-slate-600">
          Kelola permintaan peminjaman fasilitas dari warga
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => {
          const Icon = stat.icon
          return (
            <div key={idx} className="card p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-slate-600 mb-2">{stat.label}</p>
                  <p className="text-3xl font-bold text-slate-800">{stat.value}</p>
                </div>
                <div className={`${stat.bgColor} p-3 rounded-lg`}>
                  <Icon size={24} className={stat.color} />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Pending Requests Section */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-slate-800">Permintaan Peminjaman</h2>
          <Link
            href="/dashboard/rt/facilities"
            className="text-emerald-600 hover:text-emerald-700 text-sm font-medium"
          >
            Kelola Fasilitas →
          </Link>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-gray-200">
          {(['pending', 'approved', 'rejected'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 font-medium text-sm transition-colors ${
                activeTab === tab
                  ? 'text-emerald-600 border-b-2 border-emerald-600'
                  : 'text-slate-600 hover:text-slate-800'
              }`}
            >
              {tab === 'pending' && '⏳ Pending'}
              {tab === 'approved' && '✓ Disetujui'}
              {tab === 'rejected' && '✗ Ditolak'}
            </button>
          ))}
        </div>

        {/* Requests List */}
        {filteredRequests.length === 0 ? (
          <div className="text-center py-12">
            <AlertCircle size={48} className="text-slate-300 mx-auto mb-2" />
            <p className="text-slate-500">Tidak ada permintaan dengan status ini</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredRequests.map(request => (
              <div
                key={request.id}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="font-semibold text-slate-800">{request.wargaName}</h3>
                    <p className="text-sm text-slate-600">{request.facilityName}</p>
                  </div>
                  <span
                    className={`text-xs font-semibold px-3 py-1 rounded-full ${
                      request.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : request.status === 'approved'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {request.status === 'pending' && 'PENDING'}
                    {request.status === 'approved' && 'DISETUJUI'}
                    {request.status === 'rejected' && 'DITOLAK'}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-4 text-sm">
                  <div>
                    <p className="text-slate-500 text-xs mb-1">Tanggal Permintaan</p>
                    <p className="font-semibold text-slate-800">{request.requestDate}</p>
                  </div>
                  <div>
                    <p className="text-slate-500 text-xs mb-1">Tanggal Peminjaman</p>
                    <p className="font-semibold text-slate-800">{request.borrowDate}</p>
                  </div>
                  <div>
                    <p className="text-slate-500 text-xs mb-1">Tanggal Pengembalian</p>
                    <p className="font-semibold text-slate-800">{request.returnDate}</p>
                  </div>
                </div>

                {/* Action Buttons */}
                {request.status === 'pending' && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleApprove(request.id)}
                      className="flex-1 btn-primary text-sm"
                    >
                      Setujui
                    </button>
                    <button
                      onClick={() => handleReject(request.id)}
                      className="flex-1 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors font-medium text-sm"
                    >
                      Tolak
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link
          href="/dashboard/rt/warga"
          className="card p-6 hover:shadow-lg transition-shadow cursor-pointer"
        >
          <Users size={32} className="text-emerald-600 mb-4" />
          <h3 className="font-bold text-slate-800 mb-2">Kelola Data Warga</h3>
          <p className="text-sm text-slate-600">
            Lihat dan kelola informasi warga di RT
          </p>
        </Link>
        <Link
          href="/dashboard/rt/reports"
          className="card p-6 hover:shadow-lg transition-shadow cursor-pointer"
        >
          <BarChart3 size={32} className="text-emerald-600 mb-4" />
          <h3 className="font-bold text-slate-800 mb-2">Laporan & Statistik</h3>
          <p className="text-sm text-slate-600">
            Lihat laporan penggunaan fasilitas
          </p>
        </Link>
      </div>
    </div>
  )
}
