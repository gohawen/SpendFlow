import { MoonIcon, SunIcon, WalletIcon } from './Icons'

export default function Header({ theme, onToggleTheme }) {
  return (
    <header className="animate-fade-up flex items-center justify-between py-6">
      <div className="flex items-center gap-3">
        <div className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-brand-400 to-brand-600 text-white shadow-lg shadow-brand-500/30">
          <WalletIcon className="text-xl" />
        </div>
        <div>
          <h1 className="text-lg font-extrabold leading-none">
            Spend<span className="text-brand-500">Flow</span>
          </h1>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Track your spending, hassle-free
          </p>
        </div>
      </div>

      <button
        onClick={onToggleTheme}
        aria-label="Toggle theme"
        className="glass grid h-11 w-11 place-items-center rounded-2xl text-lg transition hover:scale-105 active:scale-95"
      >
        {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
      </button>
    </header>
  )
}