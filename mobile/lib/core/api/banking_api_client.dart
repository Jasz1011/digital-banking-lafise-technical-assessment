import 'package:dio/dio.dart';

import '../errors/api_error_parser.dart';

class BankingApiClient {
  BankingApiClient(String baseUrl)
    : _dio = Dio(
        BaseOptions(
          baseUrl: baseUrl,
          connectTimeout: const Duration(seconds: 12),
          receiveTimeout: const Duration(seconds: 12),
          sendTimeout: const Duration(seconds: 12),
          headers: const {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
        ),
      );

  BankingApiClient.withDio(this._dio);

  final Dio _dio;

  Future<Map<String, dynamic>> getObject(String path) =>
      _requestObject(() => _dio.get<Object?>(path));

  Future<List<dynamic>> getList(String path) async {
    try {
      final response = await _dio.get<Object?>(path);
      final data = response.data;
      if (data is List) return data;
      throw const FormatException('Expected a JSON array.');
    } on Object catch (error) {
      throw ApiErrorParser.parse(error);
    }
  }

  Future<Map<String, dynamic>> postObject(
    String path,
    Map<String, dynamic> body,
  ) => _requestObject(() => _dio.post<Object?>(path, data: body));

  Future<Map<String, dynamic>> _requestObject(
    Future<Response<Object?>> Function() request,
  ) async {
    try {
      final response = await request();
      final data = response.data;
      if (data is Map) return Map<String, dynamic>.from(data);
      throw const FormatException('Expected a JSON object.');
    } on Object catch (error) {
      throw ApiErrorParser.parse(error);
    }
  }
}
