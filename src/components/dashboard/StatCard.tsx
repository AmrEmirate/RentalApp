import { LucideIcon } from 'lucide-react'

interface StatCardProps {
  icon: LucideIcon
  label: string
  value: number
  color?: 'emerald' | 'blue' | 'green'
}

const colorStyles = {
  emerald: 'bg-emerald-100 text-emerald-600',
  blue: 'bg-blue-100 text-blue-600',
  green: 'bg-green-100 text-green-600',
}

export default function StatCard({
  icon: Icon,
  label,
  value,
  color = 'emerald',
}: StatCardProps) {
  return (
    <div className="card p-6">
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-xl ${colorStyles[color]}`}>
          <Icon size={24} />
        </div>
      </div>
      <p className="text-sm text-gray-500 mb-1">{label}</p>
      <p className="text-3xl font-bold text-slate-800">{value}</p>
    </div>
  )
}
