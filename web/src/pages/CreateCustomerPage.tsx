import { Check, Copy, WalletCards } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'sonner'
import { Button } from '../components/ui/Button'
import { PageHeading } from '../components/ui/PageHeading'
import { CreateCustomerForm } from '../features/customers/CreateCustomerForm'
import { formatDate } from '../lib/formatters'
import type { Customer } from '../types/banking'

export function CreateCustomerPage() {
  const [customer, setCustomer] = useState<Customer | null>(null)

  const copyId = async () => {
    if (!customer) return
    await navigator.clipboard.writeText(customer.id)
    toast.success('Identificador copiado')
  }

  return (
    <div className="mx-auto max-w-[76rem] px-5 py-12 sm:px-7 sm:py-16 lg:px-8">
      <PageHeading
        eyebrow="Clientes"
        title="Crear un nuevo cliente"
        description="Completa sus datos para continuar con la apertura de una cuenta."
        align="center"
      />

      <div className="mx-auto mt-10 grid max-w-5xl overflow-hidden rounded-[var(--radius-xl)] bg-white shadow-[var(--shadow-card)] lg:grid-cols-[minmax(0,1.18fr)_minmax(18rem,0.72fr)]">
        <section className="p-6 sm:p-9 lg:p-10">
          <CreateCustomerForm onCreated={setCustomer} />
        </section>

        <aside className="flex min-h-72 flex-col justify-center bg-[linear-gradient(145deg,var(--brand-mint),var(--cyan-soft))] p-6 sm:p-9 lg:p-8">
          {customer ? (
            <div className="page-enter">
              <span className="grid size-12 place-items-center rounded-full bg-white text-[var(--success)] shadow-[var(--shadow-sm)]">
                <Check aria-hidden="true" className="size-6" />
              </span>
              <p className="mt-6 text-sm font-semibold text-[var(--success)]">Cliente creado</p>
              <h2 className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-[var(--text-primary)]">
                {customer.fullName}
              </h2>
              <p className="mt-2 text-sm text-[var(--text-secondary)]">
                Registrado el {formatDate(customer.createdAt)}
              </p>

              <div className="mt-6 rounded-2xl bg-white/82 p-4 shadow-[var(--shadow-sm)]">
                <p className="text-xs font-medium text-[var(--text-tertiary)]">
                  Identificador del cliente
                </p>
                <p className="mt-2 break-all font-mono text-xs leading-5 text-[var(--text-primary)]">
                  {customer.id}
                </p>
                <Button variant="ghost" size="sm" className="mt-2 -ml-4" onClick={copyId}>
                  <Copy aria-hidden="true" className="size-4" />
                  Copiar
                </Button>
              </div>

              <Link
                to={`/cuentas/nueva?customerId=${encodeURIComponent(customer.id)}`}
                className="mt-5 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-[var(--brand-primary)] px-5 text-sm font-semibold text-white transition hover:bg-[var(--brand-primary-dark)]"
              >
                <WalletCards aria-hidden="true" className="size-4" />
                Abrir cuenta
              </Link>
            </div>
          ) : (
            <div>
              <span className="grid size-12 place-items-center rounded-2xl bg-white text-[var(--brand-primary)] shadow-[var(--shadow-sm)]">
                <WalletCards aria-hidden="true" className="size-6" />
              </span>
              <h2 className="mt-6 text-xl font-semibold tracking-[-0.035em] text-[var(--text-primary)]">
                Tu siguiente paso
              </h2>
              <p className="mt-3 text-sm leading-6 text-[var(--text-secondary)]">
                Al terminar podrás copiar el identificador y abrir una cuenta para este cliente.
              </p>
            </div>
          )}
        </aside>
      </div>
    </div>
  )
}
