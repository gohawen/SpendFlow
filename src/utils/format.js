// Format angka -> "Rp 25,000" (mata uang tetap Rupiah, pemisah ribuan gaya Inggris)
const numberFormat = new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 })
export const rupiah = (n) => `Rp ${numberFormat.format(n)}`

// "Thursday, October 15, 2026"
export const fullDate = (d) =>
  new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(d)

// "Oct 15, 2026, 12:57"
export const dateTime = (d) =>
  new Intl.DateTimeFormat('en-US', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).format(d)

// Angka ringkas untuk kalender: 25000 -> "25K"
export const compact = new Intl.NumberFormat('en-US', { notation: 'compact' })

// Awal minggu (Senin 00:00) dari sebuah tanggal
export const startOfWeek = (d) => {
  const x = new Date(d)
  const diff = (x.getDay() + 6) % 7 // Senin = 0
  x.setDate(x.getDate() - diff)
  x.setHours(0, 0, 0, 0)
  return x
}