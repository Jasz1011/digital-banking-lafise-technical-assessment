import '../../../core/api/banking_api_client.dart';
import '../../../core/utils/formatters.dart';
import '../../accounts/domain/bank_account.dart';
import '../domain/bank_transaction.dart';
import '../domain/transaction_repository.dart';

class DioTransactionRepository implements TransactionRepository {
  const DioTransactionRepository(this._client);

  final BankingApiClient _client;

  @override
  Future<AccountBalance> deposit(String accountNumber, double amount) =>
      _movement(accountNumber, amount, 'deposits');

  @override
  Future<AccountBalance> withdraw(String accountNumber, double amount) =>
      _movement(accountNumber, amount, 'withdrawals');

  @override
  Future<List<BankTransaction>> getTransactions(String accountNumber) async {
    final normalized = AppFormatters.account(accountNumber);
    final list = await _client.getList(
      '/api/accounts/${Uri.encodeComponent(normalized)}/transactions',
    );
    return list
        .map(
          (item) =>
              BankTransaction.fromJson(Map<String, dynamic>.from(item as Map)),
        )
        .toList(growable: false);
  }

  Future<AccountBalance> _movement(
    String accountNumber,
    double amount,
    String resource,
  ) async {
    final normalized = AppFormatters.account(accountNumber);
    final json = await _client.postObject(
      '/api/accounts/${Uri.encodeComponent(normalized)}/$resource',
      {'amount': amount},
    );
    return AccountBalance.fromJson(json);
  }
}
