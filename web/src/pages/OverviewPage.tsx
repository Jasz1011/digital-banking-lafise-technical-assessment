import { ArrowRight, CircleUserRound, Search, WalletCards } from 'lucide-react'
import { Link } from 'react-router-dom'
import { ProductPreview } from '../components/ProductPreview'

const quickActions = [
  {
    title: 'Crear cliente',
    description: 'Registra los datos esenciales para comenzar.',
    to: '/clientes/nuevo',
    icon: CircleUserRound,
    tone: 'green',
  },
  {
    title: 'Crear cuenta',
    description: 'Abre una cuenta con un identificador de cliente.',
    to: '/cuentas/nueva',
    icon: WalletCards,
    tone: 'cyan',
  },
  {
    title: 'Consultar cuenta',
    description: 'Revisa saldo y movimientos por número de cuenta.',
    to: '/cuentas/buscar',
    icon: Search,
    tone: 'blue',
  },
]

export function OverviewPage() {
  return (
    <div>
      <section className="hero-wash overflow-hidden">
        <div className="mx-auto grid min-h-[38rem] max-w-[76rem] items-center gap-12 px-5 py-14 sm:px-7 md:min-h-[42rem] lg:grid-cols-[minmax(0,0.92fr)_minmax(28rem,1.08fr)] lg:px-8 lg:py-16">
          <div className="relative z-10 max-w-xl">
            <p className="text-sm font-semibold tracking-[0.08em] text-[var(--brand-primary)]">
              LAFISE Digital
            </p>
            <h1 className="mt-5 text-[clamp(2.75rem,7vw,5rem)] font-semibold leading-[0.98] tracking-[-0.065em] text-[var(--text-primary)]">
              Tu banca,
              <span className="block text-[var(--brand-primary)]">más simple.</span>
            </h1>
            <p className="mt-6 max-w-lg text-base leading-7 text-[var(--text-secondary)] sm:text-lg sm:leading-8">
              Consulta tu cuenta, revisa tu saldo y gestiona tus movimientos desde un solo lugar.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/cuentas/buscar"
                className="inline-flex min-h-13 items-center justify-center gap-2 rounded-full bg-[var(--brand-primary)] px-7 text-sm font-semibold text-white shadow-[0_14px_30px_rgba(0,157,78,0.22)] transition hover:-translate-y-0.5 hover:bg-[var(--brand-primary-dark)]"
              >
                Consultar cuenta
                <ArrowRight aria-hidden="true" className="size-4" />
              </Link>
              <Link
                to="/clientes/nuevo"
                className="inline-flex min-h-13 items-center justify-center rounded-full border border-[var(--border-strong)] bg-white/78 px-7 text-sm font-semibold text-[var(--brand-primary-dark)] transition hover:-translate-y-0.5 hover:border-[var(--brand-primary)] hover:bg-white"
              >
                Crear cliente
              </Link>
            </div>
          </div>

          <div className="relative min-h-[28rem] lg:min-h-[35rem]">
            <ProductPreview />
          </div>
        </div>
      </section>

      <section className="bg-white py-16 sm:py-20" aria-labelledby="quick-actions-title">
        <div className="mx-auto max-w-[76rem] px-5 sm:px-7 lg:px-8">
          <div className="max-w-xl">
            <p className="text-sm font-semibold text-[var(--brand-primary)]">Acciones rápidas</p>
            <h2
              id="quick-actions-title"
              className="mt-2 text-3xl font-semibold tracking-[-0.045em] text-[var(--text-primary)] sm:text-4xl"
            >
              Hazlo desde aquí
            </h2>
          </div>

          <div className="mt-9 grid gap-4 md:grid-cols-3">
            {quickActions.map((action) => {
              const Icon = action.icon
              return (
                <Link
                  key={action.to}
                  to={action.to}
                  className="quick-card group"
                  data-tone={action.tone}
                >
                  <span className="quick-card-icon">
                    <Icon aria-hidden="true" className="size-6" strokeWidth={1.8} />
                  </span>
                  <div className="mt-8">
                    <h3 className="text-lg font-semibold text-[var(--text-primary)]">{action.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">
                      {action.description}
                    </p>
                  </div>
                  <span className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-[var(--brand-primary-dark)]">
                    Continuar
                    <ArrowRight
                      aria-hidden="true"
                      className="size-4 transition-transform group-hover:translate-x-1"
                    />
                  </span>
                </Link>
              )
            })}
          </div>
        </div>
      </section>
    </div>
  )
}
