import { z } from 'zod'

const guidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
const accountNumberPattern = /^ACC-\d{8}-\d{4}$/

export const createAccountSchema = z.object({
  customerId: z
    .string()
    .trim()
    .min(1, 'Ingresa el identificador del cliente.')
    .regex(guidPattern, 'Ingresa un identificador de cliente válido.'),
  initialBalance: z
    .string()
    .min(1, 'Ingresa el saldo inicial.')
    .refine((value) => Number.isFinite(Number(value)), 'Ingresa un monto válido.')
    .refine((value) => Number(value) >= 0, 'El saldo inicial no puede ser negativo.'),
})

export const accountSearchSchema = z.object({
  accountNumber: z
    .string()
    .trim()
    .toUpperCase()
    .regex(accountNumberPattern, 'Usa el formato ACC-YYYYMMDD-XXXX.'),
})

export type CreateAccountFormValues = z.infer<typeof createAccountSchema>
export type AccountSearchFormValues = z.infer<typeof accountSearchSchema>
