import { z } from 'zod'

export const movementSchema = z.object({
  amount: z
    .string()
    .min(1, 'Ingresa el monto.')
    .refine((value) => Number.isFinite(Number(value)), 'Ingresa un monto válido.')
    .refine((value) => Number(value) > 0, 'El monto debe ser mayor que cero.'),
})

export type MovementFormValues = z.infer<typeof movementSchema>
