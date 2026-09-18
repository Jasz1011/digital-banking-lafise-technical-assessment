import { ArrowDownLeft, ArrowUpRight, History } from 'lucide-react'
import { parseApiError } from '../../api/errors'
import { Skeleton } from '../../components/ui/Skeleton'
import { StatusPanel } from '../../components/ui/StatusPanel'
import { formatCurrency, formatDateTime } from '../../lib/formatters'
import { useTransactions } from './transaction-hooks'

interface TransactionHistoryProps {
  accountNumber: string
}

export function TransactionHistory({ accountNumber }: TransactionHistoryProps) {
  const query = useTransactions(accountNumber)

  if (query.isPending) {
    return (
      <div aria-label="Cargando movimientos" className="divide-y divide-[var(--border-subtle)]">
        {[1, 2, 3].map((item) => (
          <div key={item} className="flex items-center gap-4 py-5">
            <Skeleton className="size-11 shrink-0 rounded-full" />
            <div className="grid flex-1 gap-2">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-3 w-40" />
            </div>
            <Skeleton className="h-5 w-24" />
          </div>
        ))}
      </div>
    )
  }

  if (query.isError) {
    const error = parseApiError(query.error)
    return (
      <StatusPanel
        tone="error"
        title={error.title}
        description={error.detail}
        actionLabel="Reintentar"
        onAction={() => query.refetch()}
      />
    )
  }

  if (query.data.length === 0) {
    return (
      <StatusPanel
        icon={History}
        title="Aún no hay movimientos"
        description="Tus depósitos y retiros aparecerán aquí."
      />
    )
  }

  return (
    <ol className="divide-y divide-[var(--border-subtle)]">
      {query.data.map((transaction) => {
        const isDeposit = transaction.type === 'Deposit'
        const Icon = isDeposit ? ArrowDownLeft : ArrowUpRight

        return (
          <li
            key={transaction.transactionId}
            className="flex flex-col gap-4 py-5 transition-colors hover:bg-[var(--surface-soft)] sm:flex-row sm:items-center sm:px-2"
          >
            <div className="flex min-w-0 flex-1 items-center gap-4">
              <span
                className={`grid size-11 shrink-0 place-items-center rounded-full ${
                  isDeposit
                    ? 'bg-[var(--success-soft)] text-[var(--success)]'
                    : 'bg-[var(--cyan-soft)] text-[var(--brand-blue)]'
                }`}
              >
                <Icon aria-hidden="true" className="size-5" />
              </span>
              <div className="min-w-0">
                <p className="font-medium text-[var(--text-primary)]">
                  {isDeposit ? 'Depósito' : 'Retiro'}
                </p>
                <p className="mt-1 text-xs text-[var(--text-tertiary)]">
                  {formatDateTime(transaction.timestamp)}
                </p>
              </div>
            </div>
            <div className="flex items-end justify-between gap-5 pl-[3.75rem] sm:block sm:pl-0 sm:text-right">
              <p
                className={`financial-number font-semibold ${
                  isDeposit ? 'text-[var(--success)]' : 'text-[var(--text-primary)]'
                }`}
              >
                <span className="sr-only">{isDeposit ? 'Entrada' : 'Salida'}:</span>
                {isDeposit ? '+' : '−'}{formatCurrency(transaction.amount)}
              </p>
              <p className="mt-1 text-[0.7rem] text-[var(--text-tertiary)]">
                Saldo: {formatCurrency(transaction.balanceAfterTransaction)}
              </p>
            </div>
          </li>
        )
      })}
    </ol>
  )
}
