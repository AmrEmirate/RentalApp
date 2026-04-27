'use client'

import { useEffect, useState } from 'react'
import { Clock, CheckCircle, XCircle, Calendar, AlertCircle } from 'lucide-react'
import Link from 'next/link'

interface Borrowing {
  id: string
  facilityName: string
  status: 'pending' | 'approved' | 'rejected' | 'selesai'
  startDate: string
  endDate: string
  purpose: string
  quantity: number
  image: string
  approvalDate?: string
  rejectionReason?: string
}

// Mock removed

const statusConfig = {
  pending: {
    bg: 'bg-yellow-50',
    border: 'border-yellow-200',
    icon: Clock,
    label: 'Menunggu Persetujuan',
    color: 'text-yellow-700',
  },
  approved: {
    bg: 'bg-green-50',
    border: 'border-green-200',
    icon: CheckCircle,
    label: 'Disetujui',
    color: 'text-green-700',
  },
  rejected: {
    bg: 'bg-red-50',
    border: 'border-red-200',
    icon: XCircle,
    label: 'Ditolak',
    color: 'text-red-700',
  },
  selesai: {
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    icon: CheckCircle,
    label: 'Selesai',
    color: 'text-blue-700',
  },
}

export default function PinjamanPage() {
  const [borrowings, setBorrowings] = useState<Borrowing[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'semua' | 'aktif' | 'selesai' | 'ditolak'>('semua')

  useEffect(() => {
    const fetchBorrowings = async () => {
      try {
        const { apiGet } = await import('@/lib/api-client')
        const response = await apiGet<any>('/peminjaman')
        const data = response.data || []
        
        const mappedBorrowings = data.map((b: any) => {
          let status: 'pending' | 'approved' | 'rejected' | 'selesai' = 'approved'
          if (b.status === 'PENDING') status = 'pending'
          else if (b.status === 'DITOLAK') status = 'rejected'
          else if (b.status === 'SELESAI') status = 'selesai'
          else status = 'approved' // DISETUJUI, DIAMBIL
          
          return {
            id: b.id.toString(),
            facilityName: b.barang?.nama || 'Unknown',
            status,
            startDate: b.tanggalMulai,
            endDate: b.tanggalSelesai,
            purpose: b.tujuan,
            quantity: b.jumlah,
            image: b.barang?.fotoUrl || '📦',
            rejectionReason: b.alasanPenolakan,
            receiptUrl: b.buktiUrl
          }
        })
        
        setBorrowings(mappedBorrowings)
      } catch (error) {
        console.error("Failed to fetch borrowings:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchBorrowings()
  }, [])

  const filteredBorrowings = borrowings.filter(b => {
    if (activeTab === 'semua') return true
    if (activeTab === 'aktif') return ['pending', 'approved'].includes(b.status)
    if (activeTab === 'selesai') return b.status === 'selesai'
    if (activeTab === 'ditolak') return b.status === 'rejected'
    return true
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-emerald-100 border-t-emerald-600 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500">Memuat data peminjaman...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-slate-800 mb-2">
          Pinjaman Saya
        </h1>
        <p className="text-gray-500">
          Pantau status peminjaman Anda di sini
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200">
        {(['semua', 'aktif', 'selesai', 'ditolak'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            className={`px-4 py-3 font-medium transition-all border-b-2 text-sm ${
              activeTab === tab
                ? 'border-emerald-primary text-emerald-600'
                : 'border-transparent text-gray-600 hover:text-slate-800'
            }`}
          >
            {tab === 'semua' && 'Semua'}
            {tab === 'aktif' && 'Aktif'}
            {tab === 'selesai' && 'Selesai'}
            {tab === 'ditolak' && 'Ditolak'}
          </button>
        ))}
      </div>

      {/* Borrowings List */}
      <div className="space-y-4">
        {filteredBorrowings.length > 0 ? (
          filteredBorrowings.map(borrowing => {
            const config = statusConfig[borrowing.status]
            const StatusIcon = config.icon

            return (
              <div
                key={borrowing.id}
                className={`card p-6 border-l-4 ${config.border} ${config.bg}`}
              >
                <div className="flex flex-col md:flex-row md:items-start gap-4">
                  {/* Image */}
                  <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center text-3xl flex-shrink-0">
                    {borrowing.image}
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-bold text-lg text-slate-800">
                          {borrowing.facilityName}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                          Untuk: {borrowing.purpose}
                        </p>
                      </div>
                      <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${config.color}`}>
                        <StatusIcon size={16} />
                        <span className="text-sm font-medium">{config.label}</span>
                      </div>
                    </div>

                    {/* Details */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 text-sm">
                      <div>
                        <p className="text-gray-500">Jumlah</p>
                        <p className="font-medium text-slate-800">
                          {borrowing.quantity} unit
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500">Tanggal Mulai</p>
                        <p className="font-medium text-slate-800">
                          {new Date(borrowing.startDate).toLocaleDateString('id-ID')}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500">Tanggal Selesai</p>
                        <p className="font-medium text-slate-800">
                          {new Date(borrowing.endDate).toLocaleDateString('id-ID')}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500">ID Peminjaman</p>
                        <p className="font-medium text-slate-800">#{borrowing.id}</p>
                      </div>
                    </div>

                    {/* Rejection Reason */}
                    {borrowing.status === 'rejected' && borrowing.rejectionReason && (
                      <div className="mt-4 p-3 bg-red-100 border border-red-200 rounded-lg flex gap-3">
                        <AlertCircle size={20} className="text-red-700 flex-shrink-0" />
                        <div>
                          <p className="font-medium text-red-700">Alasan Penolakan</p>
                          <p className="text-sm text-red-600">
                            {borrowing.rejectionReason}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-4 md:pt-0">
                    {(borrowing.status === 'approved' || borrowing.status === 'selesai') && (
                      <button 
                        className="btn-primary text-sm"
                        onClick={async () => {
                          try {
                            const { apiDownload } = await import('@/lib/api-client')
                            await apiDownload(`/peminjaman/${borrowing.id}/receipt.pdf`, `bukti-peminjaman-${borrowing.id}.pdf`)
                          } catch {
                            alert('Gagal mengunduh bukti peminjaman')
                          }
                        }}
                      >
                        Download Bukti
                      </button>
                    )}
                    {borrowing.status === 'rejected' && (
                      <Link
                        href="/dashboard/katalog"
                        className="btn-secondary text-sm"
                      >
                        Pinjam Lagi
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            )
          })
        ) : (
          <div className="text-center py-12 card">
            <Calendar size={48} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500 mb-4">Belum ada peminjaman</p>
            <Link href="/dashboard/katalog" className="btn-primary inline-block">
              Mulai Pinjam
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
