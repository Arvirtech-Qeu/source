// import 'package:qr_code_scanner/qr_code_scanner.dart';
// import 'package:flutter/material.dart';
//
// class ScannerProvider extends ChangeNotifier {
//   String _scanBarcode = '';
//   String get scanBarcode => _scanBarcode;
//
//   QRViewController? _controller;
//   final GlobalKey qrKey = GlobalKey(debugLabel: 'QR');
//
//   Future<void> scanQR(BuildContext context) async {
//     String? barcodeScanRes;
//
//     // Show QR scanner UI
//     await Navigator.push(
//       context,
//       MaterialPageRoute(
//         builder: (context) => Scaffold(
//           body: QRView(
//             key: qrKey,
//             onQRViewCreated: (controller) {
//               _controller = controller;
//               controller.scannedDataStream.listen((scanData) {
//                 barcodeScanRes = scanData.code;
//                 if (barcodeScanRes != null) {
//                   _scanBarcode = barcodeScanRes!;
//                   print("QR code scanned: $_scanBarcode");
//                   notifyListeners();
//                   Navigator.pop(context); // Close scanner after scan
//                 }
//               });
//             },
//             overlay: QrScannerOverlayShape(
//               borderColor: Colors.red,
//               borderRadius: 10,
//               borderLength: 30,
//               borderWidth: 10,
//               cutOutSize: 300,
//             ),
//           ),
//         ),
//       ),
//     );
//
//     try {
//       if (barcodeScanRes != null && barcodeScanRes != '-1') {
//         await get(barcodeScanRes!);
//         print("After get() call, value: $value");
//         if (await _isValidOrder(barcodeScanRes!)) {
//           print("Order is valid, showing action dialog");
//           _showOrderActionDialog(context, barcodeScanRes!);
//         } else {
//           print("Invalid order");
//           commonService.errorToast('Invalid order');
//         }
//       } else {
//         print("Scanning cancelled");
//         commonService.errorToast('Scanning cancelled');
//       }
//     } catch (e) {
//       print("Error scanning QR code: $e");
//       _scanBarcode = 'Failed to get platform version.';
//       notifyListeners();
//       _showErrorDialog(context);
//     } finally {
//       _controller?.dispose();
//     }
//   }
// }