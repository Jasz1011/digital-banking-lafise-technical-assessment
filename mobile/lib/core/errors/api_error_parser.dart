import 'package:dio/dio.dart';

import 'app_exception.dart';

abstract final class ApiErrorParser {
  static AppException parse(Object error) {
    if (error is AppException) return error;

    if (error is! DioException) {
      return const ApiException(
        title: 'No pudimos completar la solicitud',
        message: 'Inténtalo nuevamente en unos momentos.',
      );
    }

    if (error.response == null) {
      return ApiException(
        title:
            error.type == DioExceptionType.connectionTimeout ||
                error.type == DioExceptionType.receiveTimeout ||
                error.type == DioExceptionType.sendTimeout
            ? 'Tiempo de espera agotado'
            : 'Sin conexión con el servicio',
        message:
            'Verifica que Banking.Api esté en ejecución y revisa tu conexión.',
      );
    }

    final status = error.response?.statusCode;
    final body = error.response?.data;
    if (body is! Map) {
      return ApiException(
        title: _fallbackTitle(status),
        message: 'No pudimos completar la solicitud. Inténtalo nuevamente.',
        statusCode: status,
      );
    }

    final data = Map<String, dynamic>.from(body);
    final validationMessages = _validationMessages(data['errors']);
    final title = _string(data['title']) ?? _fallbackTitle(status);
    final detail =
        _string(data['detail']) ??
        (validationMessages.isNotEmpty
            ? validationMessages.first
            : 'No pudimos completar la solicitud. Inténtalo nuevamente.');

    if (validationMessages.isNotEmpty) {
      return ValidationException(
        message: detail,
        statusCode: status,
        validationMessages: validationMessages,
      );
    }

    return ApiException(title: title, message: detail, statusCode: status);
  }

  static String? _string(Object? value) {
    if (value is String && value.trim().isNotEmpty) return value.trim();
    return null;
  }

  static List<String> _validationMessages(Object? errors) {
    if (errors is! Map) return const [];
    return errors.values
        .expand((value) => value is Iterable ? value : [value])
        .whereType<String>()
        .where((message) => message.trim().isNotEmpty)
        .toList(growable: false);
  }

  static String _fallbackTitle(int? status) => switch (status) {
    400 => 'Solicitud inválida',
    404 => 'No encontramos lo solicitado',
    409 => 'No se pudo completar la operación',
    _ => 'No pudimos completar la solicitud',
  };
}
