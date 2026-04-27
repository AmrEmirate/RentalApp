'use client'

import { useEffect, useState } from 'react'
import { User, Phone, Mail, MapPin, Edit2, Save, X } from 'lucide-react'

interface UserProfile {
  id: string
  name: string
  nik: string
  email: string
  phone: string
  address: string
  rt: string
  rw: string
  role: string
  totalBorrows: number
  activeBorrows: number
  completedBorrows: number
}

export default function ProfilPage() {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const fetchProfileData = async () => {
      // Get user from localStorage
      const storedUser = localStorage.getItem('user')
      let currentUser: UserProfile | null = null
      
      if (storedUser) {
        const userData = JSON.parse(storedUser)
        currentUser = {
          id: userData.id?.toString() || '0',
          name: userData.name || 'User',
          nik: userData.nik || '-',
          email: userData.email || '-',
          phone: userData.noTelepon || '-',
          address: userData.address || '-',
          rt: userData.rt || '01',
          rw: userData.rw || '05',
          role: userData.role || 'WARGA',
          totalBorrows: 0,
          activeBorrows: 0,
          completedBorrows: 0
        }
      }

      if (currentUser) {
        try {
          const { apiGet } = await import('@/lib/api-client')
          // Fetch peminjaman — backend filters automatically by role
          const response = await apiGet<any>('/peminjaman')
          const data = response.data || []

          // All data returned is already scoped to the user (WARGA) or all (RT)
          currentUser.totalBorrows = data.length
          currentUser.activeBorrows = data.filter((b: any) => ['PENDING', 'DISETUJUI', 'DIAMBIL'].includes(b.status)).length
          currentUser.completedBorrows = data.filter((b: any) => b.status === 'SELESAI').length

          // For WARGA: grab noKK from the first peminjaman record's warga data
          if (currentUser.role === 'WARGA' && data.length > 0 && data[0].warga) {
            const wargaData = data[0].warga
            if (wargaData.noKK) currentUser.nik = wargaData.noKK
            if (wargaData.noRumah) currentUser.address = wargaData.noRumah
          }
        } catch (error) {
          console.error('Failed to fetch user borrows for stats', error)
        }
        
        setUser(currentUser)
        setFormData(currentUser)
      }
      
      setLoading(false)
    }

    fetchProfileData()
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    if (formData) setFormData(prev => ({ ...prev!, [name]: value }))
  }

  const handleSave = async () => {
    if (!formData) return;
    setSaving(true)
    try {
      const { apiPut } = await import('@/lib/api-client')
      const payload = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        nik: formData.nik
      };
      
      const response = await apiPut<any>('/warga/profile/me', payload);

      if (response) {
        setUser(formData)
        const storedUser = localStorage.getItem('user')
        if (storedUser) {
          const userData = JSON.parse(storedUser)
          localStorage.setItem('user', JSON.stringify({ ...userData, ...formData }))
        }
        setIsEditing(false)
        alert('Profil berhasil diperbarui!');
      } else {
        alert('Gagal memperbarui profil.');
      }
    } catch (error) {
      console.error('Failed to save profile', error)
      alert('Terjadi kesalahan saat menyimpan profil.');
    } finally {
      setSaving(false)
    }
  }

  if (loading || !user || !formData) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-emerald-100 border-t-emerald-600 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500">Memuat profil...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-slate-800 mb-2">
          Profil Saya
        </h1>
        <p className="text-gray-500">
          Kelola informasi pribadi Anda
        </p>
      </div>

      {/* Profile Header Card */}
      <div className="card p-8">
        <div className="flex flex-col md:flex-row md:items-center gap-6">
          {/* Avatar */}
          <div className="w-20 h-20 bg-emerald-600 text-white rounded-xl flex items-center justify-center text-3xl flex-shrink-0">
            <User size={32} />
          </div>

          {/* Info */}
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-slate-800 mb-1">
              {user.name}
            </h2>
            <p className="text-gray-500">NIK: {user.nik}</p>
            <p className="text-sm text-gray-400 mt-2">
              RT {user.rt} / RW {user.rw}
            </p>
          </div>

          {/* Edit Button */}
          <button
            onClick={() => {
              if (isEditing) {
                setFormData(user)
              }
              setIsEditing(!isEditing)
            }}
            className={`px-6 py-2 rounded-xl font-medium transition-all ${
              isEditing
                ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                : 'btn-primary'
            }`}
          >
            {isEditing ? (
              <>
                <X size={16} className="inline mr-2" />
                Batal
              </>
            ) : (
              <>
                <Edit2 size={16} className="inline mr-2" />
                Edit Profil
              </>
            )}
          </button>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card p-6 text-center">
          <p className="text-3xl font-bold text-emerald-600">
            {user.totalBorrows}
          </p>
          <p className="text-gray-500 text-sm mt-2">Total Peminjaman</p>
        </div>
        <div className="card p-6 text-center">
          <p className="text-3xl font-bold text-yellow-600">
            {user.activeBorrows}
          </p>
          <p className="text-gray-500 text-sm mt-2">Peminjaman Aktif</p>
        </div>
        <div className="card p-6 text-center">
          <p className="text-3xl font-bold text-green-600">
            {user.completedBorrows}
          </p>
          <p className="text-gray-500 text-sm mt-2">Selesai</p>
        </div>
      </div>

      {/* Personal Information */}
      <div className="card p-8">
        <h3 className="text-lg font-bold text-slate-800 mb-6">
          Informasi Pribadi
        </h3>

        <div className="space-y-6">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-slate-800 mb-2">
              Nama Lengkap
            </label>
            {isEditing ? (
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="input-field"
              />
            ) : (
              <p className="text-gray-700">{user.name}</p>
            )}
          </div>

          {/* NIK */}
          <div>
            <label className="block text-sm font-medium text-slate-800 mb-2">
              Nomor Induk Kependudukan
            </label>
            {isEditing ? (
              <input
                type="text"
                name="nik"
                value={formData.nik}
                onChange={handleChange}
                className="input-field"
              />
            ) : (
              <p className="text-gray-700">{user.nik}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-slate-800 mb-2 flex items-center gap-2">
              <Mail size={16} /> Email
            </label>
            {isEditing ? (
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="input-field"
              />
            ) : (
              <p className="text-gray-700">{user.email}</p>
            )}
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-slate-800 mb-2 flex items-center gap-2">
              <Phone size={16} /> Nomor Telepon
            </label>
            {isEditing ? (
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="input-field"
              />
            ) : (
              <p className="text-gray-700">{user.phone}</p>
            )}
          </div>

          {/* Address */}
          <div>
            <label className="block text-sm font-medium text-slate-800 mb-2 flex items-center gap-2">
              <MapPin size={16} /> Alamat
            </label>
            {isEditing ? (
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                rows={3}
                className="input-field"
              />
            ) : (
              <p className="text-gray-700">{user.address}</p>
            )}
          </div>

          {/* RT/RW */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-800 mb-2">
                RT
              </label>
              {isEditing ? (
                <input
                  type="text"
                  name="rt"
                  value={formData.rt}
                  onChange={handleChange}
                  className="input-field"
                />
              ) : (
                <p className="text-gray-700">{user.rt}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-800 mb-2">
                RW
              </label>
              {isEditing ? (
                <input
                  type="text"
                  name="rw"
                  value={formData.rw}
                  onChange={handleChange}
                  className="input-field"
                />
              ) : (
                <p className="text-gray-700">{user.rw}</p>
              )}
            </div>
          </div>
        </div>

        {/* Save Button */}
        {isEditing && (
          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full mt-8 btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {saving ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Menyimpan...
              </>
            ) : (
              <>
                <Save size={16} />
                Simpan Perubahan
              </>
            )}
          </button>
        )}
      </div>
    </div>
  )
}
