import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowRight, Search } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { parseApiError } from '../../api/errors'
import { Button } from '../../components/ui/Button'
import { normalizeAccountNumber } from '../../lib/formatters'
import { accountSearchSchema, type AccountSearchFormValues } from './account-schema'
import { useLookupAccount } from './account-hooks'

interface AccountSearchProps {
  autoFocus?: boolean
}

export function AccountSearch({ autoFocus = false }: AccountSearchProps) {
  const navigate = useNavigate()
  const lookup = useLookupAccount()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AccountSearchFormValues>({
    resolver: zodResolver(accountSearchSchema),
    defaultValues: { accountNumber: '' },
  })

  const apiError = lookup.error ? parseApiError(lookup.error) : null

  const submit = handleSubmit(({ accountNumber }) => {
    const normalized = normalizeAccountNumber(accountNumber)
    lookup.mutate(normalized, {
      onSuccess: () => navigate(`/cuentas/${normalized}`),
    })
  })

  return (
    <form onSubmit={submit} className="grid gap-3" noValidate>
      <label htmlFor="account-search" className="text-sm font-medium text-[var(--text-primary)]">
        Número de cuenta
      </label>
      <div className="relative flex flex-col gap-3 sm:flex-row">
        <Search
          aria-hidden="true"
          className="pointer-events-none absolute top-4 left-4 size-5 text-[var(--text-tertiary)]"
        />
        <input
          id="account-search"
          autoFocus={autoFocus}
          autoComplete="off"
          spellCheck="false"
          placeholder="ACC-YYYYMMDD-XXXX"
          aria-invalid={Boolean(errors.accountNumber)}
          aria-describedby={errors.accountNumber ? 'account-search-error' : 'account-search-hint'}
          className="min-h-13 min-w-0 flex-1 rounded-2xl border border-[var(--border)] bg-white pr-4 pl-12 font-medium tracking-[0.035em] text-[var(--text-primary)] uppercase transition placeholder:font-normal placeholder:tracking-normal placeholder:text-[var(--text-placeholder)] hover:border-[var(--border-strong)] focus:border-[var(--brand-secondary)] focus:ring-4 focus:ring-[var(--focus-ring)] focus:outline-none"
          {...register('accountNumber')}
        />
        <Button type="submit" size="lg" isLoading={lookup.isPending} className="shrink-0 sm:min-w-36">
          {lookup.isPending ? 'Buscando' : 'Ver cuenta'}
          {!lookup.isPending && <ArrowRight aria-hidden="true" className="size-4" />}
        </Button>
      </div>
      {errors.accountNumber ? (
        <p id="account-search-error" className="text-xs text-[var(--danger)]">
          {errors.accountNumber.message}
        </p>
      ) : (
        <p id="account-search-hint" className="text-xs text-[var(--text-tertiary)]">
          Ejemplo: ACC-YYYYMMDD-XXXX
        </p>
      )}
      {apiError && (
        <div role="alert" className="rounded-2xl bg-[var(--danger-soft)] px-4 py-3 text-sm text-[var(--danger)]">
          <strong className="font-semibold">{apiError.title}.</strong> {apiError.detail}
        </div>
      )}
    </form>
  )
}
