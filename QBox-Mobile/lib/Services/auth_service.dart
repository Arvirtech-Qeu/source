import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'dart:convert';

class AuthService {
  final _storage = const FlutterSecureStorage();

  Future<void> saveUser({
    required String email,
    required String password,
    required String fullName,
  }) async {
    final userData = {
      'email': email.toLowerCase(),
      'password': password,
      'fullName': fullName,
    };

    await _storage.write(
      key: 'user_${email.toLowerCase()}',
      value: json.encode(userData),
    );
  }

  Future<bool> login(String email, String password) async {
    final userStr = await _storage.read(key: 'user_${email.toLowerCase()}');

    if (userStr == null) return false;

    final userData = json.decode(userStr);
    return userData['password'] == password;
  }

}