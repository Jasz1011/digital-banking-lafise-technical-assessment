import { ArrowDownToLine, ArrowLeft, ArrowUpFromLine, RefreshCw } from 'lucide-react'
import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { parseApiError } from '../api/errors'
import { Skeleton } from '../components/ui/Skeleton'
import { StatusPanel } from '../components/ui/StatusPanel'
import { BalanceCard } from '../features/accounts/BalanceCard'
import { useAccountBalance } from '../features/accounts/account-hooks'
import { MovementDialog } from '../features/transactions/MovementDialog'
import { TransactionHistory } from '../features/transactions/TransactionHistory'
import type { MovementKind } from '../features/transactions/transaction-hooks'
import { normalizeAccountNumber } from '../lib/formatters'

export function AccountDetailPage() {
  const { accountNumber: routeAccountNumber = '' } = useParams()
  const accountNumber = normalizeAccountNumber(routeAccountNumber)
  const balanceQuery = useAccountBalance(accountNumber)
  const [movement, setMovement] = useState<MovementKind | null>(null)

  if (balanceQuery.isPending) {
    return (
      <div className="mx-auto grid max-w-4xl gap-7 px-5 py-12 sm:px-7 lg:px-8" aria-label="Cargando detalle de cuenta">
        <Skeleton className="h-8 w-52" />
        <Skeleton className="h-80 w-full rounded-[var(--radius-xl)]" />
        <div className="flex justify-center gap-8">
          <Skeleton className="size-20 rounded-full" />
          <Skeleton className="size-20 rounded-full" />
        </div>
      </div>
    )
  }

  if (balanceQuery.isError) {
    const error = parseApiError(balanceQuery.error)
    return (
      <div className="mx-auto grid min-h-[65vh] max-w-3xl place-content-center gap-6 px-5 py-12 sm:px-7">
        <Link
          to="/cuentas/buscar"
          className="inline-flex w-fit items-center gap-2 text-sm font-semibold text-[var(--brand-primary-dark)] hover:underline"
        >
          <ArrowLeft aria-hidden="true" className="size-4" />
          Volver a buscar
        </Link>
        <StatusPanel
          tone="error"
          title={error.status === 404 ? 'No encontramos esa cuenta' : error.title}
          description={error.detail}
          actionLabel="Reintentar"
          onAction={() => balanceQuery.refetch()}
        />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-4xl px-5 py-10 sm:px-7 sm:py-14 lg:px-8">
      <div className="flex flex-col items-center gap-1">
        <Link
          to="/cuentas/buscar"
          className="inline-flex items-center gap-2 text-xs font-medium text-[var(--text-tertiary)] transition hover:text-[var(--brand-primary-dark)]"
        >
          <ArrowLeft aria-hidden="true" className="size-4" />
          Volver
        </Link>
        <p className="mt-4 text-sm font-medium text-[var(--text-secondary)]">Cuenta de ahorro</p>
      </div>

      <div className="mt-6 md:mt-8">
        <BalanceCard accountNumber={balanceQuery.data.accountNumber} balance={balanceQuery.data.balance} />
      </div>

      <section aria-labelledby="account-actions-title" className="mt-8 flex justify-center gap-4 sm:gap-6">
        <h2 id="account-actions-title" className="sr-only">Acciones de cuenta</h2>
        <button
          type="button"
          className="flex h-14 min-w-[9rem] items-center justify-center gap-2.5 rounded-full bg-[var(--brand-mint)] px-6 text-sm font-semibold text-[var(--brand-primary-dark)] transition hover:-translate-y-0.5 hover:bg-[#dcf4e6] hover:shadow-[0_8px_20px_rgba(0,157,78,0.12)] active:translate-y-0"
          onClick={() => setMovement('deposit')}
        >
          <ArrowDownToLine aria-hidden="true" className="size-5" />
          Depositar
        </button>
        <button
          type="button"
          className="flex h-14 min-w-[9rem] items-center justify-center gap-2.5 rounded-full bg-[var(--cyan-soft)] px-6 text-sm font-semibold text-[var(--brand-blue)] transition hover:-translate-y-0.5 hover:bg-[#dcf2f8] hover:shadow-[0_8px_20px_rgba(49,196,223,0.15)] active:translate-y-0"
          onClick={() => setMovement('withdrawal')}
        >
          <ArrowUpFromLine aria-hidden="true" className="size-5" />
          Retirar
        </button>
      </section>

      <section aria-labelledby="transactions-title" className="mt-12 rounded-[1.25rem] bg-white px-5 py-6 shadow-sm ring-1 ring-[var(--border-subtle)] sm:px-8 sm:py-8">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <h2 id="transactions-title" className="text-lg font-semibold tracking-[-0.02em] text-[var(--text-primary)]">
              Movimientos recientes
            </h2>
          </div>
          <button
            type="button"
            className="inline-flex size-9 items-center justify-center rounded-full text-[var(--text-tertiary)] transition hover:bg-[var(--surface-muted)] hover:text-[var(--brand-primary-dark)]"
            disabled={balanceQuery.isFetching}
            onClick={() => balanceQuery.refetch()}
            aria-label="Actualizar movimientos"
          >
            <RefreshCw aria-hidden="true" className={`size-4 ${balanceQuery.isFetching ? 'animate-spin' : ''}`} />
          </button>
        </div>
        <TransactionHistory accountNumber={accountNumber} />
      </section>

      <MovementDialog
        accountNumber={accountNumber}
        balance={balanceQuery.data.balance}
        kind="deposit"
        open={movement === 'deposit'}
        onOpenChange={(open) => setMovement(open ? 'deposit' : null)}
      />
      <MovementDialog
        accountNumber={accountNumber}
        balance={balanceQuery.data.balance}
        kind="withdrawal"
        open={movement === 'withdrawal'}
        onOpenChange={(open) => setMovement(open ? 'withdrawal' : null)}
      />
    </div>
  )
}
