import 'dart:async';
import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:flutter_serial_communication/flutter_serial_communication.dart';
import 'package:flutter_serial_communication/models/device_info.dart';
import 'package:go_router/go_router.dart';
import 'package:qr_page/Features/Screens/MainPage/Load-unload/load_history.dart';
import '../../../../Services/api_service.dart';
import '../../../../Services/toast_service.dart';
import '../../../../Services/token_service.dart';
import '../../../../Widgets/Custom/app_colors.dart';


class LoadQbox extends StatefulWidget {
  const LoadQbox({super.key});

  @override
  State<LoadQbox> createState() => _LoadQboxState();
}

class _LoadQboxState extends State<LoadQbox> {
  final ApiService _apiService = ApiService();
  String qBoxBarcode = '';
  String foodBarcode = '';
  final ApiService apiService = ApiService();
  final CommonService commonService = CommonService();
  bool get isReadyToLoad => qBoxBarcode.isNotEmpty && foodBarcode.isNotEmpty;
  final List<dynamic> _returnValue = [];
  List<dynamic> get returnValue => _returnValue;

  final _flutterSerialCommunicationPlugin = FlutterSerialCommunication();
  bool isConnected = false;
  String messageStatus = "";

  final TextEditingController _scanController = TextEditingController();
  final FocusNode _scanFocusNode = FocusNode();
  final TokenService _tokenService = TokenService();
  Timer? _scanTimer;
  String _scannedData = '';
  late String _currentScannerType = '';
  bool _isLoading = false;
  String usbStatus = "Press the button to check USB devices.";

  TokenService tokenService = TokenService();
  int? entitySno;
  late final  user;

  @override
  void initState() {

    super.initState();
    _scanController.addListener(_onScan);
    getEntitySno();
  }

  getEntitySno() async {
    user = await _tokenService.getUser();
    print("User: $user");
    getEntity(user); // Pass the user Map directly
  }

  void getEntity(Map<String, dynamic> jsonResponse) {
    List<dynamic> qboxEntityDetails = jsonResponse['qboxEntityDetails'];
    if (qboxEntityDetails.isNotEmpty) {
      entitySno = qboxEntityDetails[0]['qboxEntitySno'];
      print('qboxEntitySno: $entitySno');
    } else {
      print('qboxEntityDetails is empty');
    }
  }


  // Future<void> scanBarcode(String name) async {
  //   String barcodeScanRes;
  //   try {
  //     barcodeScanRes = await FlutterBarcodeScanner.scanBarcode(
  //         '#E11D48', 'Cancel', true, ScanMode.QR);
  //     if (barcodeScanRes != '-1') {
  //     setState(() {
  //       if (name == 'Compartment Scanner') {
  //         qBoxBarcode = barcodeScanRes;
  //         print('qBoxBarcode$qBoxBarcode');
  //       } else if (name == 'Food Scanner') {
  //         foodBarcode = barcodeScanRes;
  //       }
  //     });
  //     // Perform the following actions only if the scanned barcode is for 'Compartment'
  //     if (name == 'Compartment Scanner') {
  //       String hexCode = await fetchHexCodeFromApi(entitySno!, qBoxBarcode);
  //       print('hexCode$hexCode');
  //       List<int> messageBytes = hexStringToBytes(hexCode);
  //       print('messageBytes$messageBytes');
  //
  //       List<String> hexStrings = toHexStrings(messageBytes);
  //       print('messageBytes in hex: $hexStrings');
  //
  //       List<DeviceInfo> connectedDevices = await _flutterSerialCommunicationPlugin.getAvailableDevices();
  //       print('connectedDevices$connectedDevices');
  //       if (connectedDevices.isNotEmpty) {
  //         print('connectedDevices[0]${connectedDevices[0]}');
  //         bool isConnectionSuccess = await _flutterSerialCommunicationPlugin.connect(connectedDevices[0], 9600);
  //         print('isConnectionSucc$isConnectionSuccess');
  //         setState(() {
  //           isConnected = isConnectionSuccess;
  //         });
  //         print('isConnectionSuccess$isConnectionSuccess');
  //         if (isConnectionSuccess) {
  //           bool isMessageSent = await _flutterSerialCommunicationPlugin.write(Uint8List.fromList(messageBytes));
  //           setState(() {
  //             messageStatus = isMessageSent ? "Message Sent Successfully" : "Message Sending Failed";
  //           });
  //           debugPrint("Is Message Sent:  $isMessageSent");
  //           await _flutterSerialCommunicationPlugin.disconnect();
  //
  //         } else {
  //           setState(() {
  //
  //             messageStatus = "Connection Failed";
  //           });
  //           await _flutterSerialCommunicationPlugin.disconnect();
  //
  //         }
  //       } else {
  //         setState(() {
  //           messageStatus = "No Connected Devices";
  //         });
  //       }
  //     }
  //
  //     }
  //   } on PlatformException {
  //     barcodeScanRes = 'Failed to get platform version.';
  //   }
  // }

  // Future<void> scanBarcode(String name) async {
  //   String barcodeScanRes = _scanController.text.trim();
  //   _scanController.clear();
  //   setState(() {
  //     if (name == 'Compartment Scanner') {
  //       qBoxBarcode = barcodeScanRes;
  //       print('qBoxBarcode$qBoxBarcode');
  //     } else if (name == 'Food Scanner') {
  //       foodBarcode = barcodeScanRes;
  //     }
  //   });
  //
  //   if (name == 'Compartment Scanner') {
  //     try {
  //       // Fetch hexCode from API
  //       String hexCode = await fetchHexCodeFromApi(entitySno!, qBoxBarcode);
  //       print('hexCode$hexCode');
  //
  //       // Check if hexCode is null or empty
  //       if (hexCode.isEmpty) {
  //         // Show a toast message indicating no hexCode is available
  //         ScaffoldMessenger.of(context).showSnackBar(
  //           SnackBar(content: Text('No Hexcode')),
  //         );
  //         return; // Stop further execution
  //       }
  //
  //       // Convert hexCode to bytes
  //       List<int> messageBytes = hexStringToBytes(hexCode);
  //       print('messageBytes$messageBytes');
  //       List<String> hexStrings = toHexStrings(messageBytes);
  //       print('messageBytes in hex: $hexStrings');
  //
  //       // Get connected devices
  //       List<DeviceInfo> connectedDevices =
  //       await _flutterSerialCommunicationPlugin.getAvailableDevices();
  //       print('connectedDevices$connectedDevices');
  //
  //       if (connectedDevices.isNotEmpty) {
  //         print('connectedDevices[0]${connectedDevices[0]}');
  //         bool isConnectionSuccess =
  //         await _flutterSerialCommunicationPlugin.connect(
  //             connectedDevices[0], 9600);
  //         print('isConnectionSucc$isConnectionSuccess');
  //         setState(() {
  //           isConnected = isConnectionSuccess;
  //         });
  //         print('isConnectionSuccess$isConnectionSuccess');
  //
  //         if (isConnectionSuccess) {
  //           bool isMessageSent =
  //           await _flutterSerialCommunicationPlugin.write(
  //               Uint8List.fromList(messageBytes));
  //           setState(() {
  //             messageStatus =
  //             isMessageSent ? "Message Sent Successfully" : "Message Sending Failed";
  //           });
  //           debugPrint("Is Message Sent:  $isMessageSent");
  //           await _flutterSerialCommunicationPlugin.disconnect();
  //         } else {
  //           setState(() {
  //             messageStatus = "Connection Failed";
  //           });
  //           await _flutterSerialCommunicationPlugin.disconnect();
  //         }
  //       } else {
  //         setState(() {
  //           messageStatus = "No Connected Devices";
  //         });
  //       }
  //     } catch (e) {
  //       // Handle any errors that occur during the process
  //       print('Error: $e');
  //       ScaffoldMessenger.of(context).showSnackBar(
  //         SnackBar(content: Text('An error occurred: $e')),
  //       );
  //     }
  //   }
  // }

  void _startScan() {
    setState(() {
      _isLoading = true; // Start loading
      _scannedData = "Scanning...";
    });

    // Close the keyboard if it's open
    FocusScope.of(context).unfocus();

    // Debug print to check if the focus node is attached
    if (_scanFocusNode.context == null) {
      print('FocusNode is not attached to any context');
    } else {
      print('FocusNode is attached to a context');
    }

    // Delay the focus request until after the frame is rendered
    WidgetsBinding.instance.addPostFrameCallback((_) {
      FocusScope.of(context).requestFocus(_scanFocusNode);
      _scanController.addListener(_onScan);
      print('Focus requested');
    });

    print('_startScan called');
  }

  void _onScan() {
    print('_onScan called');
    _scanTimer?.cancel();
    _scanTimer = Timer(Duration(milliseconds: 300), () {
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
    scanBarcode(_currentScannerType);
  }


  Future<void> scanBarcode(String name) async {
    String barcodeScanRes = _scanController.text.trim();
    _scanController.clear();
    setState(() {
      if (name == 'Compartment Scanner') {
        qBoxBarcode = barcodeScanRes;
        print('qBoxBarcode: $qBoxBarcode');
      } else if (name == 'Food Scanner') {
        foodBarcode = barcodeScanRes;
      }
    });

    if (name == 'Compartment Scanner') {
      try {
        // Check if entitySno is null
        if (entitySno == null) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(content: Text('entitySno is null')),
          );
          return; // Stop further execution
        }

        // Fetch hexCode from API
        String? hexCode = await fetchHexCodeFromApi(entitySno!, qBoxBarcode,context);
        print('hexCode: $hexCode');

        // Check if hexCode is null or empty
        if (hexCode == null || hexCode.isEmpty) {
          commonService.errorToast('No Hexcode');
          return; // Stop further execution
        }

        // Convert hexCode to bytes
        List<int> messageBytes = hexStringToBytes(hexCode);
        print('messageBytes: $messageBytes');
        List<String> hexStrings = toHexStrings(messageBytes);
        print('messageBytes in hex: $hexStrings');

        // Get connected devices
        List<DeviceInfo> connectedDevices =
        await _flutterSerialCommunicationPlugin.getAvailableDevices();
        print('connectedDevices: $connectedDevices');

        if (connectedDevices.isNotEmpty) {
          print('connectedDevices[0]: ${connectedDevices[0]}');
          bool isConnectionSuccess =
          await _flutterSerialCommunicationPlugin.connect(
              connectedDevices[0], 9600);
          print('isConnectionSuccess: $isConnectionSuccess');
          setState(() {
            isConnected = isConnectionSuccess;
          });

          if (isConnectionSuccess) {
            // Convert messageBytes to Uint8List (byte format)
            Uint8List byteData = Uint8List.fromList(messageBytes);
            print('byteData${byteData}');
            // Send the byte data
            bool isMessageSent =
            await _flutterSerialCommunicationPlugin.write(byteData);
            setState(() {
              messageStatus =
              isMessageSent ? "Message Sent Successfully" : "Message Sending Failed";
            });
            debugPrint("Is Message Sent: $isMessageSent");
            await _flutterSerialCommunicationPlugin.disconnect();
          } else {
            setState(() {
              messageStatus = "Connection Failed";
            });
            await _flutterSerialCommunicationPlugin.disconnect();
          }
        } else {
          setState(() {
            messageStatus = "No Connected Devices";
          });
        }
      } catch (e) {
        print('Error: $e');
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('An error occurred: $e')),
        );
      }
    }
  }



// Helper function to show a toast message with better UI/UX
  Future<String?> fetchHexCodeFromApi(int qboxEntitySno, String boxCellSno, BuildContext context) async {
    Map<String, dynamic> params = {"qboxEntitySno": qboxEntitySno, "boxCellSno": boxCellSno};
    print('params: $params');

    try {
      var result = await _apiService.post(
        "8912",
        "masters",
        "search_box_cell",
        params,
      );
      print('result: $result');

      // Check if the result contains valid data
      if (result != null && result['isSuccess'] == true) {
        if (result['data'] != null && result['data'].isNotEmpty) {
          // Extract the openHex value
          String? openHex = result['data'][0]['openHex'];
          print('openHex: $openHex');

          // Check if openHex is null or empty
          if (openHex == null || openHex.isEmpty) {
            throw Exception('No Hexcode available for the given parameters');
          }

          // Return the valid openHex value
          return openHex;
        } else {
          // Handle case where data is null or empty
          throw Exception('Check Your box cell');
        }
      } else {
        // Handle case where API call is not successful
        throw Exception('Failed to fetch hex code from API');
      }
    } catch (e) {
      // Show the toast only once for any error
      commonService.errorToast('Check Your box cell');
      return null; // Return null to indicate failure
    }
  }



  // Future<String> fetchHexCodeFromApi(int qboxEntitySno, String boxCellSno) async {
  //   Map<String, dynamic> params = {"qboxEntitySno": qboxEntitySno, "boxCellSno": boxCellSno};
  //   print('params$params');
  //
  //   var result = await _apiService.post(
  //     "8912",
  //     "masters",
  //     "search_box_cell",
  //     params,
  //   );
  //   print('result$result');
  //
  //   // Check if the result contains valid data
  //   if (result != null && result['data'] != null && result['data'].isNotEmpty) {
  //     // Extract the openHex value
  //     String? openHex = result['data'][0]['openHex'];
  //     print('openHex: $openHex');
  //
  //     // Check if openHex is null or empty
  //     if (openHex == null || openHex.isEmpty) {
  //       throw Exception('No Hexcode available for the given parameters');
  //     }
  //
  //     // Return the valid openHex value
  //     return openHex;
  //   } else {
  //     throw Exception('Failed to fetch hex code from API');
  //   }
  // }

  List<int> hexStringToBytes(String hexString) {
    // Ensure the hex string has an even length
    if (hexString.length % 2 != 0) {
      hexString = '0$hexString'; // Pad with a leading zero
    }

    List<int> bytes = [];
    for (int i = 0; i < hexString.length; i += 2) {
      String hex = hexString.substring(i, i + 2);
      int byte = int.parse(hex, radix: 16);
      bytes.add(byte);
    }
    return bytes;
  }

  List<String> toHexStrings(List<int> bytes) {
    return bytes.map((byte) => '0x${byte.toRadixString(16).padLeft(2, '0').toUpperCase()}').toList();
  }


  @override
  void dispose() {
    _scanController.removeListener(_onScan);
    _scanController.dispose();
    _scanFocusNode.dispose();
    _scanTimer?.cancel();
    super.dispose();
  }

  loadToQBox() async {
    try {
      print('loadToQBox');
      Map<String, dynamic> body = {
        "uniqueCode": foodBarcode.trim(),
        "wfStageCd": 11,
        "boxCellSno": qBoxBarcode.trim(),
        "qboxEntitySno": entitySno
      };
      print('$body');

      var result = await apiService.post("8912", "masters", "load_sku_in_qbox", body);

      if (result == null) {
        commonService.presentToast('No data received from server');
        return;
      }

      if (result['data'] != null) {
        String loadingMessage = result['data']['skuloading'];
        switch (loadingMessage) {
          case 'inside qbox':
            qBoxBarcode = '';
            foodBarcode = '';
            commonService.presentToast('Food Loaded inside the qbox');
            break;
          case 'this box is already Loaded':
            commonService.errorToast('Check The Food Code');
            break;
          case 'Invalid Loaded':
            commonService.errorToast(body['uniqueCode'].length != foodBarcode.trim().length
                ? 'Check the uniqueCode'
                : 'Invalid loading attempt. Please check all inputs.');
            break;
          default:
            commonService.presentToast('Unexpected response: $loadingMessage');
        }
      } else if (result['error'] != null) {
        String errorMsg = result['error'] ?? '';
        if (errorMsg.contains("violates foreign key constraint \"box_cell_food_box_cell_sno_fkey\"")) {
          commonService.errorToast('Check the Box Cell');
        } else {
          commonService.errorToast('Error: ${result['errorMsg'] ?? 'Unknown error'}');
        }
      }
    } catch (e) {
      print('Error: $e');
      if (e.toString().contains("violates foreign key constraint \"box_cell_food_box_cell_sno_fkey\"")) {
        commonService.errorToast('Check the Box Cell');
      } else {
        commonService.presentToast('An error occurred: ${e.toString()}');
      }
    }
    setState(() {});
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Color(0xFFF5F7FA),
      body: Stack(
        children: [
          SafeArea(
            child: Padding(
              padding: EdgeInsets.symmetric(horizontal: 16),
              child: Column(
                children: [
                  _buildHeader(),
                  Expanded(
                    child: SingleChildScrollView(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          SizedBox(height: 18),
                          _buildWelcomeCard(),
                          SizedBox(height: 18),
                          _buildQuickActions(),
                          SizedBox(height: 18),
                          buildMergedHistoryCard(
                            qBoxBarcode,
                            foodBarcode,
                            Icons.inventory, // or whatever icon you use for container
                            Icons.fastfood,  // or whatever icon you use for food
                          ),
                          // TextField(
                          //   controller: _scanController,
                          //   focusNode: _scanFocusNode,
                          //   autofocus: false,
                          //   keyboardType: TextInputType.none,
                          // ),
                          // SizedBox(height: 20),
                          // Text(
                          //   'Scanned Data: $_scannedData', // Display scanned data
                          //   style: TextStyle(fontSize: 20),
                          // ),
                          Opacity(
                            opacity: 0,
                            child: TextField(
                              controller: _scanController,
                              focusNode: _scanFocusNode,
                              autofocus: false,
                              keyboardType: TextInputType.none,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),
          // Replace your current loading indicator with this code
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
      floatingActionButton: _buildMainActionButton(),
    );
  }

  Widget _buildHeader() {
    final isTablet = MediaQuery.of(context).size.shortestSide >= 600;
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Qeu Box & Food Scanner',
              style: TextStyle(
                fontSize: isTablet?28:18,
                fontWeight: FontWeight.bold,
                color: AppColors.black,
              ),
            ),
            Text(
              'Manage your inventory easily',
              style: TextStyle(
                color: Colors.grey[600],
                fontSize: 14,
              ),
            ),
          ],
        ),
        // Stack(
        //   children: [
        //     Container(
        //       decoration: BoxDecoration(
        //         color: Colors.white,
        //         borderRadius: BorderRadius.circular(12),
        //         boxShadow: [
        //           BoxShadow(
        //             color: Colors.red.withOpacity(0.1),
        //             blurRadius: 10,
        //             offset: Offset(0, 4),
        //           ),
        //         ],
        //       ),
        //       child: IconButton(
        //         icon: Icon(Icons.notifications_outlined, color: AppColors.mintGreen),
        //         onPressed: () {
        //           GoRouter.of(context).push(NotificationHistoryScreen.routeName);
        //         },
        //       ),
        //     ),
        //     if (isReadyToLoad)
        //       Positioned(
        //         right: 8,
        //         top: 8,
        //         child: Container(
        //           width: 12,
        //           height: 12,
        //           decoration: BoxDecoration(
        //             color: AppColors.mintGreen,
        //             shape: BoxShape.circle,
        //             border: Border.all(
        //               color: Colors.white,
        //               width: 2,
        //             ),
        //           ),
        //         ),
        //       ),
        //   ],
        // ),
      ],
    ).animate().fadeIn(duration: 500.ms);
  }

  Widget _buildWelcomeCard() {
    final isTablet = MediaQuery.of(context).size.shortestSide >= 600;
    return Container(
      padding: EdgeInsets.all(24),
      decoration: BoxDecoration(
          border: Border.all(color: Colors.grey.shade400),
          borderRadius: BorderRadius.circular(24),
          color: AppColors.white
      ),
      child: Row(
        children: [
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Container(
                  padding: EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                  decoration: BoxDecoration(
                    color: AppColors.mintGreen.withOpacity(0.2),
                    borderRadius: BorderRadius.circular(20),
                  ),
                  child: Text(
                    'Quick Scan',
                    style: TextStyle(
                      color: Colors.black,
                      fontSize: 12,
                      fontWeight: FontWeight.w500,
                    ),
                  ),
                ),
                SizedBox(height: 12),
                Text(
                  'Start Scanning',
                  style: TextStyle(
                    color: Colors.black,
                    fontSize: isTablet?24:18,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                SizedBox(height: 8),
                Text(
                  'Scan QR code to manage your inventory',
                  style: TextStyle(
                    color: Colors.grey.shade800,
                    fontSize: 14,
                  ),
                ),
              ],
            ),
          ),
          Container(
            padding: EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: Colors.green.shade50,
              shape: BoxShape.circle,
            ),
            child: Icon(
              Icons.qr_code_scanner,
              color: Colors.green,
              size: 45,
            ),
          ),
        ],
      ),
    ).animate().fadeIn(duration: 600.ms).slideY(begin: 0.2);
  }

  Widget _buildQuickActions() {
    final isTablet = MediaQuery.of(context).size.shortestSide >= 600;
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'Quick Actions',
          style: TextStyle(
            fontSize: isTablet?20:18,
            fontWeight: FontWeight.bold,
            color: Colors.grey[800],
          ),
        ),
        SizedBox(height: 16),
        if(isTablet)
          Row(
            children: [
              Expanded(
                child: _buildActionCard(
                    'Compartment Scanner',
                    'Tap to scan',
                    Colors.red,
                    Colors.red,
                    'https://media.istockphoto.com/id/1667322455/photo/self-service-post-terminal-customer-entering-a-code-and-receiving-the-parcel.jpg?s=612x612&w=0&k=20&c=pWBLg0uIwsKBV4KpL2Hv3CztzaXvoKSv5t0wEoPh9ZE=',
                    Icons.qr_code_scanner
                ),
              ),
              Expanded(
                child: _buildActionCard(
                  'Food Scanner',
                  'Tap to scan',
                  Colors.orange.shade600,
                  Colors.orange,
                  'https://eu-images.contentstack.com/v3/assets/blta023acee29658dfc/blt8bf49a9b70f2d4a1/659ee76ab24208040a0e07de/QR-sustainability-GettyImages-1422209464-web.jpg',
                  Icons.qr_code_scanner,
                ),
              ),
            ],
          )
        else
          Column(
            children: [
              _buildActionCard(
                  'Compartment Scanner',
                  'Tap to scan',
                  Colors.red,
                  Colors.red,
                  'https://media.istockphoto.com/id/1667322455/photo/self-service-post-terminal-customer-entering-a-code-and-receiving-the-parcel.jpg?s=612x612&w=0&k=20&c=pWBLg0uIwsKBV4KpL2Hv3CztzaXvoKSv5t0wEoPh9ZE=',
                  Icons.qr_code_scanner
              ),
              _buildActionCard(
                'Food Scanner',
                'Tap to scan',
                Colors.green,
                Colors.green,
                'https://eu-images.contentstack.com/v3/assets/blta023acee29658dfc/blt8bf49a9b70f2d4a1/659ee76ab24208040a0e07de/QR-sustainability-GettyImages-1422209464-web.jpg',
                Icons.qr_code_scanner,
              ),
            ],
          )
      ],
    ).animate().fadeIn(duration: 700.ms);
  }

  Widget _buildActionCard(String title, String subtitle, Color bgColor,Color subtitleColor,String imageUrl,IconData icon) {
    final isTablet = MediaQuery.of(context).size.shortestSide >= 600;
    return InkWell(
      onTap: () {
        setState(() {
          _currentScannerType = title;
          print('_currentScannerType$_currentScannerType');
        });
        _startScan();
      },
      // scanBarcode(title),
      child: Container(
        margin: const EdgeInsets.only(left: 8, bottom: 8),
        padding: const EdgeInsets.all(16.0),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(12.0),
          boxShadow: [
            BoxShadow(
              color: Colors.grey.withOpacity(0.2),
              spreadRadius: 1,
              blurRadius: 6,
              offset: const Offset(0, 3),
            ),
          ],
        ),
        child:
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Row(
              children: [
                Container(
                  width: isTablet?80:50,
                  height: isTablet?80:50,
                  decoration: BoxDecoration(
                    shape: BoxShape.rectangle,
                    color: Colors.white,
                    borderRadius: const BorderRadius.all(Radius.circular(12)),
                    boxShadow: [
                      BoxShadow(
                        color: Colors.grey.withOpacity(0.3),
                        spreadRadius: 2,
                        blurRadius: 5,
                        offset: const Offset(0, 2),
                      ),
                    ],
                    image: DecorationImage(
                      fit: BoxFit.cover,
                      image: NetworkImage(imageUrl),
                    ),
                  ),
                ),
                const SizedBox(width: 12),
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      title,
                      style: TextStyle(
                        fontSize: isTablet?18:14,
                        fontWeight: FontWeight.w500,
                      ),
                    ),
                    Text(
                      subtitle,
                      style: TextStyle(
                        fontSize: 14,
                        fontWeight: FontWeight.w500,
                        color: subtitleColor,
                      ),
                    ),
                  ],
                ),
              ],
            ),
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 16),
              decoration: BoxDecoration(
                color: bgColor,
                borderRadius: BorderRadius.circular(12),
              ),
              child: Icon(icon, color: Colors.white),
            ),
          ],
        ),
      ),
    );
  }

  Widget buildMergedHistoryCard(String containerCode, String foodCode, IconData containerIcon, IconData foodIcon) {
    if (containerCode.isEmpty && foodCode.isEmpty) {
      return SizedBox.shrink();
    }
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text("Scanned Result:",style: TextStyle(fontSize: 18,fontWeight: FontWeight.w500),),
        SizedBox(height: 8,),
        Container(
          margin: EdgeInsets.only(bottom: 12),
          padding: EdgeInsets.all(16),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(16),
            boxShadow: [
              BoxShadow(
                color: Colors.grey.withOpacity(0.1),
                blurRadius: 10,
                offset: Offset(0, 4),
              ),
            ],
          ),
          child: Column(
            children: [
              if (containerCode.isNotEmpty)
                _buildItemRow(
                  type: 'Compartment',
                  code: containerCode,
                  icon: containerIcon,
                  onDelete: () {
                    setState(() {
                      qBoxBarcode = '';
                    });
                  },
                ),
              if (containerCode.isNotEmpty && foodCode.isNotEmpty)
                Padding(
                  padding: EdgeInsets.symmetric(vertical: 8),
                  child: Divider(height: 1),
                ),
              if (foodCode.isNotEmpty)
                _buildItemRow(
                  type: 'Food Code',
                  code: foodCode,
                  icon: foodIcon,
                  onDelete: () {
                    setState(() {
                      foodBarcode = '';
                    });
                  },
                ),
            ],
          ),
        ),
      ],
    );
  }

  Widget _buildItemRow({
    required String type,
    required String code,
    required IconData icon,
    required VoidCallback onDelete,
  }) {
    return Row(
      children: [
        Container(
          padding: EdgeInsets.all(8),
          decoration: BoxDecoration(
            color: Color(0xFFFEE2E2),
            borderRadius: BorderRadius.circular(12),
          ),
          child: Icon(icon, color: AppColors.mintGreen, size: 20),
        ),
        SizedBox(width: 16),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                type,
                style: TextStyle(
                  fontSize: 14,
                  fontWeight: FontWeight.w500,
                  color: Colors.grey[700],
                ),
              ),
              SizedBox(height: 8,),
              Text(
                code,
                style: TextStyle(
                    fontSize: 14,
                    color: Colors.black,
                    fontWeight: FontWeight.w900
                ),
              ),
            ],
          ),
        ),
        IconButton(
          icon: Icon(Icons.close, size: 18, color: Colors.grey[400]),
          onPressed: onDelete,
        ),
      ],
    );
  }

  Widget _buildMainActionButton() {
    final bool isEnabled = qBoxBarcode.isNotEmpty && foodBarcode.isNotEmpty;
    return FloatingActionButton.extended(
      onPressed: isEnabled ? loadToQBox : null,
      backgroundColor: isEnabled ? AppColors.mintGreen : Colors.grey[300],
      label: Row(
        children: [
          Icon(Icons.add_box_rounded),
          SizedBox(width: 8),
          Text('Load Item'),
        ],
      ),
    ).animate().fadeIn(duration: 900.ms);
  }
}