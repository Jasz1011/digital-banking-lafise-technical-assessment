import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowRight } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { parseApiError } from '../../api/errors'
import { Button } from '../../components/ui/Button'
import { InputField, SelectField } from '../../components/ui/FormField'
import { getNicaraguaToday } from '../../lib/formatters'
import type { Customer } from '../../types/banking'
import { customerSchema, type CustomerFormValues } from './customer-schema'
import { useCreateCustomer } from './customer-hooks'

interface CreateCustomerFormProps {
  onCreated: (customer: Customer) => void
}

export function CreateCustomerForm({ onCreated }: CreateCustomerFormProps) {
  const mutation = useCreateCustomer()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CustomerFormValues>({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      fullName: '',
      birthDate: '',
      gender: '',
      monthlyIncome: '',
    },
  })

  const apiError = mutation.error ? parseApiError(mutation.error) : null

  const submit = handleSubmit((values) => {
    mutation.mutate(
      {
        fullName: values.fullName.trim(),
        birthDate: values.birthDate,
        gender: values.gender,
        monthlyIncome: Number(values.monthlyIncome),
      },
      { onSuccess: onCreated },
    )
  })

  return (
    <form onSubmit={submit} className="grid gap-6" noValidate>
      <div className="grid gap-5 md:grid-cols-2">
        <div className="md:col-span-2">
          <InputField
            id="fullName"
            label="Nombre completo"
            placeholder="Ej. María Elena Ruiz"
            autoComplete="name"
            maxLength={200}
            error={errors.fullName?.message}
            {...register('fullName')}
          />
        </div>
        <InputField
          id="birthDate"
          label="Fecha de nacimiento"
          type="date"
          max={getNicaraguaToday()}
          error={errors.birthDate?.message}
          {...register('birthDate')}
        />
        <SelectField
          id="gender"
          label="Género"
          error={errors.gender?.message}
          {...register('gender')}
        >
          <option value="">Selecciona una opción</option>
          <option value="Femenino">Femenino</option>
          <option value="Masculino">Masculino</option>
          <option value="No especificado">Prefiero no especificar</option>
        </SelectField>
        <div className="md:col-span-2">
          <InputField
            id="monthlyIncome"
            label="Ingreso mensual"
            type="number"
            min="0"
            step="0.01"
            inputMode="decimal"
            placeholder="0.00"
            hint="Ingresa el monto mensual en córdobas."
            error={errors.monthlyIncome?.message}
            {...register('monthlyIncome')}
          />
        </div>
      </div>

      {apiError && (
        <div role="alert" className="rounded-xl bg-[var(--danger-soft)] px-4 py-3 text-sm text-[var(--danger)]">
          <strong className="block font-semibold">{apiError.title}</strong>
          <span className="mt-1 block leading-5">{apiError.detail}</span>
          {apiError.validationErrors.length > 1 && (
            <ul className="mt-2 list-disc pl-5">
              {apiError.validationErrors.map((message) => (
                <li key={message}>{message}</li>
              ))}
            </ul>
          )}
        </div>
      )}

      <div className="flex justify-end border-t border-[var(--border-subtle)] pt-6">
        <Button type="submit" size="lg" isLoading={mutation.isPending} className="sm:min-w-48">
          {mutation.isPending ? 'Creando cliente' : 'Crear cliente'}
          {!mutation.isPending && <ArrowRight aria-hidden="true" className="size-4" />}
        </Button>
      </div>
    </form>
  )
}
