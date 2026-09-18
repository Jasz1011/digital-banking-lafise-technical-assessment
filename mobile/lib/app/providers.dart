import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../core/api/banking_api_client.dart';
import '../core/config/app_config.dart';
import '../features/accounts/data/dio_account_repository.dart';
import '../features/accounts/domain/account_repository.dart';
import '../features/accounts/domain/bank_account.dart';
import '../features/customers/data/dio_customer_repository.dart';
import '../features/customers/domain/customer_repository.dart';
import '../features/transactions/data/dio_transaction_repository.dart';
import '../features/transactions/domain/bank_transaction.dart';
import '../features/transactions/domain/transaction_repository.dart';

final appConfigProvider = Provider<AppConfig>(
  (ref) => AppConfig.fromEnvironment(),
);

final bankingApiClientProvider = Provider<BankingApiClient>(
  (ref) => BankingApiClient(ref.watch(appConfigProvider).apiBaseUrl),
);

final customerRepositoryProvider = Provider<CustomerRepository>(
  (ref) => DioCustomerRepository(ref.watch(bankingApiClientProvider)),
);

final accountRepositoryProvider = Provider<AccountRepository>(
  (ref) => DioAccountRepository(ref.watch(bankingApiClientProvider)),
);

final transactionRepositoryProvider = Provider<TransactionRepository>(
  (ref) => DioTransactionRepository(ref.watch(bankingApiClientProvider)),
);

final accountBalanceProvider = FutureProvider.autoDispose
    .family<AccountBalance, String>(
      (ref, accountNumber) =>
          ref.watch(accountRepositoryProvider).getBalance(accountNumber),
    );

final accountTransactionsProvider = FutureProvider.autoDispose
    .family<List<BankTransaction>, String>(
      (ref, accountNumber) => ref
          .watch(transactionRepositoryProvider)
          .getTransactions(accountNumber),
    );
