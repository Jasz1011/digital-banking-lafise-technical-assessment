import { ArrowDownToLine, ArrowLeft, ArrowUpFromLine, RefreshCw } from 'lucide-react'
import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { parseApiError } from '../api/errors'
import { Button } from '../components/ui/Button'
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
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <Link
            to="/cuentas/buscar"
            className="inline-flex items-center gap-2 text-xs font-medium text-[var(--text-tertiary)] transition hover:text-[var(--brand-primary-dark)]"
          >
            <ArrowLeft aria-hidden="true" className="size-4" />
            Consultar otra cuenta
          </Link>
          <p className="mt-5 text-sm font-medium text-[var(--brand-primary)]">Cuenta de ahorro</p>
          <h1 className="mt-1 text-xl font-semibold tracking-[0.025em] text-[var(--text-primary)] sm:text-2xl">
            {balanceQuery.data.accountNumber}
          </h1>
        </div>
        <Button
          variant="ghost"
          size="sm"
          isLoading={balanceQuery.isFetching}
          onClick={() => balanceQuery.refetch()}
        >
          <RefreshCw aria-hidden="true" className="size-4" />
          Actualizar
        </Button>
      </div>

      <div className="mt-7">
        <BalanceCard accountNumber={balanceQuery.data.accountNumber} balance={balanceQuery.data.balance} />
      </div>

      <section aria-labelledby="account-actions-title" className="py-9 text-center">
        <h2 id="account-actions-title" className="sr-only">Acciones de cuenta</h2>
        <div className="flex justify-center gap-10 sm:gap-16">
          <button
            type="button"
            className="group grid justify-items-center gap-3 text-sm font-medium text-[var(--text-primary)]"
            onClick={() => setMovement('deposit')}
          >
            <span className="grid size-16 place-items-center rounded-full bg-[var(--brand-mint)] text-[var(--brand-primary-dark)] shadow-[var(--shadow-sm)] transition group-hover:-translate-y-1 group-hover:shadow-[var(--shadow-card)]">
              <ArrowDownToLine aria-hidden="true" className="size-6" />
            </span>
            Depositar
          </button>
          <button
            type="button"
            className="group grid justify-items-center gap-3 text-sm font-medium text-[var(--text-primary)]"
            onClick={() => setMovement('withdrawal')}
          >
            <span className="grid size-16 place-items-center rounded-full bg-[var(--cyan-soft)] text-[var(--brand-blue)] shadow-[var(--shadow-sm)] transition group-hover:-translate-y-1 group-hover:shadow-[var(--shadow-card)]">
              <ArrowUpFromLine aria-hidden="true" className="size-6" />
            </span>
            Retirar
          </button>
        </div>
      </section>

      <section aria-labelledby="transactions-title" className="rounded-[var(--radius-xl)] bg-white px-5 py-6 shadow-[var(--shadow-card)] sm:px-8 sm:py-8">
        <div className="mb-3 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-[var(--brand-primary)]">Actividad</p>
            <h2 id="transactions-title" className="mt-1 text-2xl font-semibold tracking-[-0.04em] text-[var(--text-primary)]">
              Movimientos recientes
            </h2>
          </div>
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
