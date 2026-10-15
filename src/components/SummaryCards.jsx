import useCountUp from '../hooks/useCountUp'
import { rupiah, startOfWeek } from '../utils/format'

function StatCard({ label, hint, amount, delay }) {
  const shown = useCountUp(amount)
  return (
    <div
      className="glass animate-fade-up p-5 transition hover:-translate-y-1 hover:shadow-xl"
      style={{ animationDelay: `${delay}ms` }}
    >
      <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
        {label}
      </p>
      <p className="mt-2 text-2xl font-extrabold tabular-nums text-brand-700 dark:text-brand-300">
        {rupiah(shown)}
      </p>
      <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{hint}</p>
    </div>
  )
}

// Cek apakah dua tanggal jatuh di hari yang sama
const isSameDay = (a, b) =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate()

export default function SummaryCards({ expenses }) {
  const now = new Date()
  const weekStart = startOfWeek(now) // Senin 00:00 minggu ini

  // Awal minggu DEPAN (Senin 00:00). Batas atas supaya tanggal di masa depan tidak ikut.
  const nextWeekStart = new Date(weekStart)
  nextWeekStart.setDate(weekStart.getDate() + 7)

  // Hari terakhir minggu ini (Minggu), hanya untuk teks label
  const weekEnd = new Date(weekStart)
  weekEnd.setDate(weekStart.getDate() + 6)

  const total = (filterFn) =>
    expenses.filter((e) => filterFn(e.createdAt)).reduce((sum, e) => sum + e.price, 0)

  const day = total((d) => isSameDay(d, now))
  const week = total((d) => d >= weekStart && d < nextWeekStart) // dibatasi kedua sisi
  const month = total((d) => d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear())

  const short = new Intl.DateTimeFormat('en-US', { day: 'numeric', month: 'short' })
  const dayLabel = new Intl.DateTimeFormat('en-US', { weekday: 'long', day: 'numeric', month: 'short' }).format(now)
  const monthName = new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(now)

  return (
    <section className="grid gap-4 sm:grid-cols-3">
      <StatCard label="Today" hint={dayLabel} amount={day} delay={200} />
      <StatCard label="This week" hint={`${short.format(weekStart)} - ${short.format(weekEnd)}`} amount={week} delay={300} />
      <StatCard label="This month" hint={monthName} amount={month} delay={400} />
    </section>
  )
}