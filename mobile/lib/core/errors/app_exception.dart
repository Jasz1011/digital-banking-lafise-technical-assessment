class AppException implements Exception {
  const AppException({
    required this.title,
    required this.message,
    this.statusCode,
    this.validationMessages = const [],
  });

  final String title;
  final String message;
  final int? statusCode;
  final List<String> validationMessages;

  @override
  String toString() => '$title: $message';
}

class ApiException extends AppException {
  const ApiException({
    required super.title,
    required super.message,
    super.statusCode,
    super.validationMessages,
  });
}

class ValidationException extends AppException {
  const ValidationException({
    required super.message,
    super.statusCode,
    super.validationMessages,
  }) : super(title: 'Revisa los datos');
}
