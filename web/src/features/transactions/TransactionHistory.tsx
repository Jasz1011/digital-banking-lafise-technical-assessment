import { ArrowDownLeft, ArrowUpRight, Copy, History } from 'lucide-react'
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
    <div className="flex flex-col gap-1">
      {query.data.map((transaction, index) => {
        const isDeposit = transaction.type === 'Deposit'
        const Icon = isDeposit ? ArrowDownLeft : ArrowUpRight

        return (
          <div
            key={transaction.transactionId}
            className="group flex flex-col gap-3 rounded-2xl p-4 transition-colors hover:bg-[var(--surface-soft)] sm:flex-row sm:items-center sm:px-5"
            style={{ animation: `page-enter 400ms ease-out ${index * 60}ms both` }}
          >
            <div className="flex min-w-0 flex-1 items-center gap-4">
              <span
                className={`grid size-10 shrink-0 place-items-center rounded-full transition-colors ${
                  isDeposit
                    ? 'bg-[#e9fbf2] text-[var(--success)] group-hover:bg-[#d5f5e3]'
                    : 'bg-[#eaf5fc] text-[var(--brand-blue)] group-hover:bg-[#dceef9]'
                }`}
              >
                <Icon aria-hidden="true" className="size-4" strokeWidth={2.5} />
              </span>
              <div className="min-w-0">
                <p className="text-[0.95rem] font-semibold tracking-[-0.01em] text-[var(--text-primary)]">
                  {isDeposit ? 'Depósito a cuenta' : 'Retiro de efectivo'}
                </p>
                <div className="mt-0.5 flex flex-wrap items-center gap-2 text-xs text-[var(--text-tertiary)]">
                  <span>{formatDateTime(transaction.timestamp)}</span>
                  <span className="hidden size-1 rounded-full bg-[var(--border)] sm:block"></span>
                  <button
                    type="button"
                    title="Copiar referencia"
                    onClick={() => navigator.clipboard.writeText(transaction.transactionId)}
                    className="inline-flex items-center gap-1 font-mono tracking-tight text-[var(--text-placeholder)] transition-colors hover:text-[var(--text-primary)]"
                  >
                    Ref. {transaction.transactionId.substring(0, 8)}...{transaction.transactionId.substring(transaction.transactionId.length - 4)}
                    <Copy aria-hidden="true" className="size-3" />
                  </button>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between pl-14 sm:flex-col sm:items-end sm:justify-center sm:pl-0">
              <p
                className={`financial-number font-semibold tracking-tight ${
                  isDeposit ? 'text-[var(--success)]' : 'text-[var(--text-primary)]'
                }`}
              >
                <span className="sr-only">{isDeposit ? 'Entrada' : 'Salida'}:</span>
                {isDeposit ? '+' : '−'} {formatCurrency(transaction.amount)}
              </p>
              <p className="mt-0.5 text-[0.7rem] text-[var(--text-placeholder)]">
                {formatCurrency(transaction.balanceAfterTransaction)}
              </p>
            </div>
          </div>
        )
      })}
    </div>
  )
}
