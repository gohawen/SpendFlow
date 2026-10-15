import { useEffect, useState } from 'react'
import { ImageIcon, XIcon } from './Icons'
import { rupiah } from '../utils/format'

const inputClass =
  'w-full rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 text-sm outline-none transition ' +
  'focus:border-brand-400 focus:ring-4 focus:ring-brand-200/60 ' +
  'dark:border-white/10 dark:bg-slate-800/70 dark:focus:ring-brand-500/20 dark:[color-scheme:dark]'

// Ubah Date -> "2026-10-15" memakai tanggal LOKAL user.
// (toISOString() tidak dipakai karena memakai UTC, bisa meleset sehari untuk WIB)
const toInputDate = (d) => {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export default function ExpenseModal({ onClose, onSave }) {
  const [name, setName] = useState('')
  const [price, setPrice] = useState('')
  const [location, setLocation] = useState('')
  const [image, setImage] = useState(null)
  const [date, setDate] = useState(() => toInputDate(new Date())) // default: hari ini

  // Tekan Esc untuk menutup
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  const handleFile = (e) => {
    const file = e.target.files?.[0]
    if (file) setImage(URL.createObjectURL(file)) // URL sementara untuk preview
  }

  const submit = (e) => {
    e.preventDefault()

    // Tanggal dari pilihan user + jam dari jam user saat menekan Save
    const [y, m, d] = date.split('-').map(Number)
    const now = new Date()
    const createdAt = new Date(y, m - 1, d, now.getHours(), now.getMinutes(), now.getSeconds())

    onSave({
      id: crypto.randomUUID(),
      name: name.trim(),
      price: Number(price),
      location: location.trim(),
      image,
      createdAt,
    })
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-4">
      {/* Latar gelap; klik untuk menutup */}
      <div onClick={onClose} className="absolute inset-0 animate-fade-up bg-slate-900/40 backdrop-blur-sm" />

      <form onSubmit={submit}
        className="glass relative max-h-[92vh] w-full max-w-md animate-pop overflow-y-auto rounded-b-none bg-white/95 p-6 sm:rounded-3xl dark:bg-slate-900/95">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-extrabold">Add Expense</h2>
          <button type="button" onClick={onClose} aria-label="Close"
            className="grid h-9 w-9 place-items-center rounded-xl text-slate-400 transition hover:bg-slate-100 dark:hover:bg-white/10">
            <XIcon />
          </button>
        </div>

        <div className="space-y-4">
          <label className="block">
            <span className="mb-1.5 block text-xs font-semibold text-slate-500 dark:text-slate-400">Item details</span>
            <input autoFocus required value={name} onChange={(e) => setName(e.target.value)}
              className={inputClass} />
          </label>

          <label className="block">
            <span className="mb-1.5 block text-xs font-semibold text-slate-500 dark:text-slate-400">Price</span>
            <div className="relative">
              <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-slate-400">
                Rp
              </span>
              <input required type="number" min="1" inputMode="numeric" value={price}
                onChange={(e) => setPrice(e.target.value)} placeholder="25000"
                className={`${inputClass} pl-11`} />
            </div>
            {price > 0 && <span className="mt-1 block text-xs font-semibold text-brand-600 dark:text-brand-300">{rupiah(price)}</span>}
          </label>

          <label className="block">
            <span className="mb-1.5 block text-xs font-semibold text-slate-500 dark:text-slate-400">Purchase date</span>
            <input required type="date" value={date} onChange={(e) => setDate(e.target.value)}
              className={inputClass} />
          </label>

          <label className="block">
            <span className="mb-1.5 block text-xs font-semibold text-slate-500 dark:text-slate-400">
              Purchase location <span className="font-normal">(optional)</span>
            </span>
            <input value={location} onChange={(e) => setLocation(e.target.value)}
              className={inputClass} />
          </label>

          <div>
            <span className="mb-1.5 block text-xs font-semibold text-slate-500 dark:text-slate-400">
              Receipt / item photo <span className="font-normal">(optional)</span>
            </span>
            <label className="flex cursor-pointer items-center gap-3 rounded-2xl border-2 border-dashed border-slate-200 p-3 text-sm text-slate-500 transition hover:border-brand-400 hover:text-brand-600 dark:border-white/10">
              {image ? (
                <img src={image} alt="Preview" className="h-14 w-14 rounded-xl object-cover" />
              ) : (
                <span className="grid h-14 w-14 place-items-center rounded-xl bg-slate-100 text-xl dark:bg-white/5"><ImageIcon /></span>
              )}
              <span>{image ? 'Change image' : 'Choose image'}</span>
              <input type="file" accept="image/*" onChange={handleFile} className="hidden" />
            </label>
          </div>
        </div>

        <p className="mt-4 text-xs text-slate-400">The time is recorded automatically from your clock when you save.</p>

        <button type="submit"
          className="mt-5 w-full rounded-2xl bg-gradient-to-r from-brand-500 to-brand-600 py-3 font-bold text-white shadow-lg shadow-brand-500/30 transition hover:brightness-110 active:scale-[0.98]">
          Save
        </button>
      </form>
    </div>
  )
}