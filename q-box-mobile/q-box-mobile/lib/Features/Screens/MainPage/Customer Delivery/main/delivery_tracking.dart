import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:go_router/go_router.dart';
import 'package:qr_page/Widgets/Custom/app_colors.dart';

import '../Common/delivery_status.dart';
import '../Common/scan_qbox_unload.dart';


class DeliveryTrackingScreen extends StatefulWidget {
  static const String routeName = '/delivery-management';
  const DeliveryTrackingScreen({super.key});

  @override
  _DeliveryTrackingScreenState createState() => _DeliveryTrackingScreenState();
}

class _DeliveryTrackingScreenState extends State<DeliveryTrackingScreen> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        automaticallyImplyLeading: false,
        title: Text('Delivery Management'),
        backgroundColor: Colors.white,
        foregroundColor: Colors.black,
        elevation: 0,
      ),
      body: SingleChildScrollView(
        child: Padding(
          padding: EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              _buildDeliveryStats(),
              SizedBox(height: 24),
              _buildQuickActions(),
              SizedBox(height: 24),
              _buildActiveDeliveries(),
              SizedBox(height: 24),
              _buildCustomerOrderSection(),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildCustomerOrderSection() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'Customer Orders',
          style: TextStyle(
            fontSize: 20,
            fontWeight: FontWeight.bold,
          ),
        ),
        SizedBox(height: 16),
        _buildCustomerOrderCard(
          orderId: '#1234',
          customerName: 'John Doe',
          phoneNumber: '+1 234-567-8900',
          orderDetails: 'Biriyani x2',
          specialInstructions: 'Please deliver to back entrance',
          expectedDeliveryTime: '12:30 PM',
          status: DeliveryStatus.readyForPickup,
        ),
        _buildCustomerOrderCard(
          orderId: '#1235',
          customerName: 'Jane Smith',
          phoneNumber: '+1 234-567-8901',
          orderDetails: 'Biriyani x1',
          specialInstructions: 'Call upon arrival',
          expectedDeliveryTime: '1:15 PM',
          status: DeliveryStatus.inTransit,
        ),
      ],
    );
  }

  Widget _buildCustomerOrderCard({
    required String orderId,
    required String customerName,
    required String phoneNumber,
    required String orderDetails,
    required String specialInstructions,
    required String expectedDeliveryTime,
    required DeliveryStatus status,
  }) {
    return Container(
      margin: EdgeInsets.only(bottom: 16),
      padding: EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: Colors.transparent),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.05),
            blurRadius: 10,
            offset: Offset(0, 5),
          ),
        ],
      ),
      child: ExpansionTile(
        title: Row(
          children: [
            Container(
              width: 48,
              height: 48,
              decoration: BoxDecoration(
                color: Colors.grey[100],
                borderRadius: BorderRadius.circular(8),
              ),
              child: Icon(Icons.person_outline, color: AppColors.black),
            ),
            SizedBox(width: 12),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    customerName,
                    style: TextStyle(
                        fontWeight: FontWeight.bold,
                        fontSize: 16,
                        color: AppColors.black),
                  ),
                  Text(
                    orderId,
                    style: TextStyle(
                      color: Colors.grey[600],
                      fontSize: 14,
                    ),
                  ),
                ],
              ),
            ),
            _buildStatusChip(status),
          ],
        ),
        children: [
          Padding(
            padding: EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                _buildInfoRow(Icons.phone, phoneNumber),
                SizedBox(height: 8),
                _buildInfoRow(Icons.shopping_bag, orderDetails),
                SizedBox(height: 8),
                _buildInfoRow(
                    Icons.access_time, 'Expected: $expectedDeliveryTime'),
                SizedBox(height: 8),
                _buildInfoRow(Icons.note, specialInstructions),
                SizedBox(height: 16),
                Row(
                  children: [
                    Expanded(
                      child: ElevatedButton.icon(
                        onPressed: () {},
                        icon: Icon(Icons.call),
                        label: Text('Call Customer'),
                        style: ElevatedButton.styleFrom(
                          backgroundColor: AppColors.mintGreen,
                          foregroundColor: Colors.white,
                        ),
                      ),
                    ),
                    SizedBox(width: 12),
                    Expanded(
                      child: OutlinedButton.icon(
                        onPressed: () {},
                        icon: Icon(Icons.message),
                        label: Text('Message'),
                        style: ElevatedButton.styleFrom(
                          backgroundColor: Colors.transparent,
                          foregroundColor: AppColors.black,
                        ),
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
        ],
      ),
    ).animate().fadeIn(duration: 800.ms).slideY(begin: 0.2, end: 0);
  }

  Widget _buildInfoRow(IconData icon, String text) {
    return Row(
      children: [
        Icon(icon, size: 16, color: Colors.grey[600]),
        SizedBox(width: 8),
        Expanded(
          child: Text(
            text,
            style: TextStyle(
              color: Colors.grey[800],
              fontSize: 14,
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildDeliveryStats() {
    return Container(
      padding: EdgeInsets.all(24),
      decoration: BoxDecoration(
        color: AppColors.mintGreen,
        borderRadius: BorderRadius.circular(24),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Icon(Icons.delivery_dining, color: Colors.white, size: 32),
              SizedBox(width: 16),
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Today\'s Deliveries',
                    style: TextStyle(
                      color: Colors.white,
                      fontSize: 20,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  Text(
                    'Last updated: 5:44 AM',
                    style: TextStyle(
                      color: Colors.white.withOpacity(0.8),
                      fontSize: 12,
                    ),
                  ),
                ],
              ),
            ],
          ),
          SizedBox(height: 24),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceAround,
            children: [
              _buildStatItem('Pending', '5'),
              _buildVerticalDivider(),
              _buildStatItem('In Progress', '3'),
              _buildVerticalDivider(),
              _buildStatItem('Completed', '12'),
            ],
          ),
        ],
      ),
    ).animate().fadeIn(duration: 800.ms).slideY(begin: -0.2, end: 0);
  }

  Widget _buildQuickActions() {
    final isTablet = MediaQuery.of(context).size.shortestSide >= 600;
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'Quick Actions',
          style: TextStyle(
            fontSize: 20,
            fontWeight: FontWeight.bold,
          ),
        ),
        SizedBox(height: 16),
        if (isTablet)
          Row(
            children: [
              Expanded(
                child: _buildActionCard(
                    'Scan Qeu Box',
                    'Load/Unload items',
                    Icons.qr_code_scanner,
                    Colors.blue,
                    () => GoRouter.of(context).push(ScanQBoxScreen.routeName)),
              ),
              SizedBox(width: 16),
              Expanded(
                child: _buildActionCard(
                  'Delivery Status',
                  'Update order status',
                  Icons.local_shipping,
                  Colors.green,
                  () =>
                      GoRouter.of(context).push(DeliveryStatusScreen.routeName),
                ),
              ),
            ],
          )
        else
          Column(children: [
            _buildActionCard(
                'Scan Qeu Box',
                'Load/Unload items',
                Icons.qr_code_scanner,
                Colors.blue,
                () => GoRouter.of(context).push(ScanQBoxScreen.routeName)),
            SizedBox(height: 16),
            _buildActionCard(
              'Delivery Status',
              'Update order status',
              Icons.local_shipping,
              Colors.green,
              () => GoRouter.of(context).push(DeliveryStatusScreen.routeName),
            ),
          ]),
        SizedBox(height: 16),
        if (isTablet)
        Row(
          children: [
            Expanded(
              child: _buildActionCard(
                'Customer Support',
                'Handle issues',
                Icons.support_agent,
                Colors.orange,
                () {},
              ),
            ),
            SizedBox(width: 16),
            Expanded(
              child: _buildActionCard(
                'Route Planning',
                'Optimize deliveries',
                Icons.map,
                Colors.purple,
                () {},
              ),
            ),
          ],
        )
        else
          Column(
            children: [
              _buildActionCard(
                'Customer Support',
                'Handle issues',
                Icons.support_agent,
                Colors.orange,
                    () {},
              ),
              SizedBox(height: 16),
              _buildActionCard(
                'Route Planning',
                'Optimize deliveries',
                Icons.map,
                Colors.purple,
                    () {},
              ),
            ],
          )
      ],
    );
  }

  Widget _buildScanSection() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'Quick Actions',
          style: TextStyle(
            fontSize: 20,
            fontWeight: FontWeight.bold,
          ),
        ),
        SizedBox(height: 16),
        Row(
          children: [
            Expanded(
              child: _buildActionCard(
                'Scan Qeu Box',
                'Unload food items',
                Icons.qr_code_scanner,
                Colors.blue,
                () {},
              ),
            ),
            SizedBox(width: 16),
            Expanded(
              child: _buildActionCard(
                'Delivery Status',
                'Update order status',
                Icons.local_shipping,
                Colors.green,
                () {},
              ),
            ),
          ],
        ),
      ],
    );
  }

  Widget _buildActionCard(String title, String subtitle, IconData icon,
      Color color, VoidCallback onTap) {
    return Container(
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        boxShadow: [
          BoxShadow(
            color: color.withOpacity(0.1),
            blurRadius: 10,
            offset: Offset(0, 5),
          ),
        ],
      ),
      child: Material(
        color: Colors.transparent,
        child: InkWell(
          onTap: onTap,
          borderRadius: BorderRadius.circular(16),
          child: Padding(
            padding: EdgeInsets.all(24),
            child: Column(
              children: [
                Row(
                  children: [
                    Container(
                      padding: EdgeInsets.all(8),
                      decoration: BoxDecoration(
                        color: color.withOpacity(0.1),
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: Icon(icon, color: color),
                    ),
                    SizedBox(width: 20),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            title,
                            style: TextStyle(
                              fontWeight: FontWeight.bold,
                              fontSize: 16,
                            ),
                          ),
                          SizedBox(height: 4),
                          Text(
                            subtitle,
                            style: TextStyle(
                              color: Colors.grey[600],
                              fontSize: 12,
                            ),
                          ),
                        ],
                      ),
                    ),
                    Container(
                      padding: EdgeInsets.all(12),
                      decoration: BoxDecoration(
                        color: color.withOpacity(0.1),
                        shape: BoxShape.circle,
                      ),
                      child: Icon(
                        Icons.arrow_forward_rounded,
                        color: color,
                      ),
                    ),
                  ],
                )
              ],
            ),
          ),
        ),
      ),
    ).animate().fadeIn(duration: 600.ms).slideX(begin: -0.2, end: 0);
  }

  Widget _buildActiveDeliveries() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'Active Deliveries',
          style: TextStyle(
            fontSize: 20,
            fontWeight: FontWeight.bold,
          ),
        ),
        SizedBox(height: 16),
        _buildDeliveryCard(
          'Order #1234',
          'Biriyani',
          'Qeu Box: 3',
          '123 Main St',
          DeliveryStatus.readyForPickup,
        ),
        _buildDeliveryCard(
          'Order #1235',
          'Biriyani',
          'Qeu Box: 4',
          '456 Oak Ave',
          DeliveryStatus.inTransit,
        ),
      ],
    );
  }

  Widget _buildDeliveryCard(String orderId, String item, String qbox,
      String address, DeliveryStatus status) {
    return Container(
      margin: EdgeInsets.only(bottom: 16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.05),
            blurRadius: 10,
            offset: Offset(0, 5),
          ),
        ],
      ),
      child: Padding(
        padding: EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  orderId,
                  style: TextStyle(
                    fontWeight: FontWeight.bold,
                    fontSize: 16,
                  ),
                ),
                _buildStatusChip(status),
              ],
            ),
            SizedBox(height: 12),
            Row(
              children: [
                Container(
                  width: 60,
                  height: 60,
                  decoration: BoxDecoration(
                    borderRadius: BorderRadius.circular(12),
                    image: DecorationImage(
                      image: AssetImage('assets/food.jpeg'),
                      fit: BoxFit.cover,
                    ),
                  ),
                ),
                SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(item),
                      Text(qbox, style: TextStyle(color: Colors.grey[600])),
                      Text(address, style: TextStyle(color: Colors.grey[600])),
                    ],
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    ).animate().fadeIn(duration: 800.ms).slideY(begin: 0.2, end: 0);
  }

  Widget _buildStatusChip(DeliveryStatus status) {
    Color color;
    String text;

    switch (status) {
      case DeliveryStatus.readyForPickup:
        color = Colors.blue;
        text = 'Ready for Pickup';
        break;
      case DeliveryStatus.inTransit:
        color = Colors.orange;
        text = 'In Transit';
        break;
      case DeliveryStatus.delivered:
        color = Colors.green;
        text = 'Delivered';
        break;
    }

    return Container(
      padding: EdgeInsets.symmetric(horizontal: 12, vertical: 6),
      decoration: BoxDecoration(
        color: color.withOpacity(0.1),
        borderRadius: BorderRadius.circular(20),
      ),
      child: Text(
        text,
        style: TextStyle(
          color: color,
          fontSize: 12,
          fontWeight: FontWeight.bold,
        ),
      ),
    );
  }

  Widget _buildStatItem(String label, String value) {
    return Column(
      children: [
        Text(
          value,
          style: TextStyle(
            color: Colors.white,
            fontSize: 24,
            fontWeight: FontWeight.bold,
          ),
        ),
        SizedBox(height: 4),
        Text(
          label,
          style: TextStyle(
            color: Colors.white.withOpacity(0.8),
            fontSize: 12,
          ),
        ),
      ],
    );
  }

  Widget _buildVerticalDivider() {
    return Container(
      height: 40,
      width: 1,
      color: Colors.white.withOpacity(0.2),
    );
  }
}

enum DeliveryStatus {
  readyForPickup,
  inTransit,
  delivered,
}
