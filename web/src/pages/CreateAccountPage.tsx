import { Check, Copy, ExternalLink, WalletCards } from 'lucide-react'
import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { toast } from 'sonner'
import { Button } from '../components/ui/Button'
import { PageHeading } from '../components/ui/PageHeading'
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
    <div className="mx-auto max-w-[76rem] px-5 py-12 sm:px-7 sm:py-16 lg:px-8">
      <PageHeading
        eyebrow="Cuentas"
        title="Abrir una cuenta"
        description="Vincula un cliente y define el saldo con el que iniciará."
        align="center"
      />

      <div className="mx-auto mt-10 grid max-w-5xl items-center gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(20rem,0.86fr)] lg:gap-12">
        <section className="rounded-[var(--radius-xl)] bg-white p-6 shadow-[var(--shadow-card)] sm:p-9">
          <CreateAccountForm initialCustomerId={customerId} onCreated={setAccount} />
        </section>

        <aside>
          {account ? (
            <div className="financial-card page-enter rounded-[var(--radius-xl)] p-6 text-white shadow-[var(--shadow-float)] sm:p-8">
              <div className="relative z-10">
                <div className="flex items-center justify-between gap-4">
                  <span className="grid size-11 place-items-center rounded-full bg-white/16 ring-1 ring-white/20">
                    <Check aria-hidden="true" className="size-5" />
                  </span>
                  <span className="text-sm font-semibold tracking-[-0.04em]">LAFISE</span>
                </div>

                <p className="mt-10 text-sm font-medium text-white/75">Cuenta creada</p>
                <p className="mt-6 text-sm text-white/65">Saldo disponible</p>
                <p className="financial-number mt-2 text-[clamp(2rem,5vw,3rem)] font-semibold leading-none">
                  {formatCurrency(account.balance)}
                </p>

                <div className="mt-9 border-t border-white/18 pt-5">
                  <p className="text-xs text-white/60">Número de cuenta</p>
                  <div className="mt-1 flex flex-wrap items-center justify-between gap-2">
                    <p className="font-medium tracking-[0.055em]">{account.accountNumber}</p>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="-mr-3 text-white/85 hover:bg-white/12 hover:text-white"
                      onClick={copyAccountNumber}
                    >
                      <Copy aria-hidden="true" className="size-4" />
                      Copiar
                    </Button>
                  </div>
                </div>

                <Link
                  to={`/cuentas/${account.accountNumber}`}
                  className="mt-6 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-white px-5 text-sm font-semibold text-[var(--brand-primary-dark)] transition hover:bg-[var(--brand-mint)]"
                >
                  Ver cuenta
                  <ExternalLink aria-hidden="true" className="size-4" />
                </Link>
              </div>
            </div>
          ) : (
            <div className="rounded-[var(--radius-xl)] bg-[linear-gradient(145deg,var(--brand-mint),var(--cyan-soft))] p-8 text-center sm:p-10">
              <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-white text-[var(--brand-primary)] shadow-[var(--shadow-sm)]">
                <WalletCards aria-hidden="true" className="size-7" />
              </span>
              <h2 className="mt-6 text-xl font-semibold tracking-[-0.035em] text-[var(--text-primary)]">
                Tu cuenta aparecerá aquí
              </h2>
              <p className="mt-3 text-sm leading-6 text-[var(--text-secondary)]">
                Cuando esté lista, podrás ver su saldo y número de cuenta.
              </p>
            </div>
          )}
        </aside>
      </div>
    </div>
  )
}
