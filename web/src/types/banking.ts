export type TransactionType = 'Deposit' | 'Withdrawal'

export interface Customer {
  id: string
  fullName: string
  birthDate: string
  gender: string
  monthlyIncome: number
  createdAt: string
}

export interface CreateCustomerInput {
  fullName: string
  birthDate: string
  gender: string
  monthlyIncome: number
}

export interface BankAccount {
  id: string
  accountNumber: string
  customerId: string
  balance: number
  createdAt: string
}

export interface CreateBankAccountInput {
  customerId: string
  initialBalance: number
}

export interface Balance {
  accountNumber: string
  balance: number
}

export interface Transaction {
  transactionId: string
  type: TransactionType
  amount: number
  timestamp: string
  balanceAfterTransaction: number
}

export interface MoneyMovementInput {
  amount: number
}
