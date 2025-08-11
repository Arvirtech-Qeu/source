import 'dart:async';

import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:provider/provider.dart';
import '../../../../Services/api_service.dart';
import '../../../../Services/toast_service.dart';
import '../../../../Services/token_service.dart';
import '../../../../Widgets/Custom/app_colors.dart';

class UnloadQbox extends StatefulWidget {
  const UnloadQbox({super.key});

  @override
  State<UnloadQbox> createState() => _UnloadQboxState();
}

class _UnloadQboxState extends State<UnloadQbox> {
  String qBoxOutBarcode = '';
  final ApiService apiService = ApiService();
  final CommonService commonService = CommonService();
  bool get isReadyToLoad => qBoxOutBarcode.isNotEmpty;
  final TextEditingController _scanController = TextEditingController();
  String _scannedData = "No data scanned yet.";
  final FocusNode _scanFocusNode = FocusNode();
  TokenService tokenService = TokenService();
  int? entitySno;
  Timer? _scanTimer;
  bool _isLoading = false;

  @override
  void initState() {
    super.initState();
    getEntitySno();
    _scanController.addListener(_onScan);
  }

  @override
  void dispose() {
    _scanController.dispose();
    _scanFocusNode.dispose();
    _scanTimer?.cancel();
    super.dispose();
  }

  getEntitySno() async {
    entitySno = await tokenService.getQboxEntitySno();
    print("unload$entitySno");
  }

  void _startScan() {
    print("Starting scan...");
    setState(() {
      _isLoading = true; // Start loading
      _scannedData = "Scanning...";
    });

    // Request focus programmatically (without a visible TextField)
    WidgetsBinding.instance.addPostFrameCallback((_) {
      FocusScope.of(context).requestFocus(_scanFocusNode);
      print("Focus requested: ${_scanFocusNode.hasFocus}");
    });
  }

  void _onScan() {
    print('_onScan called');
    _scanTimer?.cancel();
    _scanTimer = Timer(const Duration(milliseconds: 300), () {
      String scannedData = _scanController.text.trim();
      print('_scanController.text: ${_scanController.text}');
      if (scannedData.isNotEmpty && scannedData != _scannedData) {
        setState(() {
          _scannedData = scannedData;
        });
        print('scannedData: $scannedData');
        _onScanComplete(scannedData);
      }
    });
  }

  void _onScanComplete(String scannedData) {
    print('_onScanComplete called with: $scannedData');
    setState(() {
      _isLoading = false; // Stop loading
    });
    scanBarcode();
  }

  Future<void> scanBarcode() async {
    String barcodeScanRes = _scanController.text.trim();
    _scanController.clear();
    setState(() {
      qBoxOutBarcode = barcodeScanRes;
    });
  }

  unloadFromQBox() async {
    print("heloo");
    Map<String, dynamic> body = {
      "uniqueCode": qBoxOutBarcode,
      "wfStageCd": 12,
      "qboxEntitySno": entitySno
    };
    print("body$body");
    try {
      var result = await apiService.post("8912", "masters", "unload_sku_from_qbox_to_hotbox", body);
      print("resultssss$result");
      if (result != null && result['data'] != null) {
        print('RESULT$result');
        commonService.presentToast('Food Unloaded from the qbox');
        qBoxOutBarcode = '';
      } else {
        commonService.presentToast('Something went wrong....');
      }
    } catch (e) {
      print('Error: $e');
    }
    setState(() {});
  }

  @override
  Widget build(BuildContext context) {
    return Stack(
      children: [
        Padding(
          padding: const EdgeInsets.all(16.0),
          child: SingleChildScrollView(
            child: Column(
              children: [
                _buildInitialScanView(context),
              ],
            ),
          ),
        ),
        if (_isLoading)
          Container(
            color: Colors.black.withOpacity(0.6),
            child: Center(
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  // Animated loading container
                  Container(
                    padding: EdgeInsets.all(24),
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(16),
                      boxShadow: [
                        BoxShadow(
                          color: Colors.black.withOpacity(0.2),
                          blurRadius: 10,
                          spreadRadius: 2,
                        ),
                      ],
                    ),
                    child: Column(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        // Animated scanner icon
                        SizedBox(
                          height: 80,
                          width: 120,
                          child: Stack(
                            alignment: Alignment.center,
                            children: [
                              // Pulsing QR scanner icon
                              Icon(
                                Icons.qr_code_scanner,
                                color: AppColors.mintGreen,
                                size: 40,
                              )
                                  .animate(onPlay: (controller) => controller.repeat())
                                  .scale(
                                begin: Offset(0.8, 0.8),
                                end: Offset(1.2, 1.2),
                                duration: 1000.ms,
                              )
                                  .then()
                                  .scale(
                                begin: Offset(1.2, 1.2),
                                end: Offset(0.8, 0.8),
                                duration: 1000.ms,
                              ),
                            ],
                          ),
                        ),
                        SizedBox(height: 20),
                        // Scanning message
                        Text(
                          'Scanning',
                          style: TextStyle(
                            fontSize: 16,
                            fontWeight: FontWeight.w600,
                            color: Colors.black87,
                          ),
                        ),
                        SizedBox(height: 8),
                        // Animated dots
                        Row(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            for (int i = 0; i < 3; i++)
                              Container(
                                margin: EdgeInsets.symmetric(horizontal: 2),
                                width: 8,
                                height: 8,
                                decoration: BoxDecoration(
                                  shape: BoxShape.circle,
                                  color: AppColors.mintGreen,
                                ),
                              )
                                  .animate(
                                onPlay: (controller) => controller.repeat(),
                              )
                                  .fadeOut(
                                begin: 1.0,
                                duration: 600.ms,
                                delay: Duration(milliseconds: i * 200),
                                curve: Curves.easeInOut,
                              )
                                  .then()
                                  .fadeIn(
                                duration: 600.ms,
                                curve: Curves.easeInOut,
                              ),
                          ],
                        ),
                        SizedBox(height: 16),
                        // Cancel button
                        GestureDetector(
                          onTap: () {
                            setState(() {
                              _isLoading = false;
                            });
                          },
                          child: Container(
                            padding: EdgeInsets.symmetric(vertical: 8, horizontal: 16),
                            decoration: BoxDecoration(
                              borderRadius: BorderRadius.circular(20),
                              border: Border.all(color: Colors.grey.shade300),
                            ),
                            child: Text(
                              'Cancel',
                              style: TextStyle(
                                color: Colors.grey.shade700,
                                fontSize: 14,
                              ),
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          ),
      ],
    );
  }

  Widget _buildInitialScanView(BuildContext context) {
    final isTablet = MediaQuery.of(context).size.shortestSide >= 600;
    return Column(
      children: [
        SizedBox(
          width: MediaQuery.of(context).size.width,
          child: Card(
            child: Padding(
              padding: EdgeInsets.all(16),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Image.asset(
                    "assets/qrscan.jpg",
                    width: isTablet ? 250 : 180,
                  ),
                  SizedBox(height: 16),
                  Text(
                    'Scan QR Code',
                    style: TextStyle(fontSize: isTablet ? 18 : 14, fontWeight: FontWeight.bold),
                  ),
                  SizedBox(height: 8),
                  Text(
                    'Scan the QR code to unload food from Qbox.',
                    style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                      color: Colors.black54,
                    ),
                    textAlign: TextAlign.center,
                  ),
                  SizedBox(height: 24),
                  ElevatedButton.icon(
                    iconAlignment: IconAlignment.start,
                    icon: Icon(Icons.qr_code_scanner),
                    label: Text('Scan Now'),
                    style: ElevatedButton.styleFrom(
                        padding: EdgeInsets.all(16),
                        backgroundColor: AppColors.mintGreen,
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.all(Radius.circular(10)))
                    ),
                    onPressed: () => _startScan(),
                  ),
                  // Hidden TextField for focus-based scanning
                  Opacity(
                    opacity: 0, // Make the TextField invisible
                    child: TextField(
                      controller: _scanController,
                      focusNode: _scanFocusNode,
                      enabled: true,
                      keyboardType: TextInputType.none,
                      decoration: InputDecoration(
                        labelText: 'Scan Barcode',
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),
        ),
        if (qBoxOutBarcode.isNotEmpty && qBoxOutBarcode != '-1') ...[
          SizedBox(height: 24),
          _buildOrderDetails(qBoxOutBarcode),
        ],
      ],
    );
  }

  Widget _buildDispatchButton(BuildContext context) {
    final isTablet = MediaQuery.of(context).size.shortestSide >= 600;
    final isEnabled = qBoxOutBarcode.isNotEmpty;
    return Container(
      width: double.infinity,
      height: 56,
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(10),
        color: isEnabled ? Colors.green : Colors.grey[300]!,
      ),
      child: Material(
        color: Colors.transparent,
        child: InkWell(
          onTap: isEnabled ? () => unloadFromQBox() : null,
          borderRadius: BorderRadius.circular(10),
          child: Center(
            child: Text(
              'Confirm Unload',
              style: TextStyle(
                color: Colors.white,
                fontSize: isTablet ? 18 : 14,
                fontWeight: FontWeight.bold,
              ),
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildOrderDetails(String scannedResult) {
    final isTablet = MediaQuery.of(context).size.shortestSide >= 600;
    return Container(
      padding: const EdgeInsets.all(20),
      margin: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        border: Border.all(color: AppColors.lightBlack),
        borderRadius: BorderRadius.circular(10),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            'Food Details',
            style: TextStyle(fontSize: isTablet ? 24 : 18, fontWeight: FontWeight.bold),
          ),
          const SizedBox(height: 20),
          _buildDetailRow('Food Code', scannedResult),
          const SizedBox(height: 30),
          _buildDispatchButton(context),
        ],
      ),
    );
  }

  Widget _buildDetailRow(String label, String value) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(
            label,
            style: const TextStyle(fontSize: 16, color: Colors.grey),
          ),
          Text(
            value,
            style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
          ),
        ],
      ),
    );
  }
}