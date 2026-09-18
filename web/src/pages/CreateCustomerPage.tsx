import { Check, Copy, CircleUserRound } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'sonner'
import { CreateCustomerForm } from '../features/customers/CreateCustomerForm'
import type { Customer } from '../types/banking'

export function CreateCustomerPage() {
  const [customer, setCustomer] = useState<Customer | null>(null)

  const copyId = async () => {
    if (!customer) return
    await navigator.clipboard.writeText(customer.id)
    toast.success('Identificador copiado')
  }

  return (
    <div className="mx-auto flex min-h-[calc(100vh-4.5rem)] flex-col bg-white lg:flex-row">
      <div className="flex flex-1 flex-col justify-center px-5 py-12 sm:px-7 lg:px-16 xl:px-24">
        {!customer ? (
          <div className="mx-auto w-full max-w-md page-enter">
            <p className="text-xs font-bold tracking-widest text-[var(--text-placeholder)] uppercase">Paso 1 de 2</p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-[var(--text-primary)] sm:text-4xl">
              Datos del cliente
            </h1>
            <p className="mt-3 text-[0.95rem] text-[var(--text-secondary)]">
              Ingresa la información personal para comenzar.
            </p>
            <div className="mt-10">
              <CreateCustomerForm onCreated={setCustomer} />
            </div>
          </div>
        ) : (
          <div className="mx-auto w-full max-w-md page-enter text-center">
            <span className="mx-auto grid size-20 place-items-center rounded-full bg-[var(--success-soft)] text-[var(--success)] shadow-sm">
              <Check aria-hidden="true" className="size-10" />
            </span>
            <h1 className="mt-6 text-3xl font-bold tracking-tight text-[var(--text-primary)]">
              ¡Cliente creado!
            </h1>
            <p className="mt-3 text-[0.95rem] text-[var(--text-secondary)]">
              Ya puedes abrirle una cuenta a <strong className="font-semibold text-[var(--text-primary)]">{customer.fullName}</strong>.
            </p>

            <div className="mx-auto mt-10 w-full max-w-xs rounded-2xl bg-[var(--surface-soft)] p-5 ring-1 ring-[var(--border-subtle)]">
              <p className="text-xs font-medium text-[var(--text-tertiary)]">Identificador</p>
              <p className="mt-1 break-all font-mono text-[0.8rem] font-semibold text-[var(--text-primary)]">
                {customer.id}
              </p>
              <button
                onClick={copyId}
                className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--brand-primary)] hover:text-[var(--brand-primary-dark)]"
              >
                <Copy aria-hidden="true" className="size-3.5" />
                Copiar
              </button>
            </div>

            <Link
              to={`/cuentas/nueva?customerId=${encodeURIComponent(customer.id)}`}
              className="mx-auto mt-8 inline-flex h-14 w-full max-w-xs items-center justify-center gap-2 rounded-full bg-[var(--brand-primary)] px-8 text-sm font-semibold text-white shadow-lg shadow-[var(--brand-primary)]/20 transition-all hover:-translate-y-0.5 hover:bg-[var(--brand-primary-dark)] hover:shadow-[var(--brand-primary)]/30 active:translate-y-0"
            >
              Abrir cuenta
            </Link>
          </div>
        )}
      </div>
      <div className="hidden flex-1 items-center justify-center bg-[var(--surface-soft)] lg:flex relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--brand-mint)]/60 via-[var(--surface-soft)] to-[var(--cyan-soft)]/60"></div>
        
        {/* Animated background rings */}
        <div className="absolute top-1/2 left-1/2 z-0 h-[40rem] w-[40rem] -translate-x-1/2 -translate-y-1/2 rounded-full border-[1px] border-[var(--brand-primary)]/10"></div>
        <div className="absolute top-1/2 left-1/2 z-0 h-[30rem] w-[30rem] -translate-x-1/2 -translate-y-1/2 rounded-full border-[1px] border-[var(--brand-primary)]/10"></div>
        <div className="absolute top-1/4 -right-20 z-0 h-96 w-96 rounded-full bg-[var(--brand-primary)]/15 blur-3xl"></div>
        <div className="absolute bottom-1/4 -left-20 z-0 h-64 w-64 rounded-full bg-[var(--brand-cyan)]/15 blur-3xl"></div>

        {/* Floating Digital Passport / ID Card Mockup */}
        <div className="relative z-10 w-full max-w-[22rem] -rotate-6 transition-transform duration-700 hover:-rotate-3 hover:scale-105">
          <div className="relative overflow-hidden rounded-[2rem] border border-white/40 bg-white/40 p-8 shadow-[0_20px_40px_rgba(0,157,78,0.08)] backdrop-blur-2xl">
            {/* Card Header */}
            <div className="flex items-center justify-between border-b border-white/50 pb-5">
              <div className="flex items-center gap-3">
                <div className="grid size-10 place-items-center rounded-xl bg-gradient-to-br from-[var(--brand-primary)] to-[var(--brand-primary-deep)] text-white shadow-md">
                  <CircleUserRound className="size-5" strokeWidth={2} />
                </div>
                <div>
                  <p className="text-[0.65rem] font-bold tracking-widest text-[var(--brand-primary-dark)] uppercase">Perfil Cliente</p>
                  <p className="text-sm font-semibold text-[var(--text-primary)]">LAFISE Digital</p>
                </div>
              </div>
            </div>

            {/* Skeleton Data */}
            <div className="mt-8 space-y-6">
              <div>
                <p className="text-[0.6rem] font-bold tracking-widest text-[var(--text-placeholder)] uppercase">Identidad</p>
                <div className="mt-2 h-4 w-3/4 rounded-full bg-white/60"></div>
              </div>
              <div className="flex gap-6">
                <div className="flex-1">
                  <p className="text-[0.6rem] font-bold tracking-widest text-[var(--text-placeholder)] uppercase">Nacimiento</p>
                  <div className="mt-2 h-4 w-full rounded-full bg-white/60"></div>
                </div>
                <div className="flex-1">
                  <p className="text-[0.6rem] font-bold tracking-widest text-[var(--text-placeholder)] uppercase">Género</p>
                  <div className="mt-2 h-4 w-2/3 rounded-full bg-white/60"></div>
                </div>
              </div>
            </div>

            {/* Gloss overlay */}
            <div className="absolute -left-[50%] top-0 z-10 h-[200%] w-1/2 -rotate-45 bg-gradient-to-r from-transparent via-white/40 to-transparent"></div>
          </div>

          <div className="absolute -bottom-6 -right-6 z-20 grid size-20 place-items-center rounded-full border border-white/60 bg-white/80 shadow-xl backdrop-blur-md">
             <Check className="size-8 text-[var(--success)]" strokeWidth={2.5} />
          </div>
        </div>
      </div>
    </div>
  )
}
