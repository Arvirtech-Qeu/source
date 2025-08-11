// providers/delivery_provider.dart
import 'package:flutter/material.dart';
import 'package:flutter_barcode_scanner/flutter_barcode_scanner.dart';
// import 'package:flutter_barcode_scanner/flutter_barcode_scanner.dart' hide ScanMode;
import 'package:google_maps_flutter/google_maps_flutter.dart';
import 'package:qr_page/Widgets/Common/qr_scanner_screen.dart';

import '../Model/Data_Models/qbox_delivery_model/qbox_delivery_model.dart';
// import '../Widgets/Common/custom_barcode_scanner.dart';

class DeliveryProvider extends ChangeNotifier {
  List<QBoxItem> _scannedItems = [];
  String _lastScannedCode = '';

  // Delivery Status State
  List<DeliveryOrder> _activeDeliveries = [];

  // Customer Support State
  List<SupportTicket> _supportTickets = [];

  // Route Planning State
  List<DeliveryStop> _deliveryStops = [];
  Set<Marker> _markers = {};
  Set<Polyline> _polylines = {};

  // Loading and Error States
  bool _isLoading = false;
  String _error = '';

  // Getters
  List<QBoxItem> get scannedItems => _scannedItems;
  List<DeliveryOrder> get activeDeliveries => _activeDeliveries;
  List<SupportTicket> get supportTickets => _supportTickets;
  List<DeliveryStop> get deliveryStops => _deliveryStops;
  Set<Marker> get markers => _markers;
  Set<Polyline> get polylines => _polylines;
  bool get isLoading => _isLoading;
  String get error => _error;

  Future<void> scanQBox() async {
    try {
      _setLoading(true);
      _clearError();

      String barcodeScanResult = await FlutterBarcodeScanner.scanBarcode(
        '#ff6666',
        'Cancel',
        true,
        ScanMode.QR,
      );

      if (barcodeScanResult != '-1') {
        _lastScannedCode = barcodeScanResult;
        await _processScannedCode(barcodeScanResult);
      }
    } catch (e) {
      _setError('Failed to scan Qeu Box: ${e.toString()}');
    } finally {
      _setLoading(false);
    }
  }

  // Future<void> scanQBox(BuildContext context) async {
  //   try {
  //     _setLoading(true);
  //     _clearError();
  //
  //     // Using the common scanner instead of flutter_barcode_scanner
  //     String barcodeScanResult = await CommonBarcodeScanner.scanBarcodeWithContext(
  //       context,
  //       '#ff6666',
  //       'Cancel',
  //       true,
  //       ScanMode.QR,
  //     );
  //
  //     if (barcodeScanResult != '-1') {
  //       _lastScannedCode = barcodeScanResult;
  //       await _processScannedCode(barcodeScanResult);
  //     }
  //   } catch (e) {
  //     _setError('Failed to scan Qeu Box: ${e.toString()}');
  //   } finally {
  //     _setLoading(false);
  //   }
  // }

  // Future<void> scanQBox(BuildContext context) async { // Add BuildContext parameter
  //   try {
  //     _setLoading(true);
  //     _clearError();
  //
  //     // Navigate to the new scanner screen and wait for a result
  //     String barcodeScanResult = await Navigator.push(
  //       context, // Use the passed context
  //       MaterialPageRoute(builder: (context) => const QRScannerScreen()),
  //     ) ?? '-1'; // Default to '-1' if nothing is returned
  //
  //     if (barcodeScanResult != '-1') {
  //       _lastScannedCode = barcodeScanResult;
  //       await _processScannedCode(barcodeScanResult);
  //     } else {
  //       // Handle scan cancellation if needed
  //       _setError('Qeu Box scanning cancelled.');
  //     }
  //   } catch (e) {
  //     _setError('Failed to scan Qeu Box: ${e.toString()}');
  //   } finally {
  //     _setLoading(false);
  //   }
  // }

  Future<void> _processScannedCode(String code) async {
    try {
      // Simulate API call to verify QBox
      await Future.delayed(Duration(seconds: 1));
      final qboxItem = QBoxItem(
        id: code,
        name: 'Food Item',
        quantity: 2,
        status: 'Ready for Delivery',
        scannedAt: DateTime.now(),
      );

      _scannedItems.add(qboxItem);
      notifyListeners();
    } catch (e) {
      _setError('Failed to process Qeu Box: ${e.toString()}');
    }
  }

  // Delivery Status Methods
  Future<void> updateDeliveryStatus(String orderId, DeliveryStatus newStatus) async {
    try {
      _setLoading(true);
      await Future.delayed(Duration(seconds: 1)); // Simulate API call

      final index = _activeDeliveries.indexWhere((d) => d.orderId == orderId);
      if (index != -1) {
        _activeDeliveries[index] = _activeDeliveries[index].copyWith(status: newStatus);
        notifyListeners();
      }
    } catch (e) {
      _setError('Failed to update delivery status: ${e.toString()}');
    } finally {
      _setLoading(false);
    }
  }

  Future<void> loadActiveDeliveries() async {
    try {
      _setLoading(true);
      // Simulate API call
      await Future.delayed(Duration(seconds: 1));
      _activeDeliveries = [
        DeliveryOrder(
          orderId: '#1234',
          customerName: 'John Doe',
          address: '123 Main St',
          items: ['Biriyani x2'],
          status: DeliveryStatus.readyForPickup,
        ),
        DeliveryOrder(
          orderId: '#1235',
          customerName: 'Jane Smith',
          address: '456 Oak Ave',
          items: ['Biriyani x1'],
          status: DeliveryStatus.inTransit,
        ),
      ];
      notifyListeners();
    } catch (e) {
      _setError('Failed to load deliveries: ${e.toString()}');
    } finally {
      _setLoading(false);
    }
  }

  // Customer Support Methods
  Future<void> loadSupportTickets() async {
    try {
      _setLoading(true);
      // Simulate API call
      await Future.delayed(Duration(seconds: 1));
      _supportTickets = [
        SupportTicket(
          id: 'T1234',
          customerName: 'John Doe',
          orderId: '#1234',
          issue: 'Delayed Delivery',
          priority: 'High',
          status: 'Open',
        ),
        SupportTicket(
          id: 'T1235',
          customerName: 'Jane Smith',
          orderId: '#1235',
          issue: 'Wrong Items',
          priority: 'Medium',
          status: 'In Progress',
        ),
      ];
      notifyListeners();
    } catch (e) {
      _setError('Failed to load support tickets: ${e.toString()}');
    } finally {
      _setLoading(false);
    }
  }

  Future<void> createSupportTicket(SupportTicket ticket) async {
    try {
      _setLoading(true);
      // Simulate API call
      await Future.delayed(Duration(seconds: 1));
      _supportTickets.add(ticket);
      notifyListeners();
    } catch (e) {
      _setError('Failed to create support ticket: ${e.toString()}');
    } finally {
      _setLoading(false);
    }
  }

  // Route Planning Methods
  Future<void> loadDeliveryRoute() async {
    try {
      _setLoading(true);
      // Simulate API call
      await Future.delayed(Duration(seconds: 1));

      // Load delivery stops
      _deliveryStops = [
        DeliveryStop(
          orderId: '#1234',
          location: LatLng(37.7749, -122.4194),
          address: '123 Main St',
          expectedTime: '12:30 PM',
        ),
        DeliveryStop(
          orderId: '#1235',
          location: LatLng(37.7848, -122.4294),
          address: '456 Oak Ave',
          expectedTime: '1:15 PM',
        ),
      ];

      // Create markers
      _markers = _deliveryStops.map((stop) => Marker(
        markerId: MarkerId(stop.orderId),
        position: stop.location,
        infoWindow: InfoWindow(
          title: stop.orderId,
          snippet: stop.address,
        ),
      )).toSet();

      // Create route polyline
      _polylines = {
        Polyline(
          polylineId: PolylineId('route1'),
          points: _deliveryStops.map((stop) => stop.location).toList(),
          color: Colors.blue,
          width: 3,
        ),
      };

      notifyListeners();
    } catch (e) {
      _setError('Failed to load delivery route: ${e.toString()}');
    } finally {
      _setLoading(false);
    }
  }

  // Helper Methods
  void _setLoading(bool value) {
    _isLoading = value;
    notifyListeners();
  }

  void _setError(String message) {
    _error = message;
    notifyListeners();
  }

  void _clearError() {
    _error = '';
    notifyListeners();
  }
}