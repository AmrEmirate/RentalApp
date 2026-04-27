'use client'

import { useState, useEffect } from 'react'
import { Plus, Edit, Trash2, BarChart3 } from 'lucide-react'

interface Facility {
  id: string
  name: string
  location: string
  capacity: number
  status: 'available' | 'maintenance' | 'rented'
  lastMaintenance: string
  borrowCount: number
}

export default function FacilitiesPage() {
  const [facilities, setFacilities] = useState<Facility[]>([])
  const [loading, setLoading] = useState(true)

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    nama: '',
    deskripsi: '',
    stok: 1,
    status: 'TERSEDIA'
  })

  const fetchFacilities = async () => {
    setLoading(true)
    try {
      const { apiGet } = await import('@/lib/api-client')
      const response = await apiGet<any>('/barang')
      const data = response.data || []
      
      const mapped = data.map((b: any) => ({
        id: b.id.toString(),
        name: b.nama,
        location: b.deskripsi || '-',
        capacity: b.stok || 0,
        status: b.status === 'TERSEDIA' ? 'available' : b.status === 'RUSAK' ? 'maintenance' : 'rented',
        lastMaintenance: new Date(b.updatedAt).toLocaleDateString('id-ID'),
        borrowCount: b._count?.peminjaman ?? 0,
        // Keep raw status for edit form
        rawStatus: b.status
      }))
      
      setFacilities(mapped)
    } catch (error) {
      console.error("Failed to fetch facilities", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchFacilities()
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ 
      ...prev, 
      [name]: name === 'stok' ? parseInt(value) || 0 : value 
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)

    try {
      const { apiPost, apiPut } = await import('@/lib/api-client')
      
      if (editingId) {
        await apiPut(`/barang/${editingId}`, formData)
      } else {
        await apiPost('/barang', formData)
      }
      
      setIsModalOpen(false)
      setEditingId(null)
      setFormData({ nama: '', deskripsi: '', stok: 1, status: 'TERSEDIA' })
      
      await fetchFacilities()
    } catch (err: any) {
      setError(err.message || 'Gagal menyimpan fasilitas')
    } finally {
      setSubmitting(false)
    }
  }

  const handleEdit = (facility: any) => {
    setEditingId(facility.id)
    setFormData({
      nama: facility.name,
      deskripsi: facility.location !== '-' ? facility.location : '',
      stok: facility.capacity,
      status: facility.rawStatus
    })
    setIsModalOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus fasilitas ini?')) return;
    
    try {
      const { apiDelete } = await import('@/lib/api-client')
      await apiDelete(`/barang/${id}`)
      await fetchFacilities()
    } catch (err: any) {
      alert(err.message || 'Gagal menghapus fasilitas')
    }
  }
  // End of states

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 text-green-800'
      case 'maintenance':
        return 'bg-yellow-100 text-yellow-800'
      case 'rented':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'available':
        return 'Tersedia'
      case 'maintenance':
        return 'Sedang Diperbaiki'
      case 'rented':
        return 'Disewa'
      default:
        return status
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 mb-2">Kelola Fasilitas</h1>
          <p className="text-slate-600">Lihat dan kelola semua fasilitas yang tersedia</p>
        </div>
        <button 
          onClick={() => {
            setEditingId(null)
            setFormData({ nama: '', deskripsi: '', stok: 1, status: 'TERSEDIA' })
            setIsModalOpen(true)
          }}
          className="btn-primary inline-flex items-center gap-2"
        >
          <Plus size={20} />
          Tambah Fasilitas
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center p-12">
           <div className="w-10 h-10 border-4 border-emerald-100 border-t-emerald-600 rounded-full animate-spin" />
        </div>
      ) : (
        /* Facilities Grid */
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {facilities.map(facility => (
            <div key={facility.id} className="card p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="font-bold text-slate-800 mb-1">{facility.name}</h3>
                  <p className="text-sm text-slate-600">{facility.location}</p>
                </div>
                <span className={`text-xs font-semibold px-3 py-1 rounded-full ${getStatusBadge(facility.status)}`}>
                  {getStatusLabel(facility.status)}
                </span>
              </div>

              {/* Details */}
              <div className="grid grid-cols-3 gap-4 mb-4 pb-4 border-b border-gray-200">
                <div>
                  <p className="text-xs text-slate-500 mb-1">Kapasitas/Stok</p>
                  <p className="font-semibold text-slate-800">{facility.capacity}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-1">Peminjaman</p>
                  <p className="font-semibold text-slate-800">{facility.borrowCount}x</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-1">Terakhir Perawatan</p>
                  <p className="font-semibold text-slate-800 text-sm">{facility.lastMaintenance}</p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <button 
                  onClick={() => handleEdit(facility)}
                  className="flex-1 px-3 py-2 bg-emerald-50 text-emerald-700 rounded-lg hover:bg-emerald-100 transition-colors font-medium text-sm inline-flex items-center justify-center gap-1"
                >
                  <Edit size={16} />
                  Edit
                </button>
                <button 
                  onClick={() => handleDelete(facility.id)}
                  className="flex-1 px-3 py-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors font-medium text-sm inline-flex items-center justify-center gap-1"
                >
                  <Trash2 size={16} />
                  Hapus
                </button>
                <button className="flex-1 px-3 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors font-medium text-sm inline-flex items-center justify-center gap-1">
                  <BarChart3 size={16} />
                  Stat
                </button>
              </div>
            </div>
          ))}
          {facilities.length === 0 && (
            <div className="col-span-full text-center py-12 text-gray-500 card">
              Belum ada fasilitas yang ditambahkan.
            </div>
          )}
        </div>
      )}
      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold text-slate-800 mb-4">
              {editingId ? 'Edit Fasilitas' : 'Tambah Fasilitas Baru'}
            </h2>

            {error && (
              <div className="p-3 mb-4 text-sm text-red-600 bg-red-50 rounded-lg">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Nama Fasilitas</label>
                <input
                  type="text"
                  name="nama"
                  value={formData.nama}
                  onChange={handleInputChange}
                  required
                  className="input-field w-full"
                  placeholder="Contoh: Tenda Pleton"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Deskripsi / Lokasi</label>
                <textarea
                  name="deskripsi"
                  value={formData.deskripsi}
                  onChange={handleInputChange}
                  rows={3}
                  className="input-field w-full"
                  placeholder="Masukkan deskripsi singkat atau lokasi penyimpanan"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Stok/Kapasitas</label>
                  <input
                    type="number"
                    name="stok"
                    value={formData.stok}
                    onChange={handleInputChange}
                    required
                    min="1"
                    className="input-field w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="input-field w-full"
                  >
                    <option value="TERSEDIA">Tersedia</option>
                    <option value="RUSAK">Rusak/Perawatan</option>
                    <option value="DIPINJAM">Dipinjam (Penuh)</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-2 text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors font-medium"
                  disabled={submitting}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 btn-primary"
                  disabled={submitting}
                >
                  {submitting ? 'Menyimpan...' : 'Simpan Fasilitas'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
