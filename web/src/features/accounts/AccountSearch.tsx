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
    <form onSubmit={submit} className="relative w-full" noValidate>
      <div className="group relative flex flex-col rounded-[2rem] bg-white p-2 shadow-[0_8px_30px_rgb(0,0,0,0.04)] ring-1 ring-[var(--border-subtle)] transition-all hover:shadow-[0_20px_50px_rgb(0,0,0,0.08)] focus-within:shadow-[0_20px_50px_rgba(0,157,78,0.12)] focus-within:ring-[var(--brand-secondary)] sm:flex-row sm:items-center">
        <div className="pointer-events-none absolute left-6 top-1/2 hidden -translate-y-1/2 text-[var(--brand-primary)] sm:block">
          <Search aria-hidden="true" className="size-7 opacity-50 transition-opacity group-focus-within:opacity-100" strokeWidth={2} />
        </div>
        <input
          id="account-search"
          autoFocus={autoFocus}
          autoComplete="off"
          spellCheck="false"
          placeholder="Ej: ACC-YYYYMMDD-XXXX"
          aria-invalid={Boolean(errors.accountNumber)}
          className="h-16 w-full rounded-2xl bg-transparent px-6 text-lg font-medium tracking-[0.04em] text-[var(--text-primary)] uppercase transition placeholder:text-base placeholder:font-normal placeholder:tracking-normal placeholder:text-[var(--text-placeholder)] focus:outline-none sm:h-20 sm:px-16 sm:text-xl"
          {...register('accountNumber')}
        />
        <Button type="submit" size="lg" isLoading={lookup.isPending} className="m-2 shrink-0 rounded-[1rem] sm:m-0 sm:mr-3 sm:min-w-44 sm:min-h-14">
          {lookup.isPending ? 'Buscando...' : 'Consultar cuenta'}
          {!lookup.isPending && <ArrowRight aria-hidden="true" className="size-5" />}
        </Button>
      </div>
      
      <div className="mt-4 flex flex-col px-4 sm:px-6">
        {errors.accountNumber ? (
          <p id="account-search-error" className="flex items-center gap-2 text-sm font-medium text-[var(--danger)]">
             <span className="inline-block size-1.5 rounded-full bg-[var(--danger)]"></span>
            {errors.accountNumber.message}
          </p>
        ) : apiError?.status === 404 ? (
          <div className="mt-2 rounded-2xl bg-[var(--surface-muted)] p-5 text-center ring-1 ring-[var(--border-subtle)]">
            <span className="mx-auto grid size-12 place-items-center rounded-full bg-white text-[var(--text-tertiary)] shadow-sm">
              <Search aria-hidden="true" className="size-5" />
            </span>
            <strong className="mt-3 block text-[0.95rem] font-semibold text-[var(--text-primary)]">
              No encontramos esa cuenta
            </strong>
            <p className="mt-1 text-sm text-[var(--text-secondary)]">
              Verifica el número y sus guiones e inténtalo nuevamente.
            </p>
          </div>
        ) : apiError ? (
          <p role="alert" className="flex items-center gap-2 text-sm font-medium text-[var(--danger)]">
             <span className="inline-block size-1.5 rounded-full bg-[var(--danger)]"></span>
             <strong className="font-semibold">{apiError.title}.</strong> {apiError.detail}
          </p>
        ) : (
          <p id="account-search-hint" className="text-sm font-medium text-[var(--text-tertiary)] opacity-80">
            Ingresa el formato exacto incluyendo los guiones.
          </p>
        )}
      </div>
    </form>
  )
}
