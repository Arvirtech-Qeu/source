import 'dart:async';

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_serial_communication/flutter_serial_communication.dart';
import 'package:flutter_serial_communication/models/device_info.dart';
import 'package:intl/intl.dart';
import 'package:provider/provider.dart';

import '../../../../Provider/scanner.dart';
import '../../../../Widgets/Custom/app_colors.dart';




class SalesScanning extends StatefulWidget {
  static const String routeName = '/SalesScanning';
  const SalesScanning({Key? key}) : super(key: key);

  @override
  State<SalesScanning> createState() => _SalesScanningState();
}

class _SalesScanningState extends State<SalesScanning> with TickerProviderStateMixin {
  late TextEditingController _orderIdController;
  final GlobalKey qrKey = GlobalKey(debugLabel: 'QR');
  String? selectedSalesOrderId;
  late AnimationController _animationController;
  late Animation<double> _widthAnimation;
  late AnimationController _slideController;
  late Animation<Offset> _slideAnimation;
  List<OrderItem> sampleItems = [];
  final TextEditingController _scanController = TextEditingController();
  final FocusNode _scanFocusNode = FocusNode();
  String _scannedData = "No data scanned yet.";
  Timer? _scanTimer;
  String? _outwardOrderId;

  @override
  void initState() {
    super.initState();

    _orderIdController = TextEditingController();
    _scanController.addListener(_onScan);
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (_outwardOrderId != null) {
        final scannerProvider = Provider.of<ScannerProvider>(context, listen: false);
        scannerProvider.getOutwardDelivery(_outwardOrderId!,context);
      }
    });
    _animationController = AnimationController(
      vsync: this,
      duration: const Duration(seconds: 2),
    );
    _widthAnimation = Tween<double>(begin: 0, end: 200).animate(_animationController);
    _animationController.repeat(reverse: true);

    _slideController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 500),
    );
    _slideAnimation = Tween<Offset>(
      begin: const Offset(0, 0),
      end: const Offset(0, -1.1),
    ).animate(CurvedAnimation(
      parent: _slideController,
      curve: Curves.easeInOut,
    ));
  }


  void startScan(BuildContext context) {
    _scanController.clear();
    _scannedData = "Scanning...";
    FocusScope.of(context).requestFocus(_scanFocusNode);
  }


  // Future<bool> checkForDevices() async {
  //   try {
  //     // Fetch connected devices
  //     List<DeviceInfo> connectedDevices = await _flutterSerialCommunicationPlugin.getAvailableDevices();
  //
  //     // Debug print to log connected devices
  //     print('Connected Devices: $connectedDevices');
  //
  //     // Check if there are any connected USB devices
  //     if (connectedDevices.isNotEmpty) {
  //       print('USB device is connected.');
  //       return true; // USB device(s) found
  //     } else {
  //       print('No USB devices connected.');
  //       return false; // No USB device connected
  //     }
  //   } catch (e) {
  //     // Handle any errors during the device check
  //     print('Error while checking devices: $e');
  //     return false; // Default to no devices if an error occurs
  //   }
  // }
  //
  //
  // void checkDeviceStatus() async {
  //   bool isDeviceConnected = await checkForDevices();
  //
  //   if (isDeviceConnected) {
  //     print('Device is connected. Proceed with the task.');
  //     // Add your logic to handle connected devices
  //   } else {
  //     print('No device connected. Please connect a device.');
  //     // Add logic for handling no devices connected
  //   }
  // }




  @override
  void dispose() {
    _animationController.dispose();
    _slideController.dispose();
    _orderIdController.dispose();
    _scanController.removeListener(_onScan);
    _scanController.dispose();
    _scanFocusNode.dispose();
    _scanTimer?.cancel();
    super.dispose();
  }

  void _onScan() {
    _scanTimer?.cancel();
    _scanTimer = Timer(const Duration(milliseconds: 300), () {
      String scannedData = _scanController.text.trim();
      if (scannedData.isNotEmpty && scannedData != _scannedData) {
        setState(() {
          _scannedData = scannedData;
        });
        print('scannedData: $scannedData');
        final provider = Provider.of<ScannerProvider>(context, listen: false);
        _onScanComplete(scannedData, provider);
        _scanController.clear();
      }
    });
  }

  void _onScanComplete(String scannedOrderId, ScannerProvider provider) {
    setState(() {
      _outwardOrderId = scannedOrderId;
    });
    provider.getOutwardDelivery(scannedOrderId,context);
  }


  String _formatDate(String? date) {
    if (date == null) {
      return 'N/A';
    }
    try {
      final DateTime parsedDate = DateTime.parse(date);
      return DateFormat('dd-MM-yyyy HH:mm').format(parsedDate); // Format the date as '02-01-2025 13:10'
    } catch (e) {
      return 'N/A'; // Return 'N/A' in case of any error during parsing
    }
  }


  @override
  Widget build(BuildContext context) {
    return Consumer<ScannerProvider>(
      builder: (context, provider, child) {
        var salesOrder = provider.returnSalValue['salesOrder'];
        final skuInventory = provider.returnSalValue['salesOrderDtls']?[0]['skuInventory'];

        WidgetsBinding.instance.addPostFrameCallback((_) {
          if (skuInventory != null && skuInventory is List && skuInventory.isNotEmpty) {
            _slideController.forward();
          } else {
            _slideController.reverse();
          }
        });

        return Scaffold(
          appBar: AppBar(
            elevation: 0,
            title: const Text(
              'Outward Delivery',
              style: TextStyle(fontWeight: FontWeight.w600, fontSize: 20, color: Colors.white),
            ),
            actions: [
              // Row(
              //   children: [
              //     const Text(
              //       'Logout',
              //       style: TextStyle(
              //         color: Colors.white,
              //         fontSize: 18,
              //         fontWeight: FontWeight.w600,
              //       ),
              //     ),
              //     IconButton(
              //       onPressed: () {
              //         final scannerProvider = Provider.of<ScannerProvider>(context, listen: false);
              //         scannerProvider.logout(context);
              //       },
              //       icon: const Icon(Icons.logout),
              //     ),
              //   ],
              // ),
            ],
            backgroundColor: Colors.redAccent,
            shape: const RoundedRectangleBorder(
              borderRadius: BorderRadius.vertical(bottom: Radius.circular(15)),
            ),
            iconTheme: const IconThemeData(color: Colors.white),
            automaticallyImplyLeading: false,
          ),
          body: SafeArea(
            child: SingleChildScrollView(
              physics: const BouncingScrollPhysics(),
              child: Padding(
                padding: const EdgeInsets.symmetric(horizontal: 8.0, vertical: 10.0),
                child: Stack(
                  children: [
                    Column(
                      children: [
                        AnimatedBuilder(
                          animation: _slideController,
                          builder: (context, child) {
                            return SizedBox(
                              height: (1 - _slideController.value) * 600,
                            );
                          },
                        ),
                        if (skuInventory != null && skuInventory is List && skuInventory.isNotEmpty) ...[
                          Column(
                            children: [
                              Padding(
                                padding: const EdgeInsets.only(left: 12.0),
                                child: Row(
                                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                  children: [
                                    ElevatedButton.icon(
                                      onPressed: () {
                                        provider.resetScanData(context); // Pass the context here
                                        setState(() {
                                          _slideController.reverse();
                                        });
                                        _orderIdController.clear();
                                      },
                                      icon: const Icon(
                                        Icons.refresh_rounded,
                                        size: 20,
                                        color: Colors.white,
                                      ),
                                      label: const Text(
                                        'Reset',
                                        style: TextStyle(
                                          color: Colors.white,
                                          fontSize: 16,
                                          fontWeight: FontWeight.w600,
                                        ),
                                      ),
                                      style: ElevatedButton.styleFrom(
                                        backgroundColor: Colors.redAccent,
                                        foregroundColor: Colors.white,
                                        padding: const EdgeInsets.symmetric(
                                          horizontal: 16,
                                          vertical: 8,
                                        ),
                                        shape: RoundedRectangleBorder(
                                          borderRadius: BorderRadius.circular(8),
                                        ),
                                        elevation: 2,
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                              _buildOrderItemsCard(provider),
                              const SizedBox(height: 8),
                              _buildOrderPendingCard(provider),
                              const SizedBox(height: 8),
                              _showOrderSummary(provider),
                            ],
                          ),
                        ],
                      ],
                    ),
                    SlideTransition(
                      position: _slideAnimation,
                      child: Column(
                        children: [
                          _buildQrCodeCard(provider),
                          const SizedBox(height: 8),
                          _buildManualEntryTab(provider),
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
                  ],
                ),
              ),
            ),
          ),
        );
      },
    );
  }


  Widget _buildQrCodeCard(ScannerProvider provider) {
    return Container(
      decoration: BoxDecoration(
        gradient: LinearGradient(
          colors: [Colors.redAccent.withOpacity(0.8), Colors.redAccent],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        borderRadius: BorderRadius.circular(15),
        boxShadow: [
          BoxShadow(
            color: Colors.redAccent.withOpacity(0.3),
            blurRadius: 10,
            offset: const Offset(0, 5),
          ),
        ],
      ),
      child: Padding(
        padding: const EdgeInsets.all(12.0),
        child: Column(
          children: [
            GestureDetector(
              // onTap: () => _handleScanTap(context),
              onTap: () => startScan(context),
              // onTap: provider.scanSalesQR,
              child: Container(
                width: 200,
                height: 200,
                decoration: BoxDecoration(
                  color: Colors.white,
                  border: Border.all(color: Colors.white.withOpacity(0.8), width: 2),
                  borderRadius: BorderRadius.circular(15.0),
                  boxShadow: [
                    BoxShadow(
                      color: Colors.black.withOpacity(0.1),
                      blurRadius: 8,
                      offset: const Offset(0, 4),
                    ),
                  ],
                ),
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Stack(
                      alignment: Alignment.center,
                      children: [
                        const Icon(
                          Icons.qr_code_2,
                          size: 100,
                          color: AppColors.primaryColor,
                        ),
                        AnimatedBuilder(
                          animation: _animationController,
                          builder: (context, child) {
                            return Positioned(
                              left: 0,
                              right: 0,
                              top: _widthAnimation.value,
                              child: Container(
                                width: 200,
                                height: 2,
                                decoration: BoxDecoration(
                                  gradient: LinearGradient(
                                    colors: [
                                      Colors.redAccent.withOpacity(0),
                                      Colors.redAccent.withOpacity(0.8),
                                      Colors.redAccent.withOpacity(0),
                                    ],
                                  ),
                                ),
                              ),
                            );
                          },
                        ),
                      ],
                    ),
                    const SizedBox(height: 12),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                      decoration: BoxDecoration(
                        color: Colors.redAccent.withOpacity(0.1),
                        borderRadius: BorderRadius.circular(8),
                      ),
                      child: const Text(
                        'Tap to Scan',
                        style: TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.w600,
                          color: Colors.redAccent,
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 8),
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
              decoration: BoxDecoration(
                color: Colors.white.withOpacity(0.2),
                borderRadius: BorderRadius.circular(8),
              ),
              child: const Text(
                'Encrypted Outward Order',
                style: TextStyle(
                  fontSize: 16,
                  color: Colors.white,
                  fontWeight: FontWeight.w500,
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildManualEntryTab(ScannerProvider provider) {
    final GlobalKey<FormState> _formKey = GlobalKey<FormState>();
    final TextEditingController _prefixController = TextEditingController(text: 'DLB');
    final TextEditingController _manualEntryController = TextEditingController();
    bool _isFormValid = false;

    return StatefulBuilder(
      builder: (context, setState) {
        return Container(
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(15),
            boxShadow: [
              BoxShadow(
                color: Colors.grey.withOpacity(0.1),
                blurRadius: 10,
                offset: const Offset(0, 5),
              ),
            ],
          ),
          child: Padding(
            padding: const EdgeInsets.all(12),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Container(
                      padding: const EdgeInsets.all(8),
                      decoration: BoxDecoration(
                        color: Colors.redAccent.withOpacity(0.1),
                        borderRadius: BorderRadius.circular(8),
                      ),
                      child: const Icon(
                        Icons.edit_outlined,
                        color: Colors.redAccent,
                        size: 18,
                      ),
                    ),
                    const SizedBox(width: 8),
                    const Text(
                      'Manual Entry',
                      style: TextStyle(
                        fontSize: 24,
                        fontWeight: FontWeight.bold,
                        color: Colors.redAccent,
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 8),
                Text(
                  'Enter the order ID below',
                  textAlign: TextAlign.center,
                  style: TextStyle(
                    color: Colors.grey[600],
                    fontSize: 16,
                  ),
                ),
                const SizedBox(height: 12),
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
                        hintText: 'Enter Code', // Change hint text to something more generic
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
                    await provider.getOutwardDelivery(fullOrderId,context);
                  }
                      : null,
                  style: ElevatedButton.styleFrom(
                    backgroundColor: _isFormValid ? Colors.redAccent : Colors.grey[300],
                    elevation: _isFormValid ? 4 : 0,
                    padding: const EdgeInsets.symmetric(vertical: 10),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(10),
                    ),
                  ),
                  child: Text(
                    'Search Order',
                    style: TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.bold,
                      color: _isFormValid ? Colors.white : Colors.grey[500],
                    ),
                  ),
                ),
              ],
            ),
          ),
        );
      },
    );
  }

  Widget _buildOrderItemsCard(ScannerProvider provider) {
    final orderDetails = provider.returnSalValue['salesOrder'];
    final items = provider.returnSalValue['salesOrderDtls'] ?? [];
      print('orderDetails$orderDetails');
      print('items$items');
    return Column(
      children: [
        Container(
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(15),
            boxShadow: [
              BoxShadow(
                color: Colors.grey.withOpacity(0.1),
                blurRadius: 10,
                offset: const Offset(0, 5),
              ),
            ],
          ),
          child: Padding(
            padding: const EdgeInsets.all(12),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    Container(
                      padding: const EdgeInsets.all(8),
                      decoration: BoxDecoration(
                        color: Colors.redAccent.withOpacity(0.1),
                        borderRadius: BorderRadius.circular(8),
                      ),
                      child: const Icon(
                        Icons.shopping_bag_outlined,
                        color: Colors.redAccent,
                        size: 18,
                      ),
                    ),
                    const SizedBox(width: 8),
                    const Text(
                      'Order Details',
                      style: TextStyle(
                        fontSize: 20,
                        fontWeight: FontWeight.bold,
                        color: Colors.redAccent,
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 12),
                Container(
                  padding: const EdgeInsets.all(10),
                  decoration: BoxDecoration(
                    color: Colors.grey[50],
                    borderRadius: BorderRadius.circular(10),
                  ),
                  child: Column(
                    children: [
                      _buildOrderRow(
                        'Order ID',
                        orderDetails?['partnerSalesOrderId']?.toString() ?? 'N/A',
                        isBold: true,
                      ),
                      // const Divider(height: 12),
                      // ...orderDetails?.map((item) {
                      //   return _buildOrderRow(
                      //     'Q-Box Location',
                      //     item['qboxEntityName']?.toString() ?? 'N/A',
                      //   );
                      // }).toList(),
                      // const Divider(height: 12),
                      // _buildOrderRow(
                      //     'Q-Box Location',
                      //   orderDetails?['qboxEntityName']?.toString() ?? 'N/A',
                      //   ),
                      const Divider(height: 12),
                      _buildOrderRow(
                        'Deliver Time',
                        _formatDate(orderDetails?['deliveredTime']),
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

  Widget _buildOrderRow(String label, String value, {bool isBold = false}) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 3.0),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(
            label,
            style: TextStyle(
              fontWeight: isBold ? FontWeight.bold : FontWeight.w500,
              fontSize: 16,
              color: Colors.grey[700],
            ),
          ),
          Text(
            value,
            style: TextStyle(
              fontWeight: isBold ? FontWeight.bold : FontWeight.w500,
              fontSize: 16,
              color: Colors.grey[900],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildOrderPendingCard(ScannerProvider provider) {
    List<OrderItem> orderItems = [];
    bool hasPartialfilledItems = false;
    int fulfilledCount = 0;
    int partialfilledCount = 0;

    if (provider.returnSalValue != null &&
        provider.returnSalValue['salesOrderDtls'] != null) {
      for (var item in provider.returnSalValue['salesOrderDtls']) {
        int orderQuantity = item['orderQuantity'] ?? 0;
        int inventoryCount = item['skuInventory']?.length ?? 0;

        if (inventoryCount < orderQuantity) {
          hasPartialfilledItems = true;
          fulfilledCount += inventoryCount;
          partialfilledCount += orderQuantity - inventoryCount;
        } else {
          fulfilledCount += orderQuantity;
        }

        orderItems.add(OrderItem(
          name: item['partnerFoodCode'] ?? "Unknown Item",
          quantity: orderQuantity,
          status: inventoryCount < orderQuantity ? "UnFulfilled" : "Fulfilled",
          inventoryCount: inventoryCount,
        ));
      }
    }
    return Column(
      children: [
        Container(
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(15),
            boxShadow: [
              BoxShadow(
                color: Colors.grey.withOpacity(0.1),
                blurRadius: 10,
                offset: const Offset(0, 5),
              ),
            ],
          ),
          child: Padding(
            padding: const EdgeInsets.all(12.0),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    Container(
                      padding: const EdgeInsets.all(8),
                      decoration: BoxDecoration(
                        color: Colors.redAccent.withOpacity(0.1),
                        borderRadius: BorderRadius.circular(8),
                      ),
                      child: const Icon(
                        Icons.list_alt_outlined,
                        color: Colors.redAccent,
                        size: 18,
                      ),
                    ),
                    const SizedBox(width: 8),
                    const Text(
                      'Order Items',
                      style: TextStyle(
                        fontSize: 20,
                        fontWeight: FontWeight.bold,
                        color: Colors.redAccent,
                      ),
                    ),
                    // TextButton.icon(
                    //   onPressed: () => _showOrderSummary(provider),
                    //   icon: const Icon(Icons.summarize, size: 18),
                    //   label: const Text('Summary'),
                    //   style: TextButton.styleFrom(
                    //     foregroundColor: Colors.redAccent,
                    //     padding: const EdgeInsets.symmetric(
                    //       horizontal: 12,
                    //       vertical: 8,
                    //     ),
                    //   ),
                    // ),
                  ],
                ),
                const SizedBox(height: 12),
                Column(
                  children: [
                    // Show individual fulfilled items
                    if (fulfilledCount > 0)
                      ...List.generate(fulfilledCount, (index) {
                        // Find the correct item and skuInventory based on the current index
                        var currentItem;
                        var currentSkuInventory;
                        var runningCount = 0;
                        for (var item in provider.returnSalValue['salesOrderDtls']) {
                          int itemInventoryCount = item['skuInventory']?.length ?? 0;
                          if (runningCount + itemInventoryCount > index) {
                            currentItem = item;
                            print('currentItem$currentItem');
                            currentSkuInventory = item['skuInventory'][index - runningCount];
                            break;
                          }
                          runningCount += itemInventoryCount;
                        }

                        return Container(
                          margin: const EdgeInsets.only(bottom: 6.0),
                          decoration: BoxDecoration(
                            color: Colors.grey[50],
                            borderRadius: BorderRadius.circular(10),
                            border: Border.all(color: Colors.grey.withOpacity(0.1)),
                          ),
                          child: Row(
                            children: [
                              Container(
                                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                                decoration: BoxDecoration(
                                  color: Colors.green,
                                  borderRadius: const BorderRadius.horizontal(
                                    left: Radius.circular(10),
                                  ),
                                ),
                                child: const Text(
                                  "Fulfilled",
                                  style: TextStyle(
                                    color: Colors.white,
                                    fontSize: 16,
                                    fontWeight: FontWeight.w600,
                                  ),
                                ),
                              ),
                              Expanded(
                                child: Padding(
                                  padding: const EdgeInsets.symmetric(horizontal: 10.0),
                                  child: Column(
                                    crossAxisAlignment: CrossAxisAlignment.start,
                                    children: [
                                      Text(
                                        currentSkuInventory['restaurantFoodDescription'] ?? "N/A",
                                        style: TextStyle(
                                          fontSize: 18,
                                          fontWeight: FontWeight.w500,
                                          color: Colors.grey[800],
                                        ),
                                      ),
                                      if (currentSkuInventory != null && currentSkuInventory['boxCellDescription'] != null)
                                        Text(
                                          "Box: ${currentSkuInventory['boxCellDescription']}",
                                          style: TextStyle(
                                            fontSize: 16,
                                            color: Colors.grey[600],
                                          ),
                                        ),
                                    ],
                                  ),
                                ),
                              ),
                              Container(
                                width: 32,
                                height: 32,
                                margin: const EdgeInsets.all(4.0),
                                decoration: BoxDecoration(
                                  gradient: LinearGradient(
                                    colors: [
                                      Colors.amber[400]!,
                                      Colors.amber[600]!,
                                    ],
                                    begin: Alignment.topLeft,
                                    end: Alignment.bottomRight,
                                  ),
                                  borderRadius: BorderRadius.circular(8),
                                  boxShadow: [
                                    BoxShadow(
                                      color: Colors.amber.withOpacity(0.3),
                                      blurRadius: 4,
                                      offset: const Offset(0, 2),
                                    ),
                                  ],
                                ),
                                alignment: Alignment.center,
                                child: const Text(
                                  "${ 1}",
                                  style: const TextStyle(
                                    color: Colors.white,
                                    fontSize: 16,
                                    fontWeight: FontWeight.w900,
                                  ),
                                ),
                              ),
                            ],
                          ),
                        );
                      }),
                    // Show unfulfilled items as before
                    if (partialfilledCount > 0)
                      Container(
                        margin: const EdgeInsets.only(bottom: 6.0),
                        decoration: BoxDecoration(
                          color: Colors.grey[50],
                          borderRadius: BorderRadius.circular(10),
                          border: Border.all(color: Colors.grey.withOpacity(0.1)),
                        ),
                        child: Row(
                          children: [
                            Container(
                              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                              decoration: BoxDecoration(
                                color: Colors.red,
                                borderRadius: const BorderRadius.horizontal(
                                  left: Radius.circular(10),
                                ),
                              ),
                              child: const Text(
                                "UnFulfilled",
                                style: TextStyle(
                                  color: Colors.white,
                                  fontSize: 16,
                                  fontWeight: FontWeight.w600,
                                ),
                              ),
                            ),
                            Expanded(
                              child: Padding(
                                padding: const EdgeInsets.symmetric(horizontal: 10.0),
                                child: Text(
                                  (provider.returnSalValue['salesOrderDtls']?[0]?['skuInventory'] != null &&
                                      (provider.returnSalValue['salesOrderDtls']?[0]?['skuInventory'] as List).isNotEmpty)
                                      ? provider.returnSalValue['salesOrderDtls'][0]['skuInventory'][0]['restaurantFoodDescription'] ?? "N/A"
                                      : "N/A",
                                  style: TextStyle(
                                    fontSize: 16,
                                    fontWeight: FontWeight.w500,
                                    color: Colors.grey[800],
                                  ),
                                ),
                              ),
                            ),
                            Container(
                              width: 32,
                              height: 32,
                              margin: const EdgeInsets.all(4.0),
                              decoration: BoxDecoration(
                                color: Colors.black,
                                borderRadius: BorderRadius.circular(8),
                                boxShadow: [
                                  BoxShadow(
                                    color: Colors.black.withOpacity(0.3),
                                    blurRadius: 4,
                                    offset: const Offset(0, 2),
                                  ),
                                ],
                              ),
                              alignment: Alignment.center,
                              child: Text(
                                partialfilledCount.toString(),
                                style: const TextStyle(
                                  color: Colors.white,
                                  fontSize: 12,
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                            ),
                          ],
                        ),
                      ),
                  ],
                ),
                // if (hasPartialfilledItems) ...[
                //   const SizedBox(height: 16),
                //   ElevatedButton(
                //     onPressed: () {
                //       final partnerSalesOrderId = provider.returnSalValue['salesOrder']?['partnerSalesOrderId'];
                //       if (partnerSalesOrderId != null) {
                //         provider.getOutwardDelivery(partnerSalesOrderId.toString());
                //       }
                //     },
                //     style: ElevatedButton.styleFrom(
                //       backgroundColor: Colors.red,
                //       foregroundColor: Colors.white,
                //       padding: const EdgeInsets.symmetric(vertical: 12, horizontal: 24),
                //       shape: RoundedRectangleBorder(
                //         borderRadius: BorderRadius.circular(10),
                //       ),
                //     ),
                //     child: const Row(
                //       mainAxisSize: MainAxisSize.min,
                //       children: [
                //         Icon(
                //           Icons.qr_code,  // QR icon
                //           color: Colors.white,
                //           size: 20,  // Adjust size as needed
                //         ),
                //         const SizedBox(width: 8),  // Space between icon and text
                //         const Text(
                //           'Rescan',
                //           style: TextStyle(
                //             fontSize: 16,
                //             fontWeight: FontWeight.bold,
                //           ),
                //         ),
                //       ],
                //     ),
                //   ),
                // ],
              ],
            ),
          ),
        ),
       const SizedBox(height: 30,),
        if (hasPartialfilledItems) ...[
          const SizedBox(height: 16),
          ElevatedButton(
            onPressed: () {
              final partnerSalesOrderId = provider.returnSalValue['salesOrder']?['partnerSalesOrderId'];
              if (partnerSalesOrderId != null) {
                provider.getOutwardDelivery(partnerSalesOrderId.toString(),context);
              }
            },
            style: ElevatedButton.styleFrom(
              backgroundColor: Colors.red,
              foregroundColor: Colors.white,
              padding: const EdgeInsets.symmetric(vertical: 12, horizontal: 24),
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(10),
              ),
            ),
            child: const Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                Icon(
                  Icons.qr_code,  // QR icon
                  color: Colors.white,
                  size: 20,  // Adjust size as needed
                ),
                const SizedBox(width: 8),  // Space between icon and text
                const Text(
                  'Rescan',
                  style: TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ],
            ),
          ),
        ],
        const SizedBox(height: 20,),
      ],
    );

  }

  Widget _showOrderSummary(ScannerProvider provider) {
    final orderDetails = provider.returnSalValue['salesOrder'];
    final items = provider.returnSalValue['salesOrderDtls'] ?? [];
    int totalItems = 0;
    int fulfilledItems = 0;

    for (var item in items) {
      totalItems += (item['orderQuantity'] as num?)?.toInt() ?? 0;
      fulfilledItems += (item['skuInventory'] as List?)?.length ?? 0;
    }

    return Container(
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(15),
        boxShadow: [
          BoxShadow(
            color: Colors.grey.withOpacity(0.1),
            blurRadius: 10,
            offset: const Offset(0, 5),
          ),
        ],
      ),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Container(
                  padding: const EdgeInsets.all(8),
                  decoration: BoxDecoration(
                    color: Colors.redAccent.withOpacity(0.1),
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: const Icon(
                    Icons.summarize,
                    color: Colors.redAccent,
                    size: 18,
                  ),
                ),
                const SizedBox(width: 8),
                const Text(
                  'Order Summary',
                  style: TextStyle(
                    fontSize: 20,
                    fontWeight: FontWeight.bold,
                    color: Colors.redAccent,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 20),
            _buildSummaryCard(
              'Delivery Status',
              totalItems == fulfilledItems ? 'Order Delivered' : 'Un Fulfilled',
              icon: Icons.local_shipping,
              color: totalItems == fulfilledItems ? Colors.green : Colors.orange,
            ),
            const SizedBox(height: 12),
            Row(
              children: [
                Expanded(
                  child: _buildSummaryCard(
                    'Total Items',
                    '$totalItems',
                    icon: Icons.shopping_bag,
                    color: Colors.blue,
                    small: true,
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: _buildSummaryCard(
                    'Fulfilled',
                    '$fulfilledItems',
                    icon: Icons.check_circle,
                    color: Colors.green,
                    small: true,
                  ),
                ),
                if (totalItems > fulfilledItems) ...[
                  const SizedBox(width: 12),
                  Expanded(
                    child: _buildSummaryCard(
                      'Unfulfilled',
                      '${totalItems - fulfilledItems}',
                      icon: Icons.warning,
                      color: Colors.red,
                      small: true,
                    ),
                  ),
                ],
              ],
            ),
            const SizedBox(height: 20),
            const Text(
              'Item Details',
              style: TextStyle(
                fontSize: 20,
                fontWeight: FontWeight.bold,
                color: Colors.redAccent,
              ),
            ),
            const SizedBox(height: 12),
            ...items.map((item) => _buildItemCard(item)).toList(),
          ],
        ),
      ),
    );
  }




  Widget _buildSummaryCard(String title, String value, {
    required IconData icon,
    required Color color,
    bool small = false,
  }) {
    return Container(
      padding: EdgeInsets.all(small ? 14 : 18),
      decoration: BoxDecoration(
        color: color.withOpacity(0.1),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: color.withOpacity(0.3)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Icon(icon, color: color, size: small ? 20 : 24),
              const SizedBox(width: 8),
              Flexible(
                child: Text(
                  title,
                  style: TextStyle(
                    fontSize: small ? 14 : 18,
                    fontWeight: FontWeight.w500,
                    color: Colors.grey[600],
                  ),
                  overflow: TextOverflow.ellipsis, // Ensures text doesn't overflow and shows "..."
                ),
              ),
            ],
          ),
          const SizedBox(height: 8),
          Text(
            value,
            style: TextStyle(
              fontSize: small ? 20 : 24,
              fontWeight: FontWeight.bold,
              color: color,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildItemCard(Map<String, dynamic> item) {
    final orderQuantity = item['orderQuantity'] ?? 0;
    final skuInventory = item['skuInventory'] ?? [];
    final inventoryCount = skuInventory.length;

    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: Colors.grey[50],
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: Colors.grey[200]!),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Expanded(
                child: Text(
                  skuInventory.isNotEmpty
                      ? skuInventory[0]['restaurantFoodDescription'] ?? 'Unknown Item'
                      : 'No Item Description',
                  style: const TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                decoration: BoxDecoration(
                  color: inventoryCount >= orderQuantity
                      ? Colors.green.withOpacity(0.1)
                      : Colors.orange.withOpacity(0.1),
                  borderRadius: BorderRadius.circular(8),
                ),
                child: Text(
                  inventoryCount >= orderQuantity ? 'Fulfilled' : 'Unfulfilled',
                  style: TextStyle(
                    color: inventoryCount >= orderQuantity
                        ? Colors.green
                        : Colors.orange,
                    fontSize: 14,
                    fontWeight: FontWeight.w600,
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 8),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                'Ordered: $orderQuantity',
                style: TextStyle(
                  fontSize: 16,
                  color: Colors.grey[600],
                ),
              ),
              Text(
                'Fulfilled: $inventoryCount',
                style: TextStyle(
                  fontSize: 16,
                  color: Colors.grey[600],
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }


}

class OrderItem {
  final String name;
  final int quantity;
  final String status;
  final int inventoryCount;

  OrderItem({
    required this.name,
    required this.quantity,
    required this.status,
    required this.inventoryCount,
  });
}

