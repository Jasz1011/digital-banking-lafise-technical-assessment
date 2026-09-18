const currencyFormatter = new Intl.NumberFormat('es-NI', {
  style: 'currency',
  currency: 'NIO',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

const dateTimeFormatter = new Intl.DateTimeFormat('es-NI', {
  dateStyle: 'medium',
  timeStyle: 'short',
  timeZone: 'America/Managua',
})

const dateFormatter = new Intl.DateTimeFormat('es-NI', {
  dateStyle: 'long',
  timeZone: 'America/Managua',
})

const nicaraguaDatePartsFormatter = new Intl.DateTimeFormat('en-US', {
  timeZone: 'America/Managua',
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
})

export function formatCurrency(amount: number) {
  return currencyFormatter.format(amount)
}

export function formatDateTime(value: string) {
  return dateTimeFormatter.format(new Date(value))
}

export function formatDate(value: string) {
  return dateFormatter.format(new Date(value))
}

export function getNicaraguaToday() {
  const parts = nicaraguaDatePartsFormatter.formatToParts(new Date())
  const year = parts.find((part) => part.type === 'year')?.value
  const month = parts.find((part) => part.type === 'month')?.value
  const day = parts.find((part) => part.type === 'day')?.value

  if (!year || !month || !day) {
    throw new Error('No se pudo determinar la fecha local de Nicaragua.')
  }

  return `${year}-${month}-${day}`
}

export function normalizeAccountNumber(value: string) {
  return value.trim().toUpperCase()
}

export function maskAccountNumber(value: string) {
  return `•••• ${value.slice(-4)}`
}
