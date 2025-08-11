import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:qr_page/Widgets/Custom/app_colors.dart';

import '../../../../../Model/Data_Models/qbox_delivery_model/qbox_delivery_model.dart';
import '../../../../../Provider/qbox_delivery_provider.dart';

class DeliveryStatusScreen extends StatelessWidget {
  static const String routeName = '/delivery-status';
  const DeliveryStatusScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('Delivery Status'),backgroundColor: AppColors.mintGreen,),
      body: Consumer<DeliveryProvider>(
        builder: (context, provider, child) {
          if (provider.isLoading) {
            return Center(child: CircularProgressIndicator());
          }
          return ListView.builder(
            padding: EdgeInsets.all(16),
            itemCount: provider.activeDeliveries.length,
            itemBuilder: (context, index) {
              final delivery = provider.activeDeliveries[index];
              return Card(
                child: ListTile(
                  title: Text(delivery.orderId,style: TextStyle(color: AppColors.black),),
                  subtitle: Text(delivery.address,style: TextStyle(color: AppColors.black),),
                  trailing: DropdownButton<DeliveryStatus>(
                    value: delivery.status,
                    onChanged: (newStatus) {
                      if (newStatus != null) {
                        provider.updateDeliveryStatus(
                          delivery.orderId,
                          newStatus,
                        );
                      }
                    },
                    items: DeliveryStatus.values.map((status) {
                      return DropdownMenuItem(
                        value: status,
                        child: Text(status.toString().split('.').last,style: TextStyle(color: AppColors.black),),
                      );
                    }).toList(),
                  ),
                ),
              );
            },
          );
        },
      ),
    );
  }
}