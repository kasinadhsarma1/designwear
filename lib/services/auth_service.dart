import 'package:flutter/foundation.dart';
import 'package:firebase_auth/firebase_auth.dart' as fb;

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

  bool get isLoggedIn => id != null;
}

class AuthService extends ChangeNotifier {
  final fb.FirebaseAuth _auth = fb.FirebaseAuth.instance;
  User? _currentUser;
  bool _isLoading = false;

  User? get currentUser => _currentUser;
  bool get isLoggedIn => _currentUser?.isLoggedIn ?? false;
  bool get isLoading => _isLoading;

  AuthService() {
    _auth.authStateChanges().listen(_onAuthStateChanged);
  }

  void init() {
    // Initialized in constructor listener
  }

  Future<void> _onAuthStateChanged(fb.User? firebaseUser) async {
    if (firebaseUser == null) {
      _currentUser = null;
    } else {
      _currentUser = User(
        id: firebaseUser.uid,
        email: firebaseUser.email,
        name: firebaseUser.displayName,
        phone: firebaseUser.phoneNumber,
      );
    }
    notifyListeners();
  }

  Future<void> signInWithEmail(String email, String password) async {
    _isLoading = true;
    notifyListeners();
    try {
      await _auth.signInWithEmailAndPassword(email: email, password: password);
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> signUpWithEmail(String email, String password, String name) async {
    _isLoading = true;
    notifyListeners();
    try {
      fb.UserCredential result = await _auth.createUserWithEmailAndPassword(
        email: email,
        password: password,
      );
      await result.user?.updateDisplayName(name);
      await _onAuthStateChanged(result.user);
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> loginWithPhone(String phone, String otp) async {
    // Note: Phone auth requires a different flow (verifyPhoneNumber)
    // For now, keeping as a placeholder or implementing if needed
    _isLoading = true;
    notifyListeners();
    try {
      // Logic for phone auth would go here
      // For simplicity in this step, focusing on email/password
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> loginAsGuest() async {
    _isLoading = true;
    notifyListeners();
    try {
      await _auth.signInAnonymously();
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> updateProfile({String? name, String? email}) async {
    final firebaseUser = _auth.currentUser;
    if (firebaseUser == null) return;

    if (name != null) await firebaseUser.updateDisplayName(name);
    if (email != null) await firebaseUser.updateEmail(email);

    await _onAuthStateChanged(_auth.currentUser);
  }

  Future<void> logout() async {
    await _auth.signOut();
  }
}
