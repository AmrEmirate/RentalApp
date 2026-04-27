'use client'

import { useState } from 'react'
import { Save, Lock } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'

export default function SettingsPage() {
  const { user, updateUser } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: '',
    phone: user?.noTelepon || '',
    address: '',
  })
  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  })

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setPasswordData(prev => ({ ...prev, [name]: value }))
  }

  const handleSaveProfile = async () => {
    try {
      const { apiPut } = await import('@/lib/api-client')
      const payload = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
      }
      
      const response = await apiPut<any>('/warga/profile/me', payload)
      if (response) {
        updateUser({ name: formData.name, noTelepon: formData.phone })
        setIsEditing(false)
        alert('Profil berhasil diperbarui')
      }
    } catch (error) {
      alert('Gagal memperbarui profil')
      console.error(error)
    }
  }

  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('Password baru dan konfirmasi tidak cocok')
      return
    }

    if (passwordData.newPassword.length < 6) {
      alert('Password minimal 6 karakter')
      return
    }

    try {
      const { apiPut } = await import('@/lib/api-client')
      await apiPut('/auth/password', {
        oldPassword: passwordData.oldPassword,
        newPassword: passwordData.newPassword
      })
      
      alert('Password berhasil diubah')
      setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' })
    } catch (error: any) {
      alert(error.message || 'Gagal mengubah password')
      console.error(error)
    }
  }

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-800 mb-2">Pengaturan</h1>
        <p className="text-slate-600">Kelola profil dan keamanan akun Anda</p>
      </div>

      {/* Profile Settings */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-slate-800">Informasi Profil</h2>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="text-emerald-600 hover:text-emerald-700 text-sm font-medium"
          >
            {isEditing ? 'Batal' : 'Edit'}
          </button>
        </div>

        <div className="space-y-4">
          {/* Avatar */}
          <div className="flex items-center gap-4 pb-6 border-b border-gray-200">
            <div className="w-16 h-16 bg-emerald-600 text-white rounded-full flex items-center justify-center text-2xl flex-shrink-0">
              👨‍💼
            </div>
            <div>
              <p className="font-semibold text-slate-800">{user?.name}</p>
              <p className="text-sm text-slate-500">{user?.noTelepon}</p>
            </div>
          </div>

          {/* Form Fields */}
          <div>
            <label className="block text-sm font-semibold text-slate-800 mb-2">Nama Lengkap</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleFormChange}
              disabled={!isEditing}
              className="input-field w-full disabled:bg-gray-50 disabled:text-slate-600"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-800 mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleFormChange}
              disabled={!isEditing}
              className="input-field w-full disabled:bg-gray-50 disabled:text-slate-600"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-800 mb-2">Nomor Telepon</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleFormChange}
              disabled={!isEditing}
              className="input-field w-full disabled:bg-gray-50 disabled:text-slate-600"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-800 mb-2">Alamat</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleFormChange}
              disabled={!isEditing}
              className="input-field w-full disabled:bg-gray-50 disabled:text-slate-600"
            />
          </div>

          {/* Save Button */}
          {isEditing && (
            <button
              onClick={handleSaveProfile}
              className="btn-primary w-full flex items-center justify-center gap-2 mt-4"
            >
              <Save size={18} />
              Simpan Perubahan
            </button>
          )}
        </div>
      </div>

      {/* Password Settings */}
      <div className="card p-6">
        <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
          <Lock size={24} />
          Ubah Password
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-800 mb-2">Password Lama</label>
            <input
              type="password"
              name="oldPassword"
              value={passwordData.oldPassword}
              onChange={handlePasswordChange}
              placeholder="Masukkan password lama"
              className="input-field w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-800 mb-2">Password Baru</label>
            <input
              type="password"
              name="newPassword"
              value={passwordData.newPassword}
              onChange={handlePasswordChange}
              placeholder="Masukkan password baru"
              className="input-field w-full"
            />
            <p className="text-xs text-slate-500 mt-1">Minimal 6 karakter</p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-800 mb-2">Konfirmasi Password Baru</label>
            <input
              type="password"
              name="confirmPassword"
              value={passwordData.confirmPassword}
              onChange={handlePasswordChange}
              placeholder="Konfirmasi password baru"
              className="input-field w-full"
            />
          </div>

          <button
            onClick={handleChangePassword}
            className="btn-primary w-full flex items-center justify-center gap-2"
          >
            <Lock size={18} />
            Ubah Password
          </button>
        </div>
      </div>

      {/* Account Info */}
      <div className="card p-6">
        <h2 className="text-xl font-bold text-slate-800 mb-4">Informasi Akun</h2>
        <div className="space-y-3 text-sm">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <span className="text-slate-600">Nomor Telepon</span>
            <span className="font-semibold text-slate-800">{user?.noTelepon}</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <span className="text-slate-600">Peran</span>
            <span className="inline-flex items-center gap-1 font-semibold px-3 py-1 rounded-full bg-emerald-100 text-emerald-800">
              👨‍💼 Ketua RT
            </span>
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <span className="text-slate-600">RT/RW</span>
            <span className="font-semibold text-slate-800">RT 01 / RW 01</span>
          </div>
        </div>
      </div>
    </div>
  )
}
