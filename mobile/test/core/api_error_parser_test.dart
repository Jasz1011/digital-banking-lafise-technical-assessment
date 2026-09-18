import 'package:dio/dio.dart';
import 'package:digital_banking_lafise/core/errors/api_error_parser.dart';
import 'package:digital_banking_lafise/core/errors/app_exception.dart';
import 'package:flutter_test/flutter_test.dart';

void main() {
  group('ApiErrorParser', () {
    test('parses ProblemDetails from Banking.Api', () {
      final error = DioException(
        requestOptions: RequestOptions(path: '/api/accounts/missing/balance'),
        response: Response<Object?>(
          requestOptions: RequestOptions(path: '/api/accounts/missing/balance'),
          statusCode: 404,
          data: {
            'title': 'Cuenta no encontrada',
            'detail': 'No se encontró la cuenta bancaria.',
            'status': 404,
          },
        ),
      );

      final parsed = ApiErrorParser.parse(error);

      expect(parsed, isA<ApiException>());
      expect(parsed.title, 'Cuenta no encontrada');
      expect(parsed.message, 'No se encontró la cuenta bancaria.');
      expect(parsed.statusCode, 404);
    });

    test('flattens ValidationProblemDetails messages', () {
      final request = RequestOptions(path: '/api/customers');
      final error = DioException(
        requestOptions: request,
        response: Response<Object?>(
          requestOptions: request,
          statusCode: 400,
          data: {
            'title': 'Solicitud inválida',
            'detail': 'Uno o más datos no son válidos.',
            'errors': {
              'FullName': ['El nombre es obligatorio.'],
              'Gender': ['El género es obligatorio.'],
            },
          },
        ),
      );

      final parsed = ApiErrorParser.parse(error);

      expect(parsed, isA<ValidationException>());
      expect(parsed.statusCode, 400);
      expect(parsed.validationMessages, [
        'El nombre es obligatorio.',
        'El género es obligatorio.',
      ]);
    });

    test('returns a safe connection message when no response exists', () {
      final error = DioException.connectionError(
        requestOptions: RequestOptions(path: '/api/accounts'),
        reason: 'Socket failed',
      );

      final parsed = ApiErrorParser.parse(error);

      expect(parsed.title, 'Sin conexión con el servicio');
      expect(parsed.message, isNot(contains('Socket failed')));
    });
  });
}
