import 'package:flutter/foundation.dart';
import 'package:shared_preferences/shared_preferences.dart';

class User {
  final String? id;
  final String? phone;
  final String? email;
  final String? name;
  final bool isGuest;

  User({
    this.id,
    this.phone,
    this.email,
    this.name,
    this.isGuest = false,
  });

  bool get isLoggedIn => id != null || phone != null;
}

class AuthService extends ChangeNotifier {
  User? _currentUser;
  bool _isLoading = false;

  User? get currentUser => _currentUser;
  bool get isLoggedIn => _currentUser?.isLoggedIn ?? false;
  bool get isLoading => _isLoading;

  Future<void> init() async {
    final prefs = await SharedPreferences.getInstance();
    final userId = prefs.getString('user_id');
    final phone = prefs.getString('user_phone');
    final name = prefs.getString('user_name');
    final email = prefs.getString('user_email');

    if (userId != null || phone != null) {
      _currentUser = User(
        id: userId,
        phone: phone,
        name: name,
        email: email,
      );
      notifyListeners();
    }
  }

  Future<void> loginWithPhone(String phone, String otp) async {
    _isLoading = true;
    notifyListeners();

    try {
      // In a real app, verify OTP with GoKwik API
      await Future.delayed(const Duration(seconds: 1)); // Simulated delay

      _currentUser = User(
        id: DateTime.now().millisecondsSinceEpoch.toString(),
        phone: phone,
      );

      // Save to preferences
      final prefs = await SharedPreferences.getInstance();
      await prefs.setString('user_id', _currentUser!.id!);
      await prefs.setString('user_phone', phone);

      notifyListeners();
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> loginAsGuest() async {
    _currentUser = User(
      id: 'guest_${DateTime.now().millisecondsSinceEpoch}',
      isGuest: true,
    );
    notifyListeners();
  }

  Future<void> updateProfile({String? name, String? email}) async {
    if (_currentUser == null) return;

    _currentUser = User(
      id: _currentUser!.id,
      phone: _currentUser!.phone,
      name: name ?? _currentUser!.name,
      email: email ?? _currentUser!.email,
      isGuest: _currentUser!.isGuest,
    );

    final prefs = await SharedPreferences.getInstance();
    if (name != null) await prefs.setString('user_name', name);
    if (email != null) await prefs.setString('user_email', email);

    notifyListeners();
  }

  Future<void> logout() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove('user_id');
    await prefs.remove('user_phone');
    await prefs.remove('user_name');
    await prefs.remove('user_email');

    _currentUser = null;
    notifyListeners();
  }
}
