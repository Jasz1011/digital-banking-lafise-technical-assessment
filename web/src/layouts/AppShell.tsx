import { CircleUserRound, Home, Search, WalletCards } from 'lucide-react'
import { Link, Outlet, useLocation } from 'react-router-dom'
import { BrandMark } from '../components/BrandMark'
import { cn } from '../lib/styles'

const navigation = [
  { label: 'Inicio', to: '/', icon: Home, section: '/' },
  { label: 'Clientes', to: '/clientes/nuevo', icon: CircleUserRound, section: '/clientes' },
  { label: 'Cuentas', to: '/cuentas/buscar', icon: WalletCards, section: '/cuentas' },
]

function isCurrentSection(pathname: string, section: string) {
  return section === '/' ? pathname === '/' : pathname.startsWith(section)
}

function DesktopNavigation() {
  const { pathname } = useLocation()

  return (
    <nav aria-label="Navegación principal" className="hidden items-center gap-9 md:flex">
      {navigation.map((item) => {
        const isActive = isCurrentSection(pathname, item.section)
        return (
          <Link
            key={item.to}
            to={item.to}
            aria-current={isActive ? 'page' : undefined}
            className={cn(
              'relative py-2 text-[0.9rem] font-semibold transition-colors after:absolute after:inset-x-0 after:-bottom-1 after:h-[3px] after:origin-center after:rounded-full after:bg-[var(--brand-primary)] after:transition-transform',
              isActive
                ? 'text-[var(--brand-primary-deep)] after:scale-x-100'
                : 'text-[var(--text-secondary)] after:scale-x-0 hover:text-[var(--brand-primary)]',
            )}
          >
            {item.label}
          </Link>
        )
      })}
    </nav>
  )
}

function MobileNavigation() {
  const { pathname } = useLocation()

  return (
    <nav
      aria-label="Navegación móvil"
      className="fixed inset-x-0 bottom-0 z-40 flex border-t border-[var(--border-subtle)] bg-white/98 px-2 pb-[calc(env(safe-area-inset-bottom)+0.25rem)] pt-1 shadow-[0_-8px_30px_rgba(0,0,0,0.04)] backdrop-blur-xl md:hidden"
    >
      {navigation.map((item) => {
        const Icon = item.icon
        const isActive = isCurrentSection(pathname, item.section)
        return (
          <Link
            key={item.to}
            to={item.to}
            aria-current={isActive ? 'page' : undefined}
            className={cn(
              'group flex min-h-14 flex-1 flex-col items-center justify-center gap-1 rounded-2xl text-[0.65rem] font-semibold transition-all',
              isActive
                ? 'text-[var(--brand-primary)]'
                : 'text-[var(--text-tertiary)] hover:text-[var(--text-secondary)] hover:bg-[var(--surface-soft)]',
            )}
          >
            <Icon aria-hidden="true" className={cn("size-6 transition-transform", isActive ? "scale-110" : "group-hover:scale-105")} strokeWidth={isActive ? 2.5 : 2} />
            {item.label}
          </Link>
        )
      })}
    </nav>
  )
}

export function AppShell() {
  return (
    <div className="min-h-screen bg-[var(--surface-soft)]">
      <a
        href="#main-content"
        className="fixed top-3 left-3 z-[100] -translate-y-20 rounded-lg bg-[var(--brand-primary-dark)] px-4 py-2 text-sm font-semibold text-white focus:translate-y-0"
      >
        Ir al contenido
      </a>

      <header className="sticky top-0 z-30 border-b border-[var(--border-subtle)] bg-white/92 backdrop-blur-xl">
        <div className="mx-auto flex h-[4.5rem] max-w-[76rem] items-center justify-between gap-8 px-5 sm:px-7 lg:px-8">
          <BrandMark />
          <DesktopNavigation />
          <Link
            to="/cuentas/buscar"
            className="inline-flex min-h-10 items-center gap-2 rounded-full bg-[var(--brand-primary)] px-4 text-sm font-semibold text-white shadow-[0_8px_22px_rgba(0,157,78,0.18)] transition hover:-translate-y-0.5 hover:bg-[var(--brand-primary-dark)]"
          >
            <Search aria-hidden="true" className="size-4" />
            <span className="hidden sm:inline">Consultar cuenta</span>
            <span className="sm:hidden">Consultar</span>
          </Link>
        </div>
      </header>

      <main id="main-content" className="pb-24 md:pb-0">
        <div className="page-enter">
          <Outlet />
        </div>
      </main>

      <footer className="mb-16 border-t border-[var(--border-subtle)] bg-white md:mb-0">
        <div className="mx-auto flex max-w-[76rem] flex-col items-start justify-between gap-3 px-5 py-6 text-xs text-[var(--text-tertiary)] sm:px-7 md:flex-row md:items-center lg:px-8">
          <BrandMark />
          <p>Technical assessment project · Not an official Banco LAFISE product.</p>
        </div>
      </footer>

      <MobileNavigation />
    </div>
  )
}
