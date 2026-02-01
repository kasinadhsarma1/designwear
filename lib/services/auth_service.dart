import 'package:flutter/foundation.dart';
import 'package:firebase_auth/firebase_auth.dart' as fb;

class User {
  final String? id;
  final String? phone;
  final String? email;
  final String? name;
  final bool isGuest;

  User({this.id, this.phone, this.email, this.name, this.isGuest = false});

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

  Future<void> signUpWithEmail(
    String email,
    String password,
    String name,
  ) async {
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

  String? _verificationId;

  Future<void> sendOtp(String phoneNumber) async {
    _isLoading = true;
    notifyListeners();
    try {
      await _auth.verifyPhoneNumber(
        phoneNumber: '+91$phoneNumber', // Assuming +91 for now as per UI
        verificationCompleted: (fb.PhoneAuthCredential credential) async {
          // Auto-resolution on Android
          await _auth.signInWithCredential(credential);
        },
        verificationFailed: (fb.FirebaseAuthException e) {
          _isLoading = false;
          notifyListeners();
          throw e;
        },
        codeSent: (String verificationId, int? resendToken) {
          _verificationId = verificationId;
          _isLoading = false;
          notifyListeners();
        },
        codeAutoRetrievalTimeout: (String verificationId) {
          _verificationId = verificationId;
        },
      );
    } catch (e) {
      _isLoading = false;
      notifyListeners();
      rethrow;
    }
  }

  Future<void> loginWithPhone(String otp) async {
    if (_verificationId == null) {
      // Should not happen if flow is correct, but safe guard
      throw Exception("Verification ID is missing. Please request OTP first.");
    }
    
    _isLoading = true;
    notifyListeners();
    try {
      final credential = fb.PhoneAuthProvider.credential(
        verificationId: _verificationId!,
        smsCode: otp,
      );
      await _auth.signInWithCredential(credential);
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
    if (email != null) await firebaseUser.verifyBeforeUpdateEmail(email);

    await _onAuthStateChanged(_auth.currentUser);
  }

  Future<void> logout() async {
    await _auth.signOut();
  }
}
