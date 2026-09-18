import { useMutation } from '@tanstack/react-query'
import { bankingApi } from '../../api/banking-api'

export function useCreateCustomer() {
  return useMutation({ mutationFn: bankingApi.createCustomer })
}
