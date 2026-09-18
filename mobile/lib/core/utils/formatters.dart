import 'package:intl/intl.dart';
import 'package:timezone/timezone.dart' as timezone;

abstract final class AppFormatters {
  static final NumberFormat _currency = NumberFormat.currency(
    locale: 'es_NI',
    name: 'NIO',
    symbol: r'C$',
    decimalDigits: 2,
  );

  static final DateFormat _dateTime = DateFormat(
    "d 'de' MMM 'de' y · h:mm a",
    'es_NI',
  );
  static final DateFormat _date = DateFormat("d 'de' MMMM 'de' y", 'es_NI');

  static String currency(num amount) => _currency.format(amount);

  static String dateTime(DateTime value) {
    final location = timezone.getLocation('America/Managua');
    final local = timezone.TZDateTime.from(value.toUtc(), location);
    return _dateTime
        .format(local)
        .replaceAll('AM', 'a. m.')
        .replaceAll('PM', 'p. m.');
  }

  static String date(DateTime value) => _date.format(value);

  static DateTime nicaraguaToday() {
    final location = timezone.getLocation('America/Managua');
    final now = timezone.TZDateTime.now(location);
    return DateTime(now.year, now.month, now.day);
  }

  static String account(String value) => value.trim().toUpperCase();

  static String maskedAccount(String value) =>
      value.length >= 4 ? '•••• ${value.substring(value.length - 4)}' : value;

  static String transactionReference(String value) {
    if (value.length <= 13) return value;
    return value.substring(0, 8).toUpperCase();
  }

  static double? parseMoney(String value) {
    final normalized = value.trim().replaceAll(' ', '').replaceAll(',', '.');
    return double.tryParse(normalized);
  }
}
