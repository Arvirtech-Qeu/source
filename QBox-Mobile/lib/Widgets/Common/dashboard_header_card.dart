import 'package:flutter/material.dart';
import 'dart:math' as math;


class MetricsDashboardCard extends StatefulWidget {
  final int totalOrders;
  // final double totalRevenue;
  final int activeDeliveries;
  final VoidCallback onRefresh;

  const MetricsDashboardCard({
    Key? key,
    required this.totalOrders,
    // required this.totalRevenue,
    required this.activeDeliveries,
    required this.onRefresh,
  }) : super(key: key);

  @override
  State<MetricsDashboardCard> createState() => _MetricsDashboardCardState();
}

class _MetricsDashboardCardState extends State<MetricsDashboardCard>
    with TickerProviderStateMixin {
  late AnimationController _ordersController;
  late AnimationController _revenueController;
  late AnimationController _deliveriesController;
  late Animation<double> _ordersAnimation;
  late Animation<double> _revenueAnimation;
  late Animation<double> _deliveriesAnimation;

  @override
  void initState() {
    super.initState();
    _setupAnimations();
  }

  void _setupAnimations() {
    _ordersController = AnimationController(
      duration: const Duration(seconds: 2),
      vsync: this,
    );

    _revenueController = AnimationController(
      duration: const Duration(seconds: 2),
      vsync: this,
    );

    _deliveriesController = AnimationController(
      duration: const Duration(seconds: 2),
      vsync: this,
    );

    _ordersAnimation = Tween<double>(
      begin: 0,
      end: widget.totalOrders.toDouble(),
    ).animate(CurvedAnimation(
      parent: _ordersController,
      curve: Curves.easeOutCubic,
    ));

    _deliveriesAnimation = Tween<double>(
      begin: 0,
      end: widget.activeDeliveries.toDouble(),
    ).animate(CurvedAnimation(
      parent: _deliveriesController,
      curve: Curves.easeOutCubic,
    ));

    _startAnimations();
  }

  void _startAnimations() {
    _ordersController.forward(from: 0);
    _revenueController.forward(from: 0);
    _deliveriesController.forward(from: 0);
  }

  @override
  void dispose() {
    _ordersController.dispose();
    _revenueController.dispose();
    _deliveriesController.dispose();
    super.dispose();
  }


  @override
  Widget build(BuildContext context) {

    return Container(
      padding: const EdgeInsets.all(20),
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
      child: Column(
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Text(
                'Business Metrics',
                style: TextStyle(
                  fontSize: 20,
                  fontWeight: FontWeight.bold,
                ),
              ),
              IconButton(
                icon: const Icon(Icons.refresh),
                onPressed: () {
                  widget.onRefresh();
                  _startAnimations();
                },
              ),
            ],
          ),
          const SizedBox(height: 20),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceAround,
            children: [
              _buildMetricColumn(
                'Total Orders',
                _ordersAnimation,
                Icons.shopping_bag_rounded,
                Colors.red,
                    (value) => value.toInt().toString(),
              ),

              Container(
                height: 100,
                width: 1,
                color: Colors.grey.withOpacity(0.3),
              ),
              _buildMetricColumn(
                'Active Deliveries',
                _deliveriesAnimation,
                Icons.delivery_dining_rounded,
                Colors.orange,
                    (value) => value.toInt().toString(),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildMetricColumn(
      String title,
      Animation<double> animation,
      IconData icon,
      Color color,
      String Function(double) formatValue,
      ) {
    final isTablet = MediaQuery.of(context).size.shortestSide >= 600;
    return isTablet?Row(
      children: [
        Container(
          padding: const EdgeInsets.all(12),
          decoration: BoxDecoration(
            color: color.withOpacity(0.1),
            borderRadius: BorderRadius.circular(12),
          ),
          child: Icon(
            icon,
            color: color,
            size: 50,
          ),
        ),
        const SizedBox(width: 12),
        Column(
          children: [
            Text(
              title,
              style: const TextStyle(
                fontSize: 14,
                color: Colors.grey,
              ),
            ),
            const SizedBox(height: 8),
            AnimatedBuilder(
              animation: animation,
              builder: (context, child) {
                return Text(
                  formatValue(animation.value),
                  style: TextStyle(
                    fontSize: isTablet?24:14,
                    fontWeight: FontWeight.bold,
                    color: color,
                  ),
                );
              },
            ),
          ],
        ),
      ],
    ):Column(
      children: [
        Container(
          padding: const EdgeInsets.all(12),
          decoration: BoxDecoration(
            color: color.withOpacity(0.1),
            borderRadius: BorderRadius.circular(12),
          ),
          child: Icon(
            icon,
            color: color,
            size: 30,
          ),
        ),
        const SizedBox(height: 12),
        Text(
          title,
          style: const TextStyle(
            fontSize: 14,
            color: Colors.grey,
          ),
        ),
        const SizedBox(height: 8),
        AnimatedBuilder(
          animation: animation,
          builder: (context, child) {
            return Text(
              formatValue(animation.value),
              style: TextStyle(
                fontSize: isTablet?24:14,
                fontWeight: FontWeight.bold,
                color: color,
              ),
            );
          },
        ),
      ],
    );
  }
}