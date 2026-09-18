import { PageHeading } from '../components/ui/PageHeading'
import { AccountSearch } from '../features/accounts/AccountSearch'

export function FindAccountPage() {
  return (
    <div className="relative mx-auto min-h-[calc(100vh-4.5rem)] w-full overflow-hidden">
      {/* Decorative background grid/gradients */}
      <div className="absolute inset-0 z-0 pointer-events-none flex justify-center">
        <div className="absolute top-0 w-full max-w-7xl h-[40rem] opacity-30">
          <div className="absolute left-1/2 top-0 h-[40rem] w-[40rem] -translate-x-1/2 rounded-full bg-[var(--brand-mint)] blur-[100px]"></div>
          <div className="absolute left-1/4 top-10 h-[30rem] w-[30rem] -translate-x-1/2 rounded-full bg-[var(--cyan-soft)] blur-[120px]"></div>
          <div className="absolute right-1/4 top-20 h-[30rem] w-[30rem] translate-x-1/2 rounded-full bg-[var(--brand-cyan)]/20 blur-[120px]"></div>
        </div>
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjEiIGZpbGw9InJnYmEoMCwxNTcsNzgsMC4wOCkiLz48L3N2Zz4=')] opacity-50 [mask-image:linear-gradient(to_bottom,white,transparent)]"></div>
      </div>

      <div className="relative z-10 mx-auto max-w-4xl px-5 py-20 sm:px-7 sm:py-32 lg:px-8">
        <PageHeading
          eyebrow="Búsqueda global"
          title="Encuentra tu cuenta"
          description="Escribe tu número de cuenta virtual para acceder a tu historial financiero."
          align="center"
        />

        <section className="mx-auto mt-14">
          <AccountSearch autoFocus />
        </section>
      </div>
    </div>
  )
}
