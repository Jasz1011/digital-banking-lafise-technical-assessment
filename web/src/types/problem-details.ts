export interface ProblemDetails {
  type?: string
  title?: string
  status?: number
  detail?: string
  instance?: string
  traceId?: string
  errors?: Record<string, string[]>
}

export interface AppError {
  status?: number
  title: string
  detail: string
  validationErrors: string[]
}
