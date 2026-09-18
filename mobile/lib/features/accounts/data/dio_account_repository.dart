import '../../../core/api/banking_api_client.dart';
import '../../../core/utils/formatters.dart';
import '../domain/account_repository.dart';
import '../domain/bank_account.dart';

class DioAccountRepository implements AccountRepository {
  const DioAccountRepository(this._client);

  final BankingApiClient _client;

  @override
  Future<BankAccount> createAccount(CreateBankAccountInput input) async {
    final json = await _client.postObject('/api/accounts', input.toJson());
    return BankAccount.fromJson(json);
  }

  @override
  Future<AccountBalance> getBalance(String accountNumber) async {
    final normalized = AppFormatters.account(accountNumber);
    final json = await _client.getObject(
      '/api/accounts/${Uri.encodeComponent(normalized)}/balance',
    );
    return AccountBalance.fromJson(json);
  }
}
