import 'package:digital_banking_lafise/core/api/banking_api_client.dart';
import 'package:digital_banking_lafise/features/accounts/data/dio_account_repository.dart';
import 'package:digital_banking_lafise/features/accounts/domain/bank_account.dart';
import 'package:digital_banking_lafise/features/customers/data/dio_customer_repository.dart';
import 'package:digital_banking_lafise/features/customers/domain/customer.dart';
import 'package:digital_banking_lafise/features/transactions/data/dio_transaction_repository.dart';
import 'package:digital_banking_lafise/features/transactions/domain/bank_transaction.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:mocktail/mocktail.dart';

class MockBankingApiClient extends Mock implements BankingApiClient {}

void main() {
  late MockBankingApiClient client;

  setUp(() => client = MockBankingApiClient());

  test(
    'customer repository sends the backend contract and maps response',
    () async {
      when(() => client.postObject('/api/customers', any())).thenAnswer(
        (_) async => {
          'id': '81dfec29-9aae-4f11-8cf5-f7b172bca293',
          'fullName': 'María López',
          'birthDate': '1994-05-17',
          'gender': 'Femenino',
          'monthlyIncome': 25000,
          'createdAt': '2026-09-18T13:00:00Z',
        },
      );
      final repository = DioCustomerRepository(client);

      final result = await repository.createCustomer(
        CreateCustomerInput(
          fullName: ' María López ',
          birthDate: DateTime(1994, 5, 17),
          gender: 'Femenino',
          monthlyIncome: 25000,
        ),
      );

      expect(result.fullName, 'María López');
      verify(
        () => client.postObject('/api/customers', {
          'fullName': 'María López',
          'birthDate': '1994-05-17',
          'gender': 'Femenino',
          'monthlyIncome': 25000.0,
        }),
      ).called(1);
    },
  );

  test('account repository maps the created account', () async {
    when(() => client.postObject('/api/accounts', any())).thenAnswer(
      (_) async => {
        'id': '92759810-02e0-4bbd-a179-229b8f420a81',
        'accountNumber': 'ACC-20260918-4821',
        'customerId': '81dfec29-9aae-4f11-8cf5-f7b172bca293',
        'balance': 10000,
        'createdAt': '2026-09-18T13:00:00Z',
      },
    );
    final repository = DioAccountRepository(client);

    final result = await repository.createAccount(
      const CreateBankAccountInput(
        customerId: '81dfec29-9aae-4f11-8cf5-f7b172bca293',
        initialBalance: 10000,
      ),
    );

    expect(result.accountNumber, 'ACC-20260918-4821');
    expect(result.balance, 10000);
  });

  test('transaction repository posts movement and maps history', () async {
    when(
      () => client.postObject('/api/accounts/ACC-20260918-4821/deposits', {
        'amount': 2500.0,
      }),
    ).thenAnswer(
      (_) async => {'accountNumber': 'ACC-20260918-4821', 'balance': 12500},
    );
    when(
      () => client.getList('/api/accounts/ACC-20260918-4821/transactions'),
    ).thenAnswer(
      (_) async => [
        {
          'transactionId': '81dfec29-9aae-4f11-8cf5-f7b172bca293',
          'type': 'Deposit',
          'amount': 2500,
          'timestamp': '2026-09-18T13:44:00Z',
          'balanceAfterTransaction': 12500,
        },
      ],
    );
    final repository = DioTransactionRepository(client);

    final balance = await repository.deposit('acc-20260918-4821', 2500);
    final history = await repository.getTransactions('acc-20260918-4821');

    expect(balance.balance, 12500);
    expect(history.single.type, TransactionType.deposit);
    expect(history.single.balanceAfterTransaction, 12500);
  });
}
