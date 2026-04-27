/**
 * Utility functions untuk formatting data
 */

/**
 * Format tanggal ke format Indonesia
 * @example formatDate('2024-04-15') => '15 April 2024'
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date)
}

/**
 * Format tanggal ke format pendek
 * @example formatDateShort('2024-04-15') => '15 Apr'
 */
export function formatDateShort(dateString: string): string {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('id-ID', {
    month: 'short',
    day: 'numeric',
  }).format(date)
}

/**
 * Format mata uang IDR
 * @example formatCurrency(100000) => 'Rp 100.000'
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount)
}

/**
 * Format nomor dengan separator
 * @example formatNumber(1000000) => '1.000.000'
 */
export function formatNumber(num: number): string {
  return new Intl.NumberFormat('id-ID').format(num)
}

/**
 * Hitung durasi antara dua tanggal dalam hari
 * @example calculateDays('2024-04-15', '2024-04-17') => 2
 */
export function calculateDays(startDate: string, endDate: string): number {
  const start = new Date(startDate)
  const end = new Date(endDate)
  const diffTime = Math.abs(end.getTime() - start.getTime())
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return diffDays
}

/**
 * Check apakah tanggal sudah lewat
 */
export function isDatePassed(dateString: string): boolean {
  return new Date(dateString) < new Date()
}

/**
 * Format status menjadi text yang friendly
 */
export function formatStatus(status: string): string {
  const statusMap: Record<string, string> = {
    pending: 'Menunggu Persetujuan',
    approved: 'Disetujui',
    rejected: 'Ditolak',
    tersedia: 'Tersedia',
    dipinjam: 'Sedang Dipinjam',
    perbaikan: 'Dalam Perbaikan',
  }
  return statusMap[status] || status
}

/**
 * Truncate text dengan ellipsis
 * @example truncateText('Hello World', 5) => 'He...'
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + '...'
}

/**
 * Capitalize first letter
 * @example capitalize('hello') => 'Hello'
 */
export function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1)
}
