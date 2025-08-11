import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:qr_page/Widgets/Custom/app_colors.dart';

import '../Provider/network_provider.dart';

class NetworkWrapper extends StatelessWidget {
  final Widget child; // The page to display when online
  const NetworkWrapper({Key? key, required this.child}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Consumer<NetworkProvider>(
      builder: (context, networkProvider, _) {
        if (!networkProvider.isOnline) {
          return Scaffold(
            body: Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(Icons.wifi_off, size: 100, color: Colors.red),
                  const SizedBox(height: 20),
                  const Text(
                    'No Internet Connection',
                    style: TextStyle(fontSize: 18, color: Colors.black),
                  ),
                  const SizedBox(height: 10),
                  ElevatedButton(
                    style: ElevatedButton.styleFrom(
                      backgroundColor: AppColors.mintGreen
                    ),
                    onPressed: () {
                      networkProvider.checkInitialConnection();
                    },
                    child: const Text('Retry'),
                  ),
                ],
              ),
            ),
          );
        }
        // Render the main page when online
        return child;
      },
    );
  }
}
