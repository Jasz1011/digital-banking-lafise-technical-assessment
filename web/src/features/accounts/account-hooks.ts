import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { bankingApi } from '../../api/banking-api'
import { accountKeys } from '../../lib/query-keys'

export function useCreateAccount() {
  return useMutation({ mutationFn: bankingApi.createAccount })
}

export function useAccountBalance(accountNumber: string) {
  return useQuery({
    queryKey: accountKeys.balance(accountNumber),
    queryFn: () => bankingApi.getBalance(accountNumber),
    enabled: Boolean(accountNumber),
  })
}

export function useLookupAccount() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: bankingApi.getBalance,
    onSuccess: (balance) => {
      queryClient.setQueryData(accountKeys.balance(balance.accountNumber), balance)
    },
  })
}
