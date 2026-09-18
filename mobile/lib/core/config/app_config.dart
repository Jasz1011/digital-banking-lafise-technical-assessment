import 'dart:io';

class AppConfig {
  const AppConfig({required this.apiBaseUrl});

  factory AppConfig.fromEnvironment() {
    const configuredUrl = String.fromEnvironment('API_BASE_URL');
    if (configuredUrl.trim().isNotEmpty) {
      return AppConfig(apiBaseUrl: _normalize(configuredUrl));
    }

    return AppConfig(
      apiBaseUrl: Platform.isAndroid
          ? 'http://10.0.2.2:5097'
          : 'http://127.0.0.1:5097',
    );
  }

  final String apiBaseUrl;

  static String _normalize(String value) =>
      value.trim().replaceFirst(RegExp(r'/$'), '');
}
