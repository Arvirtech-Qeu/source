import 'dart:async';
import 'package:flutter/material.dart';
import 'package:flutter_barcode_scanner/flutter_barcode_scanner.dart';
// import 'package:flutter_barcode_scanner/flutter_barcode_scanner.dart' hide ScanMode, FlutterBarcodeScanner;
import 'package:qr_page/Widgets/Common/qr_scanner_screen.dart';
import '../../../Services/api_service.dart';
import '../../../Services/toast_service.dart';
import '../Widgets/Common/rejection_dialog.dart';

class OrderScanningProvider extends ChangeNotifier {
  ApiService apiService = ApiService();
  CommonService commonService = CommonService();
  String _scanBarcode = 'Unknown';
  final String _scanSalesBarcode = 'Unknown';
  Map<String, dynamic> value = {};
  Map<String, dynamic> returnValue = {};
  bool isDisable = true;
  Timer? _debounce;
  List<Map<String, dynamic>> _orders = [];

  String get scanBarcode => _scanBarcode;
  String get scanSalesBarcode => _scanSalesBarcode;

  Map<String, dynamic>? get orderDetails => value['purchaseOrder'];
  List<dynamic>? get orderItems => value['purchaseOrderDtls'];
  List<Map<String, dynamic>> get orders => _orders;

  Map<String, dynamic>? get salesOrderDetails => returnValue['salesOrder'];
  List<dynamic>? get salesOrderItems => returnValue['salesOrderDtls'];
  List<Map<String, dynamic>> get acceptedOrders =>
      _orders.where((order) => order['wfStageCd'] == 9).toList();
  List<Map<String, dynamic>> get rejectedOrders =>
      _orders.where((order) => order['wfStageCd'] == 8).toList();

  Future<void> scanQR(BuildContext context) async {
    String barcodeScanRes;
    try {
      barcodeScanRes = await FlutterBarcodeScanner.scanBarcode(
          '#ff6666', 'Cancel', true, ScanMode.QR);
      _scanBarcode = barcodeScanRes;
      print("QR code scanned: $_scanBarcode");
      notifyListeners();
      if (barcodeScanRes != '-1') {
        await get(barcodeScanRes);
        print("After get() call, value: $value");
        if (await _isValidOrder(barcodeScanRes)) {
          print("Order is valid, showing action dialog");
          _showOrderActionDialog(context, barcodeScanRes);
        } else {
          print("Invalid order");
          commonService.errorToast('Invalid order');
        }
      } else {
        print("Scanning cancelled");
        commonService.errorToast('Scanning cancelled');
      }
    } catch (e) {
      print("Error scanning QR code: $e");
      _scanBarcode = 'Failed to get platform version.';
      notifyListeners();
      _showErrorDialog(context);
    }
  }

  // Future<void> scanQR(BuildContext context) async {
  //   String barcodeScanRes;
  //   try {
  //     // Using the common scanner instead of flutter_barcode_scanner
  //     barcodeScanRes = await CommonBarcodeScanner.scanBarcodeWithContext(
  //         context,
  //         '#ff6666',
  //         'Cancel',
  //         true,
  //         ScanMode.QR
  //     );
  //
  //     _scanBarcode = barcodeScanRes;
  //     print("QR code scanned: $_scanBarcode");
  //     notifyListeners();
  //
  //     if (barcodeScanRes != '-1') {
  //       await get(barcodeScanRes);
  //       print("After get() call, value: $value");
  //       if (await _isValidOrder(barcodeScanRes)) {
  //         print("Order is valid, showing action dialog");
  //         _showOrderActionDialog(context, barcodeScanRes);
  //       } else {
  //         print("Invalid order");
  //         commonService.errorToast('Invalid order');
  //       }
  //     } else {
  //       print("Scanning cancelled");
  //       commonService.errorToast('Scanning cancelled');
  //     }
  //   } catch (e) {
  //     print("Error scanning QR code: $e");
  //     _scanBarcode = 'Failed to get platform version.';
  //     notifyListeners();
  //     _showErrorDialog(context);
  //   }
  // }

  // Future<void> scanQR(BuildContext context) async {
  //   String barcodeScanRes;
  //   try {
  //     // Navigate to the new scanner screen and wait for a result
  //     barcodeScanRes = await Navigator.push(
  //       context,
  //       MaterialPageRoute(builder: (context) => const QRScannerScreen()),
  //     ) ?? '-1'; // Default to '-1' if nothing is returned (e.g., back button)
  //
  //     _scanBarcode = barcodeScanRes;
  //     print("QR code scanned: $_scanBarcode");
  //     notifyListeners();
  //
  //     if (barcodeScanRes != '-1') {
  //       await get(barcodeScanRes);
  //       print("After get() call, value: $value");
  //       if (await _isValidOrder(barcodeScanRes)) {
  //         print("Order is valid, showing action dialog");
  //         _showOrderActionDialog(context, barcodeScanRes);
  //       } else {
  //         print("Invalid order");
  //         commonService.errorToast('Invalid order');
  //       }
  //     } else {
  //       print("Scanning cancelled");
  //       commonService.errorToast('Scanning cancelled');
  //     }
  //   } catch (e) {
  //     print("Error scanning QR code: $e");
  //     _scanBarcode = 'Failed to get platform version.';
  //     notifyListeners();
  //     _showErrorDialog(context);
  //   }
  // }

  Future<bool> _isValidOrder(String orderId) async {
    print("Checking if order is valid: $orderId");
    print("Current value: $value");
    if (value['purchaseOrder'] != null &&
        value['purchaseOrderDtls'] != null &&
        (value['purchaseOrder']['wfStageCd'] == 7)) {
      print("Order is valid");
      return true;
    }
    print("Order is invalid");
    return false;
  }

  void _showOrderActionDialog(BuildContext context, String orderId) {
    print("Showing order action dialog for order: $orderId");
    showDialog(
      barrierDismissible: false,
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
          title: Text('Order Action'),
          content: Text('Do you want to accept or reject this order?'),
          actions: [
            TextButton(
              child: Text('Accept'),
              onPressed: () {
                Navigator.of(context).pop();
                _acceptOrder(context, orderId);
              },
            ),
            TextButton(
              child: Text('Reject'),
              onPressed: () {
                Navigator.of(context).pop();
                _showRejectionDialog(context, orderId);
              },
            ),
          ],
        );
      },
    );
  }

  void _showRejectionDialog(BuildContext context, String orderId) {
    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (context) => RejectionDialog(
        onSubmit: (reason, photos) {
          _rejectOrder(context, orderId, reason, photos);
        },
      ),
    );
  }

  void _showErrorDialog(BuildContext context) {
    showDialog(
      barrierDismissible: false,
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
          title: const Text('Error'),
          content: const Text('Failed to scan QR code. Please try again.'),
          actions: [
            TextButton(
              onPressed: () => Navigator.of(context).pop(),
              child: const Text('OK'),
            ),
          ],
        );
      },
    );
  }

  void _rejectOrder(BuildContext context, String orderId, String reason,
      List<String> photos) {
    if (value['purchaseOrder'] != null && value['purchaseOrderDtls'] != null) {
      for (var item in value['purchaseOrderDtls']) {
        item['wfStageCd'] = 8;
        _orders.add(item);
      }
      notifyListeners();
      value = {};
    } else {
      commonService.errorToast('No order details available');
    }
  }

  void _acceptOrder(BuildContext context, String orderId) {
    if (value['purchaseOrder'] != null && value['purchaseOrderDtls'] != null) {
      for (var item in value['purchaseOrderDtls']) {
        item['wfStageCd'] = 9;
        _orders.add(item);
      }
      notifyListeners();
      value = {};
    } else {
      commonService.errorToast('No order details available');
    }
  }

  void onChangeValidate(String text) {
    if (_debounce?.isActive ?? false) _debounce!.cancel();
    _debounce = Timer(const Duration(milliseconds: 500), () {
      isDisable = text.isEmpty;
      notifyListeners();
    });
  }

  Future<void> get(String orderId) async {
    // Map<String, dynamic> params = {"partnerPurchaseOrderId": orderId.isNotEmpty ? orderId : _scanSalesBarcode};
    Map<String, dynamic> params = {
      "partnerPurchaseOrderId":
          (orderId.isNotEmpty ? orderId : _scanSalesBarcode).trim()
    };
    print("Calling API with params: $params");
    var result = await apiService.post(
        "8912", "masters", "partner_channel_inward_delivery", params);
    print("API result: $result");
    if (result != null && result['data'] != null) {
      value = result['data'];
      print('Order data: $value');
      if (value['purchaseOrderDtls'] != null) {
        commonService.presentToast('Order details retrieved successfully');
      } else {
        commonService.errorToast('No order details found');
      }
    } else {
      commonService.errorToast('Failed to retrieve order details');
    }

    _scanBarcode = "";
    notifyListeners();
  }
}
