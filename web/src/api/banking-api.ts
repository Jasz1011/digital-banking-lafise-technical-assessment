import { apiClient } from './client'
import type {
  Balance,
  BankAccount,
  CreateBankAccountInput,
  CreateCustomerInput,
  Customer,
  MoneyMovementInput,
  Transaction,
} from '../types/banking'

export const bankingApi = {
  async createCustomer(input: CreateCustomerInput) {
    const { data } = await apiClient.post<Customer>('/api/customers', input)
    return data
  },

  async createAccount(input: CreateBankAccountInput) {
    const { data } = await apiClient.post<BankAccount>('/api/accounts', input)
    return data
  },

  async getBalance(accountNumber: string) {
    const { data } = await apiClient.get<Balance>(
      `/api/accounts/${encodeURIComponent(accountNumber)}/balance`,
    )
    return data
  },

  async deposit(accountNumber: string, input: MoneyMovementInput) {
    const { data } = await apiClient.post<Balance>(
      `/api/accounts/${encodeURIComponent(accountNumber)}/deposits`,
      input,
    )
    return data
  },

  async withdraw(accountNumber: string, input: MoneyMovementInput) {
    const { data } = await apiClient.post<Balance>(
      `/api/accounts/${encodeURIComponent(accountNumber)}/withdrawals`,
      input,
    )
    return data
  },

  async getTransactions(accountNumber: string) {
    const { data } = await apiClient.get<Transaction[]>(
      `/api/accounts/${encodeURIComponent(accountNumber)}/transactions`,
    )
    return data
  },
}
