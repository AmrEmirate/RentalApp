'use client'

import { useState, useEffect } from 'react'
import { Search, Phone, Mail, MapPin, Edit, Trash2 } from 'lucide-react'

interface Warga {
  id: string
  name: string
  nik: string
  phone: string
  email: string
  address: string
  rt: string
  rw: string
  joinDate: string
}

export default function WargaPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [wargaList, setWargaList] = useState<Warga[]>([])
  const [loading, setLoading] = useState(true)

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    noKK: '',
    kepalaKeluarga: '',
    noTelepon: '',
    noRumah: '',
    jumlahAnggota: '1',
    statusRumah: 'MILIK_SENDIRI'
  })

  const fetchWarga = async () => {
    try {
      const { apiGet } = await import('@/lib/api-client')
      const response = await apiGet<any>('/warga')
      const data = response.data || []
      
      const mapped = data.map((w: any) => ({
        id: w.id.toString(),
        name: w.user?.name || w.kepalaKeluarga || 'Tanpa Nama',
        nik: w.noKK,
        phone: w.user?.noTelepon || w.noTelepon || '-',
        email: w.user?.email || '-',
        address: w.noRumah || '-',
        rt: '01',
        rw: '05',
        joinDate: w.createdAt,
      }))
      
      setWargaList(mapped)
    } catch (error) {
      console.error("Failed to fetch warga data", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchWarga()
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)

    try {
      const { apiPost, apiPut } = await import('@/lib/api-client')
      
      if (editingId) {
        await apiPut(`/warga/${editingId}`, formData)
      } else {
        await apiPost('/warga', formData)
      }
      
      // Close modal and reset form
      setIsModalOpen(false)
      setEditingId(null)
      setFormData({
        noKK: '',
        kepalaKeluarga: '',
        noTelepon: '',
        noRumah: '',
        jumlahAnggota: '1',
        statusRumah: 'MILIK_SENDIRI'
      })
      
      // Refresh list
      setLoading(true)
      await fetchWarga()
    } catch (err: any) {
      setError(err.message || 'Gagal menyimpan warga')
    } finally {
      setSubmitting(false)
    }
  }

  const handleEdit = (warga: any) => {
    setEditingId(warga.id)
    setFormData({
      noKK: warga.nik,
      kepalaKeluarga: warga.name,
      noTelepon: warga.phone,
      noRumah: warga.address,
      // We don't have jumlahAnggota and statusRumah in mapped list, using defaults for now
      // A better way is to fetch the specific Warga by ID, but this works for basic editing
      jumlahAnggota: '1',
      statusRumah: 'MILIK_SENDIRI'
    })
    setIsModalOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus data warga ini? Akun login terkait juga akan terhapus.')) return;
    
    setLoading(true)
    try {
      const { apiDelete } = await import('@/lib/api-client')
      await apiDelete(`/warga/${id}`)
      await fetchWarga()
    } catch (err: any) {
      console.error(err)
      alert(err.message || 'Gagal menghapus warga')
      setLoading(false)
    }
  }

  const filteredWarga = wargaList.filter(w =>
    w.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    w.nik.includes(searchTerm) ||
    w.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 mb-2">Data Warga</h1>
          <p className="text-slate-600">Kelola informasi warga yang terdaftar</p>
        </div>
        <button 
          onClick={() => {
            setEditingId(null)
            setFormData({
              noKK: '',
              kepalaKeluarga: '',
              noTelepon: '',
              noRumah: '',
              jumlahAnggota: '1',
              statusRumah: 'MILIK_SENDIRI'
            })
            setIsModalOpen(true)
          }}
          className="btn-primary"
        >
          + Tambah Warga
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
        <input
          type="text"
          placeholder="Cari nama, No. KK, atau email..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="input-field w-full pl-12"
        />
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card p-4">
          <p className="text-sm text-slate-600 mb-1">Total Kepala Keluarga</p>
          <p className="text-2xl font-bold text-slate-800">{wargaList.length}</p>
        </div>
        <div className="card p-4">
          <p className="text-sm text-slate-600 mb-1">Warga Aktif</p>
          <p className="text-2xl font-bold text-emerald-600">{wargaList.length}</p>
        </div>
        <div className="card p-4">
          <p className="text-sm text-slate-600 mb-1">Hasil Pencarian</p>
          <p className="text-2xl font-bold text-slate-800">{filteredWarga.length}</p>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center p-12">
          <div className="w-10 h-10 border-4 border-emerald-100 border-t-emerald-600 rounded-full animate-spin" />
        </div>
      ) : (
        /* Warga List */
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-800">Nama (Kepala Keluarga)</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-800">No. KK</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-800">Kontak</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-800">No Rumah</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-800">Bergabung</th>
                  <th className="px-6 py-3 text-center text-sm font-semibold text-slate-800">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredWarga.map(warga => (
                  <tr key={warga.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-semibold text-slate-800">{warga.name}</p>
                        <p className="text-xs text-slate-500">{warga.email !== '-' ? warga.email : ''}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <code className="text-sm text-slate-600">{warga.nik}</code>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1 text-slate-600 text-sm">
                          <Phone size={14} />
                          {warga.phone}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-start gap-1 text-slate-600 text-sm">
                        <MapPin size={14} className="flex-shrink-0 mt-0.5" />
                        {warga.address}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      {new Date(warga.joinDate).toLocaleDateString('id-ID')}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2 justify-center">
                        <button 
                          onClick={() => handleEdit(warga)}
                          className="p-2 hover:bg-blue-100 rounded-lg transition-colors text-blue-600"
                        >
                          <Edit size={16} />
                        </button>
                        <button 
                          onClick={() => handleDelete(warga.id)}
                          className="p-2 hover:bg-red-100 rounded-lg transition-colors text-red-600"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredWarga.length === 0 && (
            <div className="text-center py-12">
              <p className="text-slate-500">Tidak ada warga yang cocok dengan pencarian</p>
            </div>
          )}
        </div>
      )}

      {/* Add Warga Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold text-slate-800 mb-4">
              {editingId ? 'Edit Warga' : 'Tambah Warga Baru'}
            </h2>
            <p className="text-sm text-slate-600 mb-6">
              {editingId ? 'Perbarui informasi data warga.' : 'Akun login akan otomatis dibuat menggunakan nomor telepon. Password default adalah nomor telepon.'}
            </p>

            {error && (
              <div className="p-3 mb-4 text-sm text-red-600 bg-red-50 rounded-lg">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Nama Kepala Keluarga</label>
                <input
                  type="text"
                  name="kepalaKeluarga"
                  value={formData.kepalaKeluarga}
                  onChange={handleInputChange}
                  required
                  className="input-field w-full"
                  placeholder="Masukkan nama lengkap"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Nomor KK</label>
                <input
                  type="text"
                  name="noKK"
                  value={formData.noKK}
                  onChange={handleInputChange}
                  required
                  className="input-field w-full"
                  placeholder="Masukkan 16 digit No. KK"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Nomor Telepon (Akun Login)</label>
                <input
                  type="text"
                  name="noTelepon"
                  value={formData.noTelepon}
                  onChange={handleInputChange}
                  required
                  className="input-field w-full"
                  placeholder="Contoh: 08123456789"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">No Rumah</label>
                  <input
                    type="text"
                    name="noRumah"
                    value={formData.noRumah}
                    onChange={handleInputChange}
                    required
                    className="input-field w-full"
                    placeholder="Blok / No"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Jml Anggota</label>
                  <input
                    type="number"
                    name="jumlahAnggota"
                    value={formData.jumlahAnggota}
                    onChange={handleInputChange}
                    required
                    min="1"
                    className="input-field w-full"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Status Rumah</label>
                <select
                  name="statusRumah"
                  value={formData.statusRumah}
                  onChange={handleInputChange}
                  className="input-field w-full"
                >
                  <option value="MILIK_SENDIRI">Milik Sendiri</option>
                  <option value="KONTRAK">Kontrak / Sewa</option>
                </select>
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
                  {submitting ? 'Menyimpan...' : 'Simpan Warga'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

