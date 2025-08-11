import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../../../../Provider/qbox_delivery_provider.dart';
import '../../../../../Widgets/Custom/app_colors.dart';

class ScanQBoxScreen extends StatelessWidget {
  static const String routeName = '/scan-delivery';

  const ScanQBoxScreen({super.key});
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        backgroundColor: AppColors.mintGreen,
        title: Text('Scan Qeu Box'),
        actions: [
          IconButton(
            icon: Icon(Icons.refresh),
            onPressed: () {
              // Refresh scanned items
              context.read<DeliveryProvider>().loadActiveDeliveries();
            },
          ),
        ],
      ),
      body: Consumer<DeliveryProvider>(
        builder: (context, provider, child) {
          if (provider.isLoading) {
            return Center(child: CircularProgressIndicator());
          }

          if (provider.error.isNotEmpty) {
            return Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Text(
                    provider.error,
                    style: TextStyle(color: Colors.red),
                  ),
                  ElevatedButton(
                    onPressed: () => provider.scanQBox(),
                    child: Text('Try Again'),
                  ),
                ],
              ),
            );
          }

          return Column(
            children: [
              Expanded(
                child: ListView.builder(
                  padding: EdgeInsets.all(16),
                  itemCount: provider.scannedItems.length,
                  itemBuilder: (context, index) {
                    final item = provider.scannedItems[index];
                    return Card(
                      child: ListTile(
                        title: Text(item.name),
                        subtitle: Text('Qeu Box ID: ${item.id}'),
                        trailing: Text(item.status),
                      ),
                    );
                  },
                ),
              ),
              Padding(
                padding: EdgeInsets.all(16),
                child: ElevatedButton(
                  onPressed: () => provider.scanQBox(),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AppColors.mintGreen,
                    minimumSize: Size(double.infinity, 48),
                  ),
                  child: Text('Scan Qeu Box'),
                ),
              ),
            ],
          );
        },
      ),
    );
  }
}
