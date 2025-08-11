import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:intl/intl.dart';
import 'package:provider/provider.dart';
import '../../../../../Provider/order_history_provider.dart';
import '../../../../../Services/token_service.dart';
import '../../../../../Widgets/Custom/app_colors.dart';
import '../../../../../Widgets/Common/no-data-found.dart';
import '../../../../../Widgets/Custom/rich_text.dart';

class OutwardOrderHistoryCard extends StatefulWidget {
  const OutwardOrderHistoryCard({super.key});

  @override
  State<OutwardOrderHistoryCard> createState() => _OutwardOrderHistoryCardState();
}

class _OutwardOrderHistoryCardState extends State<OutwardOrderHistoryCard> {
  TokenService tokenService = TokenService();
  int? entitySno;

  @override
  void initState(){
    getEntitySno();
    super.initState();
  }

  getEntitySno() async {
    if (!mounted) return;
    entitySno = await tokenService.getQboxEntitySno();
    print("outwardSno$entitySno");
    final provider = Provider.of<OrderHistoryProvider>(context, listen: false);
    if (entitySno != null) {
      print("Hi there!");
      await provider.fetchOutwardOrderItems(entitySno!);
    } else {
      print('No qboxEntitySno found');
    }
  }

  @override
  Widget build(BuildContext context) {
    return Consumer<OrderHistoryProvider>(
      builder: (context, orderProvider, child) {
        if (orderProvider.isLoading) {
          return Center(child: CircularProgressIndicator(color: AppColors.mintGreen,));
        }
        if (orderProvider.salesOrder.isEmpty) {
          return NoDataFound(title: "outward order histories");
        }
        return Padding(
          padding: const EdgeInsets.all(16.0),
          child: ListView.builder(
            itemCount: orderProvider.salesOrder.length,
            itemBuilder: (context, index) {
              final order = orderProvider.salesOrder[index] is Map
                  ? orderProvider.salesOrder[index] as Map<String, dynamic>
                  : <String, dynamic>{};

              final salesOrder = order['salesOrder'] is Map
                  ? order['salesOrder'] as Map<String, dynamic>
                  : <String, dynamic>{};

              final salesOrderDtls = order['salesOrderDtls'] is List
                  ? order['salesOrderDtls'] as List<dynamic>
                  : <dynamic>[];

              final isExpanded = orderProvider.expandedOutwardIndices.contains(index);
              final isTablet = MediaQuery.of(context).size.shortestSide >= 600;
              return Container(
                margin: EdgeInsets.symmetric(vertical: 8),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(12.0),
                  boxShadow: [
                    BoxShadow(
                      color: Colors.grey.withOpacity(0.2),
                      spreadRadius: 1,
                      blurRadius: 6,
                      offset: Offset(0, 3),
                    ),
                  ],
                ),
                child: ExpansionTile(
                  initiallyExpanded: true,
                  textColor: Colors.red,
                  leading: Icon(Icons.history,size: 30,),
                  iconColor: Colors.red,
                  title: Text(
                    'Order ID: ${salesOrder['partnerSalesOrderId']?.toString() ?? ''}',
                    style: TextStyle(fontWeight: FontWeight.bold),
                  ),
                  subtitle: Text(
                    'Delivered: ${salesOrder['deliveredTime'] != null? DateFormat('MMM dd, yyyy').format(
                        DateTime.parse(salesOrder['deliveredTime']
                            .toString()))
                    : 'N/A'}',
                    style: TextStyle(color: Colors.grey),
                  ),
                  children: [
                    ListView.separated(
                      shrinkWrap: true,
                      physics: NeverScrollableScrollPhysics(),
                      itemCount: salesOrderDtls.length,
                      separatorBuilder: (context, index) => Divider(height: 1),
                      itemBuilder: (context, detailIndex) {
                        var orderDetail = salesOrderDtls[detailIndex];
                        final skuInventory =
                            (orderDetail['skuInventory'] as List<dynamic>?) ?? [];
                        final firstSku = skuInventory.isNotEmpty &&
                            skuInventory[0] is Map
                            ? skuInventory[0] as Map<String, dynamic>
                            : <String, dynamic>{};
                        return Padding(
                          padding: const EdgeInsets.all(16.0),
                          child: Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            crossAxisAlignment: CrossAxisAlignment.center,
                            children: [
                              Flexible(
                                child: Container(
                                  padding: EdgeInsets.symmetric(horizontal: 8, vertical: 4), // Optional padding
                                  decoration: BoxDecoration(
                                    color: Colors.green.shade50,
                                    borderRadius: BorderRadius.circular(20),
                                  ),
                                  child: Text(
                                    firstSku['skuDescription']?.toString() ??
                                        'N/A',
                                    style: TextStyle(
                                      fontSize: isTablet ? 16 : 14,
                                      color: Colors.green.shade700,
                                      fontWeight: FontWeight.bold,
                                    ),
                                    overflow: TextOverflow.ellipsis, // Ensures text doesn't overflow
                                  ),
                                ),
                              ),
                              AppTwoText(
                                firstText: "Qty: ",
                                secondText: '${orderDetail['orderQuantity']}',
                                fontSize: 14,
                                firstColor: AppColors.lightBlack,
                                secondColor: AppColors.black,
                              ),
                            ],
                          ),
                        );
                      },
                    ),
                  ],
                ),
              );
            },
          ),
        );
      },
    );
  }
}