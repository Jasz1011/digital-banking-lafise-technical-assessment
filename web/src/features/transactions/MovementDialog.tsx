import { zodResolver } from '@hookform/resolvers/zod'
import * as Dialog from '@radix-ui/react-dialog'
import { ArrowDownToLine, ArrowUpFromLine, X } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { parseApiError } from '../../api/errors'
import { Button } from '../../components/ui/Button'
import { formatCurrency } from '../../lib/formatters'
import { movementSchema, type MovementFormValues } from './transaction-schema'
import { useMovement, type MovementKind } from './transaction-hooks'

interface MovementDialogProps {
  accountNumber: string
  balance: number
  kind: MovementKind
  open: boolean
  onOpenChange: (open: boolean) => void
}

const copy = {
  deposit: {
    title: 'Depositar',
    description: 'Agrega dinero a tu cuenta.',
    action: 'Confirmar depósito',
    pending: 'Depositando',
    success: 'Depósito realizado',
    icon: ArrowDownToLine,
  },
  withdrawal: {
    title: 'Retirar',
    description: 'Indica cuánto deseas retirar.',
    action: 'Confirmar retiro',
    pending: 'Retirando',
    success: 'Retiro realizado',
    icon: ArrowUpFromLine,
  },
} satisfies Record<MovementKind, object>

export function MovementDialog({
  accountNumber,
  balance,
  kind,
  open,
  onOpenChange,
}: MovementDialogProps) {
  const mutation = useMovement(accountNumber, kind)
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<MovementFormValues>({
    resolver: zodResolver(movementSchema),
    defaultValues: { amount: '' },
  })
  const content = copy[kind]
  const Icon = content.icon
  const apiError = mutation.error ? parseApiError(mutation.error) : null

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      reset()
      mutation.reset()
    }
    onOpenChange(nextOpen)
  }

  const submit = handleSubmit(({ amount }) => {
    mutation.mutate(Number(amount), {
      onSuccess: () => {
        toast.success(content.success, {
          description: 'Tu saldo y movimientos están al día.',
        })
        handleOpenChange(false)
      },
    })
  })

  return (
    <Dialog.Root open={open} onOpenChange={handleOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-[#0b352a]/38 backdrop-blur-[3px] data-[state=open]:animate-[page-enter_180ms_ease-out]" />
        <Dialog.Content className="movement-dialog p-6 focus:outline-none sm:p-8">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <span
                className={`grid size-11 shrink-0 place-items-center rounded-full ${
                  kind === 'deposit'
                    ? 'bg-[var(--brand-mint)] text-[var(--brand-primary-dark)]'
                    : 'bg-[var(--cyan-soft)] text-[var(--brand-blue)]'
                }`}
              >
                <Icon aria-hidden="true" className="size-5" />
              </span>
              <div>
                <Dialog.Title className="text-xl font-semibold tracking-[-0.035em] text-[var(--text-primary)]">
                  {content.title}
                </Dialog.Title>
                <Dialog.Description className="mt-1 text-sm text-[var(--text-secondary)]">
                  {content.description}
                </Dialog.Description>
              </div>
            </div>
            <Dialog.Close asChild>
              <button
                type="button"
                className="grid size-10 shrink-0 place-items-center rounded-full text-[var(--text-tertiary)] transition hover:bg-[var(--surface-muted)] hover:text-[var(--text-primary)]"
                aria-label="Cerrar"
              >
                <X aria-hidden="true" className="size-5" />
              </button>
            </Dialog.Close>
          </div>

          <div className="mt-6 grid grid-cols-[1fr_auto] gap-x-4 gap-y-1 rounded-2xl bg-[var(--surface-muted)] px-4 py-3 text-sm">
            <span className="text-[var(--text-secondary)]">Cuenta</span>
            <strong className="font-medium text-[var(--text-primary)]">•••• {accountNumber.slice(-4)}</strong>
            <span className="text-[var(--text-secondary)]">Saldo disponible</span>
            <strong className="financial-number font-semibold text-[var(--text-primary)]">
              {formatCurrency(balance)}
            </strong>
          </div>

          <form onSubmit={submit} className="mt-6 grid gap-5" noValidate>
            <div className="grid gap-2.5">
              <label htmlFor={`${kind}-amount`} className="text-sm font-medium text-[var(--text-primary)]">
                Monto
              </label>
              <div className="relative">
                <span className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-base font-semibold text-[var(--brand-primary-dark)]">
                  C$
                </span>
                <input
                  id={`${kind}-amount`}
                  type="number"
                  min="0.01"
                  step="0.01"
                  inputMode="decimal"
                  placeholder="0.00"
                  autoFocus
                  aria-invalid={Boolean(errors.amount)}
                  aria-describedby={errors.amount ? `${kind}-amount-error` : undefined}
                  className="financial-number min-h-15 w-full rounded-2xl border border-[var(--border)] bg-white pr-4 pl-12 text-xl font-semibold text-[var(--text-primary)] transition placeholder:text-[var(--text-placeholder)] hover:border-[var(--border-strong)] focus:border-[var(--brand-secondary)] focus:ring-4 focus:ring-[var(--focus-ring)] focus:outline-none"
                  {...register('amount')}
                />
              </div>
              {errors.amount && (
                <p id={`${kind}-amount-error`} className="text-xs text-[var(--danger)]">
                  {errors.amount.message}
                </p>
              )}
            </div>

            {apiError && apiError.status === 400 ? (
              <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-soft)] p-6 text-center shadow-sm">
                <span className="mx-auto grid size-12 place-items-center rounded-full bg-white text-[var(--danger)] shadow-sm">
                  <span className="flex size-6 items-center justify-center rounded-full border-2 border-current font-bold">!</span>
                </span>
                <strong className="mt-4 block text-[1.05rem] font-semibold tracking-tight text-[var(--text-primary)]">
                  No tienes fondos suficientes
                </strong>
                <p className="mt-1.5 text-sm leading-relaxed text-[var(--text-secondary)]">
                  Revisa el monto e inténtalo nuevamente.<br />
                  Saldo actual: <strong className="font-semibold">{formatCurrency(balance)}</strong>
                </p>
                <div className="mt-5">
                  <Button variant="secondary" onClick={() => mutation.reset()} className="w-full">
                    Modificar monto
                  </Button>
                </div>
              </div>
            ) : apiError ? (
              <div role="alert" className="rounded-2xl bg-[var(--danger-soft)] px-4 py-3 text-sm text-[var(--danger)]">
                <strong className="block font-semibold">{apiError.title}</strong>
                <span className="mt-1 block leading-5">{apiError.detail}</span>
              </div>
            ) : null}

            {(!apiError || apiError.status !== 400) && (
              <div className="flex flex-col-reverse gap-3 border-t border-[var(--border-subtle)] pt-5 sm:flex-row sm:justify-end">
                <Dialog.Close asChild>
                  <Button variant="ghost">Cancelar</Button>
                </Dialog.Close>
                <Button
                  type="submit"
                  variant="primary"
                  isLoading={mutation.isPending}
                >
                  {mutation.isPending ? content.pending : content.action}
                </Button>
              </div>
            )}
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
