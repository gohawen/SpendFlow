import { useState } from 'react'
import useTheme from './hooks/useTheme'
import Header from './components/Header'
import Hero from './components/Hero'
import SummaryCards from './components/SummaryCards'
import MonthView from './components/MonthView'
import ExpenseModal from './components/ExpenseModal'

export default function App() {
  const { theme, toggle } = useTheme()
  const [expenses, setExpenses] = useState([]) // "database" kita: array di memori
  const [open, setOpen] = useState(false)

  const addExpense = (item) => setExpenses((prev) => [item, ...prev])
  const deleteExpense = (id) => setExpenses((prev) => prev.filter((x) => x.id !== id))

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Bola warna blur yang melayang pelan di latar */}
      <div className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 animate-float rounded-full bg-brand-300/40 blur-3xl dark:bg-brand-600/20" />
      <div className="pointer-events-none absolute -right-32 top-1/3 h-96 w-96 animate-float rounded-full bg-brand-200/50 blur-3xl [animation-delay:-4s] dark:bg-brand-500/10" />

      <div className="relative mx-auto max-w-5xl px-4 pb-16 sm:px-6">
        <Header theme={theme} onToggleTheme={toggle} />
        <Hero onAdd={() => setOpen(true)} />
        <SummaryCards expenses={expenses} />
        <MonthView expenses={expenses} onDelete={deleteExpense} />
      </div>

      {open && <ExpenseModal onClose={() => setOpen(false)} onSave={addExpense} />}
    </div>
  )
}