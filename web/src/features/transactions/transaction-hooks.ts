import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { bankingApi } from '../../api/banking-api'
import { accountKeys } from '../../lib/query-keys'

export type MovementKind = 'deposit' | 'withdrawal'

export function useTransactions(accountNumber: string) {
  return useQuery({
    queryKey: accountKeys.transactions(accountNumber),
    queryFn: () => bankingApi.getTransactions(accountNumber),
    enabled: Boolean(accountNumber),
  })
}

export function useMovement(accountNumber: string, kind: MovementKind) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (amount: number) =>
      kind === 'deposit'
        ? bankingApi.deposit(accountNumber, { amount })
        : bankingApi.withdraw(accountNumber, { amount }),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: accountKeys.balance(accountNumber) }),
        queryClient.invalidateQueries({ queryKey: accountKeys.transactions(accountNumber) }),
      ])
    },
  })
}
