import 'package:flutter_dotenv/flutter_dotenv.dart';

/// GoKwik SDK Configuration
/// Reads values from .env file
class GoKwikConfig {
  /// Merchant ID provided by GoKwik
  static String get merchantId => dotenv.env['GOKWIK_MERCHANT_ID'] ?? '';

  /// API Key provided by GoKwik
  static String get apiKey => dotenv.env['GOKWIK_API_KEY'] ?? '';

  /// Environment: 'sandbox' for testing, 'production' for live
  static String get environment => dotenv.env['GOKWIK_ENVIRONMENT'] ?? 'sandbox';

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

/// App Configuration
class AppConfig {
  /// App name
  static String get appName => dotenv.env['APP_NAME'] ?? 'Design Wear';

  /// Debug mode
  static bool get isDebug => dotenv.env['DEBUG_MODE'] == 'true';
}
