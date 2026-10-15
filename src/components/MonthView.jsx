import { useState } from 'react'
import { ChevronLeft, ChevronRight, ImageIcon, TrashIcon } from './Icons'
import { compact, dateTime, rupiah } from '../utils/format'

const HARI = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const BULAN_PENDEK = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

// Thumbnail gambar (atau ikon kosong). Dipakai di tabel dan di kartu.
function Thumb({ e, size = 'h-10 w-10' }) {
  return e.image ? (
    <a href={e.image} target="_blank" rel="noreferrer" className="shrink-0">
      <img src={e.image} alt={`Receipt for ${e.name}`}
        className={`${size} rounded-xl object-cover transition hover:scale-110`} />
    </a>
  ) : (
    <span className={`${size} grid shrink-0 place-items-center rounded-xl bg-slate-100 text-slate-300 dark:bg-white/5 dark:text-slate-600`}>
      <ImageIcon />
    </span>
  )
}

function DeleteButton({ e, onDelete }) {
  return (
    <button onClick={() => onDelete(e.id)} aria-label={`Delete ${e.name}`}
      className="grid h-9 w-9 shrink-0 place-items-center rounded-xl text-slate-400 transition hover:bg-red-50 hover:text-red-500 active:scale-90 dark:hover:bg-red-500/10">
      <TrashIcon />
    </button>
  )
}

// Tabel pengeluaran dipakai di 2 tempat (halaman kalender dan detail bulan di rekap).
// Layar kecil (di bawah md): tampil sebagai daftar kartu.
// Layar besar (md ke atas): tampil sebagai tabel.
function ExpenseTable({ list, onDelete }) {
  if (list.length === 0) {
    return (
      <div className="glass px-5 py-12 text-center text-sm text-slate-400">
        No expenses yet.
      </div>
    )
  }

  return (
    <>
      {/* ---------- Tampilan kartu (HP) ---------- */}
      <ul className="space-y-3 md:hidden">
        {list.map((e) => (
          <li key={e.id} className="glass animate-fade-up flex items-center gap-3 p-3">
            <Thumb e={e} size="h-14 w-14" />

            <div className="min-w-0 flex-1">
              <p className="truncate font-semibold">{e.name}</p>
              {e.location && (
                <p className="truncate text-xs text-slate-500 dark:text-slate-400">at {e.location}</p>
              )}
              <p className="mt-0.5 text-[11px] text-slate-400">{dateTime(e.createdAt)}</p>
            </div>

            <div className="flex shrink-0 flex-col items-end gap-1">
              <p className="font-bold tabular-nums text-brand-700 dark:text-brand-300">{rupiah(e.price)}</p>
              <DeleteButton e={e} onDelete={onDelete} />
            </div>
          </li>
        ))}
      </ul>

      {/* ---------- Tampilan tabel (layar besar) ---------- */}
      <div className="glass hidden overflow-hidden md:block">
        <table className="w-full text-left text-sm">
          <thead className="bg-brand-50/70 text-xs uppercase tracking-wider text-slate-500 dark:bg-white/5 dark:text-slate-400">
            <tr>
              <th className="px-5 py-3">Item Details</th>
              <th className="px-5 py-3">Price</th>
              <th className="px-5 py-3">Purchase Time</th>
              <th className="px-5 py-3" colSpan={2}>Image</th>
            </tr>
          </thead>
          <tbody>
            {list.map((e) => (
              <tr key={e.id}
                className="animate-fade-up border-t border-slate-100 transition hover:bg-brand-50/50 dark:border-white/5 dark:hover:bg-white/5">
                <td className="px-5 py-3">
                  <p className="font-semibold">{e.name}</p>
                  {e.location && <p className="text-xs text-slate-500 dark:text-slate-400">at {e.location}</p>}
                </td>
                <td className="px-5 py-3 font-semibold tabular-nums">{rupiah(e.price)}</td>
                <td className="px-5 py-3 text-slate-500 dark:text-slate-400">{dateTime(e.createdAt)}</td>
                <td className="px-5 py-3"><Thumb e={e} /></td>
                <td className="px-5 py-3 text-right"><DeleteButton e={e} onDelete={onDelete} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}

export default function MonthView({ expenses, onDelete }) {
  const [viewDate, setViewDate] = useState(() => {
    const n = new Date()
    return new Date(n.getFullYear(), n.getMonth(), 1)
  })
  const [selectedDay, setSelectedDay] = useState(null)

  // Tahun yang sedang direkap. null = tampilkan kalender biasa.
  // Saat recap aktif, viewDate selalu menunjuk Januari tahun berikutnya.
  const [recap, setRecap] = useState(null)

  // Bulan (0-11) yang batangnya diklik di halaman rekap. null = belum ada yang dipilih.
  const [recapMonth, setRecapMonth] = useState(null)

  const today = new Date()
  const year = viewDate.getFullYear()
  const month = viewDate.getMonth()
  const monthLabel = new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(viewDate)

  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const offset = (new Date(year, month, 1).getDay() + 6) % 7 // kotak kosong sebelum tanggal 1

  // Pengeluaran bulan yang sedang dilihat
  const monthExpenses = expenses.filter(
    (e) => e.createdAt.getFullYear() === year && e.createdAt.getMonth() === month
  )

  // Total per tanggal: { 15: 50000, 16: 12000 }
  const totals = {}
  monthExpenses.forEach((e) => {
    const d = e.createdAt.getDate()
    totals[d] = (totals[d] || 0) + e.price
  })

  const monthTotal = monthExpenses.reduce((s, e) => s + e.price, 0)
  const list = monthExpenses
    .filter((e) => !selectedDay || e.createdAt.getDate() === selectedDay)
    .sort((a, b) => b.createdAt - a.createdAt)

  // ---------- Rekap tahun (hanya dihitung saat recap aktif) ----------
  const yearExpenses = recap === null ? [] : expenses.filter((e) => e.createdAt.getFullYear() === recap)
  const yearTotal = yearExpenses.reduce((s, e) => s + e.price, 0)

  // Total tiap bulan dalam tahun itu: array 12 angka [Jan, ..., Dec]
  const perMonth = Array(12).fill(0)
  yearExpenses.forEach((e) => {
    perMonth[e.createdAt.getMonth()] += e.price
  })
  const maxMonth = Math.max(...perMonth, 1) // minimal 1 supaya tidak dibagi 0

  // ---------- Detail bulan yang dipilih di rekap ----------
  const recapMonthExpenses =
    recap !== null && recapMonth !== null
      ? yearExpenses
          .filter((e) => e.createdAt.getMonth() === recapMonth)
          .sort((a, b) => b.createdAt - a.createdAt)
      : []
  const recapMonthTotal = recapMonthExpenses.reduce((s, e) => s + e.price, 0)
  const recapMonthLabel =
    recap !== null && recapMonth !== null
      ? new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(new Date(recap, recapMonth, 1))
      : ''

  // ---------- Navigasi ----------
  const goNext = () => {
    setSelectedDay(null)
    setRecapMonth(null)
    if (recap !== null) {
      setRecap(null)
      return
    }
    if (month === 11) {
      setViewDate(new Date(year + 1, 0, 1))
      setRecap(year)
      return
    }
    setViewDate(new Date(year, month + 1, 1))
  }

  const goPrev = () => {
    setSelectedDay(null)
    setRecapMonth(null)
    if (recap !== null) {
      setViewDate(new Date(recap, 11, 1))
      setRecap(null)
      return
    }
    if (month === 0) {
      setRecap(year - 1)
      return
    }
    setViewDate(new Date(year, month - 1, 1))
  }

  const isToday = (d) =>
    today.getFullYear() === year && today.getMonth() === month && today.getDate() === d

  return (
    <section className="mt-10 animate-fade-up" style={{ animationDelay: '500ms' }}>
      {/* Navigasi bulan */}
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="min-w-0">
          <h2 className="truncate text-xl font-extrabold">
            {recap !== null ? `${recap} Recap` : monthLabel}
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {recap !== null ? (
              'Yearly summary'
            ) : (
              <>
                Total this month: <span className="font-bold text-brand-600 dark:text-brand-300">{rupiah(monthTotal)}</span>
              </>
            )}
          </p>
        </div>
        <div className="flex shrink-0 gap-2">
          <button onClick={goPrev} aria-label="Previous"
            className="glass grid h-10 w-10 place-items-center rounded-xl transition hover:scale-105 active:scale-95">
            <ChevronLeft />
          </button>
          <button onClick={goNext} aria-label="Next"
            className="glass grid h-10 w-10 place-items-center rounded-xl transition hover:scale-105 active:scale-95">
            <ChevronRight />
          </button>
        </div>
      </div>

      {recap !== null ? (
        /* ---------- Halaman rekap tahun ---------- */
        <>
          <div key={recap} className="glass animate-pop p-4 sm:p-6">
            <div className="flex flex-wrap items-end justify-between gap-2">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Spending in {recap}
                </p>
                <p className="mt-1 text-2xl font-extrabold tabular-nums text-brand-700 dark:text-brand-300 sm:text-3xl">
                  {rupiah(yearTotal)}
                </p>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {yearExpenses.length} {yearExpenses.length === 1 ? 'transaction' : 'transactions'}
              </p>
            </div>

            {/* Grafik batang 12 bulan: tiap kolom bisa diklik */}
            <div className="mt-6 grid grid-cols-12 items-end gap-1 sm:gap-3">
              {perMonth.map((val, i) => {
                const active = recapMonth === i
                const dimmed = recapMonth !== null && !active
                return (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setRecapMonth(active ? null : i)}
                    aria-label={`Show ${BULAN_PENDEK[i]} details`}
                    aria-pressed={active}
                    className="group flex min-w-0 flex-col items-center gap-2 rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-brand-400"
                  >
                    <div className="flex h-28 w-full items-end">
                      <div
                        title={`${BULAN_PENDEK[i]}: ${rupiah(val)}`}
                        className={`w-full rounded-t-lg bg-gradient-to-t from-brand-500 to-brand-300 transition-all duration-500 group-hover:brightness-110 group-active:scale-95
                          ${dimmed ? 'opacity-40' : 'opacity-100'}
                          ${active ? 'ring-2 ring-brand-300 ring-offset-2 ring-offset-transparent' : ''}`}
                        style={{ height: `${val > 0 ? Math.max((val / maxMonth) * 100, 6) : 0}%` }}
                      />
                    </div>
                    <span
                      className={`text-[9px] font-semibold transition sm:text-xs
                        ${active ? 'text-brand-600 dark:text-brand-300' : 'text-slate-400 group-hover:text-slate-500'}`}
                    >
                      {BULAN_PENDEK[i]}
                    </span>
                  </button>
                )
              })}
            </div>

            {recapMonth === null && (
              <p className="mt-5 text-center text-xs text-slate-400">Click a bar to see that month's details.</p>
            )}
          </div>

          {/* Detail bulan yang dipilih */}
          {recapMonth !== null && (
            <div key={`${recap}-${recapMonth}`} className="mt-4 animate-fade-up">
              <div className="mb-3 flex flex-wrap items-end justify-between gap-2 px-1">
                <div>
                  <h3 className="text-lg font-extrabold">{recapMonthLabel}</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Total: <span className="font-bold text-brand-600 dark:text-brand-300">{rupiah(recapMonthTotal)}</span>
                  </p>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {recapMonthExpenses.length} {recapMonthExpenses.length === 1 ? 'transaction' : 'transactions'}
                </p>
              </div>
              <ExpenseTable list={recapMonthExpenses} onDelete={onDelete} />
            </div>
          )}
        </>
      ) : (
        <>
          {/* Kalender */}
          <div className="glass p-2 sm:p-5">
            <div className="mb-2 grid grid-cols-7 text-center text-[11px] font-semibold text-slate-400 sm:text-xs">
              {HARI.map((h) => <div key={h}>{h}</div>)}
            </div>

            {/* key={monthLabel} membuat grid dianimasikan ulang tiap ganti bulan */}
            <div key={monthLabel} className="grid animate-fade-up grid-cols-7 gap-1 sm:gap-2">
              {Array.from({ length: offset }).map((_, i) => <div key={`blank-${i}`} />)}

              {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((d) => {
                const selected = selectedDay === d
                return (
                  <button
                    key={d}
                    onClick={() => setSelectedDay(selected ? null : d)}
                    className={`relative aspect-square rounded-xl p-1 text-sm transition sm:rounded-2xl sm:p-2
                      ${selected ? 'bg-brand-500 text-white' : 'hover:bg-brand-100/70 dark:hover:bg-white/10'}
                      ${isToday(d) && !selected ? 'ring-2 ring-brand-400' : ''}`}
                  >
                    {/* Nomor tanggal: tetap di pojok atas */}
                    <span className="absolute left-0 right-0 top-1 text-xs font-semibold sm:top-2 sm:text-sm">{d}</span>

                    {/* Total harian: tepat di tengah kotak */}
                    {totals[d] && (
                      <span className="absolute inset-0 grid place-items-center">
                        <span className="mt-3 text-[10px] font-bold opacity-90 sm:mt-4 sm:text-base">
                          {compact.format(totals[d])}
                        </span>
                      </span>
                    )}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Daftar pengeluaran */}
          <div className="mt-4">
            <ExpenseTable list={list} onDelete={onDelete} />
          </div>
        </>
      )}
    </section>
  )
}