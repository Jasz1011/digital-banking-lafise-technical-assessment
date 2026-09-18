import 'formatters.dart';

abstract final class AppValidators {
  static final RegExp _guid = RegExp(
    r'^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$',
    caseSensitive: false,
  );
  static final RegExp _account = RegExp(r'^ACC-\d{8}-\d{4}$');

  static String? fullName(String? value) {
    final normalized = value?.trim() ?? '';
    if (normalized.isEmpty) return 'Ingresa el nombre completo.';
    if (normalized.length > 200) {
      return 'El nombre no puede exceder 200 caracteres.';
    }
    return null;
  }

  static String? birthDate(DateTime? value, {DateTime? today}) {
    if (value == null) return 'Selecciona la fecha de nacimiento.';
    final reference = today ?? AppFormatters.nicaraguaToday();
    final currentDate = DateTime(
      reference.year,
      reference.month,
      reference.day,
    );
    final selectedDate = DateTime(value.year, value.month, value.day);
    if (selectedDate.isAfter(currentDate)) {
      return 'La fecha de nacimiento no puede ser futura.';
    }
    return null;
  }

  static String? gender(String? value) {
    final normalized = value?.trim() ?? '';
    if (normalized.isEmpty) return 'Selecciona una opción.';
    if (normalized.length > 50) {
      return 'El valor no puede exceder 50 caracteres.';
    }
    return null;
  }

  static String? nonNegativeMoney(String? value, {required String label}) {
    if (value == null || value.trim().isEmpty) return 'Ingresa $label.';
    final amount = AppFormatters.parseMoney(value);
    if (amount == null || !amount.isFinite) return 'Ingresa un monto válido.';
    if (amount < 0) return '$label no puede ser negativo.';
    return null;
  }

  static String? positiveMoney(String? value) {
    if (value == null || value.trim().isEmpty) return 'Ingresa el monto.';
    final amount = AppFormatters.parseMoney(value);
    if (amount == null || !amount.isFinite) return 'Ingresa un monto válido.';
    if (amount <= 0) return 'El monto debe ser mayor que cero.';
    return null;
  }

  static String? customerId(String? value) {
    final normalized = value?.trim() ?? '';
    if (normalized.isEmpty) return 'Ingresa el identificador del cliente.';
    if (!_guid.hasMatch(normalized)) {
      return 'Ingresa un identificador de cliente válido.';
    }
    return null;
  }

  static String? accountNumber(String? value) {
    final normalized = AppFormatters.account(value ?? '');
    if (!_account.hasMatch(normalized)) {
      return 'Usa el formato ACC-YYYYMMDD-XXXX.';
    }
    return null;
  }
}
