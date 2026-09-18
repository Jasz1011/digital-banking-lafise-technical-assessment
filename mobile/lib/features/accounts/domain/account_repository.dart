import 'bank_account.dart';

abstract interface class AccountRepository {
  Future<BankAccount> createAccount(CreateBankAccountInput input);
  Future<AccountBalance> getBalance(String accountNumber);
}
