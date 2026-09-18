import '../../accounts/domain/bank_account.dart';
import 'bank_transaction.dart';

abstract interface class TransactionRepository {
  Future<AccountBalance> deposit(String accountNumber, double amount);
  Future<AccountBalance> withdraw(String accountNumber, double amount);
  Future<List<BankTransaction>> getTransactions(String accountNumber);
}
