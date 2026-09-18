import axios from 'axios'
import type { AppError, ProblemDetails } from '../types/problem-details'

const defaultError: AppError = {
  title: 'No pudimos completar la solicitud',
  detail: 'Verifica tu conexión e intenta nuevamente.',
  validationErrors: [],
}

function isProblemDetails(value: unknown): value is ProblemDetails {
  return typeof value === 'object' && value !== null
}

export function parseApiError(error: unknown): AppError {
  if (!axios.isAxiosError(error)) {
    return defaultError
  }

  if (!error.response) {
    return defaultError
  }

  const data: unknown = error.response.data
  if (!isProblemDetails(data)) {
    return {
      ...defaultError,
      status: error.response.status,
    }
  }

  const validationErrors = data.errors
    ? Object.values(data.errors).flat().filter(Boolean)
    : []

  return {
    status: data.status ?? error.response.status,
    title: data.title || defaultError.title,
    detail: data.detail || validationErrors[0] || defaultError.detail,
    validationErrors,
  }
}
