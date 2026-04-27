import { AlertCircle, CheckCircle2 } from 'lucide-react'

interface Facility {
  id: string
  name: string
  description: string
  image: string
  status: 'tersedia' | 'dipinjam' | 'perbaikan'
  quantity: number
}

interface FacilityGridProps {
  facilities: Facility[]
}

const statusConfig = {
  tersedia: { bg: 'bg-emerald-50', text: 'text-emerald-700', label: 'Tersedia' },
  dipinjam: { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'Sedang Dipinjam' },
  perbaikan: { bg: 'bg-red-100', text: 'text-red-700', label: 'Dalam Perbaikan' },
}

export default function FacilityGrid({ facilities }: FacilityGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {facilities.map(facility => {
        const config = statusConfig[facility.status]
        const isAvailable = facility.status === 'tersedia'

        return (
          <div
            key={facility.id}
            className="card p-6 hover:shadow-md hover:border-emerald-600 transition-all h-full flex flex-col"
          >
            {/* Facility Image */}
            <div className="w-full h-40 bg-gray-50 rounded-lg flex items-center justify-center text-5xl mb-4">
              {facility.image}
            </div>

            {/* Content */}
            <div className="flex-1">
              <h3 className="font-bold text-slate-800 mb-1 text-lg">
                {facility.name}
              </h3>
              <p className="text-sm text-gray-500 mb-4 line-clamp-2">
                {facility.description}
              </p>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
              <span className={`text-xs font-medium px-3 py-1 rounded-full ${config.bg} ${config.text}`}>
                {config.label}
              </span>
              <span className="text-sm font-medium text-gray-600">
                {facility.quantity} unit
              </span>
            </div>

            {/* CTA Button */}
            <button
              onClick={() => {
                if (isAvailable) {
                  window.location.href = `/dashboard/pinjam/${facility.id}`
                }
              }}
              disabled={!isAvailable}
              className={`w-full mt-4 py-2 rounded-xl font-medium transition-all ${
                isAvailable
                  ? 'btn-primary'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
            >
              {isAvailable ? 'Pinjam' : 'Tidak Tersedia'}
            </button>
          </div>
        )
      })}
    </div>
  )
}
