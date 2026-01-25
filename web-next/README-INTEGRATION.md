# DesignWear Web-Next Integration

This document explains how the Next.js web application connects to the Flutter Dart backend services.

## Architecture Overview

The integration creates a seamless connection between your Flutter mobile app and Next.js web app by:

1. **Shared Data Models**: TypeScript types that mirror your Dart models
2. **API Layer**: RESTful endpoints that use the same Sanity CMS data source
3. **Shared Configuration**: Environment variables and configuration that match your Flutter app
4. **Client Hooks**: React hooks for easy data fetching in components

## File Structure

```
web-next/
├── src/
│   ├── types/
│   │   └── index.ts                    # TypeScript types mirroring Dart models
│   ├── config/
│   │   └── app.ts                      # Configuration matching Flutter config
│   ├── services/
│   │   └── sanity.ts                   # Sanity service mirroring Flutter SanityService
│   ├── hooks/
│   │   └── useApi.ts                   # React hooks for data fetching
│   └── app/
│       └── api/
│           ├── products/
│           │   ├── route.ts            # GET /api/products
│           │   └── [id]/
│           │       └── route.ts        # GET /api/products/[id]
│           ├── categories/
│           │   ├── route.ts            # GET /api/categories
│           │   └── [id]/
│           │       └── products/
│           │           └── route.ts    # GET /api/categories/[id]/products
│           └── settings/
│               └── tax-rate/
│                   └── route.ts        # GET /api/settings/tax-rate
```

## API Endpoints

All endpoints return data in the format:
```typescript
{
  data: T,
  success: boolean,
  message?: string,
  error?: string
}
```

### Products
- `GET /api/products` - Fetch all products
- `GET /api/products/[id]` - Fetch specific product
- `POST /api/products` - Create/update product

### Categories  
- `GET /api/categories` - Fetch all categories
- `GET /api/categories/[id]/products` - Fetch products by category

### Settings
- `GET /api/settings/tax-rate` - Fetch tax rate from Sanity

## Usage in Components

```tsx
import { useProducts, useCategories } from '../hooks/useApi';

export default function ProductList() {
  const { products, loading, error } = useProducts();
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  
  return (
    <div>
      {products.map(product => (
        <div key={product.id}>{product.title}</div>
      ))}
    </div>
  );
}
```

## Configuration

1. Copy `.env.example` to `.env.local`
2. Fill in your Sanity project details:
   ```
   SANITY_PROJECT_ID=your_project_id
   SANITY_DATASET=production
   ```
3. The configuration will automatically match your Flutter app settings

## Flutter Integration

The Flutter app can now also call these API endpoints:

```dart
// In your Flutter app, you can call the Next.js APIs
final response = await http.get(
  Uri.parse('https://yourapp.com/api/products'),
  headers: {'Content-Type': 'application/json'},
);

if (response.statusCode == 200) {
  final data = jsonDecode(response.body);
  if (data['success']) {
    final products = (data['data'] as List)
        .map((item) => Product.fromMap(item))
        .toList();
  }
}
```

## Benefits

1. **Data Consistency**: Both apps use the same Sanity CMS data source
2. **Type Safety**: Shared models ensure consistency between platforms
3. **Easy Maintenance**: Changes to models are reflected in both apps
4. **Scalability**: API endpoints can serve multiple client applications
5. **Development Efficiency**: Shared business logic and data access patterns

## Next Steps

1. Install dependencies: `npm install`
2. Set up your environment variables
3. Run the development server: `npm run dev`
4. Test the API endpoints at `http://localhost:3000/api/*`