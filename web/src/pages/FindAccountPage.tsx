import { Search } from 'lucide-react'
import { PageHeading } from '../components/ui/PageHeading'
import { AccountSearch } from '../features/accounts/AccountSearch'

export function FindAccountPage() {
  return (
    <div className="mx-auto min-h-[calc(100vh-9rem)] max-w-[76rem] px-5 py-14 sm:px-7 sm:py-20 lg:px-8">
      <PageHeading
        eyebrow="Tu cuenta"
        title="Consulta tu cuenta"
        description="Ingresa el número de cuenta para revisar tu saldo y tus movimientos."
        align="center"
      />

      <section className="mx-auto mt-10 max-w-2xl rounded-[var(--radius-xl)] bg-white p-6 shadow-[var(--shadow-card)] sm:p-10">
        <span className="mx-auto mb-7 grid size-13 place-items-center rounded-full bg-[var(--cyan-soft)] text-[var(--brand-blue)]">
          <Search aria-hidden="true" className="size-6" />
        </span>
        <AccountSearch autoFocus />
      </section>
    </div>
  )
}
