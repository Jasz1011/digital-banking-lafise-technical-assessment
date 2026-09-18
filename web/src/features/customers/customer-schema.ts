import { z } from 'zod'
import { getNicaraguaToday } from '../../lib/formatters'

const today = getNicaraguaToday()

export const customerSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(1, 'Ingresa el nombre completo.')
    .max(200, 'El nombre no puede exceder 200 caracteres.'),
  birthDate: z
    .string()
    .min(1, 'Selecciona la fecha de nacimiento.')
    .refine((value) => value <= today, 'La fecha de nacimiento no puede ser futura.'),
  gender: z
    .string()
    .trim()
    .min(1, 'Selecciona una opción.')
    .max(50, 'El valor no puede exceder 50 caracteres.'),
  monthlyIncome: z
    .string()
    .min(1, 'Ingresa el ingreso mensual.')
    .refine((value) => Number.isFinite(Number(value)), 'Ingresa un monto válido.')
    .refine((value) => Number(value) >= 0, 'El ingreso no puede ser negativo.'),
})

export type CustomerFormValues = z.infer<typeof customerSchema>
