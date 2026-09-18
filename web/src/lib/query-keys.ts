export const accountKeys = {
  all: ['accounts'] as const,
  balance: (accountNumber: string) => [...accountKeys.all, accountNumber, 'balance'] as const,
  transactions: (accountNumber: string) =>
    [...accountKeys.all, accountNumber, 'transactions'] as const,
}
