import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="text-6xl font-bold text-emerald-600 mb-4">404</div>
        <h1 className="text-3xl font-bold text-slate-800 mb-2">Halaman Tidak Ditemukan</h1>
        <p className="text-gray-500 mb-8">
          Maaf, halaman yang Anda cari tidak dapat ditemukan
        </p>
        <Link
          href="/login"
          className="btn-primary inline-block"
        >
          Kembali ke Beranda
        </Link>
      </div>
    </div>
  )
}
