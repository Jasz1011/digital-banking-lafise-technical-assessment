import 'package:digital_banking_lafise/core/utils/formatters.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:intl/date_symbol_data_local.dart';
import 'package:timezone/data/latest.dart' as timezone_data;

void main() {
  setUpAll(() async {
    timezone_data.initializeTimeZones();
    await initializeDateFormatting('es_NI');
  });

  test('currency uses the Nicaragua presentation format', () {
    final value = AppFormatters.currency(12500);

    expect(value, contains(r'C$'));
    expect(value, contains('12.500,00'));
  });

  test('dateTime converts UTC to America Managua', () {
    final value = AppFormatters.dateTime(
      DateTime.parse('2026-09-19T01:44:00Z'),
    );

    expect(value, contains('18 de sept'));
    expect(value, contains('7:44'));
  });

  test('normalizes account numbers and masks the last four digits', () {
    expect(AppFormatters.account(' acc-20260918-4821 '), 'ACC-20260918-4821');
    expect(AppFormatters.maskedAccount('ACC-20260918-4821'), '•••• 4821');
  });

  test('parses decimal input with comma or dot', () {
    expect(AppFormatters.parseMoney('2500,75'), 2500.75);
    expect(AppFormatters.parseMoney('2500.75'), 2500.75);
  });
}
