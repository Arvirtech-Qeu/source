import 'dart:async';
import 'package:connectivity_plus/connectivity_plus.dart';
import 'package:flutter/material.dart';

class NetworkProvider extends ChangeNotifier {
  bool _isOnline = true; // Initial state

  bool get isOnline => _isOnline;

  NetworkProvider() {
    _initializeNetworkListener();
  }

  void _initializeNetworkListener() {
    Connectivity().onConnectivityChanged.listen((ConnectivityResult result) {
      _isOnline = result != ConnectivityResult.none;
      notifyListeners(); // Notify UI of changes
    });
  }

  Future<void> checkInitialConnection() async {
    final result = await Connectivity().checkConnectivity();
    _isOnline = result != ConnectivityResult.none;
    notifyListeners(); // Notify UI of changes
  }
}
