class Product {
  final String id;
  final String title;
  final String slug;
  final String description;
  final double price;
  final String? imageUrl;
  final String categoryId;
  final String stockStatus;

  Product({
    required this.id,
    required this.title,
    required this.slug,
    required this.description,
    required this.price,
    this.imageUrl,
    required this.categoryId,
    required this.stockStatus,
  });

  factory Product.fromMap(Map<String, dynamic> map) {
    return Product(
      id: map['_id'] ?? '',
      title: map['title'] ?? '',
      slug: map['slug']?['current'] ?? '',
      description: map['description'] ?? '',
      price: (map['price'] ?? 0).toDouble(),
      imageUrl: map['imageUrl'],
      categoryId: map['category']?['_ref'] ?? '',
      stockStatus: map['stock'] ?? 'inStock',
    );
  }

  /// Factory constructor for API response format (from Next.js API)
  factory Product.fromApiMap(Map<String, dynamic> map) {
    return Product(
      id: map['id'] ?? '',
      title: map['title'] ?? '',
      slug: map['slug'] ?? '',
      description: map['description'] ?? '',
      price: (map['price'] ?? 0).toDouble(),
      imageUrl: map['imageUrl'],
      categoryId: map['categoryId'] ?? '',
      stockStatus: map['stockStatus'] ?? 'inStock',
    );
  }

  /// Convert to JSON for API requests
  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'title': title,
      'slug': slug,
      'description': description,
      'price': price,
      'imageUrl': imageUrl,
      'categoryId': categoryId,
      'stockStatus': stockStatus,
    };
  }
}
