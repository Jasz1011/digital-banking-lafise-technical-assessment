import { ArrowRight, CircleUserRound, Search, WalletCards } from 'lucide-react'
import { Link } from 'react-router-dom'
import { ProductPreview } from '../components/ProductPreview'



export function OverviewPage() {
  return (
    <div>
      <section className="hero-wash relative overflow-hidden pb-12 pt-16 sm:pb-24 sm:pt-24 lg:pb-32 lg:pt-32">
        <div className="mx-auto max-w-[76rem] px-5 sm:px-7 lg:px-8">
          <div className="grid items-center gap-16 lg:grid-cols-2 lg:gap-8">
            <div className="relative z-10 max-w-2xl">
              <p className="inline-flex items-center gap-2 rounded-full bg-white/60 px-3 py-1 text-xs font-semibold tracking-wide text-[var(--brand-primary-dark)] shadow-sm backdrop-blur-md ring-1 ring-[var(--brand-primary)]/10">
                <span className="flex size-1.5 rounded-full bg-[var(--brand-primary)]"></span>
                LAFISE Digital
              </p>
              <h1 className="mt-6 text-[clamp(2.5rem,6vw,4.5rem)] font-bold leading-[1.05] tracking-tight text-[var(--text-primary)]">
                Tu banca, <br className="hidden sm:block" />
                <span className="text-[var(--brand-primary)]">más simple.</span>
              </h1>
              <p className="mt-6 max-w-lg text-base leading-relaxed text-[var(--text-secondary)] sm:text-lg">
                Consulta tu cuenta, revisa tu saldo y gestiona tus movimientos desde un solo lugar. Todo el poder de LAFISE en tus manos.
              </p>
              <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
                <Link
                  to="/cuentas/buscar"
                  className="inline-flex h-14 items-center justify-center gap-2 rounded-full bg-[var(--brand-primary)] px-8 text-sm font-semibold text-white shadow-lg shadow-[var(--brand-primary)]/20 transition-all hover:-translate-y-0.5 hover:bg-[var(--brand-primary-dark)] hover:shadow-[var(--brand-primary)]/30 active:translate-y-0"
                >
                  Consultar cuenta
                  <ArrowRight aria-hidden="true" className="size-4" />
                </Link>
                <Link
                  to="/clientes/nuevo"
                  className="inline-flex h-14 items-center justify-center rounded-full bg-white px-8 text-sm font-semibold text-[var(--brand-primary-dark)] shadow-sm ring-1 ring-[var(--border-strong)] transition-all hover:-translate-y-0.5 hover:bg-[var(--surface-soft)] hover:shadow active:translate-y-0"
                >
                  Crear cliente
                </Link>
              </div>
            </div>

            <div className="relative mx-auto w-full max-w-lg lg:max-w-none">
              <div className="absolute -inset-x-4 -inset-y-10 z-0 bg-gradient-to-br from-[var(--brand-mint)]/40 to-[var(--cyan-soft)]/40 blur-3xl sm:-inset-x-10 sm:-inset-y-20"></div>
              <ProductPreview />
            </div>
          </div>
        </div>
      </section>

      <section className="relative z-10 -mt-8 px-5 pb-20 sm:px-7 lg:px-8">
        <div className="mx-auto max-w-[76rem]">
          <div className="grid gap-5 md:grid-cols-12 md:grid-rows-2 lg:gap-6">
            <Link
              to="/clientes/nuevo"
              className="group relative flex min-h-[14rem] flex-col overflow-hidden rounded-[var(--radius-lg)] bg-white p-6 shadow-[var(--shadow-sm)] transition-all hover:-translate-y-1 hover:shadow-[var(--shadow-md)] md:col-span-4 md:row-span-1"
            >
              {/* Decorative graphic */}
              <div className="absolute -right-6 -top-6 z-0 grid size-36 place-items-center rounded-full bg-gradient-to-br from-[var(--brand-mint)] to-[var(--cyan-soft)] opacity-80 transition-transform duration-500 group-hover:scale-110 group-hover:bg-[var(--brand-mint)]">
                <CircleUserRound className="size-20 text-[var(--brand-primary)] opacity-30" strokeWidth={1} />
              </div>

              <div className="relative z-10 flex h-full flex-col justify-between">
                <span className="grid size-12 w-12 place-items-center rounded-xl bg-[var(--brand-mint)] text-[var(--brand-primary-dark)] shadow-sm transition-transform duration-300 group-hover:-translate-y-1 group-hover:shadow-md">
                  <CircleUserRound aria-hidden="true" className="size-5" strokeWidth={1.8} />
                </span>
                <div className="mt-8 md:mt-4">
                  <h3 className="text-lg font-semibold tracking-tight text-[var(--text-primary)]">Crear cliente</h3>
                  <p className="mt-1 text-sm text-[var(--text-secondary)]">Registra los datos esenciales.</p>
                </div>
              </div>
            </Link>

            <Link
              to="/cuentas/nueva"
              className="group relative flex min-h-[19rem] flex-col overflow-hidden rounded-[var(--radius-lg)] bg-gradient-to-br from-[var(--brand-primary-deep)] via-[var(--brand-primary-dark)] to-[var(--brand-primary)] p-7 text-white shadow-[var(--shadow-sm)] transition-all hover:-translate-y-1 hover:shadow-[var(--shadow-card)] md:col-span-8 md:row-span-2"
            >
              <div className="absolute -right-20 -top-20 z-0 h-80 w-80 rounded-full bg-[var(--brand-cyan)]/20 blur-[80px]"></div>
              <div className="absolute -bottom-10 -left-10 z-0 h-40 w-40 rounded-full bg-[var(--brand-primary)]/40 blur-[60px]"></div>
              
              {/* Decorative floating card */}
              <div className="absolute -right-16 top-1/2 z-0 hidden w-[22rem] -translate-y-1/2 rotate-[-12deg] transition-transform duration-700 ease-out group-hover:rotate-[-8deg] group-hover:scale-105 sm:block md:-right-8 lg:-right-4">
                <div className="aspect-[1.586/1] w-full overflow-hidden rounded-2xl border border-white/20 bg-white/10 p-6 shadow-[0_20px_50px_rgba(0,0,0,0.15)] backdrop-blur-xl">
                  <div className="relative z-10 flex h-full flex-col justify-between">
                    <div className="flex items-center justify-between">
                      <div className="h-8 w-12 rounded-md bg-white/20 shadow-inner"></div>
                      <div className="text-right">
                        <p className="text-lg font-bold tracking-tight text-white/90">LAFISE</p>
                        <p className="text-[0.55rem] font-medium tracking-widest text-white/60">DIGITAL</p>
                      </div>
                    </div>
                    <div>
                      <div className="h-3.5 w-3/4 rounded-full bg-white/20"></div>
                      <div className="mt-3 flex items-center gap-3">
                        <div className="h-3 w-12 rounded-full bg-white/15"></div>
                        <div className="h-3 w-12 rounded-full bg-white/15"></div>
                        <div className="h-3 w-12 rounded-full bg-white/15"></div>
                      </div>
                    </div>
                  </div>
                  {/* Card inner gloss */}
                  <div className="absolute -left-[100%] top-0 z-0 h-[200%] w-1/2 -rotate-45 bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
                </div>
              </div>

              <div className="relative z-10 flex h-full flex-col justify-between md:w-[60%]">
                <span className="grid size-14 place-items-center rounded-2xl bg-white/10 shadow-sm backdrop-blur-md ring-1 ring-white/20">
                  <WalletCards aria-hidden="true" className="size-6 text-white" strokeWidth={1.8} />
                </span>
                <div className="mt-16 md:mt-auto">
                  <h3 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">Abre una cuenta</h3>
                  <p className="mt-3 max-w-sm text-sm leading-relaxed text-white/90 sm:text-base">
                    Comienza a gestionar tus finanzas hoy mismo. Un proceso rápido y 100% digital.
                  </p>
                  <span className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-[var(--brand-primary-dark)] shadow-lg transition-transform group-hover:translate-x-1">
                    Comenzar ahora
                    <ArrowRight aria-hidden="true" className="size-4" />
                  </span>
                </div>
              </div>
            </Link>

            <Link
              to="/cuentas/buscar"
              className="group relative flex min-h-[14rem] flex-col overflow-hidden rounded-[var(--radius-lg)] bg-white p-6 shadow-[var(--shadow-sm)] transition-all hover:-translate-y-1 hover:shadow-[var(--shadow-md)] md:col-span-4 md:row-span-1"
            >
              {/* Decorative graphic */}
              <div className="absolute -bottom-8 -right-8 z-0 grid size-40 place-items-center rounded-[2rem] bg-gradient-to-tl from-[var(--cyan-soft)] to-transparent opacity-80 transition-transform duration-500 group-hover:-translate-x-2 group-hover:-translate-y-2 group-hover:rotate-[-6deg]">
                <Search className="size-24 text-[var(--brand-blue)] opacity-20" strokeWidth={1} />
              </div>

              <div className="relative z-10 flex h-full flex-col justify-between">
                <span className="grid size-12 w-12 place-items-center rounded-xl bg-[var(--cyan-soft)] text-[var(--brand-blue)] shadow-sm transition-transform duration-300 group-hover:-translate-y-1 group-hover:shadow-md">
                  <Search aria-hidden="true" className="size-5" strokeWidth={1.8} />
                </span>
                <div className="mt-8 md:mt-4">
                  <h3 className="text-lg font-semibold tracking-tight text-[var(--text-primary)]">Consultar cuenta</h3>
                  <p className="mt-1 text-sm text-[var(--text-secondary)]">Revisa saldos y movimientos.</p>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
