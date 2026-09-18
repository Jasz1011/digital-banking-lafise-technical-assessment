import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowRight } from 'lucide-react'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { parseApiError } from '../../api/errors'
import { Button } from '../../components/ui/Button'
import { InputField } from '../../components/ui/FormField'
import type { BankAccount } from '../../types/banking'
import { createAccountSchema, type CreateAccountFormValues } from './account-schema'
import { useCreateAccount } from './account-hooks'

interface CreateAccountFormProps {
  initialCustomerId?: string
  onCreated: (account: BankAccount) => void
}

export function CreateAccountForm({ initialCustomerId = '', onCreated }: CreateAccountFormProps) {
  const mutation = useCreateAccount()
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<CreateAccountFormValues>({
    resolver: zodResolver(createAccountSchema),
    defaultValues: {
      customerId: initialCustomerId,
      initialBalance: '0',
    },
  })

  useEffect(() => {
    if (initialCustomerId) {
      setValue('customerId', initialCustomerId)
    }
  }, [initialCustomerId, setValue])

  const apiError = mutation.error ? parseApiError(mutation.error) : null

  const submit = handleSubmit((values) => {
    mutation.mutate(
      {
        customerId: values.customerId.trim(),
        initialBalance: Number(values.initialBalance),
      },
      { onSuccess: onCreated },
    )
  })

  return (
    <form onSubmit={submit} className="grid gap-6" noValidate>
      <InputField
        id="customerId"
        label="Identificador del cliente"
        placeholder="00000000-0000-0000-0000-000000000000"
        autoComplete="off"
        hint="Lo encontrarás al finalizar el registro del cliente."
        error={errors.customerId?.message}
        {...register('customerId')}
      />
      <InputField
        id="initialBalance"
        label="Saldo inicial"
        type="number"
        min="0"
        step="0.01"
        inputMode="decimal"
        placeholder="0.00"
        hint="Puedes abrir la cuenta con saldo cero."
        error={errors.initialBalance?.message}
        {...register('initialBalance')}
      />

      {apiError && (
        <div role="alert" className="rounded-xl bg-[var(--danger-soft)] px-4 py-3 text-sm text-[var(--danger)]">
          <strong className="block font-semibold">{apiError.title}</strong>
          <span className="mt-1 block leading-5">{apiError.detail}</span>
        </div>
      )}

      <div className="flex justify-end border-t border-[var(--border-subtle)] pt-6">
        <Button type="submit" size="lg" isLoading={mutation.isPending} className="sm:min-w-48">
          {mutation.isPending ? 'Creando cuenta' : 'Crear cuenta'}
          {!mutation.isPending && <ArrowRight aria-hidden="true" className="size-4" />}
        </Button>
      </div>
    </form>
  )
}
