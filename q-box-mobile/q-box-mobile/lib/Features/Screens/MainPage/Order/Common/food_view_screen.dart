import 'dart:io';
import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';
import 'package:qr_page/Services/api_service.dart';
import 'package:qr_page/Services/toast_service.dart';
import 'package:qr_page/Widgets/Custom/app_colors.dart';
import '../../../../../Services/socketService.dart';

class FoodViewScreen extends StatefulWidget {
  final int purchaseOrderSno;
  const FoodViewScreen({
    Key? key,
    required this.purchaseOrderSno,
  }) : super(key: key);

  @override
  _FoodViewScreenState createState() => _FoodViewScreenState();
}

class _FoodViewScreenState extends State<FoodViewScreen> {
  bool isLoading = true;
  List<Map<String, dynamic>> orderDetailsList = [];
  Map<int, List<Map<String, dynamic>>> inventoryItemsMap = {};
  Map<int, bool> expandedStates = {};
  final ApiService apiService = ApiService();
  final ImagePicker _picker = ImagePicker();
  List<File> selectedImages = [];
  TextEditingController rejectionReasonController = TextEditingController();
  final CommonService commonService = CommonService();
  List<Map<String, dynamic>>? inventoryItems;

  // Add this variable to store rejection reasons from API
  List<Map<String, dynamic>> rejectionReasonsList = [];

  @override
  void initState() {
    super.initState();
    fetchData();
    fetchRejection();
  }

  Future<void> fetchData() async {
    try {
      final orderResponse = await apiService.post(
          '8912',
          'masters',
          'search_purchase_order_dtl',
          {"purchaseOrderSno": widget.purchaseOrderSno});

      if (orderResponse['data'] != null && orderResponse['data'] is List) {
        orderDetailsList = List<Map<String, dynamic>>.from(orderResponse['data']);
        for (var order in orderDetailsList) {
          int purchaseOrderDtlSno = order['purchaseOrderDtlSno'];
          expandedStates[purchaseOrderDtlSno] = false;
          final inventoryResponse = await apiService.post(
              '8912',
              'masters',
              'search_sku_inventory',
              {"purchaseOrderDtlSno": purchaseOrderDtlSno});
          if (inventoryResponse['data'] != null) {
            inventoryItemsMap[purchaseOrderDtlSno] =
            List<Map<String, dynamic>>.from(inventoryResponse['data']);
          }
        }
      }
    } catch (e) {
      print('Error fetching data: $e');
    } finally {
      setState(() {
        isLoading = false;
      });
    }
  }

  // Modified fetchRejection method to store rejection reasons properly
  Future<void> fetchRejection() async {
    try {
      final orderResponse = await apiService.post(
          '8911',
          'masters',
          'get_reject_reason',
          {});
    print("orderResponse$orderResponse");
      if (orderResponse['data'] != null && orderResponse['data'] is List) {
        // Store rejection reasons in separate list, not orderDetailsList
        rejectionReasonsList = List<Map<String, dynamic>>.from(orderResponse['data']);
        print('Rejection reasons fetched: $rejectionReasonsList');
      }
    } catch (e) {
      print('Error fetching rejection reasons: $e');
    }
  }

  // Rest of your existing methods remain the same until _showRejectionDialog

  Future<void> _showRejectionDialog(int skuInventorySno, int purchaseOrderDtlSno) async {
    selectedImages.clear();
    rejectionReasonController.clear();

    String? selectedReason;
    bool showCustomReasonField = false;

    await showDialog(
      context: context,
      barrierDismissible: false,
      builder: (BuildContext context) {
        return StatefulBuilder(
          builder: (context, setState) {
            return Dialog(
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(16),
              ),
              child: ConstrainedBox(
                constraints: BoxConstraints(
                  maxHeight: MediaQuery.of(context).size.height * 0.8,
                  maxWidth: MediaQuery.of(context).size.width * 0.9,
                ),
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Padding(
                      padding: const EdgeInsets.all(16.0),
                      child: Row(
                        children: [
                          Text(
                            'Reject Food Item',
                            style: TextStyle(
                              fontSize: 18,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                          Spacer(),
                          IconButton(
                            icon: Icon(Icons.close),
                            onPressed: () => Navigator.pop(context),
                          ),
                        ],
                      ),
                    ),
                    Divider(height: 1),
                    Flexible(
                      child: SingleChildScrollView(
                        padding: EdgeInsets.all(16),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            // Modified dropdown to use API data
                            if (!showCustomReasonField)
                              DropdownButtonFormField<String>(
                                value: selectedReason,
                                decoration: InputDecoration(
                                  hintText: 'Select rejection reason',
                                  border: OutlineInputBorder(),
                                  filled: true,
                                  fillColor: Colors.grey[50],
                                ),
                                items: [
                                  // Add rejection reasons from API
                                  ...rejectionReasonsList.map((reason) {
                                    return DropdownMenuItem<String>(
                                      value: reason['rejectReason'],
                                      child: Text(reason['rejectReason']),
                                    );
                                  }).toList(),
                                  // Add "Other" option
                                  // DropdownMenuItem<String>(
                                  //   value: 'Other',
                                  //   child: Text('Other'),
                                  // ),
                                ],
                                onChanged: (String? value) {
                                  setState(() {
                                    selectedReason = value;
                                    // if (value == 'Other') {
                                    //   showCustomReasonField = true;
                                    // } else {
                                    //   rejectionReasonController.text = value ?? '';
                                    // }
                                  });
                                },
                              ),
                            // Show TextField if "Other" is selected
                            // if (showCustomReasonField)
                            //   Column(
                            //     children: [
                            //       // Show selected "Other" option
                            //       Container(
                            //         width: double.infinity,
                            //         padding: EdgeInsets.all(12),
                            //         decoration: BoxDecoration(
                            //           border: Border.all(color: Colors.grey),
                            //           borderRadius: BorderRadius.circular(4),
                            //           color: Colors.grey[50],
                            //         ),
                            //         child: Row(
                            //           mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            //           children: [
                            //             Text('Other'),
                            //             GestureDetector(
                            //               onTap: () {
                            //                 setState(() {
                            //                   showCustomReasonField = false;
                            //                   selectedReason = null;
                            //                   rejectionReasonController.clear();
                            //                 });
                            //               },
                            //               child: Icon(Icons.close, size: 20),
                            //             ),
                            //           ],
                            //         ),
                            //       ),
                            //       SizedBox(height: 8),
                            //       TextField(
                            //         controller: rejectionReasonController,
                            //         maxLines: 3,
                            //         decoration: InputDecoration(
                            //           hintText: 'Enter custom rejection reason',
                            //           border: OutlineInputBorder(),
                            //           filled: true,
                            //           fillColor: Colors.grey[50],
                            //         ),
                            //       ),
                            //     ],
                            //   ),
                            SizedBox(height: 16),
                            Text(
                              'Add Photos (Optional)',
                              style: TextStyle(
                                fontWeight: FontWeight.bold,
                                fontSize: 16,
                              ),
                            ),
                            SizedBox(height: 8),
                            SizedBox(
                              height: 100,
                              child: ListView(
                                scrollDirection: Axis.horizontal,
                                children: [
                                  ...selectedImages
                                      .map(
                                        (image) => Padding(
                                      padding: const EdgeInsets.only(right: 8),
                                      child: Stack(
                                        children: [
                                          Container(
                                            width: 100,
                                            height: 100,
                                            decoration: BoxDecoration(
                                              borderRadius: BorderRadius.circular(8),
                                              image: DecorationImage(
                                                image: FileImage(image),
                                                fit: BoxFit.cover,
                                              ),
                                            ),
                                          ),
                                          Positioned(
                                            right: 0,
                                            top: 0,
                                            child: Container(
                                              decoration: BoxDecoration(
                                                color: Colors.white,
                                                shape: BoxShape.circle,
                                              ),
                                              child: IconButton(
                                                icon: Icon(Icons.close, color: Colors.red, size: 20),
                                                onPressed: () {
                                                  setState(() {
                                                    selectedImages.remove(image);
                                                  });
                                                },
                                              ),
                                            ),
                                          ),
                                        ],
                                      ),
                                    ),
                                  )
                                      .toList(),
                                  if (selectedImages.length < 3)
                                    InkWell(
                                      onTap: () async {
                                        final XFile? image = await _picker.pickImage(
                                          source: ImageSource.camera,
                                          imageQuality: 70,
                                        );
                                        if (image != null) {
                                          setState(() {
                                            selectedImages.add(File(image.path));
                                          });
                                        }
                                      },
                                      child: Container(
                                        width: 100,
                                        height: 100,
                                        decoration: BoxDecoration(
                                          color: Colors.grey[200],
                                          borderRadius: BorderRadius.circular(8),
                                        ),
                                        child: Icon(
                                          Icons.camera_alt,
                                          color: Colors.grey[600],
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
                    Divider(height: 1),
                    Padding(
                      padding: const EdgeInsets.all(16.0),
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.end,
                        children: [
                          TextButton(
                            child: Text(
                              'Cancel',
                              style: TextStyle(color: AppColors.black),
                            ),
                            onPressed: () => Navigator.pop(context),
                          ),
                          SizedBox(width: 8),
                          ElevatedButton(
                            style: ElevatedButton.styleFrom(
                              backgroundColor: Colors.red,
                              foregroundColor: Colors.white,
                            ),
                            child: Text('Reject'),
                            onPressed: () async {
                              if (selectedReason == null || selectedReason!.isEmpty) {
                                commonService.errorToast('Please select a rejection reason');
                                return;
                              }
                              // if (selectedReason == 'Other' && rejectionReasonController.text.trim().isEmpty) {
                              //   commonService.errorToast('Please enter a custom rejection reason');
                              //   return;
                              // }
                              final String rejectionReason = selectedReason!;
                              Navigator.pop(context);
                              await _submitRejection(skuInventorySno, rejectionReason, selectedImages, purchaseOrderDtlSno);
                            },
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
            );
          },
        );
      },
    );
  }

  // Rest of your existing methods remain the same...
  Future<void> acceptFood(int skuInventorySno, int purchaseOrderDtlSno) async {
    try {
      final result = await apiService.post('8912', 'masters', 'accept_sku',
          {"skuInventorySno": skuInventorySno});
      if (result['data'] != null) {
        setState(() {
          inventoryItemsMap[purchaseOrderDtlSno] =
          List<Map<String, dynamic>>.from(result['data']);
        });
      }
    } catch (e) {
      print('Error accepting food: $e');
    }
  }

  Future<void> rejectFood(int skuInventorySno, int purchaseOrderDtlSno) async {
    await _showRejectionDialog(skuInventorySno, purchaseOrderDtlSno);
  }

  Future<void> _submitRejection(int skuInventorySno, String reason, List<File> images, int purchaseOrderDtlSno) async {
    try {
      print('Preparing to submit rejection...');
      final SocketService webSocketService = SocketService();
      Map<String, dynamic> additionalData = {
        "skuInventorySno": skuInventorySno,
        "rejectionReason": reason,
        "purchaseOrderSno": widget.purchaseOrderSno,
      };
      print("additionalData$additionalData");
      List<FileUpload> uploadedFiles = [];
      if (images.isNotEmpty) {
        uploadedFiles = await webSocketService.send(
          additionalData: additionalData,
          files: images,
        );
      }
      print('uploadedFiles: $uploadedFiles');
      List<Map<String, dynamic>> imageData = uploadedFiles.map((file) => file.toJson()).toList();
      Map<String, dynamic> profileMediaObj = {
        "mediaSno": null,
        "containerName": "rejectImage",
        "deleteMediaList": [],
        "mediaList": imageData,
      };
      final rejectionData = {
        "skuInventorySno": skuInventorySno,
        "rejectionReason": reason,
        "purchaseOrderSno": widget.purchaseOrderSno,
      };
      // Only include images if they exist
      if (imageData.isNotEmpty) {
        rejectionData['images'] = profileMediaObj;
      }
      print('Rejection data prepared: $rejectionData');
      final result = await apiService.post(
        '8912',
        'masters',
        'reject_sku',
        rejectionData,
      );
      if (result['data'] != null) {
        setState(() {
          inventoryItemsMap[purchaseOrderDtlSno] = List<Map<String, dynamic>>.from(result['data']);
        });
        print('inventoryItems$inventoryItems');
        commonService.presentToast('Item rejected successfully');
      }
    } catch (e) {
      print('Error in submitting rejection: $e');
      commonService.presentToast('Failed to reject item: ${e.toString()}');
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.grey[100],
      appBar: AppBar(
        elevation: 0,
        backgroundColor: Colors.white,
        title: Text(
          'Food Details',
          style: TextStyle(
            color: Colors.black87,
            fontWeight: FontWeight.w600,
          ),
        ),
        leading: IconButton(
          icon: Icon(Icons.arrow_back_ios, color: Colors.black87),
          onPressed: () => Navigator.pop(context),
        ),
      ),
      body: isLoading
          ? Center(child: _buildLoadingIndicator())
          : orderDetailsList.isEmpty
          ? Center(child: Text('No data available'))
          : SingleChildScrollView(
        child: Column(
          children: orderDetailsList.map((orderDetails) {
            int purchaseOrderDtlSno = orderDetails['purchaseOrderDtlSno'];
            return Column(
              children: [
                _buildFoodDetailsCard(orderDetails),
                SizedBox(height: 16),
                _buildInventoryList(
                  purchaseOrderDtlSno,
                  inventoryItemsMap[purchaseOrderDtlSno] ?? [],
                  expandedStates[purchaseOrderDtlSno] ?? false,
                ),
                SizedBox(height: 16),
              ],
            );
          }).toList(),
        ),
      ),
    );
  }

  Widget _buildInventoryList(int purchaseOrderDtlSno, List<Map<String, dynamic>> items, bool isExpanded) {
    return Column(
      children: [
        Container(
          margin: EdgeInsets.symmetric(horizontal: 16),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(20),
            boxShadow: [
              BoxShadow(
                color: Colors.black.withOpacity(0.05),
                blurRadius: 15,
                offset: Offset(0, 5),
              ),
            ],
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              InkWell(
                onTap: () {
                  setState(() {
                    expandedStates[purchaseOrderDtlSno] = !(expandedStates[purchaseOrderDtlSno] ?? false);
                  });
                },
                child: Padding(
                  padding: EdgeInsets.all(20),
                  child: Row(
                    children: [
                      Icon(
                        Icons.inventory_2,
                        color: AppColors.mintGreen,
                        size: 24,
                      ),
                      SizedBox(width: 12),
                      Expanded(
                        child: Text(
                          'Inventory Items (${items.length})',
                          style: TextStyle(
                            fontSize: 18,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ),
                      Icon(
                        isExpanded ? Icons.expand_less : Icons.expand_more,
                        color: Colors.grey[600],
                      ),
                    ],
                  ),
                ),
              ),
              if (isExpanded) ...[
                Divider(height: 1),
                ListView.builder(
                  shrinkWrap: true,
                  physics: NeverScrollableScrollPhysics(),
                  itemCount: items.length,
                  itemBuilder: (context, index) {
                    return _buildInventoryItem(items[index], index, purchaseOrderDtlSno);
                  },
                ),
              ],
            ],
          ),
        ),
      ],
    );
  }

  Widget _buildInventoryItem(Map<String, dynamic> item, int index, int purchaseOrderDtlSno) {
    final isTablet = MediaQuery.of(context).size.shortestSide >= 600;
    return isTablet
        ? Container(
      padding: EdgeInsets.all(16),
      decoration: BoxDecoration(
        border: Border(
          bottom: BorderSide(
            color: Colors.grey[200]!,
            width: 1,
          ),
        ),
      ),
      child: Row(
        children: [
          Container(
            width: 40,
            height: 40,
            decoration: BoxDecoration(
              color: AppColors.mintGreen.withOpacity(0.1),
              borderRadius: BorderRadius.circular(8),
            ),
            child: Center(
              child: Text(
                '${index + 1}',
                style: TextStyle(
                  color: AppColors.mintGreen,
                  fontWeight: FontWeight.bold,
                  fontSize: 16,
                ),
              ),
            ),
          ),
          SizedBox(width: 16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  item['uniqueCode'],
                  style: TextStyle(
                    fontWeight: FontWeight.w500,
                    fontSize: 14,
                  ),
                ),
                SizedBox(height: 4),
                Text(
                  'Stage: ${_getStageText(item['wfStageCd'])}',
                  style: TextStyle(
                    color: item['wfStageCd'] == 10
                        ? Colors.green[600]
                        : item['wfStageCd'] == 8
                        ? Colors.red[600]
                        : Colors.grey[600],
                    fontSize: 12,
                  ),
                ),
              ],
            ),
          ),
          item['wfStageCd'] == 7
              ? Row(
            mainAxisAlignment: MainAxisAlignment.center,
            crossAxisAlignment: CrossAxisAlignment.center,
            children: [
              Container(
                margin: EdgeInsets.symmetric(horizontal: 10),
                child: ElevatedButton.icon(
                  style: ElevatedButton.styleFrom(
                    foregroundColor: Colors.white,
                    backgroundColor: Colors.green,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(10),
                    ),
                    padding: EdgeInsets.symmetric(
                        horizontal: 20, vertical: 12),
                    elevation: 0,
                    shadowColor: Colors.greenAccent,
                  ),
                  icon: Icon(Icons.check,
                      size: 20, color: Colors.white),
                  label: Text(
                    "Accept",
                    style: TextStyle(
                        fontSize: 16, fontWeight: FontWeight.bold),
                  ),
                  onPressed: () {
                    acceptFood(item['skuInventorySno'], purchaseOrderDtlSno);
                  },
                ),
              ),
              Container(
                margin: EdgeInsets.symmetric(horizontal: 10),
                child: ElevatedButton.icon(
                  style: ElevatedButton.styleFrom(
                    foregroundColor: Colors.white,
                    backgroundColor: Colors.red,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(10),
                    ),
                    padding: EdgeInsets.symmetric(
                        horizontal: 20, vertical: 12),
                    elevation: 0,
                    shadowColor: Colors.redAccent,
                  ),
                  icon: Icon(Icons.close,
                      size: 20, color: Colors.white),
                  label: Text(
                    "Reject",
                    style: TextStyle(
                        fontSize: 16, fontWeight: FontWeight.bold),
                  ),
                  onPressed: () {
                    rejectFood(item['skuInventorySno'], purchaseOrderDtlSno);
                  },
                ),
              ),
            ],
          )
              : Container()
        ],
      ),
    )
        : Container(
      padding: EdgeInsets.all(16),
      decoration: BoxDecoration(
        border: Border(
          bottom: BorderSide(
            color: Colors.grey[200]!,
            width: 1,
          ),
        ),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Container(
                width: 40,
                height: 40,
                decoration: BoxDecoration(
                  color: AppColors.mintGreen.withOpacity(0.1),
                  borderRadius: BorderRadius.circular(8),
                ),
                child: Center(
                  child: Text(
                    '${index + 1}',
                    style: TextStyle(
                      color: AppColors.mintGreen,
                      fontWeight: FontWeight.bold,
                      fontSize: 16,
                    ),
                  ),
                ),
              ),
              SizedBox(width: 16),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      item['uniqueCode'],
                      style: TextStyle(
                        fontWeight: FontWeight.w500,
                        fontSize: 14,
                      ),
                    ),
                    SizedBox(height: 4),
                    Text(
                      'Stage: ${_getStageText(item['wfStageCd'])}',
                      style: TextStyle(
                        color: item['wfStageCd'] == 10
                            ? Colors.green[600]
                            : item['wfStageCd'] == 8
                            ? Colors.red[600]
                            : Colors.grey[600],
                        fontSize: 12,
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
          item['wfStageCd'] == 7
              ? Row(
            mainAxisAlignment: MainAxisAlignment.end,
            crossAxisAlignment: CrossAxisAlignment.center,
            children: [
              Container(
                margin: EdgeInsets.symmetric(
                    horizontal: 10, vertical: 10),
                child: ElevatedButton.icon(
                  style: ElevatedButton.styleFrom(
                    foregroundColor: Colors.white,
                    backgroundColor: Colors.green,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(10),
                    ),
                    padding: EdgeInsets.symmetric(
                        horizontal: 12, vertical: 12),
                    elevation: 0,
                    shadowColor: Colors.greenAccent,
                  ),
                  icon: Icon(Icons.check,
                      size: 20, color: Colors.white),
                  label: Text(
                    "Accept",
                    style: TextStyle(
                        fontSize: 14, fontWeight: FontWeight.bold),
                  ),
                  onPressed: () {
                    acceptFood(item['skuInventorySno'], purchaseOrderDtlSno);
                  },
                ),
              ),
              Container(
                margin: EdgeInsets.symmetric(
                    horizontal: 10, vertical: 10),
                child: ElevatedButton.icon(
                  style: ElevatedButton.styleFrom(
                    foregroundColor: Colors.white,
                    backgroundColor: Colors.red,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(10),
                    ),
                    padding: EdgeInsets.symmetric(
                        horizontal: 12, vertical: 12),
                    elevation: 0,
                    shadowColor: Colors.redAccent,
                  ),
                  icon: Icon(Icons.close,
                      size: 20, color: Colors.white),
                  label: Text(
                    "Reject",
                    style: TextStyle(
                        fontSize: 14, fontWeight: FontWeight.bold),
                  ),
                  onPressed: () {
                    rejectFood(item['skuInventorySno'], purchaseOrderDtlSno);
                  },
                ),
              ),
            ],
          )
              : Container()
        ],
      ),
    );
  }

  Widget _buildLoadingIndicator() {
    return Container(
      padding: EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(12),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.05),
            blurRadius: 10,
            offset: Offset(0, 5),
          ),
        ],
      ),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          CircularProgressIndicator(
            valueColor: AlwaysStoppedAnimation<Color>(AppColors.mintGreen),
          ),
          SizedBox(height: 16),
          Text(
            'Loading food details...',
            style: TextStyle(
              color: Colors.grey[600],
              fontSize: 16,
            ),
          ),
        ],
      ),
    );
  }

  String _getStageText(int stageCd) {
    switch (stageCd) {
      case 6:
        return "Pending";
      case 7:
        return 'In Progress';
      case 8:
        return 'Rejected';
      case 10:
        return 'Accepted';
      case 12:
        return 'Sku returned to Hot box';
      case 11:
        return 'Sku loaded in Q-box';
      case 13:
        return 'Outward Delivery Picked up';
      default:
        return 'Unknown Stage';
    }
  }

  Widget _buildFoodDetailsCard(Map<String, dynamic> orderDetails) {
    return Container(
      margin: EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.05),
            blurRadius: 15,
            offset: Offset(0, 5),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            padding: EdgeInsets.all(20),
            decoration: BoxDecoration(
              color: AppColors.mintGreen,
              borderRadius: BorderRadius.only(
                topLeft: Radius.circular(20),
                topRight: Radius.circular(20),
              ),
            ),
            child: Row(
              children: [
                Icon(
                  Icons.fastfood_outlined,
                  color: Colors.white,
                  size: 24,
                ),
                SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        orderDetails!['partnerFoodCode'],
                        style: TextStyle(
                          color: Colors.white,
                          fontSize: 24,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
          Padding(
            padding: EdgeInsets.all(20),
            child: Column(
              children: [
                _buildInfoRow(
                  'Order Quantity',
                  '${orderDetails!['orderQuantity']} items',
                  Icons.shopping_cart,
                ),
                SizedBox(height: 16),
                _buildInfoRow(
                  'Accepted Quantity',
                  '${orderDetails!['acceptedQuantity']} items',
                  Icons.check_circle,
                ),
                SizedBox(height: 16),
                _buildInfoRow(
                  'Total Amount',
                  '₹${orderDetails!['skuPrice'] * orderDetails!['orderQuantity']}',
                  Icons.account_balance_wallet,
                  isHighlighted: true,
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildInfoRow(String label, String value, IconData icon,
      {bool isHighlighted = false}) {
    return Container(
      padding: EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: isHighlighted
            ? AppColors.mintGreen.withOpacity(0.1)
            : Colors.grey[50],
        borderRadius: BorderRadius.circular(12),
        border: Border.all(
          color: isHighlighted
              ? AppColors.mintGreen.withOpacity(0.3)
              : Colors.grey[200]!,
        ),
      ),
      child: Row(
        children: [
          Container(
            padding: EdgeInsets.all(8),
            decoration: BoxDecoration(
              color: isHighlighted ? AppColors.mintGreen : Colors.grey[100],
              borderRadius: BorderRadius.circular(8),
            ),
            child: Icon(
              icon,
              color: isHighlighted ? Colors.white : Colors.grey[600],
              size: 20,
            ),
          ),
          SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  label,
                  style: TextStyle(
                    color: Colors.grey[600],
                    fontSize: 14,
                  ),
                ),
                SizedBox(height: 4),
                Text(
                  value,
                  style: TextStyle(
                    color: isHighlighted ? AppColors.mintGreen : Colors.black87,
                    fontSize: 16,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
