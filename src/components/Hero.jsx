import { useEffect, useState } from 'react'
import { PlusIcon } from './Icons'

export default function Hero({ onAdd }) {
  const [now, setNow] = useState(new Date())

  // Update jam tiap 1 detik; cleanup mencegah timer menumpuk
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])

  // Tanggal dipecah jadi 2 bagian supaya bisa diberi ukuran berbeda
  const weekday = new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(now)
  const dateLine = new Intl.DateTimeFormat('en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(now)

  const time = now.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hourCycle: 'h23',
  })

  return (
    <section className="animate-fade-up py-8 text-center" style={{ animationDelay: '100ms' }}>
      {/* Tanggal: bagian utama (besar) */}
      <p className="text-sm font-bold uppercase tracking-[0.2em] text-brand-600 dark:text-brand-300 sm:text-base">
        {weekday}
      </p>
      <h2 className="mt-1 text-3xl font-extrabold tracking-tight sm:text-5xl">{dateLine}</h2>

      {/* Jam: pendukung (lebih kecil) */}
      <p className="mt-3 text-xl font-bold tabular-nums tracking-tight text-slate-500 dark:text-slate-400 sm:text-3xl">
        {time}
      </p>

      <div className="mt-8 flex flex-col items-center gap-3">
        <button
          onClick={onAdd}
          aria-label="Add expense"
          className="group relative grid h-24 w-24 place-items-center rounded-full bg-gradient-to-br from-brand-400 to-brand-600 text-white shadow-xl shadow-brand-500/40 transition hover:scale-110 active:scale-95"
        >
          {/* lingkaran yang melebar & memudar berulang */}
          <span className="absolute inset-0 animate-ring rounded-full bg-brand-400/50" />
          <PlusIcon className="relative text-4xl transition-transform duration-300 group-hover:rotate-90" />
        </button>
        <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">+ Expense</p>
      </div>
    </section>
  )
}