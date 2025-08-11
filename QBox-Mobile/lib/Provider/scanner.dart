import 'dart:typed_data'; // Correct import for Uint8List
import 'package:flutter_barcode_scanner/flutter_barcode_scanner.dart';
import 'package:flutter_serial_communication/flutter_serial_communication.dart';
import 'dart:async';
import 'package:flutter/services.dart';
import 'package:flutter/material.dart';
import 'package:flutter_serial_communication/models/device_info.dart';
import 'package:go_router/go_router.dart';
// import 'package:qr_code_scanner/qr_code_scanner.dart';

import 'package:qr_page/Widgets/Common/qr_scanner_screen.dart';
// import 'package:flutter_barcode_scanner/flutter_barcode_scanner.dart' hide ScanMode;

import '../Services/api_service.dart';
import '../Services/toast_service.dart';
import '../Services/token_service.dart';

class ScannerProvider extends ChangeNotifier {
  ApiService apiService = ApiService();
  CommonService commonService = CommonService();
  TokenService? tokenStorage = TokenService();
  String _scanBarcode = 'Unknown';
  String _scanSalesBarcode = 'Unknown';

  Map<String, dynamic> _value = {};
  Map<String, dynamic> _returnValue = {};
  Map<String, dynamic> _returnSalValue = {};
  List<dynamic> _returnSalesList = [];
  List<dynamic> _returnPurchaseList = [];
  bool _scanData = false;
  bool _isShow = false;
  bool _isSalesShow = false;
  // Barcode? _result;
  bool isDisable = true;
  Timer? _debounce;

  // Getters
  String get scanBarcode => _scanBarcode;
  String get scanSalesBarcode => _scanSalesBarcode;
  Map<String, dynamic> get value => _value;
  Map<String, dynamic> get returnValue => _returnValue;
  Map<String, dynamic> get returnSalValue => _returnSalValue;
  List<dynamic> get returnSalesList => _returnSalesList;
  List<dynamic> get returnPurchaseList => _returnPurchaseList;
  bool get scanData => _scanData;
  bool get isShow => _isShow;
  bool get isSalesShow => _isSalesShow;
  // Barcode? get result => _result;

  Map<String, dynamic>? get purchaseOrderDetails => value['purchaseOrder'];
  List<dynamic>? get purchaseOrderItems => value['purchaseOrderDtls'];

  Map<String, dynamic>? get salesOrderDetails => returnValue['salesOrder'];
  List<dynamic>? get salesOrderItems => returnValue['salesOrderDtls'];
  final _flutterSerialCommunicationPlugin = FlutterSerialCommunication();
  bool isConnected = false;
  String messageStatus = "";
  final TextEditingController _scanController = TextEditingController();
  final FocusNode _scanFocusNode = FocusNode();
  String _scannedData = "No data scanned yet.";
  Timer? _scanTimer;

  // void onQRViewCreated(QRViewController controller) {
  //   controller.scannedDataStream.listen((scanData) {
  //     _result = scanData;
  //     notifyListeners();
  //   });
  // }

  // void startScan(BuildContext context) {
  //   _scanController.clear();
  //   _scannedData = "Scanning...";
  //   FocusScope.of(context).requestFocus(_scanFocusNode);
  //   notifyListeners();
  // }

  void change() {
    _isShow = !_isShow;
    notifyListeners();
  }

  void salesChange() {
    _isSalesShow = !_isSalesShow;
    notifyListeners();
  }

  Future<void> getPurchaseId() async {
    Map<String, dynamic> params = {};
    print('params$params');
    var result = await apiService.post(
        "8912", "masters", "search_purchase_order", params);
    if (result != null && result['data'] != null) {
      _returnPurchaseList = result['data'];
      print('_returnPurchaseList$_returnPurchaseList');
      await getPurchase(returnPurchaseList[0]['partnerPurchaseOrderId']);
    } else {
      _returnPurchaseList = [];
    }
    notifyListeners();
  }

  Future<void> logout(BuildContext context) async {
    tokenStorage?.signOut();
    GoRouter.of(context).goNamed('login');
  }

  Future<void> scanSalesQR(BuildContext context) async {
    String barcodeScanRes;
    try {
      barcodeScanRes = await FlutterBarcodeScanner.scanBarcode(
          '#ff6666', 'Cancel', true, ScanMode.QR);
      _scanSalesBarcode = barcodeScanRes;
      notifyListeners();
      await getOutwardDelivery(_scanSalesBarcode, context);
    } catch (e) {
      _scanSalesBarcode = 'Failed to get platform version.';
      notifyListeners();
    }
  }

  // Future<void> scanSalesQR(BuildContext context) async {
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
  //     _scanSalesBarcode = barcodeScanRes;
  //     notifyListeners();
  //
  //     if (barcodeScanRes != '-1') {
  //       await getOutwardDelivery(_scanSalesBarcode, context);
  //     }
  //   } catch (e) {
  //     _scanSalesBarcode = 'Failed to get platform version.';
  //     notifyListeners();
  //   }
  // }

  // Future<void> scanSalesQR(BuildContext context) async {
  //   String barcodeScanRes;
  //   try {
  //     // Navigate to the new scanner screen and wait for a result
  //     barcodeScanRes = await Navigator.push(
  //       context,
  //       MaterialPageRoute(builder: (context) => const QRScannerScreen()),
  //     ) ?? '-1'; // Default to '-1' if nothing is returned
  //
  //     _scanSalesBarcode = barcodeScanRes;
  //     notifyListeners();
  //
  //     if (barcodeScanRes != '-1') {
  //       await getOutwardDelivery(_scanSalesBarcode, context);
  //     } else {
  //       print("Sales QR scanning cancelled");
  //       // You might want to add a toast or specific handling for cancellation here
  //     }
  //   } catch (e) {
  //     print("Error scanning Sales QR code: $e");
  //     _scanSalesBarcode = 'Failed to get platform version.';
  //     notifyListeners();
  //     // Consider adding an error toast or dialog here as well
  //   }
  // }

  Future<void> get(String orderId) async {
    Map<String, dynamic> params = {
      "partnerPurchaseOrderId": orderId.isNotEmpty ? orderId : _scanSalesBarcode
    };
    var result = await apiService.post(
        "8912", "masters", "partner_channel_inward_delivery", params);
    if (result != null && result['data'] != null) {
      _value = result['data'];
      print('value$_value');
      if (value['purchaseOrderDtls'] != null) {
        commonService.presentToast('Order is Delivered');
      } else {
        commonService.presentToast('Invalid Order');
      }
    }

    _scanBarcode = "";
    notifyListeners();
  }

  Future<void> getSalesId() async {
    Map<String, dynamic> params = {};
    var result =
        await apiService.post("8912", "masters", "search_sales_order", params);
    if (result != null && result['data'] != null) {
      _returnSalesList = result['data'];
      print('_returnSalesList$_returnSalesList');
      await getSales(returnSalesList[0]['partnerSalesOrderId']);
    } else {
      _returnSalesList = [];
    }
    notifyListeners();
  }

  Future<void> getPurchase(String newValue) async {
    if (_returnPurchaseList.isNotEmpty) {
      Map<String, dynamic> params = {"partnerPurchaseOrderId": newValue ?? ''};
      var result = await apiService.post(
          "8912", "masters", "partner_channel_inward_delivery_list", params);
      if (result != null && result['data'] != null) {
        _value = result['data'];
        print('_value$_value');
      } else {
        print('Error: result or result["data"] is null');
      }
      notifyListeners();
    }
  }

  Future<void> getSales(String newValue) async {
    if (_returnSalesList.isNotEmpty) {
      Map<String, dynamic> params = {"partnerSalesOrderId": newValue ?? ''};
      print('params$params');
      var result = await apiService.post(
          "8912", "masters", "partner_channel_outward_delivery_list", params);
      if (result != null && result['data'] != null) {
        _returnValue = result['data'];
        print('_returnValue$_returnValue');
      } else {
        print('Error: result or result["data"] is null');
      }
      notifyListeners();
    }
  }

  // Future<void> getOutwardDelivery(String outwardOrderId) async {
  //   Map<String, dynamic> params = {"partnerSalesOrderId": outwardOrderId.trim()};
  //   print('getOutwardDelivery $params');
  //
  //   var result = await apiService.post(
  //       "8912", "masters", "partner_channel_outward_delivery", params);
  //   print(result);
  //
  //   if (result != null && result['data'] != null) {
  //     print('getOutwardDelivery result $result');
  //     _returnSalValue = result['data'];
  //
  //     print('returnValue${_returnSalValue['salesOrderDtls']}');
  //
  //     final salesOrderDtls = _returnSalValue['salesOrderDtls'];
  //     if (salesOrderDtls != null && salesOrderDtls is List && salesOrderDtls.isNotEmpty) {
  //       for (var i = 0; i < salesOrderDtls.length; i++) {
  //         final skuInventory = salesOrderDtls[i]['skuInventory'];
  //         print('skuInventory for item $i: $skuInventory');
  //
  //         if (skuInventory != null && skuInventory is List && skuInventory.isNotEmpty) {
  //           for (var item in skuInventory) {
  //             if (item['open'] == true) { // Check if 'open' is true
  //               String hexCode = item['openHex'];
  //               print('openHex found for item $i: $hexCode');
  //               print('Processing hexCode: $hexCode');
  //               await sendHexCode(hexCode);
  //               // Simulate a delay (if needed)
  //               await Future.delayed(Duration(seconds: 1));
  //             } else {
  //               print('openHex not processed because open is false for item $i');
  //             }
  //           }
  //         } else {
  //           print('No skuInventory found for item $i');
  //         }
  //       }
  //       commonService.presentToast('Order is Pick-up');
  //     } else {
  //       commonService.presentToast('Not Loaded');
  //     }
  //   } else {
  //     commonService.presentToast('Invalid Pick-up');
  //   }
  //
  //   _scanSalesBarcode = "";
  //   notifyListeners(); // Ensure this is called to update the UI
  // }

  Future<bool> getOutwardDelivery(
      String outwardOrderId, BuildContext context) async {
    Map<String, dynamic> params = {
      "partnerSalesOrderId": outwardOrderId.trim()
    };
    print('getOutwardDelivery $params');

    var result = await apiService.post(
        "8912", "masters", "partner_channel_outward_delivery", params);
    print(result);

    bool shouldNavigate =
        false; // Flag to determine if navigation should happen

    if (result != null && result['data'] != null) {
      print('getOutwardDelivery result $result');
      _returnSalValue = result['data'];

      print('returnValue${_returnSalValue['salesOrderDtls']}');

      final salesOrderDtls = _returnSalValue['salesOrderDtls'];

      for (var i = 0; i < salesOrderDtls.length; i++) {
        if (salesOrderDtls != null &&
            salesOrderDtls is List &&
            salesOrderDtls.isNotEmpty &&
            salesOrderDtls[i]['skuInventory'].isNotEmpty) {
          final skuInventory = salesOrderDtls[i]['skuInventory'];
          print('skuInventory for item $i: $skuInventory');

          if (skuInventory != null &&
              skuInventory is List &&
              skuInventory.isNotEmpty) {
            for (var item in skuInventory) {
              if (item['open'] == true) {
                // Check if 'open' is true
                String hexCode = item['openHex'];
                print('openHex found for item $i: $hexCode');
                print('Processing hexCode: $hexCode');
                await sendHexCode(hexCode);
                await Future.delayed(Duration(seconds: 1));
              } else {
                print(
                    'openHex not processed because open is false for item $i');
              }
            }
            if (skuInventory.length < salesOrderDtls[i]['orderQuantity']) {
              print('Partial Order Pickup');
              shouldNavigate = true;
              commonService.presentToast('Partial Order Pickup');
            } else {
              shouldNavigate = true;
              for (var item in skuInventory) {
                if (item['open'] == true) {
                  commonService.presentToast('Order is Pick-up');
                } else {
                  commonService.presentToast('Order is Already Pick-up');
                }
              }
            }
          } else {
            print('No skuInventory found for item $i');
            commonService.presentToast('Sku Not Loaded In Qeubox');
          }
        } else {
          showFoodNotLoadedDialog(
            context,
          );
          commonService.presentToast('Sku Not Loaded In Qeubox');
        }
      }
    } else {
      commonService.presentToast('Invalid Pick-up');
    }

    _scanSalesBarcode = "";
    notifyListeners(); // Ensure this is called to update the UI
    return shouldNavigate; // Return whether navigation should happen
  }

  Future<void> sendHexCode(String hexCode) async {
    List<int> messageBytes = hexStringToBytes(hexCode);
    print('messageBytes$messageBytes');

    List<String> hexStrings = toHexStrings(messageBytes);
    print('messageBytes in hex: $hexStrings');

    List<DeviceInfo> connectedDevices =
        await _flutterSerialCommunicationPlugin.getAvailableDevices();
    print('connectedDevices$connectedDevices');

    if (connectedDevices.isNotEmpty) {
      print('connectedDevices[0]${connectedDevices[0]}');
      bool isConnectionSuccess = await _flutterSerialCommunicationPlugin
          .connect(connectedDevices[0], 9600);
      print('isConnectionSuccess$isConnectionSuccess');

      if (isConnectionSuccess) {
        bool isMessageSent = await _flutterSerialCommunicationPlugin
            .write(Uint8List.fromList(messageBytes));
        debugPrint("Is Message Sent: $isMessageSent");

        messageStatus = isMessageSent
            ? "Message Sent Successfully"
            : "Message Sending Failed";
        isConnected = isConnectionSuccess;

        await _flutterSerialCommunicationPlugin.disconnect();
      } else {
        messageStatus = "Connection Failed";
        await _flutterSerialCommunicationPlugin.disconnect();
      }
      notifyListeners();
    } else {
      messageStatus = "No Connected Devices";
    }
    notifyListeners();
  }

  // void _showErrorDialog(BuildContext context, String message) {
  //   showDialog(
  //     context: context,
  //     builder: (BuildContext context) {
  //       return AlertDialog(
  //         title: const Text('Error'),
  //         content: Text(message),
  //         actions: [
  //           TextButton(
  //             onPressed: () {
  //               Navigator.of(context).pop(); // Close the dialog
  //             },
  //             child: const Text('OK'),
  //           ),
  //         ],
  //       );
  //     },
  //   );
  // }

  void showFoodNotLoadedDialog(
    BuildContext context, {
    String? customMessage,
    VoidCallback? onRetry,
    VoidCallback? onCancel,
    bool showRetryButton = true,
  }) {
    showGeneralDialog(
      context: context,
      barrierDismissible: true,
      barrierLabel: MaterialLocalizations.of(context).modalBarrierDismissLabel,
      barrierColor: Colors.black.withOpacity(0.7),
      transitionDuration: const Duration(milliseconds: 500),
      transitionBuilder: (context, animation, secondaryAnimation, child) {
        return ScaleTransition(
          scale: Tween<double>(
            begin: 0.7,
            end: 1.0,
          ).animate(CurvedAnimation(
            parent: animation,
            curve: Curves.elasticOut,
          )),
          child: FadeTransition(
            opacity: animation,
            child: child,
          ),
        );
      },
      pageBuilder: (context, animation, secondaryAnimation) {
        return Center(
          child: Material(
            type: MaterialType.transparency,
            child: Container(
              margin: const EdgeInsets.symmetric(horizontal: 24),
              constraints: const BoxConstraints(maxWidth: 340),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(24),
                boxShadow: [
                  BoxShadow(
                    color: Colors.black.withOpacity(0.15),
                    blurRadius: 30,
                    offset: const Offset(0, 15),
                    spreadRadius: 0,
                  ),
                ],
              ),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  // Top colored section with illustration
                  Container(
                    width: double.infinity,
                    padding: const EdgeInsets.fromLTRB(24, 32, 24, 20),
                    decoration: const BoxDecoration(
                      gradient: LinearGradient(
                        begin: Alignment.topLeft,
                        end: Alignment.bottomRight,
                        colors: [
                          Color(0xFFFF6B6B),
                          Color(0xFFFF8E8E),
                        ],
                      ),
                      borderRadius: BorderRadius.only(
                        topLeft: Radius.circular(24),
                        topRight: Radius.circular(24),
                      ),
                    ),
                    child: Column(
                      children: [
                        // Animated food illustration
                        TweenAnimationBuilder<double>(
                          duration: const Duration(milliseconds: 800),
                          tween: Tween(begin: 0.0, end: 1.0),
                          builder: (context, value, child) {
                            return Transform.scale(
                              scale: 0.8 + (0.2 * value),
                              child: Container(
                                width: 100,
                                height: 100,
                                decoration: BoxDecoration(
                                  color: Colors.white.withOpacity(0.2),
                                  shape: BoxShape.circle,
                                ),
                                child: Center(
                                  child: Stack(
                                    alignment: Alignment.center,
                                    children: [
                                      // Background circle
                                      Container(
                                        width: 70,
                                        height: 70,
                                        decoration: BoxDecoration(
                                          color: Colors.white.withOpacity(0.3),
                                          shape: BoxShape.circle,
                                        ),
                                      ),
                                      // Food icon with cross
                                      const Icon(
                                        Icons.restaurant,
                                        size: 40,
                                        color: Colors.white,
                                      ),
                                    ],
                                  ),
                                ),
                              ),
                            );
                          },
                        ),
                        const SizedBox(height: 16),
                        // Title
                        const Text(
                          'Food Not Loaded',
                          style: TextStyle(
                            fontSize: 24,
                            fontWeight: FontWeight.bold,
                            color: Colors.white,
                            letterSpacing: -0.5,
                          ),
                          textAlign: TextAlign.center,
                        ),
                      ],
                    ),
                  ),

                  // Content section
                  Padding(
                    padding: const EdgeInsets.all(24),
                    child: Column(
                      children: [
                        // Message
                        Text(
                          customMessage ??
                              'The requested food item is not currently loaded in the Que Box.',
                          style: TextStyle(
                            fontSize: 16,
                            color: Colors.grey[700],
                            height: 1.5,
                            letterSpacing: 0.2,
                          ),
                          textAlign: TextAlign.center,
                        ),

                        const SizedBox(height: 32),

                        // Action buttons
                        Row(
                          children: [
                            if (showRetryButton) ...[
                              Expanded(
                                child: TextButton(
                                  onPressed: () {
                                    Navigator.of(context).pop();
                                    onCancel?.call();
                                  },
                                  style: TextButton.styleFrom(
                                    padding: const EdgeInsets.symmetric(
                                        vertical: 16),
                                    shape: RoundedRectangleBorder(
                                      borderRadius: BorderRadius.circular(12),
                                      side: BorderSide(
                                        color: Colors.grey[300]!,
                                        width: 1,
                                      ),
                                    ),
                                  ),
                                  child: Text(
                                    'Cancel',
                                    style: TextStyle(
                                      fontSize: 16,
                                      fontWeight: FontWeight.w600,
                                      color: Colors.grey[600],
                                    ),
                                  ),
                                ),
                              ),
                              const SizedBox(width: 12),
                              Expanded(
                                child: ElevatedButton(
                                  onPressed: () {
                                    Navigator.of(context).pop();
                                    onRetry?.call();
                                  },
                                  style: ElevatedButton.styleFrom(
                                    backgroundColor: const Color(0xFF4CAF50),
                                    foregroundColor: Colors.white,
                                    elevation: 0,
                                    padding: const EdgeInsets.symmetric(
                                        vertical: 16),
                                    shape: RoundedRectangleBorder(
                                      borderRadius: BorderRadius.circular(12),
                                    ),
                                  ),
                                  child: const Text(
                                    'OK',
                                    style: TextStyle(
                                      fontSize: 16,
                                      fontWeight: FontWeight.w600,
                                    ),
                                  ),
                                ),
                              ),
                            ] else ...[
                              Expanded(
                                child: ElevatedButton(
                                  onPressed: () {
                                    Navigator.of(context).pop();
                                    onCancel?.call();
                                  },
                                  style: ElevatedButton.styleFrom(
                                    backgroundColor: const Color(0xFF6C7B7F),
                                    foregroundColor: Colors.white,
                                    elevation: 0,
                                    padding: const EdgeInsets.symmetric(
                                        vertical: 16),
                                    shape: RoundedRectangleBorder(
                                      borderRadius: BorderRadius.circular(12),
                                    ),
                                  ),
                                  child: const Text(
                                    'Understood',
                                    style: TextStyle(
                                      fontSize: 16,
                                      fontWeight: FontWeight.w600,
                                    ),
                                  ),
                                ),
                              ),
                            ],
                          ],
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          ),
        );
      },
    );
  }

  List<String> toHexStrings(List<int> bytes) {
    return bytes
        .map((byte) =>
            '0x${byte.toRadixString(16).padLeft(2, '0').toUpperCase()}')
        .toList();
  }

  List<int> hexStringToBytes(String hexString) {
    List<int> bytes = [];
    for (int i = 0; i < hexString.length; i += 2) {
      String hex = hexString.substring(i, i + 2);
      // Parse the hex string as a base-16 integer
      int byte = int.parse(hex, radix: 16);
      bytes.add(byte);
    }
    return bytes;
  }

  void resetScanData(BuildContext context) {
    _returnSalValue = {
      'salesOrder': null,
      'salesOrderDtls': [
        {'skuInventory': null}
      ]
    };
    Navigator.pop(context, true);
    // Pass `true` as a result to indicate refresh
  }

  void onChangeValidate(String text) {
    if (_debounce?.isActive ?? false) _debounce!.cancel();
    _debounce = Timer(const Duration(milliseconds: 500), () {
      isDisable = text.isEmpty;
      notifyListeners();
    });
  }
}
