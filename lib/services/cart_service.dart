import 'package:flutter/foundation.dart';
import '../models/cart.dart';
import '../models/product.dart';

class CartService extends ChangeNotifier {
  final Cart _cart = Cart();

  Cart get cart => _cart;

  int get itemCount => _cart.itemCount;

  double get subtotal => _cart.subtotal;

  double get tax => _cart.tax;

  double get total => _cart.total;

  List<CartItem> get items => _cart.items;

  bool get isEmpty => _cart.isEmpty;

  bool get isNotEmpty => _cart.isNotEmpty;

  void addToCart(Product product, {int quantity = 1, String? size}) {
    _cart.addItem(product, quantity: quantity, size: size);
    notifyListeners();
  }

  void removeFromCart(String productId, {String? size}) {
    _cart.removeItem(productId, size: size);
    notifyListeners();
  }

  void updateQuantity(String productId, int quantity, {String? size}) {
    _cart.updateQuantity(productId, quantity, size: size);
    notifyListeners();
  }

  void incrementQuantity(String productId, {String? size}) {
    final item = _cart.items.firstWhere(
      (item) => item.product.id == productId && item.selectedSize == size,
      orElse: () => throw Exception('Item not found'),
    );
    updateQuantity(productId, item.quantity + 1, size: size);
  }

  void decrementQuantity(String productId, {String? size}) {
    final item = _cart.items.firstWhere(
      (item) => item.product.id == productId && item.selectedSize == size,
      orElse: () => throw Exception('Item not found'),
    );
    if (item.quantity > 1) {
      updateQuantity(productId, item.quantity - 1, size: size);
    } else {
      removeFromCart(productId, size: size);
    }
  }

  void clearCart() {
    _cart.clear();
    notifyListeners();
  }
}
