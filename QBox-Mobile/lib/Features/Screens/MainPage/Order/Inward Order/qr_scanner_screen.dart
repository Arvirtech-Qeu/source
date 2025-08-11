import 'dart:async';
import 'dart:convert';
import 'dart:io';

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';
import 'package:qr_page/Widgets/Custom/app_colors.dart';
import '../../../../../Provider/inward_order_provider.dart';
import '../../../../../Provider/scanner.dart';
import '../../../../../Widgets/Custom/divider_text.dart';
import '../../Load-unload/sales_scanning.dart';
import '../View Order/view_order.dart';

class OrderQRScannerScreen extends StatefulWidget {
  static const String routeName = '/order-scan';
  const OrderQRScannerScreen({super.key});

  @override
  State<OrderQRScannerScreen> createState() => _OrderQRScannerScreenState();
}

class _OrderQRScannerScreenState extends State<OrderQRScannerScreen> {
  final List<TextEditingController> _controllers =
      List.generate(5, (index) => TextEditingController());
  final List<FocusNode> _focusNodes = List.generate(5, (index) => FocusNode());
  final TextEditingController _scanController = TextEditingController();
  final FocusNode _scanFocusNode = FocusNode();
  String _scannedData = "No data scanned yet.";
  Timer? _scanTimer;
  final GlobalKey<FormState> _formKey = GlobalKey<FormState>();
  final TextEditingController _manualEntryController = TextEditingController();
  bool _isFormValid = false;
  bool _isLoading = false;

  @override
  void initState() {
    super.initState();
    _scanController.addListener(_onScan);
  }


  void _startScan() {
    print("Starting scan...");
    setState(() {
      _isLoading = true; // Start loading
      _scannedData = "Scanning...";
    });

    FocusScope.of(context).requestFocus(_scanFocusNode);
    print("Focus requested: ${_scanFocusNode.hasFocus}");
  }

  void _onInwardOrOutWard(String scannedOrderId) async {
    try {
      final provider = Provider.of<InwardOrderDtlProvider>(context, listen: false);
      final responseData = await provider.orderEntry(context, scannedOrderId);
      if (responseData != null) {
        final orderType = responseData['orderType'];
        final partnerOrderId = responseData['partnerOrderId'];
        print("Order Type: $responseData, Partner Order ID: $partnerOrderId");

        if (orderType == 46) {
          print('ram');
          _onScanComplete(partnerOrderId);
        } else if (orderType == 47) {
          print('sri');
          final scannerProvider = Provider.of<ScannerProvider>(context, listen: false);
          bool shouldNavigate = await scannerProvider.getOutwardDelivery(partnerOrderId,context);
          print("Outward delivery status: ${scannerProvider.salesOrderItems}");
          print("Outward delivery processed for Partner Order ID: $shouldNavigate");

          if (shouldNavigate) {
            bool? shouldRefresh = await GoRouter.of(context).push(SalesScanning.routeName);
            if (shouldRefresh ?? false) {
              setState(() {
                _isLoading = false; // Stop loading if the result is true
              });
            }
          } else {
            print("Navigation skipped: No open skuInventory items found.");
            setState(() {
              _isLoading = false; // Stop loading if navigation is skipped
            });
          }
        }
      }
    } catch (e) {
      print("Error in _onInwardOrOutWard: $e");
      setState(() {
        _isLoading = false; // Ensure loading is stopped on error
      });
    }
  }

  void _onScanComplete(String scannedOrderId) async {
    if (!mounted) return;

    final provider = context.read<InwardOrderDtlProvider>();
    await provider.handleEntry(context, scannedOrderId);
    if (provider.scanStatus == 'complete' && mounted) {
      setState(() {
        _isLoading = false; // Stop loading
      });
      print('scannedOrderIdsss: $scannedOrderId');
      GoRouter.of(context).push(
        ViewOrder.routeName,
        extra: scannedOrderId, // Pass the scannedOrderId as extra
      );
    }
  }

  void _onScan() {
    print("Scanning...");
    _scanTimer?.cancel();
    _scanTimer = Timer(Duration(milliseconds: 500), () {
      String scannedData = _scanController.text.trim();
      print("Scanned data: $scannedData");
      if (scannedData.isNotEmpty && scannedData != _scannedData) {
        setState(() {
          _scannedData = scannedData;
        });
        print('scannedData: $scannedData');
        _onInwardOrOutWard(scannedData);
        _scanController.clear();
      } else {
        print("No new data scanned or data is the same.");
      }
    });
  }


  @override
  void dispose() {
    for (var controller in _controllers) {
      controller.dispose();
    }
    for (var node in _focusNodes) {
      node.dispose();
    }
    _scanController.removeListener(_onScan);
    _scanController.dispose();
    _scanFocusNode.dispose();
    _scanTimer?.cancel();
    super.dispose();
  }

  Widget _buildOTPFields() {
    return LayoutBuilder(
      builder: (context, constraints) {
        double fieldWidth = constraints.maxWidth * 0.12; // Adjust as needed
        double fieldMargin = constraints.maxWidth * 0.02; // Adjust as needed

        return Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: List.generate(
            5,
            (index) => Container(
              width: fieldWidth.clamp(
                  40.0, 70.0), // Minimum and maximum width limits
              margin: EdgeInsets.symmetric(horizontal: fieldMargin),
              child: TextField(
                controller: _controllers[index],
                focusNode: _focusNodes[index],
                textAlign: TextAlign.center,
                keyboardType: TextInputType.text,
                maxLength: 1,
                decoration: InputDecoration(
                  counterText: '',
                  border: OutlineInputBorder(
                    borderSide: BorderSide(color: AppColors.mintGreen),
                  ),
                  focusedBorder: OutlineInputBorder(
                    borderSide:
                        BorderSide(color: AppColors.mintGreen, width: 2),
                  ),
                  errorBorder: OutlineInputBorder(
                    borderSide: BorderSide(color: Colors.red),
                  ),
                ),
                onChanged: (value) {
                  if (value.length == 1 && index < 4) {
                    _focusNodes[index + 1].requestFocus();
                  }
                  if (value.isEmpty && index > 0) {
                    _focusNodes[index - 1].requestFocus();
                  }
                },
              ),
            ),
          ),
        );
      },
    );
  }

  Widget _buildInitialScanView() {
    return Column(
      children: [
        Padding(
          padding: EdgeInsets.all(16),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Image.asset(
                "assets/qrscan.jpg",
                height: 120,
              ),
              SizedBox(height: 16),
              Text(
                'Scan QR Code',
                style: Theme.of(context).textTheme.titleLarge?.copyWith(
                      fontWeight: FontWeight.bold,
                      fontSize: 22
                    ),
              ),
              SizedBox(height: 8),
              Text(
                'Use your phone to scan the QR code.',
                style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                      color: Colors.black54,
                      fontSize: 18
                    ),
                textAlign: TextAlign.center,

              ),
              SizedBox(height: 24),
              ElevatedButton.icon(
                iconAlignment: IconAlignment.start,
                icon: Icon(Icons.qr_code_scanner),
                label: Text('Scan Now',style: TextStyle(fontSize: 20),),
                style: ElevatedButton.styleFrom(
                  padding: EdgeInsets.all(16),
                  backgroundColor: AppColors.mintGreen,
                ),
                onPressed: () async {
                  // if (await _isEmbeddedDeviceAvailable()) {
                  //   print('true');
                    _startScan();
                  // } else {
                  //   print('false');
                  //   context.read<InwardOrderDtlProvider>().scanOrderQR(context);
                  // }
                  },
              ),
            ],
          ),
        ),
        SizedBox(height: 24),
        CustomDivider(text: "OR"),
        SizedBox(height: 24),
        Text(
          'Manual Entry',
          style: TextStyle(fontSize: 22, fontWeight: FontWeight.bold),
          textAlign: TextAlign.center,
        ),
        Padding(
          padding: const EdgeInsets.all(16.0),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Text(
                'Enter the order id',
                style: TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                  color: AppColors.lightBlack,
                ),
                textAlign: TextAlign.center,
              ),
              SizedBox(height: 20),
              Form(
                key: _formKey,
                onChanged: () {
                  setState(() {
                    _isFormValid = _formKey.currentState?.validate() ?? false;
                  });
                },
                child: Container(
                  decoration: BoxDecoration(
                    borderRadius: BorderRadius.circular(10),
                    gradient: LinearGradient(
                      colors: [
                        Colors.redAccent.withOpacity(0.1),
                        Colors.redAccent.withOpacity(0.05),
                      ],
                      begin: Alignment.topLeft,
                      end: Alignment.bottomRight,
                    ),
                  ),
                  child: TextFormField(
                    controller: _manualEntryController,
                    keyboardType: TextInputType.text, // Change to TextInputType.text for normal text input
                    maxLength: null, // Remove maxLength to allow any length of text
                    textAlign: TextAlign.center,
                    style: const TextStyle(
                      fontSize: 24,
                      fontWeight: FontWeight.bold,
                      letterSpacing: 10,
                      color: Colors.redAccent,
                    ),
                    decoration: InputDecoration(
                      counterText: '', // Remove counter text
                      contentPadding: const EdgeInsets.symmetric(vertical: 12),
                      hintText: 'Enter Here', // Change hint text to something more generic
                      hintStyle: TextStyle(
                        color: Colors.grey[400],
                        fontSize: 24,
                        letterSpacing: 10,
                      ),
                      border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(10),
                        borderSide: BorderSide.none,
                      ),
                      focusedBorder: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(10),
                        borderSide: const BorderSide(color: Colors.redAccent, width: 2),
                      ),
                    ),
                    validator: (value) {
                      if (value == null || value.isEmpty) {
                        return 'Please enter some text'; // Update validation message
                      }
                      return null;
                    },
                  ),
                ),
              ),
              const SizedBox(height: 12),
              ElevatedButton(
                onPressed: _isFormValid
                    ? () async {

                  String fullOrderId = _manualEntryController.text;
                   _onInwardOrOutWard(fullOrderId);
                }
                    : null,
                style: ElevatedButton.styleFrom(
                  backgroundColor: _isFormValid ? Colors.redAccent : Colors.grey[300],
                  elevation: _isFormValid ? 4 : 0,
                  padding: const EdgeInsets.symmetric(vertical: 16, horizontal: 12),
                ),
                child: Text(
                  'Submit',
                  style: TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.bold,
                    color: _isFormValid ? Colors.white : Colors.grey[500],
                  ),
                ),
              ),
              SizedBox(height: 30),
              OutlinedButton.icon(
                  iconAlignment: IconAlignment.end,
                  icon: Icon(Icons.arrow_forward),
                  style: OutlinedButton.styleFrom(
                      padding: const EdgeInsets.symmetric(
                          vertical: 16.0, horizontal: 24),
                      foregroundColor: AppColors.mintGreen,
                      side: BorderSide(color: AppColors.mintGreen)),
                  onPressed: () {
                    GoRouter.of(context).push(ViewOrder.routeName);
                  },
                  label: Text("Go To Orders"))
            ],
          ),
        ),
      ],
    );
  }

  void onScanComplete(String scannedOrderId) {
    print('scannedOrderId$scannedOrderId');
    GoRouter.of(context).push(
      ViewOrder.routeName,
      extra: scannedOrderId,
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Stack(
        children: [
          Center(
            child: SingleChildScrollView(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  _buildInitialScanView(),
                  Opacity(
                    opacity: 0,
                    child: SizedBox(
                      height: 0,
                      width: 0,
                      child: TextField(
                        controller: _scanController,
                        focusNode: _scanFocusNode,
                        autofocus: false,
                        keyboardType: TextInputType.none,
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),
          // Add this block for the loader
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
                                // Rotating outer circle
                                // CircularProgressIndicator(
                                //   valueColor: AlwaysStoppedAnimation<Color>(AppColors.mintGreen),
                                //   strokeWidth: 3,
                                // ),
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
      ),
    );
  }
}
