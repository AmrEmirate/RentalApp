'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'

export default function LoginPage() {
  const router = useRouter()
  const { login } = useAuth()
  const [formData, setFormData] = useState({ noTelepon: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.noTelepon || !formData.password) {
      setError('Nomor telepon dan password tidak boleh kosong')
      return
    }

    setError('')
    setLoading(true)

    try {
      console.log('[v0] Login attempt with:', { noTelepon: formData.noTelepon })
      await login(formData.noTelepon, formData.password)
      console.log('[v0] Login successful, redirecting...')
    } catch (err: any) {
      console.log('[v0] Login error:', err?.message)
      setLoading(false)
      setError(err?.message || 'Nomor telepon atau password salah')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-blue-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-100 rounded-2xl mb-4">
            <span className="text-3xl">🏢</span>
          </div>
          <h1 className="text-3xl font-bold text-slate-800 mb-2">Peminjaman Fasilitas</h1>
          <p className="text-slate-600 mb-4">
            Silakan login untuk melanjutkan
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg p-8">
          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {/* No Telepon Input */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-slate-800 mb-2">
              Nomor Telepon
            </label>
            <input
              type="text"
              name="noTelepon"
              value={formData.noTelepon}
              onChange={handleChange}
              placeholder="081234567801"
              className="input-field w-full text-base"
              disabled={loading}
              maxLength={15}
            />
          </div>

          {/* Password Input */}
          <div className="mb-8">
            <label className="block text-sm font-semibold text-slate-800 mb-2">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Masukkan password"
                className="input-field w-full text-base pr-12"
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-500 hover:text-slate-700 transition-colors"
                disabled={loading}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full text-lg mb-4 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Sedang masuk...' : 'Masuk ke Dashboard'}
          </button>
        </form>

        {/* Help Text */}
        <p className="text-center text-sm text-slate-600 mt-6">
          Lupa password?{' '}
          <a href="tel:082123456789" className="text-emerald-600 font-medium hover:underline">
            Hubungi Pengurus RT
          </a>
        </p>
      </div>
    </div>
  )
}
