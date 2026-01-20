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
    const query = '*[_type == "product"]{_id, title, slug, description, price, "imageUrl": image.asset->url, category, stock}';
    final List<dynamic> result = await client.fetch(query);
    return result.map((item) => Product.fromMap(item)).toList();
  }

  Future<List<Category>> fetchCategories() async {
    const query = '*[_type == "category"]{_id, title, slug, description, "imageUrl": image.asset->url}';
    final List<dynamic> result = await client.fetch(query);
    return result.map((item) => Category.fromMap(item)).toList();
  }

  Future<List<Product>> fetchProductsByCategory(String categoryId) async {
    final query = '*[_type == "product" && category._ref == "$categoryId"]{_id, title, slug, description, price, "imageUrl": image.asset->url, category, stock}';
    final List<dynamic> result = await client.fetch(query);
    return result.map((item) => Product.fromMap(item)).toList();
  }
}
