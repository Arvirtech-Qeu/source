import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';
import 'package:qr_page/Widgets/Common/no-data-found.dart';
import '../../../../../Provider/inward_order_provider.dart';
import '../../../../../Widgets/Custom/app_colors.dart';
import '../Common/order_card.dart';

class ViewOrder extends StatefulWidget {
  static const String routeName = '/view-order';
  final String? partnerPurchaseOrderId;

  const ViewOrder({super.key, this.partnerPurchaseOrderId});

  @override
  State<ViewOrder> createState() => _ViewOrderState();
}

class _ViewOrderState extends State<ViewOrder> {
  @override
  void initState() {
    super.initState();
    print('widget.partnerPurchaseOrderId: ${widget.partnerPurchaseOrderId}');
    WidgetsBinding.instance.addPostFrameCallback((_) {
      context
          .read<InwardOrderDtlProvider>()
          .getTotalItems(widget.partnerPurchaseOrderId);
    });
  }

  @override
  Widget build(BuildContext context) {
    return SafeArea(
      child: Scaffold(
        appBar: AppBar(
          elevation: 0,
          iconTheme: IconThemeData(color: AppColors.black),
          backgroundColor: Colors.transparent,
          title: Text('Inward Orders', style: TextStyle(color: Colors.black)),
          leading: IconButton(
            icon: Icon(Icons.arrow_back_ios, color: Colors.black87),
            onPressed: () => Navigator.pop(context),
          ),
        ),
        body: Consumer<InwardOrderDtlProvider>(
          builder: (context, provider, child) {
            if (provider.isLoading) {
              return const Center(
                child: CircularProgressIndicator(
                  color: AppColors.mintGreen,
                ),
              );
            }

            if (provider.error != null) {
              return Center(
                child: Text(
                  provider.error!,
                  style: TextStyle(color: Colors.red, fontSize: 16),
                ),
              );
            }

            if (provider.purchaseOrders.isEmpty) {
              return NoDataFound(title: "orders");
            }

            return ListView.builder(
              scrollDirection: Axis.vertical,
              itemCount: provider.purchaseOrders.length,
              itemBuilder: (context, index) {
                return OrderCard(order: provider.purchaseOrders[index]);
              },
            );
          },
        ),
      ),
    );
  }
}