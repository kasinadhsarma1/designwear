# Firebase Hosting Environment Configuration Playbook

## Problem Overview

When deploying Flutter web applications to Firebase Hosting, environment variables stored in `.env` files are not accessible in the deployed application, causing runtime failures when the app tries to read configuration values.

### Symptoms

- **Local build works fine**: App runs correctly with `flutter run -d chrome` or local builds
- **Deployed app fails**: Shows "No data found" or similar errors
- **Console errors**: API calls fail with malformed URLs (e.g., `https://.api.sanity.io/...` instead of `https://PROJECT_ID.api.sanity.io/...`)
- **Root cause**: Environment variables return empty strings or null values

### Why This Happens

Firebase Hosting has a default ignore pattern `"**/.*"` in `firebase.json` that blocks all dotfiles (files starting with `.`) from being deployed. This includes:
- `.env`
- `.env.production`
- `.gitignore`
- Any other dotfile

Even if you modify `firebase.json` to exclude `.env` from the ignore pattern using `"!**/assets/.env"`, Firebase Hosting may still not serve dotfiles reliably due to security policies.

## Solution: Use Non-Dotfile Configuration

Instead of relying on `.env` files for web deployments, use a JSON configuration file that won't be blocked by Firebase Hosting.

### Implementation Steps

#### Step 1: Create `env.json` Configuration File

Create `assets/env.json` with your environment variables:

```json
{
  "SANITY_PROJECT_ID": "your_project_id",
  "SANITY_DATASET": "production",
  "API_KEY": "your_api_key",
  "APP_NAME": "Your App Name"
}
```

**Security Note**: This file will be publicly accessible. Only include non-sensitive configuration values or values that are safe to expose (like project IDs for public APIs).

#### Step 2: Add to Flutter Assets

Update `pubspec.yaml` to include the JSON file:

```yaml
flutter:
  assets:
    - assets/.env          # Keep for mobile platforms
    - assets/env.json      # Add for web platform
    - assets/images/
```

#### Step 3: Create Configuration Loader

Create or update your config file (e.g., `lib/config/app_config.dart`) with a dual-loader that supports both `.env` and `env.json`:

```dart
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:flutter/foundation.dart' show kIsWeb;
import 'package:flutter/services.dart' show rootBundle;
import 'dart:convert';

/// Configuration loader that supports both .env and env.json
class ConfigLoader {
  static Map<String, dynamic>? _jsonConfig;
  static bool _initialized = false;

  static Future<void> init() async {
    if (_initialized) return;
    
    // For web, load env.json (dotfiles don't deploy well)
    if (kIsWeb) {
      try {
        final jsonString = await rootBundle.loadString('assets/env.json');
        _jsonConfig = json.decode(jsonString);
        print('Loaded configuration from env.json');
      } catch (e) {
        print('Failed to load env.json: $e');
      }
    }
    
    _initialized = true;
  }

  static String? get(String key) {
    // Try JSON config first (for web)
    if (_jsonConfig != null && _jsonConfig!.containsKey(key)) {
      return _jsonConfig![key]?.toString();
    }
    // Fall back to dotenv (for mobile)
    return dotenv.env[key];
  }
}

/// Example config class using the loader
class SanityConfig {
  static String get projectId => ConfigLoader.get('SANITY_PROJECT_ID') ?? '';
  static String get dataset => ConfigLoader.get('SANITY_DATASET') ?? 'production';
}
```

#### Step 4: Initialize in Main

Update `lib/main.dart` to initialize the config loader:

```dart
import 'config/app_config.dart';

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();

  // Initialize config loader (loads env.json for web)
  await ConfigLoader.init();

  // Load .env for mobile platforms
  await dotenv.load(fileName: "assets/.env");

  // Rest of initialization...
  runApp(const MyApp());
}
```

#### Step 5: Build and Deploy

```bash
# Build for web
flutter build web --release

# Deploy to Firebase
firebase deploy --only hosting
```

#### Step 6: Verify Deployment

1. Check that `env.json` is accessible:
   ```bash
   curl https://your-app.web.app/assets/assets/env.json
   ```

2. Open browser console and verify:
   - Look for "Loaded configuration from env.json" message
   - Check that API calls use correct configuration values

## How It Works

### Platform Detection

The `ConfigLoader` uses `kIsWeb` to detect the platform:
- **Web**: Loads `env.json` using `rootBundle.loadString()`
- **Mobile/Desktop**: Falls back to `flutter_dotenv` which reads `.env`

### Fallback Chain

```
ConfigLoader.get(key)
  ├─> Check JSON config (if web and loaded)
  └─> Fall back to dotenv.env[key]
```

This ensures:
- Web builds use `env.json`
- Mobile builds use `.env`
- Graceful degradation if either fails

## Alternative Approaches (Not Recommended)

### ❌ Modifying firebase.json Ignore Pattern

```json
{
  "hosting": {
    "ignore": [
      "firebase.json",
      "**/.*",
      "!**/assets/.env"  // This often doesn't work reliably
    ]
  }
}
```

**Why this fails**: Firebase Hosting security policies may still block dotfiles even with explicit exceptions.

### ❌ Using Firebase Environment Config

Firebase offers environment configuration, but it's designed for Cloud Functions, not static hosting.

### ❌ Build-Time Variable Injection

While possible, this requires custom build scripts and doesn't work well with Flutter's asset bundling.

## Security Considerations

### Public Exposure

Files in `assets/` are publicly accessible in web builds. **Never include**:
- Private API keys
- Database credentials
- Authentication secrets
- Encryption keys

### Safe to Include

- Public API project IDs (e.g., Sanity, Firebase)
- Public configuration endpoints
- Feature flags
- Non-sensitive app settings

### For Sensitive Values

Use one of these approaches:
1. **Backend proxy**: Route sensitive API calls through your own backend
2. **Firebase App Check**: Protect API access with app attestation
3. **Environment-specific builds**: Use different `env.json` files for dev/staging/prod
4. **Server-side rendering**: Handle sensitive operations server-side

## Troubleshooting

### Config not loading on web

**Check**: Browser console for "Loaded configuration from env.json"
- If missing, verify `env.json` is in `assets/` and listed in `pubspec.yaml`
- Run `flutter clean && flutter build web --release`

### Getting empty values

**Check**: Key names match exactly between `env.json` and your code
- JSON is case-sensitive
- No extra spaces in key names

### 404 on env.json

**Check**: File path in deployment
- Should be at `https://your-app.web.app/assets/assets/env.json`
- Note the double `assets/` - this is correct for Flutter web

### Works locally but not deployed

**Check**: You're testing the actual deployed URL, not local build
- Clear browser cache
- Use incognito/private browsing mode
- Check Firebase Hosting deployment timestamp

## Testing Checklist

- [ ] Local web build works: `flutter run -d chrome`
- [ ] Production build works: `flutter build web --release`
- [ ] `env.json` is accessible at deployed URL
- [ ] Console shows "Loaded configuration from env.json"
- [ ] API calls use correct configuration values
- [ ] Mobile builds still work with `.env`
- [ ] No sensitive data in `env.json`

## Related Files

- `assets/env.json` - Web configuration file
- `assets/.env` - Mobile configuration file (keep for backward compatibility)
- `lib/config/app_config.dart` - Configuration loader
- `lib/main.dart` - Initialization
- `pubspec.yaml` - Asset declarations
- `firebase.json` - Hosting configuration

## References

- [Flutter Web Deployment](https://docs.flutter.dev/deployment/web)
- [Firebase Hosting Configuration](https://firebase.google.com/docs/hosting/full-config)
- [flutter_dotenv Package](https://pub.dev/packages/flutter_dotenv)

---

**Last Updated**: 2026-02-02  
**Tested With**: Flutter 3.x, Firebase Hosting  
**Status**: ✅ Production-ready
