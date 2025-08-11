import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:qr_page/Features/Screens/MainPage/Order/Inward%20Order/qr_scanner_screen.dart';
import 'package:qr_page/Utils/network_error.dart';
import '../../../../../Provider/order_qr_scanning_provider.dart';

class InwardOrder extends StatefulWidget {
  static const String routeName = '/order-scanner';
  const InwardOrder({super.key});

  @override
  State<InwardOrder> createState() => _InwardOrderState();
}

class _InwardOrderState extends State<InwardOrder> with TickerProviderStateMixin {
  @override
  void initState() {
    super.initState();
  }

  @override
  void dispose() {
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return NetworkWrapper(
      child: ChangeNotifierProvider(
        create: (_) => OrderScanningProvider(),
        child: Consumer<OrderScanningProvider>(
          builder: (context, provider, child) => Scaffold(
            appBar: AppBar(
              elevation: 0,
              automaticallyImplyLeading: false,
              backgroundColor: Colors.transparent,
              title: Text('Order Scanner', style: TextStyle(color: Colors.black)),
            ),
            body: OrderQRScannerScreen(),
          ),
        ),
      ),
    );
  }
}
