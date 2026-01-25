# Flutter Bootstrap Integration with Next.js

This setup allows you to run your Flutter web application seamlessly within your Next.js application.

## 🚀 Features

- **Embedded Flutter Apps**: Run Flutter widgets within Next.js pages
- **Bi-directional Communication**: Send messages between Flutter and React components
- **Asset Management**: Automatic handling of Flutter web assets
- **API Integration**: Shared API endpoints for both Flutter and Next.js
- **Development Mode**: Hot reload support for both Flutter and Next.js

## 📁 Project Structure

```
web-next/
├── src/
│   ├── components/
│   │   └── FlutterApp.tsx          # React component to embed Flutter
│   ├── app/
│   │   ├── flutter/
│   │   │   └── page.tsx            # Flutter integration demo page
│   │   └── api/
│   │       └── flutter/
│   │           └── route.ts        # API for Flutter communication
│   └── middleware.ts               # Next.js middleware for Flutter routes
├── public/
│   ├── flutter-assets/             # Flutter web build output
│   └── flutter-app/                # Flutter app entry point
└── scripts/
    └── build-flutter-web.sh        # Build script for Flutter integration
```

## 🛠️ Setup Instructions

### 1. Build Flutter Web App

```bash
# From project root
npm run build:flutter

# Or manually
bash scripts/build-flutter-web.sh
```

### 2. Start Development Server

```bash
# Build Flutter and start Next.js dev server
npm run dev:with-flutter

# Or start separately
npm run dev
```

### 3. Access Flutter Integration

- **Next.js App**: http://localhost:3001
- **Flutter Demo Page**: http://localhost:3001/flutter
- **Standalone Flutter**: http://localhost:3001/flutter-app/

## 🔗 Usage

### Embedding Flutter in React Components

```tsx
import FlutterApp from '@/components/FlutterApp';

function MyPage() {
  return (
    <div>
      <h1>My Next.js Page with Flutter</h1>
      <FlutterApp
        id="my-flutter-app"
        width="100%"
        height="500px"
        onLoad={() => console.log('Flutter loaded!')}
      />
    </div>
  );
}
```

### Flutter-React Communication

```tsx
import { useFlutterCommunication } from '@/components/FlutterApp';

function CommunicationExample() {
  const { sendMessage, subscribe } = useFlutterCommunication('my-flutter-app');

  useEffect(() => {
    const unsubscribe = subscribe((message) => {
      console.log('Received from Flutter:', message);
    });
    return unsubscribe;
  }, []);

  const handleSendMessage = () => {
    sendMessage({ type: 'greeting', data: 'Hello from React!' });
  };

  return (
    <button onClick={handleSendMessage}>
      Send Message to Flutter
    </button>
  );
}
```

## 🔧 Flutter Configuration

Update your Flutter app to work with the integration:

### 1. Add Communication Bridge (Optional)

Add to your Flutter web app for bi-directional communication:

```dart
// lib/services/web_communication_service.dart
import 'dart:html' as html;
import 'dart:js' as js;

class WebCommunicationService {
  static void sendMessage(Map<String, dynamic> message) {
    if (kIsWeb) {
      final event = html.CustomEvent('flutter-response', detail: {
        'flutterId': 'your-flutter-id',
        'message': message,
      });
      html.window.dispatchEvent(event);
    }
  }

  static void listenForMessages(Function(Map<String, dynamic>) onMessage) {
    if (kIsWeb) {
      html.window.addEventListener('flutter-message', (event) {
        final customEvent = event as html.CustomEvent;
        final data = customEvent.detail;
        if (data['flutterId'] == 'your-flutter-id') {
          onMessage(Map<String, dynamic>.from(data['message']));
        }
      });
    }
  }
}
```

### 2. Update Environment Configuration

Add to your `.env` file:

```env
# Web API Integration
WEB_API_BASE_URL=http://localhost:3001/api
USE_WEB_API=true
DATA_SOURCE=web
ENABLE_FALLBACK=true
```

## 🔄 Development Workflow

1. **Make Flutter changes**: Edit your Flutter code as usual
2. **Rebuild Flutter**: Run `npm run build:flutter` to update web assets
3. **Hot reload**: Next.js will automatically reload with new Flutter assets

## 🌐 API Integration

The Flutter app can communicate with the same Next.js APIs:

```dart
// Use the enhanced API service
final apiService = ApiService.webApi('http://localhost:3001/api');
final products = await apiService.fetchProducts();
```

## 🚀 Production Deployment

1. Build Flutter web app: `npm run build:flutter`
2. Build Next.js app: `npm run build`
3. Deploy the built Next.js app with Flutter assets included

## 🔍 Troubleshooting

### Flutter App Not Loading
- Check that `flutter-assets` directory contains built Flutter files
- Verify middleware is properly configured
- Check browser console for asset loading errors

### Communication Not Working
- Ensure Flutter app and React component use the same ID
- Check that custom events are properly dispatched
- Verify CORS headers are set correctly

### Asset Path Issues
- Check that asset paths are updated after build
- Verify public directory structure
- Ensure middleware rewrites are working

## 🎯 Next Steps

- [ ] Add Flutter state management integration
- [ ] Implement shared authentication between Flutter and Next.js
- [ ] Add automated testing for Flutter-React integration
- [ ] Optimize asset loading and caching strategies

## 📚 Resources

- [Flutter Web Documentation](https://docs.flutter.dev/platform-integration/web)
- [Next.js Custom Server Documentation](https://nextjs.org/docs/pages/building-your-application/configuring/custom-server)
- [Flutter-Web Integration Examples](https://github.com/flutter/samples/tree/main/web)