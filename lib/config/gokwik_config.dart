import 'package:flutter_dotenv/flutter_dotenv.dart';

/// GoKwik SDK Configuration
/// Reads values from .env file
class GoKwikConfig {
  /// Merchant ID provided by GoKwik
  static String get merchantId => dotenv.env['GOKWIK_MERCHANT_ID'] ?? '';

  /// API Key provided by GoKwik
  static String get apiKey => dotenv.env['GOKWIK_API_KEY'] ?? '';

  /// Environment: 'sandbox' for testing, 'production' for live
  static String get environment =>
      dotenv.env['GOKWIK_ENVIRONMENT'] ?? 'sandbox';

  /// Check if we're in sandbox mode
  static bool get isSandbox => environment == 'sandbox';

  /// Enable debug logging
  static bool get enableLogging => dotenv.env['DEBUG_MODE'] == 'true';
}

/// Sanity CMS Configuration
class SanityConfig {
  /// Sanity project ID
  static String get projectId => dotenv.env['SANITY_PROJECT_ID'] ?? '';

  /// Sanity dataset
  static String get dataset => dotenv.env['SANITY_DATASET'] ?? 'production';
}

/// Web API Configuration
class WebApiConfig {
  /// Base URL for the Next.js web API
  static String get baseUrl =>
      dotenv.env['WEB_API_BASE_URL'] ?? 'http://localhost:3001/api';

  /// Whether to use web API instead of direct Sanity
  static bool get useWebApi => dotenv.env['USE_WEB_API'] == 'true';

  /// API timeout duration
  static Duration get timeout =>
      Duration(seconds: int.parse(dotenv.env['API_TIMEOUT_SECONDS'] ?? '30'));
}

/// App Configuration
class AppConfig {
  /// App name
  static String get appName => dotenv.env['APP_NAME'] ?? 'Design Wear';

  /// Debug mode
  static bool get isDebug => dotenv.env['DEBUG_MODE'] == 'true';

  /// Data source priority: 'web' for web API first, 'sanity' for Sanity first
  static String get dataSource => dotenv.env['DATA_SOURCE'] ?? 'sanity';

  /// Whether to fallback to alternative data source on failure
  static bool get enableFallback => dotenv.env['ENABLE_FALLBACK'] == 'true';
}
