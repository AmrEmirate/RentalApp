'use client'

import { useEffect, useState } from 'react'
import { Calendar, Download, MapPin } from 'lucide-react'

interface History {
  id: string
  facilityName: string
  borrowDate: string
  returnDate: string
  status: 'selesai' | 'hilang_rusak'
  purpose: string
  pickupLocation: string
  notes?: string
  image: string
}

// Mock removed

export default function RiwayatPage() {
  const [history, setHistory] = useState<History[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const { apiGet } = await import('@/lib/api-client')
        const response = await apiGet<any>('/peminjaman')
        const data = response.data || []
        
        // Filter and map to History type
        // In a real app we'd filter by user id, but for now we just show all or rely on backend to filter
        const allData = data.map((b: any) => ({
          id: `BRW-${b.id}`,
          rawId: b.id,
          facilityName: b.barang?.nama || 'Unknown',
          borrowDate: b.tanggalMulai,
          returnDate: b.tanggalSelesai,
          status: b.kondisiKembali === 'RUSAK' ? 'hilang_rusak' : 'selesai',
          purpose: b.tujuan,
          pickupLocation: 'Gudang RT',
          notes: b.alasanPenolakan || '',
          image: b.barang?.fotoUrl || '📦',
        }))

        // Hanya tampilkan peminjaman yang sudah SELESAI
        const historyOnly = allData.filter((item: any) => {
          const raw = data.find((b: any) => `BRW-${b.id}` === item.id)
          return raw?.status === 'SELESAI'
        })
        
        setHistory(historyOnly)
      } catch (error) {
        console.error("Failed to fetch history:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchHistory()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-emerald-100 border-t-emerald-600 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500">Memuat riwayat...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-slate-800 mb-2">
          Riwayat Peminjaman
        </h1>
        <p className="text-gray-500">
          Lihat semua riwayat peminjaman Anda sebelumnya
        </p>
      </div>

      {/* Timeline */}
      <div className="space-y-4">
        {history.length > 0 ? (
          history.map((item, index) => (
            <div key={item.id} className="flex gap-4">
              {/* Timeline */}
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 bg-emerald-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                  {index + 1}
                </div>
                {index < history.length - 1 && (
                  <div className="w-0.5 h-20 bg-gray-200 mt-2" />
                )}
              </div>

              {/* Card */}
              <div className="card p-6 flex-1">
                <div className="flex flex-col md:flex-row md:items-start gap-4">
                  {/* Image */}
                  <div className="w-16 h-16 bg-gray-50 rounded-lg flex items-center justify-center text-3xl flex-shrink-0">
                    {item.image}
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-bold text-lg text-slate-800">
                          {item.facilityName}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                          Untuk: {item.purpose}
                        </p>
                      </div>
                      <span
                        className={`text-xs font-medium px-3 py-1 rounded-full ${
                          item.status === 'selesai'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {item.status === 'selesai' ? '✓ Selesai' : '⚠️ Ada Masalah'}
                      </span>
                    </div>

                    {/* Details */}
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Calendar size={16} className="text-gray-400" />
                        <div>
                          <p className="text-gray-500">Tanggal Peminjaman</p>
                          <p className="font-medium text-slate-800">
                            {new Date(item.borrowDate).toLocaleDateString('id-ID')}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar size={16} className="text-gray-400" />
                        <div>
                          <p className="text-gray-500">Tanggal Pengembalian</p>
                          <p className="font-medium text-slate-800">
                            {new Date(item.returnDate).toLocaleDateString('id-ID')}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin size={16} className="text-gray-400" />
                        <div>
                          <p className="text-gray-500">Lokasi Pengambilan</p>
                          <p className="font-medium text-slate-800">
                            {item.pickupLocation}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Notes */}
                    {item.notes && (
                      <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <p className="text-sm text-yellow-800">
                          <strong>Catatan:</strong> {item.notes}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button 
                      className="p-2 hover:bg-gray-50 rounded-lg transition-all"
                      onClick={async () => {
                        try {
                          const { apiDownload } = await import('@/lib/api-client')
                          const rawId = (item as any).rawId || item.id.replace('BRW-', '')
                          await apiDownload(`/peminjaman/${rawId}/receipt.pdf`, `bukti-${item.id}.pdf`)
                        } catch (error) {
                          alert('Gagal mengunduh bukti peminjaman')
                        }
                      }}
                      title="Unduh Bukti Peminjaman"
                    >
                      <Download size={20} className="text-emerald-600" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12 card">
            <Calendar size={48} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500">Belum ada riwayat peminjaman</p>
          </div>
        )}
      </div>
    </div>
  )
}
