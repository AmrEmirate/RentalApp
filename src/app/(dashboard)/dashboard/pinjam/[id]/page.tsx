'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Calendar, Users, FileText, Upload, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { apiPost } from '@/lib/api-client'

interface Facility {
  id: string
  name: string
  description: string
  image: string
  availability: string[]
}

// Mock removed

export default function PeminjamanPage() {
  const params = useParams()
  const router = useRouter()
  const facilityId = params.id as string

  const [facility, setFacility] = useState<Facility | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    facilityId: facilityId,
    startDate: '',
    endDate: '',
    purpose: '',
    quantity: 1,
    notes: '',
    ktpFile: null as File | null,
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    const fetchFacility = async () => {
      try {
        const { apiGet } = await import('@/lib/api-client')
        const response = await apiGet<any>('/barang')
        const data = response.data || []
        
        const found = data.find((b: any) => b.id.toString() === facilityId)
        if (found) {
          setFacility({
            id: found.id.toString(),
            name: found.nama,
            description: found.deskripsi,
            image: found.fotoUrl || '📦',
            availability: [] // Not tracking exact available dates array yet
          })
        }
      } catch (error) {
        console.error("Failed to fetch facility", error)
      } finally {
        setLoading(false)
      }
    }

    fetchFacility()
  }, [facilityId])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target
    if (type === 'file') {
      const input = e.target as HTMLInputElement
      setFormData(prev => ({
        ...prev,
        [name]: input.files?.[0] || null,
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value,
      }))
    }
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.startDate) newErrors.startDate = 'Tanggal mulai harus diisi'
    if (!formData.endDate) newErrors.endDate = 'Tanggal selesai harus diisi'
    if (new Date(formData.startDate) >= new Date(formData.endDate)) {
      newErrors.endDate = 'Tanggal selesai harus setelah tanggal mulai'
    }
    if (!formData.purpose) newErrors.purpose = 'Tujuan peminjaman harus diisi'
    if (formData.quantity < 1) newErrors.quantity = 'Jumlah minimal 1'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setSubmitting(true)

    try {
      // Dapatkan userId dari local storage untuk peminjaman
      const storedUser = localStorage.getItem('user');
      let userId = 0;
      if (storedUser) {
        const userData = JSON.parse(storedUser);
        userId = parseInt(userData.id);
      }

      const payload = {
        barangId: formData.facilityId,
        tanggalMulai: formData.startDate,
        tanggalSelesai: formData.endDate,
        tujuan: formData.purpose,
        jumlah: formData.quantity,
        catatan: formData.notes,
        userId: userId
      };

      // Panggil backend API
      const response = await apiPost('/peminjaman', payload)

      if (response) {
        router.push('/dashboard/pinjaman')
      } else {
        setErrors({ submit: 'Gagal membuat peminjaman. Silakan coba lagi.' })
      }
    } catch (error) {
      console.error('Error submitting form:', error)
      setErrors({ submit: 'Terjadi kesalahan. Silakan coba lagi.' })
    } finally {
      setSubmitting(false)
    }
  }

  if (loading || !facility) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-emerald-100 border-t-emerald-600 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500">Memuat detail fasilitas...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Back Button */}
      <Link href="/dashboard/katalog" className="flex items-center gap-2 text-emerald-600 font-medium hover:underline">
        <ArrowLeft size={20} />
        Kembali ke Katalog
      </Link>

      {/* Form Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-slate-800 mb-2">
          Form Peminjaman Fasilitas
        </h1>
        <p className="text-gray-500">
          Isi formulir di bawah untuk melakukan pemesanan
        </p>
      </div>

      {/* Facility Info Card */}
      <div className="card p-6 bg-emerald-50 border border-emerald-primary border-opacity-20">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center text-4xl">
            {facility.image}
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-slate-800">
              {facility.name}
            </h2>
            <p className="text-gray-600">{facility.description}</p>
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="card p-8 space-y-6">
        {/* Error Alert */}
        {errors.submit && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl">
            {errors.submit}
          </div>
        )}

        {/* Tanggal Peminjaman */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-800 mb-2 flex items-center gap-2">
              <Calendar size={16} /> Tanggal Mulai
            </label>
            <input
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              className={`input-field ${errors.startDate ? 'border-red-500' : ''}`}
            />
            {errors.startDate && (
              <p className="text-red-500 text-sm mt-1">{errors.startDate}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-800 mb-2 flex items-center gap-2">
              <Calendar size={16} /> Tanggal Selesai
            </label>
            <input
              type="date"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              className={`input-field ${errors.endDate ? 'border-red-500' : ''}`}
            />
            {errors.endDate && (
              <p className="text-red-500 text-sm mt-1">{errors.endDate}</p>
            )}
          </div>
        </div>

        {/* Jumlah */}
        <div>
          <label className="block text-sm font-medium text-slate-800 mb-2 flex items-center gap-2">
            <Users size={16} /> Jumlah
          </label>
          <input
            type="number"
            name="quantity"
            min="1"
            value={formData.quantity}
            onChange={handleChange}
            className={`input-field ${errors.quantity ? 'border-red-500' : ''}`}
          />
          {errors.quantity && (
            <p className="text-red-500 text-sm mt-1">{errors.quantity}</p>
          )}
        </div>

        {/* Tujuan Peminjaman */}
        <div>
          <label className="block text-sm font-medium text-slate-800 mb-2 flex items-center gap-2">
            <FileText size={16} /> Tujuan Peminjaman
          </label>
          <input
            type="text"
            name="purpose"
            placeholder="Misalnya: Acara pernikahan, gathering keluarga, dll"
            value={formData.purpose}
            onChange={handleChange}
            className={`input-field ${errors.purpose ? 'border-red-500' : ''}`}
          />
          {errors.purpose && (
            <p className="text-red-500 text-sm mt-1">{errors.purpose}</p>
          )}
        </div>

        {/* Catatan */}
        <div>
          <label className="block text-sm font-medium text-slate-800 mb-2">
            Catatan Tambahan (Opsional)
          </label>
          <textarea
            name="notes"
            placeholder="Berikan informasi tambahan jika diperlukan"
            value={formData.notes}
            onChange={handleChange}
            rows={4}
            className="input-field"
          />
        </div>

        {/* File Upload */}
        <div>
          <label className="block text-sm font-medium text-slate-800 mb-2 flex items-center gap-2">
            <Upload size={16} /> Upload Foto KTP (Opsional)
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center cursor-pointer hover:border-emerald-primary transition-colors">
            <input
              type="file"
              name="ktpFile"
              accept="image/*"
              onChange={handleChange}
              className="hidden"
              id="ktpFile"
            />
            <label htmlFor="ktpFile" className="cursor-pointer">
              <div className="text-4xl mb-2">📄</div>
              <p className="font-medium text-slate-800">
                {formData.ktpFile ? formData.ktpFile.name : 'Drag file di sini atau klik untuk upload'}
              </p>
              <p className="text-sm text-gray-500 mt-1">Format: JPG, PNG (Maks 5MB)</p>
            </label>
          </div>
        </div>

        {/* Submit Buttons */}
        <div className="flex flex-col md:flex-row gap-4 pt-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="btn-secondary flex-1"
          >
            Batal
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? 'Memproses...' : 'Ajukan Peminjaman'}
          </button>
        </div>

        {/* Terms */}
        <div className="p-4 bg-gray-50 rounded-xl text-sm text-gray-600">
          <p className="font-medium text-slate-800 mb-2">Persetujuan</p>
          <p>
            Dengan mengajukan formulir ini, Anda setuju untuk mematuhi semua peraturan penggunaan fasilitas dan bertanggung jawab atas kondisi barang yang dipinjam.
          </p>
        </div>
      </form>
    </div>
  )
}
