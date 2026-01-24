import 'package:flutter_sanity/flutter_sanity.dart';
import '../models/product.dart';
import '../models/category.dart';

class SanityService {
  final SanityClient client = SanityClient(
    projectId: '',
    dataset: 'production',
    useCdn: false,
  );

  Future<List<Product>> fetchProducts() async {
    try {
      const query =
          '*[_type == "product"]{_id, title, slug, description, price, "imageUrl": image.asset->url, category, stock}';
      final List<dynamic> result = await client.fetch(query);
      return result.map((item) => Product.fromMap(item)).toList();
    } catch (e) {
      print('Sanity fetch failed: $e. Returning mock products.');
      return _getMockProducts();
    }
  }

  Future<List<Category>> fetchCategories() async {
    try {
      const query =
          '*[_type == "category"]{_id, title, slug, description, "imageUrl": image.asset->url}';
      final List<dynamic> result = await client.fetch(query);
      return result.map((item) => Category.fromMap(item)).toList();
    } catch (e) {
      print('Sanity fetch failed: $e. Returning mock categories.');
      return _getMockCategories();
    }
  }

  Future<List<Product>> fetchProductsByCategory(String categoryId) async {
    try {
      final query =
          '*[_type == "product" && category._ref == "$categoryId"]{_id, title, slug, description, price, "imageUrl": image.asset->url, category, stock}';
      final List<dynamic> result = await client.fetch(query);
      return result.map((item) => Product.fromMap(item)).toList();
    } catch (e) {
      print('Sanity fetch failed: $e. Returning mock products for category.');
      return _getMockProducts()
          .where(
            (p) => p.categoryId == categoryId || p.categoryId == 'mock-cat-1',
          )
          .toList();
    }
  }

  Future<double> fetchTaxRate() async {
    try {
      const query = '*[_type == "settings"][0].taxRate';
      final result = await client.fetch(query);
      return (result as num?)?.toDouble() ?? 18.0;
    } catch (e) {
      print('Sanity fetch failed: $e. Returning default tax rate.');
      return 18.0;
    }
  }

  // --- MOCK DATA ---

  List<Product> _getMockProducts() {
    return [
      Product(
        id: 'mock-1',
        title: 'Premium Cotton Tee',
        slug: 'premium-cotton-tee',
        description: 'High quality cotton t-shirt with a modern fit.',
        price: 29.99,
        imageUrl:
            'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=800&q=80',
        categoryId: 'mock-cat-1',
        stockStatus: 'inStock',
      ),
      Product(
        id: 'mock-2',
        title: 'Signature Hoodie',
        slug: 'signature-hoodie',
        description: 'Warm and stylish hoodie for everyday wear.',
        price: 59.99,
        imageUrl:
            'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=800&q=80',
        categoryId: 'mock-cat-1',
        stockStatus: 'inStock',
      ),
      Product(
        id: 'mock-3',
        title: 'Urban Jacket',
        slug: 'urban-jacket',
        description: 'Water resistant jacket perfect for the city.',
        price: 89.99,
        imageUrl:
            'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=800&q=80',
        categoryId: 'mock-cat-2',
        stockStatus: 'inStock',
      ),
      Product(
        id: 'mock-4',
        title: 'Slim Fit Jeans',
        slug: 'slim-fit-jeans',
        description: 'Classic denim with a modern slim cut.',
        price: 49.99,
        imageUrl:
            'https://images.unsplash.com/photo-1542272617-08f08630329e?auto=format&fit=crop&w=800&q=80',
        categoryId: 'mock-cat-2',
        stockStatus: 'inStock',
      ),
    ];
  }

  List<Category> _getMockCategories() {
    return [
      Category(
        id: 'mock-cat-1',
        title: 'Men',
        slug: 'men',
        description: 'Fashion for men',
        imageUrl:
            'https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?auto=format&fit=crop&w=800&q=80',
      ),
      Category(
        id: 'mock-cat-2',
        title: 'Women',
        slug: 'women',
        description: 'Fashion for women',
        imageUrl:
            'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=800&q=80',
      ),
      Category(
        id: 'mock-cat-3',
        title: 'Accessories',
        slug: 'accessories',
        description: 'Complete your look',
        imageUrl:
            'https://images.unsplash.com/photo-1523293188086-b51292955d2c?auto=format&fit=crop&w=800&q=80',
      ),
    ];
  }
}
