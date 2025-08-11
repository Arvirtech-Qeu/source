// lib/services/common_barcode_scanner.dart
import 'dart:async';
import 'package:flutter/material.dart';
import 'package:mobile_scanner/mobile_scanner.dart';

/// Scan mode which is either QR code or BARCODE
enum ScanMode { QR, BARCODE, DEFAULT }

/// Common barcode scanner service that replaces flutter_barcode_scanner
class CommonBarcodeScanner {
  /// Scan with the camera until a barcode is identified, then return.
  ///
  /// Shows a scan line with [lineColor] over a scan window. A flash icon is
  /// displayed if [isShowFlashIcon] is true. The text of the cancel button can
  /// be customized with the [cancelButtonText] string.
  static Future<String> scanBarcode(
      String lineColor,
      String cancelButtonText,
      bool isShowFlashIcon,
      ScanMode scanMode,
      ) async {
    throw UnsupportedError(
        'CommonBarcodeScanner.scanBarcode() cannot be called directly. '
            'Use CommonBarcodeScanner.scanBarcodeWithContext() instead.'
    );
  }

  /// Scan with context - the proper way to use this scanner
  static Future<String> scanBarcodeWithContext(
      BuildContext context,
      String lineColor,
      String cancelButtonText,
      bool isShowFlashIcon,
      ScanMode scanMode,
      ) async {
    final result = await Navigator.push<String>(
      context,
      MaterialPageRoute(
        builder: (context) => CommonQRScannerScreen(
          lineColor: lineColor,
          cancelButtonText: cancelButtonText,
          isShowFlashIcon: isShowFlashIcon,
          scanMode: scanMode,
        ),
      ),
    );

    return result ?? '-1'; // Return '-1' if cancelled, matching flutter_barcode_scanner behavior
  }
}

/// Custom QR Scanner Screen that replaces the need for flutter_barcode_scanner
class CommonQRScannerScreen extends StatefulWidget {
  final String lineColor;
  final String cancelButtonText;
  final bool isShowFlashIcon;
  final ScanMode scanMode;

  const CommonQRScannerScreen({
    Key? key,
    required this.lineColor,
    required this.cancelButtonText,
    required this.isShowFlashIcon,
    required this.scanMode,
  }) : super(key: key);

  @override
  State<CommonQRScannerScreen> createState() => _CommonQRScannerScreenState();
}

class _CommonQRScannerScreenState extends State<CommonQRScannerScreen> {
  MobileScannerController controller = MobileScannerController();
  bool isFlashOn = false;
  bool hasScanned = false;

  @override
  void dispose() {
    controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.black,
      body: Column(
        children: <Widget>[
          Expanded(
            flex: 4,
            child: Stack(
              children: [
                MobileScanner(
                  controller: controller,
                  onDetect: (capture) {
                    if (!hasScanned) {
                      hasScanned = true;
                      final List<Barcode> barcodes = capture.barcodes;
                      if (barcodes.isNotEmpty) {
                        Navigator.pop(context, barcodes.first.rawValue);
                      }
                    }
                  },
                ),
                CustomPaint(
                  painter: ScannerOverlay(
                    borderColor: _parseColor(widget.lineColor),
                  ),
                ),
                // Top bar with cancel button
                Positioned(
                  top: MediaQuery.of(context).padding.top + 10,
                  left: 10,
                  right: 10,
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      // Cancel button
                      TextButton(
                        onPressed: () {
                          Navigator.pop(context, '-1');
                        },
                        child: Text(
                          widget.cancelButtonText,
                          style: const TextStyle(
                            color: Colors.white,
                            fontSize: 16,
                            fontWeight: FontWeight.w500,
                          ),
                        ),
                      ),
                      // Flash button
                      if (widget.isShowFlashIcon)
                        IconButton(
                          onPressed: () async {
                            await controller.toggleTorch();
                            setState(() {
                              isFlashOn = !isFlashOn;
                            });
                          },
                          icon: Icon(
                            isFlashOn ? Icons.flash_on : Icons.flash_off,
                            color: Colors.white,
                            size: 28,
                          ),
                        ),
                    ],
                  ),
                ),
              ],
            ),
          ),
          Expanded(
            flex: 1,
            child: Container(
              color: Colors.black,
              child: Center(
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Text(
                      _getScanModeText(),
                      style: const TextStyle(
                        color: Colors.white,
                        fontSize: 16,
                        fontWeight: FontWeight.w500,
                      ),
                    ),
                    const SizedBox(height: 8),
                    const Text(
                      'Align the code within the frame to scan',
                      style: TextStyle(
                        color: Colors.white70,
                        fontSize: 14,
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Color _parseColor(String colorString) {
    try {
      // Remove '#' if present and convert to int
      String cleanColor = colorString.replaceAll('#', '');
      if (cleanColor.length == 6) {
        cleanColor = 'FF$cleanColor'; // Add alpha if not present
      }
      return Color(int.parse(cleanColor, radix: 16));
    } catch (e) {
      // Default to red if parsing fails
      return Colors.red;
    }
  }

  String _getScanModeText() {
    switch (widget.scanMode) {
      case ScanMode.QR:
        return 'Scan QR Code';
      case ScanMode.BARCODE:
        return 'Scan Barcode';
      case ScanMode.DEFAULT:
      default:
        return 'Scan Code';
    }
  }
}

class ScannerOverlay extends CustomPainter {
  final Color borderColor;

  ScannerOverlay({required this.borderColor});

  @override
  void paint(Canvas canvas, Size size) {
    final cutOutSize = 300.0;
    final cutOutRect = Rect.fromCenter(
      center: Offset(size.width / 2, size.height / 2),
      width: cutOutSize,
      height: cutOutSize,
    );

    // Draw background
    final backgroundPaint = Paint()
      ..color = Colors.black.withOpacity(0.5)
      ..style = PaintingStyle.fill;
    canvas.drawRect(
      Rect.fromLTRB(0, 0, size.width, size.height),
      backgroundPaint,
    );

    // Draw cutout
    final cutOutPaint = Paint()
      ..blendMode = BlendMode.clear
      ..style = PaintingStyle.fill;
    canvas.drawRect(cutOutRect, cutOutPaint);

    // Draw border
    final borderPaint = Paint()
      ..color = borderColor
      ..style = PaintingStyle.stroke
      ..strokeWidth = 4.0;
    canvas.drawRect(cutOutRect, borderPaint);

    // Draw corners
    final cornerPaint = Paint()
      ..color = borderColor
      ..style = PaintingStyle.stroke
      ..strokeWidth = 10.0;

    const cornerLength = 30.0;
    // Top left corner
    canvas.drawLine(
      cutOutRect.topLeft,
      cutOutRect.topLeft + Offset(cornerLength, 0),
      cornerPaint,
    );
    canvas.drawLine(
      cutOutRect.topLeft,
      cutOutRect.topLeft + Offset(0, cornerLength),
      cornerPaint,
    );

    // Top right corner
    canvas.drawLine(
      cutOutRect.topRight,
      cutOutRect.topRight + Offset(-cornerLength, 0),
      cornerPaint,
    );
    canvas.drawLine(
      cutOutRect.topRight,
      cutOutRect.topRight + Offset(0, cornerLength),
      cornerPaint,
    );

    // Bottom left corner
    canvas.drawLine(
      cutOutRect.bottomLeft,
      cutOutRect.bottomLeft + Offset(cornerLength, 0),
      cornerPaint,
    );
    canvas.drawLine(
      cutOutRect.bottomLeft,
      cutOutRect.bottomLeft + Offset(0, -cornerLength),
      cornerPaint,
    );

    // Bottom right corner
    canvas.drawLine(
      cutOutRect.bottomRight,
      cutOutRect.bottomRight + Offset(-cornerLength, 0),
      cornerPaint,
    );
    canvas.drawLine(
      cutOutRect.bottomRight,
      cutOutRect.bottomRight + Offset(0, -cornerLength),
      cornerPaint,
    );
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) {
    return false;
  }
}

/// Extension to provide the same API as flutter_barcode_scanner for easy migration
class FlutterBarcodeScanner {
  /// This method now requires a BuildContext to work properly
  /// Use it within your provider methods where you have access to context
  static Future<String> scanBarcode(
      String lineColor,
      String cancelButtonText,
      bool isShowFlashIcon,
      ScanMode scanMode, {
        required BuildContext context,
      }) async {
    return CommonBarcodeScanner.scanBarcodeWithContext(
      context,
      lineColor,
      cancelButtonText,
      isShowFlashIcon,
      scanMode,
    );
  }
}