'use client'

import { useState, useEffect, useCallback } from 'react'

export interface Facility {
  id: string
  name: string
  description: string
  image: string
  status: 'tersedia' | 'dipinjam' | 'perbaikan'
  quantity: number
  availability?: string[]
}

interface UseFacilitiesOptions {
  search?: string
  status?: 'all' | 'tersedia' | 'dipinjam' | 'perbaikan'
}

/**
 * Hook untuk fetch & manage facilities data
 * TODO: Update API_URL di lib/api-client.ts
 */
export function useFacilities(options?: UseFacilitiesOptions) {
  const [facilities, setFacilities] = useState<Facility[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchFacilities = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const { apiGet } = await import('@/lib/api-client')
      const response = await apiGet<any>('/barang')
      const data = response.data || []
      
      const mappedFacilities: Facility[] = data.map((b: any) => ({
        id: b.id.toString(),
        name: b.nama,
        description: b.deskripsi,
        image: b.fotoUrl || '📦',
        status: b.status === 'TERSEDIA' ? 'tersedia' : b.status === 'DIPINJAM' ? 'dipinjam' : 'perbaikan',
        quantity: b.stok
      }))

      setFacilities(mappedFacilities)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch facilities')
      console.error('Error fetching facilities:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchFacilities()
  }, [fetchFacilities])

  const filteredFacilities = facilities.filter(facility => {
    if (options?.search) {
      const query = options.search.toLowerCase()
      if (
        !facility.name.toLowerCase().includes(query) &&
        !facility.description.toLowerCase().includes(query)
      ) {
        return false
      }
    }

    if (options?.status && options.status !== 'all') {
      if (facility.status !== options.status) {
        return false
      }
    }

    return true
  })

  return {
    facilities: filteredFacilities,
    allFacilities: facilities,
    loading,
    error,
    refetch: fetchFacilities,
  }
}
