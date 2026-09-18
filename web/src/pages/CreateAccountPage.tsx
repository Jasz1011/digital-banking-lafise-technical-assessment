import { Check, Copy, ExternalLink, WalletCards } from 'lucide-react'
import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { toast } from 'sonner'
import { CreateAccountForm } from '../features/accounts/CreateAccountForm'
import { formatCurrency } from '../lib/formatters'
import type { BankAccount } from '../types/banking'

export function CreateAccountPage() {
  const [searchParams] = useSearchParams()
  const [account, setAccount] = useState<BankAccount | null>(null)
  const customerId = searchParams.get('customerId') ?? ''

  const copyAccountNumber = async () => {
    if (!account) return
    await navigator.clipboard.writeText(account.accountNumber)
    toast.success('Número de cuenta copiado')
  }

  return (
    <div className="mx-auto flex min-h-[calc(100vh-4.5rem)] flex-col bg-white lg:flex-row">
      <div className="flex flex-1 flex-col justify-center px-5 py-12 sm:px-7 lg:px-16 xl:px-24">
        {!account ? (
          <div className="mx-auto w-full max-w-md page-enter">
            <p className="text-xs font-bold tracking-widest text-[var(--text-placeholder)] uppercase">Paso 2 de 2</p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-[var(--text-primary)] sm:text-4xl">
              Configura tu cuenta
            </h1>
            <p className="mt-3 text-[0.95rem] text-[var(--text-secondary)]">
              Ingresa el identificador del cliente y el saldo inicial de la cuenta.
            </p>
            <div className="mt-10">
              <CreateAccountForm initialCustomerId={customerId} onCreated={setAccount} />
            </div>
          </div>
        ) : (
          <div className="mx-auto w-full max-w-md page-enter text-center">
            <h1 className="text-3xl font-bold tracking-tight text-[var(--text-primary)]">
              ¡Tu cuenta está lista!
            </h1>
            <p className="mt-3 text-[0.95rem] text-[var(--text-secondary)]">
              La cuenta ha sido creada exitosamente y ya puede ser utilizada.
            </p>

            <div className="mt-10 mx-auto w-full max-w-sm text-left">
              <div className="financial-card relative mx-auto w-full max-w-[26rem] overflow-hidden rounded-2xl p-6 text-white shadow-2xl sm:p-7 md:max-w-none md:aspect-[1.8/1] md:rounded-[1.5rem] lg:p-8">
                <div className="relative z-10 flex h-full flex-col justify-between">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="grid size-10 place-items-center rounded-full bg-white/10 backdrop-blur-sm ring-1 ring-white/20">
                        <Check aria-hidden="true" className="size-5 text-white" />
                      </div>
                      <div>
                        <p className="text-xs font-medium text-white/70">Cuenta Activa</p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-lg font-bold tracking-tight text-white drop-shadow-sm">LAFISE</span>
                      <span className="text-[0.65rem] font-medium tracking-[0.1em] text-white/70">DIGITAL</span>
                    </div>
                  </div>

                  <div className="mt-6 md:mt-0">
                    <p className="text-sm font-medium text-white/80">Saldo disponible</p>
                    <p className="financial-number mt-1 text-3xl font-bold leading-none tracking-tight text-white drop-shadow-sm">
                      {formatCurrency(account.balance)}
                    </p>
                  </div>

                  <div className="mt-6 border-t border-white/20 pt-4 flex items-center justify-between">
                    <div>
                      <p className="text-xs text-white/60">Número de cuenta</p>
                      <p className="mt-0.5 text-sm font-semibold tracking-wider text-white/95">
                        {account.accountNumber}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={copyAccountNumber}
                      className="grid size-8 place-items-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
                      aria-label="Copiar número de cuenta"
                    >
                      <Copy aria-hidden="true" className="size-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <Link
              to={`/cuentas/${account.accountNumber}`}
              className="mx-auto mt-10 inline-flex h-14 w-full max-w-sm items-center justify-center gap-2 rounded-full bg-[var(--brand-primary)] px-8 text-sm font-semibold text-white shadow-lg shadow-[var(--brand-primary)]/20 transition-all hover:-translate-y-0.5 hover:bg-[var(--brand-primary-dark)] hover:shadow-[var(--brand-primary)]/30 active:translate-y-0"
            >
              Ir a mi cuenta
              <ExternalLink aria-hidden="true" className="size-4" />
            </Link>
          </div>
        )}
      </div>

      <div className="hidden flex-1 items-center justify-center bg-[var(--surface-soft)] lg:flex relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-tr from-[var(--brand-mint)]/60 via-[var(--surface-soft)] to-[var(--cyan-soft)]/60"></div>
        <div className="absolute top-1/2 left-1/2 z-0 h-[40rem] w-[40rem] -translate-x-1/2 -translate-y-1/2 rounded-full border-[1px] border-[var(--brand-cyan)]/20"></div>
        <div className="absolute top-1/2 left-1/2 z-0 h-[30rem] w-[30rem] -translate-x-1/2 -translate-y-1/2 rounded-full border-[1px] border-[var(--brand-cyan)]/20"></div>
        <div className="absolute -top-20 -right-20 h-[30rem] w-[30rem] rounded-full bg-[var(--brand-cyan)]/15 blur-[80px]"></div>
        <div className="absolute bottom-10 left-10 h-72 w-72 rounded-full bg-[var(--brand-primary)]/15 blur-[60px]"></div>
        
        {/* Empty floating card slot */}
        <div className="relative z-10 w-full max-w-[24rem] rotate-6 transition-transform duration-700 hover:rotate-3 hover:scale-105">
          <div className="aspect-[1.586/1] w-full rounded-3xl border-2 border-dashed border-[var(--brand-primary)]/20 bg-white/20 p-8 backdrop-blur-sm flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <div className="h-10 w-14 rounded-md bg-[var(--brand-primary)]/10"></div>
              <div className="h-4 w-16 rounded-full bg-[var(--brand-primary)]/10"></div>
            </div>
            <div>
              <div className="h-6 w-3/4 rounded-full bg-[var(--brand-primary)]/10"></div>
              <div className="mt-4 flex gap-4">
                 <div className="h-4 w-1/4 rounded-full bg-[var(--brand-primary)]/10"></div>
                 <div className="h-4 w-1/4 rounded-full bg-[var(--brand-primary)]/10"></div>
              </div>
            </div>
          </div>
          
          <div className="absolute -right-8 -top-8 z-20 grid size-20 place-items-center rounded-full border border-white/60 bg-white/80 shadow-xl backdrop-blur-md">
             <WalletCards className="size-8 text-[var(--brand-cyan)]" strokeWidth={2} />
          </div>
        </div>
      </div>
    </div>
  )
}
