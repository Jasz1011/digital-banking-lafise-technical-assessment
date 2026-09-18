import 'package:digital_banking_lafise/core/utils/validators.dart';
import 'package:flutter_test/flutter_test.dart';

void main() {
  group('customer validators', () {
    test('rejects blank name and accepts Unicode names', () {
      expect(AppValidators.fullName('   '), isNotNull);
      expect(AppValidators.fullName("María José O'Connor-Gómez Ñ"), isNull);
    });

    test('rejects future birth dates', () {
      expect(
        AppValidators.birthDate(
          DateTime(2026, 9, 19),
          today: DateTime(2026, 9, 18),
        ),
        isNotNull,
      );
      expect(
        AppValidators.birthDate(
          DateTime(2000, 1, 1),
          today: DateTime(2026, 9, 18),
        ),
        isNull,
      );
    });

    test('requires gender and permits zero income', () {
      expect(AppValidators.gender(''), isNotNull);
      expect(
        AppValidators.nonNegativeMoney('0', label: 'el ingreso mensual'),
        isNull,
      );
    });
  });

  group('account and movement validators', () {
    test('validates customer Guid and exact account format', () {
      expect(
        AppValidators.customerId('81dfec29-9aae-4f11-8cf5-f7b172bca293'),
        isNull,
      );
      expect(AppValidators.customerId('not-a-guid'), isNotNull);
      expect(AppValidators.accountNumber('ACC-20260918-4821'), isNull);
      expect(AppValidators.accountNumber('4821'), isNotNull);
    });

    test('accepts zero initial balance but movement must be positive', () {
      expect(
        AppValidators.nonNegativeMoney('0', label: 'el saldo inicial'),
        isNull,
      );
      expect(AppValidators.positiveMoney('0'), isNotNull);
      expect(AppValidators.positiveMoney('-1'), isNotNull);
      expect(AppValidators.positiveMoney('25.50'), isNull);
    });
  });
}
